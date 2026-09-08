"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { formatCurrency } from "@/lib/format-utils";
import { useFlowStore, DEFAULT_OFFER_AMOUNT } from "@/store/useFlowStore";
import BasicInfoSidebar from "./BasicInfoSidebar";
import { useEnableFullWebJourney } from "@/hooks/useEnableFullWebJourney";
import { useApprovedOfferStep } from "@/hooks/useApprovedOfferStep";
import { ensureCurrentOfferForApprovedStep } from "@/lib/fetch-current-offer";
import type { CurrentOffer, LoanType } from "@/lib/eligibility-api";
import { useCurrentOfferStore } from "@/store/useCurrentOfferStore";
import { trackReviewOfferPageLand, trackReviewOfferPageClick } from "@/lib/gtm";
import ZapcashLoading from "@/components/ZapcashLoading";
import AppButton from "@/components/app-button";

type Props = {
  onContinue?: () => void;
  substepId?: string;
};

const OFFER_VIEW_STATUS = {
  LOADING: "loading",
  APPROVED: "approved",
  EMPTY: "empty",
} as const;

type OfferViewStatus =
  (typeof OFFER_VIEW_STATUS)[keyof typeof OFFER_VIEW_STATUS];

const OFFER_COPY = {
  ACCEPT_BUTTON: "Accept & Continue",
  REFRESH_BUTTON: "Refresh to Check",
  REFRESHING_BUTTON: "Checking...",
  EMPTY_TITLE: "No offer found",
  EMPTY_MESSAGE: "Please try again later.",
  UNAVAILABLE_TITLE: "Offer details unavailable",
  UNAVAILABLE_MESSAGE:
    "We loaded your profile but could not show this offer yet. Tap Refresh to check again.",
  HIGHER_LOAN_TITLE: "Get a Higher Loan Amount",
  HIGHER_LOAN_SUBTEXT:
    "Connect your bank securely to check if you qualify for a better offer. Your current offer remains safe",
} as const;

function CheckIcon() {
  return (
    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary shrink-0">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

function RegisterLoanOfferMarketing({
  onContinue,
}: {
  onContinue?: () => void;
}) {
  const offerAmount = useFlowStore((s) => s.offerAmount);
  const hasPersonalizedOffer = offerAmount != null && offerAmount > 0;

  const displayAmount = hasPersonalizedOffer ? offerAmount : DEFAULT_OFFER_AMOUNT;
  const amountLabel = hasPersonalizedOffer ? "AMOUNT UPTO" : "OFFER AMOUNT UP TO";
  const amountText = formatCurrency(displayAmount);

  const handleDownload = (): void => {
    onContinue?.();
  };

  return (
    <div className="w-full max-w-full sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[65vw] min-w-0 mx-auto px-2 sm:px-0">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
          Welcome to <span className="text-primary">ZapCash!</span>
        </h1>
        <p className="text-base text-gray-700">Your loan journey begins here.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
        <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col gap-4 justify-between">
          <div>
            <span className="item-center inline-flex gap-1.5 w-fit px-3 py-1.5 rounded-full bg-[#e8f5e9] border border-primary text-primary text-xs font-bold uppercase tracking-wide mb-4">
              <CheckIcon />
              {hasPersonalizedOffer ? "PERSONALIZED OFFER" : "LOAN OFFER"}
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
              {hasPersonalizedOffer ? "Congratulations! 🎉" : "Great news!"}
            </h2>
            <p className="text-base text-gray-500 mb-4">
              {hasPersonalizedOffer
                ? "Your Loan Offer is Ready and waiting for you."
                : "Download the app to unlock your loan offer."}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-[15px] text-gray-500 text-center tracking-wider mb-1 uppercase">{amountLabel}</p>
            <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-semibold text-primary mb-4">
              {amountText}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700 mb-4">To continue this offer download our ZapCash App.</p>
            <div className="flex flex-col gap-3">
              <AppButton type="button" fullWidth onClick={handleDownload}>
                Continue In App
              </AppButton>
            </div>
          </div>
        </div>
        <div className="lg:w-[320px] xl:w-[380px] shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100">
          <BasicInfoSidebar />
        </div>
      </div>
    </div>
  );
}

function OfferDetailRow({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  let separator: ReactNode = null;
  if (!isLast) {
    separator = <div className="h-px bg-gray-200" />;
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center py-3 gap-4">
        <span className="text-sm text-gray-500 flex-1">{label}</span>
        <span className="text-sm font-semibold text-gray-900 text-right">{value}</span>
      </div>
      {separator}
    </>
  );
}

function OfferDetailsCard({
  offer,
  loanType,
}: {
  offer: CurrentOffer;
  loanType?: LoanType;
}) {
  const rateKind = loanType === "PAY_DAY" ? "P.D" : "P.A";
  const rate =
    offer.interestRate != null && Number.isFinite(offer.interestRate)
      ? `${offer.interestRate}% ${rateKind}`
      : `—`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 pt-4 pb-2 mb-4">
      <p className="text-sm font-semibold text-gray-900 mb-2">Loan Details</p>
      <div className="h-px bg-gray-200 mb-1" />
      <OfferDetailRow label="Loan Amount" value={formatCurrency(offer.offerAmount ?? 0, true)} />
      <OfferDetailRow label="Repayment Period" value={`${offer?.loanId?.tenure ?? 0} days`} />
      <OfferDetailRow label="Interest Rate" value={rate} />
      <OfferDetailRow label="Total Amount to Repay" value={formatCurrency(offer.payableAmount, true)} isLast />
    </div>
  );
}

function ButtonSpinner() {
  return (
    <span
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"
      aria-hidden
    />
  );
}

function ApprovedOfferReview({ onContinue }: { onContinue?: () => void }) {
  const landSent = useRef(false);
  const userStage = useFlowStore((s) => s.userStageResponse?.stage);
  const offerStatus = useFlowStore((s) => s.userStageResponse?.context?.offerStatus);
  const lastResult = useCurrentOfferStore((s) => s.lastResult);

  useEffect(() => {
    void ensureCurrentOfferForApprovedStep({ from: "LoanOfferScreen:approved-offer" });
  }, [userStage, offerStatus, lastResult]);

  const handleAcceptSuccess = useCallback(() => {
    trackReviewOfferPageClick();
    void Promise.resolve(onContinue?.());
  }, [onContinue]);

  const {
    offer,
    loanType,
    isApproved,
    isOfferResolved,
    showImproveOfferAction,
    improveOfferByUsingBsa,
    acceptOffer,
    isAccepting,
    acceptError,
    clearAcceptError,
    refreshOffer,
    isRefreshing,
    refreshError,
    clearRefreshError,
    offerHiddenAfterSuccessfulFetch,
  } = useApprovedOfferStep({
    onAcceptSuccess: handleAcceptSuccess,
    onAcceptError: () => undefined,
  });

  useEffect(() => {
    if (!isOfferResolved || landSent.current) return;
    landSent.current = true;
    trackReviewOfferPageLand();
  }, [isOfferResolved]);

  const handleRefreshClick = useCallback(() => {
    clearRefreshError();
    refreshOffer();
  }, [clearRefreshError, refreshOffer]);

  const handleAcceptPress = useCallback(() => {
    clearAcceptError();
    acceptOffer();
  }, [clearAcceptError, acceptOffer]);

  const buttonLabel = isApproved
    ? OFFER_COPY.ACCEPT_BUTTON
    : OFFER_COPY.REFRESH_BUTTON;
  const buttonAction = isApproved ? handleAcceptPress : handleRefreshClick;
  const buttonDisabled = isRefreshing || isAccepting;
  const showRefreshError = refreshError != null && !isRefreshing;

  // Keep the mutually exclusive screen states explicit so only one main view
  // can render, as required by the repository conditional-rendering rules.
  let offerViewStatus: OfferViewStatus;
  if (!isOfferResolved) {
    offerViewStatus = OFFER_VIEW_STATUS.LOADING;
  } else if (isApproved && offer) {
    offerViewStatus = OFFER_VIEW_STATUS.APPROVED;
  } else {
    offerViewStatus = OFFER_VIEW_STATUS.EMPTY;
  }

  if (offerViewStatus === OFFER_VIEW_STATUS.LOADING) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <ZapcashLoading />
      </div>
    );
  }

  let improveOfferContent: ReactNode = null;
  if (showImproveOfferAction) {
    improveOfferContent = (
      <button
        type="button"
        onClick={improveOfferByUsingBsa}
        className="w-full text-left rounded-2xl border border-button bg-[#FFFCF4]/40 p-4 mb-4 hover:bg-[#e8f5e9]/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <p className="text-sm font-semibold text-gray-900 mb-1">
          {OFFER_COPY.HIGHER_LOAN_TITLE}
        </p>
        <p className="text-sm text-gray-600">
          {OFFER_COPY.HIGHER_LOAN_SUBTEXT}
        </p>
      </button>
    );
  }

  let acceptErrorContent: ReactNode = null;
  if (acceptError != null) {
    acceptErrorContent = (
      <p className="text-sm text-red-600 mb-2">{acceptError}</p>
    );
  }

  let refreshFeedbackContent: ReactNode = null;
  if (showRefreshError) {
    refreshFeedbackContent = (
      <p className="text-sm text-red-600 mb-4">{refreshError}</p>
    );
  } else if (isRefreshing) {
    refreshFeedbackContent = (
      <div className="py-8 flex justify-center">
        <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  let offerContent: ReactNode;
  if (offerViewStatus === OFFER_VIEW_STATUS.APPROVED && offer) {
    offerContent = (
      <>
        <div className="text-center py-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Your Loan Amount
          </p>
          <p className="text-3xl sm:text-4xl font-semibold text-gray-900">
            {formatCurrency(offer.offerAmount ?? 0, true)}
          </p>
        </div>
        <OfferDetailsCard offer={offer} loanType={loanType} />
        {improveOfferContent}
        {acceptErrorContent}
      </>
    );
  } else {
    const emptyTitle = offerHiddenAfterSuccessfulFetch
      ? OFFER_COPY.UNAVAILABLE_TITLE
      : OFFER_COPY.EMPTY_TITLE;
    const emptyMessage = offerHiddenAfterSuccessfulFetch
      ? OFFER_COPY.UNAVAILABLE_MESSAGE
      : OFFER_COPY.EMPTY_MESSAGE;

    offerContent = (
      <div className="flex-1 flex flex-col items-center text-center px-2 pt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{emptyTitle}</h2>
        <p className="text-base text-gray-600 mb-4">{emptyMessage}</p>
        {refreshFeedbackContent}
      </div>
    );
  }

  let acceptingSpinner: ReactNode = null;
  if (isAccepting) {
    acceptingSpinner = <ButtonSpinner />;
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col min-h-[360px] pb-28 sm:pb-32">
      {offerContent}

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur-sm px-4 py-3 sm:py-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-lg">
          <AppButton
            type="button"
            fullWidth
            onClick={buttonAction}
            disabled={buttonDisabled}
            className="gap-2"
          >
            {acceptingSpinner}
            <span>
              {isRefreshing ? OFFER_COPY.REFRESHING_BUTTON : buttonLabel}
            </span>
          </AppButton>
        </div>
      </div>
    </div>
  );
}

export default function LoanOfferScreen({ onContinue, substepId }: Props) {
  const enableFullWebJourney = useEnableFullWebJourney();
  const isApprovedOfferStep =
    enableFullWebJourney && substepId === "approved-offer";

  if (!isApprovedOfferStep) {
    return <RegisterLoanOfferMarketing onContinue={onContinue} />;
  }

  return <ApprovedOfferReview onContinue={onContinue} />;
}
