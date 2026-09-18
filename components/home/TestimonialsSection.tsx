"use client";

import type { ReactElement } from "react";
import {
  appShellContainerClassName,
  homeSectionSpacingClassName,
} from "@/lib/app-shell-layout";

function StarIcon(): ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "The application process felt simple and easy to understand. I could complete everything without any confusion.",
    name: "Manvi",
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
] as const;

/**
 * Sticky yellow rating summary card (left rail).
 */
function RatingSummaryCard(): ReactElement {
  return (
    <div className="flex h-full min-h-[220px] w-[min(42vw,160px)] shrink-0 flex-col items-center justify-center bg-[#FECA42] px-4 py-8 text-center sm:w-[180px] sm:min-h-[240px] sm:px-5 lg:w-[200px] lg:min-h-[260px] lg:px-6 lg:py-10">
      <p className="text-4xl font-extrabold leading-none text-gray-900 sm:text-5xl lg:text-6xl">
        4.9
      </p>
      <p className="mt-2 text-xs font-medium text-gray-900 sm:mt-3 sm:text-sm lg:text-base">
        Customer Reviews
      </p>
      <div className="mt-3 flex gap-0.5 text-gray-900 sm:mt-4 sm:gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon key={i} />
        ))}
      </div>
    </div>
  );
}

type TestimonialCardProps = {
  readonly quote: string;
  readonly name: string;
  readonly location: string;
  readonly initials: string;
  readonly showDivider?: boolean;
};

/**
 * Single testimonial quote card inside the horizontal scroller.
 */
function TestimonialCard({
  quote,
  name,
  location,
  initials,
  showDivider = true,
}: TestimonialCardProps): ReactElement {
  let cardClassName =
    "flex h-full min-h-[220px] w-[min(78vw,280px)] shrink-0 flex-col bg-[#FFFCF5] px-5 py-6 sm:min-h-[240px] sm:w-[300px] sm:px-6 sm:py-8 lg:min-h-[260px] lg:w-[320px] lg:px-7 lg:py-10";
  if (showDivider) {
    cardClassName = `${cardClassName} border-l border-[#FECA42]`;
  }
  return (
    <div className={cardClassName}>
      <p className="flex-1 text-sm leading-relaxed text-gray-600 sm:text-[15px]">{quote}</p>
      <div className="mt-8 flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#FECA42] bg-gray-100 text-xs font-semibold text-gray-700">
          {initials}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{location}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Customer reviews: sticky rating card + horizontally scrollable comments.
 */
export default function TestimonialsSection(): ReactElement {
  return (
    <section className="bg-white">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName}`}>
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 sm:mb-10 sm:text-3xl lg:mb-12 lg:text-4xl">
          What our customer say
        </h2>
        <div className="overflow-hidden rounded-2xl border border-[#FECA42]">
          <div className="flex overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="sticky left-0 z-10 shrink-0 self-stretch">
              <RatingSummaryCard />
            </div>
            {TESTIMONIALS.map(({ quote, name, location, initials }) => (
              <TestimonialCard
                key={name}
                quote={quote}
                name={name}
                location={location}
                initials={initials}
                showDivider
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
