import { prisma } from "@/lib/db/prisma";
import { generatedEmailSchema } from "@/lib/ai/email-generator";
import { z } from "zod";

export const saveEmailTemplateSchema = generatedEmailSchema.extend({
  name: z.string().min(2).max(120),
});

export type SaveEmailTemplateInput = z.infer<typeof saveEmailTemplateSchema>;

export async function saveEmailTemplate(input: SaveEmailTemplateInput) {
  const data = saveEmailTemplateSchema.parse(input);

  return prisma.emailTemplate.create({
    data: {
      name: data.name,
      subject: data.subject,
      htmlBody: data.htmlBody,
      senderName: data.senderName,
      scenarioType: data.scenarioType,
      isAiGenerated: true,
    },
  });
}
