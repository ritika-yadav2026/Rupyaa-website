import type { CreditReportData } from "@/lib/credit-score-api";

export interface ScoreFactor {
  readonly label: string;
  readonly rating: string;
  readonly ratingClassName: string;
  readonly barClassName: string;
  readonly healthFraction: number;
}

const RATING_GOOD = { ratingClassName: "text-green-600", barClassName: "bg-green-500" };
const RATING_FAIR = { ratingClassName: "text-amber-500", barClassName: "bg-amber-400" };
const RATING_POOR = { ratingClassName: "text-red-500", barClassName: "bg-red-500" };

/**
 * Extracts the applicant's first name from the consumer record, falling back to "there".
 */
export function resolveFirstName(name: string | null | undefined): string {
  if (!name || !name.trim()) {
    return "there";
  }
  const [first] = name.trim().split(/\s+/);
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

/**
 * Formats a rupee amount compactly (e.g. 320000 → "₹3.2 L", 5000000 → "₹50 L").
 */
export function formatCompactInr(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 1)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)} L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

/**
 * Total outstanding balance across all reported accounts.
 */
export function sumOutstanding(data: CreditReportData): number {
  return data.accounts.reduce((total, account) => total + (account.outstanding || 0), 0);
}

/**
 * Credit utilization percentage (outstanding / total credit limit), 0 when unknown.
 */
export function resolveUtilizationPercentage(data: CreditReportData): number | null {
  const limit = data.creditSummary.totalCreditLimit;
  if (!limit || limit <= 0) {
    return null;
  }
  return Math.round((sumOutstanding(data) / limit) * 100);
}

function buildPaymentHistoryFactor(onTimePercentage: number | null): ScoreFactor {
  const pct = onTimePercentage ?? 0;
  let rating = "Poor";
  let colors = RATING_POOR;
  if (pct >= 95) {
    rating = "Excellent";
    colors = RATING_GOOD;
  } else if (pct >= 85) {
    rating = "Good";
    colors = RATING_GOOD;
  } else if (pct >= 70) {
    rating = "Fair";
    colors = RATING_FAIR;
  }
  return {
    label: "Payment history",
    rating,
    healthFraction: Math.max(0.08, pct / 100),
    ...colors,
  };
}

function buildUtilizationFactor(utilization: number | null): ScoreFactor {
  if (utilization == null) {
    return { label: "Credit utilization", rating: "—", healthFraction: 0.5, ...RATING_FAIR };
  }
  let rating = `High · ${utilization}%`;
  let colors = RATING_POOR;
  if (utilization <= 30) {
    rating = `Good · ${utilization}%`;
    colors = RATING_GOOD;
  } else if (utilization <= 50) {
    rating = `Fair · ${utilization}%`;
    colors = RATING_FAIR;
  }
  return {
    label: "Credit utilization",
    rating,
    healthFraction: Math.max(0.08, 1 - utilization / 100),
    ...colors,
  };
}

function buildCreditAgeFactor(totalAccounts: number | null): ScoreFactor {
  const accounts = totalAccounts ?? 0;
  let rating = "Building";
  let colors = RATING_FAIR;
  let fraction = 0.4;
  if (accounts >= 5) {
    rating = "Good";
    colors = RATING_GOOD;
    fraction = 0.8;
  } else if (accounts >= 3) {
    rating = "Fair";
    colors = RATING_FAIR;
    fraction = 0.55;
  }
  return { label: "Credit age", rating, healthFraction: fraction, ...colors };
}

function buildEnquiriesFactor(totalEnquiries: number | null): ScoreFactor {
  const enquiries = totalEnquiries ?? 0;
  let rating = "High";
  let colors = RATING_POOR;
  let fraction = 0.3;
  if (enquiries <= 2) {
    rating = "Low";
    colors = RATING_GOOD;
    fraction = 0.9;
  } else if (enquiries <= 5) {
    rating = "Moderate";
    colors = RATING_FAIR;
    fraction = 0.55;
  }
  return { label: "Recent enquiries", rating, healthFraction: fraction, ...colors };
}

/**
 * Derives the "what's affecting your score" factor list from the report data.
 */
export function deriveScoreFactors(data: CreditReportData): ScoreFactor[] {
  return [
    buildPaymentHistoryFactor(data.creditSummary.onTimePaymentsPercentage),
    buildUtilizationFactor(resolveUtilizationPercentage(data)),
    buildCreditAgeFactor(data.creditSummary.totalAccounts),
    buildEnquiriesFactor(data.creditSummary.totalEnquiries),
  ];
}

/**
 * Estimates a pre-approved personal loan amount from the credit score.
 */
export function resolvePreApprovedAmount(score: number): number {
  if (score >= 750) {
    return 500000;
  }
  if (score >= 700) {
    return 300000;
  }
  if (score >= 650) {
    return 150000;
  }
  return 50000;
}
