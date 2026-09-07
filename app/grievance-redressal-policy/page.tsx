import PolicyPageLayout, { PolicySection } from "@/components/PolicyPageLayout";
import { getSeoMetadata } from "@/lib/seo-metadata";

export const generateMetadata = () => getSeoMetadata("grievanceRedressalPolicy");

export default function GrievanceRedressalPolicyPage() {
  return (
    <PolicyPageLayout
      title="GRIEVANCE REDRESSAL POLICY"
      effectiveDate="February 25, 2026"
    >
      <p>
        Our Grievance Redressal Policy outlines the process for addressing and
        resolving customer complaints or concerns related to our loan services.
        We are committed to ensuring prompt and fair resolution.
      </p>

      <PolicySection number={1} title="Purpose of the Policy">
        <p className="mb-0">
          This Grievance Redressal Policy is designed to provide a structured
          and transparent mechanism for customers to raise concerns, complaints,
          or grievances related to our loan products, services, or processes. We
          aim to resolve issues efficiently, ensuring customer satisfaction and
          compliance with applicable laws and regulations in India, including
          the Reserve Bank of India (RBI) guidelines for financial institutions.
        </p>
      </PolicySection>

      <PolicySection number={2} title="Scope">
        <p className="mb-0">
          This policy applies to all customers, including individuals and
          businesses, who use our loan services through our website, mobile app,
          or other platforms. It covers grievances related to loan applications,
          disbursals, repayments, customer service, privacy, and any other
          interactions with our services.
        </p>
      </PolicySection>

      <PolicySection number={3} title="Grievance Redressal Process">
        <p className="mb-4">
          We follow a systematic process to address and resolve grievances:
        </p>
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
          <li>
            Submit your grievance through our website, mobile app, email, or
            phone.
          </li>
          <li>
            We will acknowledge your complaint within 24 hours of receipt.
          </li>
          <li>
            Our customer support team will investigate and attempt to resolve
            the issue within 7 working days.
          </li>
          <li>
            If the issue requires escalation, it will be referred to our
            Grievance Redressal Officer, who will resolve it within 30 days as
            per RBI guidelines.
          </li>
          <li>
            You will receive regular updates on the status of your grievance via
            email or SMS.
          </li>
        </ul>
      </PolicySection>

      <PolicySection number={4} title="Grievance Redressal Officer">
        <p className="mb-4">
          Our designated Grievance Redressal Officer is responsible for handling
          escalated complaints. You may contact them directly if your issue is
          not resolved satisfactorily at the initial level.
        </p>
        <div className="rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100 p-3 sm:p-4 space-y-1.5 sm:space-y-2">
          <p className="text-sm sm:text-base">
            <strong className="text-gray-800">
              Grievance Redressal Officer (Nodal Officer):
            </strong>{" "}
            Prashant Kabra
          </p>
          <p className="text-sm sm:text-base">
            <strong className="text-gray-800">Address:</strong>
             79, Ground Floor, World Trade Centre, Babar Lane, New Delhi - 110001, India
          </p>
          <p className="text-sm sm:text-base">
            <strong className="text-gray-800">Contact No.:</strong>{" "}
            <a href="tel:+917665466546">7665466546</a>
          </p>
          <p className="text-sm sm:text-base">
            <strong className="text-gray-800">Email:</strong>{" "}
            <a href="mailto:pno@weekline.in" className="break-all">
              pno@weekline.in
            </a>
          </p>
        </div>
      </PolicySection>

      <PolicySection number={5} title="Escalation to Regulatory Authorities">
        <p className="mb-4">
          If your grievance remains unresolved within 30 days or you are
          dissatisfied with our response, you may escalate the matter to the
          Reserve Bank of India (RBI) or the relevant regulatory authority in
          India. The customer may appeal to the RBI at the following addresses:
        </p>
        <div className="rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100 p-3 sm:p-4 space-y-1.5 sm:space-y-2">
          <p className="text-sm sm:text-base">
            <strong className="text-gray-800">The General Manager</strong>
          </p>
          <p className="text-sm sm:text-base">
            Deptt. of Non-Banking Supervision (DNBS)
          </p>
          <p className="text-sm sm:text-base">Reserve Bank of India</p>
          <p className="text-sm sm:text-base">
            6, Sansad Marg, New Delhi - 110001
          </p>
          <p className="text-sm sm:text-base">
            <strong className="text-gray-800">Email:</strong>{" "}
            <a href="mailto:dnbsnewdelhi@rbi.org.in" className="break-all">
              dnbsnewdelhi@rbi.org.in
            </a>
          </p>
          <p className="text-sm sm:text-base">
            <strong className="text-gray-800">Online:</strong>{" "}
            <a
              href="https://cms.rbi.org.in"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all"
            >
              https://cms.rbi.org.in
            </a>
          </p>
          <p className="text-sm sm:text-base">
            <strong className="text-gray-800">Email:</strong>{" "}
            <a href="mailto:crpc@rbi.org.in" className="break-all">
              crpc@rbi.org.in
            </a>
          </p>
          <p className="text-sm sm:text-base">
            <strong className="text-gray-800">Toll-Free Number:</strong>{" "}
            <a href="tel:14448">14448</a>
          </p>
        </div>
      </PolicySection>

      <PolicySection number={6} title="Confidentiality">
        <p className="mb-0">
          All grievances and related information will be treated with strict
          confidentiality. We will not disclose your personal details to third
          parties without your consent, except as required by law or regulatory
          authorities.
        </p>
      </PolicySection>

      <PolicySection number={7} title="Policy Updates">
        <p className="mb-0">
          We reserve the right to update or modify this Grievance Redressal
          Policy at any time. Any changes will be effective immediately upon
          posting on our website or app. We recommend reviewing this policy
          periodically for updates.
        </p>
      </PolicySection>

      <PolicySection number={8} title="Contact Us">
        <p className="mb-0">
          For any questions or to submit a grievance, please contact our
          customer support team at{" "}
          <a href="mailto:care@zapcash.in" className="break-all">
            care@zapcash.in
          </a>
          . We are committed to addressing your concerns promptly and ensuring
          your satisfaction.
        </p>
      </PolicySection>
    </PolicyPageLayout>
  );
}
