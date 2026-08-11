import { NextResponse } from "next/server";
import { recordEmailReport } from "@/lib/tracking/service";
import { isValidTrackingToken } from "@/lib/tracking/token";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("t");

  if (!isValidTrackingToken(token)) {
    return NextResponse.redirect(new URL("/reported/invalid", origin));
  }

  await recordEmailReport(token);

  return NextResponse.redirect(new URL(`/reported/${token}`, origin));
}
