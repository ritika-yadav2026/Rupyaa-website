"use client";

import Image from "next/image";
import {
  ClockBadgeIcon,
  NON_SALARY_BENEFIT_ICONS,
  NonSalaryIllustration,
  StarBadgeIcon,
} from "@/components/icons";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { IMAGES } from "@/lib/images";
import { NON_SALARY_MODAL_COPY } from "./constants";
import { buildRecommendationMessage } from "./formatSalarySuffixHint";

type Props = {
  isOpen: boolean;
  salaryAccounts: string[];
  isSubmitting: boolean;
  onChangeAccount: () => void;
  onContinue: () => void;
};

export default function NonSalaryAccountModal({
  isOpen,
  salaryAccounts,
  isSubmitting,
  onChangeAccount,
  onContinue,
}: Props) {
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const recommendationBody = buildRecommendationMessage(salaryAccounts);

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center overflow-hidden overscroll-none p-0 md:p-6 lg:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="non-salary-account-title"
    >
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] md:bg-black/50" aria-hidden="true" />

      <div
        className="
          relative flex w-full flex-col bg-white shadow-2xl overflow-y-auto
          h-dvh max-h-dvh rounded-none
          md:h-auto md:max-h-[min(90vh,880px)] md:max-w-xl md:rounded-2xl
          lg:max-w-2xl
        "
      >
        <div className="flex flex-1 flex-col px-5 pt-5 py-12 sm:px-7 sm:pt-7 sm:pb-8 md:px-8 md:py-8 lg:px-10">
          <div className="sm:hidden flex mb-4 items-center gap-2.5">
            <Image
              src={IMAGES.zapcashLogo}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
            <span className="text-lg font-bold text-gray-900 tracking-tight">ZapCash</span>
          </div>

          <h2
            id="non-salary-account-title"
            className="mb-4 text-center text-xl md:text-2xl font-bold leading-snug text-gray-900"
          >
            {NON_SALARY_MODAL_COPY.title}
          </h2>

          <div className="mb-4 flex justify-center">
            <NonSalaryIllustration />
          </div>

          <p className="mb-5 text-center text-sm md:text-base leading-relaxed text-gray-600 px-1 md:px-4 lg:px-8">
            {NON_SALARY_MODAL_COPY.bodyPrefix}
            <span className="font-semibold text-primary">
              {NON_SALARY_MODAL_COPY.bodyEmphasis}
            </span>
            {NON_SALARY_MODAL_COPY.bodySuffix}
          </p>

          <div className="space-y-3 mb-5 md:mb-6">
            <div className="rounded-xl border border-primary/70 bg-primary/10 px-3.5 py-3 md:px-4 md:py-4">
              <div className="flex items-start gap-3">
                <StarBadgeIcon />
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-bold text-primary leading-snug">
                    {NON_SALARY_MODAL_COPY.recommendationTitle}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {recommendationBody}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white px-3.5 py-3 md:px-4 md:py-4">
              <div className="flex items-start gap-3">
                <ClockBadgeIcon />
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-bold text-primary leading-snug">
                    {NON_SALARY_MODAL_COPY.manualReviewTitle}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {NON_SALARY_MODAL_COPY.manualReviewBody}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <div className="relative mb-4 flex items-center">
              <div className="flex-1 border-t border-gray-200" aria-hidden="true" />
              <span className="mx-3 shrink-0 text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap">
                {NON_SALARY_MODAL_COPY.whyUseSalaryHeader}
              </span>
              <div className="flex-1 border-t border-gray-200" aria-hidden="true" />
            </div>

            <div className="rounded-xl bg-gray-50 px-3 py-4 md:px-6 md:py-6">
              <div className="grid grid-cols-3 gap-3 md:gap-6">
                {NON_SALARY_MODAL_COPY.whyUseSalaryBenefits.map((benefit, index) => {
                  const Icon = NON_SALARY_BENEFIT_ICONS[index];
                  return (
                    <div key={benefit.title} className="flex flex-col items-center text-center gap-1.5 md:gap-2">
                      <Icon />
                      <p className="text-xs md:text-sm font-bold text-gray-900 leading-tight">
                        {benefit.title}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">
                        {benefit.subtext}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 md:max-w-md md:mx-auto md:w-full lg:max-w-lg">
            <button
              type="button"
              onClick={onChangeAccount}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-primary py-3.5 text-sm md:text-base font-bold text-white min-h-[48px] hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {NON_SALARY_MODAL_COPY.changeAccountCta}
            </button>
            <button
              type="button"
              onClick={onContinue}
              disabled={isSubmitting}
              className="w-full rounded-xl border-2 border-primary bg-white py-3.5 text-sm md:text-base font-bold text-primary min-h-[48px] hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Saving..." : NON_SALARY_MODAL_COPY.continueCta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
