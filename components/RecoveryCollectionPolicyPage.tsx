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

function RecoveryCollectionPolicyContent() {
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
                    Recovery and Collection Policy
                  </h1>
                  <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-600">
                    Weekline Investment and Trading Company Limited
                  </p>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-10 py-5 sm:py-10">
              <div className="prose prose-gray max-w-none text-sm sm:text-base text-gray-700 leading-relaxed sm:leading-loose space-y-5 sm:space-y-6 hyphens-auto break-words">
                <p className="italic text-gray-600">
                  This policy was reviewed and approved by the Board of
                  Directors in the Board Meeting held on 2nd March 2026.
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
                    Preamble
                  </h2>
                  <p className="mb-3">
                    Weekline Investment and Trading Company Limited (&quot;the
                    Company&quot; / &quot;WITCL&quot;), a Non-Banking Financial
                    Company (NBFC – Base Layer) registered with the Reserve Bank
                    of India (RBI), is committed to adopting fair, transparent,
                    ethical, and legally compliant recovery and collection
                    practices. This Recovery and Collection Policy
                    (&quot;Policy&quot;) is framed in alignment with:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      RBI Act, 1934 and applicable RBI Master Directions for
                      NBFCs
                    </li>
                    <li>RBI Fair Practices Code Guidelines</li>
                    <li>
                      RBI Digital Lending Guidelines and outsourcing norms
                    </li>
                  </ul>
                  <p className="mt-4">
                    This Policy governs all recovery and collection activities
                    of the Company and forms an integral part of the overall
                    credit governance framework, ensuring consistency across
                    loan origination, servicing, recovery, settlement, and
                    write-off stages.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      2
                    </span>
                    Objectives of the Policy
                  </h2>
                  <p className="mb-3">The objectives of this Policy are to:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Establish a structured, transparent, and RBI-compliant
                      recovery framework
                    </li>
                    <li>
                      Ensure dignified, non-coercive, and borrower-friendly
                      recovery practices
                    </li>
                    <li>
                      Protect borrower rights, privacy, and confidentiality
                    </li>
                    <li>
                      Minimize delinquencies and credit losses through timely
                      intervention
                    </li>
                    <li>
                      Clearly define escalation, settlement, and write-off
                      processes
                    </li>
                    <li>
                      Ensure accountability of employees and outsourced recovery
                      agents
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      3
                    </span>
                    Applicability
                  </h2>
                  <p className="mb-3">This Policy shall apply to:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      All loan products offered by the Company including payday
                      loans, personal loans, EMI-based loans.
                    </li>
                    <li>
                      All recovery actions undertaken by in-house teams or
                      outsourced agencies.
                    </li>
                    <li>
                      All employees, officers, representatives, and third-party
                      service providers engaged in recovery and collection.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      4
                    </span>
                    Guiding Principles
                  </h2>
                  <p className="mb-3">
                    The Company shall adhere to the following principles:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      <strong className="text-gray-800">
                        Fairness and Respect:
                      </strong>{" "}
                      Borrowers shall be treated with dignity and respect at all
                      times.
                    </li>
                    <li>
                      <strong className="text-gray-800">Transparency:</strong>{" "}
                      Clear communication of dues, charges, consequences, and
                      options.
                    </li>
                    <li>
                      <strong className="text-gray-800">Non-Coercion:</strong>{" "}
                      No harassment, intimidation, abuse, or force.
                    </li>
                    <li>
                      <strong className="text-gray-800">
                        Confidentiality:
                      </strong>{" "}
                      Borrower data shall be protected and used strictly for
                      recovery purposes.
                    </li>
                    <li>
                      <strong className="text-gray-800">
                        Legal Compliance:
                      </strong>{" "}
                      All actions shall be within the framework of applicable
                      laws and RBI directions.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      5
                    </span>
                    Recovery Governance Structure
                  </h2>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Overall oversight shall vest with the Board of Directors /
                      Board Risk Committee.
                    </li>
                    <li>
                      Day-to-day recovery operations shall be managed by the
                      Collections Department.
                    </li>
                    <li>
                      Legal actions shall be routed through the Legal
                      Department.
                    </li>
                    <li>
                      Settlement and write-off decisions shall be governed by
                      the Settlement &amp; Write-off Policy.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      6
                    </span>
                    Recovery Mechanism
                  </h2>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    6.1 Product-Specific Alignment with Credit Policy
                  </h3>
                  <p className="mb-3">
                    The recovery and collection framework for payday loans shall
                    be strictly governed by the Company&apos;s approved Credit
                    Policy, particularly:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>Section 6: Collection Risk Strategy</li>
                    <li>Section 6.1: Delinquency Management Framework</li>
                    <li>Section 6.2: Escalation &amp; Write-Off Protocols</li>
                  </ul>
                  <p className="mb-4">
                    Given that Payday Loans are short-tenure, bullet repayment
                    loans (6–40 days) with relatively higher risk pricing, the
                    recovery strategy emphasizes early intervention, structured
                    escalation, and time-bound resolution, while ensuring full
                    compliance with RBI Fair Practices Code and borrower
                    protection norms.
                  </p>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    6.2 Delinquency Identification and Account Classification
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>
                      An account shall be treated as overdue if the full
                      repayment amount (principal, interest, and applicable
                      charges) is not received on the due date.
                    </li>
                    <li>
                      Days Past Due (DPD) shall be computed from the day
                      immediately following the due date.
                    </li>
                    <li>
                      All recovery actions shall be mapped to DPD buckets as
                      defined below.
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    6.3 DPD-Based Recovery and Escalation Framework
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-gray-200 my-3">
                    <table className="min-w-full text-xs sm:text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-gray-900 border-b border-gray-200">
                            DPD Bucket
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-900 border-b border-gray-200">
                            Classification
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-900 border-b border-gray-200">
                            Recovery Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        <tr>
                          <td className="px-3 py-2 align-top border-b border-gray-100 font-medium">
                            0–5 DPD
                          </td>
                          <td className="px-3 py-2 align-top border-b border-gray-100">
                            Soft Follow-up
                          </td>
                          <td className="px-3 py-2 align-top border-b border-gray-100">
                            Automated SMS, email, app notifications; courtesy
                            calls by in-house team to identify technical issues,
                            salary delays, or inadvertent omissions. No pressure
                            tactics permitted.
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 align-top border-b border-gray-100 font-medium">
                            6–15 DPD
                          </td>
                          <td className="px-3 py-2 align-top border-b border-gray-100">
                            Escalated Follow-up
                          </td>
                          <td className="px-3 py-2 align-top border-b border-gray-100">
                            Structured outbound calls by trained collection
                            executives; clear communication of dues; obtaining
                            documented Promise-to-Pay (PTP); explanation of
                            consequences of continued default.
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 align-top border-b border-gray-100 font-medium">
                            16–30 DPD
                          </td>
                          <td className="px-3 py-2 align-top border-b border-gray-100">
                            Intensive Recovery
                          </td>
                          <td className="px-3 py-2 align-top border-b border-gray-100">
                            Assignment to senior collectors; authorized field
                            visits where required; issuance of formal demand
                            notices; evaluation for legal action. Field visits
                            must strictly follow RBI conduct norms.
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 align-top font-medium">
                            &gt;30 DPD
                          </td>
                          <td className="px-3 py-2 align-top">
                            Final Recovery
                          </td>
                          <td className="px-3 py-2 align-top">
                            Initiation of legal recovery proceedings; evaluation
                            for write-off; transfer to specialized recovery
                            agencies where approved.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    6.4 Telephonic and Digital Recovery Process
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>
                      Telephonic recovery shall be conducted only by trained
                      personnel using approved scripts.
                    </li>
                    <li>
                      Contacts shall be made only between 8:00 AM and 7:00 PM.
                    </li>
                    <li>
                      Digital communication shall comply with RBI Digital
                      Lending Guidelines.
                    </li>
                    <li>
                      No access shall be taken to borrower contacts, gallery, or
                      personal data.
                    </li>
                    <li>
                      Frequency of communication shall be reasonable and
                      proportionate to the DPD status.
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    6.5 Field Collection Process
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>
                      Field visits shall be initiated only after exhaustion of
                      telephonic efforts and normally after 15 DPD.
                    </li>
                    <li>
                      Recovery agents shall carry valid authorization letters
                      and identity cards.
                    </li>
                    <li>
                      Visits shall be conducted during permitted hours and in a
                      dignified manner.
                    </li>
                    <li>
                      Under no circumstances shall agents indulge in public
                      shaming, intimidation, or coercion.
                    </li>
                    <li>
                      Special care shall be taken in cases involving elderly
                      borrowers, women borrowers, or vulnerable customers.
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    6.6 Legal Recovery Actions
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>
                      Legal action shall be considered only after reasonable
                      opportunities for repayment have been provided.
                    </li>
                    <li>
                      Legal measures may include issuance of demand notices,
                      arbitration, civil proceedings, or other remedies as
                      permitted by law.
                    </li>
                    <li>
                      All legal actions shall be approved by the designated
                      authority as per the internal approval matrix.
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    6.7 Settlement, Restructuring, and Compromise
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>
                      Settlement or restructuring may be considered on a
                      case-to-case basis, based on borrower profile, repayment
                      intent, and recovery potential.
                    </li>
                    <li>
                      Any compromise or waiver shall require prior internal
                      approvals.
                    </li>
                    <li>
                      Settlement terms shall be documented in writing and
                      communicated transparently to the borrower.
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    6.8 Write-Off Policy
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>
                      Accounts exceeding 30 DPD and assessed as uncollectible
                      may be considered for write-off for accounting purposes.
                    </li>
                    <li>
                      Write-off shall not extinguish the borrower&apos;s
                      liability.
                    </li>
                    <li>
                      Post write-off recovery efforts may continue through legal
                      means or empaneled recovery agencies.
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    6.9 Recovery Agency Management
                  </h3>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>
                      Recovery agencies shall be appointed after due diligence
                      and RBI-compliant agreements.
                    </li>
                    <li>
                      Agencies shall follow this Policy, Fair Practices Code,
                      and RBI Code of Conduct.
                    </li>
                    <li>
                      The Company shall remain fully responsible for the acts of
                      its recovery agents.
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    6.10 Monitoring, MIS and Governance
                  </h3>
                  <p className="mb-2">
                    Recovery performance shall be monitored through MIS aligned
                    with the Credit Policy, including:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>DPD bucket movement</li>
                    <li>Bounce trends</li>
                    <li>Risk-grade-wise delinquency</li>
                    <li>City-wise and device-wise delinquency trends</li>
                  </ul>
                  <p>
                    Deviations from approved recovery strategy shall be
                    escalated to senior management.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      7
                    </span>
                    Conduct of Recovery Staff and Agents
                  </h2>
                  <p className="mb-3">Recovery staff and agents shall:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>Carry valid authorization and identity proof</li>
                    <li>Clearly identify themselves and the Company</li>
                    <li>Be courteous, professional, and non-threatening</li>
                    <li>
                      Not use abusive language or make false representations
                    </li>
                    <li>
                      Not threaten arrest, imprisonment, or legal action without
                      basis
                    </li>
                    <li>
                      Not contact borrowers&apos; relatives, friends, or
                      employers except as legally permitted
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      8
                    </span>
                    Field Visits
                  </h2>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Field visits shall be conducted only when necessary.
                    </li>
                    <li>
                      Visits shall respect borrower privacy and social standing.
                    </li>
                    <li>
                      No public humiliation or display of borrower information.
                    </li>
                    <li>
                      Female borrowers shall not be visited by male agents
                      alone.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      9
                    </span>
                    Digital and Telephonic Collection
                  </h2>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Digital communication shall comply with RBI Digital
                      Lending Guidelines.
                    </li>
                    <li>
                      No unauthorized access to borrower&apos;s contacts,
                      gallery, or personal data.
                    </li>
                    <li>
                      All digital communications shall be auditable and
                      traceable.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      10
                    </span>
                    Legal Recovery Actions
                  </h2>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Legal recovery actions shall be initiated strictly as a
                      measure of last resort, after exhaustion of amicable and
                      operational recovery efforts.
                    </li>
                    <li>
                      All legal actions shall be consistent with the loan
                      agreement, Fair Practices Code, and applicable laws.
                    </li>
                    <li>
                      Borrowers shall be given reasonable notice and opportunity
                      before initiation of legal proceedings.
                    </li>
                    <li>
                      Legal recovery shall be approved as per the internal
                      authority matrix and documented appropriately.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      11
                    </span>
                    Settlement, Restructuring and Waiver
                  </h2>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Settlement, compromise, or restructuring shall be governed
                      by the Company&apos;s Comprehensive Policy on Settlements
                      &amp; Write-offs.
                    </li>
                    <li>
                      Settlements may be considered for accounts with DPD &gt;
                      30 days, NPAs, written-off accounts, or cases involving
                      genuine borrower hardship.
                    </li>
                    <li>
                      No settlement or waiver shall be granted arbitrarily or as
                      a recovery shortcut.
                    </li>
                    <li>
                      Settlement approvals shall be strictly as per the
                      Delegation of Authority defined in the Settlement &amp;
                      Write-off Policy and shall be one level higher than the
                      loan sanctioning authority.
                    </li>
                    <li>
                      Borrowers shall be informed about the credit bureau impact
                      of settlement or write-off prior to acceptance.
                    </li>
                    <li>
                      All settlement terms shall be communicated in writing,
                      including payable amount, waived amount, timelines, and
                      consequences of non-compliance.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      11A
                    </span>
                    Write-Off
                  </h2>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      Write-offs shall be technical write-offs only and shall
                      not extinguish the borrower&apos;s liability.
                    </li>
                    <li>
                      Written-off accounts shall continue to be pursued for
                      recovery, settlement, or legal action.
                    </li>
                    <li>Re-aging of accounts is strictly prohibited.</li>
                    <li>
                      Accounting treatment and provisioning shall be in
                      accordance with RBI norms and the Settlement &amp;
                      Write-off Policy.
                    </li>
                    <li>
                      The Company may consider restructuring, rescheduling, or
                      settlement on a case-to-case basis.
                    </li>
                    <li>
                      Any waiver or compromise shall follow internal approval.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      12
                    </span>
                    Confidentiality and Data Privacy
                  </h2>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      All borrower information, records, call recordings, field
                      visit notes, and recovery-related communications shall be
                      treated as strictly confidential.
                    </li>
                    <li>
                      Access to borrower data shall be restricted to authorised
                      personnel strictly on a need-to-know basis for recovery
                      and compliance purposes.
                    </li>
                    <li>
                      The Company shall comply with RBI Digital Lending
                      Guidelines, Information Technology Act, 2000, and
                      applicable data protection and privacy laws while handling
                      borrower data.
                    </li>
                    <li>
                      Recovery agents shall not copy, store, misuse, or share
                      borrower data in any physical or electronic form.
                    </li>
                    <li>
                      Any data breach, misuse, or unauthorised disclosure shall
                      attract strict disciplinary action, termination of
                      contracts, and legal proceedings, as applicable.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      13
                    </span>
                    Borrower Communication and Disclosures
                  </h2>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600 mb-3">
                    <li>
                      All recovery-related communications shall be factual,
                      transparent, non-misleading, and respectful.
                    </li>
                    <li>
                      Borrowers shall be clearly informed of:
                      <ul className="list-disc pl-5 sm:pl-6 space-y-1 mt-2">
                        <li>
                          Total outstanding amount with breakup of principal,
                          interest, penal charges, and other dues
                        </li>
                        <li>Consequences of continued default</li>
                        <li>
                          Available repayment, restructuring, or settlement
                          options, where applicable
                        </li>
                      </ul>
                    </li>
                    <li>
                      Any levy of penal charges or overdue charges shall be
                      communicated along with the specific reason for such levy.
                    </li>
                    <li>
                      Communications shall be made, as far as practicable, in a
                      language understood by the borrower.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      14
                    </span>
                    Grievance Redressal Mechanism
                  </h2>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      The Company shall maintain a robust grievance redressal
                      mechanism for complaints relating to recovery and
                      collection practices.
                    </li>
                    <li>
                      Borrowers may lodge complaints through the channels
                      specified in the Fair Practices Code, including email,
                      written communication, or customer support channels.
                    </li>
                    <li>
                      Complaints alleging harassment, coercion,
                      misrepresentation, or misconduct by employees or recovery
                      agents shall be investigated on priority.
                    </li>
                    <li>
                      All grievances shall be resolved within the timelines
                      prescribed by RBI.
                    </li>
                    <li>
                      Where the borrower is not satisfied with the resolution,
                      escalation to the RBI Ombudsman / Department of
                      Supervision shall be facilitated in accordance with
                      applicable guidelines.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      15
                    </span>
                    Training, Supervision and Audit
                  </h2>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      The Company shall conduct regular training programmes for
                      employees and recovery agents covering RBI recovery
                      guidelines, Fair Practices Code, borrower rights, and
                      ethical conduct.
                    </li>
                    <li>
                      Telephonic calls, digital communications, and field visits
                      may be recorded, monitored, and audited for quality,
                      compliance, and behavioural standards.
                    </li>
                    <li>
                      Internal audit and compliance teams shall periodically
                      review recovery operations, outsourced agencies,
                      documentation, and adherence to this Policy.
                    </li>
                    <li>
                      Observations and non-compliances identified during audits
                      shall be promptly addressed and reported to senior
                      management.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      16
                    </span>
                    Disciplinary Action and Zero-Tolerance Policy
                  </h2>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      The Company follows a zero-tolerance approach towards
                      harassment, coercion, intimidation, abuse, or any
                      unethical recovery practice.
                    </li>
                    <li>
                      Employees violating this Policy may face disciplinary
                      action including warning, suspension, recovery-linked
                      penalties, or termination.
                    </li>
                    <li>
                      Recovery agencies found in violation shall be immediately
                      suspended or terminated and may be permanently
                      blacklisted.
                    </li>
                    <li>
                      Serious violations may be reported to regulatory
                      authorities or law enforcement agencies, wherever
                      required.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      17
                    </span>
                    Review and Amendment
                  </h2>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
                    <li>
                      This Policy shall be reviewed at least annually by the
                      Board of Directors or earlier if required due to
                      regulatory changes, RBI circulars, or business needs.
                    </li>
                    <li>
                      Any amendment to this Policy shall require prior approval
                      of the Board of Directors.
                    </li>
                  </ul>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      18
                    </span>
                    Board Approval and Effective Date
                  </h2>
                  <p>
                    This Recovery and Collection Policy has been approved by the
                    Board of Directors of Weekline Investment and Trading
                    Company Limited at its meeting held on 2nd March 2026 and
                    shall be effective from the same day.
                  </p>
                </section>

                <section className="pt-4 sm:pt-6 border-t border-gray-100">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      19
                    </span>
                    Contact Us
                  </h2>
                  <p className="mb-4">
                    For questions, concerns, or grievances relating to recovery
                    and collection, contact:
                  </p>
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

export default function RecoveryCollectionPolicyPage() {
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
      <RecoveryCollectionPolicyContent />
    </Suspense>
  );
}
