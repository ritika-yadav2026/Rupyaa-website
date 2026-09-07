import { apiFetch } from "./api";
import { API_ENDPOINTS, endpointPath } from "./api-endpoints";

export type GenerateOtpResponse = {
  message: string;
  success: boolean;
  otpValue?: string;
};

/**
 * Marketing / tracking query parameters, keyed by their original URL names
 * (e.g. `utm_campaign`, `utm_medium`). Frontend does not rename these.
 */
export type MarketingAttribution = Readonly<Record<string, string>>;

export type CheckOtpSignupLoginResponse = {
  message: string;
  token: string;
  refreshToken: string;
  isOauthDone: boolean;
  isVerified: boolean;
  success: boolean;
  userId: string;
  leadId: string;
};

export async function generateOtp(
  phoneNumber: string
): Promise<GenerateOtpResponse> {
  const data = await apiFetch<GenerateOtpResponse>(
    endpointPath(API_ENDPOINTS.otp.generate),
    {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    }
  );
  if (!data.success) {
    throw new Error(data.message ?? "Failed to generate OTP");
  }
  return data;
}

export type RefreshTokenResponse = {
  success: boolean;
  message: string;
  token: string;
};

export async function refreshToken(
  refreshTokenValue: string
): Promise<RefreshTokenResponse> {
  const data = await apiFetch<RefreshTokenResponse>(
    endpointPath(API_ENDPOINTS.auth.refreshToken),
    {
      method: "POST",
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    }
  );
  if (!data.success) {
    throw new Error(data.message ?? "Failed to refresh token");
  }
  return data;
}

export async function checkOtpSignupLogin(
  phoneNumber: string,
  otp: string,
  attribution?: MarketingAttribution
): Promise<CheckOtpSignupLoginResponse> {
  const data = await apiFetch<CheckOtpSignupLoginResponse>(
    endpointPath(API_ENDPOINTS.auth.checkOtpSignupLogin),
    {
      method: "POST",
      body: JSON.stringify({
        phoneNumber,
        otp,
        ...(attribution ?? {}),
      }),
    }
  );
  if (!data.success) {
    throw new Error(data.message ?? "Invalid OTP");
  }
  return data;
}

/**
 * DSA SSO ticket exchange response. Unlike OTP sessions, this path does not
 * return a refresh token — only the access `token`.
 */
export type ExchangeDsaSessionResponse = {
  message: string;
  token: string;
  isOauthDone: boolean;
  isVerified: boolean;
  success: boolean;
  deviceType?: string;
  userId: string;
  leadId: string;
};

export type ExchangeDsaSessionParams = {
  ticket: string;
  attribution?: MarketingAttribution;
  deviceType?: string;
};

/**
 * Exchanges a one-time DSA SSO ticket for a ZapCash access session.
 * POST /auth/sessions/dsa — no partner API key; ticket is the credential.
 */
export async function exchangeDsaSession(
  params: ExchangeDsaSessionParams
): Promise<ExchangeDsaSessionResponse> {
  const { ticket, attribution, deviceType = "web" } = params;
  const data = await apiFetch<ExchangeDsaSessionResponse>(
    endpointPath(API_ENDPOINTS.auth.dsaSession),
    {
      method: "POST",
      headers: {
        platform: "ZAPCASH",
      },
      body: JSON.stringify({
        ticket,
        deviceType,
        ...(attribution ?? {}),
      }),
    }
  );
  if (!data.success) {
    throw new Error(data.message ?? "SSO sign-in failed");
  }
  return data;
}
