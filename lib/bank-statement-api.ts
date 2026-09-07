import { apiFetchWithAuth, withGeoLocationHeader } from "./api";
import {
  buildAbsoluteApiUrl,
  shouldUseNgrokHeader,
} from "./api-config";
import {
  API_ENDPOINTS,
  endpointPath,
} from "./api-endpoints";
/**
 * Request body for POST /api/v1/user/bank-statement/consent-url.
 * @see docs/GET_TEMP_URL_INTEGRATION.md
 */
export type GetTempUrlParams = {
  organizationName?: string;
  phoneNumber?: string;
  userName?: string;
};

/**
 * Normal flow response (first-time consent or new consent session).
 */
export type GetTempUrlNormalResponse = {
  message: string;
  tempUrl: string;
};

/**
 * Special flow response (auto-fetch with existing periodic consent).
 */
export type GetTempUrlAutoFetchResponse = {
  message: string;
  data: {
    tempUrl?: string;
    requestId?: string;
    docId?: string;
    status?: string;
  };
  autoFetch: true;
};

export type GetTempUrlResponse = GetTempUrlNormalResponse | GetTempUrlAutoFetchResponse;

/**
 * Generates the CART (Account Aggregator) consent URL.
 * User opens this URL to approve bank statement fetch via the AA framework.
 *
 * @param params - Optional organizationName, phoneNumber, userName.
 * @returns The tempUrl to open in WebView or browser.
 * @throws On 4xx/5xx with API error message.
 */
export async function getTempUrl(params?: GetTempUrlParams): Promise<string> {
  const data = await apiFetchWithAuth<GetTempUrlResponse>(
    endpointPath(API_ENDPOINTS.user.getTempUrl),
    {
      method: "POST",
      body: JSON.stringify(params ?? {}),
    }
  );
  const tempUrl = "tempUrl" in data ? data.tempUrl : data.data?.tempUrl;
  if (!tempUrl) {
    throw new Error(data.message ?? "No consent URL in response");
  }
  return tempUrl;
}

/**
 * Bank statement processing status values from getUserBankStatementStatus API.
 * @see docs/GET_USER_BANK_STATEMENT_STATUS_INTEGRATION.md
 */
export type BankStatementStatus =
  | "Pending"
  | "Approved"
  | "Aprroved"
  | "Processed"
  | "Rejected"
  | "Error";

/**
 * S3 keys for generated bank statement reports.
 * Present when processing is complete (callApplyLoan = true).
 */
/** Parsed bankStatementKey — backend may nest paths beyond pdf/xlsx/json/bsaReport. */
export type BankStatementKey = Record<string, unknown>;

/**
 * Response from GET /api/v1/user/bank-statement/status.
 * Used after user completes AA consent (CART tempUrl) to poll processing status.
 */
export type GetUserBankStatementStatusResponse = {
  bankStatementStatus?: BankStatementStatus;
  status?: string;
  callApplyLoan: boolean;
  bankStatementKey?: BankStatementKey;
  AAattemptsLeft?: number | string | null;
  aaAttemptsLeft?: number | string | null;
  manualUploadAttemptsLeft?: number | string | null;
};

/**
 * Fetches the current bank statement processing status.
 * Call after user completes AA consent to know when processing is done.
 *
 * @param token - User JWT (Bearer token). Uses auth store if not provided.
 * @returns The decrypted and validated status response.
 * @throws On invalid responses, auth failures, or network errors.
 */
export async function getUserBankStatementStatus(): Promise<GetUserBankStatementStatusResponse> {
  const path = endpointPath(API_ENDPOINTS.user.getUserBankStatementStatus);
  const raw = await apiFetchWithAuth<unknown>(path, { method: "GET" });

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("Invalid bank statement status response.");
  }

  const data = raw as Record<string, unknown>;
  const rawStatus = data.bankStatementStatus ?? data.status;


  const bankStatementStatus =
    typeof rawStatus === "string"
      ? (rawStatus as BankStatementStatus)
      : undefined;
  return {
    bankStatementStatus,
    status:
      typeof data.status === "string" ? data.status : bankStatementStatus,
    callApplyLoan: data?.callApplyLoan as boolean,
    bankStatementKey: data.bankStatementKey as BankStatementKey | undefined,
    AAattemptsLeft: (data.AAattemptsLeft ?? null) as number | string | null,
    aaAttemptsLeft: (data.aaAttemptsLeft ?? null) as number | string | null,
    manualUploadAttemptsLeft: (data.manualUploadAttemptsLeft ?? null) as number | string | null,
  };
}

/**
 * Optional: Get pending BSA status for manual upload flow.
 * Use when manual upload is processing and you want to check BSA status.
 */
export async function getPendingBsaStatus(): Promise<{
  status?: string;
  docId?: string;
  requestId?: string;
}> {
  return apiFetchWithAuth<{ status?: string; docId?: string; requestId?: string }>(
    endpointPath(API_ENDPOINTS.user.getPendingBsaStatus),
    { method: "GET" }
  );
}

/** Max file size for bank statement PDF: 40 MB. */
const MAX_BANK_STATEMENT_FILE_SIZE_BYTES = 40 * 1024 * 1024;

/**
 * Success response from PUT /api/v1/user/bank-statement.
 * @see docs/UPLOAD_BANK_STATEMENT_INTEGRATION.md
 */
export type UploadBankStatementResponse = {
  message: string;
  fileBucketKey?: string;
  pendingBSA?: {
    id: string;
    docId: string;
    status: string;
  };
};

/**
 * Error codes for password-protected PDF handling.
 * Check err.message when uploadBankStatement throws.
 */
export const UPLOAD_BANK_STATEMENT_ERROR = {
  PASSWORD_REQUIRED: "PASSWORD_REQUIRED",
  PASSWORD_INVALID: "PASSWORD_INVALID",
} as const;

/**
 * Uploads a bank statement PDF manually (no AA consent).
 * File is sent to CART for parsing, then BSA runs. Processing may complete
 * immediately or continue in background — poll getUserBankStatementStatus after.
 *
 * @param file - Bank statement PDF. Max 40 MB.
 * @param confidentialCode - PDF password if the file is password-protected.
 * @returns Success response with fileBucketKey and optional pendingBSA.
 * @throws Error with message PASSWORD_REQUIRED if PDF needs password; retry with confidentialCode.
 * @throws Error with message PASSWORD_INVALID if confidentialCode is wrong.
 * @throws Error on 4xx/5xx with API message.
 */
export async function uploadBankStatement(
  file: File,
  confidentialCode?: string
): Promise<UploadBankStatementResponse> {
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Only PDF files are allowed");
  }
  if (file.size > MAX_BANK_STATEMENT_FILE_SIZE_BYTES) {
    throw new Error("File size must be less than 40 MB");
  }
  const { useAuthStore } = await import("@/store/useAuthStore");
  const { refreshToken } = await import("@/lib/auth-api");
  const url = buildAbsoluteApiUrl(endpointPath(API_ENDPOINTS.user.uploadBankStatement));

  const formData = new FormData();
  formData.append("file", file);
  if (confidentialCode) {
    formData.append("confidentialCode", confidentialCode);
  }

  const makeRequest = async (authToken: string | null): Promise<Response> => {
    const headers: Record<string, string> = withGeoLocationHeader({});
    if (shouldUseNgrokHeader()) {
      headers["ngrok-skip-browser-warning"] = "true";
    }
    if (authToken) {
      headers["Authorization"] = authToken;
    }
    return fetch(url, {
      method: "PUT",
      headers,
      body: formData,
      cache: "no-store",
    });
  };

  const parseJsonBody = async (res: Response): Promise<Record<string, unknown>> => {
    const text = await res.text();
    if (!text || text.trim().startsWith("<")) {
      return {};
    }
    try {
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      return {};
    }
  };

  const authToken = useAuthStore.getState().token;
  let res = await makeRequest(authToken);

  if (res.status === 401) {
    const refreshTokenValue = useAuthStore.getState().refreshToken;
    if (!refreshTokenValue) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
      throw new Error("Session expired. Please log in again.");
    }
    try {
      const data = await refreshToken(refreshTokenValue as string);
      useAuthStore.getState().setToken(data.token);
      res = await makeRequest(data.token);
      if (res.status === 401) {
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/auth";
        }
        throw new Error("Session expired. Please log in again.");
      }
    } catch {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (res.status === 403) {
    const err = await parseJsonBody(res);
    if (err.passwordRequired === true) {
      throw new Error(UPLOAD_BANK_STATEMENT_ERROR.PASSWORD_REQUIRED);
    }
    if (err.passwordInvalid === true) {
      throw new Error(UPLOAD_BANK_STATEMENT_ERROR.PASSWORD_INVALID);
    }
  }

  if (!res.ok) {
    const err = await parseJsonBody(res);
    const message =
      (err.message as string) ?? (err.error as string) ?? "Upload failed";
    throw new Error(message);
  }

  const data = (await parseJsonBody(res)) as UploadBankStatementResponse;
  return data;
}
