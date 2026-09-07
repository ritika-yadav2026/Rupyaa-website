"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  validateName,
  validateIndianMobile,
  validateRequired,
} from "@/lib/validation";
import {
  postFamilyDetails,
  type PostFamilyDetailsPayload,
} from "@/lib/user-api";
import NeedContactSupport from "./NeedContactSupport";
import ValidatedTextInput from "./ValidatedTextInput";

type Props = { onContinue?: () => void };

const RELATIONSHIP_OPTIONS = [
  "Father",
  "Mother",
  "Spouse",
  "Brother",
  "Sister",
  "Other",
] as const;

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

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden max-w-2xl mx-auto w-full">

      <form className="pb-6 px-4 sm:px-6" onSubmit={handleSubmit} noValidate>
        <div className="flex items-center gap-2 rounded-t-xl bg-primary/10 px-4 py-3 border border-b-0 border-primary/20 -mx-4 sm:-mx-6 sm:rounded-t-2xl">
          <PeopleIcon />
          <h3 className="text-sm font-bold text-gray-900">Family Member</h3>
        </div>

        <div className=" border-gray-200 rounded-b-xl -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 space-y-4">
          <div>
            <label htmlFor="family-name" className="text-sm font-medium text-gray-700 mb-1 block">
              Name *
            </label>
            <ValidatedTextInput
              id="family-name"
              placeholder="e.g. Priya Sharma"
              value={name}
              policy="name"
              maxLength={100}
              onValueChange={(value) => {
                setName(value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className={`w-full px-4 py-3 rounded-xl border min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.name ? "border-red-500" : "border-gray-200"}`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "family-name-error" : undefined}
            />
            {errors.name && (
              <p id="family-name-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="family-relation" className="text-sm font-medium text-gray-700 mb-1 block">
              Relationship *
            </label>
            <select
              id="family-relation"
              value={relation}
              onChange={(e) => {
                setRelation(e.target.value);
                setErrors((prev) => ({ ...prev, relation: undefined }));
              }}
              className={`w-full px-4 py-3 rounded-xl border min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white ${errors.relation ? "border-red-500" : "border-gray-200"}`}
              aria-invalid={!!errors.relation}
              aria-describedby={errors.relation ? "family-relation-error" : undefined}
            >
              <option value="">Select relation</option>
              {RELATIONSHIP_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.relation && (
              <p id="family-relation-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.relation}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="family-mobile" className="text-sm font-medium text-gray-700 mb-1 block">
              Mobile Number *
            </label>
            <div className={`flex rounded-xl border overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary ${errors.mobile ? "border-red-500" : "border-gray-200"}`}>
              <span className="flex items-center gap-1 px-4 bg-gray-50 text-gray-600 text-sm border-r border-gray-200 min-h-[48px]">
                +91
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
              <input
                id="family-mobile"
                type="tel"
                inputMode="numeric"
                placeholder="Enter a valid 10 digit number"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setErrors((prev) => ({ ...prev, mobile: undefined }));
                }}
                className="flex-1 px-4 py-3 min-h-[48px] focus:outline-none"
                aria-invalid={!!errors.mobile}
                aria-describedby={errors.mobile ? "family-mobile-error" : undefined}
              />
            </div>
            {errors.mobile && (
              <p id="family-mobile-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.mobile}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </button>
      </form>

      <NeedContactSupport />
    </div>
  );
}
