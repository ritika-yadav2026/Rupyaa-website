/**
 * Generic API response envelope used by the backend for normalized responses.
 * Mirror of the mobile contract so call sites can be typed identically.
 */
export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
  status?: number;
};

export type ApiError = {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
  status?: number;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Provider toggle — exactly one provider should be `true` at a time.
 * Keyed by provider name so new providers can be added without code changes.
 */
export type ProviderToggle = Record<string, boolean>;

/**
 * Shape of the `data` field returned by GET /external/config.
 * The index signature keeps the contract forward-compatible for new backend keys.
 */
export interface ExternalAppConfigData {
  faceKycProvider: ProviderToggle;
  esignProvider: ProviderToggle;
  bankVerificationProvider: ProviderToggle;
  callPlatform: ProviderToggle;
  whatsappProvider: ProviderToggle;
  bsaFlow: ProviderToggle;
  googleAuth: boolean;

  /** HyperVerge KYC workflow id (e.g. "selfie") */
  hyperKycWorkflowId?: string;
  /** HyperKYC SDK version (e.g. "10.3.0") */
  hyperKycSdkVersion?: string;
  /** CredEau device-sync API base URL (mobile only) */
  credeauServerUrl?: string;
  /** Web OAuth client ID for Google Sign-In */
  googleClientId?: string;
  /** Android OAuth client ID (mobile only) */
  androidGoogleClientId?: string;
  /** iOS OAuth client ID (mobile only) */
  iosGoogleClientId?: string;
  /** When true, skip requesting READ_SMS on Android */
  byPassSmsPermission?: boolean;
  /** API typo variant — backend has historically sent both spellings */
  byPassSmsPermssion?: boolean;
  /** Cashfree E-NACH gateway environment: "SANDBOX" or "PRODUCTION" */
  cashFreeEnachEnvironment?: string;
  /** Cashfree gateway environment: "SANDBOX" or "PRODUCTION" */
  cashfreEnvironment?: string;
  /** When true, show the Contacts menu in the Account screen */
  showGoogleContacts?: boolean;
  /** When true, users must complete internal review before ENACH and E-sign. */
  enablePreEnachReview?: boolean;
  /** Credeau client name for device-sync (mobile only) */
  credeauClientName?: string;
  /** Credeau client key UUID for device-sync (mobile only) */
  credeauClientKey?: string;
  /** Background sync interval in seconds for Credeau device-sync (mobile only) */
  backgroundSyncIntervalSeconds?: number;
  /** Max inbox SMS messages to read/upload per Android sync run (mobile only) */
  maxSmsToSync?: number;

  /** Phone numbers used for Play Store review; force SANDBOX for Cashfree gateways */
  playStorePhoneNumbers?: string[];

  [key: string]: ProviderToggle | boolean | string | number | string[] | undefined;
}

export type ExternalAppConfigResponse = ApiResponse<ExternalAppConfigData>;
