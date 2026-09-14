"use client";

import type { ReactNode } from "react";
import BasicInfoSidebar from "@/components/BasicInfoSidebar";
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

function CreditScoreSection({ children }: { readonly children: ReactNode }) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-20">
      <div className="min-w-0">{children}</div>
      <div className="hidden h-[660px] lg:block">
        <BasicInfoSidebar />
      </div>
    </div>
  );
}

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
      <CreditScoreSection>
        <CreditScoreReport
          data={flow.result.data}
          onStartOver={flow.startOver}
          onUnlockReport={flow.unlockReport}
        />
      </CreditScoreSection>
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
        <CreditScoreSection>
          <div id="widget">
            <CreditScoreForm
              onSubmit={flow.submitForm}
              isSubmitting={flow.isPending}
              initialValues={initialValues}
              isMobileLocked={isMobileLocked}
            />
          </div>
        </CreditScoreSection>
        <div className="mt-10 sm:mt-14">
          <CreditScoreSection>
            <CreditScoreGuide />
          </CreditScoreSection>
        </div>
      </>
    );
  }
  return (
    <div className="-mt-0 min-h-full bg-white">
      <div className={`${appShellContainerClassName} py-8 sm:py-10 lg:py-12`}>{content}</div>
    </div>
  );
}
