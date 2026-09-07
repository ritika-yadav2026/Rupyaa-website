/**
 * Same-origin page opened in the Cashfree popup. Payment `checkout` must run **in that window**
 * with `redirectTarget: "_self"` so hosted checkout stays in the popup; calling the SDK from the
 * main payment screen navigates the whole tab away.
 */
export function getPaymentCashfreeBridgePopupUrl(params: {
  paymentSessionId: string;
  orderId: string;
  mode: "sandbox" | "production";
}): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const q = new URLSearchParams({
    paymentSessionId: params.paymentSessionId,
    orderId: params.orderId,
    cashfreeMode: params.mode,
  });
  return `${origin}/payment/checkout?${q.toString()}`;
}
