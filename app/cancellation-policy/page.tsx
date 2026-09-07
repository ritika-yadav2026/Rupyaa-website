import PolicyPageLayout, { PolicySection } from "@/components/PolicyPageLayout";
import { getSeoMetadata } from "@/lib/seo-metadata";

export const generateMetadata = () => getSeoMetadata("cancellationPolicy");

export default function CancellationPolicyPage() {
  return (
    <PolicyPageLayout
      title="CANCELLATION POLICY"
      effectiveDate="February 25, 2026"
    >
      <p>
        This Cancellation Policy (&quot;Policy&quot;) outlines the terms and
        conditions for cancellation of services availed through Zapcash, the
        brand name of Omnistack Innovation Private Limited (&quot;we&quot;,
        &quot;us&quot;, &quot;our&quot;). By using our platform and initiating
        any transaction, you agree to be bound by the terms of this Policy, as
        may be amended from time to time.
      </p>

      <PolicySection number={1} title="Nature of Services">
        <p className="mb-0">
          Zapcash is a technology platform that facilitates access to credit and
          financial products offered by regulated financial institutions
          including Banks and NBFCs (&quot;Lending Partners&quot;). The final
          approval, disbursal, and terms of any loan are solely governed by the
          respective Lending Partner.
        </p>
      </PolicySection>

      <PolicySection number={2} title="Cancellation of Loan Application">
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
          <li>
            You may choose to cancel your loan application submitted via the
            Zapcash platform at any time prior to final approval or disbursal by
            the Lending Partner.
          </li>
          <li>
            Cancellation requests must be submitted through your registered
            account or by contacting our customer support at{" "}
            <a href="mailto:care@zapcash.in" className="break-all">
              care@zapcash.in
            </a>
            .
          </li>
          <li>
            Once your application is under processing by a Lending Partner,
            cancellation will be subject to the internal policies of that
            Partner. Zapcash does not guarantee cancellation once the file is
            under review or approved by a Lending Partner.
          </li>
        </ul>
      </PolicySection>

      <PolicySection number={3} title="Cancellation After Disbursal">
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
          <li>
            Once a loan amount is disbursed to your bank account, the
            transaction cannot be cancelled.
          </li>
          <li>
            If you do not wish to utilize the funds, you may choose to repay the
            full amount along with any applicable interest and charges as per
            the loan agreement executed with the Lending Partner.
          </li>
          <li>
            Early repayment or foreclosure may be subject to penalties or fees
            as outlined in the respective lender&apos;s terms and conditions.
          </li>
        </ul>
      </PolicySection>

      <PolicySection number={4} title="Cancellation of Ancillary Services">
        <p className="mb-0">
          If you have opted for any ancillary services (such as insurance
          products, value-added financial tools, or premium verification
          services), the cancellation of such services will be subject to the
          individual service provider&apos;s terms and conditions. Zapcash will
          assist you in coordinating with the relevant provider where possible.
        </p>
      </PolicySection>

      <PolicySection number={5} title="Processing Charges">
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
          <li>
            In the event of cancellation, any non-refundable processing fees,
            administrative charges, or verification fees already paid by you may
            not be refunded.
          </li>
          <li>
            If a fee was charged by a Lending Partner or third party, you may be
            required to approach them directly for resolution.
          </li>
        </ul>
      </PolicySection>

      <PolicySection number={6} title="Refunds (If Applicable)">
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-gray-600">
          <li>
            Where eligible, refunds will be processed to your original method of
            payment within 7–10 business days, depending on your bank&apos;s
            processing time.
          </li>
          <li>
            Refunds are not applicable for services already rendered or
            partially completed during the cancellation period.
          </li>
        </ul>
      </PolicySection>

      <PolicySection number={7} title="Zapcash's Role">
        <p className="mb-0">
          Zapcash is not a lender. We are not responsible for decisions made by
          Lending Partners, nor for the fulfilment or cancellation of loans once
          transferred to their systems. Our role is limited to facilitating
          communication and service between you and the lender.
        </p>
      </PolicySection>

      <PolicySection number={8} title="Modifications to This Policy">
        <p className="mb-0">
          We reserve the right to update or modify this Policy at any time. The
          updated Policy will be posted on our platform with the effective date.
          Continued use of our services after such changes shall constitute your
          acceptance of the revised terms.
        </p>
      </PolicySection>

      <PolicySection number={9} title="Contact Information">
        <p className="mb-4">
          For cancellation assistance, please contact us at:
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
    </PolicyPageLayout>
  );
}
