"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
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
import AppButton from "@/components/app-button";
import AppTextField from "@/components/app-text-field";

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

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#FFE899" />
      <path
        d="M7 12.5l3.2 3.2L17 9"
        stroke="#111111"
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

  let mobileField: ReactNode = null;
  if (!isMobileLocked) {
    mobileField = (
      <AppTextField
        id="cs-mobile"
        label="Mobile number"
        type="tel"
        inputMode="numeric"
        value={values.mobileNumber}
        onChange={handleMobileChange}
        placeholder="98765 43210"
        autoComplete="tel"
        prefix="+91"
        disabled={isSubmitting}
        error={errors.mobileNumber}
      />
    );
  }

  let dobMobileGridClassName = "grid grid-cols-1 gap-4";
  if (!isMobileLocked) {
    dobMobileGridClassName = "grid grid-cols-1 gap-4 sm:grid-cols-2";
  }

  let submitLabel: string;
  if (isSubmitting) {
    submitLabel = "Checking…";
  } else {
    submitLabel = "Get my score — Free";
  }

  let consentError: ReactNode = null;
  if (errors.consent) {
    consentError = (
      <p className="mt-1 text-sm text-red-600" role="alert">
        {errors.consent}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col lg:flex-row">
        <div className="relative flex flex-col justify-center overflow-hidden bg-[#FECA42] p-6 text-gray-900 sm:p-8 lg:w-[40%] lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE899]/70" />
          <h1 className="relative text-4xl font-bold leading-tight sm:text-5xl">
            Check your
            <br />
            Credit Score
          </h1>
          <p className="relative mt-3 text-sm text-gray-800 sm:text-base">
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
          <p className="relative mt-8 flex items-center gap-2 text-xs text-gray-800">
            <LockIcon />
            256-bit encrypted · Powered by Equifax
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 sm:p-8 lg:p-10" noValidate>
          <h3 className="text-2xl font-bold text-gray-900">Tell us about you</h3>
          <p className="mt-1 text-sm text-gray-500">All fields are required.</p>

          <div className="mt-6 space-y-4">
            <AppTextField
              id="cs-full-name"
              label="Full name"
              type="text"
              value={values.fullName}
              onChange={(event) => updateValue("fullName", event.target.value)}
              placeholder="Name as per PAN"
              autoComplete="name"
              disabled={isSubmitting}
              error={errors.fullName}
            />

            <AppTextField
              id="cs-pan"
              label="PAN number"
              type="text"
              value={values.panNumber}
              onChange={(event) => updateValue("panNumber", sanitizePanInput(event.target.value))}
              placeholder="ABCDE1234F"
              autoCapitalize="characters"
              disabled={isSubmitting}
              error={errors.panNumber}
              inputClassName="uppercase"
            />

            <div className={dobMobileGridClassName}>
              <AppTextField
                id="cs-dob"
                label="Date of birth"
                type="date"
                value={values.dob}
                onChange={(event) => updateValue("dob", event.target.value)}
                max={new Date().toISOString().split("T")[0]}
                disabled={isSubmitting}
                error={errors.dob}
              />
              {mobileField}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AppTextField
                id="cs-income"
                label="Monthly income"
                type="text"
                inputMode="numeric"
                value={values.monthlyIncome}
                onChange={handleIncomeChange}
                placeholder="50,000"
                prefix="₹"
                disabled={isSubmitting}
                error={errors.monthlyIncome}
              />
              <AppTextField
                id="cs-email"
                label="Email"
                type="email"
                value={values.email}
                onChange={(event) => updateValue("email", event.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
                disabled={isSubmitting}
                error={errors.email}
              />
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
                  <Link href="/terms" className="font-semibold text-[#FECA42] hover:underline">
                    Terms
                  </Link>{" "}
                  &amp;{" "}
                  <Link href="/privacy-policy" className="font-semibold text-[#FECA42] hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {consentError}
            </div>

            <AppButton type="submit" fullWidth disabled={isSubmitting} className="mt-2">
              {submitLabel}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}
