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
    <section className="bg-[#FEFBF3]">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName} pt-10 sm:pt-12`}>
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 sm:mb-10 sm:text-3xl lg:mb-12 lg:text-4xl">
          Trusted Across India
        </h2>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex justify-center lg:justify-start">
            <Image
              src={HOME_IMAGES.indiaDotMap}
              alt="Map of India"
              width={532}
              height={630}
              className="h-auto w-full max-w-[280px] object-contain sm:max-w-[320px] lg:max-w-[360px]"
              sizes="(max-width: 1024px) 320px, 360px"
              unoptimized
              priority={false}
            />
          </div>
          <div className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-md">
            {STATS.map(({ value, label }, index) => {
              let borderClass = "border-b border-gray-200 pb-5 sm:pb-6";
              if (index === STATS.length - 1) {
                borderClass = "pb-2";
              }
              return (
                <div key={label} className={`mb-5 sm:mb-6 ${borderClass}`}>
                  <p className="text-3xl font-extrabold leading-none tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                    {value}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 sm:text-base">{label}</p>
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
    </section>
  );
}
