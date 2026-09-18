"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import AppDownloadQrCode from "@/components/AppDownloadQrCode";
import AppStoreBadge from "@/components/AppStoreBadge";
import GooglePlayBadge from "@/components/GooglePlayBadge";
import { useAppDownload } from "@/hooks/useAppDownload";
import { HOME_IMAGES } from "@/lib/images";

/**
 * Journey promo sidebar: stacks under page content on mobile; sticky column on lg+.
 * Mobile matches marketing layout (copy → badges → phone). Desktop keeps QR on top.
 */
export default function BasicInfoSidebar(): ReactElement {
  const downloadConfig = useAppDownload();

  return (
    <aside className="relative flex h-full min-h-[420px] w-full flex-col overflow-hidden rounded-2xl border border-[#FECA42] bg-[#FFFCF4] pb-0 lg:min-h-0 [container-type:size]">
      <div className="flex shrink-0 flex-col items-center gap-3 px-4 pt-5 sm:gap-4 sm:pt-6 lg:gap-[clamp(0.5rem,2.4cqh,1.25rem)] lg:px-5 lg:pt-[clamp(0.75rem,3cqh,1.75rem)]">
        <div className="hidden aspect-square w-[clamp(96px,28cqh,168px)] shrink-0 overflow-hidden rounded-xl border border-gray-900/10 bg-white p-1.5 shadow-sm lg:block">
          <AppDownloadQrCode
            url={downloadConfig.url}
            label={`QR code for the Rupyaa ${downloadConfig.storeLabel} listing`}
            backgroundColor="#ffffff"
            foregroundColor="#000000"
          />
        </div>

        <div className="max-w-[280px] px-1 text-center">
          <h3 className="text-lg font-bold leading-tight text-gray-900 sm:text-xl lg:text-[clamp(1rem,2.8cqh,1.35rem)]">
            5 Minutes Process
          </h3>
          <p className="mt-2 text-sm leading-snug text-gray-600 sm:text-[15px] lg:mt-[clamp(0.35rem,1.2cqh,0.625rem)] lg:text-[clamp(0.75rem,2cqh,0.9375rem)]">
            Experience lightning fast digital lending. Apply, verify, and get disbursed from your
            phone.
          </p>
        </div>

        <div className="flex items-center justify-center py-1">
          <div className="flex origin-center scale-[0.78] items-center gap-2 sm:scale-[0.72] lg:h-[clamp(2.25rem,6.5cqh,3rem)] lg:scale-[0.58] lg:overflow-hidden xl:scale-[0.66]">
            <AppStoreBadge />
            <GooglePlayBadge />
          </div>
        </div>
      </div>

      <div className="relative mt-4 h-[220px] w-full shrink-0 overflow-hidden sm:h-[260px] lg:mt-auto lg:h-auto lg:min-h-[140px] lg:flex-1 lg:pb-0">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 mx-auto w-[min(94%,280px)] lg:top-2 lg:w-[min(94%,300px)]">
          <Image
            src={HOME_IMAGES.mockDevice}
            alt="Rupyaa app on mobile"
            fill
            className="object-contain object-bottom drop-shadow-xl"
            sizes="300px"
            priority={false}
          />
        </div>
      </div>
    </aside>
  );
}
