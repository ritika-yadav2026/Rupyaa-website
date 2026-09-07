"use client";

import type { ReactNode } from "react";
import type { Loan } from "@/lib/eligibility-api";
import { formatCurrency } from "@/lib/format-utils";
import { formatLoanStatusLabel, getHistoryHelperText } from "@/lib/loan-detail-formatters";
import {
  getLoanDisplayTitle,
  getLoanStatusColorVariant,
  shouldShowNocCta,
} from "@/helpers/loan-helper";
import { LoanDetailRow } from "./LoanDetailSection";
import { LoanCardShell } from "./LoanCardShell";
import { LoanStatusPill } from "./LoanStatusPill";

export function HistoryLoanCard({
  loan,
  onRequestNoc,
  isNocPending,
}: {
  loan: Loan;
  onRequestNoc: (loan: Loan) => void;
  isNocPending: boolean;
}) {
  const paymentStatusLabel = formatLoanStatusLabel(loan.paymentStatus) || "—";
  const paymentStatusVariant = getLoanStatusColorVariant(loan.paymentStatus);
  const showNoc = shouldShowNocCta(loan);

  const renderGetNocButton = () => {
    if (!showNoc) return undefined;

    let buttonContent: ReactNode;
    if (isNocPending) {
      buttonContent = (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      );
    } else {
      buttonContent = "Get NOC";
    }

    return (
      <>
        <p className="mb-4 text-sm text-primary">
          {getHistoryHelperText(loan.paymentStatus)}
        </p>
        <button
          type="button"
          onClick={() => onRequestNoc(loan)}
          disabled={isNocPending}
          className="flex w-full min-h-[48px] items-center justify-center rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {buttonContent}
        </button>
      </>
    );
  }

  return (
    <LoanCardShell
      title={getLoanDisplayTitle(loan)}
      statusLabel={"Closed"}
      statusVariant={getLoanStatusColorVariant(loan.status)}
      footer={renderGetNocButton()}
    >
      <LoanDetailRow label="Principal Amount" value={formatCurrency(loan.amount)} />
      <LoanDetailRow
        label="Payment Status"
        value={<LoanStatusPill label={paymentStatusLabel} variant={paymentStatusVariant} />}
      />
    </LoanCardShell>
  );
}
