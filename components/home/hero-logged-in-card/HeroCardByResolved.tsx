"use client";

import type { ReactNode } from "react";
import { ActiveLoanHeroCard } from "@/components/home/ActiveLoanHeroCard";
import HeroCblRejectedCard from "@/components/home/HeroCblRejectedCard";
import HeroJourneyProgress from "@/components/home/HeroJourneyProgress";
import { PostOfferCard } from "@/components/home/PostOfferCard";
import { PreOfferCard } from "@/components/home/PreOfferCard";
import UnderReviewDownloadCard from "@/components/home/UnderReviewDownloadCard";
import { logHeroLoggedInBranch } from "@/components/home/hero-logged-in-card/hero-logged-in-card-log";
import { getJourneyRenderMeta } from "@/components/home/hero-logged-in-card/get-journey-render-meta";
import type { DisplayLoan } from "@/types/hero-logged-in-card";
import type { HeroHomeResolvedCard } from "@/lib/build-hero-home-card";
import { getLoggedInHeroUiCase } from "@/lib/hero-home-card-case";
import { isLoanOverdue } from "@/lib/format-utils";
import { logHeroCardDebug } from "@/lib/hero-card-debug";
import UnderReviewCard from "@/components/UnderReviewCard";

export type HeroCardByResolvedProps = {
  resolved: HeroHomeResolvedCard;
  journeyCardRemountKey: number;
  onAcceptOffer: () => void;
  onRefreshStatus?: () => void;
  isRefreshingHeroData?: boolean;
  showCancelLoanEntry?: boolean;
  canCancelLoan?: boolean;
  onCancelLoanPress?: () => void;
};

/**
 * Maps `getLoggedInHeroUiCase(resolved)` + `parsedStage` (from `lib/build-hero-home-card.ts`) to card UI.
 * Returns `null` when no branch matches so the parent can omit layout entirely.
 */
export function resolveHeroCardNode({
  resolved,
  journeyCardRemountKey,
  onAcceptOffer,
  onRefreshStatus,
  isRefreshingHeroData = false,
  showCancelLoanEntry = false,
  canCancelLoan = false,
  onCancelLoanPress,
}: HeroCardByResolvedProps): ReactNode {
  const { copy, journeyProgress } = resolved;
  const heroUiCase = getLoggedInHeroUiCase(resolved);
  const journeyMeta = getJourneyRenderMeta(resolved);

  logHeroCardDebug("HeroCardByResolved.enter", {
    heroUiCase,
    parsedStage: resolved.parsedStage,
    reason: resolved.reason,
    hasOffer: journeyMeta.hasOffer,
    applicationNumber: resolved.applicationNumber,
    loanStatus: resolved.loan?.status,
    loanAmount: resolved.loan?.amount,
  });

  if (heroUiCase === "active_loan" && resolved.loan) {
    const loan = resolved.loan as DisplayLoan;
    logHeroLoggedInBranch("active_loan", {
      loanId: loan._id,
      amount: loan.amount,
      overdue: isLoanOverdue(loan),
    });
    return (
      <ActiveLoanHeroCard
        loan={loan}
        actionLabel={copy.actionLabel ?? journeyMeta.actionLabel ?? "Pay Now"}
        showCancelLoanEntry={showCancelLoanEntry}
        canCancelLoan={canCancelLoan}
        onCancelLoanPress={onCancelLoanPress}
      />
    );
  }

  if (heroUiCase === "under_review") {
    logHeroLoggedInBranch("under_review", {
      applicationNumber: resolved.applicationNumber,
    });
    return (
      <>
        <UnderReviewCard
          applicationNumber={resolved.applicationNumber}
          onRefresh={() => onRefreshStatus?.()}
          isRefreshing={isRefreshingHeroData}
        />
      </>
    );
  }

  if (heroUiCase === "unsupported_stage_download") {
    logHeroLoggedInBranch("unsupported_stage_download", { parsedStage: resolved.parsedStage });
    return (
      <UnderReviewDownloadCard
        variant="download"
        title="Continue on the ZapCash app"
        description="This step is available in our mobile app. Download the app to continue your loan journey."
      />
    );
  }

  if (heroUiCase === "cbl_rejected") {
    logHeroLoggedInBranch("cbl_rejected", {});
    return (
      <HeroCblRejectedCard title={copy.title} heading={copy.heading} description={copy.description} />
    );
  }

  /**
   * Journey: `journey_pre_offer` vs `journey_post_offer` from `getLoggedInHeroUiCase` / `evaluateHeroHomeBranch`.
   * Pre-offer — registration funnel + eligibility CTA. Post-offer — sanctioned summary + accept/continue.
   * `HeroCardResponsiveLayout` handles placement only.
   */
  if (heroUiCase === "journey_pre_offer" || heroUiCase === "journey_post_offer") {
    const hideStepper = copy.hideProgressStepper === true;
    const postOfferProgress = hideStepper ? null : (
      <HeroJourneyProgress currentStepIndex={journeyProgress.currentStepIndex} />
    );
    const preOfferProgress = hideStepper ? null : (
      <HeroJourneyProgress
        currentStepIndex={journeyProgress.currentStepIndex}
        accentColor="#2E5C32"
        trackRemainColor="#E5E7EB"
      />
    );

    if (journeyMeta.isPreOffer) {
      logHeroLoggedInBranch("journey_pre_offer", {
        hideProgressStepper: hideStepper,
        actionLabel: journeyMeta.actionLabel,
      });
      return (
        <PreOfferCard
          title={copy.title}
          heading={copy.heading}
          description={copy.description}
          statusPill={journeyMeta.statusPillLabel}
          actionLabel={journeyMeta.actionLabel}
          actionHref="/personal-loan"
          footerMessage="No impact on credit score"
        >
          <div className="mt-6 flex flex-wrap gap-2 sm:gap-2.5">
            <span className="inline-flex items-center rounded-full border border-[#A8C6B0]/70 bg-[#D4E7D7]/50 px-3 py-1.5 text-[11px] font-semibold text-[#2E5C32]">
              Zero Foreclosure Charges
            </span>
            <span className="inline-flex items-center rounded-full border border-[#A8C6B0]/70 bg-[#D4E7D7]/50 px-3 py-1.5 text-[11px] font-semibold text-[#2E5C32]">
              No Paperwork
            </span>
          </div>
          <div className="mt-5 sm:mt-6">{preOfferProgress}</div>
        </PreOfferCard>
      );
    }

    const loanForDisplay = resolved.loan as DisplayLoan | undefined;
    const tenureLabel =
      typeof loanForDisplay?.tenure === "string" && loanForDisplay.tenure.trim().length > 0
        ? loanForDisplay.tenure.trim()
        : undefined;

    logHeroLoggedInBranch("journey_post_offer", {
      hideProgressStepper: hideStepper,
      shouldHandleOfferAccept: journeyMeta.shouldHandleOfferAccept,
      disablePostOfferAction: journeyMeta.disablePostOfferAction,
      applicationNumber: resolved.applicationNumber,
      remountKey: journeyCardRemountKey,
    });

    return (
      <PostOfferCard
        key={journeyCardRemountKey}
        title={copy.title}
        applicationNumber={resolved.applicationNumber}
        amount={loanForDisplay?.amount}
        tenure={tenureLabel}
        totalPayable={loanForDisplay?.totalPayable}
        actionLabel={journeyMeta.actionLabel}
        hideAction={copy.hideAction === true}
        disableAction={journeyMeta.disablePostOfferAction}
        onRefreshPress={onRefreshStatus}
        isRefreshing={isRefreshingHeroData}
        showCancelLoanEntry={showCancelLoanEntry}
        canCancelLoan={canCancelLoan}
        onCancelLoanPress={onCancelLoanPress}
      >
        {postOfferProgress}
      </PostOfferCard>
    );
  }

  logHeroLoggedInBranch("none", { heroUiCase, parsedStage: resolved.parsedStage });
  return null;
}

/** Thin wrapper if you need a component ref; prefer `resolveHeroCardNode` for null checks. */
export function HeroCardByResolved(props: HeroCardByResolvedProps): ReactNode {
  return resolveHeroCardNode(props);
}
