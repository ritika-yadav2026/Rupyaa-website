"use client";

import type { ReactElement } from "react";
import {
  HeroArrowIcon,
  HeroStatusCardShell,
  HeroYellowButton,
} from "@/components/home/hero-status-card/HeroStatusCardShell";

type Props = {
  readonly title?: string;
  readonly heading?: string;
  readonly description?: string;
};

function HourglassIcon(): ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 2h12M6 22h12M8 2v4l4 4 4-4V2M8 22v-4l4-4 4 4v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * CBL / rejected hero card — Coming Soon / better options.
 */
export default function HeroCblRejectedCard({
  title = "Better Loan Options",
  heading = "COMING SOON...",
  description = "We're working on better loan options for you.",
}: Props): ReactElement {
  return (
    <HeroStatusCardShell>
      <div className="mx-auto mb-3 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-800 shadow-sm">
        Stay Tuned
        <span className="inline-flex size-4 items-center justify-center rounded-full bg-[#FECA42] text-[9px]" aria-hidden>
          🙂
        </span>
      </div>
      <p className="text-sm font-medium text-gray-700 sm:text-base">{title}</p>
      <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
        {heading}
      </h2>
      <p className="mt-2 text-sm text-gray-600 sm:text-[15px]">{description}</p>
      <div className="mt-6 sm:mt-7">
        <HeroYellowButton href="/credit-score">
          Check Credit Report
          <HeroArrowIcon />
        </HeroYellowButton>
      </div>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 sm:text-xs">
        <span className="text-gray-400">
          <HourglassIcon />
        </span>
        Check again in 30 days
      </p>
    </HeroStatusCardShell>
  );
}
