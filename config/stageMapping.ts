import type { FlowContextState, FlowPosition } from "@/config/flowConfig";

type StageMapping = {
  position?: FlowPosition;
  applicationCompleted?: boolean;
  applicationRejected?: boolean;
  showDownloadApp?: boolean;
  flowState?: FlowContextState;
};

/**
 * API `stage` → flow position. Substep ids match native
 * [.migration/flowSteps.ts](.migration/flowSteps.ts) and web `flowConfig`.
 */
const STAGE_TO_MAPPING: Record<string, StageMapping> = {
  /** No branch yet; only unconditional register substeps stay visible (see flowConfig conditions). */
  PERSONAL_DETAILS: {
    position: { phase: "register", substepId: "personal-details" },
    flowState: "manual_upload",
  },
  MODE_OF_EMPLOYMENT: {
    position: { phase: "register", substepId: "personal-details" },
    flowState: "manual_upload",
  },
  LOAN_OFFER: {
    position: { phase: "register", substepId: "loan-offer-register" },
    flowState: "offer",
  },
  SOFT_PULL: { position: { phase: "register", substepId: "soft-pull" }, flowState: "soft_pull" },
  BANK_STATEMENT: { position: { phase: "offer", substepId: "bank-connect" }, flowState: "offer" },
  OFFERINGS: { position: { phase: "offer", substepId: "approved-offer" }, flowState: "offer" },
  CONTACT_DETAILS: { position: { phase: "kyc", substepId: "contact-details" } },
  ADDRESS_DETAILS: { position: { phase: "kyc", substepId: "address-details" } },
  /**
   * KYC family vs references is chosen from `sectionsCompleted` in
   * `resolveFlowPositionFromUserStage` — do not set `position` here or it overrides that logic.
   */
  FAMILY_REFERENCE: {},
  BANK_DETAILS: { position: { phase: "kyc", substepId: "bank-details" } },
  AADHAAR_KYC: { position: { phase: "kyc", substepId: "digilocker" } },
  FACE_KYC: { position: { phase: "kyc", substepId: "face-kyc" } },
  APPLICATION_STATUS: {
    position: { phase: "register", substepId: "under-review" },
    flowState: "under_review",
  },
  ACTIVE_LOAN_DASHBOARD: { applicationCompleted: true },
  CBL_JOURNEY: { applicationRejected: true },
  REJECTED: { applicationRejected: true },
  ENACH: { position: { phase: "disbursal", substepId: "enach" } },
  ESIGN: { position: { phase: "disbursal", substepId: "esign" } },
  WAITING_FOR_DISBURSEMENT: { position: { phase: "disbursal", substepId: "sanctioned" } },
  DOWNLOAD_APP: { showDownloadApp: true },
};

export function normalizeBackendStage(stage: string): string {
  return stage.replace(/[-\s]/g, "_").toUpperCase();
}

export function isKnownBackendStage(stage: string): boolean {
  return normalizeBackendStage(stage) in STAGE_TO_MAPPING;
}

export function getFlowMappingFromStage(stage: string): StageMapping {
  return STAGE_TO_MAPPING[normalizeBackendStage(stage)] ?? { position: { phase: "register", substepId: "personal-details" } };
}
