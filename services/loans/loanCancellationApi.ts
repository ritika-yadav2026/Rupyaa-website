import { apiFetchWithAuth, extractApiUserMessage } from "@/lib/api";
import { API_ENDPOINTS, endpointPath, resolveEndpoint } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/lib/app-config-types";
import type { GetExistingActiveLoanResponse } from "@/lib/eligibility-api";
import {
  getMockCanCancelLoanResponse,
  getMockSubmitCancelLoanResponse,
  isLoanCancellationMockEnabled,
} from "@/lib/loan-cancellation-mock";

export interface CanCancelLoanResponse {
  canCancel: boolean;
}

export interface SubmitCancelLoanResponse {
  success: boolean;
  message?: string;
}

const GENERIC_CANCEL_ERROR_MESSAGE = "Could not cancel your loan. Please try again.";
const INVALID_LOAN_ID_MESSAGE = "Could not find your loan. Please try again later.";

const INVALID_LOAN_ID_ERROR: ApiResponse<SubmitCancelLoanResponse> = {
  success: false,
  error: {
    message: INVALID_LOAN_ID_MESSAGE,
    code: "INVALID_LOAN_ID",
  },
};

/** Trim and reject empty strings — empty ids must never hit the network. */
export function normalizeLoanIdForCancellation(
  loanId: string | null | undefined
): string | null {
  const trimmed = loanId?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

/** Loan id from GET /loans/active. Returns null unless `hasActiveLoan` + `loan._id` are valid. */
export function getLoanIdFromActiveLoanResponse(
  data: GetExistingActiveLoanResponse | null | undefined
): string | null {
  if (!data?.hasActiveLoan || data.loan == null) {
    return null;
  }
  return normalizeLoanIdForCancellation(data.loan._id);
}

/** Cancel eligibility from GET /loans/active `canCancel` field (fail closed when missing). */
export function getCanCancelFromActiveLoanResponse(
  data: GetExistingActiveLoanResponse | null | undefined
): boolean {
  const value: unknown = data?.canCancel;
  if (value === true) {
    return true;
  }
  if (typeof value === "string" && value.trim().toLowerCase() === "true") {
    return true;
  }
  return false;
}

function readCanCancelFlag(data: unknown): boolean {
  if (data !== null && typeof data === "object" && !Array.isArray(data)) {
    const value = (data as Record<string, unknown>).canCancel;
    if (typeof value === "boolean") {
      return value;
    }
  }
  return false;
}

function readCancelSuccessFlag(data: unknown): boolean {
  if (data !== null && typeof data === "object" && !Array.isArray(data)) {
    const record = data as Record<string, unknown>;
    if (typeof record.success === "boolean") {
      return record.success;
    }
    if (typeof record.cancelled === "boolean") {
      return record.cancelled;
    }
  }
  return false;
}

/** Fail-closed parse of eligibility body: anything that isn't `{ canCancel: boolean }` is `false`. */
export function parseCanCancelLoan(data: unknown): boolean {
  return readCanCancelFlag(data);
}

/** Treats either `success: true` or legacy `cancelled: true` as a successful cancellation. */
export function parseSubmitCancelLoan(data: unknown): boolean {
  return readCancelSuccessFlag(data);
}

function unwrapEnvelopeData<T>(raw: unknown): T {
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

function buildCancellationPath(template: string, loanId: string): string {
  return endpointPath(resolveEndpoint(template, { loanId }));
}

/**
 * GET /loans/:loanId/cancel-eligibility
 *
 * Fail-closed: empty id, non-2xx, malformed envelope, or non-boolean `canCancel`
 * all collapse to `{ canCancel: false }`. Network exceptions also resolve to a
 * `success: false` response so the caller can decide whether to log; the hook
 * downstream maps any failure to `false`.
 */
export async function getCanCancelLoan(
  loanId: string
): Promise<ApiResponse<CanCancelLoanResponse>> {
  if (isLoanCancellationMockEnabled()) {
    return getMockCanCancelLoanResponse();
  }
  const normalizedId = normalizeLoanIdForCancellation(loanId);
  if (!normalizedId) {
    return { success: true, data: { canCancel: false } };
  }

  try {
    const raw = await apiFetchWithAuth<unknown>(
      buildCancellationPath(API_ENDPOINTS.loans.cancelEligibility, normalizedId),
      { method: "GET" }
    );
    const data = unwrapEnvelopeData<unknown>(raw);
    return { success: true, data: { canCancel: parseCanCancelLoan(data) } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return {
      success: false,
      error: {
        message,
        code: "NETWORK_ERROR",
      },
    };
  }
}

/**
 * POST /loans/:loanId/cancel
 *
 * Invalid id short-circuits to an INVALID_LOAN_ID error without hitting the
 * network. Server / network failures surface a user-facing message; bodies
 * that lack `success: true` (or legacy `cancelled: true`) are treated as
 * failure even when the HTTP status was 200.
 */
export async function submitCancelLoan(
  loanId: string
): Promise<ApiResponse<SubmitCancelLoanResponse>> {
  if (isLoanCancellationMockEnabled()) {
    return getMockSubmitCancelLoanResponse();
  }
  const normalizedId = normalizeLoanIdForCancellation(loanId);
  if (!normalizedId) {
    return INVALID_LOAN_ID_ERROR;
  }

  try {
    const raw = await apiFetchWithAuth<unknown>(
      buildCancellationPath(API_ENDPOINTS.loans.cancelLoan, normalizedId),
      {
        method: "POST",
        body: JSON.stringify({}),
      }
    );
    const data = unwrapEnvelopeData<unknown>(raw);
    if (!parseSubmitCancelLoan(data)) {
      return {
        success: false,
        error: {
          message: extractApiUserMessage(raw) ?? GENERIC_CANCEL_ERROR_MESSAGE,
          code: "CANCEL_FAILED",
        },
      };
    }
    const body =
      data !== null && typeof data === "object" && !Array.isArray(data)
        ? (data as SubmitCancelLoanResponse)
        : { success: true };
    return { success: true, data: body };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : GENERIC_CANCEL_ERROR_MESSAGE;
    return {
      success: false,
      error: {
        message,
        code: "NETWORK_ERROR",
      },
    };
  }
}
