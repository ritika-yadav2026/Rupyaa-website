import {
  decryptResponse,
  encryptPayload,
  getEncryptionEnabled,
} from "./api-encryption";
import {
  buildAbsoluteApiUrl,
  isAbsoluteUrl,
  shouldUseNgrokHeader,
} from "./api-config";
import { sanitizeApiErrorMessage } from "./error-message";
import { useGeoStore } from "@/store/useGeoStore";

type ApiOptions = RequestInit & {
  params?: Record<string, string>;
  token?: string | null;
};

const GEO_LOCATION_HEADER = "x-geo-location";

function getGeoLocationHeaderValue(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const location = useGeoStore.getState().location;
  if (!location) return undefined;
  return `${location.latitude},${location.longitude}`;
}

/**
 * Adds `x-geo-location: <lat>,<lng>` when a fix is available in the geo store.
 */
export function withGeoLocationHeader(
  headers: Record<string, string> = {}
): Record<string, string> {
  const geoLocation = getGeoLocationHeaderValue();
  if (!geoLocation) return headers;
  return {
    ...headers,
    [GEO_LOCATION_HEADER]: geoLocation,
  };
}

export const getCommonHeaders = () => {
  return withGeoLocationHeader({
    "Content-Type": "application/json",
    "X-Platform": "web",
  });
};

/**
 * Builds an absolute URL to the backend (browser and server call NEXT_PUBLIC_API_URL directly).
 */
function buildUrl(
  path: string,
  params?: Record<string, string>,
  useMockProxy = false,
  encryptedPayload?: string
): string {
  const url = new URL(buildAbsoluteApiUrl(path, useMockProxy));
  if (encryptedPayload) {
    url.searchParams.set("payload", encryptedPayload);
  } else if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.set(key, value)
    );
  }
  return url.toString();
}

function buildHeaders(options: {
  initHeaders?: Record<string, string>;
  token?: string | null;
  useMockProxy?: boolean;
}): Record<string, string> {
  const { initHeaders = {}, token, useMockProxy = false } = options;
  const headers: Record<string, string> = {
    ...getCommonHeaders(),
    ...initHeaders,
  };
  if (shouldUseNgrokHeader(useMockProxy)) {
    headers["ngrok-skip-browser-warning"] = "true";
  }
  if (token) {
    headers["Authorization"] = token;
  }
  return headers;
}

/**
 * Removes backend-internal stack traces when APIs append them after `|<newline>` or `\nStack:`.
 * Keeps only the user-facing line(s), e.g. mandate cooldown messages from `/mandates`.
 */
export function scrubApiErrorStringForDisplay(text: string): string {
  let s = text.trim();
  if (!s) return s;

  const pipeBreak = s.split(/\|\s*\r?\n/);
  if (pipeBreak.length > 1) {
    s = pipeBreak[0].trim();
  }

  const stackIdx = s.search(/\r?\n\s*Stack:/i);
  if (stackIdx !== -1) {
    s = s.slice(0, stackIdx).trim();
  }

  return s.replace(/\|\s*$/g, "").trim();
}

/**
 * Reads user-visible error text from common API JSON shapes (`message`, string `error`,
 * or nested `error.message`). String bodies may include appended stacks — see {@link scrubApiErrorStringForDisplay}.
 */
export function extractApiUserMessage(parsed: unknown): string | undefined {
  if (!parsed || typeof parsed !== "object") return undefined;
  const o = parsed as Record<string, unknown>;
  if (typeof o.message === "string" && o.message.trim()) {
    return scrubApiErrorStringForDisplay(o.message);
  }
  if (typeof o.error === "string" && o.error.trim()) {
    return scrubApiErrorStringForDisplay(o.error);
  }
  if (o.error && typeof o.error === "object" && o.error !== null) {
    const inner = (o.error as Record<string, unknown>).message;
    if (typeof inner === "string" && inner.trim()) {
      return scrubApiErrorStringForDisplay(inner);
    }
  }
  return undefined;
}

async function parseJsonOrThrow(
  res: Response,
  fallbackMessage: string,
  rawText?: string
): Promise<unknown> {
  const text = rawText ?? (await res.text());
  if (!text || text.trim().startsWith("<")) {
    throw new Error(
      res.ok
        ? "Server returned an invalid response. The API may be unavailable or misconfigured."
        : fallbackMessage
    );
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(
      res.ok
        ? "Server returned an invalid response. The API may be unavailable or misconfigured."
        : fallbackMessage
    );
  }
}

async function throwIfNotOk(
  res: Response,
  text: string | undefined,
  encryptionEnabled: boolean
): Promise<never> {
  try {
    let parsed = await parseJsonOrThrow(res, res.statusText, text);
    if (encryptionEnabled && typeof parsed === "object" && parsed !== null && "data" in parsed && typeof (parsed as { data: string }).data === "string") {
      parsed = await decryptResponse<{ message?: string }>(parsed as { data: string });
    }
    const apiMessage = extractApiUserMessage(parsed);
    throw new Error(
      sanitizeApiErrorMessage(apiMessage, res.statusText || "Request failed")
    );
  } catch (e) {
    if (e instanceof Error && !e.message.includes("Server returned") && !e.message.includes("invalid response")) {
      throw e;
    }
    throw new Error(res.statusText || "Request failed");
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions & { useMockProxy?: boolean } = {}
): Promise<T> {
  const encryptionEnabled = await getEncryptionEnabled();
  const { params, token, useMockProxy = false, body, method, ...init } = options;
  let finalUrl = buildUrl(path, params, useMockProxy);
  const canEncryptQueryParams = !isAbsoluteUrl(path);
  let finalBody: string | undefined = body as string | undefined;
  if (encryptionEnabled) {
    const hasBody = body && (method === "POST" || method === "PUT" || method === "PATCH");
    if (hasBody && typeof body === "string") {
      const parsed = JSON.parse(body) as unknown;
      const encrypted = await encryptPayload(parsed);
      finalBody = JSON.stringify({ data: encrypted });
    } else if (canEncryptQueryParams && (params || method === "GET" || !method)) {
      const payload = params ?? {};
      const encrypted = await encryptPayload(payload);
      finalUrl = buildUrl(path, undefined, useMockProxy, encrypted);
    }
  }
  const headers = buildHeaders({
    initHeaders: init.headers as Record<string, string>,
    token,
    useMockProxy,
  });
  const res = await fetch(finalUrl, {
    ...init,
    method,
    body: finalBody,
    headers,
    // Avoid 304 + stale cached bodies for authenticated API data (browser HTTP cache + ETag).
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) {
    await throwIfNotOk(res, text, encryptionEnabled);
  }
  const raw = (await parseJsonOrThrow(res, "Request failed", text)) as unknown;
  if (encryptionEnabled && typeof raw === "object" && raw !== null && "data" in raw && typeof (raw as { data: string }).data === "string") {
    return decryptResponse<T>(raw as { data: string });
  }
  return raw as T;
}

/** Use for authenticated requests. On 401, refreshes token and retries once. */
export async function apiFetchWithAuth<T>(
  path: string,
  options: Omit<ApiOptions, "token"> = {}
): Promise<T> {
  const encryptionEnabled = await getEncryptionEnabled();
  const { useAuthStore } = await import("@/store/useAuthStore");
  const { refreshToken } = await import("@/lib/auth-api");

  const { params, body, method, ...init } = options;
  let finalUrl = buildUrl(path, params);
  let finalBody: string | undefined = body as string | undefined;
  if (encryptionEnabled) {
    const hasBody = body && (method === "POST" || method === "PUT" || method === "PATCH");
    if (hasBody && typeof body === "string") {
      const parsed = JSON.parse(body) as unknown;
      const encrypted = await encryptPayload(parsed);
      finalBody = JSON.stringify({ data: encrypted });
    } else if (params || method === "GET" || !method) {
      const payload = params ?? {};
      const encrypted = await encryptPayload(payload);
      finalUrl = buildUrl(path, undefined, false, encrypted);
    }
  }

  const makeRequest = async (token: string | null): Promise<Response> => {
    const headers = buildHeaders({
      initHeaders: init.headers as Record<string, string>,
      token,
    });
    return fetch(finalUrl, {
      ...init,
      method,
      body: finalBody,
      headers,
      cache: "no-store",
    });
  };

  const parseResponse = async <TRes>(res: Response): Promise<TRes> => {
    const text = await res.text();
    if (!res.ok) {
      await throwIfNotOk(res, text, encryptionEnabled);
    }
    const raw = (await parseJsonOrThrow(res, "Request failed", text)) as unknown;
    if (encryptionEnabled && typeof raw === "object" && raw !== null && "data" in raw && typeof (raw as { data: string }).data === "string") {
      return decryptResponse<TRes>(raw as { data: string });
    }
    return raw as TRes;
  };

  const token = useAuthStore.getState().token;
  let res = await makeRequest(token);

  if (res.status === 401) {
    const refreshTokenValue = useAuthStore.getState().refreshToken;
    if (!refreshTokenValue) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
      const errText = await res.clone().text();
      await throwIfNotOk(res, errText, encryptionEnabled);
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
        const errText = await res.clone().text();
        await throwIfNotOk(res, errText, encryptionEnabled);
      }
    } catch {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
      const errText = await res.clone().text();
      await throwIfNotOk(res, errText, encryptionEnabled);
    }
  }

  return parseResponse<T>(res);
}
