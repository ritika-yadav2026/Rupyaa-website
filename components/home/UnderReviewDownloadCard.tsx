'use client';

import type { ReactElement } from "react";
import { STRING_CONSTANTS } from "@/utils/app-constants";

type UnderReviewDownloadCardProps = {
  readonly title?: string;
  readonly description?: string;
  /** `track` shows primary CTA to resume journey; `download` keeps Download App. */
  readonly variant?: "download" | "track";
  readonly trackHref?: string;
  readonly trackLabel?: string;
  readonly statusPillLabel?: string;
  readonly applicationNumber?: string;
  readonly onRefreshPress?: () => void;
};

function ClockBadgeIcon(): ReactElement {
  return (
    <div className="w-12 h-12 rounded-2xl bg-[#E9F6EE] border border-[#CFE7D7] flex items-center justify-center text-primary shadow-[0_6px_16px_rgba(0,0,0,0.06)]">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function UnderReviewDownloadCard({
  title = "Your application is under review",
  description = "Please download the app for more details and updates on your loan journey.",
  variant = "download",
  trackHref = "/personal-loan",
  trackLabel = "Track Status",
  statusPillLabel,
  applicationNumber,
  onRefreshPress,
}: UnderReviewDownloadCardProps): ReactElement {
  const trimmedApplicationNumber =
    typeof applicationNumber === "string" ? applicationNumber.trim() : "";
  return (
    <div className="w-full rounded-3xl border border-[#C8D8D0] overflow-hidden bg-white/25 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
      <div className="p-4 sm:p-5 relative">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(900px 220px at 20% 0%, rgba(0,101,37,0.14), transparent 60%), radial-gradient(700px 220px at 95% 40%, rgba(0,101,37,0.10), transparent 55%)",
          }}
          aria-hidden
        />
        <div className="relative flex items-start gap-3">
          <ClockBadgeIcon />
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-gray-700 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        {/* {statusPillLabel ? <div className="mt-3"><HeroCardStatusStrip pillLabel={statusPillLabel} /></div> : null} */}
        {trimmedApplicationNumber ? (
          <div className="mt-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary">
            Application ID: {trimmedApplicationNumber}
          </div>
        ) : null}
        <div className="relative mt-4">
          <div className="h-px w-full bg-[#C8D8D0]/70" aria-hidden />
          <div className="mt-4 flex flex-col gap-3">
            {variant === "track" ? (
              <div className="flex items-center gap-2">
                <a
                  href={trackHref}
                  className="flex-1 inline-flex items-center justify-center rounded-2xl bg-primary text-white font-bold px-6 py-3.5 min-h-[48px] hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                >
                  {trackLabel}
                </a>
                {typeof onRefreshPress === "function" ? (
                  <button
                    type="button"
                    onClick={onRefreshPress}
                    className="h-[48px] min-w-[48px] rounded-2xl border border-primary/30 bg-white text-primary font-bold hover:bg-primary/5 transition-colors"
                    aria-label="Refresh application status"
                  >
                    ↻
                  </button>
                ) : null}
              </div>
            ) : (
              <a
                href={STRING_CONSTANTS.PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center rounded-2xl bg-primary text-white font-bold px-6 py-3.5 min-h-[48px] hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              >
                Download App
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

