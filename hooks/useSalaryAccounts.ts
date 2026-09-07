import { getSalaryAccounts, SalaryAccountsResponse } from '@/lib/mandate-api';
import { REACT_QUERY_KEYS } from '@/utils/app-constants';
import { mapSalaryAccountsResponse } from '@/utils/mapSalaryAccountsResponse';
import { useQuery } from '@tanstack/react-query';

const EMPTY_SALARY_ACCOUNTS: SalaryAccountsResponse = {
  salaryAccounts: [],
};

type UseSalaryAccountsOptions = {
  enabled?: boolean;
};

/**
 * Fetches salary account hints (GET /user/salary-accounts) for the bank details step.
 * When appConfig.useSalaryAccountsFixture is true, getSalaryAccounts returns local dummy data.
 * On live API error returns empty data so the form remains submittable without validation.
 */
export function useSalaryAccounts(options?: UseSalaryAccountsOptions) {
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: [REACT_QUERY_KEYS.SALARY_ACCOUNTS],
    queryFn: async (): Promise<SalaryAccountsResponse> => {
      const response = await getSalaryAccounts();
      if (!response.success) {
        return EMPTY_SALARY_ACCOUNTS;
      }
      return mapSalaryAccountsResponse(response.data);
    },
    enabled,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}
