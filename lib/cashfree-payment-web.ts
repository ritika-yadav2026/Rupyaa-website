import { load } from "@cashfreepayments/cashfree-js";

const DEFAULT_RELATIVE_CALLBACK = "/payment/callback";

function buildCheckoutReturnUrl(origin: string, explicit?: string): string {
  if (explicit?.trim()) {
    return explicit.trim();
  }
  const base = `${origin.replace(/\/$/, "")}${DEFAULT_RELATIVE_CALLBACK}`;
  return `${base}?order_id={order_id}`;
}

/**
 * Opens Cashfree hosted payment checkout for loan repayment (POST /payment/transactions session).
 *
 * Mirrors {@link openCashfreeSubscriptionCheckoutWeb}: caller resolves `mode` via
 * {@link resolveCashfreeEnachMode} and passes it explicitly.
 *
 * Cashfree.js v3 requires `mode` on both `load({ mode })` and `checkout({ mode, ... })`.
 * `returnUrl` should include the literal `{order_id}` placeholder where applicable.
 */
export async function openCashfreePaymentCheckoutWeb(params: {
  mode: "sandbox" | "production";
  paymentSessionId: string;
  orderId: string;
  origin: string;
  returnUrl?: string;
  redirectTarget?: "_self" | "_blank";
}): Promise<void> {
  const cashfree = await load({ mode: params.mode });
  if (!cashfree?.checkout) {
    throw new Error("Payment gateway is unavailable. Please try again.");
  }

  const sessionId = params.paymentSessionId.trim();
  const orderId = params.orderId.trim();
  if (!sessionId) {
    throw new Error("Payment session is missing. Please try again.");
  }
  if (!orderId) {
    throw new Error("Payment order id is missing. Please try again.");
  }

  let returnUrl = buildCheckoutReturnUrl(params.origin, params.returnUrl);
  if (!returnUrl.includes("{order_id}")) {
    const joiner = returnUrl.includes("?") ? "&" : "?";
    returnUrl = `${returnUrl}${joiner}order_id={order_id}`;
  }

  const result = await cashfree.checkout({
    paymentSessionId: sessionId,
    returnUrl,
    mode: params.mode,
    redirectTarget: params.redirectTarget ?? "_blank",
  });

  if (result?.error?.message) {
    throw new Error(result.error.message);
  }

  if (result?.redirect && params.redirectTarget === "_self") {
    return;
  }
}
