import {
  applyLoan,
  getApplyLoanRetryMessage,
  isApplyLoanRetryOrError,
} from "@/lib/loan-application-api";
import { getCurrentOffer, type CurrentOffer, type GetCurrentOfferResponse } from "@/lib/eligibility-api";
import { logBankConnectDebug } from "@/lib/bank-connect";

export type OfferLoanStatusNormalized = "Pending" | "Verified" | "rejected";

/** Embedded `loanId.status` values that must hide the offer (terminal / negative). */
const EXPLICIT_REJECT_LOAN_STATUSES = new Set([
  "REJECTED",
  "DECLINED",
  "DENIED",
  "CANCELLED",
  "CANCELED",
  "FAILED",
  "CLOSED",
]);

/**
 * Reads loan status from offer.loanId when API returns an object (native parity).
 * Unknown statuses are treated like legacy string `loanId` (undefined) — not as rejected —
 * so post-verification lifecycle labels (e.g. ACTIVE) do not blank the offer UI.
 */
export function getOfferLoanStatusFromOffer(offer: CurrentOffer): OfferLoanStatusNormalized | undefined {
  const loanId = offer.loanId as unknown;
  if (loanId == null || typeof loanId === "string") return undefined;
  const raw = (loanId as { status?: unknown }).status;
  if (typeof raw !== "string" || raw.trim().length === 0) return undefined;
  const normalized = raw.trim().toUpperCase();
  if (normalized === "PENDING") return "Pending";
  if (normalized === "VERIFIED") return "Verified";
  if (EXPLICIT_REJECT_LOAN_STATUSES.has(normalized)) return "rejected";
  return undefined;
}

/** Native parity: advance only when offer exists and loan is Verified (or legacy undefined loan status). */
export function shouldAdvanceAfterBankStatementProcessed(
  offer: CurrentOffer,
  hasOffer: boolean
): boolean {
  const loanStatus = getOfferLoanStatusFromOffer(offer);
  const isOfferVerified =
    loanStatus === "Verified" || (loanStatus === undefined && hasOffer);
  return hasOffer && isOfferVerified;
}

/** Parses `offerAmount` when API returns number or numeric string. */
export function getFiniteOfferAmount(offer: CurrentOffer): number | null {
  const n = Number(offer.offerAmount);
  return Number.isFinite(n) ? n : null;
}

function offerHasAmount(offer: CurrentOffer): boolean {
  return getFiniteOfferAmount(offer) != null;
}

/** Native parity: hide offer card when embedded loan is Pending/rejected; requires a positive amount. */
export function isOfferAcceptable(offer: CurrentOffer): boolean {
  const loanStatus = getOfferLoanStatusFromOffer(offer);
  if (loanStatus === "Pending" || loanStatus === "rejected") return false;
  return true;
}

export type ProcessedOfferAttemptResult = {
  hasOffer: boolean;
  offer?: CurrentOffer;
  retryMessage?: string;
  /** Present when GET /offer/current succeeded — lets BSA hydrate `useCurrentOfferStore` without a second fetch. */
  currentOfferPayload?: GetCurrentOfferResponse;
};

export type ApplyLoanAndFetchOfferParams = {
  /** When false, skips POST /loans/applications and only fetches current offer. Defaults to true. */
  canApplyLoan?: boolean;
};

/**
 * Call POST /loans/applications (unless `canApplyLoan` is false); fetch current offer only when apply-loan did not ask for AA retry / failure.
 * When apply-loan returns retryMethod `AA_RETRY`, `success: false`, or throws, current-offer is skipped.
 */
export async function applyLoanAndFetchOffer(
  params?: ApplyLoanAndFetchOfferParams
): Promise<ProcessedOfferAttemptResult> {
  const canApplyLoan = params?.canApplyLoan ?? true;

  if (!canApplyLoan) {
    logBankConnectDebug("applyLoanSkipped", { reason: "callApplyLoan=false" });
    return {
      hasOffer: false,
      retryMessage: "Could not apply loan. Please try again.",
    };
  }

  let applyResponse: unknown;
  try {
    logBankConnectDebug("applyLoanStart", { canApplyLoan: true });
    applyResponse = await applyLoan();
    logBankConnectDebug("applyLoanResult", {
      success: !isApplyLoanRetryOrError(applyResponse),
    });
  } catch (err) {
    logBankConnectDebug("applyLoanResult", { success: false });
    const message =
      err instanceof Error ? err.message : "Could not apply loan. Please try again.";
    return { hasOffer: false, retryMessage: message };
  }

  const apiMessage = getApplyLoanRetryMessage(applyResponse);
  if (isApplyLoanRetryOrError(applyResponse)) {
    return {
      hasOffer: false,
      retryMessage:
        apiMessage ??
        "Bank verification needs another try. Please complete account aggregator consent again.",
    };
  }

  try {
    const res = await getCurrentOffer("lib/bsa-processed-offer.ts:applyLoanAndFetchOffer");
    const hasOffer = offerHasAmount(res.offer);
    return {
      hasOffer,
      offer: res.offer,
      retryMessage: hasOffer ? undefined : apiMessage,
      currentOfferPayload: res,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not fetch offer. Please try again.";
    return { hasOffer: false, retryMessage: message };
  }
}
