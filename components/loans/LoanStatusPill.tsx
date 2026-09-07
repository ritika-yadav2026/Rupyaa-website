"use client";

import type { LoanStatusColorVariant } from "@/helpers/loan-helper";

const VARIANT_CLASSES: Record<LoanStatusColorVariant, string> = {
  error: "bg-red-100 text-red-700",
  success: "bg-primary/15 text-primary",
  warning: "bg-amber-100 text-amber-800",
  neutral: "bg-gray-100 text-gray-700",
};

export function LoanStatusPill({
  label,
  variant,
}: {
  label: string;
  variant: LoanStatusColorVariant;
}) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${VARIANT_CLASSES[variant]}`}
    >
      {label}
    </span>
  );
}
