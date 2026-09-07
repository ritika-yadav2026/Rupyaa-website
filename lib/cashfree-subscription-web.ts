import { load } from "@cashfreepayments/cashfree-js";
import { resolveCashfreeEnachMode } from "@/lib/cashfree-enach-config";

/**
 * Opens Cashfree hosted subscription checkout (same session id from POST /mandates).
 * Uses `subscriptionsCheckout` (not `checkout`) — regular `checkout` expects `paymentSessionId`
 * and causes "paymentSessionId is missing" when used for subscriptions.
 * Post-auth redirect is configured when the mandate/subscription is created on the backend.
 */
export async function openCashfreeSubscriptionCheckoutWeb(params: {
  mode: "sandbox" | "production";
  subscriptionSessionId: string;
  /** Documented for callers; return URL is typically set server-side on mandate creation. */
  returnUrl?: string;
  /**
   * `"_self"` — navigate the current window (use inside a popup opened via `window.open`).
   * `"_blank"` — new tab (default when calling from the main loan wizard window).
   */
  redirectTarget?: "_self" | "_blank";
}): Promise<void> {
  const cashfree = await load({ mode: params.mode });
  if (!cashfree?.subscriptionsCheckout) {
    throw new Error("Payment gateway is unavailable. Please try again.");
  }
  const result = await cashfree.subscriptionsCheckout({
    subsSessionId: params.subscriptionSessionId,
    redirectTarget: params.redirectTarget ?? "_blank",
  });
  if (result?.error?.message) {
    throw new Error(result.error.message);
  }
}
