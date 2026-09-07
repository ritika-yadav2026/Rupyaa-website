import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { requestNoc } from "./nocApi";

const GENERIC_NOC_ERROR = "Could not generate your NOC. Please try again.";
const DEFAULT_NOC_SUCCESS = "Your No Objection Certificate has been generated.";

type UseNocRequestResult = {
  submitNoc: (loanId: string) => void;
  isPending: boolean;
  pendingLoanId: string | null;
};

/** Mutation-style hook for POST /user/noc-request. Surfaces the result via toast instead of a modal. */
export function useNocRequest(): UseNocRequestResult {
  const mutation = useMutation({
    mutationFn: (loanId: string) => requestNoc(loanId),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.error?.message?.trim() || GENERIC_NOC_ERROR);
        return;
      }
      toast.success(response.data.message || DEFAULT_NOC_SUCCESS);
    },
    onError: () => {
      toast.error(GENERIC_NOC_ERROR);
    },
  });

  return {
    submitNoc: mutation.mutate,
    isPending: mutation.isPending,
    pendingLoanId: mutation.isPending ? (mutation.variables ?? null) : null,
  };
}
