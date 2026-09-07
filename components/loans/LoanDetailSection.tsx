"use client";

import type { ReactNode } from "react";

export function LoanDetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900 text-right">{value}</span>
    </div>
  );
}

export function AmountSummaryBox({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-primary/40 bg-[#E8F5E9]/60 px-4 py-3 my-4">
      <span className="text-sm font-semibold text-gray-900">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{amount}</span>
    </div>
  );
}
