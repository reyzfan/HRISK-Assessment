import { NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { createCampaign, createCampaignSchema } from "@/lib/db/campaigns";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const input = createCampaignSchema.parse(body);
    const campaign = await createCampaign(input);

    return NextResponse.json({ campaign });
  } catch (error) {
    return handleError(error);
  }
}
