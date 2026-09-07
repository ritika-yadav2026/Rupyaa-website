'use client';

import { useState } from 'react';
import BankStatementCompletedModal from './BankStatementCompletedModal';
import { validateIndianMobile, validateOrganizationName } from '@/lib/validation';
import ValidatedTextInput from './ValidatedTextInput';

function BankIcon({ className = 'text-[#22C55E]' }: { className?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 21h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 6l7-3 7 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 10v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 10v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 14v3 M12 14v3 M16 14v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type Props = {
  /** Called when verification fails: go to manual upload step */
  onContinue?: () => void;
  /** Called when verification succeeds: close modal and go to next screen (Approved Offer) */
  onSuccessComplete?: () => void;
};

type FieldErrors = { mobile?: string; organization?: string };

export default function BankStatementVerificationForm({ onContinue, onSuccessComplete }: Props) {
  const [mobile, setMobile] = useState('');
  const [organization, setOrganization] = useState('');
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onContinue || !onSuccessComplete) return;
    const mobileErr = validateIndianMobile(mobile);
    const orgErr = validateOrganizationName(organization);
    const newErrors: FieldErrors = {};
    if (mobileErr) newErrors.mobile = mobileErr;
    if (orgErr) newErrors.organization = orgErr;
    setErrors(newErrors);
    if (mobileErr || orgErr) return;
    setIsSubmitting(true);
    // Simulate verification: success 70% of the time; when success show modal, else go to manual upload
    setTimeout(() => {
      setIsSubmitting(false);
      const success = Math.random() < 0.7;
      if (success) {
        setShowCompletedModal(true);
      } else {
        onContinue();
      }
    }, 400);
  };

  const handleCompletedClose = () => {
    setShowCompletedModal(false);
    onSuccessComplete?.();
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 sm:p-6 md:p-8 max-w-2xl mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#F0FBF2] flex items-center justify-center mb-3 sm:mb-4">
          <BankIcon />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Bank Statement Verification</h2>
        <p className="text-xs sm:text-sm text-gray-500">
          We couldn&apos;t fetch your bank details automatically. Please verify below, then you can upload your statement.
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bank-mobile" className="text-sm text-gray-500 font-medium">
            Mobile Number (Linked to bank) *
          </label>
          <div className={`flex rounded-xl border overflow-hidden focus-within:ring-2 focus-within:ring-[#006525]/20 focus-within:border-[#006525] ${errors.mobile ? 'border-red-500' : 'border-gray-200'}`}>
            <span className="flex items-center px-4 bg-gray-50 text-gray-600 text-sm border-r border-gray-200 min-h-[48px]">+91</span>
            <input
              id="bank-mobile"
              type="tel"
              value={mobile}
              onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors((prev) => ({ ...prev, mobile: undefined })); }}
              placeholder="9876543210"
              className="flex-1 px-4 py-3 text-gray-900 placeholder:text-gray-400 min-h-[48px] focus:outline-none"
              aria-invalid={!!errors.mobile}
              aria-describedby={errors.mobile ? 'bank-mobile-error' : undefined}
            />
          </div>
          {errors.mobile && <p id="bank-mobile-error" className="text-sm text-red-600" role="alert">{errors.mobile}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="organization" className="text-sm text-gray-500 font-medium">
            Where do you work? (Organization name) *
          </label>
          <ValidatedTextInput
            id="organization"
            value={organization}
            policy="organization"
            maxLength={200}
            onValueChange={(value) => { setOrganization(value); setErrors((prev) => ({ ...prev, organization: undefined })); }}
            placeholder="Enter your organization or company name"
            className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006525]/20 focus:border-[#006525] min-h-[48px] ${errors.organization ? 'border-red-500' : 'border-gray-200'}`}
            aria-invalid={!!errors.organization}
            aria-describedby={errors.organization ? 'organization-error' : undefined}
          />
          {errors.organization && <p id="organization-error" className="text-sm text-red-600" role="alert">{errors.organization}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-[#006525] text-white font-semibold hover:bg-[#004d1c] focus:outline-none focus:ring-2 focus:ring-[#006525] focus:ring-offset-2 transition-colors mt-2 min-h-[48px] disabled:opacity-70 disabled:cursor-wait"
        >
          {isSubmitting ? 'Verifying…' : 'Continue'}
        </button>
      </form>

      <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
        Need help? <a href="#" className="text-[#006525] font-medium hover:underline">Contact Support</a>
      </p>

      <BankStatementCompletedModal isOpen={showCompletedModal} onClose={handleCompletedClose} />
    </div>
  );
}
