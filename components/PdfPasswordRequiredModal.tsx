'use client';

import { useState, useEffect } from "react";
import { validatePdfPassword } from "@/lib/validation";

type Props = {
  isOpen: boolean;
  fileName: string;
  onClose: () => void;
  onSubmit: (password: string) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/**
 * Modal shown when user uploads a password-protected PDF.
 * Prompts for password and allows retry on incorrect password.
 */
export default function PdfPasswordRequiredModal({
  isOpen,
  fileName,
  onClose,
  onSubmit,
  isSubmitting = false,
  errorMessage = null,
}: Props) {
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setLocalError(null);
    }
  }, [isOpen, fileName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validatePdfPassword(password);
    setLocalError(err);
    if (err) return;
    onSubmit(password.trim());
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-password-title"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 sm:p-8 shadow-xl mx-2 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <LockIcon className="text-amber-600" />
          </div>
        </div>
        <h2 id="pdf-password-title" className="mb-2 text-center text-xl font-bold text-gray-900">
          PDF Password Required
        </h2>
        <p className="mb-2 text-center text-sm text-gray-600">Enter password for:</p>
        <p className="mb-4 text-center text-sm font-medium text-gray-900 break-all">{fileName}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="pdf-password" className="sr-only">
              Enter PDF password
            </label>
            <input
              id="pdf-password"
              type="password"
              value={password}
              maxLength={256}
              onChange={(e) => {
                setPassword(e.target.value.slice(0, 256));
                setLocalError(null);
              }}
              placeholder="Enter PDF password"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 min-h-[48px] focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              autoFocus
              disabled={isSubmitting}
            />
          </div>
          {(localError || errorMessage) && (
            <p className="text-sm text-red-600 text-center" role="alert">
              {localError ?? errorMessage}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-medium text-gray-700 hover:bg-gray-50 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!password.trim() || isSubmitting}
              className={`flex-1 py-3 rounded-xl font-semibold min-h-[48px] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                password.trim() && !isSubmitting
                  ? "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-300"
              }`}
            >
              {isSubmitting ? "Submitting…" : "Submit Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
