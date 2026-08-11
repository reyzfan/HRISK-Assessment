import { NextResponse } from "next/server";
import { recordLinkClick } from "@/lib/tracking/service";
import { isValidTrackingToken } from "@/lib/tracking/token";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("t");

  if (!isValidTrackingToken(token)) {
    return NextResponse.redirect(new URL("/training/invalid", origin));
  }

  await recordLinkClick(token);

  return NextResponse.redirect(new URL(`/training/${token}`, origin));
}
