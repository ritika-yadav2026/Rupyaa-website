import { UserStage } from "@/lib/user-stage";

/**
 * Stages that have a dedicated web hero flow.
 * Anything outside this set (non-empty raw stage) → unsupported_stage_download.
 */
export const WEB_SUPPORTED_STAGES = new Set<string>([
  "",
  "PERSONAL_DETAILS",
  "MODE_OF_EMPLOYMENT",
  "SOFT_PULL",
  "OFFERINGS",
  "ACTIVE_LOAN_DASHBOARD",
  ...UserStage,
]);
