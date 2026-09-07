/**
 * Formats a number as Indian Rupee (always uses ₹, never relies on Intl currency symbol which may show $ on some runtimes).
 */
export function formatCurrency(value: number, withDecimals = false): string {
  const n = Number(value);
  if (Number.isNaN(n)) {
    return "₹0";
  }
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  }).format(n);
  return `₹${formatted}`;
}

/**
 * Returns true if the loan's due date has passed.
 */
export function isLoanOverdue(loan: {
  dueDate?: string | null;
  isOverdue?: boolean;
} | undefined): boolean {
  if (!loan) return false;
  if (loan.isOverdue === true) return true;
  if (!loan.dueDate) return false;
  try {
    const due = new Date(loan.dueDate);
    return !Number.isNaN(due.getTime()) && due < new Date();
  } catch {
    return false;
  }
}

export type LoanAmountSnapshot = {
  amount: number;
  amountDue?: number | null;
  totalPayable?: number | null;
  totalAmountPaid?: number | null;
};

/**
 * Resolves the effective loan due amount for hero/loan cards.
 */
export function getEffectiveLoanAmountDue(loan: LoanAmountSnapshot): number {
  if (loan.amountDue != null) return loan.amountDue;
  return 0
}

/**
 * Formats a date string for short display (e.g. "15 OCT").
 */
export function formatLoanDateShort(dateStr: string | undefined | null): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
    })
      .format(date)
      .toUpperCase();
  } catch {
    return "";
  }
}

/**
 * Formats a date string for loan display (e.g. "15 Oct 2025").
 */
export function formatLoanDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}
