import { NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { createTarget, targetInputSchema } from "@/lib/db/targets";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const input = targetInputSchema.parse(body);
    const target = await createTarget(input);

    return NextResponse.json({ target });
  } catch (error) {
    return handleError(error);
  }
}
