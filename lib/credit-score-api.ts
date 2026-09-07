import { apiFetch, extractApiUserMessage } from "@/lib/api";

export interface CreditScoreFormValues {
  fullName: string;
  panNumber: string;
  dob: string;
  mobileNumber: string;
  email: string;
  monthlyIncome: string;
  consent: boolean;
}

export interface CreditScorePullRequest {
  fullName: string;
  panNumber: string;
  dob: string;
  mobileNumber: string;
  email?: string;
  income?: number;
  consent?: boolean;
  userId?: string;
}

export interface CreditReportConsumer {
  name: string | null;
  dob: string | null;
  email: string | null;
  pan: string | null;
  mobile: string | null;
  address: string | null;
}

export interface CreditReportSummary {
  activeAccounts: number | null;
  totalAccounts: number | null;
  onTimePaymentsPercentage: number | null;
  totalEnquiries: number | null;
  totalCreditLimit: number | null;
}

export interface CreditReportAccount {
  lender: string;
  type: string;
  sanctioned: number;
  outstanding: number;
  status: string;
}

export interface CreditReportPaymentHistoryEntry {
  key: string;
  DaysPastDue: number;
}

export interface CreditReportEnquiry {
  lender: string | null;
  type: string;
  date: string | null;
}

export interface CreditReportData {
  creditScore?: number | null;
  scoreTrend: unknown;
  consumer: CreditReportConsumer;
  creditHealthBreakdown: Record<string, unknown>;
  creditSummary: CreditReportSummary;
  accounts: CreditReportAccount[];
  paymentHistory12Months: CreditReportPaymentHistoryEntry[];
  recentEnquiries: CreditReportEnquiry[];
}

export interface CreditScorePullResponse {
  success: boolean;
  reportAvailable: boolean;
  message: string;
  pdfUrl: string;
  data: CreditReportData;
}

const GROMO_EQUIFAX_API_KEY =
  process.env.NEXT_PUBLIC_GROMO_EQUIFAX_API_KEY ?? "zapcash-wecredit-api-key";

/**
 * Converts a `DD/MM/YYYY` string to the ISO `YYYY-MM-DD` accepted by the API.
 */
export function convertDdMmYyyyToIso(value: string): string {
  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day}`;
}

/**
 * Reads a user-facing message from an unknown error thrown by {@link apiFetch}.
 */
export function getApiErrorDisplayMessage(error: unknown): string | undefined {
  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }
  return extractApiUserMessage(error);
}

/**
 * Builds the request body for the Gromo Equifax pull from validated form values.
 */
export function buildCreditScoreRequest(
  values: CreditScoreFormValues,
  userId?: string
): CreditScorePullRequest {
  const income = Number(values.monthlyIncome.replace(/[₹,\s]/g, ""));
  return {
    fullName: values.fullName.trim(),
    panNumber: values.panNumber.trim().toUpperCase(),
    dob: values.dob,
    mobileNumber: values.mobileNumber.replace(/\D/g, ""),
    email: values.email.trim() || undefined,
    income: Number.isFinite(income) && income > 0 ? income : undefined,
    consent: values.consent,
    userId,
  };
}

/**
 * Calls `POST /external/gromo-equifax-pull` and returns the full Equifax report.
 */
export async function pullGromoEquifaxReport(
  payload: CreditScorePullRequest
): Promise<CreditScorePullResponse> {
  return apiFetch<CreditScorePullResponse>("/external/gromo-equifax-pull", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "api-key": GROMO_EQUIFAX_API_KEY,
    },
  });
}
