import { apiFetchWithAuth } from "./api";
import { API_ENDPOINTS, endpointPath } from "./api-endpoints";

/** GET /external/hyperkyc/token — defensive shape: backend may return the token under multiple keys. */
export type HyperKycAccessTokenResponse = {
  accessToken?: string;
  token?: string;
  data?: {
    accessToken?: string;
    token?: string;
  };
};

/** GET /loans/id — used as HyperKYC `transactionId`. */
export type LoanIdResponse = {
  loanId?: string | number;
  id?: string | number;
  data?: {
    loanId?: string | number;
    id?: string | number;
  };
};

/** GET /external/digilocker/aadhar-image — optional reference image for HyperKYC `input_image`. */
export type AadhaarImageResponse = {
  imageLink?: string;
  url?: string;
  data?: {
    imageLink?: string;
    url?: string;
  };
};

/** GET /external/hyperkyc/results — applicationStatus drives polling termination. */
export type HyperKycResultsResponse = {
  success?: boolean;
  message?: string;
  applicationStatus?: string;
  status?: string;
  data?: {
    success?: boolean;
    message?: string;
    applicationStatus?: string;
    status?: string;
  };
  [key: string]: unknown;
};

export const HYPER_KYC_POLL_INTERVAL_MS = 5_000;
export const HYPER_KYC_MAX_POLL_ATTEMPTS = 24;

const PENDING_STATUSES = new Set([
  "pending",
  "in_progress",
  "in-progress",
  "inprogress",
  "processing",
  "queued",
  "submitted",
]);

export async function getHyperKycAccessToken(): Promise<HyperKycAccessTokenResponse> {
  return apiFetchWithAuth<HyperKycAccessTokenResponse>(
    endpointPath(API_ENDPOINTS.external.getHyperKycAccessToken),
    { method: "GET" }
  );
}

export async function getHyperKycResults(): Promise<HyperKycResultsResponse> {
  return apiFetchWithAuth<HyperKycResultsResponse>(
    endpointPath(API_ENDPOINTS.external.getHyperKycApiResults),
    { method: "GET" }
  );
}

export async function getLoanIdForHyperKyc(): Promise<LoanIdResponse> {
  return apiFetchWithAuth<LoanIdResponse>(
    endpointPath(API_ENDPOINTS.loans.getLoanId),
    { method: "GET" }
  );
}

export async function getAadhaarReferenceImageLink(): Promise<string | null> {
  try {
    const res = await apiFetchWithAuth<AadhaarImageResponse>(
      endpointPath(API_ENDPOINTS.external.getAdhaarImage),
      { method: "GET" }
    );
    return pickAadhaarImageLink(res);
  } catch {
    return null;
  }
}

export function pickAccessToken(res: HyperKycAccessTokenResponse): string {
  return (
    res.accessToken?.trim() ||
    res.token?.trim() ||
    res.data?.accessToken?.trim() ||
    res.data?.token?.trim() ||
    ""
  );
}

export function pickLoanIdAsTransactionId(res: LoanIdResponse): string {
  const candidate =
    res.loanId ?? res.id ?? res.data?.loanId ?? res.data?.id ?? "";
  return String(candidate ?? "").trim();
}

export function pickAadhaarImageLink(res: AadhaarImageResponse | null | undefined): string | null {
  if (!res) return null;
  const link =
    res.imageLink?.trim() ||
    res.url?.trim() ||
    res.data?.imageLink?.trim() ||
    res.data?.url?.trim() ||
    "";
  return link.length > 0 ? link : null;
}

export function pickResultsApplicationStatus(res: HyperKycResultsResponse | null | undefined): string {
  if (!res) return "";
  const raw =
    res.applicationStatus ?? res.status ?? res.data?.applicationStatus ?? res.data?.status ?? "";
  return String(raw ?? "").trim().toLowerCase();
}

export function isPendingApplicationStatus(status: string): boolean {
  if (!status) return true;
  return PENDING_STATUSES.has(status);
}

/** True when the backend explicitly reports `success: false`, i.e. a terminal failure rather than "not ready yet". */
export function isExplicitResultsFailure(res: HyperKycResultsResponse | null | undefined): boolean {
  if (!res) return false;
  const success = res.success ?? res.data?.success;
  return success === false;
}

export function pickResultsMessage(res: HyperKycResultsResponse | null | undefined): string {
  if (!res) return "";
  return String(res.message ?? res.data?.message ?? "").trim();
}

export type HyperKycPollOutcome =
  | { ok: true; status: string; response: HyperKycResultsResponse }
  | { ok: false; reason: "timeout" | "error"; status?: string; message?: string };

export async function pollHyperKycResultsUntilReady(options?: {
  signal?: AbortSignal;
  intervalMs?: number;
  maxAttempts?: number;
}): Promise<HyperKycPollOutcome> {
  const intervalMs = options?.intervalMs ?? HYPER_KYC_POLL_INTERVAL_MS;
  const maxAttempts = options?.maxAttempts ?? HYPER_KYC_MAX_POLL_ATTEMPTS;
  const signal = options?.signal;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (signal?.aborted) {
      return { ok: false, reason: "error", message: "Polling aborted" };
    }

    try {
      const response = await getHyperKycResults();
      const status = pickResultsApplicationStatus(response);

      if (isExplicitResultsFailure(response)) {
        return {
          ok: false,
          reason: "error",
          status,
          message: pickResultsMessage(response) || "Verification failed. Please try again.",
        };
      }

      if (!isPendingApplicationStatus(status)) {
        return { ok: true, status, response };
      }
    } catch (error) {
      const isLast = attempt === maxAttempts - 1;
      if (isLast) {
        const message = error instanceof Error ? error.message : "Failed to fetch HyperKYC results";
        return { ok: false, reason: "error", message };
      }
    }

    await waitWithAbort(intervalMs, signal);
  }

  return { ok: false, reason: "timeout" };
}

function waitWithAbort(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      signal?.removeEventListener?.("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timeoutId);
      resolve();
    };
    if (signal?.aborted) {
      clearTimeout(timeoutId);
      resolve();
      return;
    }
    signal?.addEventListener?.("abort", onAbort, { once: true });
  });
}
