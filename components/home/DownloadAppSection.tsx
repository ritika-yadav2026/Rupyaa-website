"use client";
import AppDownloadQrCode from "@/components/AppDownloadQrCode";
import AppStoreBadge from "@/components/AppStoreBadge";
import GooglePlayBadge from "@/components/GooglePlayBadge";
import {
  appShellContainerClassName,
  homeSectionSpacingClassName,
} from "@/lib/app-shell-layout";
import { useAppDownload } from "@/hooks/useAppDownload";

export default function DownloadAppSection() {
  const downloadConfig = useAppDownload();
  return (
    <section className="bg-white">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName}`}>
        <div
          className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12"
          style={{ background: "linear-gradient(to right, rgb(0 83 30), #009e39)" }}
        >
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Are you ready to start?
            </h2>
            <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
              Get started with ZapCash for fast, secure, and paperless loans. Personalize your loan
              experience, track your progress, and enjoy instant disbursals directly to your bank
              account.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3">
              <AppStoreBadge />
              <GooglePlayBadge />
            </div>
          </div>
          <div className="hidden shrink-0 lg:block">
            <div className="flex h-[280px] w-[280px] items-center justify-center rounded-xl p-3">
              <AppDownloadQrCode
                url={downloadConfig.url}
                label={`QR code for the ZapCash ${downloadConfig.storeLabel} listing`}
                backgroundColor="transparent"
                foregroundColor="#ffffff"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
