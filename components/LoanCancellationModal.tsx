"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { goHomeWithFallback } from "@/lib/go-home";
import { useCancelLoanSubmit } from "@/services/loans";
import CancellationConfirmStep from "./loan-cancellation/CancellationConfirmStep";
import CancellationSuccessStep from "./loan-cancellation/CancellationSuccessStep";
import LoanCancellationShell from "./loan-cancellation/LoanCancellationShell";
import type { CancellationStep } from "./loan-cancellation/types";

export interface LoanCancellationModalProps {
  visible: boolean;
  /** Backend loan id for POST /loans/:loanId/cancel */
  loanId: string;
  onClose: () => void;
  /** Called after successful cancellation, before navigating home. */
  onLoanCancelled?: () => void;
}

const INITIAL_STEP: CancellationStep = "confirm";

export default function LoanCancellationModal({
  visible,
  loanId,
  onClose,
  onLoanCancelled,
}: LoanCancellationModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<CancellationStep>(INITIAL_STEP);

  const handleSubmitSuccess = useCallback(() => {
    setStep("success");
  }, []);

  const {
    submitError,
    isSubmitting,
    handleSubmit,
    reset: resetSubmit,
  } = useCancelLoanSubmit(handleSubmitSuccess, loanId);

  useLockBodyScroll(visible);

  // Resetting step + submit state on every close path (in handlers below) keeps
  // re-open clean even after an error, without a setState-in-effect cascade.
  const closeAndReset = useCallback(() => {
    setStep(INITIAL_STEP);
    resetSubmit();
    onClose();
  }, [onClose, resetSubmit]);

  const handleRequestClose = useCallback(() => {
    // Block close mid-request so the modal does not end up in an ambiguous
    // state while the cancel API is still in flight.
    if (isSubmitting) {
      return;
    }
    closeAndReset();
  }, [isSubmitting, closeAndReset]);

  const handleKeepLoan = useCallback(() => {
    if (isSubmitting) {
      return;
    }
    closeAndReset();
  }, [isSubmitting, closeAndReset]);

  const handleContinueToHomepage = useCallback(() => {
    onLoanCancelled?.();
    closeAndReset();
    goHomeWithFallback(router);
  }, [closeAndReset, onLoanCancelled, router]);

  useEffect(() => {
    if (!visible) {
      setStep(INITIAL_STEP);
      resetSubmit();
    }
  }, [visible, resetSubmit]);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleRequestClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, handleRequestClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center overflow-hidden overscroll-none p-0 md:items-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loan-cancellation-title"
    >
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] md:bg-black/50"
        aria-hidden="true"
        onClick={handleRequestClose}
      />
      <div className="relative flex h-dvh max-h-dvh w-full md:h-auto md:max-h-[min(90vh,720px)] md:w-auto md:max-w-md">
        <LoanCancellationShell fillBody={step === "success"}>
          <span id="loan-cancellation-title" className="sr-only">
            Cancel your loan
          </span>
          {step === "confirm" ? (
            <CancellationConfirmStep
              isSubmitting={isSubmitting}
              submitError={submitError}
              onKeepLoan={handleKeepLoan}
              onConfirmCancel={handleSubmit}
            />
          ) : (
            <CancellationSuccessStep
              onContinueToHomepage={handleContinueToHomepage}
            />
          )}
        </LoanCancellationShell>
      </div>
    </div>
  );
}
