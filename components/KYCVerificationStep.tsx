'use client';

import { useState, useRef } from "react";
import { useFlowStore } from "@/store/useFlowStore";

const MAX_FILE_MB = 5;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#22C55E] shrink-0">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IdIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#006525]">
      <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
      <path d="M3 10h18M9 14h6" strokeLinecap="round" />
    </svg>
  );
}

export default function KYCVerificationStep() {
  const nextStep = useFlowStore((s) => s.nextStep);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [addressFile, setAddressFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const aadhaarRef = useRef<HTMLInputElement>(null);
  const panRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);

  const validateFile = (f: File): boolean => {
    if (f.size > MAX_FILE_BYTES) {
      setError(`File must be under ${MAX_FILE_MB}MB`);
      return false;
    }
    const isImage = f.type.startsWith("image/");
    const isPdf = f.type === "application/pdf";
    if (!isImage && !isPdf) {
      setError("Please upload JPEG, PNG or PDF");
      return false;
    }
    setError(null);
    return true;
  };

  const handleFile = (setter: (f: File | null) => void, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (validateFile(f)) setter(f);
    e.target.value = "";
  };

  const canContinue = !!(aadhaarFile && panFile && selfieFile && addressFile);

  const uploadBox = (
    file: File | null,
    label: string,
    ref: React.RefObject<HTMLInputElement | null>,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    accept = "image/*,.pdf"
  ) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div
        onClick={() => ref.current?.click()}
        className="flex items-center justify-between gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-[#006525]/50 hover:bg-[#E8F5E9]/50 cursor-pointer transition-colors min-h-[48px]"
      >
        <span className="text-sm text-gray-600 truncate min-w-0">{file ? file.name : "Tap to upload"}</span>
        <span className="shrink-0">{file ? <CheckIcon /> : null}</span>
      </div>
      <input ref={ref} type="file" accept={accept} onChange={onChange} className="hidden" />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 sm:p-6 md:p-8 max-w-2xl mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-3 sm:mb-4">
          <IdIcon />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">KYC Verification</h2>
        <p className="text-xs sm:text-sm text-gray-500">Upload documents to verify your identity.</p>
      </div>

      <div className="flex flex-col gap-5">
        {uploadBox(aadhaarFile, "Aadhaar Card (front & back in one PDF or image)", aadhaarRef, (e) => handleFile(setAadhaarFile, e))}
        {uploadBox(panFile, "PAN Card", panRef, (e) => handleFile(setPanFile, e))}
        {uploadBox(selfieFile, "Selfie with Aadhaar", selfieRef, (e) => handleFile(setSelfieFile, e), "image/*")}
        {uploadBox(addressFile, "Address Proof (utility bill / rent agreement)", addressRef, (e) => handleFile(setAddressFile, e))}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={() => nextStep()}
          disabled={!canContinue}
          className={`w-full py-3.5 rounded-xl font-semibold min-h-[48px] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            canContinue ? "bg-[#006525] text-white hover:bg-[#004d1c] focus:ring-[#006525]" : "bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-300"
          }`}
        >
          Submit for Verification
        </button>
      </div>

      <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
        Need help? <a href="#" className="text-[#006525] font-medium hover:underline">Contact Support</a>
      </p>
    </div>
  );
}
