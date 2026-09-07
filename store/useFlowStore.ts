import { create } from "zustand";
import { getFlowMappingFromStage } from "@/config/stageMapping";
import {
  FLOW_PHASES,
  type FlowContext,
  type FlowContextState,
  type FlowPhase,
  findPositionBySubstepId,
  getPhaseByIndex,
  getProgressSteps,
  getSubstepCount,
} from "@/config/flowConfig";
import { shouldRouteOfferingsToUnderReviewFromStage } from "@/helpers/loan-helper";
import { resolveFlowPositionFromUserStage } from "@/lib/flow-progress";
import type { GetUserStageContext } from "@/lib/user-api";
import type { UserStage, UserStageSectionsCompleted } from "@/lib/user-stage";

export const DEFAULT_OFFER_AMOUNT = 33000;

const DEFAULT_FLOW_CONTEXT: FlowContext = {
  flowState: "offer",
  hasOffer: false,
};

type FlowState = {
  steps: readonly string[];
  phaseIndex: number;
  substepIndex: number;
  flowContext: FlowContext;
  disbursalSubmitted: boolean;
  employmentDetailsSubmitted: boolean;
  applicationCompleted: boolean;
  applicationRejected: boolean;
  showDownloadApp: boolean;
  offerAmount: number | null;
  showUpdateButton: boolean;
  /** Bank-connect entered from approved-offer “improve offer” (native parity). */
  cameFromOfferings: boolean;
  userStageResponse: import("@/lib/user-api").GetUserStageResponse | null;
};

type FlowActions = {
  setOfferAmount: (payload: number | null) => void;
  setShowUpdateButton: (payload: boolean) => void;
  setCameFromOfferings: (payload: boolean) => void;
  setFlowState: (payload: FlowContextState) => void;
  setFlowContext: (payload: Partial<FlowContext>) => void;
  setUserStageResponse: (payload: import("@/lib/user-api").GetUserStageResponse | null) => void;
  setEmploymentDetailsSubmitted: (payload: boolean) => void;
  setCurrentStep: (payload: number) => void;
  next: () => void;
  prev: () => void;
  nextStep: () => void;
  goTo: (phase: FlowPhase, substepId: string) => void;
  setDisbursalSubmitted: (payload: boolean) => void;
  setApplicationCompleted: (payload: boolean) => void;
  setShowDownloadApp: (payload: boolean) => void;
  resetFlow: () => void;
  setFlowFromUserStage: (
    showDashboard: boolean,
    stage: string,
    sectionsCompleted?: UserStageSectionsCompleted,
    stageContext?: GetUserStageContext | null,
    stageResponse?: import("@/lib/user-api").GetUserStageResponse,
  ) => void;
};

export const useFlowStore = create<FlowState & FlowActions>((set) => ({
  steps: getProgressSteps(),
  phaseIndex: 0,
  substepIndex: 0,
  flowContext: DEFAULT_FLOW_CONTEXT,
  disbursalSubmitted: false,
  employmentDetailsSubmitted: false,
  applicationCompleted: false,
  applicationRejected: false,
  showDownloadApp: false,
  offerAmount: null,
  showUpdateButton: false,
  cameFromOfferings: false,
  userStageResponse: null,

  setOfferAmount: (payload) =>
    set((state) => ({
      offerAmount: payload,
      flowContext: { ...state.flowContext, hasOffer: Boolean(payload) },
    })),

  setShowUpdateButton: (payload) => set({ showUpdateButton: payload }),

  setCameFromOfferings: (payload) => set({ cameFromOfferings: payload }),

  setFlowState: (payload) =>
    set((state) => ({
      flowContext: { ...state.flowContext, flowState: payload },
    })),

  setFlowContext: (payload) =>
    set((state) => ({
      flowContext: { ...state.flowContext, ...payload },
    })),

  setUserStageResponse: (payload) => set({ userStageResponse: payload }),

  setEmploymentDetailsSubmitted: (payload) => set({ employmentDetailsSubmitted: payload }),

  setCurrentStep: (payload) => {
    const max = FLOW_PHASES.length - 1;
    const phaseIndex = Math.max(0, Math.min(payload, max));
    set({ phaseIndex, substepIndex: 0 });
  },

  next: () =>
    set((state) => {
      const phase = getPhaseByIndex(state.phaseIndex);
      const substepCount = getSubstepCount(phase, state.flowContext);
      if (state.substepIndex < substepCount - 1) {
        return { substepIndex: state.substepIndex + 1 };
      }
      if (state.phaseIndex < FLOW_PHASES.length - 1) {
        return { phaseIndex: state.phaseIndex + 1, substepIndex: 0 };
      }
      return state;
    }),

  prev: () =>
    set((state) => {
      if (state.substepIndex > 0) {
        return { substepIndex: state.substepIndex - 1 };
      }
      if (state.phaseIndex > 0) {
        const prevPhase = getPhaseByIndex(state.phaseIndex - 1);
        const prevCount = getSubstepCount(prevPhase, state.flowContext);
        return { phaseIndex: state.phaseIndex - 1, substepIndex: Math.max(0, prevCount - 1) };
      }
      return state;
    }),

  nextStep: () =>
    set((state) => {
      if (state.phaseIndex < FLOW_PHASES.length - 1) {
        return { phaseIndex: state.phaseIndex + 1, substepIndex: 0 };
      }
      return state;
    }),

  goTo: (phase, substepId) =>
    set((state) => {
      const position = findPositionBySubstepId(substepId, state.flowContext);
      if (!position || position.phase !== phase) return state;
      return {
        phaseIndex: FLOW_PHASES.indexOf(phase),
        substepIndex: position.substepIndex,
      };
    }),

  setDisbursalSubmitted: (payload) => set({ disbursalSubmitted: payload }),

  setApplicationCompleted: (payload) => set({ applicationCompleted: payload }),

  setShowDownloadApp: (payload) => set({ showDownloadApp: payload }),

  resetFlow: () =>
    set({
      phaseIndex: 0,
      substepIndex: 0,
      flowContext: DEFAULT_FLOW_CONTEXT,
      disbursalSubmitted: false,
      employmentDetailsSubmitted: false,
      applicationCompleted: false,
      applicationRejected: false,
      showDownloadApp: false,
      offerAmount: null,
      showUpdateButton: false,
      cameFromOfferings: false,
      userStageResponse: null,
    }),

  setFlowFromUserStage: (_showDashboard, stage, sectionsCompleted, stageContext, stageResponse) =>
    set((state) => {
      const mapping = getFlowMappingFromStage(stage);
      let nextFlowContext: FlowContext = mapping.flowState
        ? { ...state.flowContext, flowState: mapping.flowState }
        : { ...state.flowContext };

      let positionFromMapping: { phaseIndex: number; substepIndex: number } | null = null;

      if (shouldRouteOfferingsToUnderReviewFromStage(stage, stageContext?.offerStatus)) {
        nextFlowContext = { ...nextFlowContext, flowState: "under_review" };
        const pos = findPositionBySubstepId("under-review", nextFlowContext);
        if (pos) {
          positionFromMapping = {
            phaseIndex: FLOW_PHASES.indexOf(pos.phase),
            substepIndex: pos.substepIndex,
          };
        }
      } else if (mapping.position) {
        const pos = findPositionBySubstepId(mapping.position.substepId, nextFlowContext);
        if (pos) {
          positionFromMapping = {
            phaseIndex: FLOW_PHASES.indexOf(pos.phase),
            substepIndex: pos.substepIndex,
          };
        }
      }

      const position =
        positionFromMapping ??
        resolveFlowPositionFromUserStage(stage as UserStage, sectionsCompleted);

      return {
        ...(stageResponse ? { userStageResponse: stageResponse } : {}),
        phaseIndex: position.phaseIndex,
        substepIndex: position.substepIndex,
        applicationCompleted: mapping.applicationCompleted ?? state.applicationCompleted,
        applicationRejected: mapping.applicationRejected ?? state.applicationRejected,
        showDownloadApp: mapping.showDownloadApp ?? false,
        flowContext: nextFlowContext,
      };
    }),
}));
