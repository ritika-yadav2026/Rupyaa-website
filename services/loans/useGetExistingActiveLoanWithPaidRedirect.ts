import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGetExistingActiveLoan } from './useGetExistingActiveLoan';
import { isLoanStatusPaid } from '@/helpers/loan-helper';

/** Route to redirect to when active loan is Paid (loan fully closed). */
const HOME_ROUTE = '/';

type UseGetExistingActiveLoanOptions = {
  enabled?: boolean;
  /** When true, do not auto-redirect to home for Paid loans (e.g. success modal is open). */
  suppressPaidRedirect?: boolean;
};

/**
 * Wrapper around useGetExistingActiveLoan for payment/foreclosure screens.
 * When the API returns loanStatus = Paid, redirects to home so the user is not stuck on a screen for an already-closed loan.
 * Use this on screens that assume an "active" loan (e.g. Make Payment, Foreclose Loan).
 *
 * Returns the same as useGetExistingActiveLoan plus:
 * - shouldRedirectToHome: true when loan is Paid (redirect in progress); screens can show loading to avoid flashing content.
 */
export function useGetExistingActiveLoanWithPaidRedirect(
  options?: UseGetExistingActiveLoanOptions
) {
  const query = useGetExistingActiveLoan(options);
  const suppressPaidRedirect = options?.suppressPaidRedirect ?? false;
  const hasRedirected = useRef(false);
  const router = useRouter();

  const data = query.data;
  const loanIsPaid = Boolean(data && isLoanStatusPaid(data.loanStatus));
  const shouldRedirectToHome = loanIsPaid && !suppressPaidRedirect;

  useEffect(() => {
    if (suppressPaidRedirect) return;
    if (hasRedirected.current) return;
    if (query.isPending || query.isError) return;
    if (!data || !isLoanStatusPaid(data.loanStatus)) return;

    hasRedirected.current = true;
    router.replace(HOME_ROUTE as never);
  }, [data, query.isPending, query.isError, suppressPaidRedirect, router]);

  return {
    ...query,
    shouldRedirectToHome,
  };
}
