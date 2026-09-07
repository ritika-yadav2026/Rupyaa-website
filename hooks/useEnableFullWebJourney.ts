"use client";

import { useQuery } from "@tanstack/react-query";
import { resolveEnableFullWebJourney } from "@/config/featureFlags";
import { getPersonalDetails } from "@/lib/user-api";
import { REACT_QUERY_KEYS } from "@/utils/app-constants";

/**
 * Reads the per-user full web journey override from personal details.
 */
export function useEnableFullWebJourney(): boolean {
  return useEnableFullWebJourneyStatus().enabled;
}

export type EnableFullWebJourneyStatus = {
  enabled: boolean;
  isResolved: boolean;
};

/**
 * Exposes whether the override decision has resolved so callers do
 * not treat the temporary pre-fetch value as a real disabled result.
 */
export function useEnableFullWebJourneyStatus(): EnableFullWebJourneyStatus {
  const personalDetailsQuery = useQuery({
    queryKey: [REACT_QUERY_KEYS.PERSONAL_DETAILS],
    queryFn: getPersonalDetails,
    retry: 1,
    staleTime: 30_000,
  });

  const enabled = resolveEnableFullWebJourney(personalDetailsQuery.data);
  const isResolved = !personalDetailsQuery.isPending;

  return { enabled, isResolved };
}
