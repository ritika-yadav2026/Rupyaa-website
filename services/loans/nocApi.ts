import { apiFetchWithAuth } from "@/lib/api";
import { API_ENDPOINTS, endpointPath } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/lib/app-config-types";

export interface RequestNocRawResponse {
  message?: string;
  applicationNumber: string;
  emailSent?: boolean;
}

export interface NocResult {
  applicationNumber: string;
  emailSent: boolean;
  message?: string;
}

const GENERIC_NOC_ERROR_MESSAGE = "Could not generate your NOC. Please try again.";
const INVALID_LOAN_ID_MESSAGE = "Could not find your loan. Please try again later.";

const INVALID_LOAN_ID_ERROR: ApiResponse<NocResult> = {
  success: false,
  error: {
    message: INVALID_LOAN_ID_MESSAGE,
    code: "INVALID_LOAN_ID",
  },
};

/**
 * POST /user/noc-request
 *
 * Invalid loanId short-circuits without hitting the network. A 200 body with
 * `status: false` is treated as a failure even though the HTTP call succeeded.
 */
export async function requestNoc(loanId: string): Promise<ApiResponse<NocResult>> {
  const normalizedId = loanId?.trim();
  if (!normalizedId) {
    return INVALID_LOAN_ID_ERROR;
  }

  try {
    const raw = await apiFetchWithAuth<RequestNocRawResponse>(
      endpointPath(API_ENDPOINTS.user.requestNoc),
      {
        method: "POST",
        body: JSON.stringify({ loanId: normalizedId }),
      }
    );

    if (!raw.emailSent) {
      return {
        success: false,
        error: {
          message: GENERIC_NOC_ERROR_MESSAGE,
        },
      };
    }
    return { success: true, data: { applicationNumber: raw.applicationNumber, emailSent: raw.emailSent, message: raw.message?.trim() || "" } };
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : GENERIC_NOC_ERROR_MESSAGE;
    return {
      success: false,
      error: {
        message,
        code: "NETWORK_ERROR",
      },
    };
  }
}
