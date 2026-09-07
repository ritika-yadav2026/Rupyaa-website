/**
 * Hero journey stepper progress (shared with Home hero builder).
 */

export type JourneyProgress = {
  /**
   * Current step index (0–3) for the journey card.
   * `0` = Details; `1` = Offer; `2` = Verify; `3` = Get Funds.
   */
  readonly currentStepIndex: number;
};

function normalizeStage(stage: string | undefined | null): string {
  return (stage ?? "").toLowerCase().replace(/[-_]/g, "");
}

export function isUnderReviewLoanStatus(loanStatus: string): boolean {
  const normalized = (loanStatus ?? "").toLowerCase().trim();
  if (!normalized) return false;
  if (normalized.includes("deviat")) return true;
  if (normalized.includes("under_review")) return true;
  if (normalized.includes("under review")) return true;
  if (normalized === "pending") return true;
  if (normalized.includes("pending")) return true;
  return false;
}

/**
 * Maps backend `userStage.stage` to the 4-step journey card progress
 * (Details → Offer → Verify → Get Funds).
 */
export function getJourneyProgressFromUserStage(userStage: { stage?: string } | null | undefined): JourneyProgress {
  const normalizedStage: string = normalizeStage(userStage?.stage);
  if (!normalizedStage) return { currentStepIndex: 0 };

  if (normalizedStage === "personaldetails") {
    return { currentStepIndex: 0 };
  }

  if (normalizedStage === "modeofemployment") {
    return { currentStepIndex: 0 };
  }

  if (
    normalizedStage === "softpull" ||
    normalizedStage === "bankstatement" ||
    normalizedStage === "loanoffer" ||
    normalizedStage === "applicationstatus" ||
    normalizedStage === "cbljourney" ||
    normalizedStage === "bankdetails"
  ) {
    return { currentStepIndex: 1 };
  }

  if (
    normalizedStage === "offerings" ||
    normalizedStage === "contactdetails" ||
    normalizedStage === "addressdetails" ||
    normalizedStage === "familyreference" ||
    normalizedStage === "aadhaarkyc" ||
    normalizedStage === "facekyc"
  ) {
    return { currentStepIndex: 2 };
  }

  if (
    normalizedStage === "activeloandashboard" ||
    normalizedStage === "enach" ||
    normalizedStage === "esign" ||
    normalizedStage === "waitingfordisbursement"
  ) {
    return { currentStepIndex: 3 };
  }

  return { currentStepIndex: 1 };
}
