import { apiFetchWithAuth } from "@/lib/api";
import { API_ENDPOINTS, endpointPath } from "@/lib/api-endpoints";

export type ImportGoogleContactsResponse = {
  message?: string;
  success?: boolean;
};

/**
 * POST /auth/contacts/google — same contract as mobile (`access_token` in body).
 */
export async function importGoogleContacts(accessToken: string): Promise<ImportGoogleContactsResponse> {
  return apiFetchWithAuth<ImportGoogleContactsResponse>(
    endpointPath(API_ENDPOINTS.auth.importGoogleContacts),
    {
      method: "POST",
      body: JSON.stringify({ access_token: accessToken }),
    }
  );
}
