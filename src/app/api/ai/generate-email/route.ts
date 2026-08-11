import { NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { generateAiText } from "@/lib/ai/client";
import {
  buildPhishingEmailPrompt,
  generateEmailRequestSchema,
  parseGeneratedEmail,
} from "@/lib/ai/email-generator";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const input = generateEmailRequestSchema.parse(body);
    const prompt = buildPhishingEmailPrompt(input);
    const aiResponse = await generateAiText(prompt);
    const email = parseGeneratedEmail(aiResponse.text);

    return NextResponse.json({
      email,
      provider: aiResponse.provider,
    });
  } catch (error) {
    return handleError(error);
  }
}
