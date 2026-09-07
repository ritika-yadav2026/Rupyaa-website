import { UserStagesInBackend } from "@/lib/user-stage";

export type LoanStatusCardConfig = {
  title: string;
  heading: string;
  description: string;
  actionLabel?: string;
  hideAction?: boolean;
  hideProgressStepper?: boolean;
};

export const DEFAULT_TITLE = "Check loan offers";
export const DEFAULT_HEADING = "Instant Loan Up to";
/** Used when an amount is shown separately and the default heading would duplicate it */
export const DEFAULT_HEADING_WITHOUT_AMOUNT = "Get Loan Offers";
export const DEFAULT_DESCRIPTION = "Instant approval with ZapCash credit engine";

/** CBL / rejected strip (mobile parity) */
export const CBL_STRIP_LABEL = "Stay tuned";

const STAGE_CARD_CONFIG: Record<UserStagesInBackend, LoanStatusCardConfig> = {
  [UserStagesInBackend.PERSONAL_DETAILS]: {
    title: DEFAULT_TITLE,
    heading: DEFAULT_HEADING,
    description: DEFAULT_DESCRIPTION,
    actionLabel: "Apply for Loan",
  },
  [UserStagesInBackend.MODE_OF_EMPLOYMENT]: {
    title: DEFAULT_TITLE,
    heading: DEFAULT_HEADING,
    description: DEFAULT_DESCRIPTION,
    actionLabel: "Complete Profile",
  },
  [UserStagesInBackend.SOFT_PULL]: {
    title: DEFAULT_TITLE,
    heading: DEFAULT_HEADING,
    description: DEFAULT_DESCRIPTION,
    actionLabel: "Check Eligibility",
  },
  [UserStagesInBackend.BANK_STATEMENT]: {
    title: DEFAULT_TITLE,
    heading: DEFAULT_HEADING,
    description: DEFAULT_DESCRIPTION,
    actionLabel: "Upload Bank Statement",
  },
  [UserStagesInBackend.OFFERINGS]: {
    title: DEFAULT_TITLE,
    heading: "You're Eligible",
    description: "Your personalized loan offer is ready.",
    actionLabel: "Review Offer",
  },
  [UserStagesInBackend.CONTACT_DETAILS]: {
    title: DEFAULT_TITLE,
    heading: DEFAULT_HEADING,
    description: DEFAULT_DESCRIPTION,
    actionLabel: "Complete KYC",
  },
  [UserStagesInBackend.ADDRESS_DETAILS]: {
    title: DEFAULT_TITLE,
    heading: DEFAULT_HEADING,
    description: DEFAULT_DESCRIPTION,
    actionLabel: "Complete KYC",
  },
  [UserStagesInBackend.FAMILY_REFERENCE]: {
    title: DEFAULT_TITLE,
    heading: DEFAULT_HEADING,
    description: DEFAULT_DESCRIPTION,
    actionLabel: "Complete KYC",
  },
  [UserStagesInBackend.BANK_DETAILS]: {
    title: DEFAULT_TITLE,
    heading: DEFAULT_HEADING,
    description: DEFAULT_DESCRIPTION,
    actionLabel: "Complete KYC",
  },
  [UserStagesInBackend.AADHAAR_KYC]: {
    title: DEFAULT_TITLE,
    heading: DEFAULT_HEADING,
    description: DEFAULT_DESCRIPTION,
    actionLabel: "Verify Identity",
  },
  [UserStagesInBackend.FACE_KYC]: {
    title: DEFAULT_TITLE,
    heading: DEFAULT_HEADING,
    description: DEFAULT_DESCRIPTION,
    actionLabel: "Verify Identity",
  },
  [UserStagesInBackend.APPLICATION_STATUS]: {
    title: "Under Review",
    heading: "Your Application is Under Review",
    description: "We're carefully reviewing your application details. This process can take up to 6 days.",
    actionLabel: "Track Status",
    hideProgressStepper: true,
  },
  [UserStagesInBackend.ENACH]: {
    title: DEFAULT_TITLE,
    heading: DEFAULT_HEADING,
    description: DEFAULT_DESCRIPTION,
    actionLabel: "Setup AutoPay",
  },
  [UserStagesInBackend.ESIGN]: {
    title: DEFAULT_TITLE,
    heading: DEFAULT_HEADING,
    description: DEFAULT_DESCRIPTION,
    actionLabel: "Sign Agreement",
  },
  [UserStagesInBackend.WAITING_FOR_DISBURSEMENT]: {
    title: DEFAULT_TITLE,
    heading: DEFAULT_HEADING,
    description: DEFAULT_DESCRIPTION,
    actionLabel: "View Status",
    hideProgressStepper: true,
  },
  [UserStagesInBackend.ACTIVE_LOAN_DASHBOARD]: {
    title: "Loan Status",
    heading: "Your loan is active",
    description:
      "Your loan is active. Close on time to avoid late fees and save on interest.",
    actionLabel: "Pay Now",
    hideProgressStepper: true,
  },
  [UserStagesInBackend.CBL_JOURNEY]: {
    title: DEFAULT_TITLE,
    heading: "Application Status",
    description: "Please check again in 30 days.",
    hideAction: true,
    hideProgressStepper: true,
  },
  [UserStagesInBackend.REJECTED]: {
    title: DEFAULT_TITLE,
    heading: "Application Status",
    description: "Please check again in 30 days.",
    hideAction: true,
    hideProgressStepper: true,
  },
  [UserStagesInBackend.DOWNLOAD_APP]: {
    title: DEFAULT_TITLE,
    heading: "Continue on the ZapCash App",
    description: "Download our app to continue your loan journey.",
    hideAction: true,
    hideProgressStepper: true,
  },
};

export const LOAN_STATUS_LOADING_CARD: LoanStatusCardConfig = {
  title: "Loan Journey",
  heading: "Loading your journey",
  description: "We are syncing your latest loan stage. This usually takes a moment.",
  hideAction: true,
};

export function getLoanStatusCardConfig(stage: UserStagesInBackend): LoanStatusCardConfig {
  return STAGE_CARD_CONFIG[stage];
}
