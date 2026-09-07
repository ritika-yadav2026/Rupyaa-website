"use client";

/**
 * Post-offer journey hero: sanctioned amount, tenure / total-payable tiles, stepper (`children`), CTA.
 *
 * **When shown:** `getLoggedInHeroUiCase(resolved) === "journey_post_offer"` from `HeroLoggedInCardArea` →
 * `HeroCardByResolved` (stage → card mapping lives in `lib/build-hero-home-card.ts`).
 *
 * **Where:** Logged-in home hero only; parent layout handles banner overlay on small screens.
 *
 * **Shared UI:** Same `HeroCardGridShell` as `PreOfferCard`. Application id sits in the header row
 * with `ZapcashLogo` (`justify-between`); optional `statusPill` renders below that row when set.
 */

import type { ReactNode } from "react";
import { HeroCardGridShell } from "@/components/home/HeroCardGridShell";
import { PostOfferCtaWithOptionalRefresh } from "@/components/home/PostOfferCtaWithOptionalRefresh";
import { formatCurrency } from "@/lib/format-utils";
import ZapcashLogo from "@/components/ZapcashLogo";
import { buildPostOfferCtaElement } from "./post-offer-cta/build-post-offer-cta";
import { CancelLoanEntryLink } from "@/components/loan-cancellation/CancelLoanEntryLink";
import { useEnableFullWebJourney } from "@/hooks/useEnableFullWebJourney";

/** Mint fill for tenure / total payable tiles. */
const TILE_BG = "#E6F4EA";

export interface PostOfferCardProps {
  /** Reserved for contextual label; surfaced to assistive tech only when set. */
  title?: string;
  /** Application reference; when set, shown in the header row as `APPLICATION ID: …`. */
  applicationNumber?: string;
  /** Optional status pill below the header row (e.g. overdue). */
  statusPill?: string;
  /** Pill styling variant when `statusPill` is set. */
  statusPillVariant?: "active" | "overdue";
  /** Sanctioned / approved loan amount (large green line). */
  amount?: number;
  /** Tenure label, e.g. "90 Days". */
  tenure?: string;
  /** Total payable numeric (formatted as currency). */
  totalPayable?: number;
  actionLabel: string;
  loanId?: string;
  onActionPress?: () => void;
  disableAction?: boolean;
  hideAction?: boolean;
  /** When set, shows a refresh control beside the primary CTA (invalidates hero loan + user stage from parent). */
  onRefreshPress?: () => void;
  /** True while existing-active-loan or user-stage refetch is in flight. */
  isRefreshing?: boolean;
  /** Primary CTA link target when rendered as `Link` (default `/personal-loan`). */
  ctaHref?: string;
  /** Progress stepper and extra content rendered above the CTA. */
  children?: ReactNode;
  showCancelLoanEntry?: boolean;
  canCancelLoan?: boolean;
  onCancelLoanPress?: () => void;
}

function getApplicationStripLabel(applicationNumber?: string): string {
  const value = typeof applicationNumber === "string" ? applicationNumber.trim() : "";
  if (!value) return "";
  return `APPLICATION ID: ${value}`;
}

export function PostOfferCard({
  title,
  applicationNumber,
  statusPill,
  statusPillVariant,
  amount,
  tenure,
  totalPayable,
  actionLabel,
  loanId,
  onActionPress,
  disableAction = false,
  hideAction = false,
  onRefreshPress,
  isRefreshing = false,
  ctaHref,
  children,
  showCancelLoanEntry = false,
  canCancelLoan = false,
  onCancelLoanPress,
}: PostOfferCardProps) {
  const hasAction = typeof onActionPress === "function" || !!loanId || !disableAction;
  const isInteractive = hasAction && !disableAction;
  const enableFullWebJourney = useEnableFullWebJourney();
  const stripLabel = getApplicationStripLabel(applicationNumber);
  const totalPayableFormatted =
    totalPayable != null && typeof totalPayable === "number"
      ? formatCurrency(totalPayable)
      : undefined;

  const showTiles = tenure != null || totalPayableFormatted != null;

  const ctaContent = (
    <span className="text-base sm:text-lg font-bold text-white tracking-tight">{actionLabel}</span>
  );

  const ctaBase =
    "py-3.5 sm:py-4 rounded-2xl text-center transition-colors font-bold shadow-sm border-0";
  const ctaWidthClass = typeof onRefreshPress === "function" ? "min-w-0 flex-1 w-full" : "w-full";
  const ctaEnabledClass =
    `${ctaBase} ${ctaWidthClass} bg-primary text-white hover:bg-primary/90 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`;
  const ctaDisabledClass = `${ctaBase} ${ctaWidthClass} bg-gray-400 text-white cursor-not-allowed`;

  const ctaElement = buildPostOfferCtaElement({
    ctaContent,
    ctaEnabledClass,
    ctaDisabledClass,
    isInteractive,
    loanId,
    onActionPress,
    href: ctaHref,
    enableFullWebJourney,
  });

  return (
    <HeroCardGridShell>

      <div className="px-4 sm:px-6 pb-4 pt-4 sm:pb-5 sm:pt-5">
        <div>
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center">
              <ZapcashLogo width={56} height={56} />
            </div>
            {stripLabel ? (
              <p
                className="min-w-0 max-w-[min(260px,72vw)] text-right text-sm font-bold uppercase leading-snug tracking-wide text-primary sm:text-base"
                title={stripLabel}
              >
                <span className="wrap-break-word">{stripLabel}</span>
              </p>
            ) : null}
          </div>
          {statusPill != null && statusPill.trim().length > 0 ? (
            <div className="mt-2 flex justify-end">
              <div
                className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${statusPillVariant === "overdue"
                    ? "bg-red-50 text-red-600"
                    : "border border-primary/25 bg-[#EEF6EF] text-primary"
                  }`}
              >
                {statusPill.trim().toUpperCase()}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 space-y-1.5 sm:mt-7">
          <p className="text-sm font-normal text-gray-500 sm:text-base">Your Approved Loan Amount</p>
          {amount != null && typeof amount === "number" ? (
            <p className="text-[2rem] font-bold leading-none tracking-tight text-primary tabular-nums sm:text-[2.625rem] md:text-[2.75rem]">
              {formatCurrency(amount)}
            </p>
          ) : (
            <p className="text-xl font-semibold text-gray-400">—</p>
          )}
        </div>

        {showTiles ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-3.5">
            <div
              className="rounded-xl px-3 py-3 sm:rounded-2xl sm:py-4"
              style={{ backgroundColor: TILE_BG }}
            >
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500 sm:text-[11px]">
                TENURE
              </p>
              <p className="text-sm font-bold tabular-nums text-primary sm:text-base">{tenure ?? "—"}</p>
            </div>
            <div
              className="rounded-xl px-3 py-3 sm:rounded-2xl sm:py-4"
              style={{ backgroundColor: TILE_BG }}
            >
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500 sm:text-[11px]">
                TOTAL PAYABLE
              </p>
              <p className="text-sm font-bold tabular-nums text-primary sm:text-base">
                {totalPayableFormatted ?? "—"}
              </p>
            </div>
          </div>
        ) : null}

        {children ? <div className="mt-6 sm:mt-7">{children}</div> : null}

        {!hideAction ? (
          <div className="mt-6 sm:mt-7">
            <PostOfferCtaWithOptionalRefresh onRefreshPress={onRefreshPress} isRefreshing={isRefreshing}>
              {ctaElement}
            </PostOfferCtaWithOptionalRefresh>
            {showCancelLoanEntry ? (
              <div className="mt-4">
                <CancelLoanEntryLink
                  showLink={canCancelLoan === true}
                  onLinkPress={onCancelLoanPress ?? (() => undefined)}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </HeroCardGridShell>
  );
}
