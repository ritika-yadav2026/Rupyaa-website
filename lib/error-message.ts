/**
 * Returns true when a string looks like SOAP/XML or similar markup returned inside JSON `message` fields.
 */
function isLikelySoapOrXmlPayload(text: string): boolean {
  const head = text.slice(0, 800).toLowerCase();
  return (
    head.includes("<?xml") ||
    head.includes("<soap") ||
    head.includes("soap-env") ||
    head.includes("xmlns:") ||
    (head.includes("<") && head.includes("envelope"))
  );
}

/**
 * Replaces API error bodies that embed SOAP/XML or huge markup so callers can show a short fallback instead.
 */
export function sanitizeApiErrorMessage(
  message: string | null | undefined,
  fallback: string
): string {
  const fallbackTrimmed = fallback.trim() || "Request failed";
  if (!message?.trim()) {
    return fallbackTrimmed;
  }
  const trimmed = message.trim();
  if (trimmed.length > 2000) {
    return fallbackTrimmed;
  }
  if (isLikelySoapOrXmlPayload(trimmed)) {
    return fallbackTrimmed;
  }
  const looksLikeMarkup =
    /<\/?[a-zA-Z][^>]{0,200}>/.test(trimmed) &&
    (trimmed.includes("</") || trimmed.includes("/>") || trimmed.includes("<?xml"));
  if (looksLikeMarkup) {
    return fallbackTrimmed;
  }
  return trimmed.length > 800 ? fallbackTrimmed : trimmed;
}
