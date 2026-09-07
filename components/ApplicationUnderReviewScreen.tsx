"use client";

import { useState, useEffect } from "react";
import { getCurrentOffer } from "@/lib/eligibility-api";
import { useBankStatementStatus } from "@/hooks/useBankStatementStatus";
import { useFlowStore } from "@/store/useFlowStore";

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export default function ApplicationUnderReviewScreen() {
  const setOfferAmount = useFlowStore((s) => s.setOfferAmount);
  const setFlowState = useFlowStore((s) => s.setFlowState);
  const [pollingFailed, setPollingFailed] = useState(false);
  const { pollBankStatementStatus } = useBankStatementStatus();

  useEffect(() => {
    if (pollingFailed) return;
    const stopPolling = pollBankStatementStatus(
      (status, callApplyLoan) => {
        if (callApplyLoan) {
          getCurrentOffer("components/ApplicationUnderReviewScreen.tsx poll")
            .then((res) => {
              setOfferAmount(res.offer.offerAmount);
              setFlowState("offer");
            })
            .catch(() => {
              /* Keep polling */
            });
          return;
        }
        if (status === "Error") {
          setPollingFailed(true);
        }
      },
      { scenario: "aa-flow", useStopRules: true }
    );
    return () => stopPolling();
  }, [pollBankStatementStatus, setOfferAmount, setFlowState, pollingFailed]);

  const handleReinitiate = () => {
    setOfferAmount(null);
    setFlowState("offer");
  };

  if (pollingFailed) {
    return (
      <div className="w-full max-w-full sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] min-w-0 mx-auto bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 sm:p-8 md:p-10">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Processing didn&apos;t complete
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            We couldn&apos;t finish verifying your application in time. You can continue with our default offer.
          </p>
          <button
            type="button"
            onClick={handleReinitiate}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px]"
          >
            View Offer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] min-w-0 mx-auto bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 sm:p-8 md:p-10">
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#e8f5e9] flex items-center justify-center mb-6">
          <CheckIcon />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Your application is under review
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          We are processing your bank statement. You will see your loan offer here once the review
          is complete. This usually takes a few minutes.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
          <span>Processing...</span>
        </div>
      </div>
    </div>
  );
}
