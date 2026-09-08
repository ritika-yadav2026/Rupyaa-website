"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  sanitizeTextInput,
  validateName,
  validateIndianMobile,
  validateReferenceMobilesDistinct,
} from "@/lib/validation";
import {
  postReferenceDetails,
  type PostReferenceDetailsPayload,
} from "@/lib/user-api";
import AppButton from "@/components/app-button";
import AppTextField from "@/components/app-text-field";
import NeedContactSupport from "./NeedContactSupport";

type Props = { onContinue?: () => void };

const NAME_MAX_LENGTH = 100;

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

export default function ReferenceDetailsStep({ onContinue }: Props) {
  const [ref1Name, setRef1Name] = useState("");
  const [ref1Mobile, setRef1Mobile] = useState("");
  const [ref2Name, setRef2Name] = useState("");
  const [ref2Mobile, setRef2Mobile] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const submitMutation = useMutation({
    mutationFn: postReferenceDetails,
    onSuccess: () => {
      toast.success("Reference details saved");
      onContinue?.();
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to save reference details");
    },
  });

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

    const payload: PostReferenceDetailsPayload = {
      reference1: {
        name: ref1Name.trim(),
        mobile: ref1Mobile.replace(/\D/g, "").slice(0, 10),
        relationship: "",
      },
      reference2: {
        name: ref2Name.trim(),
        mobile: ref2Mobile.replace(/\D/g, "").slice(0, 10),
        relationship: "",
      },
    };
    submitMutation.mutate(payload);
  };

  const isSubmitting = submitMutation.isPending;

  let submitLabel: string;
  if (isSubmitting) {
    submitLabel = "Saving...";
  } else {
    submitLabel = "Continue";
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden max-w-2xl mx-auto w-full">
      <form className="pb-6 px-4 sm:px-6" onSubmit={handleSubmit} noValidate>
        <div className="flex items-center gap-2 rounded-t-xl bg-[#FFE398] px-4 py-3 border border-b-0 border-[#FFF4D9] -mx-4 sm:-mx-6 sm:rounded-t-2xl">
          <PeopleIcon />
          <h3 className="text-sm font-bold text-gray-900">References</h3>
        </div>

        <div className="border-gray-200 rounded-b-xl -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 space-y-0">
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 mb-4">
            <PersonIcon />
            <span className="text-sm font-semibold text-gray-800">Reference Details 1</span>
          </div>
          <div className="space-y-3 mb-6">
            <AppTextField
              id="ref1-name"
              label="Name of Reference *"
              placeholder="Please enter your Full Name"
              value={ref1Name}
              maxLength={NAME_MAX_LENGTH}
              error={errors.ref1Name}
              onChange={(e) => {
                const value = sanitizeTextInput(e.target.value, "name").slice(0, NAME_MAX_LENGTH);
                setRef1Name(value);
                setErrors((prev) => ({ ...prev, ref1Name: undefined }));
              }}
            />
            <AppTextField
              id="ref1-mobile"
              label="Mobile Number *"
              type="tel"
              inputMode="numeric"
              placeholder="Enter a valid 10 digit number"
              value={ref1Mobile}
              prefix="+91"
              error={errors.ref1Mobile}
              onChange={(e) => {
                setRef1Mobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                setErrors((prev) => ({ ...prev, ref1Mobile: undefined }));
              }}
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 mb-4">
            <PersonIcon />
            <span className="text-sm font-semibold text-gray-800">Reference Details 2</span>
          </div>
          <div className="space-y-3">
            <AppTextField
              id="ref2-name"
              label="Name of Reference *"
              placeholder="Please enter your Full Name"
              value={ref2Name}
              maxLength={NAME_MAX_LENGTH}
              error={errors.ref2Name}
              onChange={(e) => {
                const value = sanitizeTextInput(e.target.value, "name").slice(0, NAME_MAX_LENGTH);
                setRef2Name(value);
                setErrors((prev) => ({ ...prev, ref2Name: undefined }));
              }}
            />
            <AppTextField
              id="ref2-mobile"
              label="Mobile Number *"
              type="tel"
              inputMode="numeric"
              placeholder="Enter a valid 10 digit number"
              value={ref2Mobile}
              prefix="+91"
              error={errors.ref2Mobile}
              onChange={(e) => {
                setRef2Mobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                setErrors((prev) => ({ ...prev, ref2Mobile: undefined }));
              }}
            />
          </div>
        </div>

        <AppButton type="submit" fullWidth disabled={isSubmitting} className="mt-6">
          {submitLabel}
        </AppButton>
      </form>

      <NeedContactSupport />
    </div>
  );
}
