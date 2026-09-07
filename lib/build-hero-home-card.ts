/**
 * Hero Home Card — single source of truth for which card to show on the home screen.
 *
 * Data sources (only these two APIs are used here):
 *   • GET /user/stage          → userStage.stage (string)
 *   • GET /loans/active        → GetExistingActiveLoanResponse
 *
 * Branch priority (1–11) lives in {@link evaluateHeroHomeBranch} (`lib/hero-home-card-case.ts`).
 * UI code should use {@link getLoggedInHeroUiCase} with `parsedStage` + snapshot fields — not a stored `kind`.
 */

import type { ActiveLoan, GetExistingActiveLoanResponse } from "@/lib/eligibility-api";
import {
  DEFAULT_HEADING,
  DEFAULT_HEADING_WITHOUT_AMOUNT,
  getLoanStatusCardConfig,
  type LoanStatusCardConfig,
} from "@/config/loanStatusCardConfig";
import { normalizeBackendStage } from "@/config/stageMapping";
import { formatCurrency } from "@/lib/format-utils";
import { getJourneyProgressFromUserStage, type JourneyProgress } from "@/lib/hero-card-logic";
import { logHeroCardDebug } from "@/lib/hero-card-debug";
import { evaluateHeroHomeBranch, getLoggedInHeroUiCase } from "@/lib/hero-home-card-case";
import { UserStagesInBackend } from "@/lib/user-stage";

export type { HeroLoggedInCardCase, HeroHomeCardKind } from "@/lib/hero-home-card-case";
export { meetsActiveLoanDashboardCardMatrix } from "@/lib/hero-home-card-case";

/** Legacy union preserved for any code that still reads HeroCardType. */
export type HeroCardType =
  | "active_loan"
  | "post_offer"
  | "pre_offer"
  | "under_review"
  | "under_review_download"
  | "cbl_rejected";

/**
 * The resolved card payload returned by {@link buildHeroHomeCard}.
 * Use {@link getLoggedInHeroUiCase} for which hero shell to render.
 */
export type HeroHomeResolvedCard = {
  /** Human-readable reason string — used for debug logging. */
  readonly reason: string;
  readonly journeyProgress: JourneyProgress;
  readonly copy: LoanStatusCardConfig;
  readonly parsedStage: UserStagesInBackend;
  readonly hasActiveLoan: boolean;
  readonly loanStatusLower: string;
  readonly loanStatusRaw: string;
  readonly userStageRawUpper: string;
  readonly hasOffer?: boolean;
  readonly loan?: ActiveLoan;
  readonly applicationNumber?: string;
};

export type HeroCardDecision = {
  card: HeroCardType;
  actionLabel?: string;
  reason: string;
};

const VERIFIED_STATUS = "verified";

function parseUserStage(stageRaw: string | undefined | null): UserStagesInBackend {
  const normalized = normalizeBackendStage(stageRaw ?? "");
  const values = Object.values(UserStagesInBackend) as string[];
  if (values.includes(normalized)) {
    return normalized as UserStagesInBackend;
  }
  return UserStagesInBackend.PERSONAL_DETAILS;
}

function resolveApplicationNumber(loan: ActiveLoan | null | undefined): string | undefined {
  const v = typeof loan?.applicationNumber === "string" ? loan.applicationNumber.trim() : "";
  return v.length > 0 ? v : undefined;
}

function buildCopyForStage(
  parsedStage: UserStagesInBackend,
  effectiveStage: UserStagesInBackend,
  loan: ActiveLoan | null | undefined,
  loanStatus: string
): LoanStatusCardConfig {
  const base = getLoanStatusCardConfig(effectiveStage);
  let heading = base.heading;

  if (parsedStage === UserStagesInBackend.OFFERINGS && loanStatus === VERIFIED_STATUS && loan) {
    const amt = loan.amount;
    if (typeof amt === "number" && Number.isFinite(amt)) {
      heading = `You're Eligible for ${formatCurrency(amt)}`;
    }
  }

  if (heading !== base.heading && base.heading === DEFAULT_HEADING) {
    heading = DEFAULT_HEADING_WITHOUT_AMOUNT;
  }

  return {
    title: base.title,
    heading,
    description: base.description,
    actionLabel: base.actionLabel,
    hideAction: base.hideAction,
    hideProgressStepper: base.hideProgressStepper,
  };
}

function buildResolvedCard(
  base: {
    hasActiveLoan: boolean;
    loan: ActiveLoan | null | undefined;
    loanStatusRaw: string;
    loanStatusLower: string;
    userStageRawUpper: string;
    parsedStage: UserStagesInBackend;
    journeyProgress: JourneyProgress;
    copy: LoanStatusCardConfig;
    reason: string;
  },
  extras: { hasOffer?: boolean; loan?: ActiveLoan; applicationNumber?: string }
): HeroHomeResolvedCard {
  const loanForApp = extras.loan ?? base.loan;
  const applicationNumber = extras.applicationNumber ?? resolveApplicationNumber(loanForApp);
  return {
    reason: base.reason,
    journeyProgress: base.journeyProgress,
    copy: base.copy,
    parsedStage: base.parsedStage,
    hasActiveLoan: base.hasActiveLoan,
    loanStatusLower: base.loanStatusLower,
    loanStatusRaw: base.loanStatusRaw,
    userStageRawUpper: base.userStageRawUpper,
    hasOffer: extras.hasOffer,
    loan: extras.loan,
    applicationNumber,
  };
}

export function buildHeroHomeCard(
  activeLoan: GetExistingActiveLoanResponse | null | undefined,
  userStage: { stage?: string } | null | undefined
): HeroHomeResolvedCard {
  const hasActiveLoan = activeLoan?.hasActiveLoan ?? false;
  const loan = activeLoan?.loan;
  const loanStatusRaw = activeLoan?.loanStatus ?? loan?.status ?? "";
  const loanStatusLower = loanStatusRaw.toLowerCase();
  const userStageRawUpper = (userStage?.stage ?? "").toUpperCase();
  const parsedStage = parseUserStage(userStage?.stage);
  const journeyProgress = getJourneyProgressFromUserStage(userStage);

  const caseInput = {
    hasActiveLoan,
    loan,
    loanStatusLower,
    loanStatusRaw,
    userStageRawUpper,
    parsedStage,
  };
  const { branch, reason } = evaluateHeroHomeBranch(caseInput);

  const resolvedBase = {
    hasActiveLoan,
    loan,
    loanStatusRaw,
    loanStatusLower,
    userStageRawUpper,
    parsedStage,
    journeyProgress,
  };

  switch (branch) {
    case 1: {
      const copy = buildCopyForStage(parsedStage, parsedStage, loan!, loanStatusLower);
      return buildResolvedCard({ ...resolvedBase, copy, reason }, { hasOffer: true, loan: loan! });
    }
    case 2: {
      const copy = buildCopyForStage(parsedStage, UserStagesInBackend.ACTIVE_LOAN_DASHBOARD, loan!, loanStatusLower);
      return buildResolvedCard({ ...resolvedBase, copy, reason }, { loan: loan! });
    }
    case 3: {
      const copy = buildCopyForStage(parsedStage, UserStagesInBackend.ACTIVE_LOAN_DASHBOARD, loan!, loanStatusLower);
      return buildResolvedCard({ ...resolvedBase, copy, reason }, { hasOffer: false, loan: loan! });
    }
    case 4: {
      const copy = buildCopyForStage(parsedStage, parsedStage, loan, loanStatusLower);
      return buildResolvedCard({ ...resolvedBase, copy, reason }, {});
    }
    case 5: {
      const copy = buildCopyForStage(parsedStage, parsedStage, loan, loanStatusLower);
      return buildResolvedCard({ ...resolvedBase, copy, reason }, {});
    }
    case 6: {
      const copy = buildCopyForStage(parsedStage, UserStagesInBackend.APPLICATION_STATUS, loan, loanStatusLower);
      return buildResolvedCard({ ...resolvedBase, copy, reason }, {});
    }
    case 7: {
      const copy = buildCopyForStage(parsedStage, parsedStage, undefined, loanStatusLower);
      return buildResolvedCard({ ...resolvedBase, copy, reason }, { hasOffer: false });
    }
    case 8: {
      const copy = buildCopyForStage(parsedStage, parsedStage, undefined, loanStatusLower);
      return buildResolvedCard({ ...resolvedBase, copy, reason }, { hasOffer: false });
    }
    case 9: {
      const copy = buildCopyForStage(parsedStage, parsedStage, undefined, loanStatusLower);
      return buildResolvedCard({ ...resolvedBase, copy, reason }, { hasOffer: false });
    }
    case 10: {
      const copy = buildCopyForStage(parsedStage, parsedStage, loan!, loanStatusLower);
      return buildResolvedCard({ ...resolvedBase, copy, reason }, { hasOffer: false, loan: loan! });
    }
    case 11:
    default: {
      const copy = buildCopyForStage(parsedStage, parsedStage, loan!, loanStatusLower);
      return buildResolvedCard({ ...resolvedBase, copy, reason }, { hasOffer: false, loan: loan! });
    }
  }
}

export function resolveHeroPrimaryActionLabel(resolved: HeroHomeResolvedCard): string {
  const uiCase = getLoggedInHeroUiCase(resolved);
  if (uiCase === "journey_post_offer") {
    if (resolved.hasOffer) {
      return "Accept & Proceed";
    }
    if (resolved.parsedStage === UserStagesInBackend.OFFERINGS) {
      return "Loading Offer...";
    }
    if (resolved.parsedStage === UserStagesInBackend.ACTIVE_LOAN_DASHBOARD) {
      return resolved.copy.actionLabel ?? "Pay Now";
    }
    return resolved.copy.actionLabel ?? "Complete Application";
  }
  if (uiCase === "under_review") {
    return resolved.copy.actionLabel ?? "Track Status";
  }
  if (uiCase === "journey_pre_offer" && resolved.parsedStage === UserStagesInBackend.PERSONAL_DETAILS) {
    return "Start Your Loan Journey";
  }
  return resolved.copy.actionLabel ?? "Complete Application";
}

function mapResolvedToHeroCardType(resolved: HeroHomeResolvedCard): HeroCardType {
  const uiCase = getLoggedInHeroUiCase(resolved);
  switch (uiCase) {
    case "active_loan":
      return "active_loan";
    case "journey_post_offer":
      return "post_offer";
    case "journey_pre_offer":
      return "pre_offer";
    case "under_review":
      return "under_review";
    case "cbl_rejected":
      return "cbl_rejected";
    case "unsupported_stage_download":
      return "under_review_download";
  }
}

export function getHeroCardDecision(
  activeLoan: GetExistingActiveLoanResponse | null | undefined,
  userStage: { stage?: string } | null | undefined
): HeroCardDecision {
  const resolved = buildHeroHomeCard(activeLoan, userStage);
  const decision: HeroCardDecision = {
    card: mapResolvedToHeroCardType(resolved),
    actionLabel: resolveHeroPrimaryActionLabel(resolved),
    reason: resolved.reason,
  };
  logHeroCardDebug("getHeroCardDecision", {
    stage: userStage?.stage,
    hasActiveLoan: activeLoan?.hasActiveLoan,
    loanStatus: activeLoan?.loanStatus ?? activeLoan?.loan?.status,
    hasOffer: resolved.hasOffer,
    heroUiCase: getLoggedInHeroUiCase(resolved),
    decision,
  });
  return decision;
}
