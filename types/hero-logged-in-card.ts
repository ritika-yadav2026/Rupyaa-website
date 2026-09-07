import type { ActiveLoan } from "@/lib/eligibility-api";

/** Loan fields read by journey + active hero cards in this area. */
export type DisplayLoan = Pick<ActiveLoan, "_id" | "amount" | "tenure" | "totalPayable" | "status"> & {
  amountDue?: number;
  dueDate?: string;
  totalAmountPaid?: number;
  isOverdue?: boolean;
};

/**
 * Pre-computed metadata for journey hero variants (pre-offer / post-offer).
 * Built in `get-journey-render-meta.ts` from `HeroHomeResolvedCard` + `getLoggedInHeroUiCase`.
 */
export type JourneyRenderMeta = {
  readonly actionLabel: string;
  /** True when loan is verified — pending offer to accept (CTA may call `onAcceptOffer`). */
  readonly hasOffer: boolean;
  readonly isPreOffer: boolean;
  readonly isPostOffer: boolean;
  readonly shouldHandleOfferAccept: boolean;
  readonly disablePostOfferAction: boolean;
  readonly statusPillLabel?: string;
};
