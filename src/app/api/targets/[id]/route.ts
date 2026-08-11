import { NextResponse } from "next/server";
import { z } from "zod";
import { handleError } from "@/lib/api-error";
import { resetTargetRisk, targetInputSchema, updateTarget } from "@/lib/db/targets";

const patchSchema = z.discriminatedUnion("action", [
  targetInputSchema.extend({ action: z.literal("update") }),
  z.object({ action: z.literal("reset-risk") }),
]);

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body: unknown = await request.json();
    const input = patchSchema.parse(body);

    if (input.action === "reset-risk") {
      const target = await resetTargetRisk(params.id);
      return NextResponse.json({ target });
    }

    const target = await updateTarget(params.id, input);
    return NextResponse.json({ target });
  } catch (error) {
    return handleError(error);
  }
}
