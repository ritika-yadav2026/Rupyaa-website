"use client";

import { LOAN_CANCELLATION_COPY } from "./constants";

type CancellationConfirmStepProps = {
  isSubmitting: boolean;
  submitError: string | null;
  onKeepLoan: () => void;
  onConfirmCancel: () => void;
};

function AlertCircleIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function CloseGlyphIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function CancellationConfirmStep({
  isSubmitting,
  submitError,
  onKeepLoan,
  onConfirmCancel,
}: CancellationConfirmStepProps) {
  const copy = LOAN_CANCELLATION_COPY.confirm;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertCircleIcon />
        </div>

        <h2 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">
          {copy.title}
        </h2>
        <p className="mb-5 max-w-sm text-sm leading-relaxed text-gray-600">
          {copy.subtitle}
        </p>

        <div className="w-full rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-left">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 text-primary">
              <InfoIcon />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary">
                {copy.calloutTitle}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {copy.calloutBody}
              </p>
            </div>
          </div>
        </div>

        {submitError ? (
          <p
            className="mt-4 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-left text-sm text-red-700"
            role="alert"
          >
            {submitError}
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={onKeepLoan}
          disabled={isSubmitting}
          className="w-full min-h-[48px] rounded-xl bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
        >
          {copy.keepLoanCta}
        </button>
        <button
          type="button"
          onClick={onConfirmCancel}
          disabled={isSubmitting}
          className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-red-500 bg-white py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
        >
          <CloseGlyphIcon />
          {isSubmitting ? "Canceling..." : copy.yesCancelCta}
        </button>
      </div>
    </div>
  );
}
