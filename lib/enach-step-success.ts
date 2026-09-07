import { getFlowSyncActions, syncLoanFlowFromStage } from "@/lib/loan-flow-sync";
import { UserStagesInBackend } from "@/lib/user-stage";
import { useFlowStore } from "@/store/useFlowStore";

/**
 * After mandate verification succeeds on web: refresh user stage, then advance local wizard
 * only if backend stage is still ENACH (mirrors mobile `handleRegistrationStepSuccess`).
 */
export async function runEnachCompletionStageSync(): Promise<void> {
  const latest = await syncLoanFlowFromStage(getFlowSyncActions(), { enrichOffer: false });
  if (latest?.stage === UserStagesInBackend.ENACH) {
    useFlowStore.getState().next();
  }
}
