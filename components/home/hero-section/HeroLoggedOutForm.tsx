"use client";

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
}: HeroLoggedOutFormProps) {
  const handleGetLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = mobile.replace(/\D/g, "").slice(0, 10);
    const error = validateIndianMobile(digits);
    setMobileError(error);
    if (error) return;
    window.location.href = `/auth?mobile=${encodeURIComponent(digits)}`;
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(digits);
    setMobileError(null);
  };

  return (
    <form onSubmit={handleGetLoan} className={`flex flex-col px-4 md:p-0 gap-2 w-full ${className ?? ""}`}>
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <label htmlFor="hero-mobile" className="sr-only">
          Mobile number
        </label>
        <input
          id="hero-mobile"
          type="tel"
          inputMode="numeric"
          placeholder="Enter Your Mobile Number"
          value={mobile}
          onChange={handleMobileChange}
          maxLength={10}
          autoComplete="tel"
          enterKeyHint="go"
          aria-invalid={!!mobileError}
          aria-describedby={mobileError ? "hero-mobile-error" : undefined}
          className={`w-full sm:flex-1 min-w-0 px-4 py-3.5 text-sm md:text-base rounded-xl bg-white text-gray-900 placeholder-gray-500 border-2 focus:ring-2 focus:ring-primary/20 outline-none transition-colors min-h-[48px] ${
            mobileError ? "border-red-500 focus:border-red-500" : "border-primary focus:border-primary"
          }`}
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3.5 md:px-6 rounded-xl bg-button text-gray-900 font-bold hover:bg-button/90 active:scale-[0.98] transition-all shrink-0 min-h-[48px]"
        >
          Get Loan
        </button>
      </div>
      {mobileError && (
        <p id="hero-mobile-error" className="text-sm text-red-600" role="alert">
          {mobileError}
        </p>
      )}
    </form>
  );
}
