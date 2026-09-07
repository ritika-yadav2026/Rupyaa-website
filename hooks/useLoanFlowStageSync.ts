"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getFlowSyncActions,
  syncLoanFlowFromStage,
  type SyncLoanFlowOptions,
} from "@/lib/loan-flow-sync";
import { REACT_QUERY_KEYS } from "@/utils/app-constants";

/**
 * Stable stage-sync helpers: reads {@link useFlowStore} actions at call time so callbacks
 * do not need five setter dependencies.
 */
export function useLoanFlowStageSync() {
  const queryClient = useQueryClient();

  const refreshFromBackend = useCallback(async (options?: SyncLoanFlowOptions) => {
    return syncLoanFlowFromStage(getFlowSyncActions(), options);
  }, []);

  const refreshAndInvalidateUserStageQueries = useCallback(async () => {
    const result = await syncLoanFlowFromStage(getFlowSyncActions(), { enrichOffer: false });
    void queryClient.invalidateQueries({ queryKey: [REACT_QUERY_KEYS.USER_STAGE_WEB] });
    return result;
  }, [queryClient]);

  return { refreshFromBackend, refreshAndInvalidateUserStageQueries };
}
