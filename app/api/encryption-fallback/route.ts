import { NextResponse } from "next/server";

/**
 * Returns encryption fallback config. Reads API_ENCRYPTION_ENABLED at runtime
 * (not build time). Used when the backend encryption status fetch fails.
 */
export async function GET() {
  const v = process.env.API_ENCRYPTION_ENABLED;
  const enableEncryption = v === "true" || v === "1";
  return NextResponse.json({ success: true, enableEncryption });
}
