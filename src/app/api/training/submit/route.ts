import { NextResponse } from "next/server";
import { z } from "zod";
import { handleError } from "@/lib/api-error";
import { prisma } from "@/lib/db/prisma";
import { completeTraining } from "@/lib/tracking/service";

const submitTrainingSchema = z.object({
  token: z.string().min(10),
  answers: z.record(z.string(), z.number().int().min(0).max(3)),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const input = submitTrainingSchema.parse(body);

    const result = await prisma.campaignResult.findUnique({
      where: { token: input.token },
      include: { campaign: { include: { emailTemplate: true } } },
    });

    if (!result) {
      return NextResponse.json({ error: "Invalid training token." }, { status: 404 });
    }

    const scenarioType = result.campaign.emailTemplate?.scenarioType ?? result.campaign.scenario;
    const questions = await prisma.trainingQuiz.findMany({
      where: { scenarioType },
      orderBy: { createdAt: "asc" },
    });

    let score = 0;
    for (const question of questions) {
      if (input.answers[question.id] === question.correctAnswer) {
        score += 1;
      }
    }

    await completeTraining(input.token, score);

    return NextResponse.json({ score, total: questions.length });
  } catch (error) {
    return handleError(error);
  }
}
