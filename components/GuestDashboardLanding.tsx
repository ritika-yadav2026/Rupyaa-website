"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/home/Footer";
import GooglePlayBadge from "@/components/GooglePlayBadge";
import { HeroLoggedOutForm } from "@/components/home/hero-section/HeroLoggedOutForm";
import { formatCurrency } from "@/lib/format-utils";
import { validateIndianMobile } from "@/lib/validation";
import FAQSection from "./home/FAQSection";
import HeroGridPulse from "./home/HeroGridPulse";
import AppStoreBadge from "@/components/AppStoreBadge";

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

type WhatYouNeedIconType = "personal" | "income" | "identity" | "face";

const WHAT_YOU_NEED_ITEMS: ReadonlyArray<{
  title: string;
  description: string;
  icon: WhatYouNeedIconType;
}> = [
    {
      title: "Personal details",
      description: "Provide your phone number, address, and current employment status.",
      icon: "personal",
    },
    {
      title: "Income Proof",
      description: "Bank statements for the last 3 months (PDF format).",
      icon: "income",
    },
    {
      title: "Identity Proof",
      description: "PAN Card and Aadhaar Card for digital verification.",
      icon: "identity",
    },
    {
      title: "Face KYC",
      description: "A clear front-facing photograph taken from our app.",
      icon: "face",
    },
  ];

function WhatYouNeedIcon({ type }: { type: WhatYouNeedIconType }) {
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
  switch (type) {
    case "personal":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="11" r="2" />
          <path d="M6 16c.6-1.5 1.8-2.2 3-2.2s2.4.7 3 2.2" />
          <path d="M14 9h5M14 12h5M14 15h3" />
        </svg>
      );
    case "income":
      return (
        <svg {...common}>
          <path d="M7 3h7l5 5v13a0 0 0 0 1 0 0H7a0 0 0 0 1 0 0V3z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6M9 16h6M9 10h3" />
        </svg>
      );
    case "identity":
      return (
        <svg {...common}>
          <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 12 2.5a7 7 0 0 1 7 7C19 14.8 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      );
    case "face":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="10" r="3" />
          <path d="M6.5 18c1-2.5 3.2-3.8 5.5-3.8S16.5 15.5 17.5 18" />
        </svg>
      );
  }
}

const LOAN_AMOUNT_MIN = 5000;
const LOAN_AMOUNT_MAX = 100000;
const TENURE_MONTHS_MIN = 1;
const TENURE_MONTHS_MAX = 12;
const TENURE_DAYS_MIN = 10;
const TENURE_DAYS_MAX = 365;
const INTEREST_RATE_MIN = 1;
const INTEREST_RATE_MAX = 15;
const PROCESSING_FEE_RATE = 0.025;

type TenureUnit = "months" | "days";

function getRangeBackground(value: number, min: number, max: number) {
  const progress = ((value - min) / (max - min)) * 100;
  return `linear-gradient(to right, #dfe7dd 0%, #dfe7dd ${progress}%, #dfe7dd ${progress}%, #dfe7dd 100%)`;
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  renderTopRight,
  leftCaption,
  rightCaption,
  valueBelowTrack,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (nextValue: number) => void;
  renderTopRight: React.ReactNode;
  leftCaption: string;
  rightCaption: string;
  valueBelowTrack?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>
        {renderTopRight}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="emi-slider w-full"
        style={{ background: getRangeBackground(value, min, max) }}
      />
      <div className="flex items-center justify-between gap-4 text-[0.68rem] font-semibold text-slate-500">
        <span>{leftCaption}</span>
        {valueBelowTrack}
        <span>{rightCaption}</span>
      </div>
    </div>
  );
}

export default function GuestDashboardLanding() {
  const [loanAmount, setLoanAmount] = useState(35000);
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>("months");
  const [tenure, setTenure] = useState(6);
  const [interestRate, setInterestRate] = useState(10.5);
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const tenureInMonths = useMemo(() => {
    return tenureUnit === "months" ? tenure : tenure / 30;
  }, [tenure, tenureUnit]);

  const { processingFee, youReceive, totalRepayment } = useMemo(() => {
    const fee = Math.round(loanAmount * PROCESSING_FEE_RATE);
    const interest = Math.round(loanAmount * (interestRate / 100) * tenureInMonths);
    return {
      processingFee: fee,
      youReceive: loanAmount - fee,
      totalRepayment: loanAmount + interest,
    };
  }, [interestRate, loanAmount, tenureInMonths]);

  const handleTenureUnitChange = (nextUnit: TenureUnit) => {
    if (nextUnit === tenureUnit) return;
    setTenureUnit(nextUnit);
    setTenure(nextUnit === "months" ? 6 : 180);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMobileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(digits);
    setMobileError(null);
  };

  const handleStickySubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const digits = mobile.replace(/\D/g, "").slice(0, 10);
    const error = validateIndianMobile(digits);
    setMobileError(error);
    if (error) return;
    window.location.href = `/auth?mobile=${encodeURIComponent(digits)}`;
  };

  const tenureMin = tenureUnit === "months" ? TENURE_MONTHS_MIN : TENURE_DAYS_MIN;
  const tenureMax = tenureUnit === "months" ? TENURE_MONTHS_MAX : TENURE_DAYS_MAX;
  const tenureRightValue =
    tenureUnit === "months" ? (
      <span className="text-[0.95rem] font-bold text-primary sm:text-[1.1rem]">{tenure} Months</span>
    ) : (
      <span className="text-[0.95rem] font-bold text-primary sm:text-[1.1rem]">{tenure} Days</span>
    );

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <div
        className={`fixed inset-x-0 bottom-0 z-40 transition-all duration-300 ${showStickyBar
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
          }`}
      >
        <div className="w-full bg-primary px-3 py-2 shadow-[0_-8px_24px_rgba(0,101,37,0.2)] sm:px-6 sm:py-2.5">
          <form
            onSubmit={handleStickySubmit}
            className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3"
          >
            <p className="text-center text-sm font-semibold text-white sm:text-left">
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
                className={`min-h-[38px] w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition sm:w-[220px] ${mobileError
                  ? "border-red-400 focus:border-red-500"
                  : "border-white/20 focus:border-white/40"
                  }`}
              />
              <button
                type="submit"
                className="min-h-[38px] w-full shrink-0 rounded-lg border border-white/80 bg-[#065d20] px-4 text-sm font-semibold text-white transition hover:bg-[#054c1a] sm:w-auto"
              >
                Get Loan
              </button>
            </div>
          </form>
          {mobileError ? (
            <p
              id="dashboard-sticky-mobile-error"
              className="mt-1 text-center text-xs text-red-100"
              role="alert"
            >
              {mobileError}
            </p>
          ) : null}
        </div>
      </div>

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

        <section
          className="mx-auto grid w-full max-w-7xl gap-10 rounded-4xl px-4 pb-10 pt-10 sm:px-6  sm:pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 lg:px-8  lg:pt-20"
        >
          <div className="order-2 max-w-2xl lg:order-1">
            <h1 className="text-[2rem] font-semibold tracking-[-0.05em] text-primary sm:text-[2.2rem] lg:text-[3.2rem]">
              Get Instant Personal Loans 
              <br className="hidden md:block" />
              &nbsp;up to ₹ 5,00,000
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 md:mt-5 text-slate-700 md:text-[1rem]">
              Fast approval, minimal documentation, and money directly in your bank account.
              Experience the next generation of credit.
            </p>
            <div className="mt-7 hidden flex-wrap items-center gap-3 md:flex">
              <GooglePlayBadge />
              <AppStoreBadge />
            </div>
            <div className="mt-5 md:mt-7 md:hidden">
              <HeroLoggedOutForm
                mobile={mobile}
                setMobile={setMobile}
                mobileError={mobileError}
                setMobileError={setMobileError}
                className="!px-0"
              />
            </div>
          </div>

          <div className="order-1 hidden rounded-[1.4rem] border border-white/70 bg-white p-4 shadow-[0_14px_44px_rgba(15,23,42,0.08)] sm:p-5 md:block lg:order-2">
            <h2 className="text-[1.1rem] font-semibold tracking-[-0.03em] text-slate-900 sm:text-[1.2rem]">
              Personal Loan EMI Calculator
            </h2>

            <div className="mt-4 space-y-4">
              <SliderField
                label="Loan Amount"
                value={loanAmount}
                min={LOAN_AMOUNT_MIN}
                max={LOAN_AMOUNT_MAX}
                step={500}
                onChange={setLoanAmount}
                renderTopRight={
                  <p className="text-[1rem] font-bold text-primary sm:text-[1.25rem]">
                    {formatCurrency(loanAmount)}
                  </p>
                }
                leftCaption={formatCurrency(LOAN_AMOUNT_MIN)}
                rightCaption={formatCurrency(LOAN_AMOUNT_MAX)}
              />

              <SliderField
                label={`Tenure (${tenureUnit === "months" ? "Monthly" : "Daily"})`}
                value={tenure}
                min={tenureMin}
                max={tenureMax}
                step={1}
                onChange={setTenure}
                renderTopRight={
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#f2f6ef] p-0.5">
                    <button
                      type="button"
                      onClick={() => handleTenureUnitChange("months")}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${tenureUnit === "months"
                        ? "bg-[#d6e8d9] text-primary"
                        : "text-primary/80 hover:bg-[#e6efe4]"
                        }`}
                    >
                      Months
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTenureUnitChange("days")}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${tenureUnit === "days"
                        ? "bg-[#d6e8d9] text-primary"
                        : "text-primary/80 hover:bg-[#e6efe4]"
                        }`}
                    >
                      Days
                    </button>
                  </div>
                }
                leftCaption={tenureUnit === "months" ? "1 MONTH" : "10 DAYS"}
                rightCaption={tenureUnit === "months" ? "12 MONTHS" : "365 DAYS"}
                valueBelowTrack={tenureRightValue}
              />

              <SliderField
                label="Rate of Interest"
                value={interestRate}
                min={INTEREST_RATE_MIN}
                max={INTEREST_RATE_MAX}
                step={0.1}
                onChange={setInterestRate}
                renderTopRight={
                  <p className="text-[1rem] font-bold text-primary sm:text-[1.25rem]">
                    {interestRate.toFixed(1)} %
                  </p>
                }
                leftCaption={`${INTEREST_RATE_MIN}%`}
                rightCaption={`${INTEREST_RATE_MAX}%`}
              />
            </div>

            <div className="mt-4 overflow-hidden rounded-xl bg-[#eef2e9]">
              <div className="flex items-center justify-between gap-4 px-4 py-2.5 text-[0.82rem] text-slate-600 sm:px-5">
                <span>You receive</span>
                <span className="font-semibold text-slate-800">{formatCurrency(youReceive)}</span>
              </div>
              <div className="h-px bg-[#dfe6d8]" />
              <div className="flex items-center justify-between gap-4 px-4 py-2.5 text-[0.82rem] text-slate-600 sm:px-5">
                <span>Total repayment</span>
                <span className="text-[0.95rem] font-bold text-primary sm:text-[1rem]">{formatCurrency(totalRepayment)}</span>
              </div>
            </div>

            <p className="mt-1.5 text-[0.7rem] text-slate-500">
              Includes an estimated processing fee of {formatCurrency(processingFee)} + GST.
            </p>

            <Link
              href="/auth"
              className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Get Loan Now
            </Link>
          </div>
        </section>
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[1.5rem] font-semibold tracking-[-0.05em] text-slate-900 sm:text-[2.55rem]">
            Loan Details &amp; Transparency
          </h2>
          {/* <p className="mt-4 hidden md:block  text-base leading-7 md:leading-8 text-primary sm:text-[1.02rem]">
            We believe in complete transparency. Here&apos;s everything you need to know before
            taking a loan with ZapCash. No hidden fees, just honest finance.
          </p> */}
        </div>

        <div className="mt-8 md:mt-5 grid gap-4 grid-cols-1 sm:grid-cols-3">
          {TRANSPARENCY_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-[10px] border border-primary/65 bg-[linear-gradient(180deg,#f7fcf8_0%,#f2f8f3_100%)] px-6 py-5 text-center"
            >
              <Image
                src={card.iconSrc}
                alt={card.iconAlt}
                width={34}
                height={30}
                className="mx-auto h-[28px] w-auto object-contain"
              />
              <h3 className="mt-3 text-[0.9rem] font-semibold text-slate-800">{card.title}</h3>
              <p className="mt-2 text-base leading-[1.35] text-slate-600">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-16 md:mt-16">
          <h2 className="text-center text-[1.5rem] font-semibold tracking-[-0.04em] text-slate-900 sm:text-[1.75rem] md:text-[2rem] lg:text-[2.25rem]">
            What You&apos;ll Need
          </h2>
          <div className="mx-auto mt-5 max-w-3xl rounded-[12px] border border-primary/55 bg-[linear-gradient(180deg,#f7fcf8_0%,#eef6f0_100%)] p-4 shadow-[0_10px_30px_rgba(0,101,37,0.08)] sm:mt-6 sm:rounded-[14px] sm:p-5 md:p-6">
            <ul className="flex flex-col gap-4 sm:gap-5">
              {WHAT_YOU_NEED_ITEMS.map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-3 sm:items-center sm:gap-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-9 sm:w-9 md:h-10 md:w-10">
                    <WhatYouNeedIcon type={item.icon} />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5 md:flex-row md:items-center md:gap-6">
                    <p className="shrink-0 text-[0.85rem] font-semibold text-slate-900 sm:text-sm md:w-[150px] md:text-[0.95rem] lg:w-[180px]">
                      {item.title}
                    </p>
                    <p className="text-[0.8rem] leading-5 text-slate-600 sm:text-[0.85rem] sm:leading-6 md:text-[0.9rem] lg:text-[0.95rem]">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 md:mt-16">
          <FAQSection startBatch={0} />
        </div>

      </section>

      <Footer />
    </div>
  );
}
