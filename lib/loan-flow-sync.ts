import { isPendingOfferStatusForUnderReview } from "@/helpers/loan-helper";
import { fetchCurrentOfferForBankStatement } from "@/lib/fetch-current-offer";
import { logOfferCurrentEvent } from "@/lib/offer-current-debug";
import {
  buildDebugUserStageResponse,
  resolveLoanFlowDebugTarget,
} from "@/lib/loan-flow-debug";
import { getUserStage, type GetUserStageContext, type GetUserStageResponse } from "@/lib/user-api";
import { useFlowStore } from "@/store/useFlowStore";
import type { UserStageSectionsCompleted } from "@/lib/user-stage";

export type FlowSyncActions = {
  setFlowFromUserStage: (
    showDashboard: boolean,
    stage: string,
    sectionsCompleted?: UserStageSectionsCompleted,
    stageContext?: GetUserStageContext | null,
    stageResponse?: GetUserStageResponse,
  ) => void;
  setOfferAmount: (amount: number | null) => void;
  setShowUpdateButton: (show: boolean) => void;
  setFlowState: (state: "soft_pull" | "offer" | "under_review" | "manual_upload") => void;
};

export type SyncLoanFlowOptions = {
  /**
   * When the caller already has a fresh user-stage payload (e.g. React Query in RedirectionStageFetcher),
   * pass it here to avoid a duplicate GET /user/stage and keep a single source of truth.
   */
  stageResponse?: GetUserStageResponse | null;
  /**
   * When true and stage is OFFERINGS (not pending under review), runs GET /offer/current.
   * Defaults to false — opt in at landing / explicit offer screens to avoid duplicate fetches.
   */
  enrichOffer?: boolean;
};

/** Reads flow store actions at call time (stable references; no hook dependency churn). */
export function getFlowSyncActions(): FlowSyncActions {
  const s = useFlowStore.getState();
  return {
    setFlowFromUserStage: s.setFlowFromUserStage,
    setOfferAmount: s.setOfferAmount,
    setShowUpdateButton: s.setShowUpdateButton,
    setFlowState: s.setFlowState,
  };
}

function applyUserStageToFlow(
  actions: FlowSyncActions,
  stageData: GetUserStageResponse,
): void {
  actions.setFlowFromUserStage(
    stageData.showDashboard ?? false,
    stageData.stage,
    stageData.sectionsCompleted,
    stageData.context,
    stageData,
  );
}

async function hydrateOfferForOfferingsStage(
  actions: FlowSyncActions,
  from: string,
): Promise<void> {
  logOfferCurrentEvent("syncLoanFlowFromStage → enrichOffer", { from });
  await fetchCurrentOfferForBankStatement({ force: true, from: `syncLoanFlowFromStage:${from}` });
  actions.setFlowState("offer");
}

/**
 * Reconciles client loan flow state with the backend user stage.
 *
 * 1. Resolves latest stage (from `options.stageResponse` or GET /user/stage).
 * 2. Persists `userStageResponse` and applies `setFlowFromUserStage` (phase / substep / flags from stage mapping).
 * 3. When `enrichOffer` is true and stage is OFFERINGS, enriches via {@link fetchCurrentOfferForBankStatement}.
 */
export async function syncLoanFlowFromStage(
  actions: FlowSyncActions = getFlowSyncActions(),
  options?: SyncLoanFlowOptions,
): Promise<GetUserStageResponse | null> {
  const prefetched = options?.stageResponse;
  const debugTarget = prefetched ? null : resolveLoanFlowDebugTarget();
  const stageData =
    prefetched?.stage != null && String(prefetched.stage).length > 0
      ? prefetched
      : debugTarget
        ? buildDebugUserStageResponse(debugTarget.stage)
        : await getUserStage({ device: "web" });

  if (!stageData?.stage) {
    return null;
  }

  applyUserStageToFlow(actions, stageData);

  const shouldEnrichOffer = options?.enrichOffer === true;
  const offeringsPendingReview = isPendingOfferStatusForUnderReview(
    stageData.context?.offerStatus,
  );
  logOfferCurrentEvent("syncLoanFlowFromStage → offer enrich decision", {
    stage: stageData.stage,
    enrichOffer: shouldEnrichOffer,
    offeringsPendingReview,
    willFetchOffer:
      shouldEnrichOffer &&
      stageData.stage === "OFFERINGS" &&
      !offeringsPendingReview,
  });
  if (
    shouldEnrichOffer &&
    stageData.stage === "OFFERINGS" &&
    !offeringsPendingReview
  ) {
    await hydrateOfferForOfferingsStage(actions, "OFFERINGS");
  }

  return stageData;
}
