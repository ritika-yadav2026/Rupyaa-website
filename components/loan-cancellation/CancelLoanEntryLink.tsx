"use client";

import { LOAN_CANCELLATION_HOME_ENTRY_COPY } from "./constants";

type CancelLoanEntryLinkProps = {
  showLink: boolean;
  onLinkPress: () => void;
  accessibilityLabel?: string;
  className?: string;
};

/**
 * Inline cancel entry below home dashboard card CTAs.
 * Question stays visible when mounted; link is gated by `showLink`.
 */
export function CancelLoanEntryLink({
  showLink,
  onLinkPress,
  accessibilityLabel,
  className,
}: CancelLoanEntryLinkProps) {
  const linkAriaLabel =
    accessibilityLabel ?? LOAN_CANCELLATION_HOME_ENTRY_COPY.linkAccessibilityLabel;

  if (!showLink) return null;
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-1 text-center ${className ?? ""}`}
      data-testid="cancel-loan-entry"
    >
      <span className="text-sm text-gray-700">
        {LOAN_CANCELLATION_HOME_ENTRY_COPY.question}
      </span>
      {showLink ? (
        <button
          type="button"
          onClick={onLinkPress}
          aria-label={linkAriaLabel}
          className="min-h-[44px] px-2 text-sm font-medium text-primary underline underline-offset-2 hover:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-sm"
        >
          {LOAN_CANCELLATION_HOME_ENTRY_COPY.linkLabel}
        </button>
      ) : null}
    </div>
  );
}
