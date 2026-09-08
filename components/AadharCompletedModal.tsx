"use client";

import AppButton from "@/components/app-button";

type Props = { isOpen: boolean; onClose: () => void };

const BRAND_YELLOW = "#FECA42";
const BRAND_HALO = "#FFFCF4";

export default function AadharCompletedModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="aadhar-completed-title">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-xl text-center">
        <div
          className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full sm:h-28 sm:w-28"
          style={{ backgroundColor: BRAND_HALO }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="relative z-10"
            style={{ color: BRAND_YELLOW }}
          >
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={{
                backgroundColor: `${BRAND_YELLOW}99`,
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 45}deg) translateY(-52px)`,
              }}
            />
          ))}
        </div>
        <h2 id="aadhar-completed-title" className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
          Completed!
        </h2>
        <p className="mb-6 text-sm text-gray-600">
          Your Aadhar details have been successfully verified.
        </p>
        <AppButton type="button" fullWidth onClick={onClose}>
          Continue
        </AppButton>
        <p className="mt-4 text-sm text-gray-500">
          Need help?{" "}
          <a href="#" className="font-medium text-[#FECA42] hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
