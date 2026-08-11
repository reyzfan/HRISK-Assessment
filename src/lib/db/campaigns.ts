import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { generateTrackingToken } from "@/lib/tracking/token";

export const createCampaignSchema = z.object({
  name: z.string().min(3).max(140),
  scenario: z.string().min(3).max(140),
  templateId: z.string().min(1),
  targetIds: z.array(z.string().min(1)).min(1, "Select at least one target."),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;

async function getOrCreateDemoAdmin() {
  return prisma.user.upsert({
    where: { email: "admin@humanrisk.local" },
    update: {},
    create: {
      email: "admin@humanrisk.local",
      name: "Demo Admin",
      role: "admin",
    },
  });
}

export async function createCampaign(input: CreateCampaignInput) {
  const data = createCampaignSchema.parse(input);
  const [admin, template, targets] = await Promise.all([
    getOrCreateDemoAdmin(),
    prisma.emailTemplate.findUnique({ where: { id: data.templateId } }),
    prisma.target.findMany({ where: { id: { in: data.targetIds } } }),
  ]);

  if (!template) throw new Error("Template not found.");
  if (targets.length !== data.targetIds.length) throw new Error("One or more targets were not found.");

  return prisma.$transaction(async (tx) => {
    const campaign = await tx.campaign.create({
      data: {
        name: data.name,
        scenario: data.scenario,
        status: "draft",
        createdById: admin.id,
      },
    });

    await tx.emailTemplate.create({
      data: {
        name: `${template.name} (${campaign.name})`,
        subject: template.subject,
        htmlBody: template.htmlBody,
        senderName: template.senderName,
        scenarioType: template.scenarioType,
        isAiGenerated: template.isAiGenerated,
        campaignId: campaign.id,
      },
    });

    await tx.campaignResult.createMany({
      data: targets.map((target) => ({
        campaignId: campaign.id,
        targetId: target.id,
        token: generateTrackingToken(),
      })),
    });

    return tx.campaign.findUnique({
      where: { id: campaign.id },
      include: {
        emailTemplate: true,
        campaignResults: { include: { target: true } },
      },
    });
  });
}
