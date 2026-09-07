import { apiFetchWithAuth } from "./api";
import { API_ENDPOINTS, endpointPath } from "./api-endpoints";

export type DigilockerInitiateRequest = {
  aadhaarNumber?: string;
};

export type DigilockerInitiateResponse = {
  verification_id: string;
  reference_id: number;
  url: string;
  status: string;
  document_requested: string[];
  user_flow: string;
  redirect_url: string;
};

export type DigilockerStatusResponse = {
  message: string;
  status: boolean;
  isAuthenticated: boolean;
  isAadhaarLinkedNumberVerified: boolean;
  shouldProceedWithFetch: boolean;
  bypassReason: string;
};

export type DigilockerStatusResult =
  | { ok: true; data: DigilockerStatusResponse }
  | { ok: false; message: string };

export async function postDigilockerInitiate(
  payload: DigilockerInitiateRequest = {}
): Promise<DigilockerInitiateResponse> {
  return apiFetchWithAuth<DigilockerInitiateResponse>(
    endpointPath(API_ENDPOINTS.external.digilockerInitiate),
    {
      method: "POST",
      body: JSON.stringify({ aadhaar_number: payload.aadhaarNumber ?? "" }),
    }
  );
}

/**
 * POST /external/digilocker/status
 *
 * Soft-fails: returns `{ ok: false, message }` instead of throwing so the step
 * can keep the user on the initiate flow when the backend reports
 * "Verification ID is required" (no KYC session yet) or a transient network error.
 */
export async function postDigilockerStatus(): Promise<DigilockerStatusResult> {
  try {
    const data = await apiFetchWithAuth<DigilockerStatusResponse>(
      endpointPath(API_ENDPOINTS.external.digilockerStatus),
      { method: "POST" }
    );
    return { ok: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch Aadhaar status";
    return { ok: false, message };
  }
}

const VERIFICATION_ID_REQUIRED_REGEX = /verification id is required/i;

/**
 * True only when the backend confirms the Aadhaar-linked mobile is verified.
 * Other branches (no session yet, transient errors) intentionally resolve to false
 * so the user stays on the initiate flow without a blocking error.
 */
export function isDigilockerVerified(result: DigilockerStatusResult | undefined): boolean {
  if (!result) return false;
  if (!result.ok) return false;
  return Boolean(result.data.isAadhaarLinkedNumberVerified);
}

/** True when the soft failure is the expected "no session yet" signal. */
export function isVerificationIdRequiredError(result: DigilockerStatusResult | undefined): boolean {
  return Boolean(result && !result.ok && VERIFICATION_ID_REQUIRED_REGEX.test(result.message));
}

/** Pick the URL to open from initiate response: prefer `url`, fall back to `redirect_url`. */
export function pickDigilockerRedirectUrl(res: DigilockerInitiateResponse): string {
  const primary = res.url?.trim();
  if (primary) return primary;
  return res.redirect_url?.trim() ?? "";
}

/** Delay between showing the success modal and auto-advancing to the next step. */
export const SUCCESS_MODAL_AUTO_NEXT_DELAY_MS = 2500;
