'use client';

type Props = { isOpen: boolean; onClose: () => void };

export default function KYCCompletedModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="kyc-completed-title">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-xl text-center">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#F0FBF2] flex items-center justify-center mx-auto mb-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary relative z-10">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-full bg-secondary/60"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 45}deg) translateY(-52px)`,
              }}
            />
          ))}
        </div>
        <h2 id="kyc-completed-title" className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Your KYC Is Completed!
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          You can now proceed with your loan application process. We will get your documents verified in 24 hrs.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
