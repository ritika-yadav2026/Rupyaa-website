"use client";

import Image from "next/image";
import { IMAGES } from "@/lib/images";

/** Logo-only header — no close affordance. Users dismiss via the in-body CTAs. */
export default function LoanCancellationHeader() {
  return (
    <div className="flex items-center gap-2.5 px-5 pt-5 sm:px-7 sm:pt-7 md:px-8 md:pt-8">
      <Image
        src={IMAGES.zapcashLogo}
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 rounded-full object-cover"
      />
      <span className="text-lg font-bold tracking-tight text-gray-900">
        ZapCash
      </span>
    </div>
  );
}
