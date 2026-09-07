/** Copy for the Account Aggregator bank-verify screen (web parity with mobile). */

import { getManualUploadStatementRangeDescription } from "@/utils/bankStatementPeriod";

export const BSA_AA_TITLE = "Verify your bank account";
export const BSA_AA_SUBTITLE = "Securely fetch bank statement instantly";

/** Shown bold + primary wherever the AA mobile label is rendered. */
export const BSA_AA_MOBILE_LABEL_SALARY_ACCOUNT = "Salary-Account";

/** Plain-text full label (e.g. tests, tooling). Visual treatment uses styled span in UI. */
export const BSA_AA_MOBILE_LABEL = `Mobile number (linked to your ${BSA_AA_MOBILE_LABEL_SALARY_ACCOUNT})`;

export const BSA_AA_BULLETS = [
  "RBI-regulated Account Aggregator process",
  "Read-only access to your statement",
  "No charges for this verification",
  "Faster approval process",
] as const;

export const BSA_PRIMARY_CTA = "Securely Fetch Statement";
export const BSA_REDIRECT_FOOTNOTE =
  "You will be redirected to your bank’s consent flow in a new window.";

export const BSA_MANUAL_CARD_TITLE = "Upload bank statement PDF manually";
export const BSA_MANUAL_CARD_HINT =
  `Upload last 3 months including ${getManualUploadStatementRangeDescription()} salary-account statement`;
