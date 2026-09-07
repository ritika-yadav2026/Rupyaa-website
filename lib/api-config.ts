const DEFAULT_API_BASE_URL = "https://staging2-api.zapcash.in";
const DEFAULT_API_PATH_PREFIX = "/api/v1";

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, "");
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function normalizePathPrefix(prefix: string): string {
  const trimmed = prefix.trim();
  if (!trimmed || trimmed === "/") {
    return "";
  }
  return normalizePath(trimmed).replace(/\/$/, "");
}

export const PUBLIC_API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE_URL
);

export const MOCK_API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_MOCK_API_URL ?? DEFAULT_API_BASE_URL
);

export const API_PATH_PREFIX = normalizePathPrefix(
 DEFAULT_API_PATH_PREFIX
);

export function isAbsoluteUrl(path: string): boolean {
  return /^https?:\/\//i.test(path);
}

export function joinApiPath(prefix: string, endpointPath: string): string {
  const normalizedPrefix = normalizePathPrefix(prefix);
  const normalizedPath = normalizePath(endpointPath);
  return `${normalizedPrefix}${normalizedPath}`;
}

export function apiPath(endpointPath: string): string {
  return joinApiPath(API_PATH_PREFIX, endpointPath);
}

export function buildAbsoluteApiUrl(path: string, useMockProxy = false): string {
  if (isAbsoluteUrl(path)) {
    return path;
  }
  const baseUrl = useMockProxy ? MOCK_API_BASE_URL : PUBLIC_API_BASE_URL;
  const normalizedPath = normalizePath(path);
  return new URL(normalizedPath, `${baseUrl}/`).toString();
}

export function shouldUseNgrokHeader(useMockProxy = false): boolean {
  const baseUrl = useMockProxy ? MOCK_API_BASE_URL : PUBLIC_API_BASE_URL;
  return baseUrl.includes("ngrok");
}
