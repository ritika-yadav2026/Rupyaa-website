"use client";

/**
 * Pre-offer journey hero: instant-loan teaser, feature chips, journey stepper (`children`), and CTA.
 *
 * **When shown:** `getLoggedInHeroUiCase(resolved) === "journey_pre_offer"` from `HeroLoggedInCardArea` →
 * `HeroCardByResolved` (which branch is chosen is defined in `lib/build-hero-home-card.ts`).
 *
 * **Where:** Logged-in home hero only; `HeroCardResponsiveLayout` positions the card over the
 * mobile banner — this component owns **card chrome** (shell, strip, content), not page placement.
 *
 * **Shared UI:** Uses `HeroCardGridShell` + `StatusStrip` with defaults from `lib/hero-card-visuals.ts`
 * so grid texture and strip styling stay in sync with `PostOfferCard`.
 */

import Link from "next/link";
import { HeroCardGridShell } from "@/components/home/HeroCardGridShell";
import { StatusStrip } from "@/components/home/StatusStrip";
import { formatCurrency } from "@/lib/format-utils";
import ZapcashLogo from "../ZapcashLogo";
import Image from "next/image";
import { IMAGES } from "@/lib/images";

/** Design-reference greens (screenshot ~Figma palette; CTA aligns with `#2E5C32`). */
const FOREST_GREEN = "#2E5C32";
const ICON_TILE_BG = "#D4E7D7";

const DEFAULT_ACTIVE_LOAN_AMOUNT = 5_00_000;

export interface PreOfferCardProps {
  heading?: string;
  amount?: number;
  description?: string;
  statusPill?: string;
  titleBadgeVariant?: "warning";
  title?: string;
  footerMessage?: string;
  actionLabel?: string;
  actionHref?: string;
  children?: React.ReactNode;
}

function LightningBoltIcon({ color = FOREST_GREEN }: { color?: string }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path fill={color} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx={12} cy={12} r={10} />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export function PreOfferCard({
  heading = "Instant Loan up to",
  amount = DEFAULT_ACTIVE_LOAN_AMOUNT,
  statusPill,
  titleBadgeVariant,
  title = "Check loan offers",
  footerMessage = "No impact on credit score",
  actionLabel = "Check Eligibility",
  actionHref = "/personal-loan",
  children,
}: PreOfferCardProps) {
  const pillText =
    typeof statusPill === "string" && statusPill.trim().length > 0 ? statusPill.trim() : "PRE-APPROVED";
  const isWarning = titleBadgeVariant === "warning";

  const ctaClass =
    "mt-8 block w-full rounded-xl bg-[#2E5C32] px-4 py-3.5 text-center text-base font-bold text-white transition-all hover:brightness-[0.96] active:scale-[0.99] shadow-[0_0_0_1px_rgba(59,130,246,0.12),0_10px_28px_-6px_rgba(37,99,235,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E5C32]/40";

  return (
    <HeroCardGridShell>
      <StatusStrip
        statusLabel={isWarning ? "UNDER REVIEW" : pillText}
        pillClassName={isWarning ? "border-amber-600/70 bg-amber-50" : undefined}
        pillTextClassName={isWarning ? "text-amber-900" : undefined}
      />

      <div className="px-5 py-6 sm:px-6 sm:py-7">
        {typeof title === "string" && title.trim().length > 0 ? (
          <span className="sr-only">{title.trim()}</span>
        ) : null}

        {/* Icon + heading / amount (status lives on `StatusStrip` above). */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center"
          >
            <ZapcashLogo width={56} height={56} className="mb-4" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            {heading ? (
              <p className="text-[1.0625rem] font-medium leading-snug text-gray-900 sm:text-xl">{heading}</p>
            ) : null}
            {amount != null && typeof amount === "number" ? (
              <p
                className="text-[2rem] font-bold tracking-tight tabular-nums sm:text-[2.25rem]"
                style={{ color: FOREST_GREEN }}
              >
                {formatCurrency(amount)}
              </p>
            ) : null}
          </div>
        </div>

        {children}

        {actionLabel && actionHref ? (
          <Link href={actionHref} className={ctaClass}>
            {actionLabel}
          </Link>
        ) : null}

        {footerMessage != null && footerMessage.length > 0 ? (
          <div className="mt-5 flex items-center justify-center gap-1.5 px-2">
            <InfoIcon className="shrink-0 text-[#9CA3AF]" />
            <p className="text-center text-[11px] leading-snug text-[#6B7280] sm:text-xs">{footerMessage}</p>
          </div>
        ) : null}
      </div>
    </HeroCardGridShell>
  );
}
