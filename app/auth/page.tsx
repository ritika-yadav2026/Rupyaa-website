"use client";

import { Suspense, useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/home/Footer";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateIndianMobile, validateOtpDigits } from "@/lib/validation";
import { useAuthStore } from "@/store/useAuthStore";
import { generateOtp, checkOtpSignupLogin, type MarketingAttribution } from "@/lib/auth-api";
import {
  MarketingAttributionStorage,
  readAttributionFromSearchParams,
} from "@/lib/marketing-attribution-storage";
import BasicInfoSidebar from "@/components/BasicInfoSidebar";

const OTP_LENGTH = 4;
const RESEND_COOLDOWN_SECONDS = 60;
const DEFAULT_AUTH_REDIRECT_PATH = "/personal-loan";

function getSafeReturnPath(returnTo: string | null): string | null {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return null;
  }
  if (returnTo === "/auth" || returnTo.startsWith("/auth?")) {
    return null;
  }
  return returnTo;
}

function getValidMobileParam(mobileParam: string | null): string {
  if (!mobileParam) {
    return "";
  }
  const normalized = mobileParam.replace(/\D/g, "").slice(0, 10);
  const error = validateIndianMobile(normalized);
  return error ? "" : normalized;
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-2-8 2v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}



function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const authRedirectPath = getSafeReturnPath(searchParams.get("returnTo")) ?? DEFAULT_AUTH_REDIRECT_PATH;
  const mobileFromUrl = useMemo<string>(() => getValidMobileParam(searchParams.get("mobile")), [searchParams]);

  const persistedAttribution = useMemo<MarketingAttribution | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    return MarketingAttributionStorage.read();
  }, []);

  const attribution = useMemo<MarketingAttribution | undefined>(() => {
    const fromUrl: MarketingAttribution | undefined = readAttributionFromSearchParams(
      new URLSearchParams(searchParams.toString())
    );
    if (!fromUrl) return persistedAttribution;
    return { ...(persistedAttribution ?? {}), ...fromUrl };
  }, [persistedAttribution, searchParams]);

  useEffect(() => {
    if (isLoggedIn && !searchParams.get("mobile")) {
      router.replace(authRedirectPath);
    }
  }, [authRedirectPath, isLoggedIn, router, searchParams]);

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState(mobileFromUrl);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasProcessedMobileFromUrlRef = useRef(false);

  const generateOtpMutation = useMutation({
    mutationFn: generateOtp,
    onSuccess: (data) => {
      setStep("otp");
      setOtp(Array(OTP_LENGTH).fill(""));
      setOtpError(null);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      if (cooldownRef.current) clearInterval(cooldownRef.current);
      cooldownRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1 && cooldownRef.current) {
            clearInterval(cooldownRef.current);
            cooldownRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      if (data.otpValue && process.env.NODE_ENV === "development") {
        toast.success(`OTP sent! (Dev: ${data.otpValue})`);
      } else {
        toast.success(data.message ?? "OTP sent to your phone");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to send OTP");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ phoneNumber, otp }: { phoneNumber: string; otp: string }) =>
      checkOtpSignupLogin(phoneNumber, otp, attribution),
    onSuccess: (data) => {
      login({
        phone,
        token: data.token,
        refreshToken: data.refreshToken,
        userId: data.userId,
        leadId: data.leadId,
      });
      MarketingAttributionStorage.clear();
      toast.success("Welcome to ZapCash!");
      router.replace(authRedirectPath);
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Invalid OTP");
    },
  });

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  /** When arriving from Hero "Get Loan" with ?mobile=xxx, pre-fill phone. */
  useEffect(() => {
    if (hasProcessedMobileFromUrlRef.current) return;
    if (!mobileFromUrl) return;
    hasProcessedMobileFromUrlRef.current = true;
    setPhone(mobileFromUrl);
    generateOtpMutation.mutate(mobileFromUrl);
  }, [generateOtpMutation, mobileFromUrl]);

  const handlePhoneChange = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
    setPhoneError(null);
  }, []);

  const handleSendOtp = useCallback(() => {
    const error = validateIndianMobile(phone);
    setPhoneError(error);
    if (error) return;
    generateOtpMutation.mutate(phone);
  }, [phone, generateOtpMutation]);

  const handleOtpChange = useCallback((index: number, value: string) => {
    setOtpError(null);
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) {
      const nextEl = document.querySelector<HTMLInputElement>(
        `input[name="auth-otp-${index + 1}"]`
      );
      nextEl?.focus();
    }
  }, [otp]);

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        const prevEl = document.querySelector<HTMLInputElement>(
          `input[name="auth-otp-${index - 1}"]`
        );
        prevEl?.focus();
      }
    },
    [otp]
  );

  const otpComplete = otp.every((d) => d !== "");
  const otpString = otp.join("");
  const formattedPhone =
    phone.length === 10 ? `+91 ${phone.slice(0, 2)}XXXXXXXX` : "+91 98XXXXXXXX";

  const handleVerifyOtp = useCallback(() => {
    const otpValidationErr = validateOtpDigits(otp, OTP_LENGTH);
    setOtpError(otpValidationErr);
    if (otpValidationErr) return;
    verifyOtpMutation.mutate({ phoneNumber: phone, otp: otpString });
  }, [otp, otpString, phone, verifyOtpMutation]);

  const handleBackToPhone = useCallback(() => {
    setOtpError(null);
    setStep("phone");
    setOtp(Array(OTP_LENGTH).fill(""));
  }, []);

  const handleResendOtp = useCallback(() => {
    if (resendCooldown > 0) return;
    const error = validateIndianMobile(phone);
    if (error) {
      toast.error(error);
      return;
    }
    generateOtpMutation.mutate(phone);
  }, [resendCooldown, phone, generateOtpMutation]);

  const formatCooldown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isSubmitting =
    generateOtpMutation.isPending || verifyOtpMutation.isPending;

  let phoneInputBorderClassName = "border-gray-200";
  if (phoneError) {
    phoneInputBorderClassName = "border-red-500";
  }

  let verifyButtonClassName =
    "w-full py-3.5 rounded-xl font-semibold min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gray-300 text-gray-500 cursor-not-allowed";
  if (otpComplete && !isSubmitting) {
    verifyButtonClassName =
      "w-full py-3.5 rounded-xl font-semibold min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-primary text-white hover:bg-primary/90";
  }

  let formContent;
  if (step === "phone") {
    formContent = (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendOtp();
        }}
        className="contents"
      >
        <div className="mb-6 flex flex-col items-start gap-1">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Welcome Back to ZapCash!
          </h1>
          <p className="text-base text-gray-500">Login to Your Account</p>
        </div>
        <div className="mb-6 flex flex-col gap-2">
          <label htmlFor="auth-phone" className="text-sm font-semibold text-gray-800">
            Phone Number
          </label>
          <div
            className={`flex min-h-[52px] overflow-hidden rounded-xl border bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 ${phoneInputBorderClassName}`}
          >
            <span className="flex shrink-0 items-center gap-3 px-4 text-sm font-medium text-gray-700">
              +91
              <span className="h-5 w-px bg-gray-300" aria-hidden="true" />
            </span>
            <input
              id="auth-phone"
              name="auth-phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="Enter mobile number"
              disabled={generateOtpMutation.isPending}
              className="min-h-[52px] w-full flex-1 bg-transparent py-3.5 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-60"
              aria-invalid={!!phoneError}
              aria-describedby={phoneError ? "auth-phone-error" : undefined}
              autoComplete="tel"
              enterKeyHint="send"
            />
          </div>
          {phoneError ? (
            <p id="auth-phone-error" className="text-sm text-red-600" role="alert">
              {phoneError}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={generateOtpMutation.isPending}
          className="min-h-[52px] w-full rounded-xl bg-primary py-3.5 font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {generateOtpMutation.isPending ? "Sending..." : "Get OTP"}
        </button>
      </form>
    );
  } else {
    formContent = (
      <>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          Verify your Phone
        </h1>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-gray-600">
            Enter the {OTP_LENGTH}-digit code sent to {formattedPhone}
          </p>
          <button
            type="button"
            onClick={handleBackToPhone}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PencilIcon />
            Change Phone Number
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerifyOtp();
          }}
          className="contents"
        >
          <div className="mb-4 flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-900" id="auth-otp-label">
              Enter your OTP
            </label>
            <div
              className="flex justify-start gap-2 sm:gap-3"
              role="group"
              aria-labelledby="auth-otp-label"
            >
              {otp.map((d, i) => (
                <input
                  key={i}
                  name={`auth-otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  disabled={verifyOtpMutation.isPending}
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  aria-label={`OTP digit ${i + 1} of ${OTP_LENGTH}`}
                  aria-invalid={Boolean(otpError)}
                  aria-describedby={otpError ? "auth-otp-error" : undefined}
                  className="h-12 w-11 rounded-xl border border-gray-200 text-center text-lg font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 sm:h-14 sm:w-12"
                />
              ))}
            </div>
            {otpError ? (
              <p id="auth-otp-error" className="text-sm text-red-600" role="alert">
                {otpError}
              </p>
            ) : null}
          </div>
          <p className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon />
            <span>Resend OTP in </span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || generateOtpMutation.isPending}
              className="font-medium text-primary hover:underline disabled:hover:no-underline"
            >
              {resendCooldown > 0 ? formatCooldown(resendCooldown) : "Resend now"}
            </button>
          </p>
          <button
            type="submit"
            disabled={!otpComplete || isSubmitting}
            className={verifyButtonClassName}
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Continue"}
          </button>
        </form>
      </>
    );
  }

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-white">
      <AppHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-20 outline-none sm:pb-14 sm:pt-24"
      >
        <div className="flex w-full max-w-5xl flex-col gap-5 md:flex-row md:items-stretch md:gap-6 lg:gap-8">
          <div className="flex flex-1 flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-6 md:min-w-0 md:p-8 lg:min-w-[420px]">
            {formContent}
          </div>
          <div className="w-full shrink-0 md:w-[340px] lg:w-[380px] xl:w-[400px]">
            <BasicInfoSidebar />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-gray-400 sm:mt-10 sm:gap-10">
          <div className="flex flex-col items-center gap-1.5">
            <ClockIcon />
            <span className="text-[10px] font-medium uppercase tracking-wider sm:text-xs">
              Instant Disbursal
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <ShieldIcon />
            <span className="text-[10px] font-medium uppercase tracking-wider sm:text-xs">
              Secure Transaction
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <DocumentIcon />
            <span className="text-[10px] font-medium uppercase tracking-wider sm:text-xs">
              Transparent Terms
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen min-h-[100dvh] bg-[#f8faf8] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
