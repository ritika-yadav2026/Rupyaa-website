import {
  isKnownBackendStage,
  normalizeBackendStage,
} from "@/config/stageMapping";
import type { GetUserStageResponse } from "@/lib/user-api";
import type { UserStageSectionsCompleted } from "@/lib/user-stage";

/** Query string key used to bypass GET /user/stage in development builds. */
export const LOAN_FLOW_DEBUG_STAGE_PARAM = "loanDebugStage";
const LOAN_FLOW_DEBUG_FAMILY_COMPLETE_PARAM = "familyComplete";
const LOAN_FLOW_DEBUG_REFERENCE_COMPLETE_PARAM = "referenceComplete";
const LOAN_FLOW_DEBUG_FAMILY_REFERENCE_COMPLETE_PARAM = "familyReferenceComplete";

function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

function readSearchString(search?: string): string {
  if (typeof search === "string") return search;
  if (typeof window !== "undefined") return window.location.search;
  return "";
}

/**
 * Reads `?loanDebugStage=...` from the given (or current) location search.
 * Returns the raw param value or `null` when missing/empty. No dev gating here
 * so callers can decide whether to log unknown stages outside development.
 */
export function getLoanFlowDebugStageFromSearch(search?: string): string | null {
  const raw = readSearchString(search);
  if (!raw) return null;
  const params = new URLSearchParams(raw.startsWith("?") ? raw.slice(1) : raw);
  const value = params.get(LOAN_FLOW_DEBUG_STAGE_PARAM);
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseBooleanDebugParam(value: string | null): boolean | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === "1" || normalized === "true" || normalized === "yes") return true;
  if (normalized === "0" || normalized === "false" || normalized === "no") return false;
  return undefined;
}

function readSectionsCompletedFromSearch(
  params: URLSearchParams,
): UserStageSectionsCompleted | undefined {
  const isFamilyComplete = parseBooleanDebugParam(
    params.get(LOAN_FLOW_DEBUG_FAMILY_COMPLETE_PARAM),
  );
  const isReferenceComplete = parseBooleanDebugParam(
    params.get(LOAN_FLOW_DEBUG_REFERENCE_COMPLETE_PARAM),
  );
  const isFamilyReferenceComplete = parseBooleanDebugParam(
    params.get(LOAN_FLOW_DEBUG_FAMILY_REFERENCE_COMPLETE_PARAM),
  );

  const sections: UserStageSectionsCompleted = {
    ...(isFamilyComplete !== undefined && { isFamilyComplete }),
    ...(isReferenceComplete !== undefined && { isReferenceComplete }),
    ...(isFamilyReferenceComplete !== undefined && { isFamilyReferenceComplete }),
  };
  return Object.keys(sections).length > 0 ? sections : undefined;
}

/**
 * Resolves the debug target stage, only honored in development builds.
 * Returns `{ stage }` with the normalized backend stage or `null` when the
 * bypass should not be applied (production, missing param, unknown stage).
 */
export function resolveLoanFlowDebugTarget(
  search?: string,
): { stage: string; sectionsCompleted?: UserStageSectionsCompleted } | null {
  if (!isDev()) return null;

  const searchString = readSearchString(search);
  const params = new URLSearchParams(
    searchString.startsWith("?") ? searchString.slice(1) : searchString,
  );
  const raw = params.get(LOAN_FLOW_DEBUG_STAGE_PARAM)?.trim();
  if (!raw) return null;

  const stage = normalizeBackendStage(raw);
  if (!isKnownBackendStage(stage)) {
    console.warn(
      `[loan-flow-debug] Unknown ${LOAN_FLOW_DEBUG_STAGE_PARAM}=${raw}; ignoring bypass.`,
    );
    return null;
  }

  return {
    stage,
    sectionsCompleted: readSectionsCompletedFromSearch(params),
  };
}

export function isLoanFlowDebugActive(search?: string): boolean {
  return resolveLoanFlowDebugTarget(search) !== null;
}

/**
 * Builds a synthetic GetUserStageResponse for the given backend stage so the
 * existing flow-sync pipeline can treat the bypass exactly like a real fetch.
 */
export function buildDebugUserStageResponse(
  stage: string,
  sectionsCompleted?: UserStageSectionsCompleted,
): GetUserStageResponse {
  return {
    showDashboard: false,
    stage: normalizeBackendStage(stage),
    sectionsCompleted,
  };
}
