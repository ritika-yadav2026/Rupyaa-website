"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import AppDownloadQrCode from "@/components/AppDownloadQrCode";
import AppStoreBadge from "@/components/AppStoreBadge";
import GooglePlayBadge from "@/components/GooglePlayBadge";
import { useAppDownload } from "@/hooks/useAppDownload";
import { HOME_IMAGES } from "@/lib/images";

/**
 * Journey promo sidebar: top content scales with height; phone stays flush at bottom (pb-0).
 */
export default function BasicInfoSidebar(): ReactElement {
  const downloadConfig = useAppDownload();

  return (
    <aside className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[#FECA42] bg-[#FFFCF4] pb-0 [container-type:size]">
      <div className="flex shrink-0 flex-col items-center gap-[clamp(0.5rem,2.4cqh,1.25rem)] px-4 pt-[clamp(0.75rem,3cqh,1.75rem)] lg:px-5">
        <div className="aspect-square w-[clamp(96px,28cqh,168px)] shrink-0 overflow-hidden rounded-xl border border-gray-900/10 bg-white p-1.5 shadow-sm">
          <AppDownloadQrCode
            url={downloadConfig.url}
            label={`QR code for the Rupyaa ${downloadConfig.storeLabel} listing`}
            backgroundColor="#ffffff"
            foregroundColor="#000000"
          />
        </div>

        <div className="flex h-[clamp(2.25rem,6.5cqh,3rem)] items-center justify-center overflow-hidden">
          <div className="flex origin-center scale-[0.58] items-center gap-2 xl:scale-[0.66]">
            <AppStoreBadge />
            <GooglePlayBadge />
          </div>
        </div>

        <div className="max-w-[280px] px-1 text-center">
          <h3 className="text-[clamp(1rem,2.8cqh,1.35rem)] font-bold leading-tight text-gray-900">
            5 Minutes Process
          </h3>
          <p className="mt-[clamp(0.35rem,1.2cqh,0.625rem)] text-[clamp(0.75rem,2cqh,0.9375rem)] leading-snug text-gray-600">
            Experience lightning fast digital lending. Apply, verify, and get disbursed from your
            phone.
          </p>
        </div>
      </div>

      <div className="relative mt-auto min-h-[140px] flex-1 overflow-hidden pb-0">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-2 mx-auto w-[min(94%,300px)]">
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
