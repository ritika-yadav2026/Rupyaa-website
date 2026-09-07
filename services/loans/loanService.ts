import { API_ENDPOINTS, endpointPath } from '@/lib/api-endpoints';
import { apiFetchWithAuth } from '@/lib/api';
import { GetAllUserLoansResponse } from '@/lib/eligibility-api';
import { GetExistingActiveLoanResponse } from '@/lib/eligibility-api';

/**
 * Loan service for managing user loans.
 */
export const loanService = {
  /**
   * Fetch all user loans (GET /loans/get-all-user-loans).
   * Returns list of all loans associated with the current user.
   */
  async getAllUserLoans(): Promise<GetAllUserLoansResponse> {
    return apiFetchWithAuth<GetAllUserLoansResponse>(endpointPath(API_ENDPOINTS.loans.getAllUserLoans));
  },

  /**
   * Fetch existing active loan (GET /loans/active).
   * Returns the user's active loan if one exists.
   */
  async getExistingActiveLoan(): Promise<GetExistingActiveLoanResponse> {
    return apiFetchWithAuth<GetExistingActiveLoanResponse>(endpointPath(API_ENDPOINTS.loans.getExistingActiveLoan));
  },
};
