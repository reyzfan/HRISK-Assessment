import { NextResponse } from "next/server";
import { ZodError } from "zod";

type ApiError = {
  error: string;
  details?: unknown;
};

/**
 * Canonical error handler for API routes.
 * - ZodError → 400 with validation details
 * - Known Error → 500 with user-safe message (dev context logged)
 * - Unknown → 500 generic
 */
export function handleError(error: unknown): NextResponse<ApiError> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: error.flatten() },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    console.error("[API Error]", error.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "Unexpected error" },
    { status: 500 }
  );
}
