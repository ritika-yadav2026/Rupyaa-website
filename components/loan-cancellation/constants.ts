export const LOAN_CANCELLATION_COPY = {
  confirm: {
    title: "Are you absolutely sure?",
    subtitle:
      "This will immediately stop your loan process and you will not be able to recover this opportunity.",
    calloutTitle: "Please Note",
    calloutBody:
      "The loan cannot be recovered once canceled. You may apply for a new loan anytime in the future.",
    keepLoanCta: "Keep Loan",
    yesCancelCta: "Yes, Cancel",
  },
  success: {
    title: "Your Loan has been Canceled",
    subtitle:
      "You've successfully canceled your loan request. Your loan process has stopped.",
    continueCta: "Continue to Homepage",
  },
} as const;

export const LOAN_CANCELLATION_NOTICE_COPY = {
  title: "No longer need the loan?",
  message:
    "You can cancel it yourself after 24 hours directly from here — no support required.",
  linkLabel: "Click Here.",
  linkAccessibilityLabel: "Open loan cancellation",
} as const;

export const LOAN_CANCELLATION_HOME_ENTRY_COPY = {
  question: "Not interested in loan?",
  linkLabel: "Cancel loan",
  linkAccessibilityLabel: "Cancel loan",
} as const;
