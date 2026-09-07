'use client';

function BankBuildingIcon({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 21h18 M3 10h18 M5 6l7-3 7 3 M4 10v11 M20 10v11 M8 14v3 M12 14v3 M16 14v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 8l-5-5-5 5 M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onUploadAgain: () => void;
  /** When provided, show "Continue" button to proceed to Application Under Review anyway */
  onContinue?: () => void;
};

export default function UnableToDetectSalaryModal({ isOpen, onClose, onUploadAgain, onContinue }: Props) {
  if (!isOpen) return null;

  const handleUploadAgain = () => {
    onUploadAgain();
    onClose();
  };

  const handleContinue = () => {
    onContinue?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="salary-error-title">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 sm:p-8 shadow-xl mx-2 max-h-[90vh] overflow-y-auto">
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <BankBuildingIcon className="text-red-600" size={32} />
          </div>
        </div>
        <h2 id="salary-error-title" className="mb-2 text-center text-xl font-bold text-red-600">Unable to Detect Salary!</h2>
        <p className="mb-6 text-center text-sm text-gray-500">We couldn&apos;t find any salary information in this document.</p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleUploadAgain}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#006525] bg-white py-3 font-medium text-[#006525] min-h-[48px] hover:bg-[#E8F5E9] focus:outline-none focus:ring-2 focus:ring-[#006525] focus:ring-offset-2"
          >
            <UploadIcon className="text-[#006525]" />
            Upload Again
          </button>
          {onContinue && (
            <button
              type="button"
              onClick={handleContinue}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006525] text-white py-3 font-semibold min-h-[48px] hover:bg-[#004d1c] focus:outline-none focus:ring-2 focus:ring-[#006525] focus:ring-offset-2"
            >
              Continue
            </button>
          )}
        </div>
        <p className="text-center text-sm text-gray-400 mt-4">
          Need to update your statement? <button type="button" onClick={onClose} className="font-medium text-[#006525] hover:underline">Update statement</button>
        </p>
      </div>
    </div>
  );
}
