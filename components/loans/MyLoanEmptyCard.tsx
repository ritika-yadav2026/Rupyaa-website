"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AppButton from "@/components/app-button";
import { IMAGES } from "@/lib/images";

type MyLoanEmptyCardProps = {
  readonly title?: string;
  readonly description?: string;
  readonly showApplyCta?: boolean;
};

/**
 * Empty-state card for the My Loans section (ongoing / history).
 */
export function MyLoanEmptyCard({
  title = "No active loans found",
  description = "You don't have any ongoing loans right now. Apply for a personal loan now.",
  showApplyCta = true,
}: MyLoanEmptyCardProps): ReactElement {
  const router = useRouter();

  let applyButton: ReactElement | null = null;
  if (showApplyCta) {
    applyButton = (
      <AppButton
        type="button"
        className="mt-2 w-full max-w-md"
        onClick={() => router.push("/personal-loan")}
      >
        Apply for a Loan
      </AppButton>
    );
  }

  return (
    <div className="flex w-full flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
      <div className="relative mb-6 h-44 w-full max-w-xs sm:h-52">
        <Image
          src={IMAGES.noLoan}
          alt=""
          fill
          className="object-contain"
          sizes="320px"
        />
      </div>
      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
        {description}
      </p>
      {applyButton}
    </div>
  );
}
