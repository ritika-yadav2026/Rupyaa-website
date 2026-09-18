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

type CreditScoreLayoutProps = {
  readonly children: ReactNode;
};

/**
 * Desktop: fixed viewport — left column scrolls, one sticky sidebar.
 * Mobile: natural page stack (content then promo).
 */
function CreditScoreLayout({ children }: CreditScoreLayoutProps) {
  return (
    <div
      className={`${appShellContainerClassName} box-border flex flex-col py-4 sm:py-6 lg:h-[calc(100dvh-4rem)] lg:max-h-[calc(100dvh-4rem)] lg:overflow-hidden`}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row lg:gap-8 lg:overflow-hidden xl:gap-12">
        <div className="min-w-0 w-full lg:min-h-0 lg:flex-1 lg:overflow-x-hidden lg:overflow-y-auto lg:overscroll-contain">
          {children}
        </div>
        <div className="w-full shrink-0 lg:h-full lg:min-h-0 lg:w-[300px] xl:w-[340px]">
          <div className="h-auto min-h-[420px] w-full lg:h-full lg:min-h-0">
            <BasicInfoSidebar />
          </div>
        </div>
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
      <CreditScoreLayout>
        <CreditScoreReport
          data={flow.result.data}
          onStartOver={flow.startOver}
          onUnlockReport={flow.unlockReport}
        />
      </CreditScoreLayout>
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
      <CreditScoreLayout>
        <div id="widget">
          <CreditScoreForm
            onSubmit={flow.submitForm}
            isSubmitting={flow.isPending}
            initialValues={initialValues}
            isMobileLocked={isMobileLocked}
          />
        </div>
        <div className="mt-10 sm:mt-14">
          <CreditScoreGuide />
        </div>
      </CreditScoreLayout>
    );
  }
  return <div className="min-h-full bg-white">{content}</div>;
}
