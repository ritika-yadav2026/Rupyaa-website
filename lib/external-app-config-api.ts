import { apiFetchWithAuth } from "./api";
import { API_ENDPOINTS, endpointPath } from "./api-endpoints";
import type {
  ApiResponse,
  ExternalAppConfigData,
  ProviderToggle,
} from "./app-config-types";

/** Static fallback for HyperKYC SDK version when the API does not include one. */
const DEFAULT_HYPERKYC_SDK_VERSION = "8.4.0";

let cachedConfig: ExternalAppConfigData | null = null;
let inflightPromise: Promise<ExternalAppConfigData | null> | null = null;

/**
 * GET /external/config
 *
 * Resolves to `null` (not throw) when the backend reports `success: false`
 * or omits `data`, so callers can transparently fall back to static defaults.
 * Concurrent callers share a single in-flight request; the result is cached
 * for the rest of the session and can be cleared via `clearExternalAppConfigCache()`.
 */
export async function fetchExternalAppConfig(
  options: { force?: boolean } = {},
): Promise<ExternalAppConfigData | null> {
  if (!options.force && cachedConfig) {
    return cachedConfig;
  }
  if (!options.force && inflightPromise) {
    return inflightPromise;
  }

  inflightPromise = (async () => {
    try {
      const response = await apiFetchWithAuth<ApiResponse<ExternalAppConfigData>>(
        endpointPath(API_ENDPOINTS.external.externalAppConfig),
        { method: "GET" },
      );
      if (!response || response.success !== true || !response.data) {
        return null;
      }
      cachedConfig = response.data;
      return cachedConfig;
    } catch {
      return null;
    } finally {
      inflightPromise = null;
    }
  })();

  return inflightPromise;
}

export function clearExternalAppConfigCache(): void {
  cachedConfig = null;
  inflightPromise = null;
}

/** Synchronous read of the last successful GET /external/config response, if any. */
export function getCachedExternalAppConfig(): ExternalAppConfigData | null {
  return cachedConfig;
}

/**
 * Returns the first provider key in the toggle whose value is `true`.
 * Defensive against `undefined` toggles and toggles with no enabled provider.
 */
export function getActiveProvider(
  toggle: ProviderToggle | undefined,
): string | undefined {
  if (!toggle || typeof toggle !== "object") return undefined;
  return Object.keys(toggle).find((key) => toggle[key] === true);
}

export type HyperKycLaunchParams = {
  workflowId: string;
  sdkVersion: string;
  showLandingPage: boolean;
};

/**
 * Resolves runtime HyperKYC launch parameters from the external app config.
 * Falls back to a static SDK version when the API omits one; `workflowId` has
 * no safe default — callers must surface a configuration error when it is empty.
 */
export function resolveHyperKycLaunchParams(
  config: ExternalAppConfigData | null,
): HyperKycLaunchParams {
  const workflowId = config?.hyperKycWorkflowId?.trim() ?? "";
  const sdkVersion =
    config?.hyperKycSdkVersion?.trim() || DEFAULT_HYPERKYC_SDK_VERSION;
  const rawShowLandingPage = config?.["showLandingPage"];
  const showLandingPage =
    typeof rawShowLandingPage === "boolean" ? rawShowLandingPage : true;
  return { workflowId, sdkVersion, showLandingPage };
}
