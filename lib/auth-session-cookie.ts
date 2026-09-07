/**
 * Non-secret hint that the browser likely still has an active ZapCash client session (Zustand
 * persisted in localStorage under `zapcash-auth`). Prefer reading this on the client via
 * {@link readAuthLoggedInCookieHintClient} / `useAuthLoggedInHint` so public RSC pages stay static.
 * Server `cookies()` is reserved for auth-gated routes that must redirect before paint.
 * Never treat this alone as authenticated for APIs (tokens remain in persisted client state).
 */
export const ZAPCASH_AUTH_LOGGED_IN_COOKIE_NAME = "zapcash_logged_in_hint" as const;
export const ZAPCASH_AUTH_LOGGED_IN_COOKIE_VALUE = "1" as const;

/** Default Max-Age; align with refresh-token lifetime when known. */
export const ZAPCASH_AUTH_LOGGED_IN_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function isAuthLoggedInCookieHint(value: string | undefined): boolean {
  return value === ZAPCASH_AUTH_LOGGED_IN_COOKIE_VALUE;
}

/**
 * Client-only: read the auth hint cookie set by {@link syncAuthLoggedInHintCookie}.
 * Prefer `useAuthLoggedInHint` in UI; keep server `cookies()` only for hard redirects.
 */
export function readAuthLoggedInCookieHintClient(): boolean {
  if (typeof document === "undefined") return false;
  const prefix = `${ZAPCASH_AUTH_LOGGED_IN_COOKIE_NAME}=`;
  const match = document.cookie.split("; ").find((row) => row.startsWith(prefix));
  if (!match) return false;
  return isAuthLoggedInCookieHint(match.slice(prefix.length));
}

export function syncAuthLoggedInHintCookie(isLoggedIn: boolean): void {
  if (typeof document === "undefined") return;
  const name = ZAPCASH_AUTH_LOGGED_IN_COOKIE_NAME;
  const maxAge = ZAPCASH_AUTH_LOGGED_IN_COOKIE_MAX_AGE_SECONDS;
  if (isLoggedIn) {
    document.cookie = `${name}=${ZAPCASH_AUTH_LOGGED_IN_COOKIE_VALUE}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  } else {
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
  }
}
