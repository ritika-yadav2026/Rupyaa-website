import { refreshToken } from "@/lib/auth-api";
import { withGeoLocationHeader } from "@/lib/api";
import {
  buildAbsoluteApiUrl,
  shouldUseNgrokHeader,
} from "@/lib/api-config";
import {
  decryptResponse,
  encryptPayload,
  getEncryptionEnabled,
  looksLikeEncryptedResponse,
} from "@/lib/api-encryption";
import { useAuthStore } from "@/store/useAuthStore";

const CUSTOMER_SUPPORT_TICKET_PATH = "/tickets/customer";
const TICKET_FILTER_OPTIONS_PATH = "/tickets/config/filter-options";

export type TicketCategoryOption = {
  readonly _id: string;
  readonly step: string;
  readonly name: string;
  readonly ownerTeam: string;
};

export type TicketSubCategoryOption = {
  readonly _id: string;
  readonly name: string;
  readonly categoryId?: string;
};

export type TicketAssignableOperator = {
  readonly _id: string;
  readonly username: string;
  readonly role: string;
};

export type TicketFilterOptions = {
  readonly steps: string[];
  readonly teams: string[];
  readonly platforms: string[];
  readonly statuses: string[];
  readonly priorities: string[];
  readonly loanStatuses: string[];
  readonly categories: TicketCategoryOption[];
  readonly subCategories: TicketSubCategoryOption[];
  readonly tags: string[];
  readonly assignableOperators: TicketAssignableOperator[];
};

type CreateCustomerSupportTicketInput = {
  readonly categoryId: string;
  readonly subject: string;
  readonly description: string;
  readonly applicationNumber?: string;
  readonly phoneNumber?: string;
  readonly files: readonly File[];
};

type ApiErrorResponse = {
  readonly error?: string;
  readonly message?: string;
  readonly code?: string;
};

type CreateCustomerSupportTicketResponse = {
  readonly message?: string;
  readonly ticket?: {
    readonly ticketId?: string;
  };
};

function buildAuthorizationHeader(token: string): string {
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
}

function buildHeaders(token: string): HeadersInit {
  const headers: Record<string, string> = withGeoLocationHeader({
    Authorization: buildAuthorizationHeader(token),
    "X-Platform": "web",
  });
  if (shouldUseNgrokHeader()) {
    headers["ngrok-skip-browser-warning"] = "true";
  }
  return headers;
}

async function buildTicketRequestUrl(
  path: string,
  method: "GET" | "POST",
): Promise<string> {
  const url = new URL(buildAbsoluteApiUrl(path));
  const encryptionEnabled = await getEncryptionEnabled();
  if (encryptionEnabled && method === "GET") {
    const encryptedPayload = await encryptPayload({});
    url.searchParams.set("payload", encryptedPayload);
  }
  return url.toString();
}

function buildFormData(input: CreateCustomerSupportTicketInput): FormData {
  const formData = new FormData();
  formData.append("categoryId", input.categoryId);
  formData.append("subject", input.subject);
  formData.append("description", input.description);
  if (input.applicationNumber) {
    formData.append("applicationNumber", input.applicationNumber);
  }
  if (input.phoneNumber) {
    formData.append("phoneNumber", input.phoneNumber);
  }
  input.files.forEach((file: File) => formData.append("files", file));
  return formData;
}

async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return {};
  }
}

async function resolveParsedResponse(parsedResponse: unknown): Promise<unknown> {
  if (!looksLikeEncryptedResponse(parsedResponse)) {
    return parsedResponse;
  }
  try {
    return await decryptResponse(parsedResponse);
  } catch {
    return parsedResponse;
  }
}

function getErrorMessage(
  parsedResponse: unknown,
  fallbackMessage: string,
): string {
  if (typeof parsedResponse !== "object" || parsedResponse === null) {
    return fallbackMessage;
  }
  const errorResponse = parsedResponse as ApiErrorResponse;
  return errorResponse.error ?? errorResponse.message ?? fallbackMessage;
}

function getErrorCode(parsedResponse: unknown): string | undefined {
  if (typeof parsedResponse !== "object" || parsedResponse === null) {
    return undefined;
  }
  return (parsedResponse as ApiErrorResponse).code;
}

function asTicketFilterOptions(parsedResponse: unknown): TicketFilterOptions {
  if (typeof parsedResponse !== "object" || parsedResponse === null) {
    throw new Error("Failed to load ticket categories.");
  }
  const record = parsedResponse as Record<string, unknown>;
  if (Array.isArray(record.categories)) {
    return parsedResponse as TicketFilterOptions;
  }
  const nested = record.data;
  if (
    typeof nested === "object" &&
    nested !== null &&
    Array.isArray((nested as TicketFilterOptions).categories)
  ) {
    return nested as TicketFilterOptions;
  }
  throw new Error("Failed to load ticket categories.");
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshTokenValue = useAuthStore.getState().refreshToken;
  if (!refreshTokenValue) {
    return null;
  }
  const response = await refreshToken(refreshTokenValue);
  useAuthStore.getState().setToken(response.token);
  return response.token;
}

async function fetchWithAuthRetry(
  executeRequest: (token: string) => Promise<Response>,
): Promise<{ response: Response; parsedResponse: unknown }> {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error("Please login to continue.");
  }
  let response = await executeRequest(token);
  let parsedResponse = await resolveParsedResponse(await parseResponse(response));
  if (response.status === 401 && getErrorCode(parsedResponse) === "TOKEN_EXPIRED") {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      response = await executeRequest(refreshedToken);
      parsedResponse = await resolveParsedResponse(await parseResponse(response));
    }
  }
  return { response, parsedResponse };
}

/**
 * Loads active ticket taxonomy options for create/search dropdowns.
 */
export async function getTicketFilterOptions(): Promise<TicketFilterOptions> {
  const requestUrl = await buildTicketRequestUrl(TICKET_FILTER_OPTIONS_PATH, "GET");
  const { response, parsedResponse } = await fetchWithAuthRetry((token) =>
    fetch(requestUrl, {
      method: "GET",
      headers: buildHeaders(token),
      cache: "no-store",
    }),
  );
  if (!response.ok) {
    throw new Error(
      getErrorMessage(parsedResponse, "Failed to load ticket categories."),
    );
  }
  return asTicketFilterOptions(parsedResponse);
}

/**
 * Creates a customer support ticket with optional attachments.
 */
export async function createCustomerSupportTicket(
  input: CreateCustomerSupportTicketInput,
): Promise<CreateCustomerSupportTicketResponse> {
  const requestUrl = await buildTicketRequestUrl(
    CUSTOMER_SUPPORT_TICKET_PATH,
    "POST",
  );
  const { response, parsedResponse } = await fetchWithAuthRetry((token) =>
    fetch(requestUrl, {
      method: "POST",
      headers: buildHeaders(token),
      body: buildFormData(input),
      cache: "no-store",
    }),
  );
  if (!response.ok) {
    throw new Error(
      getErrorMessage(parsedResponse, "Failed to create support ticket."),
    );
  }
  return parsedResponse as CreateCustomerSupportTicketResponse;
}
