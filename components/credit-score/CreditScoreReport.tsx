"use client";

import CreditScoreGauge from "@/components/credit-score/CreditScoreGauge";
import {
  deriveScoreFactors,
  formatCompactInr,
  resolveFirstName,
  resolvePreApprovedAmount,
} from "@/components/credit-score/report-insights";
import { resolveScoreBand } from "@/components/credit-score/score-utils";
import { formatCurrency } from "@/lib/format-utils";
import type { CreditReportData } from "@/lib/credit-score-api";

interface CreditScoreReportProps {
  readonly data: CreditReportData;
  readonly onStartOver: () => void;
  readonly onUnlockReport: () => void;
}

const FALLBACK_SCORE = 300;

const IMPROVEMENT_TIPS = [
  "Keep credit utilization under 30%",
  "Avoid multiple loan enquiries at once",
  "Always pay EMIs & bills on time",
] as const;

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

/**
 * Post-pull credit dashboard: score gauge, pre-approved offer, factor breakdown,
 * summary and improvement tips. Gates the full Equifax report behind `onUnlockReport`.
 */
export default function CreditScoreReport({
  data,
  onStartOver,
  onUnlockReport,
}: CreditScoreReportProps) {
  const score = data.creditScore ?? FALLBACK_SCORE;
  const band = resolveScoreBand(score);
  const firstName = resolveFirstName(data.consumer.name);
  const factors = deriveScoreFactors(data);
  const preApprovedAmount = resolvePreApprovedAmount(score);
  const summary = data.creditSummary;
  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-medium text-[#333333]">Hello, {firstName}</h1>
          <p className="mt-1 w-fit bg-gradient-to-r from-[#ff551c] via-[#f8ac00] to-[#20c520] bg-clip-text text-xl font-semibold text-transparent">Here&apos;s your credit, clearly.</p>
        </div>
        <button
          type="button"
          onClick={onStartOver}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-400 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <RefreshIcon />
          Start over
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-4">
          <CreditScoreGauge score={score} showRange={false} className="w-full max-w-[170px]" />
          <p className="text-[9px] uppercase tracking-widest text-gray-500">Equifax score</p>
          <p className="mt-2 text-[10px] text-gray-500">
            Range 300–900 · <span className={`font-semibold ${band.textClassName}`}>{band.label}</span>
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h3 className="mb-4 text-xs font-semibold text-gray-900">Your credit summary</h3>
          <dl className="space-y-3.5">
            <div className="flex items-center justify-between">
              <dt className="text-xs text-gray-500">Active accounts</dt>
              <dd className="text-xs font-semibold text-gray-900">{summary.activeAccounts ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-gray-500">On-time payments</dt>
              <dd className="text-xs font-semibold text-green-600">
                {summary.onTimePaymentsPercentage != null
                  ? `${summary.onTimePaymentsPercentage}%`
                  : "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-gray-500">Total enquiries</dt>
              <dd className="text-xs font-semibold text-gray-900">{summary.totalEnquiries ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-gray-500">Total credit limit</dt>
              <dd className="text-xs font-semibold text-gray-900">{formatCompactInr(summary.totalCreditLimit)}</dd>
            </div>
          </dl>
        </div>

      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#FECA42] px-4 py-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium text-gray-900">Your score qualifies you for a Personal Loan up to</p>
            <span className="text-[9px] font-semibold uppercase tracking-wide text-[#695000]">• Pre-approved for you</span>
          </div>
          <p className="mt-1 text-3xl font-bold text-gray-950">{formatCurrency(preApprovedAmount)}</p>
        </div>
        <a href="/personal-loan" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#302400] px-5 py-2 text-xs font-semibold text-[#FECA42] transition hover:bg-black">
          Apply now
          <ArrowRightIcon />
        </a>
      </div>

      <div className="mt-4 flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#9c1c2e] text-[10px] font-bold text-white">
            EQUIFAX
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-gray-900">Get your full credit report for Free</p>
              <span className="rounded bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#9c1c2e]">
                Equifax Official
              </span>
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-gray-500">
              Complete report — account-level details, full payment history, every enquiry &amp;
              address on record. Download as PDF instantly.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onUnlockReport}
          className="inline-flex min-h-[40px] shrink-0 items-center justify-center gap-2 rounded-md bg-[#9c1c2e] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#82101f]"
        >
          Unlock report
          <ArrowRightIcon />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h3 className="mb-4 text-xs font-semibold text-gray-900">What&apos;s affecting your score</h3>
          <ul className="space-y-4">
            {factors.map((factor) => (
              <li key={factor.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs text-gray-600">{factor.label}</span>
                  <span className={`text-xs font-semibold ${factor.ratingClassName}`}>
                    {factor.rating}
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${factor.barClassName}`}
                    style={{ width: `${Math.round(factor.healthFraction * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h3 className="mb-4 text-xs font-semibold text-gray-900">Tips to improve</h3>
          <ul className="space-y-2.5">
            {IMPROVEMENT_TIPS.map((tip) => (
              <li key={tip} className="flex gap-2 text-xs text-gray-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                {tip}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onUnlockReport}
            className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[#9c1c2e]/10 px-4 py-2.5 text-xs font-semibold text-[#9c1c2e] transition hover:bg-[#9c1c2e]/15"
          >
            Get full report
          </button>
        </div>
      </div>
    </div>
  );
}
