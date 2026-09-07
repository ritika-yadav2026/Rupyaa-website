import { apiFetchWithAuth } from "./api";
import { API_ENDPOINTS, endpointPath } from "./api-endpoints";

export type RedirectionStageResponse = {
  success: boolean;
  userId: string;
  currentStage: string;
};

export async function getRedirectionStage(): Promise<RedirectionStageResponse> {
  return apiFetchWithAuth<RedirectionStageResponse>(
    endpointPath(API_ENDPOINTS.cbl.getRedirectionStage)
  );
}
