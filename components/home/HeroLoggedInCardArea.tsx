"use client";

/**
 * Logged-in home hero: picks one card from `HeroHomeResolvedCard` and wraps it in responsive layout.
 *
 * - **Resolution logic:** `lib/build-hero-home-card.ts` + `getLoggedInHeroUiCase` (`parsedStage` + loan snapshot)
 * - **Switcher UI:** `hero-logged-in-card/HeroCardByResolved.tsx`
 * - **Layout:** `hero-logged-in-card/HeroCardResponsiveLayout.tsx`
 */

import { resolveHeroCardNode } from "@/components/home/hero-logged-in-card/HeroCardByResolved";
import { HeroCardResponsiveLayout } from "@/components/home/hero-logged-in-card/HeroCardResponsiveLayout";
import { logHeroLoggedInBranch } from "@/components/home/hero-logged-in-card/hero-logged-in-card-log";
import type { HeroHomeResolvedCard } from "@/lib/build-hero-home-card";
import { getLoggedInHeroUiCase } from "@/lib/hero-home-card-case";

export type HeroLoggedInCardAreaProps = {
  resolved: HeroHomeResolvedCard;
  journeyCardRemountKey: number;
  onAcceptOffer: () => void;
  onRefreshStatus?: () => void;
  /** True while user-stage or existing-active-loan query is refetching (hero refresh). */
  isRefreshingHeroData?: boolean;
  showCancelLoanEntry?: boolean;
  canCancelLoan?: boolean;
  onCancelLoanPress?: () => void;
};

export default function HeroLoggedInCardArea(props: HeroLoggedInCardAreaProps) {
  const content = resolveHeroCardNode(props);
  if (content == null) {
    logHeroLoggedInBranch("none", {
      reason: "resolveHeroCardNode returned null",
      heroUiCase: getLoggedInHeroUiCase(props.resolved),
      parsedStage: props.resolved.parsedStage,
    });
    return null;
  }
  return <HeroCardResponsiveLayout>{content}</HeroCardResponsiveLayout>;
  // return null
}
