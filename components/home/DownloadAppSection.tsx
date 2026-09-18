"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import AppDownloadQrCode from "@/components/AppDownloadQrCode";
import AppStoreBadge from "@/components/AppStoreBadge";
import GooglePlayBadge from "@/components/GooglePlayBadge";
import {
  appShellContainerClassName,
  homeSectionSpacingClassName,
} from "@/lib/app-shell-layout";
import { useAppDownload } from "@/hooks/useAppDownload";
import { HOME_IMAGES } from "@/lib/images";

const SECTION_GRADIENT =
  "radial-gradient(ellipse 70% 120% at 88% 55%, #FECA42 0%, #FFE899 42%, #FFF3D1 72%, #FFFCF4 100%)";

export default function DownloadAppSection(): ReactElement {
  const downloadConfig = useAppDownload();
  return (
    <section className="bg-white">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName}`}>
        <div
          className="relative flex flex-col overflow-hidden rounded-2xl border border-[#FECA42] sm:rounded-3xl lg:flex-row"
          style={{ background: SECTION_GRADIENT }}
        >
          <div className="relative z-10 flex w-full flex-col justify-center gap-6 p-6 sm:gap-8 sm:p-8 md:p-10 lg:max-w-[58%] lg:p-12 xl:max-w-[55%]">
            <div>
              <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl md:text-4xl lg:text-[2.75rem]">
                Your loan journey, in one app.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600 sm:mt-4 sm:text-base md:text-lg">
                Apply, verify, review your offer, track repayments and access your KFS, agreement
                and NOC - all in Rupyaa.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-start sm:gap-5">
              <div className="hidden size-[112px] shrink-0 overflow-hidden rounded-xl border border-[#FECA42] bg-white p-1.5 shadow-sm sm:block md:size-[128px]">
                <AppDownloadQrCode
                  url={downloadConfig.url}
                  label={`QR code for the Rupyaa ${downloadConfig.storeLabel} listing`}
                  backgroundColor="#ffffff"
                  foregroundColor="#000000"
                />
              </div>
              <div className="flex flex-col items-center gap-2.5 sm:items-start">
                <GooglePlayBadge />
                <AppStoreBadge />
              </div>
            </div>
          </div>
          {/* Mobile: mock device in flow */}
          <div className="relative z-10 flex justify-center px-4 pb-0 pt-2 lg:hidden">
            <Image
              src={HOME_IMAGES.mockDevice}
              alt="Rupyaa app on mobile"
              width={280}
              height={490}
              className="h-auto w-[min(58vw,220px)] object-contain object-bottom drop-shadow-2xl"
              sizes="220px"
              priority={false}
            />
          </div>
          {/* Desktop: mock device on the right */}
          <div className="pointer-events-none absolute inset-y-0 right-0 bottom-0 hidden w-[46%] items-end justify-end pb-0 pr-2 lg:flex xl:pr-6">
            <div className="relative h-full w-full max-w-[300px] xl:max-w-[340px]">
              <Image
                src={HOME_IMAGES.mockDevice}
                alt="Rupyaa app on mobile"
                fill
                className="object-contain object-bottom drop-shadow-2xl"
                sizes="(max-width: 1280px) 300px, 340px"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
