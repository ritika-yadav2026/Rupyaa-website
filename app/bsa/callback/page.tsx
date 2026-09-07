"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCallbackNotifyApp } from "@/hooks/useCallbackNotifyApp";
import { useNotifyOpenerCallbackComplete } from "@/hooks/useNotifyOpenerCallbackComplete";
import { CALLBACK_FLOWS } from "@/lib/callback-opener-messages";
import { NATIVE_APP_MESSAGE_TYPES } from "@/utils/native-constants";
import { useBankStatementStatus } from "@/hooks/useBankStatementStatus";
import { getCurrentOffer } from "@/lib/eligibility-api";
import { useFlowStore } from "@/store/useFlowStore";

function BankStatementAggregatorIcon() {
  return (
    <svg
      width={320}
      height={320}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      <path d="M3 21h18" />
      <path d="M3 10h18" />
      <path d="M5 6l7-3 7 3" />
      <path d="M4 10v11" />
      <path d="M20 10v11" />
      <path d="M8 14v3 M12 14v3 M16 14v3" />
      <path d="M12 3v4" />
      <path d="M9 12h6" />
    </svg>
  );
}

const BSACallbackContent = () => {
  const router = useRouter();
  const setOfferAmount = useFlowStore((s) => s.setOfferAmount);
  const setFlowState = useFlowStore((s) => s.setFlowState);
  useNotifyOpenerCallbackComplete({ flow: CALLBACK_FLOWS.BSA });
  const { isRedirecting, isMobileSource } = useCallbackNotifyApp({
    messageType: NATIVE_APP_MESSAGE_TYPES.BANK_STATEMENT_SUCCESS,
  });
  const [webState, setWebState] = useState<"processing" | "error">("processing");
  const { pollBankStatementStatus } = useBankStatementStatus();

  useEffect(() => {
    if (isMobileSource) return;

    const stopPolling = pollBankStatementStatus(
      async (_status, callApplyLoan, _key, normalized) => {
        if (callApplyLoan || normalized === "processed") {
          try {
            const offerResponse = await getCurrentOffer("app/bsa/callback/page.tsx");
            setOfferAmount(offerResponse.offer.offerAmount);
            setFlowState("offer");
            router.replace("/personal-loan");
            return;
          } catch {
            setWebState("error");
            return;
          }
        }

        if (
          normalized === "rejected"
          || normalized === "unknown"
          || normalized === "pending"
          || normalized === "in-progress"
        ) {
          setFlowState("under_review");
          router.replace("/personal-loan");
        }
      },
      { scenario: "aa-flow", useStopRules: true }
    );

    return () => stopPolling();
  }, [isMobileSource, pollBankStatementStatus, router, setFlowState, setOfferAmount]);

  if (isMobileSource && isRedirecting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Redirecting to app...</p>
        </div>
      </div>
    );
  }

  if (!isMobileSource && webState === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <p className="text-base font-semibold text-slate-900">
            We couldn&apos;t complete bank verification right now.
          </p>
          <p className="text-sm text-slate-600">
            Please go back to your loan journey and try bank verification again.
          </p>
          <button
            type="button"
            onClick={() => {
              setFlowState("offer");
              router.replace("/personal-loan");
            }}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Go to Bank Verification
          </button>
        </div>
      </div>
    );
  }

  if (!isMobileSource) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">
            Processing your bank verification...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="flex flex-col items-center" aria-label="Bank Statement Aggregator verification">
        <BankStatementAggregatorIcon />
      </div>
    </div>
  );
};

const BSACallbackWrapper = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <BSACallbackContent />
    </Suspense>
  );
};

export default BSACallbackWrapper;
