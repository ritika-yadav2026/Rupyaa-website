import AppHeader from "@/components/AppHeader";
import HeroSection from "@/components/home/hero-section/HeroSection";

import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import EligibilitySection from "@/components/home/EligibilitySection";
import LoanStepsSection from "@/components/home/LoanStepsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CreditScoreBannerSection from "@/components/home/CreditScoreBannerSection";
import BlogsSection from "@/components/home/BlogsSection";
import FAQSection from "@/components/home/FAQSection";
import DownloadAppSection from "@/components/home/DownloadAppSection";
import Footer from "@/components/home/Footer";
import StatsSection from "@/components/home/StatsSection";
import HeroGridPulse from "@/components/home/HeroGridPulse";
import { ExternalAppConfigInit } from "@/components/ExternalAppConfigInit";
import { getSeoMetadata } from "@/lib/seo-metadata";
import { homepageSchema } from "@/lib/SEO-JSON-schema";

export const generateMetadata = () => getSeoMetadata("home");

export default function HomeLandingPage() {
  return (
    <>
    <script
        id="zapcash-homepage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageSchema).replace(/</g, "\\u003c"),
        }}
      />
    <div className="min-h-screen overflow-x-hidden">
      <ExternalAppConfigInit />
      <AppHeader />
      <main id="main-content" tabIndex={-1} className="flex flex-col pt-16 outline-none">
        <div
          className="relative isolate"
          style={{
            background:
              "radial-gradient(circle at 12% 18%, rgba(0, 101, 37, 0.22) 0%, rgba(0, 101, 37, 0.08) 28%, rgba(255,255,255,0) 62%), radial-gradient(circle at 88% 22%, rgb(183, 214, 191) 0%, rgba(183, 214, 191, 0.47) 30%, rgba(255,255,255,0) 66%), linear-gradient(180deg,#e8f3ea 0%,#edf6ee 30%, #f3faf4 60%,rgb(23, 118, 46) 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0, 101, 37, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 101, 37, 0.07) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0.13) 0%, rgba(0, 0, 0, 0.53) 55%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgb(0, 0, 0) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)",
            }}
          />
          <HeroGridPulse />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-64 -z-10 sm:h-80"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 55%, #ffffff 100%)",
            }}
          />
          <div className="relative flex flex-col pt-10 sm:pt-12 lg:pt-16">
            <HeroSection />
            <StatsSection />
          </div>
        </div>
        <CreditScoreBannerSection />
        <WhyChooseUsSection />
        <EligibilitySection />
        <LoanStepsSection />
        <TestimonialsSection />
        <BlogsSection />
        <FAQSection startBatch={0} />
        <DownloadAppSection />
        <Footer />
      </main>
    </div>
    </>
  );
}
