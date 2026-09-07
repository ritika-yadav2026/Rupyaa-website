import AppHeader from "@/components/AppHeader";
import Footer from "@/components/home/Footer";
import EMICalculatorSection from "@/components/home/EMICalculatorSection";
import EMICalculatorInfoSection from "@/components/home/EMICalculatorInfoSection";
import FAQSection from "@/components/home/FAQSection";
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
      <div className="min-h-screen bg-[#e8f5e9]">
        <AppHeader />
        <main className="pt-16">
          <EMICalculatorSection />
          <EMICalculatorInfoSection />
          <FAQSection startBatch={1} />
        </main>
        <Footer />
      </div>
    </>
  );
}
