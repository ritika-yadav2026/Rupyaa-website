'use client';

import Image from 'next/image';
import waitingIcon from '@/public/images/waiting.png';

type Props = { onViewOffer?: () => void };

export default function ApplicationUnderReview({ onViewOffer }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 sm:p-8 max-w-2xl mx-auto w-full text-center">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-4 sm:mb-6">
          <Image src={waitingIcon} alt="document-clock" width={50} height={50} />
        </div>
        <p className="text-sm text-gray-500 font-medium mb-1">Application No.</p>
        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">#1234567</p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Your Application is under review!</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
          Our team is working to generate the best offer tailored for you.
        </p>
        <div className="w-full max-w-sm mx-auto rounded-xl bg-[#E8F5E9] border border-[#006525]/20 px-4 py-3 mb-4 sm:mb-6 flex items-center justify-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#006525] shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-sm font-semibold text-[#006525]">Estimated Time: Few Minutes</p>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-md mx-auto">
          Most applications are reviewed within a few Minutes during working hours (Mon-Sat, 9am-7pm). Your status will update automatically — or click &apos;Refresh&apos; above.
        </p>
        <button
          type="button"
          onClick={onViewOffer}
          className="w-full sm:w-auto min-w-[200px] py-3.5 px-6 rounded-xl bg-[#006525] text-white font-semibold hover:bg-[#004d1c] focus:outline-none focus:ring-2 focus:ring-[#006525] focus:ring-offset-2 min-h-[48px]"
        >
          View my offer
        </button>
      </div>
    </div>
  );
}
