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
      <p id="hero-mobile-error" className="px-2 text-left text-sm text-red-600" role="alert">
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
        className={`flex w-full items-center gap-2 rounded-full border border-black/5 bg-white p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] sm:gap-3 sm:p-2 ${shellBorderClassName}`}
      >
        <label htmlFor="hero-mobile" className="sr-only">
          Mobile number
        </label>
        <div className="flex min-w-0 flex-1 items-center gap-2 pl-4 sm:pl-5">
          <span className="shrink-0 text-sm font-medium text-gray-500 sm:text-base">+91</span>
          <span className="shrink-0 text-gray-300" aria-hidden>
            |
          </span>
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
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 sm:text-base"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-full bg-button px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-gray-900 transition-all hover:bg-button/90 active:scale-[0.98] sm:px-8 sm:text-base"
        >
          GET LOAN
        </button>
      </div>
      {errorBlock}
    </form>
  );
}
