export const NON_SALARY_MODAL_COPY = {
  title: "Non-Salary Account Detected",
  bodyPrefix: "You have shared non-salary account details. This will lead to ",
  bodyEmphasis: "Manual Review",
  bodySuffix: " and delay in disbursal",
  recommendationTitle: "Our Recommendation",
  manualReviewTitle: "Manual Review, takes 3-5 days",
  manualReviewBody:
    "Using a salary account helps us process your request faster.",
  whyUseSalaryHeader: "Why use a salary Account?",
  whyUseSalaryBenefits: [
    { title: "Faster Processing", subtext: "Auto-verified" },
    { title: "Higher Success", subtext: "Lower rejections" },
    { title: "Secure & Trusted", subtext: "Encrypted data" },
  ] as const,
  changeAccountCta: "Change Account",
  continueCta: "Continue",
} as const;

export const RECOMMENDATION_FALLBACK_BODY = "Higher Eligibility and faster processing.";
