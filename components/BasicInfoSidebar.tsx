"use client";

import AppDownloadQrCode from "@/components/AppDownloadQrCode";
import AppStoreBadge from "@/components/AppStoreBadge";
import GooglePlayBadge from "@/components/GooglePlayBadge";
import { useAppDownload } from "@/hooks/useAppDownload";

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#006525" />
      <path
        d="M5.5 10.2L8.4 13.1L14.5 7"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BasicInfoSidebar() {
  const downloadConfig = useAppDownload();

  return (
    <div className="flex h-full flex-col gap-5 rounded-2xl border border-primary/25 bg-[#eaf5ee] p-5 sm:gap-6 sm:p-6 lg:p-8">
      <div className="hidden justify-center sm:flex">
        <span className="size-[140px] md:size-[200px] lg:size-[250px]">
          <AppDownloadQrCode
            url={downloadConfig.url}
            label={`QR code for the ZapCash ${downloadConfig.storeLabel} listing`}
          />
        </span>
      </div>
   
      <div>
        <h3 className="mb-2 text-base font-bold text-gray-900">5 Minutes Process</h3>
        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          Experience lightning fast digital lending. Apply, verify, and get disbursed right from
          your phone.
        </p>
        <ul className="space-y-2.5">
          <li className="flex items-center gap-2.5 text-sm text-gray-700">
            <span className="shrink-0">
              <CheckCircleIcon />
            </span>
            No paperwork required
          </li>
          <li className="flex items-center gap-2.5 text-sm text-gray-700">
            <span className="shrink-0">
              <CheckCircleIcon />
            </span>
            Instant eligibility check
          </li>
        </ul>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
        <GooglePlayBadge />
        <AppStoreBadge />
      </div>
    </div>
  );
}
