"use client";

import { ReactNode, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/home/Footer";
import { appShellContainerClassName } from "@/lib/app-shell-layout";

function FileIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-primary sm:w-8 sm:h-8"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function PolicyShell({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate?: string;
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const isMobileSource = searchParams.get("source") === "mobile";

  return (
    <div className="min-h-screen bg-gray-50">
      {!isMobileSource && <AppHeader />}
      <main className={`overflow-x-hidden ${isMobileSource ? "" : "pt-16"}`}>
        <div className={`${appShellContainerClassName} py-5 sm:py-12`}>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 px-4 sm:px-10 py-6 sm:py-10 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    {title}
                  </h1>
                  {effectiveDate && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                      Effective Date: {effectiveDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-10 py-5 sm:py-10">
              <div className="prose prose-gray max-w-none text-sm sm:text-base text-gray-700 leading-relaxed sm:leading-loose space-y-5 sm:space-y-6 hyphens-auto break-words">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
      {!isMobileSource && <Footer />}
    </div>
  );
}

export function PolicySection({
  number,
  title,
  children,
}: {
  number: number | string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="pt-4 sm:pt-6 border-t border-gray-100">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
        <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function PolicyPageLayout({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate?: string;
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <AppHeader />
          <main className="overflow-x-hidden animate-pulse">
            <div className={`${appShellContainerClassName} py-5 sm:py-12`}>
              <div className="h-96 bg-gray-200 rounded-xl" />
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <PolicyShell title={title} effectiveDate={effectiveDate}>
        {children}
      </PolicyShell>
    </Suspense>
  );
}
