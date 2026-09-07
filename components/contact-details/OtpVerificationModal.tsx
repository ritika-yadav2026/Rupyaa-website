"use client";

import type { KeyboardEvent } from "react";

type Props = {
  isOpen: boolean;
  title: string;
  otpLength: number;
  otpDigits: string[];
  maskedEmail?: string;
  error?: string | null;
  resendSecondsLeft: number;
  resendPending: boolean;
  verifyPending: boolean;
  onCancel: () => void;
  onResend: () => void;
  onConfirm: () => void;
  onDigitChange: (index: number, value: string) => void;
  onDigitKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void;
};

export default function OtpVerificationModal({
  isOpen,
  title,
  otpLength,
  otpDigits,
  maskedEmail,
  error,
  resendSecondsLeft,
  resendPending,
  verifyPending,
  onCancel,
  onResend,
  onConfirm,
  onDigitChange,
  onDigitKeyDown,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-otp-title"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 space-y-4">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close OTP modal"
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
        <h2 id="contact-otp-title" className="text-lg font-bold text-gray-900">
          {title}
        </h2>
        <p className="text-sm text-gray-600">
          Enter OTP sent to {maskedEmail || "your email"}.
        </p>
        <div className="flex gap-2 justify-center" role="group" aria-label="One-time password digits">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              name={`contact-email-otp-${index}`}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(event) => onDigitChange(index, event.target.value)}
              onKeyDown={(event) => onDigitKeyDown(index, event)}
              className="w-10 h-12 text-center text-lg font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Digit ${index + 1} of ${otpLength}`}
            />
          ))}
        </div>
        {error && (
          <p className="text-sm text-red-600 text-center" role="alert">
            {error}
          </p>
        )}
        <div className="text-sm pt-1 text-center">
          <span className="text-gray-600">Didn&apos;t receive the OTP? </span>
          <button
            type="button"
            onClick={onResend}
            disabled={resendSecondsLeft > 0 || resendPending}
            className="text-primary font-semibold underline underline-offset-2 hover:opacity-80 disabled:opacity-50 disabled:no-underline"
          >
            {resendSecondsLeft > 0 ? `Resend (${resendSecondsLeft}s)` : "Resend"}
          </button>
        </div>
        <button
          type="button"
          onClick={onConfirm}
          disabled={verifyPending}
          className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold min-h-[48px] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {verifyPending ? "Checking…" : "Confirm"}
        </button>
      </div>
    </div>
  );
}
