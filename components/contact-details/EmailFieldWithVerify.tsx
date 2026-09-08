"use client";

import type { ReactNode, RefObject } from "react";
import AppButton from "@/components/app-button";
import AppTextField from "@/components/app-text-field";

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
  let verifyButton: ReactNode = null;
  if (verifyEnabled) {
    let verifyButtonLabel: string;
    if (verified) {
      verifyButtonLabel = "Verified";
    } else {
      verifyButtonLabel = "Verify";
    }
    verifyButton = (
      <AppButton
        type="button"
        variant="secondary"
        onClick={onVerify}
        disabled={verifyDisabled}
        className="mt-7 shrink-0 whitespace-nowrap px-4"
      >
        {verifyButtonLabel}
      </AppButton>
    );
  }

  let verifiedMessage: ReactNode = null;
  if (verified && verifyEnabled) {
    verifiedMessage = (
      <p className="text-xs text-green-700">{verifyLabel ?? "Email verified"}</p>
    );
  }

  let sendErrorMessage: ReactNode = null;
  if (verifySendError) {
    sendErrorMessage = (
      <p className="text-xs text-red-600" role="alert">
        {verifySendError}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2">
        <AppTextField
          ref={inputRef}
          id={id}
          label={label}
          type="email"
          autoComplete="email"
          value={value}
          placeholder={placeholder}
          error={error}
          className="min-w-0 flex-1"
          onChange={(ev) => onChange(ev.target.value)}
        />
        {verifyButton}
      </div>
      {verifiedMessage}
      {sendErrorMessage}
    </div>
  );
}
