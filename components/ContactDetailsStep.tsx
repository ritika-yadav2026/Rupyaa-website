"use client";

import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import EmailFieldWithVerify from "@/components/contact-details/EmailFieldWithVerify";
import OtpVerificationModal from "@/components/contact-details/OtpVerificationModal";
import { useUserContactDetails, USER_CONTACT_DETAILS_QUERY_KEY } from "@/hooks/useUserContactDetails";
import {
  mapContactDetailsToApi,
  normalizeGetContactDetailsResponse,
  validateAlternateMobileSchema,
  isAlternateMobileValidForProceed,
} from "@/lib/contact-details-map";
import { trackContactDetailPageSubmit } from "@/lib/gtm";
import type { ContactFieldOptions, VerifyTarget } from "@/lib/kyc-contact-types";
import {
  postContactDetails,
  sendEmailOtp,
  verifyEmailOtp,
} from "@/lib/user-api";
import { validateEmail, validateOtpDigits } from "@/lib/validation";
import AppButton from "@/components/app-button";
import AppTextField from "@/components/app-text-field";

const RESEND_COOLDOWN_SECONDS = 60;
const EMAIL_OTP_LENGTH = 4;

type Props = {
  readonly onContinue?: () => void;
};

type FieldErrors = {
  email?: string;
  alternate_mobile?: string;
  officeEmail?: string;
};

function MailIcon({ className = "text-primary" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function validateOptionalEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return validateEmail(trimmed);
}

function optionShow(field: { show?: boolean } | undefined): boolean {
  return field?.show !== false;
}

function optionVerify(field: { verify?: boolean } | undefined): boolean {
  return field?.verify === true;
}

function alternateRequiredWhenShown(opts: ContactFieldOptions | undefined): boolean {
  if (!opts?.alternateMobile) return true;
  return opts.alternateMobile.required !== false;
}

function maskEmailAddress(email: string): string {
  if (!email.includes("@")) return "";
  const domain = email.split("@").slice(1).join("@");
  return `***@${domain}`;
}

export default function ContactDetailsStep({ onContinue }: Props): ReactElement {
  const queryClient = useQueryClient();
  const { data: contactRaw, isLoading, isError, error, refetch } = useUserContactDetails({
    enabled: true,
  });

  const [fieldOptions, setFieldOptions] = useState<ContactFieldOptions | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [alternateMobile, setAlternateMobile] = useState("");
  const [officeEmail, setOfficeEmail] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [personalEmailVerified, setPersonalEmailVerified] = useState(false);
  const [officeEmailVerified, setOfficeEmailVerified] = useState(false);
  const [verifySendErrorPersonal, setVerifySendErrorPersonal] = useState<string | null>(null);
  const [verifySendErrorOffice, setVerifySendErrorOffice] = useState<string | null>(null);

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpTarget, setOtpTarget] = useState<VerifyTarget | null>(null);
  const [otp, setOtp] = useState<string[]>(() => Array(EMAIL_OTP_LENGTH).fill(""));
  const [otpModalError, setOtpModalError] = useState<string | null>(null);
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(null);
  const [resendTick, setResendTick] = useState(0);

  const prefilledRef = useRef(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const altInputRef = useRef<HTMLInputElement>(null);
  const officeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!contactRaw || prefilledRef.current) return;
    prefilledRef.current = true;
    const { details, contactFieldOptions } = normalizeGetContactDetailsResponse(contactRaw);
    setFieldOptions(contactFieldOptions);
    setEmail(details.email ?? "");
    setAlternateMobile(details.alternate_mobile ?? "");
    setOfficeEmail(details.officeEmail ?? "");
  }, [contactRaw]);

  useEffect(() => {
    setPersonalEmailVerified(false);
  }, [email]);

  useEffect(() => {
    setOfficeEmailVerified(false);
  }, [officeEmail]);

  const opts = fieldOptions;

  const showPersonal = optionShow(opts?.personalEmail);
  const showOffice = optionShow(opts?.officeEmail);
  const showAlternate = optionShow(opts?.alternateMobile);

  const verifyPersonal = optionVerify(opts?.personalEmail);
  const verifyOffice = optionVerify(opts?.officeEmail);

  const altRequired = showAlternate && alternateRequiredWhenShown(opts);

  const officeRequired =
    showOffice && opts?.officeEmail?.required === true;

  const resendSecondsLeft = useMemo(() => {
    if (!resendAvailableAt) return 0;
    return Math.max(0, Math.ceil((resendAvailableAt - Date.now()) / 1000));
  }, [resendAvailableAt, resendTick]);

  useEffect(() => {
    if (!otpModalOpen || !resendAvailableAt) return;
    const id = setInterval(() => {
      setResendTick((n) => n + 1);
      if (Date.now() >= resendAvailableAt) {
        setResendAvailableAt(null);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [otpModalOpen, resendAvailableAt]);

  const otpEmailForModal = otpTarget === "office" ? officeEmail.trim() : email.trim();
  const maskedOtpEmail = maskEmailAddress(otpEmailForModal);

  const openOtpModal = (target: VerifyTarget) => {
    setOtpTarget(target);
    setOtp(Array(EMAIL_OTP_LENGTH).fill(""));
    setOtpModalError(null);
    setOtpModalOpen(true);
    setResendAvailableAt(Date.now() + RESEND_COOLDOWN_SECONDS * 1000);
  };

  const sendOtpMutation = useMutation({
    mutationFn: async (variables: Parameters<typeof sendEmailOtp>[0]) => {
      const res = await sendEmailOtp(variables);
      if (res && typeof res === "object" && res.success === false) {
        throw new Error(res.message?.trim() || "Could not send OTP");
      }
      return res;
    },
    onSuccess: (_data, variables) => {
      setVerifySendErrorPersonal(null);
      setVerifySendErrorOffice(null);
      const target: VerifyTarget = variables.isPersonalMail ? "personal" : "office";
      openOtpModal(target);
      toast.success("OTP sent to your email");
    },
    onError: (err: Error, variables) => {
      const msg = err.message ?? "Could not send OTP";
      if (variables.isPersonalMail) {
        setVerifySendErrorPersonal(msg);
      } else {
        setVerifySendErrorOffice(msg);
      }
      toast.error(msg);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (variables: Parameters<typeof verifyEmailOtp>[0]) => {
      const res = await verifyEmailOtp(variables);
      if (res && typeof res === "object" && res.success === false) {
        throw new Error(res.message?.trim() || "Invalid or expired code");
      }
      return res;
    },
    onSuccess: (_data, variables) => {
      if (variables.isPersonalMail) {
        setPersonalEmailVerified(true);
      } else {
        setOfficeEmailVerified(true);
      }
      setOtpModalOpen(false);
      setOtpTarget(null);
      setOtp(Array(EMAIL_OTP_LENGTH).fill(""));
      setOtpModalError(null);
      toast.success("Email verified");
    },
    onError: (err: Error) => {
      setOtpModalError(err.message ?? "Invalid code");
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (payload: ReturnType<typeof mapContactDetailsToApi>) => {
      const res = await postContactDetails(payload);
      if (res && typeof res === "object") {
        if (res.success === false) {
          throw new Error(res.message?.trim() || "Could not save contact details");
        }
        if (res.isEligible === false) {
          throw new Error(res.message?.trim() || "You are not eligible to continue with this application.");
        }
      }
      return res;
    },
    onSuccess: async () => {
      trackContactDetailPageSubmit();
      await queryClient.invalidateQueries({ queryKey: USER_CONTACT_DETAILS_QUERY_KEY });
      toast.success("Contact details saved");
      onContinue?.();
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to save contact details");
    },
  });

  const formValidForProceed = useMemo(() => {
    if (showPersonal && validateEmail(email)) return false;
    if (showOffice) {
      const officeErr = officeRequired ? validateEmail(officeEmail) : validateOptionalEmail(officeEmail);
      if (officeErr) return false;
    }
    if (showAlternate) {
      const schemaErr = validateAlternateMobileSchema(alternateMobile);
      if (schemaErr) return false;
      if (altRequired && !isAlternateMobileValidForProceed(alternateMobile)) return false;
    }
    return true;
  }, [
    showPersonal,
    showOffice,
    showAlternate,
    email,
    officeEmail,
    alternateMobile,
    officeRequired,
    altRequired,
  ]);

  const otpGatesOk = useMemo(() => {
    if (verifyPersonal && email.trim()) {
      if (!personalEmailVerified) return false;
    }
    if (verifyOffice && officeEmail.trim()) {
      if (!officeEmailVerified) return false;
    }
    return true;
  }, [
    verifyPersonal,
    verifyOffice,
    email,
    officeEmail,
    personalEmailVerified,
    officeEmailVerified,
  ]);

  const canSubmit =
    formValidForProceed &&
    otpGatesOk &&
    !submitMutation.isPending &&
    !isLoading;

  const focusFirstError = (next: FieldErrors) => {
    if (next.email && emailInputRef.current) {
      emailInputRef.current.focus();
      return;
    }
    if (next.alternate_mobile && altInputRef.current) {
      altInputRef.current.focus();
      return;
    }
    if (next.officeEmail && officeInputRef.current) {
      officeInputRef.current.focus();
    }
  };

  const handleVerifyClick = (target: VerifyTarget) => {
    const addr = target === "personal" ? email.trim() : officeEmail.trim();
    if (!addr) {
      toast.error("Enter an email address first");
      return;
    }
    if (validateEmail(addr)) {
      toast.error("Enter a valid email address");
      return;
    }
    sendOtpMutation.mutate({
      email: addr,
      isPersonalMail: target === "personal",
    });
  };

  const handleResendOtp = () => {
    if (!otpTarget || resendSecondsLeft > 0) return;
    const addr = otpTarget === "personal" ? email.trim() : officeEmail.trim();
    sendOtpMutation.mutate({
      email: addr,
      isPersonalMail: otpTarget === "personal",
    });
  };

  const handleConfirmOtp = () => {
    if (!otpTarget) return;
    const otpErr = validateOtpDigits(otp, EMAIL_OTP_LENGTH);
    setOtpModalError(otpErr);
    if (otpErr) return;
    verifyOtpMutation.mutate({
      email: otpEmailForModal,
      otp: otp.join(""),
      isPersonalMail: otpTarget === "personal",
    });
  };

  const handleOtpDigitChange = (index: number, char: string) => {
    const digit = char.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpModalError(null);
    if (digit && index < EMAIL_OTP_LENGTH - 1) {
      const el = document.querySelector<HTMLInputElement>(
        `input[name="contact-email-otp-${index + 1}"]`
      );
      el?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const el = document.querySelector<HTMLInputElement>(
        `input[name="contact-email-otp-${index - 1}"]`
      );
      el?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: FieldErrors = {};
    if (showPersonal) {
      const eErr = validateEmail(email);
      if (eErr) next.email = eErr;
    }
    if (showAlternate) {
      const aErr = validateAlternateMobileSchema(alternateMobile);
      if (aErr) next.alternate_mobile = aErr;
      else if (altRequired && !isAlternateMobileValidForProceed(alternateMobile)) {
        next.alternate_mobile = "Alternate mobile must be 10 digits starting with 6, 7, 8 or 9";
      }
    }
    if (showOffice) {
      const oErr = officeRequired ? validateEmail(officeEmail) : validateOptionalEmail(officeEmail);
      if (oErr) next.officeEmail = oErr;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      focusFirstError(next);
      return;
    }
    if (!formValidForProceed || !otpGatesOk) {
      toast.error("Please complete all required fields and verification");
      return;
    }
    submitMutation.mutate(mapContactDetailsToApi({ email, alternate_mobile: alternateMobile, officeEmail }));
  };

  let alternateMobileLabel: ReactElement;
  if (altRequired) {
    alternateMobileLabel = (
      <>
        Alternate Mobile
        <span className="text-red-600"> *</span>
      </>
    );
  } else {
    alternateMobileLabel = <>Alternate Mobile</>;
  }

  let submitLabel: string;
  if (submitMutation.isPending) {
    submitLabel = "Saving…";
  } else {
    submitLabel = "Continue";
  }

  if (isLoading && !contactRaw) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-10 flex justify-center">
        <p className="text-gray-600 text-sm">Loading contact details…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 text-center space-y-4">
        <p className="text-red-600 text-sm">{error instanceof Error ? error.message : "Failed to load"}</p>
        <AppButton type="button" onClick={() => refetch()}>
          Retry
        </AppButton>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] min-w-0 mx-auto bg-white rounded-2xl border border-[#FFF4D9] overflow-hidden">
      <form className="pb-6 px-4 sm:px-6" onSubmit={handleSubmit} noValidate>
        <div className="flex items-center gap-2 rounded-t-xl bg-[#FFE398] px-4 py-3 border border-b-0 border-[#FFF4D9] -mx-4 sm:-mx-6 sm:rounded-t-2xl mb-4">
          <MailIcon />
          <h3 className="text-sm font-bold text-gray-900">Contact Details</h3>
        </div>

        <p className="text-sm text-gray-600 mb-5">
          We use these details to reach you about your application. Fields shown depend on your profile.
        </p>

        <div className="space-y-4">
          {showPersonal && (
            <EmailFieldWithVerify
              id="contact-personal-email"
              label={
                <>
                  Email
                  <span className="text-red-600"> *</span>
                </>
              }
              value={email}
              inputRef={emailInputRef}
              error={errors.email}
              verifyEnabled={verifyPersonal}
              verified={personalEmailVerified}
              verifySendError={verifySendErrorPersonal}
              placeholder="Enter your personal email"
              verifyLabel="Personal email verified"
              verifyDisabled={sendOtpMutation.isPending || personalEmailVerified}
              onVerify={() => handleVerifyClick("personal")}
              onChange={(nextValue) => {
                setEmail(nextValue);
                setErrors((prev) => ({ ...prev, email: undefined }));
                setVerifySendErrorPersonal(null);
              }}
            />
          )}

          {showAlternate && (
            <AppTextField
              ref={altInputRef}
              id="contact-alt-mobile"
              label={alternateMobileLabel}
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="10-digit mobile"
              value={alternateMobile}
              error={errors.alternate_mobile}
              maxLength={10}
              onChange={(ev) => {
                const d = ev.target.value.replace(/\D/g, "").slice(0, 10);
                setAlternateMobile(d);
                setErrors((o) => ({ ...o, alternate_mobile: undefined }));
              }}
            />
          )}

          {showOffice && (
            <EmailFieldWithVerify
              id="contact-office-email"
              label={
                <>
                  Office Email
                  {(officeRequired || verifyOffice) && <span className="text-red-600"> *</span>}
                </>
              }
              value={officeEmail}
              inputRef={officeInputRef}
              error={errors.officeEmail}
              verifyEnabled={verifyOffice}
              verified={officeEmailVerified}
              verifySendError={verifySendErrorOffice}
              placeholder="Enter your office email"
              verifyLabel="Office email verified"
              verifyDisabled={sendOtpMutation.isPending || !officeEmail.trim() || officeEmailVerified}
              onVerify={() => handleVerifyClick("office")}
              onChange={(nextValue) => {
                setOfficeEmail(nextValue);
                setErrors((prev) => ({ ...prev, officeEmail: undefined }));
                setVerifySendErrorOffice(null);
              }}
            />
          )}
        </div>

        <AppButton type="submit" fullWidth disabled={!canSubmit} className="mt-8">
          {submitLabel}
        </AppButton>
      </form>

      <OtpVerificationModal
        isOpen={otpModalOpen && !!otpTarget}
        title="Verify email"
        otpLength={EMAIL_OTP_LENGTH}
        otpDigits={otp}
        maskedEmail={maskedOtpEmail}
        error={otpModalError}
        resendSecondsLeft={resendSecondsLeft}
        resendPending={sendOtpMutation.isPending}
        verifyPending={verifyOtpMutation.isPending}
        onResend={handleResendOtp}
        onConfirm={handleConfirmOtp}
        onDigitChange={handleOtpDigitChange}
        onDigitKeyDown={handleOtpKeyDown}
        onCancel={() => {
          setOtpModalOpen(false);
          setOtpTarget(null);
          setOtpModalError(null);
        }}
      />
    </div>
  );
}
