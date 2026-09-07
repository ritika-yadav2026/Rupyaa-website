"use client";

import { useRouter } from "next/navigation";

export function PaymentScreenHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50"
        aria-label="Go back"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
    </div>
  );
}
