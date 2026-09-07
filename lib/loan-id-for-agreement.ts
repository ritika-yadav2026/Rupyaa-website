import { getExistingActiveLoan, type ActiveLoan } from "@/lib/eligibility-api";
import { getLoanIdForHyperKyc, pickLoanIdAsTransactionId } from "@/lib/hyperkyc-api";

/**
 * Prefer active loan `_id`; fallback to GET /loans/id (HyperKYC helper).
 */
export async function resolveLoanIdForAgreement(): Promise<string | null> {
  try {
    const active = await getExistingActiveLoan();
    if (active.hasActiveLoan && active.loan?._id) {
      return active.loan._id;
    }
  } catch {
    /* ignore */
  }
  try {
    const res = await getLoanIdForHyperKyc();
    const id = pickLoanIdAsTransactionId(res);
    return id.length > 0 ? id : null;
  } catch {
    return null;
  }
}

export function hasSanctionedPdfKey(loan: ActiveLoan | undefined): boolean {
  if (!loan) return false;
  const key = loan.sanctionedPdfKey;
  return typeof key === "string" && key.trim().length > 0;
}
