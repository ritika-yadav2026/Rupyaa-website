import type { ReactNode } from "react";
import { RECOMMENDATION_FALLBACK_BODY } from "./constants";

/**
 * Joins normalized salary-account suffixes into a human-readable hint string.
 *  - ["1234"]                 → "1234"
 *  - ["1234", "4678"]         → "1234" or "4678"
 *  - ["1", "2", "3"]          → "1", "2" or "3"
 */
export function formatSalarySuffixHint(suffixes: string[]): string {
  const cleaned = suffixes.map((s) => s.trim()).filter((s) => s.length > 0);
  if (cleaned.length === 0) return "";
  if (cleaned.length === 1) return cleaned[0];
  if (cleaned.length === 2) return `${cleaned[0]} or ${cleaned[1]}`;
  const head = cleaned.slice(0, -1).join(", ");
  const tail = cleaned[cleaned.length - 1];
  return `${head} or ${tail}`;
}

/**
 * Builds the user-facing recommendation body shown in the success callout.
 * Falls back to a generic message when the backend returns no suffixes.
 */
export function buildRecommendationMessage(suffixes: string[]): ReactNode {
  const hint = formatSalarySuffixHint(suffixes);
  if (!hint) return RECOMMENDATION_FALLBACK_BODY;
  return (
    <>
      {RECOMMENDATION_FALLBACK_BODY}, use your salary account ending with{" "}
      <span className="font-bold">&apos;{hint}&apos;</span>.
    </>
  );
}
