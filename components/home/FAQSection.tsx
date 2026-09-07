"use client";

import { useState, type ReactNode } from "react";
import {
  appShellContainerClassName,
  homeSectionSpacingClassName,
} from "@/lib/app-shell-layout";

type FAQItem = {
  question: string;
  answer?: string;
  listHeading?: string;
  bulletPoints?: readonly string[];
  footer?: string;
};

const FAQ_ITEMS: readonly FAQItem[] = [
  {
    question: "Can you share a representative example of the loan cost?",
    bulletPoints: [
      "Loan sanctioned by Weekline Investment and Trading Company Ltd: ₹1,50,000 for 3 years",
      "Processing Fee: ₹6,195 (3.5% + GST + ₹500 Stamp Duty)",
      "Interest Rate: 22% p.a. (on reducing principal balance)",
      "EMI: ₹5,730 per month",
      "Total Payable: ₹2,06,280",
      "Total Interest Paid: ₹56,280",
      "Annual Percentage Rate (APR): 25.14%",
    ],
    footer:
      "This is an illustrative example. Actual terms may vary based on eligibility and will be disclosed in the Key Fact Statement before loan acceptance.",
  },
  {
    question: "Who is eligible to apply for a ZapCash personal loan?",
    bulletPoints: [
      "Age: Minimum 21 years",
      "Employment Type: Salaried or Self-Employed",
      "Minimum Monthly Income: ₹16,000 or above",
      "Mobile Number: Aadhaar-linked mobile number for verification",
      "Citizenship: Indian resident with valid KYC documents",
    ],
  },
  {
    question: "Do I need to arrange a collateral for this loan?",
    answer:
      "No, this is an unsecured loan, and therefore, no collateral or security is required to avail of the loan. The loan is sanctioned based on the borrower's eligibility, creditworthiness, and repayment capacity. However, in the case of secured loan products such as a loan against property, appropriate collateral will be required.",
  },
  {
    question: "What is the interest rate and processing fee?",
    answer:
      "Interest starts from 3% per month. A one-time processing fee of up to 10% + GST is charged when the loan is approved.",
  },

  {
    question: "What is the Key Fact Statement (KFS) and when is it provided?",
    answer:
      "The Key Fact Statement (KFS) is a document that summarizes the important terms of your loan, including interest rate, charges, and repayment details. It is provided to the borrower before the execution of the loan agreement to ensure full transparency.",
  },
  {
    question: "How is borrower consent obtained for the loan?",
    answer:
      "Borrower consent is obtained digitally through secure electronic means, ensuring that the borrower has reviewed and agreed to the loan terms before proceeding.",
  },
  {
    question: "What documents will I receive after taking a loan?",
    answer:
      "After the loan is processed, the borrower will receive the following documents: a) Loan Agreement b) Key Fact Statement (KFS) c) Repayment Schedule",
  },
  {
    question: "Can I prepay or foreclose my loan?",
    answer:
      "Yes, you may prepay or foreclose your loan, subject to the terms mentioned in the loan agreement and KFS. Any applicable charges will be clearly specified.",
  },
  {
    question: "What happens if I miss an EMI payment?",
    answer:
      "In case of non-payment by the due date, late payment charges may be applied, and the loan account may be reported as overdue to credit bureaus, which could impact your credit score.",
  },
  {
    question: "Will my loan details be shared with credit bureaus?",
    answer:
      "Yes, your loan details, including repayment history, may be reported to credit information companies in accordance with regulations.",
  },
  {
    question: "How will I receive my loan documents?",
    answer:
      "All loan-related documents, including the loan agreement, KFS, and repayment schedule, will be provided digitally via email or through the lending platform.",
  },
  {
    question: "Is my personal information Secure and how is it used?",
    answer:
      "Your personal information is handled in accordance with applicable data protection laws and is used only for loan processing, servicing, and regulatory compliance, as detailed in the Privacy Policy.",
  },
  {
    question: "Who can I contact for grievances or support?",
    answer:
      "You can reach out to the customer support or grievance redressal officer through the contact details provided on the website/app or in the loan documents.",
  },
  {
    question: "How can I avail a business loan from you?",
    answer:
      "You can select and apply for a suitable loan for your business needs through our website or you can submit your contact details with requirement and our team will contact you.",
  },
  {
    question: "Where can I use this loan?",
    answer:
      "The loan must be utilized strictly for the purpose for which it has been sanctioned. For example, a business loan should be used only for business-related activities. In the case of a personal loan, the borrower may use the funds for any legitimate purpose. However, under no circumstances shall the loan be used for any unlawful activities, including fraud or activities related to terrorism, in compliance with applicable KYC/AML guidelines and the provisions of the Prevention of Money Laundering Act (PMLA).",
  },
  {
    question: "What documents are needed to apply?",
    answer:
      "To apply for the loan, you will typically be required to submit basic documents such as valid identity proof, address proof, PAN, and income-related documents or bank statements, as applicable. Additional documents may be requested based on the type of loan and internal policies.",
  },
] as const;

const INITIAL_VISIBLE = 5;
const STEP = 5;
const BATCH_SIZE = 5;
const BATCH_COUNT = Math.ceil(FAQ_ITEMS.length / BATCH_SIZE);

function getOrderedItems(startBatch: number): FAQItem[] {
  const normalized = ((startBatch % BATCH_COUNT) + BATCH_COUNT) % BATCH_COUNT;
  const ordered: FAQItem[] = [];
  for (let i = 0; i < BATCH_COUNT; i++) {
    const batchIndex = (normalized + i) % BATCH_COUNT;
    const start = batchIndex * BATCH_SIZE;
    ordered.push(...FAQ_ITEMS.slice(start, start + BATCH_SIZE));
  }
  return ordered;
}

function renderFaqAnswerContent(item: FAQItem): ReactNode {
  const { answer, listHeading, bulletPoints, footer } = item;
  const sections: ReactNode[] = [];
  if (answer) {
    sections.push(
      <p key="answer" className="text-gray-600 text-base leading-relaxed">
        {answer}
      </p>,
    );
  }
  if (bulletPoints && bulletPoints.length > 0) {
    let heading: ReactNode = null;
    if (listHeading) {
      heading = (
        <p className="text-gray-900 text-base font-semibold leading-relaxed">
          {listHeading}
        </p>
      );
    }
    sections.push(
      <div key="bullets">
        {heading}
        <ul className="mt-2 list-disc space-y-2 pl-5 text-gray-600 text-base leading-relaxed">
          {bulletPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>,
    );
  }
  if (footer) {
    sections.push(
      <p key="footer" className="text-gray-600 text-base leading-relaxed">
        {footer}
      </p>,
    );
  }
  if (sections.length === 0) return null;
  return sections;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

type FAQSectionProps = {
  startBatch?: number;
};

export default function FAQSection({ startBatch = 0 }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const orderedItems = getOrderedItems(startBatch);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP, orderedItems.length));
  };

  const visibleItems = orderedItems.slice(0, visibleCount);
  const hasMore = visibleCount < orderedItems.length;

  return (
    <section id="faq" className="bg-white">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName}`}>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 text-center mb-10 sm:mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {visibleItems.map((item, index) => {
            const { question } = item;
            const isOpen = openIndex === index;
            const answerContent = renderFaqAnswerContent(item);
            return (
              <div
                key={question}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 text-left hover:bg-gray-50/50 transition-colors"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className="font-bold text-gray-900 text-sm sm:text-base md:text-lg pr-4">
                    {question}
                  </span>
                  <span className="flex-shrink-0 text-gray-600">
                    <ChevronIcon open={isOpen} />
                  </span>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 space-y-3">
                    {answerContent}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleViewMore}
              className="inline-flex items-center gap-2 rounded-full border border-primary/60 bg-white px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              View More
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
