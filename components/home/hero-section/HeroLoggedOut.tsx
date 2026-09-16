"use client";

import type { ReactElement } from "react";
import { HeroLoggedOutForm } from "@/components/home/hero-section/HeroLoggedOutForm";
import HeroTrustedBy from "@/components/home/HeroTrustedBy";

export type HeroLoggedOutProps = {
  mobile: string;
  setMobile: (v: string) => void;
  mobileError: string | null;
  setMobileError: (v: string | null) => void;
};

export function HeroLoggedOut({
  mobile,
  setMobile,
  mobileError,
  setMobileError,
}: HeroLoggedOutProps): ReactElement {
  return (
    <div className="mx-auto flex w-full max-w-[740px] flex-col items-center text-center">
      <HeroTrustedBy />
      <h1 className="mb-8 text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-[#111827] sm:mb-10 sm:text-5xl md:text-6xl lg:text-[4.85rem]">
        Choti si need,
        <br />
        Badi si Smile.
      </h1>
      <div className="w-full max-w-[560px]">
        <HeroLoggedOutForm
          mobile={mobile}
          setMobile={setMobile}
          mobileError={mobileError}
          setMobileError={setMobileError}
        />
      </div>
    </div>
  );
}
