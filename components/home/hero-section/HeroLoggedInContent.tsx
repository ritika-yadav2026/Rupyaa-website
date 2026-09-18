"use client";

import type { ReactElement, ReactNode } from "react";
import type { GetExistingActiveLoanResponse } from "@/lib/eligibility-api";
import { buildHeroHomeCard } from "@/lib/build-hero-home-card";
import { getLoggedInHeroUiCase } from "@/lib/hero-home-card-case";
import HeroLoggedInCardArea from "@/components/home/HeroLoggedInCardArea";
import HeroTrustedBy from "@/components/home/HeroTrustedBy";
import { isHeroCardDebugEnabled, logHeroCardDebug } from "@/lib/hero-card-debug";
import { STRING_CONSTANTS } from "@/utils/app-constants";
import { HeroDebugPanel } from "@/components/home/hero-section/HeroDebugPanel";

export type HeroLoggedInContentProps = {
  firstName: string;
  userStage: { stage: string; bankStatementStatus?: string } | null | undefined;
  activeLoan: GetExistingActiveLoanResponse | null | undefined;
  isLoadingStage: boolean;
  isLoadingLoan: boolean;
  isRefreshingHeroData: boolean;
  journeyCardRemountKey: number;
  onRefreshStatus: () => void;
  showCancelLoanEntry?: boolean;
  canCancelLoan?: boolean;
  onCancelLoanPress?: () => void;
};

/**
 * Logged-in home hero: marketing headline + resolved journey / limit card.
 */
export function HeroLoggedInContent({
  firstName,
  userStage,
  activeLoan,
  isLoadingStage,
  isLoadingLoan,
  isRefreshingHeroData,
  journeyCardRemountKey,
  onRefreshStatus,
  showCancelLoanEntry = false,
  canCancelLoan = false,
  onCancelLoanPress,
}: HeroLoggedInContentProps): ReactElement {
  const isLoading = isLoadingStage || isLoadingLoan;
  const resolved = buildHeroHomeCard(activeLoan, userStage);
  logHeroCardDebug("HeroLoggedInContent.resolved", {
    firstName,
    stage: userStage?.stage,
    hasActiveLoan: activeLoan?.hasActiveLoan,
    loanStatus: activeLoan?.loanStatus ?? activeLoan?.loan?.status,
    hasOffer: resolved.hasOffer,
    heroUiCase: getLoggedInHeroUiCase(resolved),
    parsedStage: resolved.parsedStage,
    reason: resolved.reason,
  });

  const handleAcceptOffer = (): void => {
    window.location.href = STRING_CONSTANTS.PLAY_STORE_URL;
  };

  let cardArea: ReactNode;
  if (isLoading) {
    cardArea = (
      <div
        className="flex min-h-[200px] w-full items-center justify-center rounded-[1.35rem] border border-white/70 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-md sm:rounded-[1.5rem]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 252, 245, 0.88) 100%)",
        }}
      >
        <div className="flex animate-pulse flex-col items-center gap-2">
          <div className="size-8 animate-spin rounded-full border-2 border-button border-t-transparent" />
          <p className="text-sm text-gray-500">Loading your loan status...</p>
        </div>
      </div>
    );
  } else {
    cardArea = (
      <HeroLoggedInCardArea
        resolved={resolved}
        journeyCardRemountKey={journeyCardRemountKey}
        onAcceptOffer={handleAcceptOffer}
        onRefreshStatus={onRefreshStatus}
        isRefreshingHeroData={isRefreshingHeroData}
        showCancelLoanEntry={showCancelLoanEntry}
        canCancelLoan={canCancelLoan}
        onCancelLoanPress={onCancelLoanPress}
      />
    );
  }

  let debugPanel: ReactNode = null;
  if (isHeroCardDebugEnabled()) {
    debugPanel = (
      <HeroDebugPanel userStage={userStage} activeLoan={activeLoan} resolved={resolved} />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col items-center text-center sm:max-w-[640px]">
      <HeroTrustedBy />
      <h1 className="mt-3 text-[2.1rem] font-extrabold leading-[1.1] tracking-tight text-[#111827] sm:mt-4 sm:text-5xl md:text-6xl lg:text-[4.5rem]">
        Choti si need,
        <br />
        Badi si Smile.
      </h1>
      <div className="mt-8 w-full max-w-[520px] sm:mt-8 lg:mt-6">{cardArea}</div>
      {debugPanel}
    </div>
  );
}
