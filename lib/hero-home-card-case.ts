/**
 * Priority-ordered hero card branch (1–11) matching {@link buildHeroHomeCard} matrix in `build-hero-home-card.ts`.
 */
export type HeroHomeCardBranchId =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11;

/** UI / legacy card shape — use {@link getLoggedInHeroUiCase} instead of storing on `resolved`. */
export type HeroLoggedInCardCase =
  | "active_loan"
  | "journey_pre_offer"
  | "journey_post_offer"
  | "under_review"
  | "cbl_rejected"
  | "unsupported_stage_download";

/** @deprecated Use {@link HeroLoggedInCardCase} */
export type HeroHomeCardKind = HeroLoggedInCardCase;

import type { ActiveLoan } from "@/lib/eligibility-api";
import { WEB_SUPPORTED_STAGES } from "@/lib/hero-web-supported-stages";
import { isUnderReviewLoanStatus } from "@/lib/hero-card-logic";
import {
  isCblOrRejectedUserStage,
  isPreOfferUserStage,
  UserStagesInBackend,
} from "@/lib/user-stage";

const VERIFIED_STATUS = "verified";

const ACTIVE_LOAN_STATUSES = ["approved", "sanctioned", "disbursed", "active", "overdue"] as const;

function isActiveLoanStatus(loanStatusLower: string): boolean {
  return ACTIVE_LOAN_STATUSES.some((s) => loanStatusLower === s);
}

/**
 * True when the active loan has enough data for full {@link ActiveLoanCard} (amount + due date).
 */
export function meetsActiveLoanDashboardCardMatrix(loan: ActiveLoan): boolean {
  if (typeof loan.amount !== "number" || !Number.isFinite(loan.amount)) {
    return false;
  }
  const due = typeof loan.dueDate === "string" ? loan.dueDate.trim() : "";
  return due.length > 0;
}

export type HeroHomeCardCaseInput = {
  hasActiveLoan: boolean;
  loan: ActiveLoan | null | undefined;
  loanStatusLower: string;
  loanStatusRaw: string;
  userStageRawUpper: string;
  parsedStage: UserStagesInBackend;
};

/**
 * Single source for hero branch priority (must stay aligned with `buildHeroHomeCard`).
 */
export function evaluateHeroHomeBranch(input: HeroHomeCardCaseInput): {
  branch: HeroHomeCardBranchId;
  reason: string;
} {
  const { hasActiveLoan, loan, loanStatusLower, loanStatusRaw, userStageRawUpper, parsedStage } = input;
  if (parsedStage === UserStagesInBackend.DOWNLOAD_APP) {
    return { branch: 5, reason: "Stage DOWNLOAD_APP — next step is app-only, prompt download" };
  }
  if (isPreOfferUserStage(parsedStage)) {
    return { branch: 8, reason: `Pre-offer register stage: ${parsedStage}` };
  }
  if (hasActiveLoan && loan && loanStatusLower === VERIFIED_STATUS) {
    return { branch: 1, reason: "Verified offer ready to accept" };
  }

  if (
    hasActiveLoan &&
    loan &&
    parsedStage === UserStagesInBackend.ACTIVE_LOAN_DASHBOARD &&
    isActiveLoanStatus(loanStatusLower) &&
    meetsActiveLoanDashboardCardMatrix(loan)
  ) {
    return {
      branch: 2,
      reason: `Active loan dashboard: loanStatus=${loanStatusLower}, stage=${userStageRawUpper}`,
    };
  }

  if (
    hasActiveLoan &&
    loan &&
    parsedStage === UserStagesInBackend.ACTIVE_LOAN_DASHBOARD &&
    isActiveLoanStatus(loanStatusLower)
  ) {
    return {
      branch: 3,
      reason: `Active loan dashboard: deferring ActiveLoanCard — amount or dueDate missing (loanStatus=${loanStatusLower})`,
    };
  }

  if (isCblOrRejectedUserStage(parsedStage)) {
    return { branch: 4, reason: `Stage ${parsedStage}` };
  }

  if (userStageRawUpper && !WEB_SUPPORTED_STAGES.has(userStageRawUpper)) {
    return {
      branch: 5,
      reason: `Stage ${userStageRawUpper} has no web flow — prompt app download`,
    };
  }

  const pendingLoan = hasActiveLoan && loan && isUnderReviewLoanStatus(loanStatusRaw);
  if (pendingLoan || parsedStage === UserStagesInBackend.APPLICATION_STATUS) {
    return {
      branch: 6,
      reason: pendingLoan ? `Loan under review: loanStatus=${loanStatusRaw}` : "Stage APPLICATION_STATUS",
    };
  }

  if (!hasActiveLoan || !loan) {
    if (parsedStage === UserStagesInBackend.OFFERINGS) {
      return { branch: 7, reason: "Stage OFFERINGS — loan not yet created" };
    }

    return {
      branch: 9,
      reason: `No active loan; non-register stage ${parsedStage}`,
    };
  }

  if (loanStatusLower === "rejected") {
    return { branch: 10, reason: "Loan rejected" };
  }

  return {
    branch: 11,
    reason: `Active loan in progress: loanStatus=${loanStatusLower}, stage=${parsedStage}`,
  };
}

export function heroBranchToLoggedInCase(branch: HeroHomeCardBranchId): HeroLoggedInCardCase {
  switch (branch) {
    case 1:
    case 3:
    case 7:
    case 9:
    case 11:
      return "journey_post_offer";
    case 2:
      return "active_loan";
    case 8:
      return "journey_pre_offer";
    case 4:
    case 10:
      return "cbl_rejected";
    case 5:
      return "unsupported_stage_download";
    case 6:
      return "under_review";
    default:
      return "journey_post_offer";
  }
}

/** Snapshot fields on `HeroHomeResolvedCard` used to re-run the branch matrix. */
export type HeroHomeResolvedCaseInput = {
  readonly parsedStage: UserStagesInBackend;
  readonly hasActiveLoan: boolean;
  readonly loan?: ActiveLoan;
  readonly loanStatusLower: string;
  readonly loanStatusRaw: string;
  readonly userStageRawUpper: string;
};

export function getLoggedInHeroUiCase(resolved: HeroHomeResolvedCaseInput): HeroLoggedInCardCase {

  return heroBranchToLoggedInCase(
    evaluateHeroHomeBranch({
      hasActiveLoan: resolved.hasActiveLoan,
      loan: resolved.loan,
      loanStatusLower: resolved.loanStatusLower,
      loanStatusRaw: resolved.loanStatusRaw,
      userStageRawUpper: resolved.userStageRawUpper,
      parsedStage: resolved.parsedStage,
    }).branch
  );
}
