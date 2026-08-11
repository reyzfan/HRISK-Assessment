import { z } from "zod";

export const generateEmailRequestSchema = z.object({
  scenario: z.string().min(3, "Scenario must be at least 3 characters").max(120),
  urgency: z.enum(["low", "medium", "high"]),
  department: z.string().min(2, "Department is required").max(80),
});

export type GenerateEmailRequest = z.infer<typeof generateEmailRequestSchema>;

export const generatedEmailSchema = z.object({
  subject: z.string().min(3),
  senderName: z.string().min(2),
  htmlBody: z.string().min(20),
  scenarioType: z.string().min(2),
});

export type GeneratedEmail = z.infer<typeof generatedEmailSchema>;

export function buildPhishingEmailPrompt(input: GenerateEmailRequest): string {
  return `You are generating a safe phishing simulation email for internal security awareness training.
Do not include real employee names, real email addresses, passwords, malware, credential collection instructions, or links.

Return ONLY valid JSON with this exact shape:
{
  "subject": "string",
  "senderName": "string",
  "htmlBody": "string containing safe HTML email body",
  "scenarioType": "string"
}

Campaign scenario: ${input.scenario}
Urgency level: ${input.urgency}
Target department: ${input.department}

Requirements:
- Write in Bahasa Indonesia.
- Make it realistic but clearly safe for simulation.
- Use simple HTML tags only: p, strong, ul, li, a, br.
- Use a placeholder call-to-action link: {{TRACKING_LINK}}.
- Do not include the report link yourself; the system appends {{REPORT_LINK}} separately.
- Do not ask for passwords or sensitive personal information.
- Keep the email concise and professional.`;
}

export function parseGeneratedEmail(rawText: string): GeneratedEmail {
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI response did not contain valid JSON.");
  }

  const parsed: unknown = JSON.parse(jsonMatch[0]);
  return generatedEmailSchema.parse(parsed);
}
