/** Minimum custom partial payment (rupees). */
export const MIN_CUSTOM_AMOUNT = 100;

/** Fixed quick-pay chip amounts (rupees). */
export const FIXED_AMOUNTS = [1000, 5000, 10000, 25000, 50000] as const;

/** Percentage quick-pay options. */
export const PERCENTAGES = [25, 50, 75] as const;

/**
 * Parses a decimal amount from user input (strips non-numeric except one dot).
 */
export function parseDecimalAmount(text: string): number {
  const cleaned = text.replace(/[^\d.]/g, "");
  if (!cleaned) return 0;
  const parts = cleaned.split(".");
  const normalized =
    parts.length <= 1 ? cleaned : `${parts[0]}.${parts.slice(1).join("").slice(0, 2)}`;
  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

/** Formats a number for custom amount input (no trailing decimals when whole). */
export function formatAmountForInput(value: number): string {
  if (!Number.isFinite(value)) return "";
  const rounded = Math.round(value * 100) / 100;
  return rounded % 1 === 0 ? String(Math.round(rounded)) : rounded.toFixed(2);
}

export function percentageChipAmount(paymentLeft: number, pct: number): number {
  return Math.round((paymentLeft * pct) / 100);
}

export function filterFixedAmounts(paymentLeft: number): number[] {
  return FIXED_AMOUNTS.filter((a) => a <= paymentLeft);
}

export function isValidCustomPaymentAmount(amount: number, paymentLeft: number): boolean {
  return amount >= MIN_CUSTOM_AMOUNT && amount <= paymentLeft;
}
