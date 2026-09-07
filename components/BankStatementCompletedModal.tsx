'use client';

function BankBuildingIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-[#22C55E]">
      <path d="M3 21h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 6l7-3 7 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 10v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 10v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 14v3 M12 14v3 M16 14v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type Props = { isOpen: boolean; onClose: () => void };

export default function BankStatementCompletedModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="completed-title">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006525] min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="flex flex-col items-center text-center pt-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F0FBF2] flex items-center justify-center mb-4">
            <BankBuildingIcon />
          </div>
          <h2 id="completed-title" className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Completed!
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            Your details have been successfully verified. Bank Statement Analysis completed.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-[#006525] text-white font-semibold hover:bg-[#004d1c] focus:outline-none focus:ring-2 focus:ring-[#006525] focus:ring-offset-2 min-h-[48px]"
          >
            Continue
          </button>
          <p className="text-sm text-gray-500 mt-4">Need help? <a href="#" className="text-[#006525] font-medium hover:underline">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
}
