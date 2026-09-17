"use client";

/**
 * Active loan dashboard card for the logged-in home hero.
 */

import type { ReactElement } from "react";
import { formatCurrency } from "@/lib/format-utils";
import { formatLoanDueDate } from "@/helpers/loan-helper";
import { CancelLoanEntryLink } from "@/components/loan-cancellation/CancelLoanEntryLink";
import {
  HeroStatusCardShell,
  HeroYellowButton,
} from "@/components/home/hero-status-card/HeroStatusCardShell";

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
    description: "Your loan is active. Close on time to avoid late fees and save on interest.",
    pillLabel: "ACTIVE",
  },
  Overdue: {
    description: "Your loan is overdue. Pay now to avoid additional late fees and penalties.",
    pillLabel: "OVERDUE",
  },
} as const;

/**
 * Active / overdue loan status card.
 */
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
}: ActiveLoanCardProps): ReactElement {
  const isOverdue = statusPill === "Overdue";
  const isInteractive = typeof onActionPress === "function" && !disableAction;
  const dueDateFormatted = formatLoanDueDate(dueDate);
  const { description, pillLabel } = STATUS_CONFIG[statusPill];
  const totalPayable =
    typeof amountDue === "number" && amountDue > 0 ? amountDue : 0;
  let badgeClassName = "text-[#FECA42]";
  if (isOverdue) {
    badgeClassName = "text-red-400";
  }

  return (
    <HeroStatusCardShell
      badge={
        <div
          className={`absolute right-3 top-3 z-10 rounded-md bg-[#1A1A1A] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide sm:right-4 sm:top-4 sm:text-[11px] ${badgeClassName}`}
        >
          {pillLabel}
        </div>
      }
    >
      <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">Loan Status</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-[15px]">{description}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 text-left sm:mt-6">
        <div className="rounded-xl border border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-4">
          <p className="text-xs font-medium text-gray-700 sm:text-sm">Total Amount Due</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-[#C9920F] sm:text-xl">
            {formatCurrency(totalPayable)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-4">
          <p className="text-xs font-medium text-gray-700 sm:text-sm">Due Date</p>
          <p className="mt-1 text-sm font-bold text-[#C9920F] sm:text-base">
            {dueDateFormatted || "—"}
          </p>
        </div>
      </div>
      <div className="mt-6 sm:mt-7">
        <HeroYellowButton onClick={onActionPress} disabled={!isInteractive}>
          {actionLabel}
        </HeroYellowButton>
      </div>
      {showCancelLoanEntry ? (
        <div className="mt-4">
          <CancelLoanEntryLink
            showLink={canCancelLoan === true}
            onLinkPress={onCancelLoanPress ?? (() => undefined)}
          />
        </div>
      ) : null}
    </HeroStatusCardShell>
  );
}
