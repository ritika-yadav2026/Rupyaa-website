import {
  getTicketFilterOptions,
  type TicketFilterOptions,
} from "@/lib/support-ticket-api";
import { REACT_QUERY_KEYS } from "@/utils/app-constants";
import { useQuery } from "@tanstack/react-query";

type UseTicketFilterOptionsParams = {
  readonly enabled?: boolean;
};

/**
 * Loads ticket taxonomy (categories, sub-categories, etc.) for support forms.
 */
export function useTicketFilterOptions(
  params: UseTicketFilterOptionsParams = {},
) {
  const enabled = params.enabled ?? true;
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.TICKET_FILTER_OPTIONS],
    queryFn: (): Promise<TicketFilterOptions> => getTicketFilterOptions(),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
