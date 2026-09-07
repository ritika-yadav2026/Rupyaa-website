import {
  FORECLOSURE_PAYMENT_RETURN_PENDING_KEY,
  LOAN_PAYMENT_RESULT_KEY,
  LOAN_PAYMENT_SESSION_KEY,
} from "@/lib/payment-ui-constants";
import type { PaymentSuccessVariant } from "@/lib/payment-ui-constants";

export type LoanPaymentPendingSession = {
  orderId: string;
  amount: number;
  baseline: number;
  variant: PaymentSuccessVariant;
  returnPath: string;
};

export type LoanPaymentResultSession = {
  status: "SUCCESS" | "FAILED";
  amountPaid: number;
  baseline: number;
  variant: PaymentSuccessVariant;
};

/**
 * Uses **localStorage** (not sessionStorage) so the Cashfree **popup** and **opener** share the
 * same keys. Each window has its own sessionStorage; the popup callback could not hand results
 * back to the opener, which incorrectly showed "Payment was cancelled."
 */
function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function setLoanPaymentPending(session: LoanPaymentPendingSession): void {
  writeJson(LOAN_PAYMENT_SESSION_KEY, session);
}

export function getLoanPaymentPending(): LoanPaymentPendingSession | null {
  return readJson<LoanPaymentPendingSession>(LOAN_PAYMENT_SESSION_KEY);
}

export function clearLoanPaymentPending(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOAN_PAYMENT_SESSION_KEY);
}

export function setLoanPaymentResult(result: LoanPaymentResultSession): void {
  writeJson(LOAN_PAYMENT_RESULT_KEY, result);
}

export function consumeLoanPaymentResult(): LoanPaymentResultSession | null {
  const result = readJson<LoanPaymentResultSession>(LOAN_PAYMENT_RESULT_KEY);
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOAN_PAYMENT_RESULT_KEY);
  }
  return result;
}

/** Full-window Cashfree return: `/payment/callback` sets this before `router.replace("/foreclosure")`. */
export function markForeclosurePaymentReturnFromCallback(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FORECLOSURE_PAYMENT_RETURN_PENDING_KEY, "1");
}

/** Whether to run foreclosure order-status poll after same-tab return; clears the flag (one shot). */
export function consumeForeclosurePaymentReturnFromCallback(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem(FORECLOSURE_PAYMENT_RETURN_PENDING_KEY) !== "1") return false;
  localStorage.removeItem(FORECLOSURE_PAYMENT_RETURN_PENDING_KEY);
  return true;
}
