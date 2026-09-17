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
    <div className="mx-auto flex w-full max-w-[560px] flex-col items-center text-center sm:max-w-[640px]">
      <HeroTrustedBy />
      <h1 className="mb-9 text-[2.35rem] font-extrabold leading-[1.05] tracking-tight text-[#111827] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
        Choti si need,
        <br />
        Badi si Smile.
      </h1>
      <div className="w-full max-w-[520px]">
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
