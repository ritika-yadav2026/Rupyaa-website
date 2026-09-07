import PolicyPageLayout, { PolicySection } from "@/components/PolicyPageLayout";
import { getSeoMetadata } from "@/lib/seo-metadata";

export const generateMetadata = () => getSeoMetadata("codeOfConduct");

export default function CodeOfConductPage() {
  return (
    <PolicyPageLayout title="CODE OF CONDUCT" effectiveDate="February 25, 2026">
      <p>
        Our Code of Conduct outlines the ethical standards and behavioral
        expectations for all employees, partners, and stakeholders of Zapcash.
        We are committed to maintaining integrity, transparency, and
        professionalism in all our operations.
      </p>

      <PolicySection number={1} title="Purpose of the Code">
        <p className="mb-0">
          This Code of Conduct is designed to foster a culture of integrity,
          accountability, and respect within Zapcash. It applies to all
          employees, directors, contractors, vendors, and partners interacting
          with our organization or customers. The code ensures compliance with
          applicable laws, regulations, and ethical standards, particularly
          those set by the Reserve Bank of India (RBI) and other regulatory
          bodies in India.
        </p>
      </PolicySection>

      <PolicySection number={2} title="Scope">
        <p className="mb-0">
          This policy applies to all individuals associated with Zapcash,
          including full-time and part-time employees, consultants, and
          third-party partners. It covers all aspects of our operations,
          including customer interactions, financial dealings, marketing, and
          internal conduct.
        </p>
      </PolicySection>

      <PolicySection number={3} title="Core Principles">
        <p className="mb-4">
          We uphold the following principles in all our activities:
        </p>
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
          <li>
            <strong className="text-gray-800">Integrity:</strong> Act honestly,
            ethically, and with fairness in all dealings.
          </li>
          <li>
            <strong className="text-gray-800">Transparency:</strong> Maintain
            open and honest communication with customers, employees, and
            stakeholders.
          </li>
          <li>
            <strong className="text-gray-800">Respect:</strong> Treat all
            individuals with dignity, courtesy, and respect, regardless of
            gender, background, or position.
          </li>
          <li>
            <strong className="text-gray-800">Confidentiality:</strong> Protect
            the privacy and sensitive information of customers and employees as
            per our Privacy Policy.
          </li>
          <li>
            <strong className="text-gray-800">Compliance:</strong> Adhere to all
            applicable laws, regulations, and internal policies, including
            anti-corruption and anti-money laundering guidelines.
          </li>
        </ul>
      </PolicySection>

      <PolicySection number={4} title="Employee Responsibilities">
        <p className="mb-4">Employees are expected to:</p>
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
          <li>
            Maintain high standards of professional behaviour in all
            interactions.
          </li>
          <li>
            Avoid conflicts of interest and disclose any potential conflicts
            promptly.
          </li>
          <li>
            Refrain from engaging in bribery, corruption, or unethical
            practices.
          </li>
          <li>
            Protect company assets, including intellectual property and customer
            data.
          </li>
          <li>
            Report any violations of this Code to the Compliance Officer or
            Grievance Redressal Officer.
          </li>
        </ul>
      </PolicySection>

      <PolicySection number={5} title="Customer Interactions">
        <p className="mb-4">
          We are committed to providing fair, transparent, and respectful
          service to our customers. This includes:
        </p>
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
          <li>
            Providing accurate and complete information about loan products,
            fees, and terms.
          </li>
          <li>
            Ensuring timely responses to customer inquiries and complaints.
          </li>
          <li>
            Adhering to data protection laws and safeguarding customer
            information.
          </li>
          <li>Avoiding misleading or aggressive marketing practices.</li>
        </ul>
      </PolicySection>

      <PolicySection number={6} title="Partner and Vendor Conduct">
        <p className="mb-0">
          All partners, vendors, and third-party service providers must adhere
          to the same ethical standards as our employees. We conduct due
          diligence to ensure our partners align with our Code of Conduct and
          terminate relationships if violations occur.
        </p>
      </PolicySection>

      <PolicySection number={7} title="Reporting Violations">
        <p className="mb-0">
          Any suspected or observed violation of this Code should be reported
          immediately to our Compliance Officer or Grievance Redressal Officer
          Prashant Kabra. Reports can be made anonymously, and we ensure
          protection against retaliation for good-faith reporting.
        </p>
      </PolicySection>

      <PolicySection number={8} title="Consequences of Non-Compliance">
        <p className="mb-0">
          Violations of this Code may result in disciplinary action, including
          termination of employment, legal action, or termination of
          partnerships, depending on the severity of the breach. We also
          cooperate fully with law enforcement and regulatory authorities as
          required.
        </p>
      </PolicySection>

      <PolicySection number={9} title="Policy Updates">
        <p className="mb-0">
          We reserve the right to update or modify this Code of Conduct at any
          time. Any changes will be effective immediately upon posting on our
          website or app. We recommend reviewing this policy periodically for
          updates.
        </p>
      </PolicySection>

      <PolicySection number={10} title="Contact Us">
        <p className="mb-0">
          For any questions or to report concerns, please contact our customer
          support team at{" "}
          <a href="mailto:care@zapcash.in" className="break-all">
            care@zapcash.in
          </a>
          . We are committed to upholding the highest standards of conduct and
          addressing your inquiries promptly.
        </p>
      </PolicySection>
    </PolicyPageLayout>
  );
}
