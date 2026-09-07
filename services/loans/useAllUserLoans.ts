import { useQuery } from '@tanstack/react-query';
import { loanService } from './loanService';
import type { GetAllUserLoansResponse } from '@/lib/eligibility-api';
import { REACT_QUERY_KEYS } from '@/utils/app-constants';

type UseAllUserLoansOptions = {
  enabled?: boolean;
};

/**
 * React Query hook to fetch all user loans from backend (GET /loans/get-all-user-loans).
 * Handles loading, error states, and automatic retries.
 * Formats error messages for user-friendly display.
 */
export function useAllUserLoans(options?: UseAllUserLoansOptions) {
  const enabled = options?.enabled ?? true;

  const query = useQuery({
    queryKey: [REACT_QUERY_KEYS.ALL_USER_LOANS],
    queryFn: async (): Promise<GetAllUserLoansResponse> => {
      const response = await loanService.getAllUserLoans();
      return response;
    },
    enabled,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return query;
}
