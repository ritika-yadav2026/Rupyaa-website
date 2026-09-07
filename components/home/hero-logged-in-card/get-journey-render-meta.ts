import type { HeroHomeResolvedCard } from "@/lib/build-hero-home-card";
import { resolveHeroPrimaryActionLabel } from "@/lib/build-hero-home-card";
import { getLoggedInHeroUiCase } from "@/lib/hero-home-card-case";
import { UserStagesInBackend } from "@/lib/user-stage";
import type { JourneyRenderMeta } from "@/types/hero-logged-in-card";

/**
 * Derives journey-card CTA and strip metadata from `resolved`.
 *
 * Rules (keep in sync with `lib/build-hero-home-card.ts`):
 * - `shouldHandleOfferAccept` — post-offer AND `hasOffer`
 * - `disablePostOfferAction` — post-offer, stage OFFERINGS, no offer yet
 */
export function getJourneyRenderMeta(resolved: HeroHomeResolvedCard): JourneyRenderMeta {
  const hasOffer = resolved.hasOffer === true;
  const heroUiCase = getLoggedInHeroUiCase(resolved);
  const isPreOffer = heroUiCase === "journey_pre_offer";
  const isPostOffer = heroUiCase === "journey_post_offer";

  const shouldHandleOfferAccept = isPostOffer && hasOffer;

  const disablePostOfferAction =
    isPostOffer && resolved.parsedStage === UserStagesInBackend.OFFERINGS && !hasOffer;

  const actionLabel = resolveHeroPrimaryActionLabel(resolved);

  const statusPillLabel = isPreOffer
    ? "PRE-APPROVED"
    : resolved.applicationNumber
      ? `APPLICATION ID: ${resolved.applicationNumber}`
      : undefined;

  return {
    actionLabel,
    hasOffer,
    isPreOffer,
    isPostOffer,
    shouldHandleOfferAccept,
    disablePostOfferAction,
    statusPillLabel,
  };
}
