import { useQuery } from "@tanstack/react-query";
import {
  getCanCancelLoan,
  normalizeLoanIdForCancellation,
  parseCanCancelLoan,
} from "./loanCancellationApi";

type UseCanCancelLoanOptions = {
  loanId: string | null | undefined;
  enabled?: boolean;
};

export function canCancelLoanQueryKey(loanId: string): readonly [
  "loans",
  "can-cancel-loan",
  string,
] {
  return ["loans", "can-cancel-loan", loanId] as const;
}

/**
 * Eligibility for canceling the user's current loan.
 *
 * Returns a strict boolean. Any non-2xx, malformed envelope, or non-boolean
 * `canCancel` field collapses to `false` so the UI fails closed (link hidden).
 * `staleTime: 0` + refetch on mount/reconnect lets the link appear cheaply
 * once the backend flips the flag (e.g. after the 24h cooldown elapses while
 * the user is on the screen).
 */
export function useCanCancelLoan(options: UseCanCancelLoanOptions) {
  const normalizedId = normalizeLoanIdForCancellation(options.loanId);
  const enabled = (options.enabled ?? true) && normalizedId != null;

  return useQuery({
    queryKey:
      normalizedId != null
        ? canCancelLoanQueryKey(normalizedId)
        : (["loans", "can-cancel-loan", "none"] as const),
    queryFn: async (): Promise<boolean> => {
      if (!normalizedId) {
        return false;
      }
      const response = await getCanCancelLoan(normalizedId);
      if (!response.success) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[useCanCancelLoan] request failed", {
            loanId: normalizedId,
            code: response.error?.code,
            message: response.error?.message,
          });
        }
        return false;
      }
      return parseCanCancelLoan(response.data);
    },
    enabled,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
