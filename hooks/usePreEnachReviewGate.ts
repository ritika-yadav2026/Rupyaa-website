"use client";

import { useQuery } from "@tanstack/react-query";
import { getShouldStopBeforeNach } from "@/lib/mandate-api";
import { REACT_QUERY_KEYS } from "@/utils/app-constants";

/**
 * Gates E-NACH (`enach`) and e-sign (`esign`) when backend requires stopping before NACH.
 * Does **not** read remote `enablePreEnachReview` — parity with mobile hook (substep-only gate).
 */
export function usePreEnachReviewGate(currentSubstepId: string | undefined) {
  const shouldFetch = currentSubstepId === "enach" || currentSubstepId === "esign";

  const query = useQuery({
    queryKey: [REACT_QUERY_KEYS.SHOULD_STOP_BEFORE_NACH],
    queryFn: getShouldStopBeforeNach,
    enabled: shouldFetch,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const isBlocked = shouldFetch && query.data === true;
  const visible =
    shouldFetch &&
    (query.isPending || query.isError || isBlocked);

  return {
    visible,
    isLoading: query.isPending,
    hasError: query.isError,
    substepId: currentSubstepId ?? "",
    refetch: query.refetch,
    isBlocked,
  };
}
