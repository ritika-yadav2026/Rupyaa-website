import type { ApiResponse } from "@/lib/app-config-types";
import type {
  CanCancelLoanResponse,
  SubmitCancelLoanResponse,
} from "@/services/loans/loanCancellationApi";

/**
 * Dev-only mock flag for the loan cancellation flow.
 *
 * When `NEXT_PUBLIC_MOCK_LOAN_CANCELLATION` is set to "true" / "1", the
 * cancellation eligibility + submit network calls are short-circuited to
 * canned successful responses, and the sanctioned screen falls back to
 * {@link MOCK_LOAN_ID} when the backend doesn't return an active loan. The
 * production network path is untouched when the flag is off.
 */
export function isLoanCancellationMockEnabled(): boolean {
  const raw = "false"
  if (!raw) return false;
  const normalized = raw.trim().toLowerCase();
  return normalized === "true" || normalized === "1";
}

/** Placeholder loan id used only when the mock flag is on and no real id exists. */
export const MOCK_LOAN_ID = "mock-loan-cancellation-id";

const ELIGIBILITY_DELAY_MS = 300;
const SUBMIT_DELAY_MS = 700;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getMockCanCancelLoanResponse(): Promise<
  ApiResponse<CanCancelLoanResponse>
> {
  await delay(ELIGIBILITY_DELAY_MS);
  return { success: true, data: { canCancel: true } };
}

export async function getMockSubmitCancelLoanResponse(): Promise<
  ApiResponse<SubmitCancelLoanResponse>
> {
  await delay(SUBMIT_DELAY_MS);
  return {
    success: true,
    data: { success: true, message: "Loan cancelled (mock)" },
  };
}
