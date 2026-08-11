/**
 * Human Risk Score calculation logic.
 *
 * Algorithm:
 * - Base Score = 50
 * - Clicked phishing link = +20 points
 * - Submitted data = +25 points
 * - Reported phishing email = -20 points
 * - Completed training quiz = -15 points
 * - Quiz passed = -10 points
 * - Score clamped between 0-100
 *
 * Risk levels:
 * - Green (Low): 0-30
 * - Yellow (Medium): 31-60
 * - Red (High): 61-100
 */

export const RISK_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type RiskLevel = (typeof RISK_LEVELS)[keyof typeof RISK_LEVELS];

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return RISK_LEVELS.LOW;
  if (score <= 60) return RISK_LEVELS.MEDIUM;
  return RISK_LEVELS.HIGH;
}

export function getRiskColor(score: number): string {
  if (score <= 30) return "text-green-500";
  if (score <= 60) return "text-yellow-500";
  return "text-red-500";
}

export function getRiskBgColor(score: number): string {
  if (score <= 30) return "bg-green-500/10 text-green-500";
  if (score <= 60) return "bg-yellow-500/10 text-yellow-500";
  return "bg-red-500/10 text-red-500";
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, score));
}

export interface RiskScoreEvents {
  clickedLink: boolean;
  submittedData: boolean;
  reportedEmail: boolean;
  completedTraining: boolean;
  quizPassed: boolean;
}

export function calculateRiskScore(events: RiskScoreEvents, baseScore = 50): number {
  let score = baseScore;

  if (events.clickedLink) score += 20;
  if (events.submittedData) score += 25;
  if (events.reportedEmail) score -= 20;
  if (events.completedTraining) score -= 15;
  if (events.quizPassed) score -= 10;

  return clampScore(score);
}

export function calculateRiskScoreDelta(events: RiskScoreEvents): number {
  const base = calculateRiskScore({ clickedLink: false, submittedData: false, reportedEmail: false, completedTraining: false, quizPassed: false });
  const updated = calculateRiskScore(events);
  return updated - base;
}
