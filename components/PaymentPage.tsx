"use client";

import ConsentWindowOverlay from "@/components/ConsentWindowOverlay";
import { PaymentCard } from "@/components/loans/PaymentCard";
import { PaymentScreenHeader } from "@/components/loans/PaymentScreenHeader";
import { PaymentSuccessModal } from "@/components/loans/PaymentSuccessModal";
import { useLoanPaymentScreen } from "@/hooks/useLoanPaymentScreen";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import ZapcashLoading from "./ZapcashLoading";
export default function PaymentPage() {
  const {
    loan,
    isLoading,
    error,
    paymentError,
    showSuccessModal,
    paidAmount,
    remainingBalance,
    customAmountResetKey,
    ctaLoading,
    consentLocked,
    handlePaymentPress,
    handleContinueToHomepage,
    handleSuccessModalClose,
  } = useLoanPaymentScreen({
    title: "Make Payment",
    variant: "payment",
    returnPath: "/payment",
    resolveOrderAmount: (l) => l.amountDue ?? 0,
    resolveRemainingBaseline: (l) => l.amountDue ?? 0,
  });

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
        <PaymentCard
          loan={loan}
          onPaymentPress={handlePaymentPress}
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
        <PaymentScreenHeader title="Make Payment" />

        {renderContent()}

      </div>

      <PaymentSuccessModal
        visible={showSuccessModal}
        variant="payment"
        amountPaid={paidAmount}
        remainingBalance={remainingBalance}
        onContinueToHomepage={handleContinueToHomepage}
        onRequestClose={handleSuccessModalClose}
      />

      <ConsentWindowOverlay
        isOpen={consentLocked}
        title="Complete your payment in the new window"
        description="When the secure window closes, we verify your payment on this page and update your loan balance."
      />
    </div>
  );
}
