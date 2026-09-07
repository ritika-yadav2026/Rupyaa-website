"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import {
  sanitizePanInput,
  validateName,
  validatePan,
  validateDob,
  validateIndianMobile,
  validateIncome,
  validateEmail,
} from "@/lib/validation";
import type { CreditScoreFormValues } from "@/lib/credit-score-api";

interface CreditScoreFormProps {
  readonly onSubmit: (values: CreditScoreFormValues) => void;
  readonly isSubmitting: boolean;
  readonly initialValues?: Partial<CreditScoreFormValues>;
  /** When true, mobile is taken from the logged-in account and the field is hidden. */
  readonly isMobileLocked?: boolean;
}

type FieldErrors = Partial<Record<keyof CreditScoreFormValues, string>>;

const HIGHLIGHTS = [
  "100% Free, always",
  "Won't affect your score",
  "Instant, secure results",
] as const;

const INPUT_CLASS =
  "w-full min-h-[48px] rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60";

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="rgba(255,255,255,0.2)" />
      <path
        d="M7 12.5l3.2 3.2L17 9"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function buildInitialValues(initial?: Partial<CreditScoreFormValues>): CreditScoreFormValues {
  return {
    fullName: initial?.fullName ?? "",
    panNumber: initial?.panNumber ?? "",
    dob: initial?.dob ?? "",
    mobileNumber: initial?.mobileNumber ?? "",
    email: initial?.email ?? "",
    monthlyIncome: initial?.monthlyIncome ?? "",
    consent: initial?.consent ?? false,
  };
}

function validateForm(values: CreditScoreFormValues): FieldErrors {
  const errors: FieldErrors = {};
  const nameError = validateName(values.fullName, "Full name");
  if (nameError) {
    errors.fullName = nameError;
  }
  const panError = validatePan(values.panNumber);
  if (panError) {
    errors.panNumber = panError;
  }
  const dobError = validateDob(values.dob);
  if (dobError) {
    errors.dob = dobError;
  }
  const mobileError = validateIndianMobile(values.mobileNumber);
  if (mobileError) {
    errors.mobileNumber = mobileError;
  }
  const incomeError = validateIncome(values.monthlyIncome);
  if (incomeError) {
    errors.monthlyIncome = incomeError;
  }
  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }
  if (!values.consent) {
    errors.consent = "Please provide consent to continue";
  }
  return errors;
}

/**
 * KYC intake form for the free credit score check. Validates locally, then hands
 * clean values to the parent for the Equifax pull.
 */
export default function CreditScoreForm({
  onSubmit,
  isSubmitting,
  initialValues,
  isMobileLocked = false,
}: CreditScoreFormProps) {
  const [values, setValues] = useState<CreditScoreFormValues>(() =>
    buildInitialValues(initialValues)
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  useEffect(() => {
    if (!isMobileLocked || !initialValues?.mobileNumber) {
      return;
    }
    setValues((prev) => {
      if (prev.mobileNumber === initialValues.mobileNumber) {
        return prev;
      }
      return { ...prev, mobileNumber: initialValues.mobileNumber ?? "" };
    });
  }, [initialValues?.mobileNumber, isMobileLocked]);
  const updateValue = <K extends keyof CreditScoreFormValues>(
    key: K,
    value: CreditScoreFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };
  const handleMobileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isMobileLocked) {
      return;
    }
    updateValue("mobileNumber", event.target.value.replace(/\D/g, "").slice(0, 10));
  };
  const handleIncomeChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateValue("monthlyIncome", event.target.value.replace(/[^\d]/g, "").slice(0, 9));
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(values);
  };
  let mobileField = null;
  if (!isMobileLocked) {
    mobileField = (
      <div>
        <label htmlFor="cs-mobile" className="mb-1.5 block text-sm font-semibold text-gray-800">
          Mobile number
        </label>
        <div className="flex min-h-[48px] overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <span className="flex shrink-0 items-center gap-2 px-3 text-sm font-medium text-gray-700">
            +91
            <span className="h-5 w-px bg-gray-300" aria-hidden="true" />
          </span>
          <input
            id="cs-mobile"
            type="tel"
            inputMode="numeric"
            value={values.mobileNumber}
            onChange={handleMobileChange}
            placeholder="98765 43210"
            autoComplete="tel"
            disabled={isSubmitting}
            className="min-h-[48px] w-full flex-1 bg-transparent pr-3 text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-60"
          />
        </div>
        {errors.mobileNumber && (
          <p className="mt-1 text-sm text-red-600" role="alert">{errors.mobileNumber}</p>
        )}
      </div>
    );
  }
  let dobMobileGridClassName = "grid grid-cols-1 gap-4";
  if (!isMobileLocked) {
    dobMobileGridClassName = "grid grid-cols-1 gap-4 sm:grid-cols-2";
  }
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col lg:flex-row">
        <div className="relative flex flex-col justify-center overflow-hidden bg-primary p-6 text-white sm:p-8 lg:w-[40%] lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <h1 className="relative text-4xl font-bold leading-tight sm:text-5xl">
            Check your
            <br />
            Credit Score
          </h1>
          <p className="relative mt-3 text-sm text-white/80 sm:text-base">
            Get your EQUIFAX score &amp; full report in under a minute.
          </p>
          <ul className="relative mt-6 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm sm:text-base">
                <span className="shrink-0">
                  <CheckIcon />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="relative mt-8 flex items-center gap-2 text-xs text-white/60">
            <LockIcon />
            256-bit encrypted · Powered by Equifax
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 sm:p-8 lg:p-10" noValidate>
          <h3 className="text-2xl font-bold text-gray-900">Tell us about you</h3>
          <p className="mt-1 text-sm text-gray-500">All fields are required.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="cs-full-name" className="mb-1.5 block text-sm font-semibold text-gray-800">
                Full name
              </label>
              <input
                id="cs-full-name"
                type="text"
                value={values.fullName}
                onChange={(event) => updateValue("fullName", event.target.value)}
                placeholder="Name as per PAN"
                autoComplete="name"
                disabled={isSubmitting}
                className={INPUT_CLASS}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600" role="alert">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="cs-pan" className="mb-1.5 block text-sm font-semibold text-gray-800">
                PAN number
              </label>
              <input
                id="cs-pan"
                type="text"
                value={values.panNumber}
                onChange={(event) => updateValue("panNumber", sanitizePanInput(event.target.value))}
                placeholder="ABCDE1234F"
                autoCapitalize="characters"
                disabled={isSubmitting}
                className={`${INPUT_CLASS} uppercase`}
              />
              {errors.panNumber && (
                <p className="mt-1 text-sm text-red-600" role="alert">{errors.panNumber}</p>
              )}
            </div>

            <div className={dobMobileGridClassName}>
              <div>
                <label htmlFor="cs-dob" className="mb-1.5 block text-sm font-semibold text-gray-800">
                  Date of birth
                </label>
                <input
                  id="cs-dob"
                  type="date"
                  value={values.dob}
                  onChange={(event) => updateValue("dob", event.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  disabled={isSubmitting}
                  className={INPUT_CLASS}
                />
                {errors.dob && (
                  <p className="mt-1 text-sm text-red-600" role="alert">{errors.dob}</p>
                )}
              </div>
              {mobileField}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="cs-income" className="mb-1.5 block text-sm font-semibold text-gray-800">
                  Monthly income
                </label>
                <div className="flex min-h-[48px] overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <span className="flex shrink-0 items-center px-3 text-sm font-medium text-gray-700">
                    ₹
                  </span>
                  <input
                    id="cs-income"
                    type="text"
                    inputMode="numeric"
                    value={values.monthlyIncome}
                    onChange={handleIncomeChange}
                    placeholder="50,000"
                    disabled={isSubmitting}
                    className="min-h-[48px] w-full flex-1 bg-transparent pr-3 text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-60"
                  />
                </div>
                {errors.monthlyIncome && (
                  <p className="mt-1 text-sm text-red-600" role="alert">{errors.monthlyIncome}</p>
                )}
              </div>
              <div>
                <label htmlFor="cs-email" className="mb-1.5 block text-sm font-semibold text-gray-800">
                  Email
                </label>
                <input
                  id="cs-email"
                  type="email"
                  value={values.email}
                  onChange={(event) => updateValue("email", event.target.value)}
                  placeholder="you@email.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className={INPUT_CLASS}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600" role="alert">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-start gap-2.5 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={values.consent}
                  onChange={(event) => updateValue("consent", event.target.checked)}
                  disabled={isSubmitting}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span>
                  I authorize ZapCash to fetch my credit report from Equifax and agree to the{" "}
                  <Link href="/terms" className="font-semibold text-primary hover:underline">
                    Terms
                  </Link>{" "}
                  &amp;{" "}
                  <Link href="/privacy-policy" className="font-semibold text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.consent && (
                <p className="mt-1 text-sm text-red-600" role="alert">{errors.consent}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-primary px-8 py-3 text-base font-semibold text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Checking…" : "Get my score — Free"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
