import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/utils/app-constants";
import {
  normalizeLoanIdForCancellation,
  parseSubmitCancelLoan,
  submitCancelLoan,
} from "./loanCancellationApi";

const GENERIC_CANCEL_ERROR = "Could not cancel your loan. Please try again.";
const INVALID_LOAN_ID_ERROR = "Could not find your loan. Please try again later.";

type UseCancelLoanSubmitResult = {
  submitError: string | null;
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
  reset: () => void;
};

/**
 * Mutation-style hook for POST /loans/:loanId/cancel.
 *
 * Guards against double submits, clears the previous inline error on each
 * attempt, and invalidates eligibility + active-loan caches **before**
 * notifying the caller so downstream screens read fresh data on next paint.
 */
export function useCancelLoanSubmit(
  onSubmitSuccess: () => void,
  loanId: string | null | undefined
): UseCancelLoanSubmitResult {
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedLoanId = normalizeLoanIdForCancellation(loanId);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) {
      return;
    }
    if (!normalizedLoanId) {
      setSubmitError(INVALID_LOAN_ID_ERROR);
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const response = await submitCancelLoan(normalizedLoanId);
      if (!response.success) {
        setSubmitError(response.error?.message?.trim() || GENERIC_CANCEL_ERROR);
        return;
      }
      if (!parseSubmitCancelLoan(response.data)) {
        setSubmitError(GENERIC_CANCEL_ERROR);
        return;
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [REACT_QUERY_KEYS.LOANS, REACT_QUERY_KEYS.CAN_CANCEL_LOAN] }),
        queryClient.invalidateQueries({
          queryKey: [REACT_QUERY_KEYS.EXISTING_ACTIVE_LOAN],
        }),
      ]);
      onSubmitSuccess();
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, normalizedLoanId, onSubmitSuccess, queryClient]);

  const reset = useCallback(() => {
    setSubmitError(null);
    setIsSubmitting(false);
  }, []);

  return { submitError, isSubmitting, handleSubmit, reset };
}
