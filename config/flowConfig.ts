/**
 * Web flow aligned with native [.migration/flowSteps.ts](.migration/flowSteps.ts):
 * phases register → offer → kyc → disbursal; substep `id`s match native where applicable.
 * `webEnabled` gates web UI; `condition` hides steps not used on web (native parity slots).
 */
export const FLOW_CONTEXT_STATES = [
  "soft_pull",
  "offer",
  "under_review",
  "manual_upload",
] as const;

export type FlowContextState = (typeof FLOW_CONTEXT_STATES)[number];

export type FlowContext = {
  flowState: FlowContextState;
  hasOffer: boolean;
};

export type FlowCondition = (context: FlowContext) => boolean;

export type FlowSubstep = {
  id: string;
  label: string;
  component: string;
  webEnabled: boolean;
  condition?: FlowCondition;
};

export const FLOW_CONFIG = {
  register: {
    id: "register",
    label: "Details",
    substeps: [
      { id: "personal-details", label: "Personal & Employment Details", component: "PersonalDetailsForm", webEnabled: true },
      /** Native parity slot; web now collects work details in `personal-details`. */
      {
        id: "employment-details",
        label: "Work Details",
        component: "EmploymentModeForm",
        // webEnabled: true,
        condition: () => false,
      },
      {
        id: "soft-pull",
        label: "Eligibility Check",
        component: "SoftPullScreen",
        // webEnabled: true,
        condition: (ctx: FlowContext) => ctx.flowState === "soft_pull",
      },
      {
        id: "loan-offer-register",
        label: "Loan Offer",
        component: "LoanOfferScreen",
        // webEnabled: true,
        condition: (ctx: FlowContext) => ctx.flowState === "offer",
      },
      {
        id: "under-review",
        label: "Under Review",
        component: "ApplicationUnderReviewScreen",
        // webEnabled: true,
        condition: (ctx: FlowContext) => ctx.flowState === "under_review",
      },
    ] as FlowSubstep[],
  },
  offer: {
    id: "offer",
    label: "Offer",
    substeps: [
      {
        id: "bank-connect",
        label: "Bank Connect",
        component: "BSAMobileScreen",
      },
      { id: "approved-offer", label: "View Offer", component: "LoanOfferScreen" },
    ] as FlowSubstep[],
  },
  kyc: {
    id: "kyc",
    label: "Verify",
    substeps: [
      { id: "contact-details", label: "Contact Details", component: "ContactDetailsStep" },
      { id: "address-details", label: "Address Details", component: "AddressDetailsStep" },
      { id: "family-details", label: "Family Details", component: "FamilyDetailsStep" },
      { id: "reference-details", label: "References", component: "ReferenceDetailsStep" },
      { id: "bank-details", label: "Bank Details", component: "BankDetailsStep" },
      { id: "digilocker", label: "DigiLocker", component: "DigiLockerStep" },
      { id: "face-kyc", label: "Face Verification", component: "FaceKYCStep" },
    ] as FlowSubstep[],
  },
  disbursal: {
    id: "disbursal",
    label: "Get Funds",
    substeps: [
      { id: "enach", label: "Enach", component: "ENachMandateStep" },
      { id: "esign", label: "E-Sign", component: "ESignStep" },
      { id: "sanctioned", label: "Sanctioned", component: "LoanSanctionedStep" },
    ] as FlowSubstep[],
  },
} as const;

/** Same order as native: register, offer, kyc, disbursal (eNACH lives under disbursal). */
export const FLOW_PHASES = ["register", "offer", "kyc", "disbursal"] as const;

export type FlowPhase = (typeof FLOW_PHASES)[number];

export type FlowPosition = {
  phase: FlowPhase;
  substepId: string;
};

export function getPhaseByIndex(index: number): FlowPhase {
  const clamped = Math.max(0, Math.min(index, FLOW_PHASES.length - 1));
  return FLOW_PHASES[clamped];
}

export function getProgressSteps(): string[] {
  return FLOW_PHASES.map((phase) => FLOW_CONFIG[phase].label);
}

export function getSubstepsForPhase(phase: FlowPhase, context: FlowContext): FlowSubstep[] {
  return FLOW_CONFIG[phase].substeps.filter((substep) => !substep.condition || substep.condition(context));
}

export function getSubstepCount(phase: FlowPhase, context?: FlowContext): number {
  if (!context) return FLOW_CONFIG[phase].substeps.length;
  return getSubstepsForPhase(phase, context).length;
}

export type FlowSubstepId = string;

/**
 * Returns 0-based substep index by substep id within a phase, or -1 when not found.
 */
export function getSubstepIndexById(phase: FlowPhase, substepId: string): number {
  return FLOW_CONFIG[phase].substeps.findIndex((s) => s.id === substepId);
}

export function getSubstepByIndex(
  phase: FlowPhase,
  substepIndex: number,
  context: FlowContext,
): FlowSubstep | null {
  const substeps = getSubstepsForPhase(phase, context);
  if (!substeps.length) return null;
  const clamped = Math.max(0, Math.min(substepIndex, substeps.length - 1));
  return substeps[clamped] ?? null;
}

export function findPositionBySubstepId(
  substepId: string,
  context: FlowContext,
): { phase: FlowPhase; substepIndex: number } | null {
  for (const phase of FLOW_PHASES) {
    const substeps = getSubstepsForPhase(phase, context);
    const substepIndex = substeps.findIndex((substep) => substep.id === substepId);
    if (substepIndex !== -1) {
      return { phase, substepIndex };
    }
  }
  return null;
}
