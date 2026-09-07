"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { POST_OFFER_CTA_DEFAULT_HREF } from "@/utils/app-constants";
import type { BuildPostOfferCtaElementArgs } from "@/types/post-offer-cta";
import { STRING_CONSTANTS } from "@/utils/app-constants";

/**
 * Post-offer hero primary CTA: handler, loan-scoped link, generic link, or disabled.
 * Extend {@link BuildPostOfferCtaElementArgs} for new variants without changing {@link PostOfferCard} layout.
 */
export function buildPostOfferCtaElement({
  ctaContent,
  ctaEnabledClass,
  ctaDisabledClass,
  isInteractive,
  loanId,
  onActionPress,
  href = POST_OFFER_CTA_DEFAULT_HREF,
  enableFullWebJourney = false,
}: BuildPostOfferCtaElementArgs): ReactNode {
  if (typeof onActionPress === "function") {
    return (
      <button
        type="button"
        onClick={!enableFullWebJourney ? () => window.location.href = STRING_CONSTANTS.PLAY_STORE_URL : onActionPress}
        disabled={!isInteractive}
        className={isInteractive ? ctaEnabledClass : ctaDisabledClass}
      >
        {ctaContent}
      </button>
    );
  }

  if (loanId) {
    return (
      <Link
        href={href}
        className={`block ${isInteractive ? ctaEnabledClass : `${ctaDisabledClass} pointer-events-none`}`}
        aria-disabled={!isInteractive}
      >
        {ctaContent}
      </Link>
    );
  }

  if (isInteractive) {
    return (
      <Link href={href} className={`block ${ctaEnabledClass}`}>
        {ctaContent}
      </Link>
    );
  }

  return <div className={ctaDisabledClass}>{ctaContent}</div>;
}
