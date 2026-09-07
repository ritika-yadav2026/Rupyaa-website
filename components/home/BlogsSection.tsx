"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  appShellContainerClassName,
  homeSectionSpacingClassName,
} from "@/lib/app-shell-layout";
import { useSnapCarousel } from "@/hooks/useSnapCarousel";
import blog1 from "@/public/blogs/blog1.png";
import blog2 from "@/public/blogs/blog2.png";
import blog3 from "@/public/blogs/blog3.png";
import blog4 from "@/public/blogs/blog4.png";

type BlogCard = {
  readonly href: string;
  readonly title: string;
  readonly excerpt: string;
  readonly imageSrc: StaticImageData;
  readonly imageAlt: string;
};

const BLOG_CARDS: readonly BlogCard[] = [
  {
    href: "/blog/instant-personal-loan-india-kyc-disbursal-repayment",
    title: "Instant Personal Loan: Full Process Explained",
    excerpt:
      "See how approval, KYC, disbursal and EMI repayment work end-to-end.",
    imageSrc: blog1,
    imageAlt: "Instant personal loan process on mobile with KYC and disbursal",
  },
  {
    href: "/blog/best-personal-loan-app-india-checks-before-applying",
    title: "Best Personal Loan App in India: 12 Checks",
    excerpt:
      "Learn what to verify before applying through any personal loan app.",
    imageSrc: blog2,
    imageAlt: "Checklist for choosing the best personal loan app in India",
  },
  {
    href: "/blog/low-cibil-personal-loan",
    title: "Personal Loan With a Low CIBIL Score",
    excerpt: "See your options when your credit score isn't perfect.",
    imageSrc: blog3,
    imageAlt: "Personal loan options for applicants with a low CIBIL score",
  },
  {
    href: "/blog/urgent-personal-loan-options-india",
    title: "Best Options for Urgent Personal Loans",
    excerpt:
      "Compare fast, safe ways to arrange funds for a genuine emergency.",
    imageSrc: blog4,
    imageAlt: "Urgent personal loan options for emergency funding needs",
  },
] as const;

const CAROUSEL_TRACK_CLASSNAME =
  "flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 scrollbar-hide [-webkit-overflow-scrolling:touch] [touch-action:pan-x_pan-y]";

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

function BlogCardContent({ card }: { readonly card: BlogCard }) {
  return (
    <Link
      href={card.href}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_12px_30px_rgba(0,101,37,0.10)] sm:rounded-2xl"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#E5F2DE]">
        <Image
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-2 transition duration-300 group-hover:scale-[1.02] sm:p-3"
          draggable={false}
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-3 sm:p-3.5">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 group-hover:text-primary sm:text-[15px]">
          {card.title}
        </h3>
        <p className="line-clamp-2 text-xs leading-[1.45] text-gray-500 sm:text-[13px]">
          {card.excerpt}
        </p>
      </div>
    </Link>
  );
}

export default function BlogsSection() {
  const {
    activeIndex,
    scrollRef,
    scrollToIndex,
    handlePrev,
    handleNext,
    handleScroll,
    isFirst,
    isLast,
  } = useSnapCarousel(BLOG_CARDS.length);

  return (
    <section className="bg-white" aria-labelledby="blogs-section-title">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName}`}>
        <h2
          id="blogs-section-title"
          className="mb-6 text-center text-xl font-bold tracking-tight text-gray-900 sm:mb-8 sm:text-2xl md:mb-10 md:text-3xl lg:mb-12 lg:text-4xl"
        >
          Read . Learn . Grow
        </h2>

        <div className="relative -mx-4 px-4 sm:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className={CAROUSEL_TRACK_CLASSNAME}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {BLOG_CARDS.map((card) => (
              <div
                key={card.href}
                className="w-[min(82vw,280px)] shrink-0 snap-center"
              >
                <BlogCardContent card={card} />
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirst}
              aria-label="Previous blog"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all touch-manipulation hover:bg-primary/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeftIcon />
            </button>
            <div className="flex gap-2">
              {BLOG_CARDS.map((card, index) => {
                let dotClassName =
                  "h-2.5 w-2.5 rounded-full bg-gray-300 transition-colors hover:bg-gray-400";
                if (index === activeIndex) {
                  dotClassName = "h-2.5 w-6 rounded-full bg-primary transition-colors";
                }
                return (
                  <button
                    key={card.href}
                    type="button"
                    onClick={() => scrollToIndex(index)}
                    aria-label={`Go to blog ${index + 1}`}
                    className={dotClassName}
                  />
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleNext}
              disabled={isLast}
              aria-label="Next blog"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all touch-manipulation hover:bg-primary/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        <div className="hidden gap-4 sm:grid sm:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6">
          {BLOG_CARDS.map((card) => (
            <div key={card.href} className="min-w-0">
              <BlogCardContent card={card} />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center sm:mt-8 md:mt-10">
          <Link
            href="/blog/"
            className="inline-flex min-h-[44px] w-full max-w-xs items-center justify-center rounded-xl bg-primary px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
          >
            Read More
          </Link>
        </div>
      </div>
    </section>
  );
}
