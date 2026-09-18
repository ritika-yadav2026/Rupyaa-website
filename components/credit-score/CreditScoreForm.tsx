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
import styles from "./CreditScoreForm.module.css";

interface CreditScoreFormProps {
  readonly onSubmit: (values: CreditScoreFormValues) => void;
  readonly isSubmitting: boolean;
  readonly initialValues?: Partial<CreditScoreFormValues>;
  /** When true, mobile is taken from the logged-in account and the field is hidden. */
  readonly isMobileLocked?: boolean;
}

type FieldErrors = Partial<Record<keyof CreditScoreFormValues, string>>;

function CreditScoreGauge() {
  return (
    <svg viewBox="0 0 200 130" className="w-32 shrink-0 sm:w-44" aria-hidden="true">
      <path d="M30 110 A70 70 0 0 1 50.5 60.5" fill="none" stroke="#ff2424" strokeWidth="22" />
      <path d="M53 58 A70 70 0 0 1 98 40" fill="none" stroke="#ff681c" strokeWidth="22" />
      <path d="M102 40 A70 70 0 0 1 147 58" fill="none" stroke="#ffcc24" strokeWidth="22" />
      <path d="M150 61 A70 70 0 0 1 170 110" fill="none" stroke="#20c520" strokeWidth="22" />
      <text x="17" y="87" fill="#ff2424" fontSize="10" transform="rotate(-65 17 87)">POOR</text>
      <text x="53" y="35" fill="#ff681c" fontSize="10" transform="rotate(-30 53 35)">FAIR</text>
      <text x="119" y="29" fill="#e9ad00" fontSize="10" transform="rotate(22 119 29)">GOOD</text>
      <text x="171" y="53" fill="#20a920" fontSize="9" transform="rotate(65 171 53)">EXCELLENT</text>
      <circle cx="100" cy="104" r="20" fill="#ff681c" />
      <path d="M100 84 A20 20 0 0 1 100 124Z" fill="#20c520" />
      <path d="M94 105 L126 43 L105 110Z" fill="#303030" />
      <circle cx="100" cy="104" r="6" fill="#ffcc24" />
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
    <div className={styles.root}>
      <div className="flex min-h-[140px] items-center justify-between gap-3 rounded-xl border border-[#FECA42] bg-[#FFFCF4] px-4 py-4 sm:px-5">
        <div>
          <h1 className="text-2xl font-semibold leading-tight sm:text-[28px]">
            <span className="bg-gradient-to-r from-[#ff4b18] via-[#ffb900] to-[#68c817] bg-clip-text text-transparent">Check Your Credit</span>
            <br />
            <span className="text-[#ff7818]">Score, Free</span>
          </h1>
          <p className="mt-1 max-w-[270px] text-xs leading-relaxed text-gray-600 sm:text-sm">
            Know your score, accounts, EMIs, enquiries &amp; payment history.
          </p>
        </div>
        <CreditScoreGauge />
      </div>

      <form onSubmit={handleSubmit} className="mt-7" noValidate>
        <h2 className="text-2xl font-bold text-[#383838] sm:text-[26px]">Let’s check your credit score</h2>
        <p className="mt-2 text-base text-gray-600">Enter your details to get your personalised credit report.</p>

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
                label="Date of Birth (as per PAN)"
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
                  I authorize Rupyaa to fetch my credit report from Equifax and agree to the{" "}
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

            <AppButton type="submit" fullWidth disabled={isSubmitting} className="mt-2 min-h-[42px] rounded-md bg-[#FECA42] py-2.5 text-sm">
              {submitLabel}
            </AppButton>
          </div>
        </form>
    </div>
  );
}
