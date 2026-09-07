import {
  getUserStage,
  postPersonalDetails,
  type GetUserStageResponse,
  type PostPersonalDetailsPayload,
} from "@/lib/user-api";

export async function submitPersonalEmploymentDetails(
  payload: PostPersonalDetailsPayload,
): Promise<GetUserStageResponse> {
  await postPersonalDetails(payload);
  return getUserStage({ device: "web" });
}
