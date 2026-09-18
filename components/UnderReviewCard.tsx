"use client";

import type { ReactElement } from "react";
import {
  HeroAppIdBadge,
  HeroArrowIcon,
  HeroStatusCardShell,
  HeroYellowButton,
} from "@/components/home/hero-status-card/HeroStatusCardShell";

type UnderReviewCardProps = {
  applicationNumber?: string | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

/**
 * Under-review logged-in hero card.
 */
export default function UnderReviewCard({
  applicationNumber,
}: UnderReviewCardProps): ReactElement {
  const trimmedId = typeof applicationNumber === "string" ? applicationNumber.trim() : "";
  let badge: ReactElement | undefined;
  if (trimmedId) {
    badge = <HeroAppIdBadge label={`Application ID : ${trimmedId}`} />;
  }
  return (
    <HeroStatusCardShell badge={badge}>
      <p className="text-sm font-medium text-gray-700 sm:text-base">Your Application is</p>
      <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        Under Review
      </h2>
      <p className="mt-2 text-sm text-gray-600 sm:text-[15px]">
        We&apos;re working on better loan options for you.
      </p>
      <div className="mt-6 sm:mt-7">
        <HeroYellowButton href="/credit-score">
          Check Credit Report
          <HeroArrowIcon />
        </HeroYellowButton>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-gray-500 sm:text-xs">
        We&apos;re carefully reviewing your application details. This process can take up to 6 days.
      </p>
    </HeroStatusCardShell>
  );
}
