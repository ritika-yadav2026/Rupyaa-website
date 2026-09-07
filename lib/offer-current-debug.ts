/**
 * Trace why GET /offer/current runs.
 * Enabled in development, or set `NEXT_PUBLIC_DEBUG_OFFER_CURRENT=1`.
 */
export function isOfferCurrentDebugLogEnabled(): boolean {
  if (typeof process === "undefined") return false;
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_DEBUG_OFFER_CURRENT === "1"
  );
}

export function logOfferCurrentEvent(
  from: string,
  detail?: Record<string, unknown>,
  options?: { trace?: boolean },
): void {
  if (!isOfferCurrentDebugLogEnabled()) return;
  const label = `[ZapCash][offer/current] ${from}`;
  if (detail && Object.keys(detail).length > 0) {
    console.log(label, detail);
  } else {
    console.log(label);
  }
  if (options?.trace) {
    console.trace("[ZapCash][offer/current] stack");
  }
}
