/**
 * HyperVerge Web SDK launch per official integration guide:
 * - Build `new HyperKycConfig(jwtToken, workflowId, transactionId, showLandingPage)`
 * - Optional: `hyperKycConfig.setInputs({ ... })` before launch
 * - `HyperKYCModule.launch(hyperKycConfig, callback)` — callback receives HyperKycResult with `.status`
 *
 * Do not log the JWT or full result payloads — they may contain PII.
 */

const CDN_URL_TEMPLATE = "https://hv-web-sdk-cdn.hyperverge.co/hyperverge-web-sdk@{version}/src/sdk.min.js";

export type HyperKycSdkStatus =
  | "auto_approved"
  | "needs_review"
  | "auto_declined"
  | "user_cancelled"
  | "error";

export type HyperKycSdkResult = {
  status: HyperKycSdkStatus;
  raw?: unknown;
  errorMessage?: string;
};

export type LaunchHyperKycWebConfig = {
  accessToken: string;
  transactionId: string;
  workflowId: string;
  sdkVersion: string;
  showLandingPage: boolean;
  inputImageUrl?: string | null;
};

type HyperKycLaunchPayloadStatus =
  | "auto_approved"
  | "autoApproved"
  | "approved"
  | "needs_review"
  | "needsReview"
  | "auto_declined"
  | "autoDeclined"
  | "declined"
  | "user_cancelled"
  | "userCancelled"
  | "user_cancellation"
  | "error";

type HyperKycResultPayload = {
  status?: HyperKycLaunchPayloadStatus | string;
  errorMessage?: string;
  message?: string;
  details?: unknown;
};

/** Instance returned by `new HyperKycConfig(...)` — chain setInputs before launch */
export type HyperKycConfigInstance = {
  setInputs: (inputs: Record<string, unknown>) => void;
};

type HyperKycModuleLaunch = {
  launch: (
    hyperKycConfig: HyperKycConfigInstance,
    callback: (result: unknown) => void
  ) => Promise<unknown> | void;
};

type HyperKycConfigConstructor = new (
  jwtToken: string,
  workflowId: string,
  transactionId: string,
  showLandingPage?: boolean
) => HyperKycConfigInstance;

declare global {
  interface Window {
    HyperKYCModule?: HyperKycModuleLaunch;
    HyperKycConfig?: HyperKycConfigConstructor;
  }
}

let scriptLoadPromise: Promise<void> | null = null;
let loadedSdkVersion: string | null = null;

function buildSdkUrl(version: string): string {
  return CDN_URL_TEMPLATE.replace("{version}", version);
}

export function loadHyperKycSdkScript(version: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("HyperKYC SDK can only load in the browser"));
  }
  const trimmed = version.trim();
  if (!trimmed) {
    return Promise.reject(new Error("HyperKYC SDK version is required"));
  }

  if (window.HyperKYCModule && window.HyperKycConfig && loadedSdkVersion === trimmed) {
    return Promise.resolve();
  }
  if (scriptLoadPromise && loadedSdkVersion === trimmed) {
    return scriptLoadPromise;
  }

  loadedSdkVersion = trimmed;
  scriptLoadPromise = new Promise<void>((resolve, reject) => {
    const url = buildSdkUrl(trimmed);
    const escapedVersion = trimmed.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-hyperkyc-sdk="true"][data-hyperkyc-version="${escapedVersion}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load HyperKYC SDK")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.dataset.hyperkycSdk = "true";
    script.dataset.hyperkycVersion = trimmed;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => {
        scriptLoadPromise = null;
        loadedSdkVersion = null;
        reject(new Error("Failed to load HyperKYC SDK"));
      },
      { once: true }
    );
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

function coerceHyperKycResult(raw: unknown): HyperKycResultPayload {
  if (!raw || typeof raw !== "object") return {};
  const obj = raw as Record<string, unknown>;
  if ("HyperKYCResult" in obj && obj.HyperKYCResult && typeof obj.HyperKYCResult === "object") {
    return obj.HyperKYCResult as HyperKycResultPayload;
  }
  return raw as HyperKycResultPayload;
}

function normalizeStatus(raw: HyperKycResultPayload["status"]): HyperKycSdkStatus {
  const value = String(raw ?? "").trim().toLowerCase();
  if (value === "auto_approved" || value === "autoapproved" || value === "approved") {
    return "auto_approved";
  }
  if (value === "needs_review" || value === "needsreview") {
    return "needs_review";
  }
  if (value === "auto_declined" || value === "autodeclined" || value === "declined") {
    return "auto_declined";
  }
  if (
    value === "user_cancelled" ||
    value === "usercancelled" ||
    value === "user_cancellation"
  ) {
    return "user_cancelled";
  }
  return "error";
}

/**
 * Loads the SDK if needed and launches HyperKYC using HyperKycConfig + HyperKYCModule.launch.
 */
export async function launchHyperKycWeb(
  config: LaunchHyperKycWebConfig
): Promise<HyperKycSdkResult> {
  const accessToken = config.accessToken?.trim();
  const transactionId = config.transactionId?.trim();
  const workflowId = config.workflowId?.trim();
  const sdkVersion = config.sdkVersion?.trim();
  const showLandingPage = config.showLandingPage;

  if (
    !accessToken ||
    !transactionId ||
    !workflowId ||
    !sdkVersion ||
    typeof showLandingPage !== "boolean"
  ) {
    return {
      status: "error",
      errorMessage:
        "Missing accessToken, transactionId, workflowId, sdkVersion, or showLandingPage",
    };
  }

  try {
    await loadHyperKycSdkScript(sdkVersion);
  } catch (error) {
    return {
      status: "error",
      errorMessage: error instanceof Error ? error.message : "Failed to load HyperKYC SDK",
    };
  }

  const HyperKycConfig = typeof window !== "undefined" ? window.HyperKycConfig : undefined;
  const HyperKYCModule = typeof window !== "undefined" ? window.HyperKYCModule : undefined;

  if (!HyperKycConfig) {
    return {
      status: "error",
      errorMessage: "HyperKycConfig is not available after loading the SDK script",
    };
  }
  if (!HyperKYCModule?.launch) {
    return { status: "error", errorMessage: "HyperKYCModule.launch is not available" };
  }

  try {
    const hyperKycConfig = new HyperKycConfig(
      accessToken,
      workflowId,
      transactionId,
      showLandingPage
    );

    if (config.inputImageUrl?.trim()) {
      hyperKycConfig.setInputs({ input_image: config.inputImageUrl.trim() });
    }

    return await new Promise<HyperKycSdkResult>((resolve) => {
      const onResult = (rawResult: unknown) => {
        const payload = coerceHyperKycResult(rawResult);
        const status = normalizeStatus(payload.status);
        resolve({
          status,
          raw: payload,
          errorMessage: payload.errorMessage ?? payload.message,
        });
      };

      try {
        const maybePromise = HyperKYCModule.launch(hyperKycConfig, onResult);
        if (maybePromise && typeof (maybePromise as Promise<unknown>).then === "function") {
          void (maybePromise as Promise<unknown>).catch((err: unknown) => {
            resolve({
              status: "error",
              errorMessage:
                err instanceof Error ? err.message : "HyperKYC launch promise rejected",
            });
          });
        }
      } catch (error) {
        resolve({
          status: "error",
          errorMessage: error instanceof Error ? error.message : "HyperKYC launch failed",
        });
      }
    });
  } catch (error) {
    return {
      status: "error",
      errorMessage: error instanceof Error ? error.message : "Failed to create HyperKycConfig",
    };
  }
}
