"use client";

import { HeroLoggedOutForm } from "@/components/home/hero-section/HeroLoggedOutForm";

export type HeroLoggedOutProps = {
  mobile: string;
  setMobile: (v: string) => void;
  mobileError: string | null;
  setMobileError: (v: string | null) => void;
};

export function HeroLoggedOut({ mobile, setMobile, mobileError, setMobileError }: HeroLoggedOutProps) {
  return (
    <>
      {/* <div className="w-fit inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full   bg-[#d4e9e2] border border-primary/40 mb-4 sm:mb-6">
        🔥
        <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">100% TRUSTED PLATFORM</span>
      </div> */}
      <div className="mb-3 sm:mb-5 relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-gray-900 leading-[1.1] tracking-tight text-left">
          Get Instant Loan,
          <br />
          <span className="text-primary">Anytime</span>
        </h1>
      </div >
      <p className="text-gray-600 text-xs sm:text-base lg:text-2xl mb-6 sm:mb-8 leading-relaxed text-left">
        Apply for quick and secure personal loan online with fast approval and a simple digital process.
      </p>

      <div className="hidden lg:block mt-4">
        <HeroLoggedOutForm mobile={mobile} setMobile={setMobile} mobileError={mobileError} setMobileError={setMobileError} />
      </div>
    </>
  );
}
