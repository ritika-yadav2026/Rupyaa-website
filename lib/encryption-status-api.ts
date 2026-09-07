import {
  buildAbsoluteApiUrl,
  shouldUseNgrokHeader,
} from "./api-config";
import { API_ENDPOINTS, endpointPath } from "./api-endpoints";
import { getCommonHeaders } from "./api";

/**
 * Fetches encryption status from the backend.
 * The endpoint is always plain JSON and excluded from encryption.
 */

const ENCRYPTION_STATUS_PATH = endpointPath(API_ENDPOINTS.external.encryptionStatus);
const FALLBACK_PATH = "/api/encryption-fallback";

export type EncryptionStatusResponse = {
  success: boolean;
  enableEncryption: boolean;
};

/**
 * Fetches encryption fallback from our Next.js API route.
 * Reads API_ENCRYPTION_ENABLED at runtime (not build time).
 */
export async function fetchEncryptionFallback(): Promise<boolean> {
  const base = window.location.origin;
  const url = new URL(FALLBACK_PATH, base).toString();
  const res = await fetch(url, { method: "GET", cache: "no-store" });
  const json = (await res.json()) as EncryptionStatusResponse;
  if (!json.success) {
    return false;
  }
  return json.enableEncryption === true;
}

/**
 * Fetches whether the backend has encryption enabled (direct request to NEXT_PUBLIC_API_URL).
 * @returns true if encryption is enabled, false otherwise
 * @throws On network error or when success is false in response
 */
export async function fetchEncryptionStatus(): Promise<boolean> {
  const url = buildAbsoluteApiUrl(ENCRYPTION_STATUS_PATH);
  const headers: Record<string, string> = {
    ...getCommonHeaders(),
  };
  if (shouldUseNgrokHeader()) {
    headers["ngrok-skip-browser-warning"] = "true";
  }
  const res = await fetch(url, { method: "GET", headers, cache: "no-store" });
  const json = (await res.json()) as EncryptionStatusResponse;
  if (!json.success) {
    throw new Error("Failed to fetch encryption status");
  }
  return json.enableEncryption === true;
}
