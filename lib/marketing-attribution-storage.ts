import type { MarketingAttribution } from "./auth-api";

const MARKETING_ATTRIBUTION_STORAGE_KEY: string = "zapcash_marketing_attribution_v2";

/**
 * App routing params that must not be treated as marketing attribution.
 */
const EXCLUDED_ATTRIBUTION_QUERY_KEYS: ReadonlySet<string> = new Set([
  "mobile",
  "returnTo",
  // DSA SSO routing — never treat as marketing attribution.
  "ticket",
]);

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function pickDefinedStrings(attribution: MarketingAttribution): MarketingAttribution {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(attribution)) {
    if (typeof value !== "string") continue;
    const trimmed: string = value.trim();
    if (trimmed.length === 0) continue;
    result[key] = trimmed;
  }
  return result;
}

function hasAnyAttribution(attribution: MarketingAttribution | undefined): boolean {
  if (!attribution) return false;
  return Object.keys(attribution).length > 0;
}

/**
 * Reads all query parameters as-is (original key names), excluding app routing params.
 */
export function readAttributionFromSearchParams(
  searchParams: URLSearchParams
): MarketingAttribution | undefined {
  const attribution: Record<string, string> = {};
  searchParams.forEach((value: string, key: string) => {
    if (EXCLUDED_ATTRIBUTION_QUERY_KEYS.has(key)) return;
    const trimmed: string = value.trim();
    if (trimmed.length === 0) return;
    attribution[key] = trimmed;
  });
  if (Object.keys(attribution).length === 0) return undefined;
  return attribution;
}

/**
 * Persists marketing attribution values across the website until the OTP signup completes.
 */
export class MarketingAttributionStorage {
  /**
   * Reads persisted marketing attribution from `localStorage`.
   */
  public static read(): MarketingAttribution | undefined {
    if (!isBrowser()) return undefined;
    const raw: string | null = window.localStorage.getItem(MARKETING_ATTRIBUTION_STORAGE_KEY);
    if (!raw) return undefined;
    try {
      const parsed: unknown = JSON.parse(raw) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return undefined;
      const attribution: MarketingAttribution = pickDefinedStrings(
        parsed as MarketingAttribution
      );
      return hasAnyAttribution(attribution) ? attribution : undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Merges the provided attribution into persisted values.
   * Only non-empty strings overwrite existing values. Keys are kept as-is.
   */
  public static persist(incoming: MarketingAttribution): void {
    if (!isBrowser()) return;
    const stored: MarketingAttribution = MarketingAttributionStorage.read() ?? {};
    const definedIncoming: MarketingAttribution = pickDefinedStrings(incoming);
    const merged: MarketingAttribution = { ...stored, ...definedIncoming };
    if (!hasAnyAttribution(merged)) return;
    window.localStorage.setItem(MARKETING_ATTRIBUTION_STORAGE_KEY, JSON.stringify(merged));
  }

  /**
   * Clears persisted marketing attribution after successful signup.
   */
  public static clear(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(MARKETING_ATTRIBUTION_STORAGE_KEY);
  }
}
