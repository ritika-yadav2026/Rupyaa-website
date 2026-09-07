"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getUserEligibilityExperian, getCurrentOffer, getOfferLoanSubStatus } from "@/lib/eligibility-api";
import { trackBureauPolicyResponseApp } from "@/lib/gtm";
import { useFlowStore } from "@/store/useFlowStore";
import BasicInfoSidebar from "@/components/BasicInfoSidebar";
import BasicInfoFooter from "@/components/BasicInfoFooter";

type Props = { onContinue?: () => void };

function SpinnerIcon({ className = "text-primary" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`animate-spin ${className}`}
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

/**
 * Soft Pull (Experian) screen. Auto-triggers get-user-eligibility-experian on mount.
 * On isAppRedirected: show the download-app banner, do not fetch an offer.
 * On 200 + smsBureauLoanCreated: getCurrentOffer → Offer.
 * On 200 without smsBureauLoanCreated: fall back to default offer screen.
 * On 400 (rejected), or any failure while fetching the offer: show the
 * rejected message — user cannot proceed.
 */
export default function SoftPullScreen({ onContinue }: Props) {
  const [status, setStatus] = useState<"loading" | "rejected" | "done">("loading");
  const setOfferAmount = useFlowStore((s) => s.setOfferAmount);
  const setFlowState = useFlowStore((s) => s.setFlowState);
  const setShowUpdateButton = useFlowStore((s) => s.setShowUpdateButton);
  const setShowDownloadApp = useFlowStore((s) => s.setShowDownloadApp);

  /**
   * Runs the eligibility + offer lookup. Owns its own error handling: a 400
   * rejection or a failed getCurrentOffer call both land here and move the
   * screen to "rejected" — callers don't need to catch anything.
   */
  const checkEligibility = async (isCancelled: () => boolean) => {
    try {
      const experianRes = await getUserEligibilityExperian({ deviceType: "mobile" });
      if (isCancelled()) return;

      const isAppRedirected =
        "isAppRedirected" in experianRes && experianRes.isAppRedirected === true;

      if (isAppRedirected) {
        setShowDownloadApp(true);
        return;
      }

      const analyticsPayload = {
        status: "status" in experianRes ? experianRes.status : undefined,
        decile: "decile" in experianRes ? experianRes.decile : undefined,
        declaredSalary: "salary" in experianRes ? experianRes.salary : undefined,
        empType: "empType" in experianRes ? experianRes.empType : undefined,
        applicationType: 'fresh',
      };

      const smsBureauLoanCreated =
        "smsBureauLoanCreated" in experianRes && experianRes.smsBureauLoanCreated === true;

      if (smsBureauLoanCreated) {
        // No inner try/catch: a failed offer fetch is a real error, not a
        // "fall back to default offer" case, so let it hit the catch below.
        const offerRes = await getCurrentOffer("components/SoftPullScreen.tsx");
        const isReloan = getOfferLoanSubStatus(offerRes);
        const applicationType: 'fresh' | 'reloan' = isReloan ? 'reloan' : 'fresh';
        if (isCancelled()) return;

        const payload = {
          ...analyticsPayload,
          offerAmount: offerRes.offer.offerAmount,
          applicationType,
        };

        trackBureauPolicyResponseApp(payload);

        setOfferAmount(offerRes.offer.offerAmount);
        setShowUpdateButton(offerRes.showUpdateButton ?? false);
        setFlowState("offer");
        onContinue?.();
        return;
      }

      trackBureauPolicyResponseApp({...analyticsPayload, applicationType: 'fresh' as const});
      setOfferAmount(null);
      setShowUpdateButton(false);
      setFlowState("offer");
      onContinue?.();
    } catch (err) {
      if (isCancelled()) return;
      if (process.env.NODE_ENV === "development") {
        console.error("[SoftPull] eligibility error", err);
      }
      setStatus("rejected");
    }
  };

  useEffect(() => {
    if (status !== "loading") return;
    let cancelled = false;

    checkEligibility(() => cancelled);

    return () => {
      cancelled = true;
    };
    // checkEligibility is a new reference every render; including it here would
    // re-run this effect (and refire the API calls) on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, onContinue, setOfferAmount, setFlowState, setShowUpdateButton, setShowDownloadApp]);

  const handleRetry = () => {
    setStatus("loading");
  };

  if (status === "rejected") {
    return (
      <div className="w-full max-w-full sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] min-w-0 mx-auto bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-6 sm:p-8 lg:p-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-red-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Eligibility Check Unsuccessful
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  We couldn&apos;t approve your application at this time. Please try again later or
                  contact support if you have questions.
                </p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-5 py-2.5 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary/5 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
          <div className="lg:w-[320px] xl:w-[380px] shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100">
            <BasicInfoSidebar />
          </div>
        </div>
        <BasicInfoFooter />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] min-w-0 mx-auto bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col items-center justify-center gap-6 min-h-[280px]">
          <div className="w-16 h-16 rounded-full bg-[#e8f5e9] flex items-center justify-center">
            <SpinnerIcon className="text-primary" />
          </div>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Checking eligibility...
            </h2>
            <p className="text-gray-600">
              We&apos;re verifying your details with our credit bureau. This usually takes a few
              seconds.
            </p>
          </div>
        </div>
        <div className="lg:w-[320px] xl:w-[380px] shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100">
          <BasicInfoSidebar />
        </div>
      </div>
      <BasicInfoFooter />
    </div>
  );
}
