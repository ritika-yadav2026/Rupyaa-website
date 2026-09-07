import type { Loan } from "@/lib/eligibility-api";
import { formatLoanDueDate } from "@/helpers/loan-helper";

/** Application id for display (e.g. #R7RSKFJ). */
export function getApplicationDisplay(loan: Loan): string {
  const raw = loan.applicationNumber?.trim();
  if (!raw) return "—";
  return raw.startsWith("#") ? raw : `#${raw}`;
}

/** Disbursed-on label for detail rows. */
export function getDisbursedDateString(loan: Loan): string {
  const iso = loan.disbursedAt ?? loan.actualDisbursedAt ?? loan.createdAt;
  return formatLoanDate(iso);
}

/** Loan date display (e.g. 18 May 2026). */
export function formatLoanDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";
  return formatLoanDueDate(dateStr) || "—";
}

export function formatLoanTenureDisplay(tenure: string | undefined): string {
  const t = tenure?.trim();
  if (!t) return "N/A";
  return /\d/.test(t) && !/day/i.test(t) ? `${t} days` : t;
}

export function formatInterestPerDayDisplay(loan: Loan): string {
  if (loan.interestRate != null && Number.isFinite(loan.interestRate)) {
    return `${loan.interestRate}%`;
  }
  return "N/A";
}

export function formatLoanStatusLabel(status: string | undefined): string {
  if (!status?.trim()) return "";
  const s = status.trim();
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function formatLoanStatusLabelForHistoryLoan(): string {
  return 'Closed'
}

export function getHistoryHelperText(
  rawPaymentStatus: string | undefined
): string {
  const value = rawPaymentStatus?.trim().toLowerCase() ?? '';
  if (value === 'paid') {
    return 'You repaid on time. Eligible to reapply.';
  }
  if (value === 'overdue') {
    return 'Your loan is closed after being overdue. Please maintain good repayment habits for future credit.';
  }
  return 'Your loan is closed. For more details, check your loan statement.';
}

export function getLoanStatusText(
  loan: Loan,
): string {
  const primary = formatLoanStatusLabel(loan.status);
  const after = formatLoanStatusLabel(loan.afterDisbursalStatus);
  if (primary && after) {
    return `${primary} • ${after}`;
  }
  if (primary) return primary;
  if (after) return after;
  return 'N/A';
}