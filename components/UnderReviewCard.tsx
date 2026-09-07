"use client";

import { HeroCardGridShell } from "@/components/home/HeroCardGridShell";
import { StatusStrip } from "@/components/home/StatusStrip";
import ZapcashLogo from "@/components/ZapcashLogo";

type UnderReviewCardProps = {
  applicationNumber?: string | null;
  onRefresh: () => void;
  isRefreshing?: boolean;
};

export default function UnderReviewCard({
  applicationNumber,
  onRefresh,
  isRefreshing = false,
}: UnderReviewCardProps) {
  const trimmedId = typeof applicationNumber === "string" ? applicationNumber.trim() : "";

  return (
    <HeroCardGridShell>
      <StatusStrip
        statusLabel="UNDER REVIEW"
        pillClassName="border border-primary/25 bg-[#EEF6EF]"
        pillTextClassName="text-primary"
      />

      <div className="px-4 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center">
            <ZapcashLogo width={56} height={56} />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-base font-medium leading-snug text-gray-900 sm:text-lg">Your Application is</p>
            <p className="text-xl font-bold leading-tight text-primary sm:text-2xl">Under Review</p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 sm:gap-3">
          {trimmedId ? (
            <div className="min-w-0 flex-1 rounded-full border border-primary/30 bg-[#E6F4EA] px-4 py-2.5 text-sm font-semibold text-primary text-center">
              Application ID : <span className="font-mono font-semibold ">{trimmedId}</span>
            </div>
          ) : (
            <div className="min-w-0 flex-1" aria-hidden />
          )}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-primary/40 bg-white text-primary shadow-sm transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:w-12"
            aria-label="Refresh application status"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={isRefreshing ? "animate-spin" : ""}
              aria-hidden
            >
              <path d="M23 4v6h-6" />
              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
            </svg>
          </button>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:mt-6">
          We&apos;re verifying your details. Update coming soon.
        </p>
      </div>
    </HeroCardGridShell>
  );
}
