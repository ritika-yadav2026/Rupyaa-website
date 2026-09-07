"use client";

import type { ReactNode, RefObject } from "react";

type Props = {
  id: string;
  label: ReactNode;
  value: string;
  placeholder?: string;
  onChange: (nextValue: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  error?: string;
  verifyEnabled: boolean;
  verified: boolean;
  verifySendError?: string | null;
  verifyLabel?: string;
  verifyDisabled?: boolean;
  onVerify: () => void;
};

export default function EmailFieldWithVerify({
  id,
  label,
  value,
  placeholder,
  onChange,
  inputRef,
  error,
  verifyEnabled,
  verified,
  verifySendError,
  verifyLabel,
  verifyDisabled = false,
  onVerify,
}: Props) {
  const inputBase =
    "w-full px-4 py-3 rounded-xl border text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[48px]";
  const inputError = "border-red-500";
  const inputNormal = "border-gray-200";
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
      </label>
      <div className="flex items-start gap-2">
        <input
          ref={inputRef}
          id={id}
          type="email"
          autoComplete="email"
          value={value}
          placeholder={placeholder}
          onChange={(ev) => onChange(ev.target.value)}
          className={`${inputBase} min-w-0 flex-1 ${error ? inputError : inputNormal}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
        {verifyEnabled && (
          <button
            type="button"
            onClick={onVerify}
            disabled={verifyDisabled}
            className="shrink-0 whitespace-nowrap px-4 py-3 rounded-xl border-2 border-primary text-primary font-semibold min-h-[48px] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {verified ? "Verified" : "Verify"}
          </button>
        )}
      </div>
      {verified && verifyEnabled && <p className="text-xs text-green-700 mt-1">{verifyLabel ?? "Email verified"}</p>}
      {verifySendError && (
        <p className="text-xs text-red-600 mt-1" role="alert">
          {verifySendError}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
