import PolicyPageLayout, { PolicySection } from "@/components/PolicyPageLayout";
import { getSeoMetadata } from "@/lib/seo-metadata";

export const generateMetadata = () => getSeoMetadata("refundPolicy");

export default function RefundPolicyPage() {
  return (
    <PolicyPageLayout title="REFUND POLICY" effectiveDate="February 25, 2026">
      <p>
        At Zapcash, operated by Omnistack Innovation Private Limited
        (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we prioritize
        transparency, integrity, and customer satisfaction. This Refund Policy
        outlines our practices and conditions related to refunds for payments
        made via our platform in connection with the financial services we
        facilitate. Please read this policy carefully before making any payments
        through the Zapcash platform.
      </p>

      <PolicySection number={1} title="Introduction">
        <p className="mb-0">
          At Zapcash, operated by Omnistack Innovation Private Limited, we
          prioritize transparency, integrity, and customer satisfaction. This
          Refund Policy outlines our practices and conditions related to refunds
          for payments made via our platform in connection with the financial
          services we facilitate.
        </p>
      </PolicySection>

      <PolicySection number={2} title="Nature of Services">
        <p className="mb-0">
          Zapcash is a technology-driven platform that enables users to apply
          for and manage financial services, including loan applications,
          through partnerships with regulated financial institutions such as
          banks and NBFCs. We facilitate service delivery, processing, and user
          support, but do not directly disburse or collect loans.
        </p>
      </PolicySection>

      <PolicySection number={3} title="Applicability">
        <p className="mb-0">
          This Refund Policy applies to any service charges, fees, or payments
          made by users to Zapcash or to any financial services facilitated
          through the platform. This includes application fees, technology usage
          charges, convenience fees, or third-party verification service charges
          paid via Zapcash.
        </p>
      </PolicySection>

      <PolicySection number={4} title="Non-Refundable Fees">
        <p className="mb-4">
          Unless otherwise specified, the following payments are non-refundable:
        </p>
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
          <li>
            Loan application processing charges, once the application is
            submitted.
          </li>
          <li>
            Technology usage or convenience fees incurred for using the Zapcash
            platform.
          </li>
          <li>
            Third-party KYC/verification costs once services are rendered.
          </li>
          <li>
            Service charges paid to partner institutions, unless those partners
            specify otherwise.
          </li>
        </ul>
      </PolicySection>

      <PolicySection number={5} title="Exceptions to Non-Refundability">
        <p className="mb-4">
          Refunds may be considered under exceptional circumstances, including:
        </p>
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
          <li>
            Duplicate payments due to a technical error or platform malfunction.
          </li>
          <li>
            Transaction failures where the amount was debited but service was
            not rendered.
          </li>
          <li>
            Unauthorised transactions due to platform error (not including cases
            of user negligence).
          </li>
        </ul>
        <p className="mt-4 mb-0">
          All refund requests must be submitted with proof of payment and valid
          reasoning. Each request will be reviewed on a case-by-case basis, and
          a decision will be communicated to the user within 10 working days.
        </p>
      </PolicySection>

      <PolicySection number={6} title="Refund Request Procedure">
        <p className="mb-4">
          To initiate a refund request, please email us at{" "}
          <a href="mailto:care@zapcash.in" className="break-all">
            care@zapcash.in
          </a>{" "}
          with the following details:
        </p>
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
          <li>Full name and registered mobile number/email ID.</li>
          <li>Date and time of transaction.</li>
          <li>Payment reference number.</li>
          <li>Reason for refund.</li>
          <li>Supporting documents or screenshots (if applicable).</li>
        </ul>
      </PolicySection>

      <PolicySection number={7} title="Processing of Approved Refunds">
        <p className="mb-0">
          Approved refunds will be processed to the original mode of payment
          within 7–10 business days. In cases where the original payment method
          is no longer valid or active, alternate arrangements may be made with
          the consent of the user.
        </p>
      </PolicySection>

      <PolicySection number={8} title="No Refund for Loan Repayments">
        <p className="mb-0">
          Loan repayments made to lending partners through the Zapcash platform
          are governed by the terms of the respective loan agreement. Zapcash is
          not responsible for refunding EMIs or interest once paid. Any such
          concerns must be addressed directly to the respective lender.
        </p>
      </PolicySection>

      <PolicySection number={9} title="Contact Information">
        <p className="mb-4">
          For queries related to this Refund Policy or to track the status of a
          refund request, please contact:
        </p>
        <div className="rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100 p-3 sm:p-4 space-y-1.5 sm:space-y-2">
          <p className="text-sm sm:text-base">
            <strong className="text-gray-800">
              Omnistack Innovation Private Limited
            </strong>
          </p>
          <p className="text-sm sm:text-base">
          79, Ground Floor, World Trade Centre, Babar Lane, New Delhi - 110001, India
          </p>
          <p className="text-sm sm:text-base">
            <strong className="text-gray-800">Email:</strong>{" "}
            <a href="mailto:care@zapcash.in" className="break-all">
              care@zapcash.in
            </a>
          </p>
          <p className="text-sm sm:text-base">
            <strong className="text-gray-800">Contact:</strong>{" "}
            <a href="tel:+918503090309">85-0309-0309</a>
          </p>
        </div>
      </PolicySection>

      <PolicySection number={10} title="Policy Amendments">
        <p className="mb-0">
          Zapcash reserves the right to revise this Refund Policy from time to
          time to reflect changes in regulatory requirements, platform
          functionality, or user feedback. Updated versions will be published on
          our Platform with the effective date clearly mentioned.
        </p>
      </PolicySection>
    </PolicyPageLayout>
  );
}
