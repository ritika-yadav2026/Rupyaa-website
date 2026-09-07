import type { FlowPhase } from "@/config/flowConfig";

/**
 * Defines the primary screen/stage the user should be on.
 */
export enum UserStagesInBackend {
  PERSONAL_DETAILS = "PERSONAL_DETAILS",
  MODE_OF_EMPLOYMENT = "MODE_OF_EMPLOYMENT",
  SOFT_PULL = "SOFT_PULL",
  BANK_STATEMENT = "BANK_STATEMENT",
  OFFERINGS = "OFFERINGS",
  CONTACT_DETAILS = "CONTACT_DETAILS",
  ADDRESS_DETAILS = "ADDRESS_DETAILS",
  FAMILY_REFERENCE = "FAMILY_REFERENCE",
  BANK_DETAILS = "BANK_DETAILS",
  AADHAAR_KYC = "AADHAAR_KYC",
  FACE_KYC = "FACE_KYC",
  APPLICATION_STATUS = "APPLICATION_STATUS",
  ACTIVE_LOAN_DASHBOARD = "ACTIVE_LOAN_DASHBOARD",
  CBL_JOURNEY = "CBL_JOURNEY",
  REJECTED = "REJECTED",
  ENACH = "ENACH",
  ESIGN = "ESIGN",
  WAITING_FOR_DISBURSEMENT = "WAITING_FOR_DISBURSEMENT",
  DOWNLOAD_APP = "DOWNLOAD_APP",
}

/** Describes the state of an offer on the Offerings screen. */
export enum OfferStatus {
  ACTIVE = "ACTIVE",
  EXPIRED_PENDING_ACTION = "EXPIRED_PENDING_ACTION",
}

/** Describes the next step for an expired offer. */
export enum FollowUpAction {
  NONE = "NONE",
  BANKING_IN_PROGRESS = "BANKING_IN_PROGRESS",
}

export const UserStage = [
  // Pre-Offer Steps
  UserStagesInBackend.PERSONAL_DETAILS,
  UserStagesInBackend.MODE_OF_EMPLOYMENT,
  UserStagesInBackend.SOFT_PULL,
  UserStagesInBackend.BANK_STATEMENT,

  // Offer Stage
  UserStagesInBackend.OFFERINGS,

  // Post-Offer KYC Steps
  UserStagesInBackend.CONTACT_DETAILS,
  UserStagesInBackend.ADDRESS_DETAILS,
  UserStagesInBackend.FAMILY_REFERENCE,
  UserStagesInBackend.BANK_DETAILS,
  UserStagesInBackend.AADHAAR_KYC,
  UserStagesInBackend.FACE_KYC,

  // Loan Progress
  UserStagesInBackend.APPLICATION_STATUS,
  UserStagesInBackend.ENACH,
  UserStagesInBackend.ESIGN,
  UserStagesInBackend.WAITING_FOR_DISBURSEMENT,
  UserStagesInBackend.ACTIVE_LOAN_DASHBOARD,

  // Special
  UserStagesInBackend.CBL_JOURNEY,
  UserStagesInBackend.REJECTED,
  UserStagesInBackend.DOWNLOAD_APP,
] as const;

export type UserStage = UserStagesInBackend;

export const SPECIAL_USER_STAGES: readonly UserStage[] = [
  UserStagesInBackend.CBL_JOURNEY,
  UserStagesInBackend.REJECTED,
  UserStagesInBackend.DOWNLOAD_APP,
];


export const USER_STAGE_GROUPS: Record<FlowPhase, readonly UserStage[]> = {
  register: [UserStagesInBackend.PERSONAL_DETAILS, UserStagesInBackend.MODE_OF_EMPLOYMENT, UserStagesInBackend.SOFT_PULL, UserStagesInBackend.BANK_STATEMENT],
  offer: [UserStagesInBackend.OFFERINGS],
  kyc: [
    UserStagesInBackend.CONTACT_DETAILS,
    UserStagesInBackend.ADDRESS_DETAILS,
    UserStagesInBackend.FAMILY_REFERENCE,
    UserStagesInBackend.BANK_DETAILS,
    UserStagesInBackend.AADHAAR_KYC,
    UserStagesInBackend.FACE_KYC,
  ],
  disbursal: [
    UserStagesInBackend.APPLICATION_STATUS,
    UserStagesInBackend.ENACH,
    UserStagesInBackend.ESIGN,
    UserStagesInBackend.WAITING_FOR_DISBURSEMENT,
    UserStagesInBackend.ACTIVE_LOAN_DASHBOARD,
  ],
};

/** True when `stage` is in the mobile register / pre-offer group (PreOfferCard branch). */
export function isRegisterUserStage(stage: UserStagesInBackend): boolean {
  return (USER_STAGE_GROUPS.register as readonly string[]).includes(stage);
}

/** Alias aligned with native `isPreOfferStage` — register funnel before OFFERINGS. */
export function isPreOfferUserStage(stage: UserStagesInBackend): boolean {
  return isRegisterUserStage(stage);
}

export function isCblOrRejectedUserStage(stage: UserStagesInBackend): boolean {
  return stage === UserStagesInBackend.CBL_JOURNEY || stage === UserStagesInBackend.REJECTED;
}


export interface UserStageSectionsCompleted {
  isContactComplete?: boolean;
  isAddressComplete?: boolean;
  /** @deprecated Backend is moving to isFamilyComplete + isReferenceComplete. */
  isFamilyReferenceComplete?: boolean;
  isBankComplete?: boolean;
  isAadhaarComplete?: boolean;
  isFaceKycComplete?: boolean;
  isFamilyComplete?: boolean;
  isReferenceComplete?: boolean;
}