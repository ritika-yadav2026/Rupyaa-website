/**
 * Encrypted GET User API – uses shared api-encryption for AES-128-GCM.
 * Test endpoint with encrypted payload in path.
 */

import { decryptResponse, encryptPayload } from "./api-encryption";
import {
  buildAbsoluteApiUrl,
  shouldUseNgrokHeader,
} from "./api-config";
import { API_ENDPOINTS, endpointPath, resolveEndpoint } from "./api-endpoints";
import { getCommonHeaders } from "./api";

export interface GetUserResponse {
  Id: number;
  name?: string;
  age?: number;
  city?: string;
}

export interface DecryptedSuccess {
  success: true;
  data: GetUserResponse;
}

export interface DecryptedError {
  success: false;
  message: string;
}

type DecryptedResponse = DecryptedSuccess | DecryptedError;

/** Re-export for backward compatibility. */
export { encryptPayload };

/** Decrypts get-user API response. */
async function decryptGetUserResponse(
  responseBody: { data?: string }
): Promise<DecryptedResponse> {
  return decryptResponse<DecryptedResponse>(responseBody);
}

/**
 * Builds the API URL using API_BASE_URL.
 */
function buildGetUserUrl(encryptedPayload: string): string {
  const path = resolveEndpoint(
    API_ENDPOINTS.test.getEncryptedUserById,
    { encryptedPayload }
  );
  return buildAbsoluteApiUrl(endpointPath(path));
}

/**
 * Fetches user by ID. Encrypts request, decrypts response.
 * Returns user data on success, null on 404, throws on other errors.
 */
export async function getUserById(
  userId: string
): Promise<GetUserResponse | null> {
  const encryptedPayload = await encryptPayload({ userId });
  const url = buildGetUserUrl(encryptedPayload);
  const headers: Record<string, string> = getCommonHeaders();
  if (shouldUseNgrokHeader()) {
    headers["ngrok-skip-browser-warning"] = "true";
  }
  const response = await fetch(url, { method: "GET", headers, cache: "no-store" });
  const json = (await response.json()) as { data?: string };
  if (response.status === 400) {
    throw new Error("Invalid or missing payload");
  }
  if (response.status === 404) {
    return null;
  }
  if (response.status === 500) {
    throw new Error("Server error");
  }
  if (!response.ok) {
    throw new Error(response.statusText || "Request failed");
  }
  const decrypted = await decryptGetUserResponse(json);
  if (!decrypted.success) {
    return null;
  }
  return decrypted.data;
}
