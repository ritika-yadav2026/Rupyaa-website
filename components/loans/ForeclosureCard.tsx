"use client";

import type { Loan } from "@/lib/eligibility-api";
import { formatCurrency } from "@/lib/format-utils";
import {
  formatInterestPerDayDisplay,
  formatLoanDate,
  formatLoanTenureDisplay,
  getApplicationDisplay,
  getDisbursedDateString,
} from "@/lib/loan-detail-formatters";
import { LoanApplicationHeader } from "@/components/loans/LoanApplicationHeader";
import { AmountSummaryBox, LoanDetailRow } from "@/components/loans/LoanDetailSection";
import { ErrorContainer } from "@/components/loans/ErrorContainer";

export interface ForeclosureCardProps {
  loan: Loan;
  onForeclosePress: () => void;
  ctaLoading?: boolean;
  ctaError?: string | null;
}

export function ForeclosureCard({
  loan,
  onForeclosePress,
  ctaLoading = false,
  ctaError = null,
}: ForeclosureCardProps) {
  const amountDue = loan.amountDue ?? 0;
  const totalPayable = loan.totalPayable ?? 0;
  const loanStatus = loan.status ?? "";

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="flex-1 overflow-y-auto pb-28">
        <LoanApplicationHeader
          applicationDisplay={getApplicationDisplay(loan)}
          status={loanStatus}
        />

        <div className="mb-2">
          <LoanDetailRow label="Principal Amount" value={formatCurrency(loan.amount)} />
          <LoanDetailRow label="Loan Tenure" value={formatLoanTenureDisplay(loan.tenure)} />
          <LoanDetailRow label="Disbursed on" value={getDisbursedDateString(loan)} />
          <LoanDetailRow label="Due Date" value={formatLoanDate(loan.dueDate)} />
          <LoanDetailRow label="Interest (per day)" value={formatInterestPerDayDisplay(loan)} />
          <LoanDetailRow label="Total payable" value={formatCurrency(totalPayable)} />
          <LoanDetailRow label="Payment due today" value={formatCurrency(amountDue)} />
        </div>

        <AmountSummaryBox label="Total Amount Due" amount={formatCurrency(amountDue)} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-200 bg-white px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="mx-auto max-w-7xl">
          <ErrorContainer message={ctaError} />
          <button
            type="button"
            onClick={onForeclosePress}
            disabled={ctaLoading}
            className="w-full min-h-[52px] rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {ctaLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              `Pay Full Amount ${formatCurrency(amountDue)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
