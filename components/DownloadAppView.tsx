"use client";

import AppDownloadQrCode from "@/components/AppDownloadQrCode";
import AppStoreBadge from "@/components/AppStoreBadge";
import GooglePlayBadge from "@/components/GooglePlayBadge";
import { useAppDownload } from "@/hooks/useAppDownload";
import Link from "next/link";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function DownloadAppView() {
  const downloadConfig = useAppDownload();

  return (
    <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-brand-border bg-white shadow-[0_20px_60px_rgba(10,72,34,0.10)]">
      <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-brand-soft px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-white">✓</span>
            Offer reserved for you
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#171b18] sm:text-4xl">
            Congratulations! <span aria-hidden="true">🎉</span>
          </h1>

          <div className="mt-7 rounded-2xl border border-brand-border bg-brand-surface p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#666b67] sm:text-sm">
              Available loan amount upto
            </p>
            <p className="mt-2 text-5xl font-bold tracking-tight text-primary sm:text-6xl">
              ₹50,000
            </p>
            <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary">
              <span aria-hidden="true">🛡</span>
              Instantly Approved
            </p>
          </div>

          <Link
            href={downloadConfig.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="mt-7 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-white shadow-sm transition hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Download App &amp; Continue
            <ArrowIcon />
          </Link>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#666b67]">
            <span className="text-primary"><LockIcon /></span>
            Secure &amp; paperless loan process
          </div>

          <div className="mt-8 grid grid-cols-3 border-t border-[#dce4de] pt-6 text-center">
            <div><p className="text-lg font-bold text-primary">10.5%</p><p className="mt-1 text-[11px] font-medium text-gray-500">Starting ROI</p></div>
            <div className="border-x border-[#dce4de]"><p className="text-lg font-bold text-primary">90 Days</p><p className="mt-1 text-[11px] font-medium text-gray-500">Max Tenure</p></div>
            <div><p className="text-lg font-bold text-primary">0</p><p className="mt-1 text-[11px] font-medium text-gray-500">Hidden Fees</p></div>
          </div>
        </div>

        <aside className="flex flex-col items-center justify-center bg-linear-to-br from-brand-panel-start to-brand-panel-end px-6 py-10 text-center text-white sm:px-10 lg:min-h-[560px]">
          <p className="text-2xl font-bold">Almost Done! <span aria-hidden="true">🚀</span></p>
          <p className="mt-2 max-w-xs text-sm leading-5 text-white/75 sm:hidden">
            Download the ZapCash App to complete your loan process.
          </p>
          <p className="mt-2 hidden max-w-xs text-sm leading-5 text-white/75 sm:block">
            Scan the QR code and download the ZapCash App to complete your loan process.
          </p>

          <Link
            href={downloadConfig.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label={`Open ZapCash on the ${downloadConfig.storeLabel}`}
            className="mt-7 hidden rounded-2xl sm:block"
          >
            <span className="flex size-52 items-center justify-center">
              <AppDownloadQrCode
                url={downloadConfig.url}
                label={`QR code for the ZapCash ${downloadConfig.storeLabel} listing`}
              />
            </span>
          </Link>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <GooglePlayBadge />
            <AppStoreBadge />
          </div>
          <p className="mt-7 text-xs font-medium text-white/70">Joined by 1M+ users</p>
        </aside>
      </div>
    </section>
  );
}
