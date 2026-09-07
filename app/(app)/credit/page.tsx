"use client";

import Footer from "@/components/home/Footer";
import { appShellContainerClassName } from "@/lib/app-shell-layout";

const REPORT_FEATURES = [
  {
    title: "Detailed credit analysis",
    description: "A comprehensive look at your financial health",
  },
  {
    title: "Personalized improvement tips",
    description: "Custom advice to boost your score",
  },
  {
    title: "Full credit history insights",
    description: "Access to your past borrowing records",
  },
  {
    title: "Real-time score tracking",
    description: "Stay updated with monthly score refreshes",
  },
] as const;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function CreditScorePage() {
  return (
    <div className="flex flex-col min-h-full">
      <main className={`flex flex-col items-center py-8 sm:py-12 flex-1 ${appShellContainerClassName}`}>
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Check Your{" "}
            <span className="text-primary">Credit Score</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Get your detailed credit score report instantly.
          </p>
        </div>

        {/* Verified Status Card */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-[#E8F5E9] border border-gray-200 px-4 sm:px-6 py-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute text-gray-300">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div className="relative w-8 h-8 rounded-full bg-[#C8E6C9] flex items-center justify-center">
                <CheckIcon className="text-primary" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Verified Status</p>
              <p className="text-base font-bold text-gray-900">Payment Eligible</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-primary uppercase">Ready</span>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="w-full bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: What's included */}
            <div className="p-5 sm:p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">What&apos;s included in your report</h2>
              <ul className="space-y-4">
                {REPORT_FEATURES.map((feature) => (
                  <li key={feature.title} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckIcon className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{feature.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Pricing */}
            <div className="relative bg-[#E8F5E9] p-5 sm:p-6 md:p-8 flex flex-col justify-center">
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-bold">
                  40% OFF
                </span>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">₹59</span>
                  <span className="text-base text-gray-400 line-through">₹99</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">One-time payment for 12 months access</p>
              </div>
              <button
                type="button"
                className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 flex items-center justify-center gap-2 min-h-[48px] transition-colors"
              >
                Pay Now Securely
                <ArrowRightIcon />
              </button>
              <div className="flex items-center justify-center gap-2 mt-4 text-gray-600">
                <LockIcon />
                <span className="text-xs font-medium">Secure & Encrypted Payment</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
