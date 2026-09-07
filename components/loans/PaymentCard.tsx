"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Loan } from "@/lib/eligibility-api";
import { formatCurrency } from "@/lib/format-utils";
import {
  MIN_CUSTOM_AMOUNT,
  filterFixedAmounts,
  formatAmountForInput,
  isValidCustomPaymentAmount,
  parseDecimalAmount,
  percentageChipAmount,
  PERCENTAGES,
} from "@/lib/loan-amount-helpers";
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
import AppSelectableField from "@/components/app-selectable-field";

export interface PaymentCardProps {
  loan: Loan;
  onPaymentPress: (amount: number) => void;
  ctaLoading?: boolean;
  ctaError?: string | null;
  resetCustomAmountKey?: number;
}

type PaymentOption = "full" | "custom";

export function PaymentCard({
  loan,
  onPaymentPress,
  ctaLoading = false,
  ctaError = null,
  resetCustomAmountKey,
}: PaymentCardProps) {
  const totalPayable = loan.totalPayable ?? 0;
  const totalAmountPaid = loan.totalAmountPaid ?? 0;
  const paymentLeft = loan.amountDue ?? 0;
  const amountPayment = loan.amountDue ?? 0;
  const loanStatus = loan.status ?? "";
  const isOverdue = loanStatus.toLowerCase() === "overdue";
  const totalPayableWithoutBouncePenalty = loan.totalPayable ?? 0;

  const [paymentOption, setPaymentOption] = useState<PaymentOption>("full");
  const [customAmountInput, setCustomAmountInput] = useState("");
  const [customAmountTouched, setCustomAmountTouched] = useState(false);

  useEffect(() => {
    if (resetCustomAmountKey != null) {
      setCustomAmountInput("");
      setCustomAmountTouched(false);
    }
  }, [resetCustomAmountKey]);

  const customAmount = useMemo(
    () => parseDecimalAmount(customAmountInput),
    [customAmountInput],
  );
  const isValidCustom = isValidCustomPaymentAmount(customAmount, paymentLeft);
  const showCustomError =
    customAmountTouched && customAmountInput.length > 0 && !isValidCustom;

  const customErrorMessage = useMemo(() => {
    if (!showCustomError) return null;
    if (customAmount > paymentLeft) {
      return `Amount cannot exceed ${formatCurrency(paymentLeft)}`;
    }
    if (customAmount > 0 && customAmount < MIN_CUSTOM_AMOUNT) {
      return `Please enter a valid amount greater than ${formatCurrency(MIN_CUSTOM_AMOUNT)}`;
    }
    if (customAmount === 0) {
      return `Please enter a valid amount between ${formatCurrency(MIN_CUSTOM_AMOUNT)} and ${formatCurrency(paymentLeft)}`;
    }
    return null;
  }, [showCustomError, customAmount, paymentLeft]);

  const remainingBalance = Math.max(0, paymentLeft - customAmount);

  const percentageAmounts = useMemo(
    () =>
      PERCENTAGES.map((pct) => ({
        pct,
        amount: percentageChipAmount(paymentLeft, pct),
      })),
    [paymentLeft],
  );

  const fixedAmountsFiltered = useMemo(
    () => filterFixedAmounts(paymentLeft),
    [paymentLeft],
  );

  const setCustomAmount = useCallback(
    (amount: number) => {
      const capped = Math.min(paymentLeft, Math.max(0, amount));
      setCustomAmountInput(String(capped));
      setCustomAmountTouched(true);
    },
    [paymentLeft],
  );

  const handleCustomAmountChange = useCallback(
    (text: string) => {
      if (text.trim() === "") {
        setCustomAmountInput("");
        return;
      }
      const num = parseDecimalAmount(text);
      const clamped = Math.min(paymentLeft, Math.max(0, num));
      const rounded = Math.round(clamped * 100) / 100;
      setCustomAmountInput(formatAmountForInput(rounded));
    },
    [paymentLeft],
  );

  const handleCtaPress = useCallback(() => {
    if (paymentOption === "full") {
      onPaymentPress(paymentLeft);
      return;
    }
    setCustomAmountTouched(true);
    if (!isValidCustom) return;
    onPaymentPress(customAmount);
  }, [paymentOption, paymentLeft, customAmount, isValidCustom, onPaymentPress]);

  const ctaLabel =
    paymentOption === "full"
      ? `Pay Full Amount ${formatCurrency(paymentLeft)}`
      : `Pay Custom Amount ${formatCurrency(customAmount)}`;
  const ctaDisabled =
    ctaLoading || (paymentOption === "custom" && !isValidCustom);

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
          {isOverdue ? (
            <>
              <LoanDetailRow
                label="Payable at Due Date"
                value={formatCurrency(totalPayableWithoutBouncePenalty)}
              />
              <LoanDetailRow
                label="Bounce Amount"
                value={formatCurrency(loan.bounceAmount ?? 0)}
              />
              <LoanDetailRow
                label="Penalty Amount"
                value={formatCurrency(loan.totalPenaltyAmount ?? 0)}
              />
            </>
          ) : (
            <LoanDetailRow label="Total payable" value={formatCurrency(totalPayable)} />
          )}
        </div>

        <AmountSummaryBox label="Total Amount Due" amount={formatCurrency(amountPayment)} />

        <hr className="border-gray-200 my-4" />

        <LoanDetailRow label="Amount Paid" value={formatCurrency(totalAmountPaid)} />
        <LoanDetailRow label="Payment Left" value={formatCurrency(paymentLeft)} />

        {isOverdue ? (
          <>
            <h2 className="text-base font-semibold text-gray-900 mt-6 mb-3">Payment Options</h2>
            <AppSelectableField
              name="paymentOption"
              value={paymentOption}
              onChange={(nextValue) => setPaymentOption(nextValue as PaymentOption)}
              disabled={ctaLoading}
              className="mb-4"
              options={[
                {
                  value: "full",
                  title: "Pay Full Amount",
                  description: formatCurrency(paymentLeft),
                },
                {
                  value: "custom",
                  title: "Pay Custom Amount",
                },
              ]}
            />

            {paymentOption === "custom" ? (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Quick Amount Options</h3>
                <p className="text-xs text-gray-600 mb-2">Pay by Percentage:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {percentageAmounts.map(({ pct, amount }) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setCustomAmount(amount)}
                      disabled={ctaLoading}
                      className="min-w-[80px] flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-center hover:border-primary"
                    >
                      <span className="block text-xs font-semibold">{pct}%</span>
                      <span className="block text-xs text-gray-600">{formatCurrency(amount)}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mb-2">Fixed Amounts:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {fixedAmountsFiltered.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setCustomAmount(amount)}
                      disabled={ctaLoading}
                      className="min-w-[80px] flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold hover:border-primary"
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Or Enter Custom Amount</h3>
                <p className="text-xs text-gray-500 mb-2">
                  ({formatCurrency(MIN_CUSTOM_AMOUNT)} - {formatCurrency(paymentLeft)})
                </p>
                <div
                  className={`flex items-center rounded-lg border bg-gray-50 px-3 ${
                    showCustomError ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <span className="text-sm font-semibold text-gray-700 mr-1">₹</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={customAmountInput}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    onBlur={() => setCustomAmountTouched(true)}
                    placeholder="0"
                    disabled={ctaLoading}
                    aria-label="Custom amount to pay"
                    className="flex-1 bg-transparent py-3 text-sm text-gray-900 outline-none"
                  />
                </div>
                {customErrorMessage ? (
                  <p className="mt-1 text-xs text-red-600">{customErrorMessage}</p>
                ) : null}
                <p className="mt-2 text-xs text-gray-500">
                  Remaining balance after payment: {formatCurrency(remainingBalance)}
                </p>
                <div className="mt-4 rounded-lg bg-[#E8F5E9]/50 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-800">Amount to Pay:</span>
                    <span className="font-bold">{formatCurrency(customAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-800">Remaining Balance:</span>
                    <span className="font-bold">{formatCurrency(remainingBalance)}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-200 bg-white px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="mx-auto max-w-7xl">
          <ErrorContainer message={ctaError} />
          <button
            type="button"
            onClick={handleCtaPress}
            disabled={ctaDisabled}
            className="w-full min-h-[52px] rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {ctaLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              ctaLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
