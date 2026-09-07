"use client";

import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { acceptOffer, type CurrentOffer, type LoanType } from "@/lib/eligibility-api";
import { fetchCurrentOfferForBankStatement } from "@/lib/fetch-current-offer";
import { isOfferAcceptable } from "@/lib/bsa-processed-offer";
import { useCurrentOfferStore } from "@/store/useCurrentOfferStore";
import { useFlowStore } from "@/store/useFlowStore";
import { normalizeBackendStage } from "@/config/stageMapping";
import { logBankConnectDebug } from "@/lib/bank-connect";

const DEFAULT_REFRESH_ERROR = "Unable to load offer. Please try again.";
const DEFAULT_ACCEPT_ERROR = "Unable to accept offer. Please try again.";

export type UseApprovedOfferStepParams = {
  onAcceptSuccess: () => void;
  onAcceptError?: () => void;
};

export type UseApprovedOfferStepResult = {
  offer: CurrentOffer | null;
  loanType: LoanType | undefined;
  hasOffer: boolean;
  isOfferResolved: boolean;
  isApproved: boolean;
  showImproveOfferAction: boolean;
  improveOfferByUsingBsa: () => void;
  acceptOffer: () => void;
  isAccepting: boolean;
  acceptError: string | null;
  clearAcceptError: () => void;
  refreshOffer: () => void;
  isRefreshing: boolean;
  refreshError: string | null;
  clearRefreshError: () => void;
  /** True when GET /offer/current succeeded but the payload was filtered out (e.g. pending loan, invalid amount). */
  offerHiddenAfterSuccessfulFetch: boolean;
};

export function useApprovedOfferStep({
  onAcceptSuccess,
  onAcceptError,
}: UseApprovedOfferStepParams): UseApprovedOfferStepResult {
  const lastResult = useCurrentOfferStore((s) => s.lastResult);
  const goTo = useFlowStore((s) => s.goTo);
  const userStageResponse = useFlowStore((s) => s.userStageResponse);
  const showUpdateButton = useFlowStore((s) => s.showUpdateButton);
  const setCameFromOfferings = useFlowStore((s) => s.setCameFromOfferings);

  const [acceptError, setAcceptError] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  let offer: CurrentOffer | null = null;
  let loanType: LoanType | undefined;
  let offerHiddenAfterSuccessfulFetch = false;
  if (lastResult?.kind === "success") {
    loanType = lastResult.data.loanType;
    const o = lastResult.data.offer;
    if (isOfferAcceptable(o)) {
      offer = o;
    } else {
      offerHiddenAfterSuccessfulFetch = true;
    }
  }

  const hasOffer = offer != null;
  const isApproved = hasOffer;
  const isOfferResolved = lastResult !== null;

  const stageNorm = userStageResponse?.stage
    ? normalizeBackendStage(userStageResponse.stage)
    : "";
  const isOfferingsStage = stageNorm === "OFFERINGS";

  const showImproveOfferAction =
    isApproved && isOfferingsStage && showUpdateButton === true;

  const acceptMutation = useMutation({
    mutationFn: () => acceptOffer(),
    onSuccess: () => {
      onAcceptSuccess();
    },
    onError: () => {
      setAcceptError(DEFAULT_ACCEPT_ERROR);
      onAcceptError?.();
    },
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const { ok } = await fetchCurrentOfferForBankStatement({
        force: true,
        from: "useApprovedOfferStep:refresh",
      });
      if (!ok) throw new Error(DEFAULT_REFRESH_ERROR);
    },
    onSuccess: () => {
      setRefreshError(null);
    },
    onError: () => {
      setRefreshError(DEFAULT_REFRESH_ERROR);
    },
  });

  const clearRefreshError = useCallback(() => setRefreshError(null), []);
  const clearAcceptError = useCallback(() => setAcceptError(null), []);

  const improveOfferByUsingBsa = useCallback(() => {
    logBankConnectDebug("offeringsEntry", {
      cameFromOfferings: true,
      destination: "bank-connect",
    });
    setCameFromOfferings(true);
    goTo("offer", "bank-connect");
  }, [goTo, setCameFromOfferings]);

  const acceptOfferFn = useCallback(() => {
    if (hasOffer) acceptMutation.mutate();
  }, [hasOffer, acceptMutation]);

  const refreshOffer = useCallback(() => {
    refreshMutation.mutate();
  }, [refreshMutation]);

  return {
    offer,
    loanType,
    hasOffer,
    isOfferResolved,
    isApproved,
    showImproveOfferAction,
    improveOfferByUsingBsa,
    acceptOffer: acceptOfferFn,
    isAccepting: acceptMutation.isPending,
    acceptError,
    clearAcceptError,
    refreshOffer,
    isRefreshing: refreshMutation.isPending,
    refreshError,
    clearRefreshError,
    offerHiddenAfterSuccessfulFetch,
  };
}
