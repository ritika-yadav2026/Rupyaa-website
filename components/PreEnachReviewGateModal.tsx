"use client";

import Image from "next/image";
import loanSanctionedIcon from "@/public/images/congress.png";
import SupportTeamQuerySection from "./SupportTeamQuerySection";

type Props = {
  visible: boolean;
  isLoading: boolean;
  hasError: boolean;
  /** Passed for parity with native; reserved if UI differentiates enach vs esign later. */
  substepId?: string;
  onRetry: () => void | Promise<void>;
  onBackToHome: () => void;
};

/**
 * Full-screen overlay when pre-E-NACH review blocks `enach` / `esign`.
 * Content aligns with native SanctionedStep modal presentation (exact subtitle/body copy).
 */
export default function PreEnachReviewGateModal({
  visible,
  isLoading,
  hasError,
  onRetry,
  onBackToHome,
}: Props) {
  if (!visible) return null;

  const handlePrimary = () => {
    onBackToHome();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pre-enach-review-title"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 text-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-14 gap-4">
            <div
              className="h-11 w-11 border-2 border-primary border-t-transparent rounded-full animate-spin"
              aria-hidden
            />
            <p className="text-sm text-gray-600">Checking your application status…</p>
          </div>
        ) : hasError ? (
          <div className="py-6">
            <p className="text-gray-800 mb-6">
              We couldn&apos;t verify whether you can continue. Please try again.
            </p>
            <button
              type="button"
              onClick={() => void Promise.resolve(onRetry())}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px] mb-3"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={handlePrimary}
              className="w-full py-3.5 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px]"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4 sm:mb-6">
              <Image
                src={loanSanctionedIcon}
                alt=""
                width={300}
                height={300}
                className="w-[180px] sm:w-[240px] md:w-[260px] h-auto"
              />
            </div>

            <h2
              id="pre-enach-review-title"
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-1"
            >
              Great news! 🎉
            </h2>
            <p className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
              Verification in progress.✅
            </p>
            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
              Once approved, complete the final steps to receive funds in your account within 24 hours.
            </p>

            <SupportTeamQuerySection />

            <button
              type="button"
              onClick={handlePrimary}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px]"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
