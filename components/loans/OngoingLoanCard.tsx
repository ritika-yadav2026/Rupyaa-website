"use client";

import Link from "next/link";
import type { Loan } from "@/lib/eligibility-api";
import { formatCurrency, formatLoanDate } from "@/lib/format-utils";
import { formatLoanStatusLabel, getLoanStatusText } from "@/lib/loan-detail-formatters";
import {
  getLoanDisplayTitle,
  getLoanStatusColorVariant,
  resolveActiveLoanScreenType,
} from "@/helpers/loan-helper";
import { LoanDetailRow } from "./LoanDetailSection";
import { LoanCardShell } from "./LoanCardShell";
import { LoanStatusPill } from "./LoanStatusPill";

export function OngoingLoanCard({ loan }: { loan: Loan }) {
  const screenType = resolveActiveLoanScreenType(loan);
  const payNowHref = screenType === "foreclosure" ? "/foreclosure" : "/payment";
  const disbursedOn = loan.disbursedAt ?? loan.actualDisbursedAt ?? loan.createdAt ?? '';
  const disbursedOnLabel = disbursedOn ? formatLoanDate(disbursedOn) : 'N/A';

  const paymentStatusLabel = formatLoanStatusLabel(loan.paymentStatus) || "—";
  const nextDueAmount = formatCurrency(
    typeof loan.amountDue === 'number' && Number.isFinite(loan.amountDue) ? loan.amountDue : 0
  );

  return (
    <LoanCardShell
      title={getLoanDisplayTitle(loan)}
      statusLabel={"i"}
      statusVariant={'neutral'}
      footer={
        <Link
          href={payNowHref}
          className="flex w-full min-h-[48px] items-center justify-center rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
        >
          Pay Now
        </Link>
      }
    >
      <LoanDetailRow label="Principal Amount" value={formatCurrency(loan.amount)} />
      <LoanDetailRow label="Disbursed On" value={formatLoanDate(disbursedOnLabel)} />
      <LoanDetailRow label="Remaining Balance" value={nextDueAmount} />
      <LoanDetailRow label="Loan status" value={
        <LoanStatusPill label={getLoanStatusText(loan)} variant={getLoanStatusColorVariant(loan.status)} />
      } />
      <LoanDetailRow
        label="Payment Status"
        value={paymentStatusLabel}
      />
    </LoanCardShell>
  );
}
