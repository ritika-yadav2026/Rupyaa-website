/**
 * API encryption/decryption layer – AES-128-GCM.
 * Encryption status is fetched from GET /api/v1/external/encryption.
 * Falls back to GET /api/encryption-fallback (reads API_ENCRYPTION_ENABLED at runtime) if fetch fails.
 * Uses Web Crypto API (browser).
 */

import {
  fetchEncryptionFallback,
  fetchEncryptionStatus,
} from "./encryption-status-api";

const ALGORITHM = "AES-GCM";
const IV_LENGTH = 12;
const TAG_LENGTH = 128;
const KEY_LENGTH = 128;

const SECRET =
  process.env.NEXT_PUBLIC_ENCRYPTION_SECRET ??
  process.env.NEXT_PUBLIC_API_ENCRYPTION_SECRET ??
  process.env.NEXT_PUBLIC_TEST_ENCRYPTION_SECRET ??
  "test-encryption-secret-key-32bytes!!";

let cachedEncryptionEnabled: boolean | null = null;
let encryptionStatusPromise: Promise<boolean> | null = null;

/**
 * Fetches encryption status from the backend and caches it.
 * On first call, fetches from GET /api/v1/external/encryption.
 * Falls back to GET /api/encryption-fallback (runtime env) if fetch fails.
 */
export async function getEncryptionEnabled(): Promise<boolean> {
  if (cachedEncryptionEnabled !== null) {
    return cachedEncryptionEnabled;
  }
  if (encryptionStatusPromise) {
    return encryptionStatusPromise;
  }
  encryptionStatusPromise = (async () => {
    try {
      const enabled = await fetchEncryptionStatus();
      cachedEncryptionEnabled = enabled;
      return enabled;
    } catch {
      if (typeof window === "undefined") {
        const v = process.env.API_ENCRYPTION_ENABLED;
        cachedEncryptionEnabled = v === "true" || v === "1";
      } else {
        try {
          cachedEncryptionEnabled = await fetchEncryptionFallback();
        } catch {
          cachedEncryptionEnabled = false;
        }
      }
      return cachedEncryptionEnabled;
    }
  })();
  return encryptionStatusPromise;
}

/**
 * @deprecated Use getEncryptionEnabled() for async. Sync version reads cache only.
 */
export function isEncryptionEnabled(): boolean {
  if (cachedEncryptionEnabled !== null) {
    return cachedEncryptionEnabled;
  }
  return false;
}

async function getEncryptionKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const keyMaterial = new Uint8Array(hash).subarray(0, 16);
  return crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

let cachedKey: CryptoKey | null = null;

async function getKey(): Promise<CryptoKey> {
  if (!cachedKey) {
    cachedKey = await getEncryptionKey(SECRET);
  }
  return cachedKey;
}

/**
 * Encrypts a JSON-serializable payload. Returns base64(iv + ciphertext + tag).
 */
export async function encryptPayload(payload: unknown): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const plainText =
    typeof payload === "string" ? payload : JSON.stringify(payload ?? {});
  const encoded = new TextEncoder().encode(plainText);
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
    key,
    encoded
  );
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode.apply(null, Array.from(combined)));
}

/**
 * Decrypts API response body. Expects { data: "<base64>" }.
 */
export async function decryptResponse<T>(raw: {
  data?: string;
}): Promise<T> {
  const encrypted = raw?.data;
  if (!encrypted || typeof encrypted !== "string") {
    throw new Error("Invalid response: missing encrypted data");
  }
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  if (combined.length < IV_LENGTH) {
    throw new Error("Invalid encrypted response");
  }
  const iv = combined.subarray(0, IV_LENGTH);
  const ciphertext = combined.subarray(IV_LENGTH);
  const key = await getKey();
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
    key,
    ciphertext
  );
  const json = new TextDecoder().decode(decrypted);
  return JSON.parse(json) as T;
}

/**
 * Checks if a response body looks like encrypted format { data: string }.
 */
export function looksLikeEncryptedResponse(body: unknown): body is {
  data: string;
} {
  return (
    typeof body === "object" &&
    body !== null &&
    "data" in body &&
    typeof (body as { data?: unknown }).data === "string"
  );
}
