import Link from "next/link";
import {
  appShellContainerClassName,
  homeSectionSpacingClassName,
} from "@/lib/app-shell-layout";

function IdCardIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 sm:w-8 sm:h-8">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M8 12h8" />
      <path d="M8 16h4" />
      <circle cx="14" cy="9" r="2" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 sm:w-8 sm:h-8">
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M4 7h16" />
      <path d="M4 11h16" />
      <path d="M4 15h16" />
      <path d="M4 19h16" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 sm:w-8 sm:h-8">
      <path d="M3 21h18" />
      <path d="M3 10h18" />
      <path d="M5 6l7-3 7 3" />
      <path d="M4 10v11" />
      <path d="M20 10v11" />
      <path d="M8 14v3" />
      <path d="M12 14v3" />
      <path d="M16 14v3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 sm:w-8 sm:h-8">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

const CRITERIA = [
  { icon: IdCardIcon, label: "Valid Government ID" },
  { icon: MoneyIcon, label: "Proof of Income" },
  { icon: BankIcon, label: "Active Bank Account" },
  { icon: CalendarIcon, label: "Age 21+" },
] as const;

export default function EligibilitySection() {
  return (
    <section className="bg-white">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName}`}>
        <div className="flex flex-col-reverse md:flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
          <div className="flex-1 w-full order-2 lg:order-1">
            <h2 className="text-xl sm:text-2xl pb-4 md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 block md:hidden">
              Simple Eligibility Requirements
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {CRITERIA.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-[#DEE7DE] shadow-sm text-center min-h-[100px] sm:min-h-[140px]"
                >
                  <span className="text-[#38761D] mb-2 sm:mb-3 flex items-center justify-center">
                    <Icon />
                  </span>
                  <span className="text-gray-900 font-medium text-xs sm:text-base">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full order-1 lg:order-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 hidden md:block">
              Simple Eligibility Requirements
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6 md:mb-8">
              We believe in making financial access simple. To qualify for a ZapCash loan, you only
              need to meet a few basic criteria. Check your eligibility in less than 60 seconds
              without affecting your credit score.
            </p>
            <Link
              href="/personal-loan"
              className=" inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-[#2d5e16] transition-colors"
            >
              Check Eligibility
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
