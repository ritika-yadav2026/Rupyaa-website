'use client';

import { useState } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import DetailsSubmittedModal from "./DetailsSubmittedModal";
import {
  validateBankAccountConfirmation,
  validateBankAccountNumber,
  validateIfsc,
} from "@/lib/validation";

type FieldErrors = {
  accountNumber?: string;
  confirmAccount?: string;
  ifsc?: string;
};

export default function DisbursalStep() {
  const setDisbursalSubmitted = useFlowStore((s) => s.setDisbursalSubmitted);
  const resetFlow = useFlowStore((s) => s.resetFlow);
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccount, setConfirmAccount] = useState("");
  const [ifsc, setIfsc] = useState("ICIC0001234");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const accErr = validateBankAccountNumber(accountNumber);
    const confirmErr = validateBankAccountConfirmation(accountNumber, confirmAccount);
    const ifscErr = validateIfsc(ifsc);
    const next: FieldErrors = {};
    if (accErr) next.accountNumber = accErr;
    if (confirmErr) next.confirmAccount = confirmErr;
    if (ifscErr) next.ifsc = ifscErr;
    setErrors(next);
    if (accErr || confirmErr || ifscErr) return;
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSubmitted(true);
    setDisbursalSubmitted(true);
  };

  const handleBackToDashboard = () => {
    resetFlow();
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 sm:p-8 max-w-2xl mx-auto w-full text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F0FBF2] flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#22C55E]">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
        <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-md mx-auto">
          Your loan application is under review. We&apos;ll notify you once the verification is complete and funds are disbursed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={handleBackToDashboard}
            className="px-6 py-3 rounded-xl bg-[#006525] text-white font-semibold hover:bg-[#004d1c] min-h-[48px]"
          >
            Back to Dashboard
          </button>
          <a
            href="/personal-loan"
            className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 min-h-[48px] flex items-center justify-center"
          >
            Track Application
          </a>
        </div>
      </div>
    );
  }

  const canSubmit =
    !validateBankAccountNumber(accountNumber) &&
    !validateBankAccountConfirmation(accountNumber, confirmAccount) &&
    !validateIfsc(ifsc);

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 sm:p-6 md:p-8 max-w-2xl mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#F0FBF2] flex items-center justify-center mb-3 sm:mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#22C55E]">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Secure Your Disbursal</h2>
        <p className="text-xs sm:text-sm text-gray-500">Verify your bank details to receive your loan on time.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="rounded-xl bg-[#F0FDF4] border border-[#22C55E]/20 p-4">
          <div className="flex items-center gap-2 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#22C55E] shrink-0">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <span className="text-sm font-semibold text-gray-900">Bank Details Verification</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#22C55E] ml-1">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span className="text-xs font-medium text-[#22C55E]">Secured & Encrypted</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">Bank Account Number *</label>
              <p className="text-xs text-gray-500">(Fill you account number ending with xxxxxxx5678)</p>
              <input
                id="accountNumber"
                type="text"
                inputMode="numeric"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 18));
                  setErrors((prev) => ({ ...prev, accountNumber: undefined, confirmAccount: undefined }));
                }}
                placeholder="Enter account number"
                className={`w-full px-4 py-3 rounded-xl border min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#006525]/20 focus:border-[#006525] ${
                  errors.accountNumber ? "border-red-500" : "border-gray-200"
                }`}
                aria-invalid={!!errors.accountNumber}
                aria-describedby={errors.accountNumber ? "accountNumber-error" : undefined}
              />
              {errors.accountNumber && (
                <p id="accountNumber-error" className="text-sm text-red-600" role="alert">
                  {errors.accountNumber}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmAccount" className="text-sm font-medium text-gray-700">Confirm Bank Account Number *</label>
              <input
                id="confirmAccount"
                type="text"
                inputMode="numeric"
                value={confirmAccount}
                onChange={(e) => {
                  setConfirmAccount(e.target.value.replace(/\D/g, "").slice(0, 18));
                  setErrors((prev) => ({ ...prev, confirmAccount: undefined }));
                }}
                placeholder="Re-enter account number"
                className={`w-full px-4 py-3 rounded-xl border min-h-[48px] focus:outline-none focus:ring-2 ${
                  errors.confirmAccount || (confirmAccount && accountNumber !== confirmAccount)
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:ring-[#006525]/20 focus:border-[#006525]"
                }`}
                aria-invalid={!!errors.confirmAccount}
                aria-describedby={errors.confirmAccount ? "confirmAccount-error" : undefined}
              />
              {errors.confirmAccount && (
                <p id="confirmAccount-error" className="text-sm text-red-600" role="alert">
                  {errors.confirmAccount}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ifsc" className="text-sm font-medium text-gray-700">IFSC Code *</label>
              <input
                id="ifsc"
                type="text"
                value={ifsc}
                onChange={(e) => {
                  setIfsc(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11));
                  setErrors((prev) => ({ ...prev, ifsc: undefined }));
                }}
                placeholder="ICIC0001234"
                className={`w-full px-4 py-3 rounded-xl border min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#006525]/20 focus:border-[#006525] font-mono uppercase ${
                  errors.ifsc ? "border-red-500" : "border-gray-200"
                }`}
                aria-invalid={!!errors.ifsc}
                aria-describedby={errors.ifsc ? "ifsc-error" : undefined}
              />
              {errors.ifsc && (
                <p id="ifsc-error" className="text-sm text-red-600" role="alert">
                  {errors.ifsc}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-[#E8F5E9] border border-[#006525]/20 px-4 py-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#006525] shrink-0 mt-0.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <p className="text-sm text-gray-700">This is the bank account for loan disbursal.</p>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-3.5 rounded-xl font-semibold min-h-[48px] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            canSubmit ? "bg-[#006525] text-white hover:bg-[#004d1c] focus:ring-[#006525]" : "bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-300"
          }`}
        >
          Continue
        </button>
      </form>

      <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
        Need help? <a href="#" className="text-[#006525] font-medium hover:underline">Contact Support</a>
      </p>

      <DetailsSubmittedModal isOpen={showSuccessModal} onClose={handleSuccessModalClose} />
    </div>
  );
}
