"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/home/Footer";
import { appShellContainerClassName } from "@/lib/app-shell-layout";

function FileIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-primary sm:w-8 sm:h-8"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function TermsContent() {
  const searchParams = useSearchParams();
  const isMobileSource = searchParams.get("source") === "mobile";

  return (
    <div className="min-h-screen bg-gray-50">
      {!isMobileSource && <AppHeader />}
      <main className={`overflow-x-hidden ${isMobileSource ? "" : "pt-16"}`}>
        <div className={`${appShellContainerClassName} py-5 sm:py-12`}>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 px-4 sm:px-10 py-6 sm:py-10 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    TERMS AND CONDITIONS
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                    Effective Date: February 25, 2026
                  </p>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-10 py-5 sm:py-10">
              <div className="prose prose-gray max-w-none text-sm sm:text-base text-gray-700 leading-relaxed sm:leading-loose space-y-5 sm:space-y-6 hyphens-auto break-words">
                <p>
                  Welcome to ZapCash. These Terms and Conditions
                  (&quot;Terms&quot;) govern your access to and use of the
                  ZapCash mobile application, website, and related services
                  (collectively, the &quot;Platform&quot; or
                  &quot;Services&quot;). By accessing or using the Platform, you
                  agree to be bound by these Terms. If you do not agree, please
                  refrain from using the Services.
                </p>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      1
                    </span>
                    Definitions
                  </h2>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      <strong className="text-gray-800">
                        “ZapCash” / “Company”
                      </strong>{" "}
                      refers to ZapCash, a technology platform facilitating loan
                      services.
                    </li>
                    <li>
                      <strong className="text-gray-800">“User” / “You”</strong>{" "}
                      refers to any individual accessing or using the Platform.
                    </li>
                    <li>
                      <strong className="text-gray-800">
                        “Lending Partner”
                      </strong>{" "}
                      refers to RBI-registered NBFCs or banks providing loans.
                    </li>
                    <li>
                      <strong className="text-gray-800">“Loan”</strong> refers
                      to any credit facility provided by Lending Partners
                      through the Platform.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      2
                    </span>
                    Eligibility
                  </h2>
                  <p className="mb-4">To use ZapCash Services, you must:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>Be at least 18 years of age.</li>
                    <li>Be a resident of India.</li>
                    <li>
                      Possess valid KYC documents (such as Aadhaar and PAN).
                    </li>
                    <li>Maintain an active bank account in your name.</li>
                    <li>
                      Be legally capable of entering into a binding contract
                      under applicable laws.
                    </li>
                  </ul>
                  <p className="mb-0">
                    ZapCash reserves the right to deny access if eligibility
                    criteria are not met.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      3
                    </span>
                    Nature of Services
                  </h2>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      ZapCash operates as a technology platform that connects
                      Users with Lending Partners.
                    </li>
                    <li>
                      ZapCash does not act as a lender and does not provide
                      loans directly.
                    </li>
                    <li>
                      All loan approvals, terms, disbursements, and collections
                      are solely determined by the respective Lending Partner.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      4
                    </span>
                    Loan Terms
                  </h2>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                    4.1 Loan Approval
                  </h3>
                  <p className="mb-4">
                    Loan approval is subject to the Lending Partner’s internal
                    credit policies. ZapCash does not guarantee approval.
                  </p>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                    4.2 Interest &amp; Charges
                  </h3>
                  <p className="mb-4">
                    All interest rates, processing fees, penalties, and other
                    charges are determined by the Lending Partner and disclosed
                    in the Key Fact Statement (KFS) prior to acceptance.
                  </p>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                    4.3 Disbursement
                  </h3>
                  <p className="mb-4">
                    Loan amounts are typically disbursed within 2–24 hours,
                    subject to successful KYC verification and agreement
                    execution.
                  </p>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                    4.4 Repayment
                  </h3>
                  <p className="mb-0">
                    You agree to repay the loan as per the agreed EMI schedule.
                    Delays may result in penalties and adverse credit reporting.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      5
                    </span>
                    Cooling-Off Period
                  </h2>
                  <p className="mb-0">
                    In compliance with applicable guidelines, you may exit the
                    loan within the cooling-off period specified in the KFS by
                    repaying the principal and proportionate charges without
                    penalty.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      6
                    </span>
                    Prepayment and Foreclosure
                  </h2>
                  <p className="mb-0">
                    You may prepay or foreclose your loan subject to the terms
                    specified by the Lending Partner, including applicable
                    charges, if any.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      7
                    </span>
                    Credit Bureau Reporting
                  </h2>
                  <p className="mb-0">
                    You acknowledge and give your explicit consent that your
                    loan details, repayment history, and defaults may be
                    reported to Credit Information Companies, including but not
                    limited to TransUnion CIBIL, Experian, Equifax, and CRIF
                    High Mark.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      8
                    </span>
                    User Obligations
                  </h2>
                  <p className="mb-4">You agree to:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>Provide accurate and complete information.</li>
                    <li>Maintain confidentiality of login credentials.</li>
                    <li>Use the Platform only for lawful purposes.</li>
                    <li>
                      Not engage in fraud, misrepresentation, or identity theft.
                    </li>
                    <li>
                      Not attempt to hack, reverse-engineer, or disrupt the
                      Platform.
                    </li>
                    <li>
                      Comply with all applicable laws, including RBI guidelines.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      9
                    </span>
                    Data Privacy and Consent
                  </h2>
                  <p className="mb-4">
                    By using the Platform, you consent to the collection,
                    storage, and processing of your personal and financial data,
                    including:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>KYC details</li>
                    <li>Bank account information</li>
                  </ul>
                  <p className="mb-4">Such data may be shared with:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>Lending Partners</li>
                    <li>Credit bureaus</li>
                    <li>Service providers</li>
                  </ul>
                  <p className="mb-0">
                    in accordance with applicable laws, including the Digital
                    Personal Data Protection Act, 2023.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      10
                    </span>
                    Device Permissions
                  </h2>
                  <p className="mb-4">
                    The Platform may request access to certain device features
                    such as location, SMS, or contacts strictly for:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>Credit assessment</li>
                    <li>Fraud detection</li>
                    <li>Regulatory compliance</li>
                  </ul>
                  <p className="mb-0">
                    Such access is subject to your explicit consent.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      11
                    </span>
                    Communication Consent
                  </h2>
                  <p className="mb-4">
                    You authorize ZapCash and its partners to contact you via:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>Calls</li>
                    <li>SMS</li>
                    <li>Email</li>
                    <li>WhatsApp</li>
                  </ul>
                  <p className="mb-0">
                    for purposes including loan processing, repayment reminders,
                    and service updates.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      12
                    </span>
                    Default and Recovery
                  </h2>
                  <p className="mb-4">In case of default:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>Late payment charges may apply.</li>
                    <li>
                      The Lending Partner may initiate recovery actions in
                      accordance with applicable laws and RBI guidelines.
                    </li>
                    <li>
                      Recovery practices shall not involve harassment, coercion,
                      or unlawful methods.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      13
                    </span>
                    Refund and Cancellation
                  </h2>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Processing fees and charges are generally non-refundable
                      unless stated otherwise.
                    </li>
                    <li>
                      Loan cancellation terms shall be governed by the Lending
                      Partner’s policies.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      14
                    </span>
                    Intellectual Property
                  </h2>
                  <p className="mb-0">
                    All content, trademarks, logos, and software on the Platform
                    are the property of ZapCash or its licensors. Unauthorized
                    use, reproduction, or distribution is strictly prohibited.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      15
                    </span>
                    Third-Party Disclaimer
                  </h2>
                  <p className="mb-4">ZapCash is not responsible for:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>Decisions made by Lending Partners.</li>
                    <li>Services provided by third-party vendors.</li>
                    <li>Payment gateway failures or delays.</li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      16
                    </span>
                    Limitation of Liability
                  </h2>
                  <p className="mb-4">
                    To the fullest extent permitted by law, ZapCash shall not be
                    liable for:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>Indirect or consequential damages.</li>
                    <li>Loss of data, profits, or reputation.</li>
                    <li>Service interruptions or technical errors.</li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      17
                    </span>
                    Suspension and Termination
                  </h2>
                  <p className="mb-4">
                    ZapCash reserves the right to suspend or terminate your
                    account without notice in case of:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>Fraud or misrepresentation.</li>
                    <li>Violation of these Terms.</li>
                    <li>Legal or regulatory requirements.</li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      18
                    </span>
                    Force Majeure
                  </h2>
                  <p className="mb-0">
                    ZapCash shall not be liable for failure or delay caused by
                    events beyond its control, including natural disasters,
                    technical failures, or government actions.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      19
                    </span>
                    Dispute Resolution
                  </h2>
                  <p className="mb-4">
                    These Terms shall be governed by the laws of India.
                  </p>
                  <p className="mb-4">
                    Courts located in Jaipur, Rajasthan shall have exclusive
                    jurisdiction.
                  </p>
                  <p className="mb-0">
                    Loan-related grievances may be escalated to the respective
                    Lending Partner or the RBI Ombudsman.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      20
                    </span>
                    Grievance Redressal
                  </h2>
                  <p className="mb-4">For complaints or concerns:</p>
                  <div className="rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100 p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                    <p className="text-sm sm:text-base">
                      <strong className="text-gray-800">Email:</strong>{" "}
                      <a
                        href="mailto:grievance@zapcash.in"
                        className="break-all"
                      >
                        grievance@zapcash.in
                      </a>
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong className="text-gray-800">Support:</strong>{" "}
                      Available via app/website
                    </p>
                    <p className="text-sm sm:text-base">
                      All grievances will be addressed within 30 days.
                    </p>
                  </div>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      21
                    </span>
                    Changes to Terms
                  </h2>
                  <p className="mb-0">
                    ZapCash reserves the right to modify these Terms at any
                    time. Updated Terms will be posted on the Platform.
                    Continued use constitutes acceptance of the revised Terms.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      22
                    </span>
                    Acknowledgement
                  </h2>
                  <p className="mb-0">
                    By using the Platform, you confirm that you have read,
                    understood, and agreed to these Terms, including the Key
                    Fact Statement provided before loan acceptance.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      {!isMobileSource && <Footer />}
    </div>
  );
}

export default function TermsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <AppHeader />
          <main className="overflow-x-hidden animate-pulse">
            <div className={`${appShellContainerClassName} py-5 sm:py-12`}>
              <div className="h-96 bg-gray-200 rounded-xl" />
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <TermsContent />
    </Suspense>
  );
}
