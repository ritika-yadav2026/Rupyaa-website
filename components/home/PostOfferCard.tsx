"use client";

/**
 * Post-offer journey hero: offer amount + tenure, optional stepper, Accept / continue CTA.
 */

import type { ReactElement, ReactNode } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format-utils";
import { CancelLoanEntryLink } from "@/components/loan-cancellation/CancelLoanEntryLink";
import { useEnableFullWebJourney } from "@/hooks/useEnableFullWebJourney";
import { buildPostOfferCtaElement } from "./post-offer-cta/build-post-offer-cta";
import {
  HeroAppIdBadge,
  HeroCheckIcon,
  HeroStatusCardShell,
  HeroYellowButton,
} from "@/components/home/hero-status-card/HeroStatusCardShell";

export interface PostOfferCardProps {
  title?: string;
  applicationNumber?: string;
  statusPill?: string;
  statusPillVariant?: "active" | "overdue";
  amount?: number;
  tenure?: string;
  totalPayable?: number;
  actionLabel: string;
  loanId?: string;
  onActionPress?: () => void;
  disableAction?: boolean;
  hideAction?: boolean;
  onRefreshPress?: () => void;
  isRefreshing?: boolean;
  ctaHref?: string;
  children?: ReactNode;
  showCancelLoanEntry?: boolean;
  canCancelLoan?: boolean;
  onCancelLoanPress?: () => void;
  /** When true, shows Accept Offer button; otherwise shows Complete Details journey CTA. */
  variant?: "accept" | "journey";
  journeyCtaTitle?: string;
  journeyCtaSubtitle?: string;
}

function UserIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

/**
 * Post-offer / mid-journey offer card for the logged-in hero.
 */
export function PostOfferCard({
  applicationNumber,
  amount,
  tenure,
  actionLabel,
  loanId,
  onActionPress,
  disableAction = false,
  hideAction = false,
  ctaHref,
  children,
  showCancelLoanEntry = false,
  canCancelLoan = false,
  onCancelLoanPress,
  variant = "accept",
  journeyCtaTitle = "Complete Your Details",
  journeyCtaSubtitle = "5 Minutes away from your Funds.",
}: PostOfferCardProps): ReactElement {
  const hasAction = typeof onActionPress === "function" || !!loanId || !disableAction;
  const isInteractive = hasAction && !disableAction;
  const enableFullWebJourney = useEnableFullWebJourney();
  const trimmedId = typeof applicationNumber === "string" ? applicationNumber.trim() : "";
  let badge: ReactElement | undefined;
  if (trimmedId) {
    badge = <HeroAppIdBadge label={`Application ID : ${trimmedId}`} />;
  }

  const tenureLabel =
    typeof tenure === "string" && tenure.trim().length > 0 ? tenure.trim() : null;

  let actionBlock: ReactNode = null;
  if (!hideAction) {
    if (variant === "journey") {
      const href = ctaHref ?? "/personal-loan";
      actionBlock = (
        <Link
          href={href}
          className="mt-5 flex w-full items-center gap-3 rounded-xl bg-[#FECA42] px-3 py-3 text-left transition hover:bg-[#F5C038] sm:mt-6 sm:px-4"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-gray-900">
            <UserIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-gray-900 sm:text-base">
              {journeyCtaTitle}
            </span>
            <span className="block text-xs text-gray-700 sm:text-sm">{journeyCtaSubtitle}</span>
          </span>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      );
    } else {
      const ctaContent = <span>{actionLabel}</span>;
      const ctaEnabledClass =
        "inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#FECA42] px-5 py-3 text-sm font-bold text-gray-900 transition hover:bg-[#F5C038] focus:outline-none focus:ring-2 focus:ring-[#FECA42] focus:ring-offset-2 sm:min-h-[52px] sm:text-base";
      const ctaDisabledClass = `${ctaEnabledClass} cursor-not-allowed opacity-60`;
      actionBlock = (
        <div className="mt-6 sm:mt-7">
          {buildPostOfferCtaElement({
            ctaContent,
            ctaEnabledClass,
            ctaDisabledClass,
            isInteractive,
            loanId,
            onActionPress,
            href: ctaHref,
            enableFullWebJourney,
          })}
        </div>
      );
    }
  }

  let amountBlock: ReactNode;
  if (amount != null && typeof amount === "number") {
    amountBlock = (
      <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-[2.75rem]">
        {formatCurrency(amount)}
      </p>
    );
  } else {
    amountBlock = <p className="mt-2 text-xl font-semibold text-gray-400">—</p>;
  }

  return (
    <HeroStatusCardShell badge={badge}>
      <p className="text-sm font-medium text-gray-700 sm:text-base">Your Rupyaa Offer</p>
      {amountBlock}
      {tenureLabel ? (
        <p className="mt-2 text-base font-semibold text-gray-800 sm:text-lg">
          Tenure : {tenureLabel}
        </p>
      ) : null}
      {children ? <div className="mt-5 sm:mt-6">{children}</div> : null}
      {actionBlock}
      {variant === "accept" ? (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 sm:text-xs">
          <span className="text-gray-400">
            <HeroCheckIcon />
          </span>
          No impact on credit score . No Paperwork
        </p>
      ) : null}
      {showCancelLoanEntry ? (
        <div className="mt-4">
          <CancelLoanEntryLink
            showLink={canCancelLoan === true}
            onLinkPress={onCancelLoanPress ?? (() => undefined)}
          />
        </div>
      ) : null}
    </HeroStatusCardShell>
  );
}
