import PersonalLoanPageClient from "@/components/PersonalLoanPageClient";
import { getSeoMetadata } from "@/lib/seo-metadata";
import { personalLoanSchema } from "@/lib/SEO-JSON-schema";

export const generateMetadata = () => getSeoMetadata("personalLoan");

export default function PersonalLoanPage() {
  return (
    <>
      <script
        id="zapcash-personal-loan-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personalLoanSchema).replace(/</g, "\\u003c"),
        }}
      />
      <PersonalLoanPageClient />
    </>
  );
}
