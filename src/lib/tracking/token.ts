import crypto from "crypto";

/**
 * Generate a unique, unguessable tracking token for a campaign target.
 * Uses crypto.randomBytes for cryptographic strength.
 */
export function generateTrackingToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Validate token shape before touching the database.
 * Tokens are 32 random bytes encoded as 64 lowercase hex characters.
 */
export function isValidTrackingToken(token: string | null): token is string {
  return Boolean(token && /^[a-f0-9]{64}$/.test(token));
}

/**
 * Build the tracking pixel URL for email open tracking.
 */
export function buildTrackingPixelUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl}/api/track/open?t=${token}`;
}

/**
 * Build the tracking click URL for link click tracking.
 * This redirects to the training page after recording the click.
 */
export function buildTrackingClickUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl}/api/track/click?t=${token}`;
}

/**
 * Build the phishing report URL for employees who identify the simulation.
 */
export function buildTrackingReportUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl}/api/track/report?t=${token}`;
}

/**
 * Generate the HTML for the 1x1 tracking pixel embedded in emails.
 */
export function generateTrackingPixelHtml(token: string): string {
  const url = buildTrackingPixelUrl(token);
  return `<img src="${url}" width="1" height="1" alt="" style="display:none;" />`;
}
