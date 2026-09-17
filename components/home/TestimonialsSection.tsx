"use client";

import type { ReactElement } from "react";
import {
  appShellContainerClassName,
  homeSectionSpacingClassName,
} from "@/lib/app-shell-layout";

function StarIcon({ size = 14 }: { readonly size?: number }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "Rupyaa made my loan journey simple and stress-free. The process was quick, transparent, and I received the support I needed.",
    name: "Mansi",
    location: "Mumbai",
    initials: "M",
  },
  {
    quote:
      "I liked how straightforward the entire loan journey was. The steps were clear from start to finish.",
    name: "Akash Sharma",
    location: "Delhi",
    initials: "AS",
  },
  {
    quote:
      "The process was quick and convenient; I was able to complete my application online without any hassle.",
    name: "Priyanka Gupta",
    location: "Uttar Pradesh",
    initials: "PG",
  },
  {
    quote:
      "Getting funds when I needed them most felt easy. Clear steps and timely updates kept me confident throughout.",
    name: "Rohan Mehta",
    location: "Bengaluru",
    initials: "RM",
  },
  {
    quote:
      "Support was helpful and the approval felt fast. I would recommend Rupyaa to anyone looking for a simple loan experience.",
    name: "Neha Verma",
    location: "Jaipur",
    initials: "NV",
  },
  {
    quote:
      "Everything was transparent — from eligibility to disbursal. No confusion, just a smooth end-to-end process.",
    name: "Siddharth Rao",
    location: "Hyderabad",
    initials: "SR",
  },
] as const;

const RATING_VALUE = "4.9";

const MOBILE_REVIEWS_TRACK_CLASSNAME =
  "flex h-[156px] min-w-0 flex-1 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] [touch-action:pan-x_pan-y] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

/**
 * Compact mobile rating card — same width as comment cards.
 */
function MobileRatingPanel(): ReactElement {
  return (
    <div className="flex h-[156px] w-[135px] shrink-0 flex-col items-center justify-center bg-[#FECA42] px-3 text-center">
      <p className="text-[28px] font-extrabold leading-none text-gray-900">{RATING_VALUE}</p>
      <p className="mt-1.5 text-[10px] font-medium leading-tight text-gray-900">
        Customer Reviews
      </p>
      <div className="mt-1.5 flex gap-0.5 text-gray-900">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon key={i} size={11} />
        ))}
      </div>
    </div>
  );
}

/**
 * Desktop rating panel — same width as comment cards.
 */
function DesktopRatingPanel(): ReactElement {
  return (
    <div className="flex h-full w-[280px] flex-col items-center justify-center bg-[#FECA42] px-7 py-10 text-center">
      <p className="text-6xl font-extrabold leading-none text-gray-900">{RATING_VALUE}</p>
      <p className="mt-3 text-base font-medium text-gray-900">Customer Reviews</p>
      <div className="mt-4 flex gap-1 text-gray-900">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon key={i} />
        ))}
      </div>
    </div>
  );
}

type TestimonialBodyProps = {
  readonly quote: string;
  readonly name: string;
  readonly location: string;
  readonly initials: string;
  readonly className?: string;
  readonly quoteClassName?: string;
  readonly avatarClassName?: string;
  readonly nameClassName?: string;
  readonly locationClassName?: string;
  readonly metaClassName?: string;
};

/**
 * Quote + author block.
 */
function TestimonialBody({
  quote,
  name,
  location,
  initials,
  className = "",
  quoteClassName = "",
  avatarClassName = "",
  nameClassName = "",
  locationClassName = "",
  metaClassName = "",
}: TestimonialBodyProps): ReactElement {
  return (
    <div className={`flex h-full flex-col ${className}`}>
      <p className={quoteClassName}>{quote}</p>
      <div className={`flex items-center ${metaClassName}`}>
        <div className={avatarClassName}>{initials}</div>
        <div className="min-w-0">
          <p className={nameClassName}>{name}</p>
          <p className={locationClassName}>{location}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection(): ReactElement {
  return (
    <section className="bg-white">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName}`}>
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 sm:mb-10 sm:text-3xl lg:mb-12 lg:text-4xl">
          What our customer say
        </h2>

        {/* Mobile: sticky rating + horizontally scrollable reviews */}
        <div className="flex overflow-hidden rounded-2xl border border-[#FECA42] bg-[#FFFCF4] lg:hidden">
          <div className="sticky left-0 z-[1] shrink-0 self-stretch">
            <MobileRatingPanel />
          </div>
          <div className={MOBILE_REVIEWS_TRACK_CLASSNAME}>
            {TESTIMONIALS.map(({ quote, name, location, initials }) => (
              <TestimonialBody
                key={name}
                quote={quote}
                name={name}
                location={location}
                initials={initials}
                className="h-full w-[135px] shrink-0 border-l border-[#FECA42] px-3 py-3"
                quoteClassName="line-clamp-6 flex-1 text-[12px] leading-[1.35] text-gray-800"
                metaClassName="mt-2 gap-1.5"
                avatarClassName="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-gray-200 text-[9px] font-semibold text-gray-700"
                nameClassName="truncate text-[11px] font-bold leading-tight text-gray-900"
                locationClassName="truncate text-[10px] leading-tight text-gray-500"
              />
            ))}
          </div>
        </div>

        {/* Desktop: sticky rating + horizontally scrollable reviews */}
        <div className="hidden overflow-hidden rounded-2xl border border-[#FECA42] bg-[#FFFCF4] lg:flex">
          <div className="sticky left-0 z-[1] shrink-0 self-stretch">
            <DesktopRatingPanel />
          </div>
          <div className="flex min-w-0 flex-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {TESTIMONIALS.map(({ quote, name, location, initials }) => (
              <TestimonialBody
                key={name}
                quote={quote}
                name={name}
                location={location}
                initials={initials}
                className="w-[280px] shrink-0 border-l border-[#FECA42] px-7 py-10"
                quoteClassName="flex-1 text-[15px] leading-relaxed text-gray-600"
                metaClassName="mt-8 gap-3"
                avatarClassName="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700"
                nameClassName="text-sm font-bold text-gray-900"
                locationClassName="text-xs text-gray-500"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
