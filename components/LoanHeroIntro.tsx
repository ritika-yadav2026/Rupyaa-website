import type { ReactElement } from "react";
import Link from "next/link";

const HERO_FEATURES = [
  { label: "100% Digital Process", icon: "digital" },
  { label: "Secure KYC", icon: "kyc" },
  { label: "Transparent Terms", icon: "terms" },
] as const;

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
      <path
        d="M12 3l7 3v5c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6l7-3z"
        stroke="#111827"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9.5 11.5l1.8 1.8 3.4-3.6" stroke="#111827" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LoanHeroIntro(): ReactElement {
  return (
    <div className="order-1 max-w-xl text-center lg:order-1 lg:text-left">
      <h1 className="text-[2.1rem] font-semibold leading-[1.12] tracking-[-0.04em] text-slate-900 sm:text-[2.6rem] lg:text-[3.25rem]">
        Your Plans
        <br />
        Don&apos;t Have To Wait
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600 sm:text-base sm:leading-7 lg:mx-0 lg:text-[1.05rem]">
        Fast Approval, Minimal Documentation, And Money Directly In Your Bank Account.
        Experience The Next Generation Of Credit.
      </p>
      <div className="mt-6 flex justify-center lg:mt-7 lg:justify-start">
        <Link
          href="/auth"
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-button px-8 text-sm font-semibold text-gray-900 transition hover:bg-button/90"
        >
          Apply Now
        </Link>
      </div>
      <ul className="mt-7 flex items-start justify-center gap-3 sm:mt-8 sm:gap-6 lg:justify-start">
        {HERO_FEATURES.map((feature) => (
          <li
            key={feature.label}
            className="flex max-w-[100px] flex-col items-center gap-2 text-center text-[11px] font-medium leading-tight text-slate-700 sm:max-w-none sm:flex-row sm:text-left sm:text-sm lg:items-center"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(15,23,42,0.08)]">
              <HeroFeatureIcon type={feature.icon} />
            </span>
            {feature.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
