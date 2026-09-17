"use client";

import type { ReactNode } from "react";
import { ActiveLoanHeroCard } from "@/components/home/ActiveLoanHeroCard";
import HeroCblRejectedCard from "@/components/home/HeroCblRejectedCard";
import HeroJourneyProgress from "@/components/home/HeroJourneyProgress";
import { PostOfferCard } from "@/components/home/PostOfferCard";
import HeroLimitCard from "@/components/home/HeroLimitCard";
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
 * Maps `getLoggedInHeroUiCase(resolved)` to the matching logged-in hero status card.
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
      <UnderReviewCard
        applicationNumber={resolved.applicationNumber}
        onRefresh={() => onRefreshStatus?.()}
        isRefreshing={isRefreshingHeroData}
      />
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
    return <HeroCblRejectedCard />;
  }

  if (heroUiCase === "journey_pre_offer") {
    logHeroLoggedInBranch("journey_pre_offer", {
      actionLabel: "Apply for Loan",
    });
    return <HeroLimitCard actionLabel="Apply for Loan" actionHref="/personal-loan" />;
  }

  if (heroUiCase === "journey_post_offer") {
    const hideStepper = copy.hideProgressStepper === true;
    const loanForDisplay = resolved.loan as DisplayLoan | undefined;
    const tenureLabel =
      typeof loanForDisplay?.tenure === "string" && loanForDisplay.tenure.trim().length > 0
        ? loanForDisplay.tenure.trim()
        : undefined;
    const isAcceptVariant = journeyMeta.shouldHandleOfferAccept === true;

    let progress: ReactNode = null;
    if (!hideStepper && !isAcceptVariant) {
      progress = (
        <HeroJourneyProgress currentStepIndex={journeyProgress.currentStepIndex} />
      );
    }

    logHeroLoggedInBranch("journey_post_offer", {
      hideProgressStepper: hideStepper,
      shouldHandleOfferAccept: journeyMeta.shouldHandleOfferAccept,
      disablePostOfferAction: journeyMeta.disablePostOfferAction,
      applicationNumber: resolved.applicationNumber,
      remountKey: journeyCardRemountKey,
      variant: isAcceptVariant ? "accept" : "journey",
    });

    return (
      <PostOfferCard
        key={journeyCardRemountKey}
        title={copy.title}
        applicationNumber={resolved.applicationNumber}
        amount={loanForDisplay?.amount}
        tenure={tenureLabel}
        totalPayable={loanForDisplay?.totalPayable}
        actionLabel={isAcceptVariant ? "Accept Offer" : journeyMeta.actionLabel}
        hideAction={copy.hideAction === true}
        disableAction={journeyMeta.disablePostOfferAction}
        onActionPress={isAcceptVariant ? onAcceptOffer : undefined}
        onRefreshPress={onRefreshStatus}
        isRefreshing={isRefreshingHeroData}
        showCancelLoanEntry={showCancelLoanEntry}
        canCancelLoan={canCancelLoan}
        onCancelLoanPress={onCancelLoanPress}
        variant={isAcceptVariant ? "accept" : "journey"}
        ctaHref="/personal-loan"
      >
        {progress}
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
