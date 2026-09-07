"use client";

import type { GetExistingActiveLoanResponse } from "@/lib/eligibility-api";
import { buildHeroHomeCard } from "@/lib/build-hero-home-card";
import { getLoggedInHeroUiCase } from "@/lib/hero-home-card-case";
import HeroLoggedInCardArea from "@/components/home/HeroLoggedInCardArea";
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
}: HeroLoggedInContentProps) {
  const displayName = firstName?.trim() || "User";
  const isLoading = isLoadingStage || isLoadingLoan;

  const resolved = buildHeroHomeCard(activeLoan, userStage);
  logHeroCardDebug("HeroLoggedInContent.resolved", {
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

  if (isLoading) {
    return (
      <>
     
        <div className="mb-3 sm:mb-5 relative">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 leading-[1.1] tracking-tight text-left">
            Welcome Back, <span className="text-primary">{displayName}!</span>
          </h1>
        </div>
        <p className="text-gray-700 text-xs sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed text-left">
          Control Your Finances With Easy And Secure Loans. Download Our App Now.
        </p>
        <div className="rounded-2xl bg-white border border-gray-200 p-6 flex items-center justify-center min-h-[200px]">
          <div className="animate-pulse flex flex-col gap-2 items-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading your loan status...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>

      <div className="mb-3 sm:mb-5 relative">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-[1.05] tracking-tight text-left">
          Welcome Back,
          <br />
          <span className="text-primary">{displayName}!</span>
        </h1>
      </div>
      <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed text-left max-w-xl">
        Control Your Finances With Easy And Secure Loans. Download Our App Now.
      </p>
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
      {isHeroCardDebugEnabled() ? (
        <HeroDebugPanel userStage={userStage} activeLoan={activeLoan} resolved={resolved} />
      ) : null}
    </>
  );
}
