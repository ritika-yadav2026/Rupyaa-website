"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import LoanHeroIntro from "@/components/LoanHeroIntro";
import styles from "./EMICalculatorSection.module.css";
import { formatCurrency } from "@/lib/format-utils";
import { appShellContainerClassName } from "@/lib/app-shell-layout";

const LOAN_AMOUNT_MIN = 5000;
const LOAN_AMOUNT_MAX = 100000;
const TENURE_MIN_MONTHS = 3;
const TENURE_MAX_MONTHS = 288; // 24 years
const TENURE_MAX_YEARS = 24;
const INTEREST_MIN = 8;
const INTEREST_MAX = 30;

function calculateEMI(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / months;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
}

function WalletIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-gray-600">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M16 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-gray-600">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function PercentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-gray-600">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6" />
      <path d="M9 9h.01" />
      <path d="M15 15h.01" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="absolute bottom-2 right-2 opacity-[0.08] text-white">
      <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm2 4v2h6V6H9zm0 4v2h6v-2H9zm0 4v2h4v-2H9zm5-8v2h2V6h-2zm0 4v2h2v-2h-2zm0 4v2h2v-2h-2z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

export default function EMICalculatorSection() {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [tenureValue, setTenureValue] = useState(24);
  const [tenureUnit, setTenureUnit] = useState<"months" | "years">("months");
  const [interestRate, setInterestRate] = useState(12.5);

  const tenureMonths = useMemo(() => {
    return tenureUnit === "months" ? tenureValue : tenureValue * 12;
  }, [tenureValue, tenureUnit]);

  const handleTenureUnitChange = (unit: "months" | "years") => {
    if (unit === tenureUnit) return;
    if (unit === "years") {
      setTenureValue(Math.max(1, Math.round(tenureValue / 12)));
      setTenureUnit("years");
    } else {
      setTenureValue(Math.min(288, tenureValue * 12));
      setTenureUnit("months");
    }
  };

  const { emi, totalInterest, totalPayable } = useMemo(() => {
    const emi = calculateEMI(loanAmount, interestRate, tenureMonths);
    const totalPayable = emi * tenureMonths;
    const totalInterest = totalPayable - loanAmount;
    return { emi, totalInterest, totalPayable };
  }, [loanAmount, interestRate, tenureMonths]);

  const tenureMin = tenureUnit === "months" ? TENURE_MIN_MONTHS : 1;
  const tenureMax = tenureUnit === "months" ? 24 : TENURE_MAX_YEARS;

  return (
    <section id="emi-calculator" className={styles.hero}>
      <div className={`${appShellContainerClassName} ${styles.layout}`}>
        <div className={styles.intro}><LoanHeroIntro /></div>
        <div className={styles.card}>
          <h2 className={styles.title}>Personal Loan EMI Calculator</h2>
          <div className={styles.controls}>
            {/* Left column - Inputs */}
            <div className={styles.inputs}>
              {/* Loan Amount */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <WalletIcon />
                    <label className="text-sm font-semibold text-gray-800">Loan Amount</label>
                  </div>
                  <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 bg-white text-gray-800 font-bold text-xs sm:text-sm min-w-[80px] sm:min-w-[100px] text-right">
                    {formatCurrency(loanAmount)}
                  </div>
                </div>
                <input
                  type="range"
                  aria-label="Loan amount"
                  min={LOAN_AMOUNT_MIN}
                  max={LOAN_AMOUNT_MAX}
                  step={1000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="emi-slider w-full"
                  style={{
                    background: `linear-gradient(to right, var(--brand-color) 0%, var(--brand-color) ${((loanAmount - LOAN_AMOUNT_MIN) / (LOAN_AMOUNT_MAX - LOAN_AMOUNT_MIN)) * 100}%, #e5e7eb ${((loanAmount - LOAN_AMOUNT_MIN) / (LOAN_AMOUNT_MAX - LOAN_AMOUNT_MIN)) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatCurrency(LOAN_AMOUNT_MIN)}</span>
                  <span>{formatCurrency(LOAN_AMOUNT_MAX)}</span>
                </div>
              </div>
              {/* Loan Tenure */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon />
                    <label className="text-xs sm:text-sm font-semibold text-gray-800">Loan Tenure</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-lg overflow-hidden border border-gray-200">
                      <button
                        type="button"
                        onClick={() => handleTenureUnitChange("months")}
                        className={`px-3 py-2 text-xs font-semibold transition-colors ${
                          tenureUnit === "months"
                            ? "bg-button text-gray-900"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        MONTHS
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTenureUnitChange("years")}
                        className={`px-3 py-2 text-xs font-semibold transition-colors ${
                          tenureUnit === "years"
                            ? "bg-button text-gray-900"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        YEARS
                      </button>
                    </div>
                    <div className={`px-4 py-2.5 rounded-lg border text-gray-800 font-bold text-sm min-w-[60px] text-center ${
                      tenureUnit === "months" ? "border-gray-200 bg-[#FFFCF4]" : "border-gray-200 bg-white"
                    }`}>
                      {tenureValue}
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  aria-label="Loan tenure"
                  min={tenureMin}
                  max={tenureMax}
                  step={1}
                  value={tenureValue}
                  onChange={(e) => setTenureValue(Number(e.target.value))}
                  className="emi-slider w-full"
                  style={{
                    background: `linear-gradient(to right, var(--brand-color) 0%, var(--brand-color) ${((tenureValue - tenureMin) / (tenureMax - tenureMin)) * 100}%, #e5e7eb ${((tenureValue - tenureMin) / (tenureMax - tenureMin)) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{tenureUnit === "months" ? `${TENURE_MIN_MONTHS} MONTHS` : "1 YEAR"}</span>
                  <span>{tenureUnit === "months" ? `${tenureMax} MONTHS` : `${tenureMax} YEARS`}</span>
                </div>
              </div>
              {/* Interest Rate */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <PercentIcon />
                    <label className="text-sm font-semibold text-gray-800">% Interest Rate (P.A.)</label>
                  </div>
                  <div className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-800 font-bold text-sm min-w-[70px] text-right">
                    {interestRate}%
                  </div>
                </div>
                <input
                  type="range"
                  aria-label="Interest rate"
                  min={INTEREST_MIN}
                  max={INTEREST_MAX}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="emi-slider w-full"
                  style={{
                    background: `linear-gradient(to right, var(--brand-color) 0%, var(--brand-color) ${((interestRate - INTEREST_MIN) / (INTEREST_MAX - INTEREST_MIN)) * 100}%, #e5e7eb ${((interestRate - INTEREST_MIN) / (INTEREST_MAX - INTEREST_MIN)) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{INTEREST_MIN}%</span>
                  <span>{INTEREST_MAX}%</span>
                </div>
              </div>
            </div>
            {/* Right column - Output */}
            <div className={styles.output}>
              <CalculatorIcon />
              <div className="relative z-10">
                <p className="text-white/90 text-2xl font-semibold uppercase tracking-wider mb-2">
                  Monthly EMI Amount
                </p>
                <p className="text-3xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
                  {formatCurrency(emi)}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Total Interest
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatCurrency(totalInterest)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Total Payable
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatCurrency(totalPayable)}
                    </p>
                  </div>
                </div>
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-button hover:bg-button/90 text-gray-900 font-semibold transition-colors"
                >
                  Get Loan Now
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
