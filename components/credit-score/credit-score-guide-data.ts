export interface CreditScoreFaqItem {
  readonly question: string;
  readonly answer: string;
}

export const CREDIT_SCORE_FAQS: readonly CreditScoreFaqItem[] = [
  {
    question: "Is checking my credit score on ZapCash really free?",
    answer:
      "Yes. There is no charge and no card required. You get your Equifax score and full report at no cost.",
  },
  {
    question: "Will checking my score here affect it?",
    answer:
      "No. This is a soft enquiry — a consumer-initiated check that is not visible to lenders and has no effect on your score.",
  },
  {
    question: "Why is the score here different from my CIBIL score?",
    answer:
      "This page shows your Equifax score. Different bureaus use different scoring models, and not every lender reports to every bureau. A gap of 30–50 points is normal and does not mean either score is inaccurate.",
  },
  {
    question: "How often does my credit score update?",
    answer:
      "Since 1 July 2026, lenders report to bureaus four times a month — on the 9th, 16th, 23rd and the last day, with a full file submission by the 5th of the following month. So your report can change roughly weekly.",
  },
  {
    question: "How long after paying an EMI will my score update?",
    answer:
      "Until the next reporting reference date. If you pay on the 10th, it will typically be reported in the 16th cycle and appear on your report shortly after.",
  },
  {
    question: "What is a good credit score in India?",
    answer:
      "750 and above is generally treated as strong. 700–749 is good. Below 650, lenders scrutinise the rest of your profile more closely.",
  },
  {
    question: "Can I check my credit score with only an Aadhaar card?",
    answer:
      "No. A PAN is required. Bureaus use PAN as the primary identifier for consumer credit records.",
  },
  {
    question: "What does NA or NH mean on my report?",
    answer:
      "It means there is no credit history to score — either you have never borrowed, or there has been no reportable activity in the last 24 months. It is not a negative mark, just an absence of data.",
  },
  {
    question: "How do I fix a mistake on my credit report?",
    answer:
      "Raise a dispute with the bureau that issued the report. They are required to investigate with the lender that submitted the data and correct anything found to be wrong.",
  },
  {
    question: "What documents do I need to check my score here?",
    answer:
      "None to upload. You only need your PAN number, date of birth, an active mobile number and an email address.",
  },
  {
    question: "Does checking your credit score lower it?",
    answer:
      "No — not when you check it yourself. Checking on this page is a soft enquiry. Soft enquiries are visible only to you and have no effect on your score. Hard enquiries happen when you formally apply for a loan or card.",
  },
  {
    question: "What credit score do you need for a personal loan?",
    answer:
      "There is no single industry-wide cutoff. As a general picture, 750+ meets the comfort threshold at most lenders, 700–749 is widely considered, 650–699 is considered by many NBFCs with more weight on income, and below 650 options are more limited.",
  },
  {
    question: "How can I improve my credit score?",
    answer:
      "Start by pulling your full report and disputing errors, then pay every EMI and card due on time, keep card utilisation below 30%, and avoid new credit applications while you rebuild. Under the four-times-monthly reporting cycle, improvements can surface faster than before.",
  },
  {
    question: "Which bureau score does ZapCash show?",
    answer:
      "This page shows your Equifax score. India has four RBI-licensed bureaus — Equifax, TransUnion CIBIL, Experian and CRIF High Mark — and each produces its own score under its own model.",
  },
  {
    question: "What should I never share when checking my score?",
    answer:
      "Never enter net banking credentials, card PINs, CVV or OTPs on any site claiming to show you a credit score. No legitimate score check requires them.",
  },
] as const;

export const RBI_REPORTING_ROWS = [
  { referenceDate: "9th of the month", whatGetsReported: "Incremental changes" },
  { referenceDate: "16th of the month", whatGetsReported: "Incremental changes" },
  { referenceDate: "23rd of the month", whatGetsReported: "Incremental changes" },
  { referenceDate: "Last day of the month", whatGetsReported: "Incremental changes" },
  {
    referenceDate: "By the 5th of the next month",
    whatGetsReported: "Full file submission",
  },
] as const;

export const SCORE_RANGE_ROWS = [
  {
    range: "750–900",
    band: "Excellent",
    signal: "Strong repayment record. Applications usually move quickly.",
    tone: "primary" as const,
  },
  {
    range: "700–749",
    band: "Good",
    signal: "Solid profile. Most lenders will consider you on standard terms.",
    tone: "primary" as const,
  },
  {
    range: "650–699",
    band: "Fair",
    signal:
      "Approvable, but lenders will look closely at income, existing EMIs and stability.",
    tone: "amber" as const,
  },
  {
    range: "550–649",
    band: "Poor",
    signal: "Past stress on the report. Options narrow; expect more documentation.",
    tone: "red" as const,
  },
  {
    range: "300–549",
    band: "Very poor",
    signal:
      "Serious delinquencies or defaults. Rebuilding is the priority before applying.",
    tone: "red" as const,
  },
  {
    range: "NA / NH",
    band: "No history",
    signal:
      "You have never borrowed, or have no activity in the last 24 months. Not a bad score — just no data.",
    tone: "muted" as const,
  },
] as const;

export const LOW_SCORE_REASONS = [
  {
    title: "Late or missed payments.",
    body: "The single heaviest factor. Even a few days past due gets reported.",
  },
  {
    title: "High credit utilisation.",
    body: "Using most of your available card limit signals dependence on credit, even when you pay in full every month. Utilisation is measured on the reporting date, not on your billing date.",
  },
  {
    title: "Too many recent applications.",
    body: "Each formal application creates a hard enquiry. Several in a short window reads as credit hunger.",
  },
  {
    title: "A thin or short file.",
    body: "Not enough history for the model to assess you confidently. This is not a penalty — it is missing data.",
  },
  {
    title: "Errors in your report.",
    body: "Accounts you never opened, loans shown as open after you closed them, wrong amounts. More common than people assume.",
  },
  {
    title: "Closing old accounts.",
    body: "Your oldest account anchors your credit age. Closing it can shorten your average history.",
  },
] as const;

export const IMPROVE_SCORE_PHASES = [
  {
    title: "First 30 days",
    items: [
      "Pull your full report and read every line. Dispute anything incorrect directly with the bureau — they are required to investigate.",
      "Set auto-debit or calendar reminders on every EMI and card due date.",
      "Bring card balances below 30% of your limit before the next reporting date.",
    ],
  },
  {
    title: "30–90 days",
    items: [
      "Pay on time, every time. Consistency is what the model rewards.",
      "Stop applying for new credit while you are rebuilding.",
      "If you have several small dues, clear the ones already showing as overdue first.",
    ],
  },
  {
    title: "90–180 days",
    items: [
      "Keep utilisation low as a habit, not a one-time fix.",
      "Keep your oldest account open and lightly active.",
      "Re-check your score. Under the new four-times-monthly reporting cycle, changes surface much faster than they used to.",
    ],
  },
] as const;
