import { apiFetchWithAuth } from "@/lib/api";
import { API_ENDPOINTS, endpointPath, resolveEndpoint } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/lib/app-config-types";
import { asRecord } from "@/utils/common-helper";


function unwrapData<T>(raw: unknown): T {
  const envelope = raw as Partial<ApiResponse<T>>;
  if (
    envelope &&
    typeof envelope === "object" &&
    envelope.success === true &&
    envelope.data !== undefined &&
    envelope.data !== null
  ) {
    return envelope.data as T;
  }
  return raw as T;
}

export type EsignStatusResponse = {
  status?: string;
};

export async function getEsignStatus(): Promise<EsignStatusResponse> {
  const raw = await apiFetchWithAuth<unknown>(endpointPath(API_ENDPOINTS.sanction.esignStatus), {
    method: "GET",
  });
  const data = unwrapData<unknown>(raw);
  const obj = asRecord(data) ?? {};
  const status = typeof obj.status === "string" ? obj.status : "";
  return { status };
}

export function isEsignStatusCompleted(status: string | undefined): boolean {
  if (!status) return false;
  return status.trim().toLowerCase() === "completed";
}

export type InitiateSanctionDoqfyResponse = {
  invitationLink?: string;
};

export async function initiateSanctionDoqfy(params: {
  geoLocationEsign: string;
}): Promise<InitiateSanctionDoqfyResponse> {
  const raw = await apiFetchWithAuth<unknown>(endpointPath(API_ENDPOINTS.sanction.initiateDoqfy), {
    method: "POST",
    body: JSON.stringify({ geoLocationEsign: params.geoLocationEsign }),
  });
  const data = unwrapData<unknown>(raw);
  const obj = asRecord(data) ?? {};
  const invitationLink =
    typeof obj.invitationLink === "string" && obj.invitationLink.length > 0
      ? obj.invitationLink
      : typeof obj.invitation_url === "string"
        ? obj.invitation_url
        : "";
  return { invitationLink: invitationLink || undefined };
}

export type GenerateAgreementAutomaticResponse = {
  message?: string;
  success?: boolean;
};

export async function generateAgreementAutomatic(loanId: string): Promise<GenerateAgreementAutomaticResponse> {
  const path = resolveEndpoint(API_ENDPOINTS.loans.generateAgreementAutomatic, { id: loanId });
  return apiFetchWithAuth<GenerateAgreementAutomaticResponse>(endpointPath(path), {
    method: "POST",
    body: JSON.stringify({}),
  });
}
