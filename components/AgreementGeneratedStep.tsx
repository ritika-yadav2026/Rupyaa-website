'use client';

type Props = { onContinue?: () => void };

export default function AgreementGeneratedStep({ onContinue }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 sm:p-6 md:p-8 max-w-2xl mx-auto w-full">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-center">Your Agreement has been generated</h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        One last step remaining. Review your loan sanction document before e-signing.
      </p>

      <div className="rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="flex items-center gap-2 bg-secondary/20 px-3 py-2 border-b border-gray-200">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary shrink-0">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span className="text-sm font-semibold text-gray-800">Loan Agreement</span>
        </div>
        <div className="p-4 sm:p-5 bg-white">
          <p className="text-sm font-medium text-gray-800 mb-4">Please review your loan agreement!</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[40px]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[40px]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
              Fullscreen
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-100/80 p-4 sm:p-5 mb-6 text-sm text-gray-700">
        <p className="font-bold text-gray-900 mb-2">WEEKLINE INVESTMENT AND TRADING COMPANY LTD</p>
        <p className="mb-1">79, Ground Floor, World Trade Centre, Babar Lane, New Delhi 110001 India</p>
        <p className="text-gray-600">RBI Registered NO. :: 14.01001</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Key Facts Statement</h3>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 text-gray-600 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-800 truncate">Agreement Document.pdf</span>
          </div>
          <button
            type="button"
            className="shrink-0 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Download"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 text-center mb-4">
        Ready to Proceed? Review the document and e-sign to complete your loan process.
      </p>
      <button
        type="button"
        onClick={onContinue}
        className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px]"
      >
        Generate Agreement
      </button>
    </div>
  );
}
