"use client";

import type { ReactElement } from "react";
import { CBL_STRIP_LABEL } from "@/config/loanStatusCardConfig";

type Props = {
  readonly title: string;
  readonly heading: string;
  readonly description: string;
  readonly stripLabel?: string;
};

export default function HeroCblRejectedCard({
  title,
  heading,
  description,
  stripLabel = CBL_STRIP_LABEL,
}: Props): ReactElement {
  return (
    <div
      className="flex w-full max-w-[560px] flex-col rounded-2xl px-6 py-6 sm:px-7 sm:py-7 mb-4 border shadow-[0_12px_32px_rgba(0,104,55,0.12)] bg-white/25 backdrop-blur-xl lg:bg-transparent lg:backdrop-blur-0"
      style={{ borderColor: "#C8D8D0" }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">{title}</p>
      {stripLabel ? (
        <div className="mb-3 inline-flex w-fit rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {stripLabel}
        </div>
      ) : null}
      <h2 className="text-lg font-extrabold text-gray-900 sm:text-xl leading-snug">{heading}</h2>
      {description ? <p className="mt-2 text-sm text-gray-600 leading-relaxed">{description}</p> : null}
    </div>
  );
}
