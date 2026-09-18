"use client";

import type { FormEvent, ChangeEvent, ReactElement, ReactNode } from "react";
import { validateIndianMobile } from "@/lib/validation";

export type HeroLoggedOutFormProps = {
  mobile: string;
  setMobile: (v: string) => void;
  mobileError: string | null;
  setMobileError: (v: string | null) => void;
  className?: string;
};

export function HeroLoggedOutForm({
  mobile,
  setMobile,
  mobileError,
  setMobileError,
  className,
}: HeroLoggedOutFormProps): ReactElement {
  const handleGetLoan = (e: FormEvent): void => {
    e.preventDefault();
    const digits = mobile.replace(/\D/g, "").slice(0, 10);
    const error = validateIndianMobile(digits);
    setMobileError(error);
    if (error) return;
    window.location.href = `/auth?mobile=${encodeURIComponent(digits)}`;
  };

  const handleMobileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(digits);
    setMobileError(null);
  };

  let shellBorderClassName = "border-transparent";
  if (mobileError) {
    shellBorderClassName = "border-red-500";
  }

  let errorBlock: ReactNode = null;
  if (mobileError) {
    errorBlock = (
      <p id="hero-mobile-error" className="px-3 text-left text-xs text-red-600 sm:text-sm" role="alert">
        {mobileError}
      </p>
    );
  }

  let formClassName = "flex w-full flex-col gap-2";
  if (className) {
    formClassName = `${formClassName} ${className}`;
  }

  return (
    <form onSubmit={handleGetLoan} className={formClassName}>
      <div
        className={`flex h-14 w-full items-center rounded-full border border-black/5 bg-white p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.08)] sm:h-16 sm:gap-3 sm:p-2 ${shellBorderClassName}`}
      >
        <label htmlFor="hero-mobile" className="sr-only">
          Mobile number
        </label>
        <div className="flex h-full min-w-0 flex-1 items-center gap-2 pl-3.5 sm:pl-5">
          <span className="shrink-0 text-[13px] font-semibold leading-none text-gray-500 sm:text-base">
            +91
          </span>
          <span className="h-4 w-px shrink-0 bg-gray-200" aria-hidden />
          <input
            id="hero-mobile"
            type="tel"
            inputMode="numeric"
            placeholder="Enter mobile number"
            value={mobile}
            onChange={handleMobileChange}
            maxLength={10}
            autoComplete="tel"
            enterKeyHint="go"
            aria-invalid={!!mobileError}
            aria-describedby={mobileError ? "hero-mobile-error" : undefined}
            className="min-w-0 flex-1 bg-transparent text-[13px] leading-none text-gray-900 outline-none placeholder:text-gray-400 sm:text-base"
          />
        </div>
        <button
          type="submit"
          className="flex h-full shrink-0 items-center justify-center rounded-full bg-button px-4 text-[12px] font-bold uppercase tracking-wide text-gray-900 transition-all hover:bg-button/90 active:scale-[0.98] sm:px-8 sm:text-base"
        >
          GET LOAN
        </button>
      </div>
      {errorBlock}
    </form>
  );
}
