"use client";

import { useEffect } from "react";
import ConsentWindowOverlay from "@/components/ConsentWindowOverlay";
import { ForeclosureCard } from "@/components/loans/ForeclosureCard";
import { PaymentScreenHeader } from "@/components/loans/PaymentScreenHeader";
import { PaymentSuccessModal } from "@/components/loans/PaymentSuccessModal";
import { useLoanPaymentScreen } from "@/hooks/useLoanPaymentScreen";
import { resolveForeclosureTotalPayable } from "@/helpers/loan-helper";
import { consumeForeclosurePaymentReturnFromCallback } from "@/lib/loan-payment-session";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import ZapcashLoading from "./ZapcashLoading";

export default function ForeclosurePageContent() {
  const {
    loan,
    isLoading,
    error,
    paymentError,
    showSuccessModal,
    paidAmount,
    ctaLoading,
    consentLocked,
    handleForeclosePress,
    handleContinueToHomepage,
    handleSuccessModalClose,
    foreclosurePostCashfreeVerifyKey,
    runForeclosureOrderStatusPoll,
  } = useLoanPaymentScreen({
    title: "Foreclose Your Loan",
    variant: "foreclosure",
    returnPath: "/foreclosure",
    resolveOrderAmount: (l) => resolveForeclosureTotalPayable(l),
    resolveRemainingBaseline: (l, foreclosureAmount) =>
      foreclosureAmount ?? resolveForeclosureTotalPayable(l),
  });

  useEffect(() => {
    if (foreclosurePostCashfreeVerifyKey === 0) return;
    const ac = new AbortController();
    void runForeclosureOrderStatusPoll(ac.signal);
    return () => ac.abort();
  }, [foreclosurePostCashfreeVerifyKey, runForeclosureOrderStatusPoll]);

  useEffect(() => {
    if (!consumeForeclosurePaymentReturnFromCallback()) return;
    const ac = new AbortController();
    void runForeclosureOrderStatusPoll(ac.signal);
    return () => ac.abort();
  }, [runForeclosureOrderStatusPoll]);

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
          <ZapcashLoading />
        </div>
      </>
    )
  }
  const renderContent = () => {

    if (error) {
      return (
        <p className="text-sm text-red-600 text-center py-12" role="alert">
          {error instanceof Error ? error.message : "Failed to load loan."}
        </p>
      )
    }

    if (loan) {
      return (
        <ForeclosureCard
          loan={loan}
          onForeclosePress={handleForeclosePress}
          ctaLoading={ctaLoading || consentLocked}
          ctaError={paymentError}
        />
      )
    }

    return (
      <p className="text-sm text-gray-600 text-center py-12">No active loan found.</p>
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className={`flex flex-1 flex-col py-4 ${appShellContainerClassName}`}>
        <PaymentScreenHeader title="Foreclose Your Loan" />

        {renderContent()}
      </div>

      <PaymentSuccessModal
        visible={showSuccessModal}
        variant="foreclosure"
        amountPaid={paidAmount}
        onContinueToHomepage={handleContinueToHomepage}
        onRequestClose={handleSuccessModalClose}
      />

      <ConsentWindowOverlay
        isOpen={consentLocked}
        title="Complete your payment in the new window"
        description="When the secure window closes, we verify your payment on this page and update your loan."
      />
    </div>
  );
}
