import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  appShellContainerClassName,
  homeSectionSpacingClassName,
} from "@/lib/app-shell-layout";
import { HOME_IMAGES } from "@/lib/images";

const STATS = [
  { value: "150000+", label: "Active Users" },
  { value: "15,000+", label: "Pincode Served" },
  { value: "17000+", label: "Loan Disbursed" },
] as const;

export default function StatsSection(): ReactElement {
  return (
    <section className="bg-white">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName}`}>
        <div className="bg-[#FEFBF3] px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 sm:mb-10 sm:text-3xl lg:mb-12 lg:text-4xl">
            Trusted Across India
          </h2>
          {/* Mobile: map + 3-col stats + centered CTA */}
          <div className="flex flex-col items-center lg:hidden">
            <Image
              src={HOME_IMAGES.indiaDotMap}
              alt="Map of India"
              width={532}
              height={630}
              className="h-auto w-full max-w-[220px] object-contain sm:max-w-[260px]"
              sizes="260px"
              unoptimized
              priority={false}
            />
            <div className="mt-8 grid w-full grid-cols-3 gap-3 sm:gap-4">
              {STATS.map(({ value, label }) => (
                <div key={label} className="min-w-0 text-center">
                  <p className="text-lg font-extrabold leading-none tracking-tight text-gray-900 sm:text-2xl">
                    {value}
                  </p>
                  <p className="mt-2 text-[11px] leading-snug text-gray-600 sm:text-sm">{label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/auth"
              className="mt-8 inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#1A1A1A] px-8 py-2.5 text-sm font-semibold tracking-wide text-[#FECA42] transition hover:bg-black"
            >
              APPLY NOW
            </Link>
          </div>
          {/* Desktop: map left + stacked stats right */}
          <div className="hidden items-center gap-12 lg:grid lg:grid-cols-2 xl:gap-16">
            <div className="flex justify-center">
              <Image
                src={HOME_IMAGES.indiaDotMap}
                alt="Map of India"
                width={532}
                height={630}
                className="h-auto w-full max-w-[360px] object-contain"
                sizes="360px"
                unoptimized
                priority={false}
              />
            </div>
            <div className="w-full max-w-md">
              {STATS.map(({ value, label }, index) => {
                let borderClass = "border-b border-gray-200 pb-6";
                if (index === STATS.length - 1) {
                  borderClass = "pb-2";
                }
                return (
                  <div key={label} className={`mb-6 ${borderClass}`}>
                    <p className="text-5xl font-extrabold leading-none tracking-tight text-gray-900">
                      {value}
                    </p>
                    <p className="mt-2 text-base text-gray-600">{label}</p>
                  </div>
                );
              })}
              <Link
                href="/auth"
                className="mt-6 inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#1A1A1A] px-8 py-2.5 text-sm font-semibold tracking-wide text-[#FECA42] transition hover:bg-black"
              >
                APPLY NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
