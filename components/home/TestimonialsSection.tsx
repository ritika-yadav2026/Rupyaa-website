"use client";

import {
  appShellContainerClassName,
  homeSectionSpacingClassName,
} from "@/lib/app-shell-layout";
import { useSnapCarousel } from "@/hooks/useSnapCarousel";

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#D9F0E1" stroke="#006525" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "The fastest loan process I've ever experienced. Got my medical emergency loan approved in just 15 minutes!",
    name: "Rahul Sharma",
    designation: "Software Engineer, Bangalore",
    initials: "RS",
  },
  {
    quote:
      "No hidden charges, very transparent. The UI is clean and easy to use even for someone not tech-savvy like me.",
    name: "Ananya Patel",
    designation: "Store Owner, Mumbai",
    initials: "AP",
  },
  {
    quote:
      "ZapCash helped me expand my small business when bank loans were getting delayed. Highly recommended.",
    name: "Vikram Singh",
    designation: "Entrepreneur, Delhi",
    initials: "VS",
  },
  {
    quote:
      "Instant approval and same-day disbursement. ZapCash came through when I needed funds for my daughter's education.",
    name: "Priya Mehta",
    designation: "Teacher, Pune",
    initials: "PM",
  },
  {
    quote:
      "Best interest rates I found after comparing multiple lenders. The entire process from application to disbursement was seamless.",
    name: "Arjun Reddy",
    designation: "Marketing Manager, Hyderabad",
    initials: "AR",
  },
  {
    quote:
      "As a freelancer, getting a loan was always difficult. ZapCash understood my income pattern and approved me quickly. Thank you!",
    name: "Kavita Nair",
    designation: "Freelance Designer, Chennai",
    initials: "KN",
  },
] as const;

const CAROUSEL_TRACK_CLASSNAME =
  "flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 scrollbar-hide sm:gap-6 [-webkit-overflow-scrolling:touch] [touch-action:pan-x_pan-y]";

export default function TestimonialsSection() {
  const {
    activeIndex,
    scrollRef,
    scrollToIndex,
    handlePrev,
    handleNext,
    handleScroll,
    isFirst,
    isLast,
  } = useSnapCarousel(TESTIMONIALS.length);

  return (
    <section className="bg-white">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName}`}>
        <h2 className="mb-8 text-center text-xl font-bold text-gray-900 sm:mb-10 sm:text-2xl md:mb-12 md:text-3xl lg:text-4xl">
          Testimonials
        </h2>
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className={CAROUSEL_TRACK_CLASSNAME}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {TESTIMONIALS.map(({ quote, name, designation, initials }) => (
              <div
                key={name}
                className="w-[min(85vw,300px)] shrink-0 snap-center sm:w-[min(calc(50%-12px),340px)] lg:w-[min(calc((100%-48px)/3),360px)]"
              >
                <div className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
                  <div className="mb-4 flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-700 sm:mb-6 sm:text-base">
                    &quot;{quote}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#D9F0E1] text-sm font-semibold text-primary">
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{name}</p>
                      <p className="text-sm text-gray-500">{designation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirst}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all touch-manipulation hover:bg-primary/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
            >
              <ChevronLeftIcon />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((item, index) => {
                let dotClassName =
                  "h-2.5 w-2.5 rounded-full bg-gray-300 transition-colors hover:bg-gray-400";
                if (index === activeIndex) {
                  dotClassName = "h-2.5 w-6 rounded-full bg-primary transition-colors";
                }
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => scrollToIndex(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                    className={dotClassName}
                  />
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleNext}
              disabled={isLast}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all touch-manipulation hover:bg-primary/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
