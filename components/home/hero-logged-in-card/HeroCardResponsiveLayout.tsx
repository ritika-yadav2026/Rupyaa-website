"use client";

import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Positions the resolved hero card: mobile banner overlay vs desktop block beside copy.
 * Does not decide *which* card — only layout wrapper.
 */
export function HeroCardResponsiveLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="relative mt-4 lg:hidden">
        <div className="pointer-events-none flex items-end justify-center">
          <div className="relative aspect-7/8 min-h-[280px] w-full max-w-[480px]">
            <Image
              src="/images/bannerNew.png"
              alt="ZapCash - Get your loan offer"
              fill
              className="object-contain object-bottom"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-2">
          <div className="w-full max-w-[560px] px-2">{children}</div>
        </div>
      </div>

      <div className="mt-4 hidden w-full max-w-[560px] lg:block">{children}</div>
    </>
  );
}
