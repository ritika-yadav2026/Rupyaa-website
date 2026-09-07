import CreditScorePage from "@/components/CreditScorePage";
import Footer from "@/components/home/Footer";
import { seoMetadata } from "@/lib/seo-metadata";
import { creditScoreSchema } from "@/lib/SEO-JSON-schema";

export const metadata = seoMetadata.creditScore;

export default function CreditScoreRoutePage() {
  return (
    <>
      <script
        id="zapcash-credit-score-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(creditScoreSchema).replace(/</g, "\\u003c"),
        }}
      />
      <CreditScorePage />
      <Footer />
    </>
  );
}
