"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useExternalFlowConsentLock } from "@/hooks/useExternalFlowConsentLock";
import { CALLBACK_FLOWS } from "@/lib/callback-opener-messages";
import { generateAndSendPaymentLink, pollPaymentStatus } from "@/lib/payment-api";
import {
  clearLoanPaymentPending,
  consumeLoanPaymentResult,
  getLoanPaymentPending,
  setLoanPaymentResult,
} from "@/lib/loan-payment-session";
import { openCenteredExternalFlowPopup } from "@/lib/open-external-flow-popup";
import type { PaymentSuccessVariant } from "@/lib/payment-ui-constants";
import type { Loan } from "@/lib/eligibility-api";
import { useGetExistingActiveLoanWithPaidRedirect } from "@/services/loans/useGetExistingActiveLoanWithPaidRedirect";

type UseLoanPaymentScreenOptions = {
  title: string;
  variant: PaymentSuccessVariant;
  returnPath: string;
  resolveOrderAmount: (loan: Loan) => number;
  resolveRemainingBaseline: (loan: Loan, foreclosureAmount?: number) => number;
};

export function useLoanPaymentScreen({
  variant,
  resolveOrderAmount,
}: UseLoanPaymentScreenOptions) {
  const router = useRouter();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const activeLoanQuery = useGetExistingActiveLoanWithPaidRedirect({
    suppressPaidRedirect: showSuccessModal,
  });
  const [paidAmount, setPaidAmount] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [customAmountResetKey, setCustomAmountResetKey] = useState(0);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [foreclosurePostCashfreeVerifyKey, setForeclosurePostCashfreeVerifyKey] = useState(0);

  const loan = activeLoanQuery.data?.loan ?? null;

  const isLoading =
    activeLoanQuery.isPending ||
    activeLoanQuery.shouldRedirectToHome ||
    (activeLoanQuery.isFetching && activeLoanQuery.data == null);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        setCustomAmountResetKey((k) => k + 1);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const applyPaymentResult = useCallback(
    (amount: number, baseline: number) => {
      setPaidAmount(amount);
      setRemainingBalance(Math.max(0, baseline - amount));
      setShowSuccessModal(true);
    },
    [],
  );

  const finishPaymentFromSession = useCallback(() => {
    const result = consumeLoanPaymentResult();
    if (!result || result.variant !== variant) return false;

    if (result.status === "SUCCESS") {
      applyPaymentResult(result.amountPaid, result.baseline);
    } else {
      setPaymentError("Payment failed. Please try again.");
    }
    void activeLoanQuery.refetch();
    return true;
  }, [variant, applyPaymentResult, activeLoanQuery]);

  const runForeclosureOrderStatusPoll = useCallback(async (signal?: AbortSignal) => {
    const pending = getLoanPaymentPending();
    if (!pending?.orderId || pending.variant !== "foreclosure") return;

    try {
      const status = await pollPaymentStatus(pending.orderId, signal);
      const normalized = status === "SUCCESS" ? "SUCCESS" : "FAILED";
      setLoanPaymentResult({
        status: normalized,
        amountPaid: pending.amount,
        baseline: pending.baseline,
        variant: pending.variant,
      });
      clearLoanPaymentPending();
      if (normalized === "SUCCESS") {
        applyPaymentResult(pending.amount, pending.baseline);
      } else {
        setPaymentError("Payment failed. Please try again.");
      }
      void activeLoanQuery.refetch();
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      setLoanPaymentResult({
        status: "FAILED",
        amountPaid: pending.amount,
        baseline: pending.baseline,
        variant: pending.variant,
      });
      clearLoanPaymentPending();
      setPaymentError("Payment failed. Please try again.");
      void activeLoanQuery.refetch();
    }
  }, [applyPaymentResult, activeLoanQuery]);

  const handlePopupFlowEnded = useCallback(() => {
    if (finishPaymentFromSession()) return;

    const pending = getLoanPaymentPending();
    if (pending?.variant === "foreclosure") {
      setForeclosurePostCashfreeVerifyKey((k) => k + 1);
      return;
    }

    if (pending) {
      clearLoanPaymentPending();
      setPaymentError("Payment was cancelled. Please try again.");
    }
    void activeLoanQuery.refetch();
  }, [finishPaymentFromSession, activeLoanQuery]);

  const { locked: consentLocked } = useExternalFlowConsentLock({
    flow: CALLBACK_FLOWS.PAYMENT,
    overlayStaysLockedOnPopupClose: false,
    releaseLockWhenPostMessageArrives: true,
    onPostMessageComplete: () => handlePopupFlowEnded(),
    onPopupClosedWithoutMessage: () => handlePopupFlowEnded(),
  });

  useEffect(() => {
    const result = consumeLoanPaymentResult();
    if (!result || result.variant !== variant) return;
    if (result.status === "SUCCESS") {
      applyPaymentResult(result.amountPaid, result.baseline);
    } else {
      setPaymentError("Payment failed. Please try again.");
    }
    void activeLoanQuery.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per mount when returning from full-window callback
  }, [variant]);

  const handleSuccessModalClose = useCallback(() => {
    setShowSuccessModal(false);
    setCustomAmountResetKey((k) => k + 1);
    void activeLoanQuery.refetch();
  }, [activeLoanQuery]);

  const handleContinueToHomepage = useCallback(() => {
    handleSuccessModalClose();
    router.replace("/");
  }, [handleSuccessModalClose, router]);

  /* const startCheckout = useCallback(
    async (amount: number) => {
      if (!loan?._id) return;
      setPaymentError(null);
      setIsCheckoutLoading(true);
      try {
        await fetchExternalAppConfig();
        const cashfreeMode = await resolveCashfreeEnachMode();
        const orderAmount = resolveOrderAmount(loan);
        const chargeAmount = variant === "foreclosure" ? orderAmount : amount;
        if (chargeAmount <= 0) {
          throw new Error("Invalid payment amount. Please refresh and try again.");
        }

        const data = await createPaymentOrder({
          loanId: loan._id,
          amount: chargeAmount,
        });

        const baseline = resolveRemainingBaseline(loan, orderAmount);
        const pending: LoanPaymentPendingSession = {
          orderId: data.order_id,
          amount: chargeAmount,
          baseline,
          variant,
          returnPath,
        };
        setLoanPaymentPending(pending);

        await prepareOpenPopup();
        const popup = openCenteredExternalFlowPopup({
          url: getPaymentCashfreeBridgePopupUrl({
            paymentSessionId: data.payment_session_id,
            orderId: data.order_id,
            mode: cashfreeMode,
          }),
          windowName: "loanPaymentCashfreeWindow",
          preset: "bridge",
        });
        if (!attachPopup(popup)) {
          clearLoanPaymentPending();
          toast.error("Popup blocked. Please allow popups for this site and try again.");
          return;
        }
        startWatchPopupClosed();
      } catch (e) {
        clearLoanPaymentPending();
        const message =
          e instanceof Error ? e.message : "Something went wrong. Please try again.";
        setPaymentError(message);
      } finally {
        setIsCheckoutLoading(false);
      }
    },
    [
      loan,
      variant,
      returnPath,
      resolveOrderAmount,
      resolveRemainingBaseline,
      prepareOpenPopup,
      attachPopup,
      startWatchPopupClosed,
    ],
  ); */

  const startCheckout = useCallback(
    async (amount: number) => {
      if (!loan?._id) return;
      setPaymentError(null);
      setIsCheckoutLoading(true);

      try {
        const orderAmount = resolveOrderAmount(loan);
        const chargeAmount = variant === "foreclosure" ? orderAmount : amount;
        if (chargeAmount <= 0) {
          throw new Error("Invalid payment amount. Please refresh and try again.");
        }

        const data = await generateAndSendPaymentLink({
          loanId: loan._id,
          amount: chargeAmount,
        });

        const paymentWindow = openCenteredExternalFlowPopup({
          url: data.paymentLink,
          windowName: "loanPaymentWindow",
          preset: "bridge",
        });
        if (!paymentWindow) {
          throw new Error("Popup blocked. Please allow popups and try again.");
        }
        toast.success(
          "Payment link opened in a new window. Please refresh this page after completing the payment.",
        );
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Something went wrong. Please try again.";
        setPaymentError(message);
      } finally {
        setIsCheckoutLoading(false);
      }
    },
    [loan, variant, resolveOrderAmount],
  );

  return {
    loan,
    isLoading,
    error: activeLoanQuery.error,
    paymentError,
    showSuccessModal,
    paidAmount,
    remainingBalance,
    customAmountResetKey,
    ctaLoading: isCheckoutLoading,
    consentLocked,
    handlePaymentPress: startCheckout,
    handleForeclosePress: () => startCheckout(resolveOrderAmount(loan!)),
    handleContinueToHomepage,
    foreclosurePostCashfreeVerifyKey,
    runForeclosureOrderStatusPoll,
    handleSuccessModalClose,
  };
}
