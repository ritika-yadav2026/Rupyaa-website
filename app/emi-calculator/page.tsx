import "./emi-calculator.css";
import SiteChrome from "@/components/SiteChrome";
import EMICalculatorSection from "@/components/home/EMICalculatorSection";
import LoanHighlightsSection from "@/components/home/LoanHighlightsSection";
import FAQSection from "@/components/home/FAQSection";
import DownloadAppSection from "@/components/home/DownloadAppSection";
import { getSeoMetadata } from "@/lib/seo-metadata";
import { emiCalculatorSchema } from "@/lib/SEO-JSON-schema";

export const generateMetadata = () => getSeoMetadata("emiCalculator");

export default function EMICalculatorPage() {
  return (
    <>
      <script
        id="zapcash-emi-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(emiCalculatorSchema).replace(/</g, "\\u003c"),
        }}
      />
      <SiteChrome className="emi-calculator-page min-h-screen bg-white">
        <EMICalculatorSection />
        <LoanHighlightsSection />
        <FAQSection startBatch={1} layout="split" />
        <DownloadAppSection />
      </SiteChrome>
    </>
  );
}
