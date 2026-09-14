import type { ReactElement } from "react";
import Link from "next/link";

const HERO_FEATURES = [
  { label: "100% Digital Process", icon: "digital" },
  { label: "Transparent Terms", icon: "terms" },
  { label: "Secure KYC", icon: "kyc" },
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
      <rect x="6" y="10" width="12" height="10" rx="2" stroke="#111827" strokeWidth="1.7" />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="#111827" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function LoanHeroIntro(): ReactElement {
  return (
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
  );
}
