"use client";

import { useMemo, type ReactNode } from "react";
import CreditScoreGauge from "@/components/credit-score/CreditScoreGauge";
import { formatCurrency } from "@/lib/format-utils";
import type {
  CreditReportData,
  CreditReportPaymentHistoryEntry,
} from "@/lib/credit-score-api";

interface EquifaxFullReportProps {
  readonly data: CreditReportData;
  readonly pdfUrl?: string;
  readonly onBack: () => void;
}

const FALLBACK_SCORE = 300;

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function resolveMonthLabel(key: string): string {
  const parsed = new Date(key);
  if (!Number.isNaN(parsed.getTime())) {
    return new Intl.DateTimeFormat("en-IN", { month: "short" }).format(parsed);
  }
  return key.slice(0, 3);
}

function resolveStatusTone(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes("active") || normalized.includes("current")) {
    return "text-green-600";
  }
  if (normalized.includes("overdue") || normalized.includes("default") || normalized.includes("dpd")) {
    return "text-red-600";
  }
  return "text-gray-500";
}

function renderPaymentCell(entry: CreditReportPaymentHistoryEntry): ReactNode {
  const isOnTime = entry.DaysPastDue <= 0;
  let box: ReactNode;
  if (isOnTime) {
    box = (
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-green-500 text-white">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
          <path d="M5 12.5l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  } else {
    box = (
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-400 text-white text-sm font-bold">
        !
      </span>
    );
  }
  return (
    <div key={entry.key} className="flex flex-col items-center gap-1">
      {box}
      <span className="text-[10px] text-gray-400">{resolveMonthLabel(entry.key)}</span>
    </div>
  );
}

/**
 * Full detailed Equifax credit information report with a PDF download.
 */
export default function EquifaxFullReport({ data, pdfUrl, onBack }: EquifaxFullReportProps) {
  const score = data.creditScore ?? FALLBACK_SCORE;
  const consumer = data.consumer;
  const generatedDate = useMemo(
    () => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date()),
    []
  );
  const reportId = useMemo(() => {
    const seed = (consumer.pan ?? consumer.mobile ?? "0000000").replace(/\D/g, "").padEnd(7, "0");
    return `EQ-${new Date().getFullYear()}-${seed.slice(-7)}`;
  }, [consumer.pan, consumer.mobile]);
  const consumerFields = [
    { label: "Name", value: consumer.name },
    { label: "PAN", value: consumer.pan },
    { label: "Date of birth", value: consumer.dob },
    { label: "Mobile", value: consumer.mobile },
    { label: "Email", value: consumer.email },
    { label: "Address", value: consumer.address },
  ];
  const hasPdf = Boolean(pdfUrl);
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 lg:p-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-primary"
      >
        <ChevronLeftIcon />
        Back to summary
      </button>

      <div className="overflow-hidden rounded-2xl bg-[#9c1c2e] px-5 py-5 text-white sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-2xl font-bold italic tracking-tight">EQUIFAX</p>
            <p className="mt-1 text-sm text-white/80">Credit Information Report</p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="text-xs text-white/70 sm:text-right">
              <p>Report ID: {reportId}</p>
              <p>Generated: {generatedDate}</p>
            </div>
            <a
              href={hasPdf ? pdfUrl : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!hasPdf}
              className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#9c1c2e] transition hover:bg-white/90 ${
                hasPdf ? "" : "pointer-events-none opacity-50"
              }`}
            >
              <DownloadIcon />
              Download PDF
            </a>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
          Consumer information
        </h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {consumerFields.map((field) => (
              <div key={field.label}>
                <dt className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  {field.label}
                </dt>
                <dd className="mt-1 font-semibold text-gray-900">{field.value ?? "—"}</dd>
              </div>
            ))}
          </dl>
          <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <CreditScoreGauge score={score} showRange={false} />
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
          Account details
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3">Lender</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Sanctioned</th>
                <th className="px-5 py-3">Outstanding</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.accounts.map((account, index) => (
                <tr key={`${account.lender}-${index}`} className="border-t border-gray-100">
                  <td className="px-5 py-4 font-semibold text-gray-900">{account.lender}</td>
                  <td className="px-5 py-4 text-gray-500">{account.type}</td>
                  <td className="px-5 py-4 text-gray-700">{formatCurrency(account.sanctioned)}</td>
                  <td className="px-5 py-4 text-gray-700">{formatCurrency(account.outstanding)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 font-semibold ${resolveStatusTone(account.status)}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {account.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
          Payment history · last 12 months
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {data.paymentHistory12Months.map((entry) => renderPaymentCell(entry))}
        </div>
        <div className="mt-4 flex items-center gap-5 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> On time
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Delayed
          </span>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
          Recent enquiries
        </h3>
        <ul className="divide-y divide-gray-100">
          {data.recentEnquiries.map((enquiry, index) => (
            <li
              key={`${enquiry.lender ?? "enquiry"}-${index}`}
              className="flex items-center justify-between gap-4 py-3.5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-gray-900">{enquiry.lender ?? "—"}</span>
                <span className="text-sm text-gray-400">· {enquiry.type}</span>
              </div>
              <span className="shrink-0 text-sm text-gray-400">{enquiry.date ?? "—"}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-gray-900">Download your report</p>
          <p className="mt-0.5 text-sm text-gray-500">Save the complete EQUIFAX report as a PDF.</p>
        </div>
        <a
          href={hasPdf ? pdfUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!hasPdf}
          className={`inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#9c1c2e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#82101f] ${
            hasPdf ? "" : "pointer-events-none opacity-50"
          }`}
        >
          <DownloadIcon />
          Download PDF
        </a>
      </div>
    </div>
  );
}
