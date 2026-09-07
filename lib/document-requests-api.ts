import { apiFetchWithAuth, withGeoLocationHeader } from "./api";
import {
  buildAbsoluteApiUrl,
  shouldUseNgrokHeader,
} from "./api-config";
import {
  API_ENDPOINTS,
  endpointPath,
  resolveEndpoint,
} from "./api-endpoints";

/** Backend status values for document requests */
export type DocumentRequestStatus =
  | "pending"
  | "uploaded"
  | "approved"
  | "rejected"
  | "closed"
  | "cancelled"
  | "not_interested";

export type DocumentRequestAdmin = {
  username: string;
  _id: string;
  adminRole: string;
};

export type DocumentRequestDocument = {
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  password?: string;
};

export type DocumentRequest = {
  _id: string;
  loanId: string;
  userId: string;
  adminId: DocumentRequestAdmin;
  documentName: string;
  description: string;
  date: string;
  status: DocumentRequestStatus;
  documents: DocumentRequestDocument[];
  rejectionReason: string;
  rejectionCount: number;
  createdAt: string;
  updatedAt: string;
};

export type GetDocumentRequestsResponse = {
  message: string;
  data: DocumentRequest[];
};

export type UploadDocumentResponse = {
  message: string;
  data: DocumentRequest;
};

export type PasswordRequiredError = {
  message: string;
  passwordRequired: boolean;
  fileIndex: number;
  fileName: string;
};

export type PasswordInvalidError = {
  message: string;
  passwordInvalid: boolean;
  fileIndex: number;
  fileName: string;
};

const DOCUMENT_REQUESTS_BASE = endpointPath(API_ENDPOINTS.documentRequests.getDocumentRequests);

/**
 * Fetches the list of document requests for the authenticated user.
 * Call on page load, refresh, and after successful upload.
 */
export async function getDocumentRequests(): Promise<GetDocumentRequestsResponse> {
  return apiFetchWithAuth<GetDocumentRequestsResponse>(
    DOCUMENT_REQUESTS_BASE,
    { method: "GET" }
  );
}

/**
 * Uploads documents for a document request.
 * For password-protected PDFs, the backend returns 403 with passwordRequired.
 * Use uploadDocumentWithPasswords to retry with passwords.
 */
export async function uploadDocument(
  requestId: string,
  formData: FormData
): Promise<{ success: true; data: DocumentRequest } | { success: false; error: PasswordRequiredError | PasswordInvalidError | { message: string } }> {
  const { useAuthStore } = await import("@/store/useAuthStore");
  const { refreshToken } = await import("@/lib/auth-api");

  const uploadPath = resolveEndpoint(
    API_ENDPOINTS.documentRequests.uploadDocumentRequestAttachments,
    { requestId }
  );
  const url = buildAbsoluteApiUrl(endpointPath(uploadPath));

  const makeRequest = async (token: string | null): Promise<Response> => {
    const headers: Record<string, string> = withGeoLocationHeader({});
    if (shouldUseNgrokHeader()) {
      headers["ngrok-skip-browser-warning"] = "true";
    }
    if (token) {
      headers["Authorization"] = token;
    }
    return fetch(url, {
      method: "POST",
      headers,
      body: formData,
      cache: "no-store",
    });
  };

  const token = useAuthStore.getState().token;
  if (!token) {
    useAuthStore.getState().logout();
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
    throw new Error("Please log in again.");
  }
  let res = await makeRequest(token);

  if (res.status === 401) {
    const refreshTokenValue = useAuthStore.getState().refreshToken;
    if (!refreshTokenValue) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
      throw new Error("Please log in again.");
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
        throw new Error("Please log in again.");
      }
    } catch (err) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
      throw err;
    }
  }

  if (res.ok) {
    const data = (await res.json()) as UploadDocumentResponse;
    return { success: true, data: data.data };
  }

  const errorBody = await res.json().catch(() => ({ message: res.statusText }));
  const err = errorBody as PasswordRequiredError & PasswordInvalidError & { message: string };

  if (res.status === 403 && (err.passwordRequired || err.passwordInvalid)) {
    return {
      success: false,
      error: {
        message: err.message,
        passwordRequired: !!err.passwordRequired,
        passwordInvalid: !!err.passwordInvalid,
        fileIndex: err.fileIndex ?? 0,
        fileName: err.fileName ?? "",
      },
    };
  }

  return {
    success: false,
    error: { message: err.message ?? "Upload failed" },
  };
}
