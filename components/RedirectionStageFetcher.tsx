"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUserStage } from "@/lib/user-api";
import { getFlowSyncActions, syncLoanFlowFromStage } from "@/lib/loan-flow-sync";
import { logOfferCurrentEvent } from "@/lib/offer-current-debug";
import {
  buildDebugUserStageResponse,
  resolveLoanFlowDebugTarget,
} from "@/lib/loan-flow-debug";
import { REACT_QUERY_KEYS } from "@/utils/app-constants";

/**
 * Web handles PERSONAL_DETAILS, MODE_OF_EMPLOYMENT, SOFT_PULL, OFFERINGS only.
 * Any other stage → page renders the "download the app" view.
 */
export function RedirectionStageFetcher() {
  const searchParams = useSearchParams();
  const debugTarget = useMemo(
    () => resolveLoanFlowDebugTarget(searchParams?.toString() ?? ""),
    [searchParams],
  );
  const debugStage = debugTarget?.stage ?? null;

  const { data } = useQuery({
    queryKey: [REACT_QUERY_KEYS.USER_STAGE],
    queryFn: () => getUserStage({ device: "web" }),
    retry: 1,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    enabled: !debugStage,
  });

  useEffect(() => {
    if (debugStage) {
      logOfferCurrentEvent("RedirectionStageFetcher → sync (debug stage)", {
        stage: debugStage,
        enrichOffer: true,
      });
      void syncLoanFlowFromStage(getFlowSyncActions(), {
        stageResponse: buildDebugUserStageResponse(
          debugStage,
          debugTarget?.sectionsCompleted,
        ),
        enrichOffer: true,
      });
      return;
    }

    if (!data?.stage) return;
    logOfferCurrentEvent("RedirectionStageFetcher → sync (query data)", {
      stage: data.stage,
      enrichOffer: true,
    });
    void syncLoanFlowFromStage(getFlowSyncActions(), {
      stageResponse: data,
      enrichOffer: true,
    });
  }, [debugStage, debugTarget?.sectionsCompleted, data?.stage]);

  return null;
}
