import { NextResponse } from "next/server";
import { recordEmailOpen } from "@/lib/tracking/service";
import { isValidTrackingToken } from "@/lib/tracking/token";

const transparentPixel = Buffer.from(
  "R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
  "base64"
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("t");

  if (isValidTrackingToken(token)) {
    await recordEmailOpen(token);
  }

  return new NextResponse(transparentPixel, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}
