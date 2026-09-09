"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import loanSanctionedIcon from "@/public/images/congress.png";
import InlineLinkNoticeBox from "./InlineLinkNoticeBox";
import LoanCancellationModal from "./LoanCancellationModal";
import SupportTeamQuerySection from "./SupportTeamQuerySection";
import { LOAN_CANCELLATION_NOTICE_COPY } from "./loan-cancellation/constants";
import {
  isLoanCancellationMockEnabled,
  MOCK_LOAN_ID,
} from "@/lib/loan-cancellation-mock";
import {
  getCanCancelFromActiveLoanResponse,
  getLoanIdFromActiveLoanResponse,
  useGetExistingActiveLoan,
} from "@/services/loans";
import { formatCurrency } from "@/lib/format-utils";
import { formatLoanTenureDisplay } from "@/lib/loan-detail-formatters";
import AppButton from "@/components/app-button";

export default function LoanSanctionedStep() {
  const router = useRouter();
  const [isCancellationModalVisible, setIsCancellationModalVisible] =
    useState(false);

  const { data: activeLoanData } = useGetExistingActiveLoan();
  const cancellationLoanId = useMemo(() => {
    const realLoanId = getLoanIdFromActiveLoanResponse(activeLoanData);
    if (realLoanId) return realLoanId;
    // Dev-only fallback so the notice + link render even when the backend has
    // no active loan for this user. Production is unaffected when the flag is off.
    if (isLoanCancellationMockEnabled()) return MOCK_LOAN_ID;
    return null;
  }, [activeLoanData]);
  // Show the policy notice whenever we know the loan id; link visibility is
  // gated by `canCancel` from GET /loans/active (fail closed when missing).
  const shouldShowCancellationNotice = cancellationLoanId != null;
  const canCancelLoanNow = getCanCancelFromActiveLoanResponse(activeLoanData);

  const loanAmountLabel = useMemo(() => {
    const amount = activeLoanData?.loan?.amount;
    if (amount == null || !Number.isFinite(amount)) return "—";
    return formatCurrency(amount);
  }, [activeLoanData?.loan?.amount]);

  const tenureLabel = useMemo(() => {
    const tenure = activeLoanData?.loan?.tenure;
    if (!tenure?.trim()) return "—";
    const formatted = formatLoanTenureDisplay(tenure);
    return formatted.replace(/\bdays\b/i, "Days");
  }, [activeLoanData?.loan?.tenure]);

  const handleGoToDashboard = () => {
    router.push("/");
  };

  const handleOpenCancellationModal = useCallback(() => {
    setIsCancellationModalVisible(true);
  }, []);

  const handleCloseCancellationModal = useCallback(() => {
    setIsCancellationModalVisible(false);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 sm:p-6 md:p-8 max-w-2xl mx-auto w-full text-center">
      <div className="flex justify-center mb-4 sm:mb-6">
        <Image
          src={loanSanctionedIcon}
          alt=""
          width={300}
          height={300}
          className="w-[180px] sm:w-[240px] md:w-[260px] h-auto"
        />
      </div>

      <h2
        id="loan-sanctioned-title"
        className="text-2xl sm:text-xl font-semibold text-gray-900 mb-2 text-center"
      >
        {/* Great news! 🎉 */}
        Almost there !
      </h2>
      <p className="text-base sm:text-3xl font-semibold text-gray-800 mb-2 text-left">
        {/* Your application is under final Disbursement Review */}
        
      </p>
      <p className="text-sm text-gray-600 mb-4 text-left">
        {/* Post successful review, funds will be transferred in your account within 24 hours. */}
        After a successful review, the funds will be transferred to your account within 24 hours.
      </p>

      <SupportTeamQuerySection totalLoanAmount={loanAmountLabel} tenure={tenureLabel} />

      {shouldShowCancellationNotice ? (
        <InlineLinkNoticeBox
          title={LOAN_CANCELLATION_NOTICE_COPY.title}
          message={LOAN_CANCELLATION_NOTICE_COPY.message}
          linkLabel={LOAN_CANCELLATION_NOTICE_COPY.linkLabel}
          showLink={canCancelLoanNow}
          onLinkPress={handleOpenCancellationModal}
          accessibilityLabel={LOAN_CANCELLATION_NOTICE_COPY.linkAccessibilityLabel}
          className="mb-4"
        />
      ) : null}

      <AppButton type="button" fullWidth onClick={handleGoToDashboard}>
        Go to Home
      </AppButton>

      {cancellationLoanId != null ? (
        <LoanCancellationModal
          visible={isCancellationModalVisible}
          loanId={cancellationLoanId}
          onClose={handleCloseCancellationModal}
        />
      ) : null}
    </div>
  );
}
