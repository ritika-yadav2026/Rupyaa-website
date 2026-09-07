import { apiFetchWithAuth, extractApiUserMessage } from "@/lib/api";
import { API_ENDPOINTS, endpointPath } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/lib/app-config-types";
import { asRecord } from "@/utils/common-helper";
import { mapSalaryAccountsResponse } from "@/utils/mapSalaryAccountsResponse";

/** Backend mandate registration row / status (subset used by web). */
export type MandateRegistrationDetails = {
  status?: string;
};

export type MandateDetailsData = {
  registrationDetails?: MandateRegistrationDetails;
  mandateDetails?: Record<string, unknown>;
};

export type CreateMandatePayload = {
  geoLocation?: string;
};

/** Values returned after POST /mandates so Cashfree subscription checkout can open. */
export type CreateMandateResult = {
  sessionId: string;
  subscriptionId: string;
};

/** Response from GET /user/salary-accounts */
export interface SalaryAccountsResponse {
  salaryAccounts: string[];
  hintText?: string;
  validationText?: string;
}

/** Unwrap `{ success, data }` envelopes from the API when present. */
export function unwrapMandatePayload<T>(raw: unknown): T {
  const envelope = raw as Partial<ApiResponse<T>>;
  if (
    envelope &&
    typeof envelope === "object" &&
    envelope.success === true &&
    envelope.data !== undefined &&
    envelope.data !== null
  ) {
    return envelope.data as T;
  }
  return raw as T;
}

function pickString(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return "";
}

function parseCreateMandateResponse(raw: unknown): CreateMandateResult {
  const envelope = asRecord(raw);
  if (envelope?.success === false) {
    const msg =
      extractApiUserMessage(raw) ?? "Could not start mandate. Please try again.";
    throw new Error(msg);
  }

  const data = unwrapMandatePayload<unknown>(raw);
  const root = asRecord(data) ?? {};
  const sessionId = pickString(root, ["sessionId", "subscriptionSessionId"]);
  const subscriptionId = pickString(root, ["subscriptionId"]);
  if (!sessionId) {
    throw new Error("Could not start mandate. Please try again.");
  }
  return { sessionId, subscriptionId };
}

/**
 * POST /mandates — create mandate session for Cashfree subscription checkout.
 */
export async function createMandate(payload: CreateMandatePayload): Promise<CreateMandateResult> {
  const body: Record<string, unknown> = {
    // Keep key present for backend parity with mobile mandate payload.
    geoLocation: payload.geoLocation ?? "",
  };
  const raw = await apiFetchWithAuth<unknown>(endpointPath(API_ENDPOINTS.mandates.createMandate), {
    method: "POST",
    body: JSON.stringify(body),
  });
  return parseCreateMandateResponse(raw);
}

/**
 * GET /mandates/user — verify mandate after Cashfree returns to `returnUrl`.
 *
 * On non-OK HTTP responses, {@link apiFetchWithAuth} throws with the API `message` / `error`
 * string when present (e.g. `"Enach details not found"`). Callers should surface `error.message`
 * to the user instead of a generic string when appropriate.
 *
 * **Note:** A `200` body with `success: false` is currently treated as empty details (not thrown);
 * prefer fixing the backend to use error status codes for true failures, or extend this function
 * to throw after checking the envelope.
 */
export async function getMandateDetails(): Promise<MandateDetailsData> {
  const raw = await apiFetchWithAuth<unknown>(endpointPath(API_ENDPOINTS.mandates.getMandateDetails), {
    method: "GET",
  });
  const data = unwrapMandatePayload<unknown>(raw);
  const obj = asRecord(data);
  if (!obj) {
    return {};
  }
  const registration = asRecord(obj.registrationDetails);
  return {
    registrationDetails: registration
      ? { status: typeof registration.status === "string" ? registration.status : undefined }
      : undefined,
    mandateDetails:
      obj.mandateDetails && typeof obj.mandateDetails === "object"
        ? (obj.mandateDetails as Record<string, unknown>)
        : undefined,
  };
}

export function isMandateRegistrationFailed(details: MandateDetailsData): boolean {
  return details.registrationDetails?.status === "FAILED";
}

/**
 * Fail closed: missing or non-boolean `shouldStop` → treat as stop (block).
 * Matches mobile `readShouldStopFlag`.
 */
export function readShouldStopFlag(payload: unknown): boolean {
  const obj = asRecord(payload);
  if (!obj) return true;
  const flag = obj.shouldStop;
  if (typeof flag === "boolean") return flag;
  return true;
}

/**
 * GET /mandates/should-stop-before-nach — whether user must stop before E-NACH / e-sign.
 * Returns `false` when API envelope has `success: false` (parity: do not block).
 * Throws on HTTP/network failure (React Query `isError`).
 */
export async function getShouldStopBeforeNach(): Promise<boolean> {
  const raw = await apiFetchWithAuth<unknown>(
    endpointPath(API_ENDPOINTS.mandates.shouldStopBeforeNach),
    {
      method: "GET",
    },
  );

  const env = raw as Partial<ApiResponse<unknown>>;
  if (env && typeof env === "object" && "success" in env && env.success === false) {
    return false;
  }

  let data: unknown = raw;
  if (env && env.success === true && env.data !== undefined) {
    data = env.data;
  }

  return readShouldStopFlag(data);
}


/**
 * Fetch salary account hints from backend (GET /user/salary-accounts).
 * Uses local fixture when appConfig.useSalaryAccountsFixture is true (API not ready).
 * On live API failure returns empty salaryAccounts so hint/validation are skipped.
 */
export async function getSalaryAccounts(): Promise<ApiResponse<SalaryAccountsResponse>> {
  try {
    const response = await apiFetchWithAuth<SalaryAccountsResponse>(endpointPath(API_ENDPOINTS.user.getSalaryAccounts));
    return {
      success: true,
      data: mapSalaryAccountsResponse(response),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Request failed';
    return {
      success: false,
      error: {
        message,
        code: 'NETWORK_ERROR',
      },
    };
  }
}