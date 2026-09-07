"use client";

import { CheckIcon } from "@/components/icons";
import { LOAN_CANCELLATION_COPY } from "./constants";

type CancellationSuccessStepProps = {
  onContinueToHomepage: () => void;
};

export default function CancellationSuccessStep({
  onContinueToHomepage,
}: CancellationSuccessStepProps) {
  const copy = LOAN_CANCELLATION_COPY.success;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-primary/15 text-primary">
        <CheckIcon className="text-primary" width={44} height={44} />
      </div>
      <h2 className="mb-3 text-xl font-semibold text-gray-900">{copy.title}</h2>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-gray-500">
        {copy.subtitle}
      </p>
      <button
        type="button"
        onClick={onContinueToHomepage}
        className="min-h-[48px] min-w-[220px] rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:text-base"
      >
        {copy.continueCta}
      </button>
    </div>
  );
}
