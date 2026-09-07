import { useQuery } from '@tanstack/react-query';
import { loanService } from './loanService';
import type { GetExistingActiveLoanResponse } from '@/lib/eligibility-api';
import { REACT_QUERY_KEYS } from '@/utils/app-constants';

type UseGetExistingActiveLoanOptions = {
  enabled?: boolean;
};

/**
 * React Query hook to fetch existing active loan from backend (GET /loans/active).
 * Handles loading, error states, and automatic retries.
 * Formats error messages for user-friendly display.
 */
export function useGetExistingActiveLoan(options?: UseGetExistingActiveLoanOptions) {
  const enabled = options?.enabled ?? true;

  const query = useQuery({
    queryKey: [REACT_QUERY_KEYS.EXISTING_ACTIVE_LOAN],
    queryFn: async (): Promise<GetExistingActiveLoanResponse> => {
      const response = await loanService.getExistingActiveLoan();
      return response;
    },
    enabled,
    staleTime: 0,
    retry: 1,
  });

  return query;
}
