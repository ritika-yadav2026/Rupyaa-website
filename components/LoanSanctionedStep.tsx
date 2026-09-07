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
        className="text-base sm:text-xl font-semibold text-gray-900 mb-2 text-left"
      >
        Great news! 🎉
      </h2>
      <p className="text-base sm:text-3xl font-semibold text-gray-800 mb-2 text-left">
        Your application is under final Disbursement Review
      </p>
      <p className="text-sm text-gray-600 mb-4 text-left">
        Post successful review, funds will be transferred in your account within 24 hours.
      </p>

      <SupportTeamQuerySection />

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

      <button
        type="button"
        onClick={handleGoToDashboard}
        className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px]"
      >
        Go to Home
      </button>

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
