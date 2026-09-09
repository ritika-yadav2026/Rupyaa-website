"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  CREDIT_SCORE_FAQS,
  IMPROVE_SCORE_PHASES,
  LOW_SCORE_REASONS,
  RBI_REPORTING_ROWS,
  SCORE_RANGE_ROWS,
} from "@/components/credit-score/credit-score-guide-data";

const RANGE_TONE_CLASS = {
  primary: "text-primary",
  amber: "text-amber-700",
  red: "text-red-700",
  muted: "text-gray-500",
} as const;

function Callout({
  variant,
  children,
}: {
  readonly variant: "info" | "warning";
  readonly children: ReactNode;
}) {
  let className: string;
  if (variant === "warning") {
    className =
      "rounded-r-[10px] border-l-[3px] border-red-700 bg-[#fdf3f2] px-5 py-4 text-[#7a1c16]";
  } else {
    className =
      "rounded-r-[10px] border-l-[3px] border-[#FECA42] bg-[#eef4ef] px-5 py-4 text-[#25332b]";
  }
  return <div className={className}>{children}</div>;
}

function ContentCard({ children }: { readonly children: ReactNode }) {
  return (
    <div className="rounded-[14px] border border-[#e6ece7] bg-white p-5 sm:p-6">
      {children}
    </div>
  );
}

const FAQ_BATCH_SIZE = 5;

/**
 * SEO guide content for the free credit score landing page — matches the
 * published ZapCash credit-score article layout below the check form.
 */
export default function CreditScoreGuide() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [visibleFaqCount, setVisibleFaqCount] = useState(FAQ_BATCH_SIZE);
  const visibleFaqs = CREDIT_SCORE_FAQS.slice(0, visibleFaqCount);
  const hasMoreFaqs = visibleFaqCount < CREDIT_SCORE_FAQS.length;
  const handleViewMoreFaqs = (): void => {
    setVisibleFaqCount((prev) =>
      Math.min(prev + FAQ_BATCH_SIZE, CREDIT_SCORE_FAQS.length)
    );
  };
  let viewMoreButton: ReactNode = null;
  if (hasMoreFaqs) {
    viewMoreButton = (
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={handleViewMoreFaqs}
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
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    );
  }
  return (
    <div className="mx-auto  px-1 pb-10 pt-10 sm:pt-14">
      <section id="what-is" className="mb-12 scroll-mt-24 sm:mb-14">
        <h2 className="mb-4 text-[26px] font-extrabold tracking-tight text-[#14202a] sm:text-[30px]">
          What is a credit score?
        </h2>
        <p className="mb-4 text-base leading-relaxed text-[#33423a] sm:text-[17px] sm:leading-[1.7]">
          A credit score is a three-digit number between 300 and 900 that summarises how you have
          handled borrowed money so far. It is calculated by a credit bureau — a company licensed
          by the Reserve Bank of India to collect and maintain credit records.
        </p>
        <p className="mb-4 text-base leading-relaxed text-[#33423a] sm:text-[17px] sm:leading-[1.7]">
          Every time you take a loan, use a credit card, pay an EMI, miss a payment, or close an
          account, your lender reports it to the bureau. The bureau turns that history into a score.
        </p>
        <p className="mb-5 text-base leading-relaxed text-[#33423a] sm:text-[17px] sm:leading-[1.7]">
          When you apply for a loan or a card, the lender pulls this score to judge one thing: how
          likely are you to repay on time. A higher score generally means faster decisions and
          better terms. A lower score means the lender looks harder at the rest of your profile.
        </p>
        <p className="mb-3 text-base leading-relaxed text-[#33423a] sm:text-[17px]">
          India has four RBI-licensed credit bureaus:
        </p>
        <ul className="mb-4 list-disc space-y-1 pl-5 text-base leading-relaxed text-[#33423a] sm:text-[17px]">
          <li>
            <strong>Equifax</strong>
          </li>
          <li>TransUnion CIBIL</li>
          <li>Experian</li>
          <li>CRIF High Mark</li>
        </ul>
        <p className="text-base leading-relaxed text-[#33423a] sm:text-[17px] sm:leading-[1.7]">
          The score shown on this page comes from <strong>Equifax</strong>. The next section
          explains why that matters and how it compares to the others.
        </p>
      </section>

      <section className="mb-12 sm:mb-14">
        <h2 className="mb-4 text-[26px] font-extrabold tracking-tight text-[#14202a] sm:text-[30px]">
          CIBIL score vs other credit scores: what&apos;s the difference?
        </h2>
        <p className="mb-4 text-base leading-relaxed text-[#33423a] sm:text-[17px] sm:leading-[1.7]">
          This is the most common point of confusion, so it is worth being precise.
        </p>
        <p className="mb-4 text-base leading-relaxed text-[#33423a] sm:text-[17px] sm:leading-[1.7]">
          &quot;CIBIL score&quot; is not a generic term for a credit score. It is the score produced
          specifically by <strong>TransUnion CIBIL</strong>. Equifax, Experian and CRIF High Mark
          each produce their own score under their own name.
        </p>
        <p className="mb-3 text-base leading-relaxed text-[#33423a] sm:text-[17px]">
          All four bureaus:
        </p>
        <ul className="mb-4 list-disc space-y-1 pl-5 text-base leading-relaxed text-[#33423a] sm:text-[17px]">
          <li>Use the same 300–900 range</li>
          <li>Receive data from the same lenders under the same RBI rules</li>
          <li>
            Weigh broadly similar factors — repayment history, credit utilisation, credit mix,
            account age, recent enquiries
          </li>
        </ul>
        <p className="mb-3 text-base leading-relaxed text-[#33423a] sm:text-[17px]">
          But they do <strong>not</strong> produce identical numbers. Differences appear because:
        </p>
        <ol className="mb-4 list-decimal space-y-1 pl-5 text-base leading-relaxed text-[#33423a] sm:text-[17px]">
          <li>Each bureau uses its own scoring model and internal weightings</li>
          <li>Not every lender reports to all four bureaus</li>
          <li>Data can land at different bureaus on slightly different dates</li>
        </ol>
        <p className="mb-4 text-base leading-relaxed text-[#33423a] sm:text-[17px] sm:leading-[1.7]">
          So a 30–50 point gap between your Equifax score and your CIBIL score is normal and does
          not mean either one is wrong.
        </p>
        <p className="mb-4 text-base leading-relaxed text-[#33423a] sm:text-[17px] sm:leading-[1.7]">
          <strong>Which one does your lender use?</strong> It depends on the lender. Some check one
          bureau, some check two or more. If you are preparing for a specific application, it is
          reasonable to ask the lender which bureau they pull.
        </p>
        <Callout variant="info">
          <p className="m-0 text-base leading-relaxed sm:text-[16px]">
            <strong>Practical takeaway:</strong> your Equifax score is a reliable read on your
            overall credit health. Use it to spot problems, track direction, and fix errors — all of
            which improve your standing with every bureau, because the underlying repayment
            behaviour is what all of them are measuring.
          </p>
        </Callout>
      </section>

      <section id="rbi" className="mb-12 scroll-mt-24 sm:mb-14">
        <h2 className="mb-4 text-[26px] font-extrabold tracking-tight text-[#14202a] sm:text-[30px]">
          New RBI rules: your credit report now updates four times a month
        </h2>
        <p className="mb-4 text-base leading-relaxed text-[#33423a] sm:text-[17px] sm:leading-[1.7]">
          This changed on <strong>1 July 2026</strong>, and most people have not caught up with it
          yet.
        </p>
        <p className="mb-5 text-base leading-relaxed text-[#33423a] sm:text-[17px] sm:leading-[1.7]">
          Under the RBI&apos;s amended Credit Information Reporting Directions, banks and NBFCs must
          now send credit data to bureaus <strong>four times every month</strong> instead of twice.
          The reference dates are fixed:
        </p>
        <div className="mb-5 overflow-x-auto">
          <table className="w-full min-w-[440px] border-collapse text-[15px]">
            <thead>
              <tr className="bg-[#FECA42] text-left text-white">
                <th className="rounded-tl-[10px] px-4 py-3 font-bold">Reference date</th>
                <th className="rounded-tr-[10px] px-4 py-3 font-bold">What gets reported</th>
              </tr>
            </thead>
            <tbody>
              {RBI_REPORTING_ROWS.map((row, index) => {
                let rowClass = "border-b border-[#e6ece7]";
                if (index % 2 === 1) {
                  rowClass = "border-b border-[#e6ece7] bg-[#f7faf7]";
                }
                if (index === RBI_REPORTING_ROWS.length - 1) {
                  rowClass = index % 2 === 1 ? "bg-[#f7faf7]" : "";
                }
                return (
                  <tr key={row.referenceDate} className={rowClass}>
                    <td className="px-4 py-3 text-[#33423a]">{row.referenceDate}</td>
                    <td className="px-4 py-3 text-[#33423a]">{row.whatGetsReported}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mb-4 text-base leading-relaxed text-[#33423a] sm:text-[17px] sm:leading-[1.7]">
          <strong>&quot;Incremental changes&quot;</strong> means new accounts opened, accounts
          closed, borrower-triggered changes such as repayments and foreclosures, and changes in how
          an account is classified.
        </p>
        <p className="mb-3 text-base leading-relaxed text-[#33423a] sm:text-[17px]">
          <strong>What this means in practice:</strong>
        </p>
        <ul className="mb-4 list-disc space-y-2.5 pl-5 text-base leading-relaxed text-[#33423a] sm:text-[17px]">
          <li>
            <strong>Good news travels faster.</strong> Pay off a credit card or close a loan, and it
            can show up on your report within days instead of weeks.
          </li>
          <li>
            <strong>So does bad news.</strong> A missed EMI now reaches the bureau on the next
            reference date. There is much less lag to absorb a slip.
          </li>
          <li>
            <strong>Timing an application actually matters now.</strong> If you clear a large card
            balance on the 10th, it will not appear until the 16th cycle. Applying on the 12th means
            the lender sees the old, higher utilisation. Waiting until after the 16th means they see
            the cleaner picture.
          </li>
          <li>
            <strong>First-time borrowers build a record faster.</strong> Your first few on-time EMIs
            register in weeks, not months.
          </li>
        </ul>
        <p className="text-[15px] italic leading-relaxed text-[#5c6f63]">
          <strong>Background:</strong> monthly reporting moved to fortnightly (15th and last day) on
          1 January 2025. The four-times-monthly rule was originally set for 1 April 2026, then
          deferred to 1 July 2026 after industry feedback.
        </p>
      </section>

      <section className="mb-12 sm:mb-14">
        <h2 className="mb-5 text-[26px] font-extrabold tracking-tight text-[#14202a] sm:text-[30px]">
          How to check your credit score
        </h2>
        <div className="mb-5 space-y-4">
          <ContentCard>
            <h3 className="mb-2 text-lg font-extrabold text-[#FECA42]">Option 1 — Free, on this page</h3>
            <p className="mb-3 text-base leading-relaxed text-[#33423a]">
              Enter your name as it appears on your PAN, your PAN number, date of birth, mobile
              number and email. Tick the authorisation box. You will get your score and full report
              in under a minute.
            </p>
            <p className="m-0 text-base leading-relaxed text-[#33423a]">
              This is a <strong>soft enquiry</strong>. It is recorded on your report as a
              consumer-initiated check and does <strong>not</strong> reduce your score, no matter how
              often you do it.
            </p>
          </ContentCard>
          <ContentCard>
            <h3 className="mb-2 text-lg font-extrabold text-[#FECA42]">
              Option 2 — Directly from a bureau
            </h3>
            <p className="m-0 text-base leading-relaxed text-[#33423a]">
              Every RBI-licensed bureau is required to give you one free full credit report per
              calendar year. Go to the bureau&apos;s own website, complete their identity
              verification, and download it. Useful if you want the complete lender-grade file, or if
              you are checking a bureau other than Equifax.
            </p>
          </ContentCard>
          <ContentCard>
            <h3 className="mb-2 text-lg font-extrabold text-[#FECA42]">
              Option 3 — Your bank or card app
            </h3>
            <p className="m-0 text-base leading-relaxed text-[#33423a]">
              Many banks and card issuers show a score inside their app. Convenient for casual
              tracking, though you may not get the full report.
            </p>
          </ContentCard>
        </div>
        <Callout variant="warning">
          <p className="m-0 text-base leading-relaxed">
            <strong>Never</strong> enter net banking credentials, card PINs, CVV or OTPs on any site
            claiming to show you a credit score. No legitimate score check requires them.
          </p>
        </Callout>
      </section>

      <section id="ranges" className="mb-12 scroll-mt-24 sm:mb-14">
        <h2 className="mb-5 text-[26px] font-extrabold tracking-tight text-[#14202a] sm:text-[30px]">
          Credit score ranges: what your number actually means
        </h2>
        <div className="mb-5 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-[15px]">
            <thead>
              <tr className="bg-[#FECA42] text-left text-white">
                <th className="rounded-tl-[10px] px-4 py-3 font-bold">Range</th>
                <th className="px-4 py-3 font-bold">Band</th>
                <th className="rounded-tr-[10px] px-4 py-3 font-bold">
                  What it typically signals to a lender
                </th>
              </tr>
            </thead>
            <tbody>
              {SCORE_RANGE_ROWS.map((row, index) => {
                let rowClass = "border-b border-[#e6ece7]";
                if (index % 2 === 1) {
                  rowClass = "border-b border-[#e6ece7] bg-[#f7faf7]";
                }
                if (index === SCORE_RANGE_ROWS.length - 1) {
                  rowClass = index % 2 === 1 ? "bg-[#f7faf7]" : "";
                }
                return (
                  <tr key={row.range} className={rowClass}>
                    <td
                      className={`px-4 py-3 font-bold ${RANGE_TONE_CLASS[row.tone]}`}
                    >
                      {row.range}
                    </td>
                    <td className="px-4 py-3 text-[#33423a]">{row.band}</td>
                    <td className="px-4 py-3 text-[#33423a]">{row.signal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Callout variant="info">
          <p className="m-0 text-base leading-relaxed">
            <strong>Important:</strong> no score guarantees approval. Every lender applies its own
            policy on income, employment type, existing obligations, location and internal risk
            rules. A high score improves your odds; it does not decide the outcome.
          </p>
        </Callout>
      </section>

      <section className="mb-12 sm:mb-14">
        <h2 className="mb-4 text-[26px] font-extrabold tracking-tight text-[#14202a] sm:text-[30px]">
          What credit score do you need for a personal loan?
        </h2>
        <p className="mb-4 text-base leading-relaxed text-[#33423a] sm:text-[17px] sm:leading-[1.7]">
          There is no single industry-wide cutoff. Different lenders set different floors, and the
          same lender may apply different floors to different products.
        </p>
        <p className="mb-3 text-base leading-relaxed text-[#33423a] sm:text-[17px]">
          As a general picture in the Indian market:
        </p>
        <ul className="mb-4 list-disc space-y-1 pl-5 text-base leading-relaxed text-[#33423a] sm:text-[17px]">
          <li>
            <strong>750+</strong> — you meet the comfort threshold at most lenders
          </li>
          <li>
            <strong>700–749</strong> — widely considered, with normal underwriting
          </li>
          <li>
            <strong>650–699</strong> — considered by many NBFCs and digital lenders, with more
            weight on income and repayment capacity
          </li>
          <li>
            <strong>Below 650</strong> — options exist but are limited, and other parts of your
            profile carry more weight
          </li>
        </ul>
        <p className="mb-4 text-base leading-relaxed text-[#33423a] sm:text-[17px] sm:leading-[1.7]">
          Score is one input among several. Lenders also assess monthly income, employment type, how
          long you have been employed, your existing EMI load relative to income, and the quality of
          your bank statement.
        </p>
        <p className="mb-2 text-base leading-relaxed text-[#33423a] sm:text-[17px]">
          If your score is in the lower bands, this guide walks through what is realistically
          available:{" "}
          <Link
            href="/blog/low-cibil-personal-loan"
            className="font-bold text-primary hover:underline"
          >
            Personal Loan Options With a Low CIBIL Score
          </Link>
        </p>
        <p className="text-base leading-relaxed text-[#5c6f63]">
          See also:{" "}
          <Link
            href="/blog/instant-personal-loan-india-kyc-disbursal-repayment"
            className="font-semibold text-primary hover:underline"
          >
            Instant Personal Loan guide
          </Link>
        </p>
      </section>

      <section className="mb-12 sm:mb-14">
        <h2 className="mb-5 text-[26px] font-extrabold tracking-tight text-[#14202a] sm:text-[30px]">
          Six common reasons your score is lower than you expected
        </h2>
        <div className="space-y-3.5">
          {LOW_SCORE_REASONS.map((reason, index) => (
            <div key={reason.title} className="flex gap-4">
              <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg bg-[#eef4ef] text-[15px] font-extrabold text-primary">
                {index + 1}
              </span>
              <p className="mt-0.5 text-base leading-relaxed text-[#33423a]">
                <strong>{reason.title}</strong> {reason.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="improve" className="mb-12 scroll-mt-24 sm:mb-14">
        <h2 className="mb-5 text-[26px] font-extrabold tracking-tight text-[#14202a] sm:text-[30px]">
          How to improve your credit score
        </h2>
        <div className="space-y-4">
          {IMPROVE_SCORE_PHASES.map((phase) => (
            <ContentCard key={phase.title}>
              <h3 className="mb-3 text-[17px] font-extrabold text-[#FECA42]">{phase.title}</h3>
              <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-[#33423a]">
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ContentCard>
          ))}
        </div>
        <p className="mt-4 text-base italic leading-relaxed text-[#5c6f63]">
          There is no legitimate way to erase accurate negative information, and no one can do it
          for you. Any service promising to delete a genuine default is not a service you want.
        </p>
      </section>

      <section className="mb-12 sm:mb-14">
        <h2 className="mb-4 text-[26px] font-extrabold tracking-tight text-[#14202a] sm:text-[30px]">
          Does checking your credit score lower it?
        </h2>
        <p className="mb-5 text-base leading-relaxed text-[#33423a] sm:text-[17px] sm:leading-[1.7]">
          No — not when you check it yourself. There are two kinds of enquiry:
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-[14px] bg-[#eef4ef] p-5 sm:p-6">
            <h3 className="mb-2 text-[17px] font-extrabold text-[#FECA42]">Soft enquiry</h3>
            <p className="m-0 text-[15px] leading-relaxed text-[#33423a]">
              You check your own score, or a lender runs a pre-approval check in the background.
              Visible only to you. <strong>No effect on your score.</strong> Checking on this page is
              a soft enquiry.
            </p>
          </div>
          <div className="rounded-[14px] bg-[#f6f2ec] p-5 sm:p-6">
            <h3 className="mb-2 text-[17px] font-extrabold text-amber-700">Hard enquiry</h3>
            <p className="m-0 text-[15px] leading-relaxed text-[#33423a]">
              You formally apply for a loan or card and the lender pulls your report to decide.
              Visible to other lenders and recorded on your report. A single one has a small,
              temporary effect. Several in a short window can weigh more.
            </p>
          </div>
        </div>
        <p className="mt-4 text-base leading-relaxed text-[#33423a] sm:text-[17px] sm:leading-[1.7]">
          So checking your own score monthly is a good habit with no downside. Applying to six
          lenders in one week is not.
        </p>
      </section>

      <section className="mb-5">
        <h2 className="mb-5 text-[26px] font-extrabold tracking-tight text-[#14202a] sm:text-[30px]">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {visibleFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            let sign: string;
            if (isOpen) {
              sign = "–";
            } else {
              sign = "+";
            }
            let answer: ReactNode = null;
            if (isOpen) {
              answer = (
                <p className="m-0 px-5 pb-5 text-base leading-relaxed text-[#33423a] sm:px-6 sm:pb-6">
                  {faq.answer}
                </p>
              );
            }
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-[14px] border border-[#e6ece7] bg-white"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (isOpen) {
                      setOpenFaqIndex(null);
                    } else {
                      setOpenFaqIndex(index);
                    }
                  }}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-[#14202a] sm:text-[17px]">
                    {faq.question}
                  </span>
                  <span className="shrink-0 text-[22px] font-normal leading-none text-primary">
                    {sign}
                  </span>
                </button>
                {answer}
              </div>
            );
          })}
        </div>
        {viewMoreButton}
      </section>
    </div>
  );
}
