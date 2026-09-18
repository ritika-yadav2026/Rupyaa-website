import type { ReactElement } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format-utils";
import {
  HeroCheckIcon,
  HeroStatusCardShell,
} from "@/components/home/hero-status-card/HeroStatusCardShell";

const DEFAULT_LIMIT_AMOUNT = 50_000;

type HeroLimitCardProps = {
  readonly amount?: number;
  readonly actionHref?: string;
  readonly actionLabel?: string;
};

function ChevronIcon(): ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Logged-in marketing hero card: eligible limit + Apply CTA.
 */
export default function HeroLimitCard({
  amount = DEFAULT_LIMIT_AMOUNT,
  actionHref = "/personal-loan",
  actionLabel = "Apply for Loan",
}: HeroLimitCardProps): ReactElement {
  return (
    <HeroStatusCardShell>
      <p className="text-sm font-medium text-gray-800 sm:text-base">Your Rupyaa Limit Up to</p>
      <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-[2.75rem]">
        {formatCurrency(amount)}
      </p>
      <p className="mt-2 text-sm font-medium text-gray-700 sm:text-[15px]">
        Fast application. Hassle-free process.
      </p>
      <Link
        href={actionHref}
        className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#FECA42] px-5 py-3 text-sm font-bold text-gray-900 transition hover:bg-[#F5C038] focus:outline-none focus:ring-2 focus:ring-[#FECA42] focus:ring-offset-2 sm:mt-7 sm:min-h-[52px] sm:rounded-2xl sm:text-base"
      >
        {actionLabel}
        <ChevronIcon />
      </Link>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 sm:text-xs">
        <span className="text-gray-400">
          <HeroCheckIcon />
        </span>
        No impact on credit score . No Paperwork.
      </p>
    </HeroStatusCardShell>
  );
}
