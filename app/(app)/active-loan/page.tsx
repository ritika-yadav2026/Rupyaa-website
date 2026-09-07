"use client";

import Link from "next/link";
import { useMemo } from "react";
import AppEmptyStateCard from "@/components/app-empty-state-card";
import Footer from "@/components/home/Footer";
import { AmountSummaryBox, LoanDetailRow } from "@/components/loans/LoanDetailSection";
import {
  formatInterestPerDayDisplay,
  formatLoanDate,
  formatLoanTenureDisplay,
  getApplicationDisplay,
  getDisbursedDateString,
} from "@/lib/loan-detail-formatters";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import { formatCurrency } from "@/lib/format-utils";
import {
  resolveActiveLoanScreenType,
  resolveForeclosureTotalPayable,
} from "@/helpers/loan-helper";
import { useGetExistingActiveLoan } from "@/services/loans";

function WalletEmptyIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="text-primary"
    >
      <path d="M21 12V7H5a2 2 0 010-4h14v4" />
      <path d="M3 5v14a2 2 0 002 2h16v-5" />
      <path d="M18 12a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  );
}

export default function ActiveLoanPage() {
  const { data: loanData, isPending: loanPending, isError: loanError, error: loanErr } =
    useGetExistingActiveLoan({ enabled: true });

  const loan = loanData?.hasActiveLoan ? loanData.loan : null;
  const screenType = useMemo(() => resolveActiveLoanScreenType(loan), [loan]);
  const primaryHref = screenType === "foreclosure" ? "/foreclosure" : "/payment";
  const secondaryHref = screenType === "foreclosure" ? "/payment" : "/foreclosure";
  const primaryLabel =
    screenType === "foreclosure" ? "Foreclose Your Loan" : "Make Payment";
  const secondaryLabel =
    screenType === "foreclosure" ? "Make Payment" : "Foreclose Your Loan";

  const amountDue = loan?.amountDue ?? 0;

  return (
    <div className="flex min-h-full flex-col">
      <div className={`flex flex-1 flex-col py-8 sm:py-12 ${appShellContainerClassName}`}>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Active Loan</h1>
          <p className="text-primary text-sm sm:text-base mt-1">
            View your loan details and manage repayments
          </p>
        </div>

        {loanError ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {loanErr instanceof Error ? loanErr.message : "Failed to load loan. Please try again."}
          </div>
        ) : null}

        {loanPending && !loanData ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm font-medium">Loading loan…</span>
            </div>
          </div>
        ) : null}

        {!loanPending && loanData && !loan ? (
          <AppEmptyStateCard
            icon={<WalletEmptyIcon />}
            title="Your next loan is just a few taps away"
            description="Get instant funds, flexible repayment, and zero hassle."
            primaryAction={{ label: "Apply for a Loan", href: "/personal-loan" }}
            secondaryAction={{ label: "Check Eligibility", href: "/personal-loan" }}
          />
        ) : null}

        {loan ? (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 mb-6 shadow-sm">
              <p className="text-sm text-gray-600 mb-4">
                Application:{" "}
                <span className="font-bold text-gray-900">{getApplicationDisplay(loan)}</span>
              </p>
              <LoanDetailRow label="Principal Amount" value={formatCurrency(loan.amount)} />
              <LoanDetailRow label="Loan Tenure" value={formatLoanTenureDisplay(loan.tenure)} />
              <LoanDetailRow label="Disbursed on" value={getDisbursedDateString(loan)} />
              <LoanDetailRow label="Due Date" value={formatLoanDate(loan.dueDate)} />
              <LoanDetailRow
                label="Interest (per day)"
                value={formatInterestPerDayDisplay(loan)}
              />
              <LoanDetailRow
                label="Total payable"
                value={formatCurrency(loan.totalPayable ?? 0)}
              />
              <AmountSummaryBox
                label="Total Amount Due"
                amount={formatCurrency(amountDue)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={primaryHref}
                className="flex-1 min-h-[52px] rounded-xl bg-primary text-white font-semibold flex items-center justify-center hover:bg-primary/90"
              >
                {primaryLabel}
              </Link>
              <Link
                href={secondaryHref}
                className="flex-1 min-h-[52px] rounded-xl border border-primary text-primary font-semibold flex items-center justify-center hover:bg-[#E8F5E9]/50"
              >
                {secondaryLabel}
              </Link>
            </div>

            {screenType === "foreclosure" ? (
              <p className="text-xs text-gray-500 text-center mt-4">
                Foreclosure amount: {formatCurrency(resolveForeclosureTotalPayable(loan))}
              </p>
            ) : null}
          </>
        ) : null}

        <p className="text-xs text-gray-500 text-center pt-8 mt-8 border-t border-gray-200">
          All repayment goes to our partner NBFC, WEEKLINE INVESTMENT AND TRADING COMPANY LTD.
        </p>
      </div>
      <Footer />
    </div>
  );
}
