"use client";

import { useRouter } from "next/navigation";
import {
  appShellContainerClassName,
  homeSectionSpacingClassName,
  homeSectionTopSpacingClassName,
} from "@/lib/app-shell-layout";
import CreditScorePromoBanner from "@/components/credit-score/CreditScorePromoBanner";

/**
 * Homepage strip that surfaces the free credit score check and routes to the
 * dedicated flow.
 */
export default function CreditScoreBannerSection() {
  const router = useRouter();
  return (
    <section className="bg-white">
      <div
        className={`${appShellContainerClassName} ${homeSectionTopSpacingClassName} ${homeSectionSpacingClassName}`}
      >
        <CreditScorePromoBanner onStart={() => router.push("/credit-score")} />
      </div>
    </section>
  );
}
