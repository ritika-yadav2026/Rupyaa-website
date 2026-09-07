import { apiFetchWithAuth } from "./api";
import { API_ENDPOINTS, endpointPath } from "./api-endpoints";
import { logOfferCurrentEvent } from "./offer-current-debug";

export const RELOAN_SUB_STATUS = 'ReLoan';  // Same as Backend constant RELOAN

/** Success response when user is eligible (APPROVE or NA with smsBureauLoanCreated) */
export type GetUserEligibilityExperianSuccessResponse = {
  success: true;
  status?: "APPROVE" | "NA";
  salary?: number;
  decile?: number;
  empType?: string;
  isReloan?: boolean;
  smsBureauLoanCreated?: boolean;
  message: string;
  isAppRedirected?: boolean;
};

/** Response when user was already verified */
export type GetUserEligibilityExperianAlreadyVerifiedResponse = {
  success: true;
  message: string;
  isAppRedirected?: boolean;
};

/** Error response when rejected (400) */
export type GetUserEligibilityExperianRejectedResponse = {
  success: false;
  message: string;
  status?: string;
  salary?: number;
  decile?: number;
  empType?: string;
  isReloan?: boolean;
  isEligible: false;
};

export type GetUserEligibilityExperianResponse =
  | GetUserEligibilityExperianSuccessResponse
  | GetUserEligibilityExperianAlreadyVerifiedResponse;

export type GetUserEligibilityExperianParams = {
  deviceType?: "mobile";
};

/**
 * Fetches user eligibility after personal and employment details are submitted.
 * Triggers Experian soft pull. Call after post-personal-details-v2 and post-employment-details.
 */
export async function getUserEligibilityExperian(
  params?: GetUserEligibilityExperianParams
): Promise<GetUserEligibilityExperianResponse> {
  const searchParams: Record<string, string> = {};
  if (params?.deviceType) {
    searchParams.deviceType = params.deviceType;
  }
  return apiFetchWithAuth<GetUserEligibilityExperianResponse>(
    endpointPath(API_ENDPOINTS.user.getUserEligibilityExperian),
    {
      method: "GET",
      ...(Object.keys(searchParams).length > 0 && { params: searchParams }),
    }
  );
}

/** Loan statuses from LMS / underwriting (API may normalize casing per environment). */
export type LoanStatus =
  | "Sanctioned"
  | "Disbursed"
  | "Completed"
  | "Foreclosed"
  | "Overdue"
  | string;

export type PaymentStatus = "Pending" | "Paid" | "Overdue" | string;

export type LoanType = "PAY_DAY" | "CREDIT_BUILDER" | string;

export interface LoanFollowUp {
  lastAddedBy: string | null;
  status: boolean;
}

/**
 * Loan row shape from `/loans/active`, `/loans`, and LMS-aligned endpoints.
 */
export interface Loan {
  _id: string;
  amount: number;
  tenure: string;
  dueDate: string;
  totalPayable: number;
  applicationNumber: string;
  createdAt: string;
  updatedAt: string;
  fee?: number;
  feePercentage?: number;
  reason?: string;
  status?: LoanStatus;
  interestRate?: number;
  interestRateAfterDueDate?: number;
  paymentStatus?: PaymentStatus;
  type?: LoanType;
  emiAmount?: number;
  /** Total amount currently due for repayment — populated when LMS exposes it. */
  amountDue?: number;
  bounceAmount?: number;
  totalPenaltyAmount?: number;
  totalAmountPaid?: number;
  paid?: boolean;
  isForeclosed?: boolean;
  userName?: string;
  phoneNumber?: string;
  lendingNbfc?: string;
  disbursedAt?: string;
  actualDisbursedAt?: string;
  followUp?: LoanFollowUp;
  user?: string;
  isRiskyCustomer?: boolean;
  NPATransferredTo?: string;
  assignedTo?: string;
  isEdited?: boolean;
  logs?: unknown[];
  paymentRemindersSentOn?: unknown[];
  appliedVia?: string;
  afterDisbursalStatus?: string;
  isInLMS?: boolean;
  transactions?: string[];
  emiDates?: unknown[];
  isSettlement?: boolean;
  isAuditDone?: boolean;
  nbfc?: unknown[];
  verdictGivenByAnalyzer?: string;
  bureauResult?: string;
  bsaResult?: string;
  userAgent?: string;
  ipAddress?: string;
  isSentInMIS?: boolean;
  waiverAmount?: number;
  isWaivered?: boolean;
  isReviewDone?: boolean;
  isBSAManual?: boolean;
  refundAmount?: number;
  subStatus?: string;
  category?: string;
  callCount?: number;
  autoDisbursalChecksPassed?: boolean;
  lastCallStatus?: string;
  lastCallDate?: string;
  platform?: string;
  policy?: string;
  source?: string;
  sanctionedPdfKey?: string;
  finalSignedContract?: string;
  assignedToPreCollection?: string;
  overdueSubstatus?: string;
  assignedNbfcCode?: string;
  editedLoanDetails?: unknown[];
  partialTransactions?: unknown[];
  emails?: unknown[];
  /** Populated when LMS / active-loan sends an overdue flag with the loan row. */
  isOverdue?: boolean;
  [key: string]: unknown;
}

export interface GetAllUserLoansResponse {
  message: string;
  loans: Loan[];
}

export interface GetExistingActiveLoanResponse {
  message: string;
  canCancel?: boolean;
  hasActiveLoan: boolean;
  loan: Loan | null;
  loanStatus: string;
  offerAccepted?: boolean;
  panVerified?: boolean;
  isCblUser?: boolean;
  /** Days since rejection when `loanStatus` indicates rejected. */
  daysSinceRejection?: number;
}

/** Alias — same row type as `/loans/active` ({@link Loan}). */
export type ActiveLoan = Loan;

/**
 * Fetches active loan. Call on app load/dashboard to decide which card/flow to show.
 */
export async function getExistingActiveLoan(): Promise<GetExistingActiveLoanResponse> {
  return apiFetchWithAuth<GetExistingActiveLoanResponse>(
    endpointPath(API_ENDPOINTS.loans.getExistingActiveLoan),
    {
      method: "GET",
    }
  );
}

/** Offer object from current-offer */
export type CurrentOffer = {
  _id: string;
  userId?: string;
  loanId: Loan;
  phoneNumber?: string;
  offerAmount: number;
  loanTenure: number;
  interestRate?: number;
  payableAmount: number;
  status: string;
  isActive?: boolean;
  isExtended?: boolean;
  rawOffer?: number;
  penalizedOffer?: number;
  policy?: string;
  history?: unknown[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export type GetCurrentOfferResponse = {
  message: string;
  offer: CurrentOffer;
  /** Present when backend returns product type (native ApprovedOfferStep interest suffix). */
  loanType?: LoanType;
  isRiskyCustomer?: boolean;
  riskyReloanCount?: number;
  showUpdateButton?: boolean;
};

/**
 * Fetches current offer details (amount, tenure, payable) when loan status is Verified.
 * @param debugFrom Stable label for offer/current debug logs (when enabled).
 */
export async function getCurrentOffer(debugFrom?: string): Promise<GetCurrentOfferResponse> {
  logOfferCurrentEvent("GET /offer/current", { from: debugFrom ?? "unknown" }, { trace: true });
  return apiFetchWithAuth<GetCurrentOfferResponse>(
    endpointPath(API_ENDPOINTS.offer.currentOffer),
    {
      method: "GET",
    }
  );
}

export type AcceptOfferResponse = {
  message: string;
  offer: CurrentOffer;
};

/**
 * Accepts the current offer. Call when user clicks Accept on the offer screen.
 */
export async function acceptOffer(): Promise<AcceptOfferResponse> {
  return apiFetchWithAuth<AcceptOfferResponse>(
    endpointPath(API_ENDPOINTS.offer.acceptOffer),
    {
      method: "POST",
      body: JSON.stringify({}),
    }
  );
}

export function isCurrentOfferSuccess(
  data: GetCurrentOfferResponse
): data is GetCurrentOfferResponse {
  return 'offer' in data && data.offer != null;
}


export function getOfferLoanSubStatus(data: GetCurrentOfferResponse 
  | null 
  | undefined
): boolean {
  if (!data || !isCurrentOfferSuccess(data)) return false;
  console.log("getOfferLoanSubStatus", data);
  const loan = data.offer?.loanId;
  if (loan == null || typeof loan === 'string') return false;
  const raw = (loan as Loan).subStatus;
  console.log("getOfferLoanSubStatus", raw);
  if (typeof raw !== 'string' || raw.trim().length === 0) return false;
  const normalized = raw.trim().toUpperCase();
  return normalized === RELOAN_SUB_STATUS.toUpperCase();
}