import type { ReactElement } from "react";
import Image from "next/image";
import { HOME_IMAGES } from "@/lib/images";

interface CreditScorePromoBannerProps {
  readonly onStart: () => void;
}

const BANNER_GRADIENT =
  "linear-gradient(90deg, #FECA42 0%, rgba(254,202,66,0.45) 32%, rgba(254,202,66,0.12) 58%, #FFFFFF 82%)";

/**
 * Homepage banner that introduces the free credit score check and starts the flow.
 * Mobile: compact side-by-side row. Desktop: original two-column layout unchanged.
 */
export default function CreditScorePromoBanner({
  onStart,
}: CreditScorePromoBannerProps): ReactElement {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-white sm:rounded-[28px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: BANNER_GRADIENT }}
      />
      {/* Mobile layout */}
      <div className="relative z-10 flex items-end gap-3 pl-2 pr-4 pt-3 sm:hidden">
        <div className="relative flex w-[42%] max-w-[150px] shrink-0 items-end justify-center pb-2">
          <Image
            src={HOME_IMAGES.creditScorePromo}
            alt="Track your credit score on Rupyaa"
            width={240}
            height={240}
            className="h-auto w-full max-w-[140px] object-contain object-bottom"
            sizes="140px"
            unoptimized
            priority={false}
          />
        </div>
        <div className="min-w-0 flex-1 pb-4 pt-1 text-left">
          <h2 className="text-base font-bold leading-tight tracking-tight text-gray-900">
            Track your credit score
          </h2>
          <p className="mt-1.5 text-[11px] leading-snug text-gray-600">
            Check your credit score in seconds and stay one step ahead of your financial goals.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-3 inline-flex min-h-[36px] items-center justify-center rounded-lg bg-[#1A1A1A] px-4 py-2 text-xs font-semibold text-[#FECA42] transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Check Now
          </button>
        </div>
      </div>
      {/* Desktop layout */}
      <div className="relative z-10 hidden grid-cols-1 items-center gap-2 px-6 py-2 sm:grid sm:grid-cols-2 sm:gap-8 sm:px-10 sm:py-2">
        <div className="relative flex w-full items-center justify-center pr-14 sm:pr-20 lg:pr-28">
          <Image
            src={HOME_IMAGES.creditScorePromo}
            alt="Track your credit score on Rupyaa"
            width={240}
            height={240}
            className="size-[240px] object-contain"
            sizes="240px"
            unoptimized
            priority={false}
          />
        </div>
        <div className="w-full text-center sm:text-left">
          <h2 className="text-[1.75rem] font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-3xl lg:text-[2.5rem]">
            Track your credit score
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:mt-4 sm:max-w-md sm:text-base lg:text-lg">
            Check your credit score in seconds and stay one step ahead of your financial goals.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-6 inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#1A1A1A] px-8 py-2.5 text-sm font-semibold text-[#FECA42] transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:mt-8"
          >
            Check Now
          </button>
        </div>
      </div>
    </section>
  );
}
