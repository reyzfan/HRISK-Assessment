import { prisma } from "@/lib/db/prisma";
import { calculateRiskScore } from "@/lib/risk-score/calculate";

export async function getCampaignResultByToken(token: string) {
  return prisma.campaignResult.findUnique({
    where: { token },
    include: {
      campaign: { include: { emailTemplate: true } },
      target: true,
    },
  });
}

export async function recordEmailOpen(token: string) {
  const result = await getCampaignResultByToken(token);
  if (!result) return null;

  if (result.emailOpenedAt) return result;

  return prisma.campaignResult.update({
    where: { token },
    data: { emailOpenedAt: new Date() },
    include: {
      campaign: { include: { emailTemplate: true } },
      target: true,
    },
  });
}

export async function recordLinkClick(token: string) {
  const result = await getCampaignResultByToken(token);
  if (!result) return null;

  const updatedResult = await prisma.campaignResult.update({
    where: { token },
    data: {
      linkClickedAt: result.linkClickedAt ?? new Date(),
    },
    include: {
      campaign: { include: { emailTemplate: true } },
      target: true,
    },
  });

  await updateTargetRiskScore(token);

  return updatedResult;
}

export async function recordEmailReport(token: string) {
  const result = await getCampaignResultByToken(token);
  if (!result) return null;

  const updatedResult = await prisma.campaignResult.update({
    where: { token },
    data: {
      reportedAt: result.reportedAt ?? new Date(),
    },
    include: {
      campaign: { include: { emailTemplate: true } },
      target: true,
    },
  });

  await updateTargetRiskScore(token);

  return updatedResult;
}

export async function completeTraining(token: string, quizScore: number) {
  const result = await getCampaignResultByToken(token);
  if (!result) return null;

  const updatedResult = await prisma.campaignResult.update({
    where: { token },
    data: {
      trainingCompletedAt: new Date(),
      quizScore,
    },
    include: {
      campaign: { include: { emailTemplate: true } },
      target: true,
    },
  });

  await updateTargetRiskScore(token);

  return updatedResult;
}

export async function updateTargetRiskScore(token: string) {
  const result = await getCampaignResultByToken(token);
  if (!result) return null;

  const quizPassed = typeof result.quizScore === "number" && result.quizScore >= 2;
  const riskScore = calculateRiskScore({
    clickedLink: Boolean(result.linkClickedAt),
    submittedData: Boolean(result.dataSubmittedAt),
    reportedEmail: Boolean(result.reportedAt),
    completedTraining: Boolean(result.trainingCompletedAt),
    quizPassed,
  });

  const riskScoreDelta = riskScore - 50;

  await prisma.campaignResult.update({
    where: { token },
    data: { riskScoreDelta },
  });

  return prisma.target.update({
    where: { id: result.targetId },
    data: { riskScore },
  });
}
