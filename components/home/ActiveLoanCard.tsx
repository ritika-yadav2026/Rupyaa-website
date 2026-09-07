"use client";

/**
 * ActiveLoanCard - Card for ACTIVE_LOAN_DASHBOARD stage (§3.1 spec).
 */

import Image from "next/image";
import { formatCurrency } from "@/lib/format-utils";
import { formatLoanDueDate } from "@/helpers/loan-helper";
import { CancelLoanEntryLink } from "@/components/loan-cancellation/CancelLoanEntryLink";

const CARD_BORDER = "#C8D8D0";
const ACCENT_GREEN = "#006837";

export interface ActiveLoanCardProps {
  amount: number;
  amountDue?: number;
  dueDate: string;
  statusPill: "Active" | "Overdue";
  actionLabel: string;
  onActionPress?: () => void;
  disableAction?: boolean;
  showCancelLoanEntry?: boolean;
  canCancelLoan?: boolean;
  onCancelLoanPress?: () => void;
}

const STATUS_CONFIG = {
  Active: {
    description:
      "Your loan is active. Close on time to avoid late fees and save on interest.",
    pillLabel: "ACTIVE",
    showDot: true,
  },
  Overdue: {
    description:
      "Your loan is overdue. Pay now to avoid additional late fees and penalties.",
    pillLabel: "OVERDUE",
    showDot: false,
  },
} as const;

function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-gray-500 shrink-0"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export function ActiveLoanCard({
  amountDue,
  dueDate,
  statusPill,
  actionLabel,
  onActionPress,
  disableAction = false,
  showCancelLoanEntry = false,
  canCancelLoan = false,
  onCancelLoanPress,
}: ActiveLoanCardProps) {
  const isOverdue = statusPill === "Overdue";
  const isInteractive = typeof onActionPress === "function" && !disableAction;
  const dueDateFormatted = formatLoanDueDate(dueDate);
  const { description, pillLabel, showDot } = STATUS_CONFIG[statusPill];

  const totalPayable =
    typeof amountDue === "number" && amountDue > 0 ? amountDue : 0;

  return (
    <div
      className="relative rounded-2xl mb-3 overflow-hidden border bg-white shadow-[0_12px_32px_rgba(0,104,55,0.12)] px-6 py-6 sm:px-7 sm:py-7"
      style={{ borderColor: CARD_BORDER }}
    >
      <Image
        src="/images/hero-card-grid.png"
        alt=""
        fill
        className="object-cover opacity-[0.08] pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Loan Status</h3>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold tracking-wide ${isOverdue
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-[#7FBF9A] bg-[#E8F5E9] text-[#006837]"
              }`}
          >
            {showDot ? (
              <span className="h-2 w-2 rounded-full bg-[#006837]" aria-hidden />
            ) : null}
            {pillLabel}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-5 leading-relaxed">{description}</p>

        <p className="text-sm text-gray-600 mb-4">
          Total Amount Due :{" "}
          <span className="text-lg font-bold" style={{ color: ACCENT_GREEN }}>
            {formatCurrency(totalPayable)}
          </span>
        </p>

        {dueDateFormatted ? (
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
            <CalendarIcon />
            <span>Due on {dueDateFormatted}</span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onActionPress}
          disabled={!isInteractive}
          className={`w-full min-h-[52px] rounded-xl text-sm sm:text-base font-bold text-white transition-all ${isInteractive
            ? isOverdue
              ? "bg-red-600 hover:bg-red-700"
              : "hover:brightness-[0.98]"
            : "bg-gray-400 cursor-not-allowed"
            }`}
          style={{ backgroundColor: ACCENT_GREEN }}
        >
          {actionLabel}
        </button>

        {showCancelLoanEntry ? (
          <div className="mt-4">
            <CancelLoanEntryLink
              showLink={canCancelLoan === true}
              onLinkPress={onCancelLoanPress ?? (() => undefined)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
