import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

export const targetInputSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  department: z.string().min(2).max(80),
  position: z.string().max(80).optional().or(z.literal("")),
});

export type TargetInput = z.infer<typeof targetInputSchema>;

export async function createTarget(input: TargetInput) {
  const data = targetInputSchema.parse(input);

  return prisma.target.create({
    data: {
      name: data.name,
      email: data.email,
      department: data.department,
      position: data.position || null,
    },
  });
}

export async function updateTarget(id: string, input: TargetInput) {
  const data = targetInputSchema.parse(input);

  return prisma.target.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      department: data.department,
      position: data.position || null,
    },
  });
}

export async function resetTargetRisk(id: string) {
  return prisma.target.update({
    where: { id },
    data: { riskScore: 50 },
  });
}
