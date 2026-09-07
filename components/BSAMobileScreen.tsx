"use client";

import { useEffect, useMemo } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import BasicInfoSidebar from "@/components/BasicInfoSidebar";
import BasicInfoFooter from "@/components/BasicInfoFooter";
import BankStatementVerification from "@/components/BankStatementVerification";
import BankConnectFetchingContent from "@/components/home/BankConnectFetchingContent";
import {
  BSA_AA_BULLETS,
  BSA_AA_MOBILE_LABEL_SALARY_ACCOUNT,
  BSA_AA_SUBTITLE,
  BSA_AA_TITLE,
  BSA_MANUAL_CARD_TITLE,
  BSA_PRIMARY_CTA,
  BSA_REDIRECT_FOOTNOTE,
} from "@/lib/bank-connect-ui";
import ShieldCheckBullet from "@/components/home/ShieldCheckBullet";
import { useBankConnectStepController } from "@/hooks/useBankConnectStepController";
import { getManualUploadStatementRangeDescription } from "@/utils/bankStatementPeriod";
import { logBankConnectDebug } from "@/lib/bank-connect";

type Props = { onContinue?: () => void };

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BSAMobileScreen({ onContinue }: Props) {
  const offerAmount = useFlowStore((s) => s.offerAmount);
  const cameFromOfferings = useFlowStore((s) => s.cameFromOfferings);
  const setFlowState = useFlowStore((s) => s.setFlowState);
  const {
    mobile,
    setMobile,
    error,
    attemptState,
    manualUploadAvailable,
    isLoadingAttempts,
    showManualUpload,
    setShowManualUpload,
    isOpeningConsent,
    uiPhase,
    bsaLoadingOverlay,
    handleStartBsa,
    handleManualUploadStatusReady,
  } = useBankConnectStepController({ onContinue });

  const canShowManualAction = manualUploadAvailable;
  const hasCurrentOffer = typeof offerAmount === "number" && Number.isFinite(offerAmount);
  const isBsaLoading = bsaLoadingOverlay.visible;
  const primaryButtonDisabled = isLoadingAttempts || isOpeningConsent || isBsaLoading;

  useEffect(() => {
    logBankConnectDebug("renderOptions", {
      cameFromOfferings,
      attemptState,
      isLoadingAttempts,
      canShowManualAction,
      showManualUpload,
      hasCurrentOffer,
    });
  }, [
    attemptState,
    cameFromOfferings,
    canShowManualAction,
    hasCurrentOffer,
    isLoadingAttempts,
    showManualUpload,
  ]);

  const primaryButtonLabel = useMemo(() => {
    if (isOpeningConsent) return "Opening bank consent…";
    if (uiPhase === "active_wait") return "Complete consent in new window…";
    return BSA_PRIMARY_CTA;
  }, [isOpeningConsent, uiPhase]);

  const handleManualUploadComplete = () => {
    onContinue?.();
  };

  const handleManualUploadUnderReview = () => {
    setFlowState("under_review");
  };

  const formattedOfferAmount = hasCurrentOffer
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(offerAmount as number)
    : null;

  if (bsaLoadingOverlay.visible) {
    return (
      <div className="w-full max-w-full sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] min-w-0 mx-auto">
        <BankConnectFetchingContent
          visible
          message={bsaLoadingOverlay.title}
          subtext={bsaLoadingOverlay.subtitle}
          needOverlay
        />
      </div>
    );
  }

  if (showManualUpload) {
    return (
      <div className="w-full max-w-full sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] min-w-0 mx-auto">
        <BankStatementVerification
          showContinueToOffers={true}
          onContinueAnyway={handleManualUploadUnderReview}
          onStatusReady={handleManualUploadStatusReady}
        />
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-full sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] min-w-0 mx-auto bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-6 sm:p-8 lg:p-10">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{BSA_AA_TITLE}</h2>
              <p className="mt-1 text-sm text-gray-600">{BSA_AA_SUBTITLE}</p>
              
            </div>

            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                void handleStartBsa();
              }}
            >
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-2">
                <label htmlFor="bsa-mobile" className="text-sm font-semibold text-gray-900">
                  Mobile number (linked to your{" "}
                  <span className="font-bold text-primary">{BSA_AA_MOBILE_LABEL_SALARY_ACCOUNT}</span>)
                </label>
                <div className="flex items-center rounded-xl border-2 border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <span className="pl-4 pr-3 text-gray-700 font-medium border-r border-gray-200">
                    +91
                  </span>
                  <input
                    id="bsa-mobile"
                    type="tel"
                    inputMode="numeric"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-3 rounded-r-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                {BSA_AA_BULLETS.map((point) => (
                  <ShieldCheckBullet key={point}>{point}</ShieldCheckBullet>
                ))}
              </div>

              <button
                type="submit"
                disabled={primaryButtonDisabled}
                className="w-full min-h-[72px] px-4 py-3.5 flex items-center justify-center rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {primaryButtonLabel}
              </button>

              {canShowManualAction && (
                <div className="flex items-center gap-3" aria-hidden>
                  <span className="h-px flex-1" />
                  <span className="text-sm text-gray-500 shrink-0">— or —</span>
                  <span className="h-px flex-1" />
                </div>
              )}

              {canShowManualAction && (
                <button
                  type="button"
                  onClick={() => setShowManualUpload(true)}
                  className="w-full text-left rounded-xl border-2 border-gray-200 px-4 py-3.5 transition-colors flex items-center gap-3 min-h-[72px]"
                >
                  <div className="flex-1 min-w-0 text-gray-900">
                    <p className="font-semibold mb-1">{BSA_MANUAL_CARD_TITLE}</p>
                    <span className="text-sm ">{getManualUploadStatementRangeDescription()}</span>
                  </div>
                  <ChevronRight className="shrink-0 text-primary" />
                </button>
              )}

              {canShowManualAction && formattedOfferAmount && (
                <button
                  type="button"
                  onClick={handleManualUploadComplete}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-primary/30 transition-colors"
                >
                  <p className="font-semibold text-gray-900">Keep my current offer</p>
                  <p className="text-sm text-gray-700">Continue with {formattedOfferAmount}</p>
                </button>
              )}
            </form>

            <p className="mt-4 text-xs text-gray-500">{BSA_REDIRECT_FOOTNOTE}</p>
          </div>

          <div className="lg:w-[320px] xl:w-[380px] shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100">
            <BasicInfoSidebar />
          </div>
        </div>

        <BasicInfoFooter />
      </div>
    </>
  );
}
