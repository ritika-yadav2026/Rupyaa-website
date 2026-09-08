"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  sanitizeTextInput,
  validateName,
  validateIndianMobile,
  validateRequired,
} from "@/lib/validation";
import {
  postFamilyDetails,
  type PostFamilyDetailsPayload,
} from "@/lib/user-api";
import AppButton from "@/components/app-button";
import AppSelectField from "@/components/app-select-field";
import AppTextField from "@/components/app-text-field";
import NeedContactSupport from "./NeedContactSupport";

type Props = { onContinue?: () => void };

const RELATIONSHIP_OPTIONS = [
  { value: "Father", label: "Father" },
  { value: "Mother", label: "Mother" },
  { value: "Spouse", label: "Spouse" },
  { value: "Brother", label: "Brother" },
  { value: "Sister", label: "Sister" },
  { value: "Other", label: "Other" },
] as const;

const NAME_MAX_LENGTH = 100;

type FieldErrors = {
  name?: string;
  relation?: string;
  mobile?: string;
};

function PeopleIcon({ className = "text-primary" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function FamilyDetailsStep({ onContinue }: Props) {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const submitMutation = useMutation({
    mutationFn: postFamilyDetails,
    onSuccess: () => {
      toast.success("Family details saved");
      onContinue?.();
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to save family details");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr = validateName(name, "Family member name");
    const relationErr = validateRequired(relation, "Relationship");
    const mobileErr = validateIndianMobile(mobile);
    const newErrors: FieldErrors = {};
    if (nameErr) newErrors.name = nameErr;
    if (relationErr) newErrors.relation = relationErr;
    if (mobileErr) newErrors.mobile = mobileErr;
    setErrors(newErrors);
    if (nameErr || relationErr || mobileErr) return;

    const payload: PostFamilyDetailsPayload = {
      familyMember: {
        name: name.trim(),
        relation: relation.trim(),
        mobile: mobile.replace(/\D/g, "").slice(0, 10),
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
          <h3 className="text-sm font-bold text-gray-900">Family Member</h3>
        </div>

        <div className="border-gray-200 rounded-b-xl -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 space-y-4">
          <AppTextField
            id="family-name"
            label="Name *"
            placeholder="e.g. Priya Sharma"
            value={name}
            maxLength={NAME_MAX_LENGTH}
            error={errors.name}
            onChange={(e) => {
              const value = sanitizeTextInput(e.target.value, "name").slice(0, NAME_MAX_LENGTH);
              setName(value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
          />

          <AppSelectField
            id="family-relation"
            label="Relationship *"
            value={relation}
            onChange={(e) => {
              setRelation(e.target.value);
              setErrors((prev) => ({ ...prev, relation: undefined }));
            }}
            placeholder="Select relation"
            options={RELATIONSHIP_OPTIONS}
            error={errors.relation}
          />

          <AppTextField
            id="family-mobile"
            label="Mobile Number *"
            type="tel"
            inputMode="numeric"
            placeholder="Enter a valid 10 digit number"
            value={mobile}
            prefix="+91"
            error={errors.mobile}
            onChange={(e) => {
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
              setErrors((prev) => ({ ...prev, mobile: undefined }));
            }}
          />
        </div>

        <AppButton type="submit" fullWidth disabled={isSubmitting} className="mt-6">
          {submitLabel}
        </AppButton>
      </form>

      <NeedContactSupport />
    </div>
  );
}
