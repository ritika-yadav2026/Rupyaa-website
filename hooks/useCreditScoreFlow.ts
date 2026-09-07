"use client";

import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import {
  buildCreditScoreRequest,
  getApiErrorDisplayMessage,
  pullGromoEquifaxReport,
  type CreditScoreFormValues,
  type CreditScorePullResponse,
} from "@/lib/credit-score-api";

export type CreditScoreStep = "intro" | "form" | "fetching" | "report" | "fullReport";

export interface CreditScoreFlow {
  readonly step: CreditScoreStep;
  readonly result: CreditScorePullResponse | null;
  readonly formValues: CreditScoreFormValues | null;
  readonly isPending: boolean;
  readonly startForm: () => void;
  readonly submitForm: (values: CreditScoreFormValues) => void;
  readonly completeFetching: () => void;
  readonly unlockReport: () => void;
  readonly backToReport: () => void;
  readonly startOver: () => void;
}

/**
 * Orchestrates the credit score journey: intro → form → fetching → report → full report.
 * Owns the Equifax pull mutation and keeps the UI decoupled from the request lifecycle.
 */
export function useCreditScoreFlow(): CreditScoreFlow {
  const userId = useAuthStore((state) => state.userId);
  const [step, setStep] = useState<CreditScoreStep>("form");
  const [result, setResult] = useState<CreditScorePullResponse | null>(null);
  const [formValues, setFormValues] = useState<CreditScoreFormValues | null>(null);
  const mutation = useMutation({
    mutationFn: (values: CreditScoreFormValues) =>
      pullGromoEquifaxReport(buildCreditScoreRequest(values, userId ?? undefined)),
    onSuccess: (data) => {
      if (!data?.reportAvailable || !data?.data) {
        toast.error(data?.message ?? "Credit report is not available right now.");
        setStep("form");
        return;
      }
      setResult(data);
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorDisplayMessage(error) ?? "Failed to fetch your credit score.");
      setStep("form");
    },
  });
  const startForm = useCallback(() => setStep("form"), []);
  const submitForm = useCallback(
    (values: CreditScoreFormValues) => {
      setFormValues(values);
      setResult(null);
      setStep("fetching");
      mutation.mutate(values);
    },
    [mutation]
  );
  const completeFetching = useCallback(() => {
    setResult((current) => {
      if (current) {
        setStep("report");
      }
      return current;
    });
  }, []);
  const unlockReport = useCallback(() => setStep("fullReport"), []);
  const backToReport = useCallback(() => setStep("report"), []);
  const startOver = useCallback(() => {
    setResult(null);
    setStep("form");
  }, []);
  return {
    step,
    result,
    formValues,
    isPending: mutation.isPending,
    startForm,
    submitForm,
    completeFetching,
    unlockReport,
    backToReport,
    startOver,
  };
}
