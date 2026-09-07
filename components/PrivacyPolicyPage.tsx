"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/home/Footer";
import { appShellContainerClassName } from "@/lib/app-shell-layout";

function ShieldIcon() {
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
      <path d="M12 22s8-4 8-10V5l-8-2-8 2v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function PrivacyPolicyContent() {
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
                  <ShieldIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    Zapcash Personal Loan Privacy Policy
                  </h1>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-10 py-5 sm:py-10">
              <div className="prose prose-gray max-w-none text-sm sm:text-base text-gray-700 leading-relaxed sm:leading-loose space-y-5 sm:space-y-6 hyphens-auto break-words">
                <p>
                  Zapcash Personal Loan (&quot;Zapcash,&quot; &quot;We,&quot;
                  &quot;Us,&quot; or &quot;Our&quot;) is committed to protecting
                  your privacy and ensuring the security of your personal
                  information. This Privacy Policy explains how we collect, use,
                  disclose, and safeguard your information when you use our
                  mobile application (the &quot;App&quot;), website (the
                  &quot;Site&quot;), and related services for personal loans and
                  financial products (collectively, the &quot;Services&quot;).
                  By accessing or using the App, Site, or Services, you consent
                  to the practices described in this Privacy Policy.
                </p>
                <p>
                  Zapcash is operated by Omnistack Innovation Private Limited,
                  and all services offered under the Zapcash brand are provided
                  by Omnistack Innovation Private Limited or its authorized
                  service partners, as applicable.
                </p>
                <p>
                  This policy complies with applicable laws, including the
                  Information Technology Act, 2000, the Digital Personal Data
                  Protection Act, 2023, Digital Personal Data Protection Rules,
                  2025 and guidelines from the Reserve Bank of India on digital
                  lending.
                </p>
                <p>
                  Zapcash is a digital lending platform that facilitates
                  personal loan services in partnership with RBI-registered
                  Non-Banking Financial Companies (
                  <a
                    href="https://www.weekline.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium hover:underline"
                  >
                    NBFCs
                  </a>
                  ), is WEEKLINE INVESTMENT AND TRADING COMPANY LTD. All loan
                  approvals, sanctions, disbursements, and credit decisions are
                  made by our registered lending partners in accordance with
                  applicable laws and regulatory guidelines issued by the
                  Reserve Bank of India. Zapcash acts as a technology and
                  service platform to support the loan application process,
                  customer onboarding, documentation, and related services. All
                  lending activities are conducted in compliance with applicable
                  regulations, including guidelines under the Digital Personal
                  Data Protection Act, 2023 and other relevant Indian laws.
                </p>

                <div className="rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100 p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    <a
                      href="https://www.weekline.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      NBFC
                    </a>{" "}
                    Information:
                  </p>
                  <p className="text-sm sm:text-base break-words">
                    <strong className="text-gray-800">
                      WEEKLINE INVESTMENT AND TRADING COMPANY LTD.
                    </strong>
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong className="text-gray-800">
                      RBI Registered NO.
                    </strong>{" "}
                    14.01001
                  </p>
                  <p className="text-sm sm:text-base break-words">
                    <strong className="text-gray-800">Address:</strong> 79,
                    Ground Floor, World Trade Centre, Babar Lane, New Delhi
                    110001 India
                  </p>
                </div>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      1
                    </span>
                    Information We Collect
                  </h2>
                  <p className="mb-4">
                    We collect information to provide, improve, and personalize
                    our Services. The types of information include:
                  </p>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    a. Information You Provide
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      <strong className="text-gray-800">
                        Registration and Account Information:
                      </strong>{" "}
                      Name, email address, phone number, date of birth, address,
                      and government-issued ID details (e.g., Aadhaar, PAN) for
                      verification.
                    </li>
                    <li>
                      <strong className="text-gray-800">
                        Financial Information:
                      </strong>{" "}
                      Bank account details, income details, employment
                      information, loan application data, credit history, and
                      transaction records.
                    </li>
                    <li>
                      <strong className="text-gray-800">
                        Contact Information:
                      </strong>{" "}
                      Any details you share via email, chat, or support forms.
                    </li>
                    <li>
                      <strong className="text-gray-800">
                        Other Submitted Data:
                      </strong>{" "}
                      Responses to surveys, feedback, or promotional entries.
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    b. Information Collected Automatically
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      <strong className="text-gray-800">
                        Device and Usage Data:
                      </strong>{" "}
                      IP address, device type, operating system, browser type,
                      mobile carrier, app version, and usage logs (e.g., pages
                      visited, time spent).
                    </li>
                    <li>
                      <strong className="text-gray-800">Location Data:</strong>{" "}
                      Approximate location via GPS, Wi-Fi, or IP address to
                      assess loan eligibility and prevent fraud (with your
                      consent).
                    </li>
                    <li>
                      <strong className="text-gray-800">
                        App Permissions:
                      </strong>{" "}
                      Our application respects your privacy and does not access
                      contacts, SMS history, or installed applications.
                    </li>
                  </ul>
                  <p className="mt-3">
                    We rely only on limited, user-consented information from
                    authorized sources to support credit assessment and improve
                    your experience. Any access, where applicable, is restricted
                    and used strictly as described under Point 12 of our Privacy
                    Policy, and in accordance with applicable laws including the
                    Digital Personal Data Protection Act, 2023.
                  </p>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    c. Information from Third Parties
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Credit scores and reports from credit bureaus (e.g.,
                      CIBIL, Experian).
                    </li>
                    <li>
                      Data from partners like mobile network providers or
                      payment gateways.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      2
                    </span>
                    Lawful Basis of Processing
                  </h2>
                  <p className="mb-3">We process your data based on:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>Your explicit consent</li>
                    <li>Contractual necessity</li>
                    <li>Legal obligations</li>
                    <li>Legitimate business interests</li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      3
                    </span>
                    How We Use Your Information
                  </h2>
                  <p className="mb-4">
                    We use your information for legitimate business purposes,
                    including:
                  </p>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    a. Providing and Managing Services
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Processing loan applications, verifying identity,
                      assessing creditworthiness, and disbursing funds.
                    </li>
                    <li>
                      Managing repayments, sending reminders, and handling
                      collections.
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    b. Compliance and Risk Management
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Complying with legal obligations (e.g., KYC/AML
                      requirements, RBI regulations).
                    </li>
                    <li>
                      Detecting and preventing fraud, money laundering, or
                      security risks.
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    c. Improving and Personalizing
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Analyzing usage patterns to enhance the App and Services.
                    </li>
                    <li>
                      Sending personalized loan offers, promotions, or
                      educational content (with opt-out options).
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    d. Communication
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Notifying you about account updates, policy changes, or
                      service issues.
                    </li>
                    <li>Responding to inquiries or support requests.</li>
                  </ul>

                  <p className="mt-4">
                    We process data based on your consent, contractual needs,
                    legal requirements, or our legitimate interests. Aggregate,
                    anonymized data may be used for research or statistics
                    without identifying individuals.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      4
                    </span>
                    Sharing Your Information
                  </h2>
                  <p className="mb-4">
                    We do not sell your personal information. We may share it
                    only as necessary:
                  </p>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    a. With Service Providers
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Third-party vendors for payment processing, credit checks,
                      data storage, or analytics (e.g., cloud providers, under
                      strict confidentiality).
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    b. With Affiliates and Partners
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>Within the Zapcash group for operational purposes.</li>
                    <li>
                      Lending partners or financial institutions involved in
                      loan facilitation.
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    c. For Legal Reasons
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      To comply with laws, court orders, or regulatory requests
                      (e.g., reporting to RBI or credit bureaus).
                    </li>
                    <li>
                      To protect rights, property, or safety in cases of fraud
                      or disputes.
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    d. Business Transfers
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      In the event of a merger, acquisition, or sale of assets,
                      your data may be transferred as part of the transaction.
                    </li>
                  </ul>

                  <p className="mt-4">
                    All sharing is governed by contracts ensuring data
                    protection standards equivalent to ours. We do not share
                    identifiable data for marketing without consent.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      5
                    </span>
                    Automated Decision-Making
                  </h2>
                  <p className="mb-3">
                    We may use automated systems and algorithms to:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>Assess creditworthiness</li>
                    <li>Determine loan eligibility and limits</li>
                  </ul>
                  <p className="mt-4 mb-3">You have the right to:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>Request human review of decisions</li>
                    <li>Seek clarification on outcomes</li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      6
                    </span>
                    Data Security
                  </h2>
                  <p className="mb-4">
                    We prioritize your data&apos;s security and implement
                    reasonable administrative, technical, and physical
                    safeguards, including:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Encryption for data in transit (SSL/TLS) and at rest.
                    </li>
                    <li>
                      Access controls, firewalls, and regular security audits.
                    </li>
                    <li>
                      Compliance with ISO 2700, ISO 17802 standards and RBI
                      guidelines.
                    </li>
                  </ul>
                  <p className="mt-4">
                    However, no system is completely secure. You are responsible
                    for keeping your login credentials confidential. We limit
                    data retention to what&apos;s necessary (e.g., 7 years for
                    loan records per RBI rules) and securely delete or anonymize
                    it afterward.
                  </p>
                  <p className="mt-3">
                    Data may be processed or stored within India or in secure
                    jurisdictions permitted under applicable Indian laws.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      7
                    </span>
                    Your Rights and Choices
                  </h2>
                  <p className="mb-4">
                    You have rights over your personal information:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      <strong className="text-gray-800">
                        Access and Correction:
                      </strong>{" "}
                      Request a copy of your data or correct inaccuracies by
                      contacting us.
                    </li>
                    <li>
                      <strong className="text-gray-800">Deletion:</strong>{" "}
                      Request deletion of your data (subject to legal retention
                      requirements).
                    </li>
                    <li>
                      <strong className="text-gray-800">Opt-Out:</strong>{" "}
                      Unsubscribe from marketing emails or withdraw consents
                      (e.g., location access) via App settings.
                    </li>
                    <li>
                      <strong className="text-gray-800">Portability:</strong>{" "}
                      Receive your data in a structured format.
                    </li>
                    <li>
                      <strong className="text-gray-800">Complaints:</strong>{" "}
                      Lodge concerns with us or data protection authorities
                      (e.g., under DPDPA).
                    </li>
                  </ul>
                  <p className="mt-4">
                    To exercise rights, email to care@zapcash.in. We respond
                    within 30 days.
                  </p>
                  <p className="mt-3">For cookies, see Section 8.</p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      8
                    </span>
                    Cookies and Tracking Technologies
                  </h2>
                  <p className="mb-4">
                    We use cookies, pixels, and similar tools to:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Enhance functionality (e.g., remembering preferences).
                    </li>
                    <li>Analyze usage and improve Services.</li>
                    <li>Deliver targeted ads.</li>
                  </ul>
                  <p className="mt-4">
                    You can manage cookies via browser settings. Our App uses
                    similar device identifiers. For details, review our Cookie
                    Policy (linked in the App).
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      9
                    </span>
                    Children&apos;s Privacy
                  </h2>
                  <p>
                    Our Services are not directed at individuals under 18. We do
                    not knowingly collect data from children. If we discover
                    such data, we will delete it promptly.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      10
                    </span>
                    Changes to This Privacy Policy
                  </h2>
                  <p className="mb-3">
                    We have the right to revise or modify this Privacy Policy at
                    any time to reflect changes in legal requirements,
                    regulatory guidelines, technology, or our operational
                    practices.
                  </p>
                  <p className="mb-3">
                    The latest version of this Privacy Policy will always be
                    available on our Website, Mobile Application, or other
                    official digital platforms. The Company will notify
                    customers of any material changes to this section through
                    email communication.
                  </p>
                  <p className="mb-3">
                    Your continued use of Zapcash services after the updated
                    Privacy Policy becomes effective will constitute your
                    acceptance of the revised terms. If you do not agree with
                    the updated policy, you should discontinue use of our
                    services and may reach out to us for further clarification.
                  </p>
                  <p>
                    You are responsible for ensuring that the Personal
                    Information and Sensitive Personal Data you provide to
                    Zapcash remains accurate and current. Please inform us
                    promptly of any updates or corrections to your information
                    so that we can maintain accurate records and provide our
                    services effectively.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      11
                    </span>
                    Deletion Policy
                  </h2>
                  <p className="mb-4">
                    Zapcash Personal Loan provides users with the option to
                    request deletion of their account and associated personal
                    data.
                  </p>
                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    Important Condition Before Deletion
                  </h3>
                  <p className="mb-3">
                    Before submitting a deletion request, please ensure that:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      All loans taken through Zapcash have been fully repaid.
                    </li>
                    <li>
                      There are no outstanding dues, EMIs, penalties, or
                      charges.
                    </li>
                    <li>
                      There are no ongoing disputes or investigations linked to
                      your account.
                    </li>
                  </ul>
                  <p className="mb-4">
                    Account deletion requests cannot be processed if any
                    financial obligation remains pending.
                  </p>
                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    How to Request Account Deletion
                  </h3>
                  <p className="mb-3">
                    You can request deletion of your Zapcash account through the
                    following method:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      <strong className="text-gray-800">Email Request:</strong>{" "}
                      Send a deletion request from your registered email ID to:
                      care@zapcash.in - Subject line: Account Deletion Request
                    </li>
                  </ul>
                  <p className="mt-4">
                    For security purposes, we may verify your identity before
                    processing the request.
                  </p>
                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    What Happens After Deletion
                  </h3>
                  <p className="mb-3">
                    Once your request is verified and approved:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Your Zapcash account will be permanently deactivated.
                    </li>
                    <li>You will no longer be able to log in to the app.</li>
                    <li>
                      Your personal profile data will be deleted or anonymized.
                    </li>
                  </ul>
                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    Data That May Be Retained
                  </h3>
                  <p className="mb-3">
                    Certain information may be retained even after account
                    deletion if required under applicable laws, including:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>Financial transaction records</li>
                    <li>Loan agreements and repayment history</li>
                    <li>KYC records</li>
                    <li>
                      Data required under RBI regulations, tax laws, audit, or
                      fraud prevention requirements
                    </li>
                  </ul>
                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    Processing Time
                  </h3>
                  <p>
                    Deletion requests are typically processed within a
                    reasonable timeframe after successful verification and
                    subject to regulatory checks.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      12
                    </span>
                    App Permissions and Data Collection
                  </h2>
                  <p className="mb-4">
                    Our mobile application requires certain permissions to
                    function effectively and provide you with our services.
                    Below are the specific permissions we request and how the
                    collected data is used:
                  </p>
                  <p className="mb-4">
                    The key data collected from each permission granted in the
                    device and how this data is used is further detailed below:
                  </p>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    SMS Permissions
                  </h3>
                  <p className="mb-3">
                    Our application does not access, read, or store personal SMS
                    content on your device. We do not collect or process OTP
                    messages, personal communications, or any sensitive message
                    content under any circumstances.
                  </p>
                  <p className="mb-3">
                    With your explicit and informed consent, we may access
                    limited and anonymized metadata related to transactional SMS
                    (such as sender category, timestamps, and message type
                    classification) solely for the purpose of:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>
                      Verifying financial transactions and income patterns
                    </li>
                    <li>Enhancing creditworthiness assessment</li>
                    <li>Detecting and preventing fraud</li>
                  </ul>
                  <p className="mb-3">
                    At no point is full SMS content collected, stored, or
                    shared. All data processing is carried out in a
                    privacy-preserving manner, using secure systems and strict
                    access controls.
                  </p>
                  <p className="mb-4">
                    Any information, if required to be shared, is done strictly
                    on a need-to-know basis with regulated partner NBFCs and
                    authorized service providers, in compliance with applicable
                    laws and only for the stated purposes.
                  </p>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    Installed Apps Permissions
                  </h3>
                  <p className="mb-3">
                    With your explicit, informed, and revocable consent, our
                    application may collect limited and non-personal metadata
                    about installed and system applications on your device.
                  </p>
                  <p className="mb-3">
                    This information is processed in a privacy-preserving manner
                    through our trusted technology partner, Credeau (
                    <a
                      href="https://www.credeau.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline"
                    >
                      www.credeau.com
                    </a>
                    ), solely for providing regulated financial services in
                    association with our Partner NBFCs.
                  </p>
                  <p className="mb-2">This data is used strictly for:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>
                      Detecting potential fraud risks (such as presence of
                      high-risk or potentially harmful applications)
                    </li>
                    <li>
                      Supporting identity verification and responsible credit
                      risk assessment
                    </li>
                    <li>
                      Enabling faster loan approvals and appropriate credit
                      limits
                    </li>
                  </ul>
                  <p className="mb-2 font-medium text-gray-800">
                    Important safeguards:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-4">
                    <li>
                      Only minimal metadata (such as application name, category,
                      and install/update indicators) is collected; intrusive or
                      excessive data points are not accessed.
                    </li>
                    <li>
                      No personal data, app usage behavior, messages, or content
                      from other applications is accessed or processed.
                    </li>
                    <li>
                      Data is not used for advertising, profiling, or marketing
                      purposes.
                    </li>
                    <li>
                      Processing is carried out in accordance with the
                      principles of data minimization and purpose limitation
                      under the Digital Personal Data Protection Act, 2023 and
                      applicable regulatory guidelines.
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    Location Permissions
                  </h3>
                  <p className="mb-3">
                    With your explicit consent, our application may request
                    limited, one-time access to your device location.
                  </p>
                  <p className="mb-3">This access is used strictly for:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>Determining serviceability of your loan application</li>
                    <li>Supporting risk checks and fraud prevention</li>
                    <li>Enabling customized or pre-qualified loan offerings</li>
                    <li>
                      Facilitating address verification and KYC compliance
                    </li>
                  </ul>
                  <p className="mb-4">
                    We do not track your location continuously or in the
                    background. Location data is collected only at the time of
                    requirement, retained for the minimum necessary duration,
                    and processed strictly for the stated purposes in compliance
                    with the Digital Personal Data Protection Act, 2023.
                  </p>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    Device Permissions
                  </h3>
                  <p className="mb-3">
                    With your consent, our application may collect limited,
                    non-sensitive device information to enhance platform
                    security and prevent fraud.
                  </p>
                  <p className="mb-3">This may include:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>Device model</li>
                    <li>Operating system version</li>
                    <li>
                      Basic device configuration (such as RAM/storage ranges)
                    </li>
                  </ul>
                  <p className="mb-4">
                    We do not collect or store persistent or uniquely
                    identifiable device identifiers (such as IMEI, serial
                    number, or MAC address). All processing follows
                    privacy-by-design principles and applicable legal
                    requirements.
                  </p>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    Phone State Permissions
                  </h3>
                  <p className="mb-3">
                    Our application may request Phone State permission only with
                    your explicit consent and strictly for limited verification
                    purposes, including:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>
                      Verifying that the device has an active SIM and valid
                      network connection at the time of onboarding and
                      disbursement
                    </li>
                    <li>
                      Ensuring the transaction is carried out by the rightful
                      customer and preventing spoofing/fraud
                    </li>
                  </ul>
                  <p className="mb-4">
                    We do not access or collect call logs, contacts, or
                    communication data. Any permissions requested are strictly
                    limited to what is necessary for the stated purpose and are
                    obtained and used in compliance with applicable laws and
                    regulatory standards.
                  </p>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    Camera Permissions
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>
                      <strong className="text-gray-800">
                        Purpose of access:
                      </strong>{" "}
                      Camera access is required solely to facilitate digital KYC
                      (eKYC) and document capture.
                    </li>
                    <li>
                      <strong className="text-gray-800">Usage:</strong> The
                      captured information is used only for identity
                      verification and regulatory compliance.
                    </li>
                  </ul>
                  <p className="mb-2 font-medium text-gray-800">
                    We ensure that:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>
                      Data captured is limited to what is necessary for KYC
                      compliance
                    </li>
                    <li>
                      No unrelated images or videos are accessed or stored
                    </li>
                    <li>
                      We do not collect or process biometric identifiers, except
                      where explicitly required under applicable law and with
                      consent
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    Data Storage and Consent Framework
                  </h3>
                  <p className="mb-2">All data collected is:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>Stored securely on servers located within India</li>
                    <li>
                      Processed strictly for lawful purposes related to lending
                      services
                    </li>
                    <li>
                      Retained only for the duration necessary to fulfill
                      regulatory and business requirements
                    </li>
                  </ul>
                  <p className="mb-2">We follow the principles of:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>Lawful processing and transparency</li>
                    <li>Purpose limitation and data minimization</li>
                    <li>Storage limitation and security safeguards</li>
                  </ul>
                  <p className="mb-3">
                    In full compliance with the Digital Personal Data Protection
                    Act, 2023 and applicable regulatory guidelines.
                  </p>
                  <p>
                    We also provide clear, just-in-time consent notices before
                    requesting any sensitive permission (such as location or
                    device data), ensuring that you remain in control of your
                    personal data at all times.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      13
                    </span>
                    Fair Practices &amp; Recovery Conduct
                  </h2>
                  <p className="mb-3">We are committed to ethical practices:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>No harassment or abusive recovery methods</li>
                    <li>No misuse of contact data for recovery pressure</li>
                    <li>
                      All recovery practices comply with RBI Fair Practices Code
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      14
                    </span>
                    Contact Us
                  </h2>

                  <p className="mb-4">
                    For questions, concerns, or requests, contact:
                  </p>
                  <div className="rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100 p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                    <p className="text-sm sm:text-base break-words">
                      <strong className="text-gray-800">
                        Data Protection Officer:
                      </strong>{" "}
                    </p>
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
                      <strong className="text-gray-800">
                        Grievance Number:
                      </strong>{" "}
                      <a href="tel:7665466546" className="break-all">
                        7665466546
                      </a>
                    </p>
                    <p className="text-sm sm:text-base break-words">
                      <strong className="text-gray-800">Address:</strong> 
                      79, Ground Floor, World Trade Centre, Babar Lane, New Delhi - 110001, India
                    </p>
                  </div>
                  <p className="mt-6">
                    Thank you for trusting Zapcash with your financial journey.
                    We value your privacy as much as you do.
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

export default function PrivacyPolicyPage() {
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
      <PrivacyPolicyContent />
    </Suspense>
  );
}
