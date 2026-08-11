import { NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { saveEmailTemplate, saveEmailTemplateSchema } from "@/lib/db/email-templates";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const input = saveEmailTemplateSchema.parse(body);
    const template = await saveEmailTemplate(input);

    return NextResponse.json({ template });
  } catch (error) {
    return handleError(error);
  }
}
