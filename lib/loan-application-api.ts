import { asLoanRecord } from "@/utils/common-helper";
import { apiFetchWithAuth } from "./api";
import { API_ENDPOINTS, endpointPath } from "./api-endpoints";

/** Parsed body from POST /api/v1/loans/applications (fields vary by backend). */
export type ApplyLoanApiResponse = {
  success?: boolean;
  message?: string;
  retryMethod?: string;
  data?: unknown;
};

function recordIndicatesRetryOrError(r: Record<string, unknown>): boolean {
  if (r.retryMethod === "AA_RETRY") return true;
  if (r.success === false) return true;
  return false;
}

/** Message for UI when apply-loan asks for retry or reports failure (checks top-level and nested `data`). */
export function getApplyLoanRetryMessage(response: unknown): string | undefined {
  const top = asLoanRecord(response);
  if (!top) return undefined;
  const pickMessage = (r: Record<string, unknown>) => {
    const msg = r.message;
    return typeof msg === "string" && msg.trim().length > 0 ? msg.trim() : undefined;
  };
  return pickMessage(top) ?? pickMessage(asLoanRecord(top.data) ?? {});
}

/**
 * True when apply-loan succeeded for offer flow: do not call current-offer when backend signals AA retry or explicit failure.
 */
export function isApplyLoanRetryOrError(response: unknown): boolean {
  const top = asLoanRecord(response);
  if (!top) return false;
  if (recordIndicatesRetryOrError(top)) return true;
  const inner = asLoanRecord(top.data);
  return inner ? recordIndicatesRetryOrError(inner) : false;
}

/**
 * POST /api/v1/loans/applications — apply loan after BSA processed + bankStatementKey (same platform header as other loans APIs).
 */
export async function applyLoan(): Promise<ApplyLoanApiResponse> {
  const data = await apiFetchWithAuth<ApplyLoanApiResponse>(
    endpointPath(API_ENDPOINTS.loans.applyLoan),
    {
      method: "POST",
      body: JSON.stringify({}),
    }
  );
  return data && typeof data === "object" ? data : {};
}
