'use client';

import { useState } from "react";
import {
  validateName,
  validateIndianMobile,
  validateReferenceMobilesDistinct,
} from "@/lib/validation";
import NeedContactSupport from "./NeedContactSupport";
import ValidatedTextInput from "./ValidatedTextInput";

type FieldErrors = {
  ref1Name?: string;
  ref1Mobile?: string;
  ref2Name?: string;
  ref2Mobile?: string;
};

function PersonIcon({ className = "text-primary" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PeopleIcon({ className = "text-primary" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

type Props = { onContinue?: () => void };

export default function PersonalFamilyDetailsStep({ onContinue }: Props) {
  const [ref1Name, setRef1Name] = useState("");
  const [ref1Mobile, setRef1Mobile] = useState("");
  const [ref2Name, setRef2Name] = useState("");
  const [ref2Mobile, setRef2Mobile] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref1NameErr = validateName(ref1Name, "Name of reference 1");
    const ref1MobileErr = validateIndianMobile(ref1Mobile);
    const ref2NameErr = validateName(ref2Name, "Name of reference 2");
    const ref2MobileErr = validateIndianMobile(ref2Mobile);
    const newErrors: FieldErrors = {};
    if (ref1NameErr) newErrors.ref1Name = ref1NameErr;
    if (ref1MobileErr) newErrors.ref1Mobile = ref1MobileErr;
    if (ref2NameErr) newErrors.ref2Name = ref2NameErr;
    if (ref2MobileErr) newErrors.ref2Mobile = ref2MobileErr;
    const distinct = validateReferenceMobilesDistinct(ref1Mobile, ref2Mobile, "");
    if (distinct.ref2Mobile) newErrors.ref2Mobile = distinct.ref2Mobile;
    setErrors(newErrors);
    if (
      ref1NameErr ||
      ref1MobileErr ||
      ref2NameErr ||
      ref2MobileErr ||
      distinct.ref2Mobile
    ) {
      return;
    }
    onContinue?.();
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden max-w-2xl mx-auto w-full">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 text-center pt-6 px-4 sm:px-6">Reference Details</h2>
      <p className="text-sm text-gray-500 text-center mb-6 px-4 sm:px-6">Share two trusted contacts. We will reach out only if absolutely necessary.</p>

      <form className="pb-6 px-4 sm:px-6" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-t-xl bg-primary/10 px-4 py-3 border border-b-0 border-primary/20 -mx-4 sm:-mx-6 sm:rounded-t-2xl">
          <PeopleIcon />
          <h3 className="text-sm font-bold text-gray-900">References</h3>
        </div>

        <div className="border border-t-0 border-gray-200 rounded-b-xl -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 space-y-0">
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 mb-4">
            <PersonIcon />
            <span className="text-sm font-semibold text-gray-800">Reference Details 1</span>
          </div>
          <div className="space-y-3 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Name of Reference *</label>
              <ValidatedTextInput
                placeholder="Please enter your Full Name"
                value={ref1Name}
                policy="name"
                maxLength={100}
                onValueChange={(value) => { setRef1Name(value); setErrors((prev) => ({ ...prev, ref1Name: undefined })); }}
                className={`w-full px-4 py-3 rounded-xl border min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.ref1Name ? "border-red-500" : "border-gray-200"}`}
                aria-invalid={!!errors.ref1Name}
                aria-describedby={errors.ref1Name ? "ref1-name-error" : undefined}
              />
              {errors.ref1Name && <p id="ref1-name-error" className="text-sm text-red-600 mt-1" role="alert">{errors.ref1Name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Mobile Number *</label>
              <div className={`flex rounded-xl border overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary ${errors.ref1Mobile ? "border-red-500" : "border-gray-200"}`}>
                <span className="flex items-center gap-1 px-4 bg-gray-50 text-gray-600 text-sm border-r border-gray-200 min-h-[48px]">
                  +91
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
                <input
                  type="tel"
                  placeholder="Enter a valid 10 digit number"
                  value={ref1Mobile}
                  onChange={(e) => { setRef1Mobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors((prev) => ({ ...prev, ref1Mobile: undefined })); }}
                  className="flex-1 px-4 py-3 min-h-[48px] focus:outline-none"
                  aria-invalid={!!errors.ref1Mobile}
                  aria-describedby={errors.ref1Mobile ? "ref1-mobile-error" : undefined}
                />
              </div>
              {errors.ref1Mobile && <p id="ref1-mobile-error" className="text-sm text-red-600 mt-1" role="alert">{errors.ref1Mobile}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 mb-4">
            <PersonIcon />
            <span className="text-sm font-semibold text-gray-800">Reference Details 2</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Name of Reference *</label>
              <ValidatedTextInput
                placeholder="Please enter your Full Name"
                value={ref2Name}
                policy="name"
                maxLength={100}
                onValueChange={(value) => { setRef2Name(value); setErrors((prev) => ({ ...prev, ref2Name: undefined })); }}
                className={`w-full px-4 py-3 rounded-xl border min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.ref2Name ? "border-red-500" : "border-gray-200"}`}
                aria-invalid={!!errors.ref2Name}
                aria-describedby={errors.ref2Name ? "ref2-name-error" : undefined}
              />
              {errors.ref2Name && <p id="ref2-name-error" className="text-sm text-red-600 mt-1" role="alert">{errors.ref2Name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Mobile Number *</label>
              <div className={`flex rounded-xl border overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary ${errors.ref2Mobile ? "border-red-500" : "border-gray-200"}`}>
                <span className="flex items-center gap-1 px-4 bg-gray-50 text-gray-600 text-sm border-r border-gray-200 min-h-[48px]">
                  +91
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
                <input
                  type="tel"
                  placeholder="Enter a valid 10 digit number"
                  value={ref2Mobile}
                  onChange={(e) => { setRef2Mobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors((prev) => ({ ...prev, ref2Mobile: undefined })); }}
                  className="flex-1 px-4 py-3 min-h-[48px] focus:outline-none"
                  aria-invalid={!!errors.ref2Mobile}
                  aria-describedby={errors.ref2Mobile ? "ref2-mobile-error" : undefined}
                />
              </div>
              {errors.ref2Mobile && <p id="ref2-mobile-error" className="text-sm text-red-600 mt-1" role="alert">{errors.ref2Mobile}</p>}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px]"
        >
          Continue
        </button>
      </form>

      <NeedContactSupport />
    </div>
  );
}
