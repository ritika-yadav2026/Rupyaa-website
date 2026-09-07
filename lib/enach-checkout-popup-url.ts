/**
 * Same-origin page opened in the Cashfree popup. Cashfree `subscriptionsCheckout` must run **in
 * that window** with `redirectTarget: "_self"` so hosted checkout stays in the popup; calling the
 * SDK from the main wizard window opens a new tab instead.
 *
 * The step opens this URL via `openExternalFlowPopup`; after the user finishes (or closes the
 * popup), the **opener** verifies mandate via `getMandateDetails` — see `ENachMandateStep`.
 */
export function getEnachCashfreeBridgePopupUrl(subscriptionSessionId: string, enachMode: "sandbox" | "production"): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const q = new URLSearchParams({ subscriptionSessionId });
  return `${origin}/enach/checkout?${q.toString()}&enachMode=${enachMode}`;
}
