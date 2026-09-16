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

export default function TestimonialsSection(): ReactElement {
  return (
    <section className="bg-white">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName}`}>
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 sm:mb-10 sm:text-3xl lg:mb-12 lg:text-4xl">
          What our customer say
        </h2>
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="flex flex-col items-center justify-center bg-[#FECA42] px-6 py-10 text-center lg:py-12">
              <p className="text-5xl font-extrabold leading-none text-gray-900 sm:text-6xl">4.5</p>
              <p className="mt-3 text-sm font-medium text-gray-900 sm:text-base">Customer Reviews</p>
              <div className="mt-4 flex gap-1 text-gray-900">
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon key={i} />
                ))}
              </div>
            </div>
            {TESTIMONIALS.map(({ quote, name, location, initials }) => (
              <div
                key={name}
                className="flex flex-col border-t border-gray-200 px-6 py-8 lg:border-l lg:border-t-0 lg:px-7 lg:py-10"
              >
                <p className="flex-1 text-sm leading-relaxed text-gray-600 sm:text-[15px]">
                  {quote}
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500">{location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
