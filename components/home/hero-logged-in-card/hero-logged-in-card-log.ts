import { logHeroCardDebug } from "@/lib/hero-card-debug";

/**
 * Structured logs for the logged-in hero card switcher.
 * Enable with `?heroDebug=1` or `localStorage.setItem('hero-card-debug','1')` (dev only).
 */
export function logHeroLoggedInBranch(
  branch:
    | "active_loan"
    | "under_review"
    | "unsupported_stage_download"
    | "cbl_rejected"
    | "journey_pre_offer"
    | "journey_post_offer"
    | "none",
  payload: Record<string, unknown>,
): void {
  logHeroCardDebug(`HeroLoggedIn.${branch}`, payload);
}
