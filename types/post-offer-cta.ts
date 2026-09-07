import type { ReactNode } from "react";

/** Inputs for rendering the post-offer primary CTA (button vs link vs disabled). */
export type BuildPostOfferCtaElementArgs = {
  ctaContent: ReactNode;
  ctaEnabledClass: string;
  ctaDisabledClass: string;
  isInteractive: boolean;
  loanId?: string;
  onActionPress?: () => void;
  /** Navigation target when CTA is a link. Defaults to {@link POST_OFFER_CTA_DEFAULT_HREF}. */
  href?: string;
  /** From GET /external/config; when false, button CTA opens the Play Store. */
  enableFullWebJourney?: boolean;
};
