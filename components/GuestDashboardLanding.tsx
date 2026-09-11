"use client";

import { useEffect, useMemo, useState, type ReactElement, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/home/Footer";
import { formatCurrency } from "@/lib/format-utils";
import { validateIndianMobile } from "@/lib/validation";
import FAQSection from "./home/FAQSection";
import DownloadAppSection from "./home/DownloadAppSection";

const CREAM_CARD =
  "rounded-2xl border border-[#FECA42]/70 bg-[#FFFCF4]";

const TRANSPARENCY_CARDS = [
  {
    title: "Loan Amount",
    value: "₹5,000 to ₹5,00,000",
    iconSrc: "/images/loan-amount.png",
    iconAlt: "Loan amount icon",
  },
  {
    title: "Tenure",
    value: "Up to 60 months",
    iconSrc: "/images/tenure.png",
    iconAlt: "Tenure icon",
  },
  {
    title: "Maximum APR",
    value: "Up to 45% per annum",
    iconSrc: "/images/interest-rate.png",
    iconAlt: "Interest rate icon",
  },
] as const;

const HERO_FEATURES = [
  { label: "100% Digital Process", icon: "digital" },
  { label: "Transparent Terms", icon: "terms" },
  { label: "Secure KYC", icon: "kyc" },
] as const;

type WhatYouNeedIconType = "personal" | "income" | "identity" | "face";

const WHAT_YOU_NEED_ITEMS: ReadonlyArray<{
  title: string;
  description: string;
  icon: WhatYouNeedIconType;
}> = [
  {
    title: "Personal Details",
    description: "Name, phone, address and employment status.",
    icon: "personal",
  },
  {
    title: "Income Proof",
    description: "Bank statements for the last 3 months (PDF).",
    icon: "income",
  },
  {
    title: "Identity Proof",
    description: "PAN Card and Aadhaar for digital verification.",
    icon: "identity",
  },
  {
    title: "Face KYC",
    description: "A clear selfie taken from the Rupyaa app.",
    icon: "face",
  },
];

const TENURE_PRESETS = [3, 6, 12, 24] as const;

const LOAN_AMOUNT_MIN = 5000;
const LOAN_AMOUNT_MAX = 100000;
const INTEREST_RATE_MIN = 10;
const INTEREST_RATE_MAX = 24;

function getRangeBackground(value: number, min: number, max: number): string {
  const progress = ((value - min) / (max - min)) * 100;
  return `linear-gradient(to right, #FECA42 0%, #FECA42 ${progress}%, #F3F4F6 ${progress}%, #F3F4F6 100%)`;
}

function calculateEmi(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return Math.round(principal / months);
  const factor = Math.pow(1 + monthlyRate, months);
  return Math.round((principal * monthlyRate * factor) / (factor - 1));
}

function WhatYouNeedIcon({ type }: { type: WhatYouNeedIconType }): ReactElement {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (type === "personal") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="11" r="2" />
        <path d="M6 16c.6-1.5 1.8-2.2 3-2.2s2.4.7 3 2.2" />
        <path d="M14 9h5M14 12h5M14 15h3" />
      </svg>
    );
  }
  if (type === "income") {
    return (
      <svg {...common}>
        <path d="M7 3h7l5 5v13a0 0 0 0 1 0 0H7a0 0 0 0 1 0 0V3z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 16h6M9 10h3" />
      </svg>
    );
  }
  if (type === "identity") {
    return (
      <svg {...common}>
        <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 12 2.5a7 7 0 0 1 7 7C19 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 18c1-2.5 3.2-3.8 5.5-3.8S16.5 15.5 17.5 18" />
    </svg>
  );
}

function HeroFeatureIcon({ type }: { type: (typeof HERO_FEATURES)[number]["icon"] }): ReactElement {
  if (type === "digital") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M13 2L4 14h7l-1 8 10-14h-7l1-6z"
          stroke="#111827"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "terms") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 3h6l4 4v14H8V3z"
          stroke="#111827"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M14 3v4h4M10 12h6M10 16h4" stroke="#111827" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="6" y="10" width="12" height="10" rx="2" stroke="#111827" strokeWidth="1.7" />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="#111827" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
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
          <div className="order-2 max-w-xl lg:order-1">
            <h1 className="text-[2.1rem] font-semibold leading-[1.12] tracking-[-0.04em] text-slate-900 sm:text-[2.6rem] lg:text-[3.25rem]">
              Your Plans
              <br />
              Don&apos;t Have To Wait
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-600 sm:text-[1.05rem]">
              Fast Approval, Minimal Documentation, And Money Directly In Your Bank Account.
              Experience The Next Generation Of Credit.
            </p>
            <div className="mt-7">
              <Link
                href="/auth"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-button px-8 text-sm font-semibold text-gray-900 transition hover:bg-button/90"
              >
                Apply Now
              </Link>
            </div>
            <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
              {HERO_FEATURES.map((feature) => (
                <li key={feature.label} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(15,23,42,0.08)]">
                    <HeroFeatureIcon type={feature.icon} />
                  </span>
                  {feature.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="order-1 rounded-[1.5rem] border border-[#FECA42]/50 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-6 lg:order-2">
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
                  style={{ background: getRangeBackground(loanAmount, LOAN_AMOUNT_MIN, LOAN_AMOUNT_MAX) }}
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
                  style={{
                    background: getRangeBackground(interestRate, INTEREST_RATE_MIN, INTEREST_RATE_MAX),
                  }}
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

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[1.6rem] font-semibold tracking-[-0.04em] text-slate-900 sm:text-[2.2rem]">
            Loan Highlights
          </h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Clear terms. Flexible options. No surprises.
          </p>
        </div>

        <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-3">
          {TRANSPARENCY_CARDS.map((card) => (
            <div key={card.title} className={`${CREAM_CARD} px-6 py-5 text-center`}>
              <Image
                src={card.iconSrc}
                alt={card.iconAlt}
                width={34}
                height={30}
                className="mx-auto h-[28px] w-auto object-contain"
              />
              <h3 className="mt-3 text-[0.9rem] font-semibold text-slate-800">
                {card.title}:{" "}
                <span className="font-medium text-slate-600">{card.value}</span>
              </h3>
            </div>
          ))}
        </div>

        <div className={`${CREAM_CARD} mt-10 p-6 sm:mt-14 sm:p-8 lg:p-10`}>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
            <div>
              <h2 className="text-[1.5rem] font-bold tracking-[-0.03em] text-slate-900 sm:text-[1.85rem]">
                What You&apos;ll Need
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600 sm:text-base">
                Keep these ready for a faster, paperless application.
              </p>
              <div className="mt-6">
                <Link
                  href="/auth"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-button px-7 text-sm font-semibold text-gray-900 transition hover:bg-button/90"
                >
                  Start Application
                </Link>
              </div>
            </div>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {WHAT_YOU_NEED_ITEMS.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FECA42]/30 text-gray-900">
                    <WhatYouNeedIcon type={item.icon} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FAQSection startBatch={0} layout="split" />

      <DownloadAppSection />

      <Footer />
    </div>
  );
}
