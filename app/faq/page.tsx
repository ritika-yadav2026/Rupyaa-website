"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/home/Footer";
import FAQSection from "@/components/home/FAQSection";

function FaqContent() {
  const searchParams = useSearchParams();
  const isMobileSource = searchParams.get("source") === "mobile";

  return (
    <div className="min-h-screen bg-white">
      {!isMobileSource && <AppHeader />}
      <main className={isMobileSource ? "pt-10" : "pt-24"}>
        <FAQSection />
        {!isMobileSource && <Footer />}
      </main>
    </div>
  );
}

export default function FaqPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <FaqContent />
    </Suspense>
  );
}
