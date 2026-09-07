import { Loan } from "@/lib/eligibility-api";

export function getTotalPayable(loan: Loan): number {
  return (
    loan.totalPayable ?? 0
  );
}

/**
 * Get loan type display name.
 */
export function getLoanTypeDisplayName(type: string): string {
  switch (type) {
    case 'PAY_DAY':
      return 'Pay Day Loan';
    case 'CREDIT_BUILDER':
      return 'Credit Builder Loan';
    default:
      return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }
}

export function asRecord(value: unknown): Record<string, unknown> | null {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

export function asLoanRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}