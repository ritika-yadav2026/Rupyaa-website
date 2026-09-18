"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactElement, type ReactNode } from "react";
import LoanHighlightsSection from "@/components/home/LoanHighlightsSection";
import Link from "next/link";
import LoanHeroIntro from "@/components/LoanHeroIntro";
import Footer from "@/components/home/Footer";
import { formatCurrency } from "@/lib/format-utils";
import { validateIndianMobile } from "@/lib/validation";
import FAQSection from "./home/FAQSection";
import DownloadAppSection from "./home/DownloadAppSection";

const TENURE_PRESETS = [3, 6, 12, 24] as const;

const LOAN_AMOUNT_MIN = 5000;
const LOAN_AMOUNT_MAX = 100000;
const INTEREST_RATE_MIN = 10;
const INTEREST_RATE_MAX = 24;

function getRangeProgress(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

function getRangeBackground(value: number, min: number, max: number): string {
  const progress = getRangeProgress(value, min, max);
  return `linear-gradient(to right, #FECA42 0%, #FECA42 ${progress}%, #F3F4F6 ${progress}%, #F3F4F6 100%)`;
}

function getRangeStyle(
  value: number,
  min: number,
  max: number
): React.CSSProperties {
  const progress = getRangeProgress(value, min, max);
  return {
    background: getRangeBackground(value, min, max),
    ["--range-progress" as string]: `${progress}%`,
  };
}

function calculateEmi(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return Math.round(principal / months);
  const factor = Math.pow(1 + monthlyRate, months);
  return Math.round((principal * monthlyRate * factor) / (factor - 1));
}

export default function GuestDashboardLanding(): ReactElement {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [tenure, setTenure] = useState(6);
  const [interestRate, setInterestRate] = useState(14);
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const { totalRepayment, monthlyEmi } = useMemo(() => {
    const emi = calculateEmi(loanAmount, interestRate, tenure);
    return {
      totalRepayment: emi * tenure,
      monthlyEmi: emi,
    };
  }, [interestRate, loanAmount, tenure]);

  useEffect(() => {
    const handleScroll = (): void => {
      setShowStickyBar(window.scrollY > 300);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMobileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(digits);
    setMobileError(null);
  };

  const handleStickySubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    const digits = mobile.replace(/\D/g, "").slice(0, 10);
    const error = validateIndianMobile(digits);
    setMobileError(error);
    if (error) return;
    window.location.href = `/auth?mobile=${encodeURIComponent(digits)}`;
  };

  let stickyError: ReactNode = null;
  if (mobileError) {
    stickyError = (
      <p id="dashboard-sticky-mobile-error" className="mt-1 text-center text-xs text-red-700" role="alert">
        {mobileError}
      </p>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <div
        className={`fixed inset-x-0 bottom-0 z-40 transition-all duration-300 ${
          showStickyBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="w-full bg-button px-3 py-2 shadow-[0_-8px_24px_rgba(254,202,66,0.35)] sm:px-6 sm:py-2.5">
          <form
            onSubmit={handleStickySubmit}
            className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3"
          >
            <p className="text-center text-sm font-semibold text-gray-900 sm:text-left">
              Need quick cash? Get instant loan
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="dashboard-sticky-mobile" className="sr-only">
                Mobile number
              </label>
              <input
                id="dashboard-sticky-mobile"
                type="tel"
                inputMode="numeric"
                placeholder="Mobile number"
                value={mobile}
                onChange={handleMobileChange}
                maxLength={10}
                autoComplete="tel"
                aria-invalid={!!mobileError}
                aria-describedby={mobileError ? "dashboard-sticky-mobile-error" : undefined}
                className={`min-h-[38px] w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition sm:w-[220px] ${
                  mobileError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-button"
                }`}
              />
              <button
                type="submit"
                className="min-h-[38px] w-full shrink-0 rounded-lg border border-gray-900 bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
              >
                Get Loan
              </button>
            </div>
          </form>
          {stickyError}
        </div>
      </div>

      <div
        className="relative isolate overflow-hidden bg-white"
        style={{
          background:
            "linear-gradient(360deg, #FECA42 0%, rgba(255, 255, 255, 0) 100%)",
        }}
      >
        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-14 pt-10 sm:gap-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-8 lg:pb-20 lg:pt-16">
          <LoanHeroIntro />

          <div className="order-2 rounded-[1.5rem] border border-[#FECA42]/50 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-6 lg:order-2">
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-slate-900 sm:text-xl">
              Personal Loan EMI Calculator
            </h2>

            <div className="mt-5 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Loan Amount
                  </p>
                  <p className="text-base font-bold text-slate-900 sm:text-lg">
                    {formatCurrency(loanAmount)}
                  </p>
                </div>
                <input
                  type="range"
                  min={LOAN_AMOUNT_MIN}
                  max={LOAN_AMOUNT_MAX}
                  step={500}
                  value={loanAmount}
                  onChange={(event) => setLoanAmount(Number(event.target.value))}
                  className="emi-slider w-full"
                  style={getRangeStyle(loanAmount, LOAN_AMOUNT_MIN, LOAN_AMOUNT_MAX)}
                  aria-label="Loan amount"
                />
                <div className="flex justify-between text-[0.7rem] font-medium text-slate-400">
                  <span>{formatCurrency(LOAN_AMOUNT_MIN)}</span>
                  <span>{formatCurrency(LOAN_AMOUNT_MAX)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Tenure (Months)
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {TENURE_PRESETS.map((months) => {
                    const isActive = tenure === months;
                    let buttonClassName =
                      "rounded-xl px-2 py-2.5 text-sm font-semibold transition";
                    if (isActive) {
                      buttonClassName += " bg-[#FECA42] text-gray-900";
                    } else {
                      buttonClassName += " bg-[#F3F4F6] text-slate-700 hover:bg-[#E5E7EB]";
                    }
                    return (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setTenure(months)}
                        className={buttonClassName}
                      >
                        {months}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Interest Rate (Per Annum)
                  </p>
                  <p className="text-base font-bold text-slate-900 sm:text-lg">
                    {interestRate.toFixed(1)}%
                  </p>
                </div>
                <input
                  type="range"
                  min={INTEREST_RATE_MIN}
                  max={INTEREST_RATE_MAX}
                  step={0.1}
                  value={interestRate}
                  onChange={(event) => setInterestRate(Number(event.target.value))}
                  className="emi-slider w-full"
                  style={getRangeStyle(interestRate, INTEREST_RATE_MIN, INTEREST_RATE_MAX)}
                  aria-label="Interest rate"
                />
                <div className="flex justify-between text-[0.7rem] font-medium text-slate-400">
                  <span>{INTEREST_RATE_MIN}%</span>
                  <span>{INTEREST_RATE_MAX}%</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Estimated EMI
                  </p>
                  <p className="text-base font-bold text-slate-900 sm:text-lg">
                    {formatCurrency(monthlyEmi)}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Total Repayment
                  </p>
                  <p className="text-base font-bold text-slate-900 sm:text-lg">
                    {formatCurrency(totalRepayment)}
                  </p>
                </div>
              </div>

              <Link
                href="/auth"
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-button px-6 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-button/90"
              >
                Check Eligibility →
              </Link>
            </div>
          </div>
        </section>
      </div>

      <LoanHighlightsSection />
      <DownloadAppSection />
      <FAQSection startBatch={0} layout="split" />
      <Footer />
    </div>
  );
}
