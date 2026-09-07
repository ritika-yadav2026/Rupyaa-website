import { IMAGES } from "./images";

export type PaymentSuccessVariant = "payment" | "foreclosure";

export const VERIFY_PAYMENT_MESSAGE = {
  TITLE: "Verifying payment",
  MESSAGE: "Please wait while we confirm your payment…",
} as const;

/** Replace with final asset when design provides payment success artwork. */
export const PAYMENT_SUCCESS_ICON_SRC = IMAGES.paymentSuccess;

export const LOAN_PAYMENT_SESSION_KEY = "zapcash_loan_payment_pending";
export const LOAN_PAYMENT_RESULT_KEY = "zapcash_loan_payment_result";
/** Set when `/payment/callback` redirects to `/foreclosure` (same tab) so we poll order status once there. */
export const FORECLOSURE_PAYMENT_RETURN_PENDING_KEY = "zapcash_foreclosure_payment_return_pending";
