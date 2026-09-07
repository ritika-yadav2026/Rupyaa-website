"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import { useAuthPersistHydrated } from "@/hooks/useAuthPersistHydrated";
import { useCreditScoreFlow } from "@/hooks/useCreditScoreFlow";
import { useAuthStore } from "@/store/useAuthStore";
import CreditScoreForm from "@/components/credit-score/CreditScoreForm";
import CreditScoreFetching from "@/components/credit-score/CreditScoreFetching";
import CreditScoreReport from "@/components/credit-score/CreditScoreReport";
import CreditScoreGuide from "@/components/credit-score/CreditScoreGuide";
import EquifaxFullReport from "@/components/credit-score/EquifaxFullReport";
import type { CreditScoreFormValues } from "@/lib/credit-score-api";

/**
 * Normalizes stored auth phone values to a 10-digit Indian mobile number.
 */
function extractIndianMobileDigits(phone: string | null): string {
  if (!phone) {
    return "";
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

/**
 * Entry point for the free credit score experience. Renders the current step of
 * the Equifax pull journey and delegates state to {@link useCreditScoreFlow}.
 */
export default function CreditScorePage() {
  const flow = useCreditScoreFlow();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const authPhone = useAuthStore((state) => state.phone);
  const hasHydrated = useAuthPersistHydrated();
  const lockedMobileNumber =
    hasHydrated && isLoggedIn ? extractIndianMobileDigits(authPhone) : "";
  const isMobileLocked = lockedMobileNumber.length === 10;
  if (flow.step === "fetching") {
    return <CreditScoreFetching isPending={flow.isPending} onComplete={flow.completeFetching} />;
  }
  let content: ReactNode;
  if (flow.step === "report" && flow.result) {
    content = (
      <CreditScoreReport
        data={flow.result.data}
        onStartOver={flow.startOver}
        onUnlockReport={flow.unlockReport}
      />
    );
  } else if (flow.step === "fullReport" && flow.result) {
    content = (
      <EquifaxFullReport
        data={flow.result.data}
        pdfUrl={flow.result.pdfUrl}
        onBack={flow.backToReport}
      />
    );
  } else {
    const initialValues: Partial<CreditScoreFormValues> = {
      ...(flow.formValues ?? undefined),
    };
    if (isMobileLocked) {
      initialValues.mobileNumber = lockedMobileNumber;
    }
    content = (
      <>
        <div id="widget">
          <CreditScoreForm
            onSubmit={flow.submitForm}
            isSubmitting={flow.isPending}
            initialValues={initialValues}
            isMobileLocked={isMobileLocked}
          />
        </div>
        <CreditScoreGuide />
      </>
    );
  }
  return (
    <div className="-mt-0 min-h-full bg-[#f4f7f4]">
      <div className={`${appShellContainerClassName} py-8 sm:py-10 lg:py-12`}>{content}</div>
    </div>
  );
}
