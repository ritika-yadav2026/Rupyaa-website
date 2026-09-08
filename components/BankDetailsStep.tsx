"use client";

import { useRef, useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  sanitizeTextInput,
  validateBankAccountNumber,
  validateBankAccountConfirmation,
  validateIfsc,
  validateRequired,
  validateAccountHolderName,
  validateBankFieldName,
} from "@/lib/validation";
import {
  isValidIfscFormat,
  lookupIfsc,
  type IfscLookupStatus,
} from "@/lib/ifsc-lookup-service";
import {
  postBankDetails,
  type BankAccountType,
  type PostBankDetailsPayload,
} from "@/lib/user-api";
import { useSalaryAccounts } from "@/hooks/useSalaryAccounts";
import { isEnteredAccountSalaryMatch } from "@/utils/salaryAccountValidation";
import NonSalaryAccountModal from "@/components/non-salary-account/NonSalaryAccountModal";
import AppButton from "@/components/app-button";
import AppSelectField from "@/components/app-select-field";
import AppTextField from "@/components/app-text-field";
import NeedContactSupport from "./NeedContactSupport";

type Props = { onContinue?: () => void };

type FieldErrors = {
  accountNumber?: string;
  confirmAccountNumber?: string;
  accountHolderName?: string;
  accountType?: string;
  ifscCode?: string;
  bankName?: string;
  branchName?: string;
};

const ACCOUNT_TYPE_OPTIONS: ReadonlyArray<{ value: BankAccountType; label: string }> = [
  { value: "savings", label: "Saving" },
  { value: "current", label: "Current" },
];

const MAX_BANK_ACCOUNT_DIGITS = 18;
const ACCOUNT_HOLDER_MAX_LENGTH = 100;

const IFSC_STATUS_MESSAGES: Record<IfscLookupStatus, string> = {
  idle: "Enter the IFSC as mentioned in your passbook or cheque",
  loading: "Searching…",
  success: "Bank details fetched",
  invalid: "Invalid IFSC — check and re-enter",
  unavailable: "Couldn't fetch details — please try again",
  stale: "IFSC changed — search again",
};

const IFSC_STATUS_ERROR_STATES: ReadonlySet<IfscLookupStatus> = new Set([
  "invalid",
  "unavailable",
  "stale",
]);

function BankIcon({ className = "text-primary" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M3 21h18" />
      <path d="M5 21V10l7-5 7 5v11" />
      <path d="M9 21v-7h6v7" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin text-gray-500"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" />
    </svg>
  );
}

export default function BankDetailsStep({ onContinue }: Props) {
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountType, setAccountType] = useState<BankAccountType>("savings");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [ifscStatus, setIfscStatus] = useState<IfscLookupStatus>("idle");
  const [showNonSalaryWarning, setShowNonSalaryWarning] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const accountNumberRef = useRef<HTMLInputElement>(null);
  const lastResolvedIfsc = useRef<string | null>(null);
  const pendingSubmitRef = useRef<PostBankDetailsPayload | null>(null);

  const { data: salaryAccountsData } = useSalaryAccounts();
  const salaryAccounts = salaryAccountsData?.salaryAccounts ?? [];
  const salaryHintText = salaryAccountsData?.hintText;
  const hasSalaryAccountRules = salaryAccounts.length > 0;
  const shouldShowSalaryHint = hasSalaryAccountRules && Boolean(salaryHintText);

  const clearResolvedBankFields = () => {
    setBankName("");
    setBranchName("");
    lastResolvedIfsc.current = null;
  };

  const runIfscLookup = async () => {
    const normalized = ifscCode.trim().toUpperCase();
    if (!isValidIfscFormat(normalized)) {
      setIfscStatus("invalid");
      clearResolvedBankFields();
      return;
    }
    if (normalized === lastResolvedIfsc.current) return;
    setIfscStatus("loading");
    const outcome = await lookupIfsc(normalized);
    if (outcome.status === "success") {
      setIfscStatus("success");
      setBankName(outcome.data.bankName);
      setBranchName(outcome.data.branchName);
      lastResolvedIfsc.current = normalized;
      setErrors((prev) => ({
        ...prev,
        ifscCode: undefined,
        bankName: undefined,
        branchName: undefined,
      }));
    } else {
      setIfscStatus(outcome.status);
      clearResolvedBankFields();
    }
  };

  const submitMutation = useMutation({
    mutationFn: postBankDetails,
    onSuccess: () => {
      toast.success("Bank details saved");
      setSubmitError(null);
      pendingSubmitRef.current = null;
      onContinue?.();
    },
    onError: (err: Error) => {
      setSubmitError(err.message ?? "Failed to save bank details");
      // If the failed submit came from the non-salary modal, dismiss it so
      // the user can see the inline error banner under the form.
      setShowNonSalaryWarning(false);
      pendingSubmitRef.current = null;
    },
  });

  const buildPayload = (): PostBankDetailsPayload => ({
    accountNumber: accountNumber.replace(/\D/g, "").slice(0, MAX_BANK_ACCOUNT_DIGITS),
    confirmAccountNumber: confirmAccountNumber.replace(/\D/g, "").slice(0, MAX_BANK_ACCOUNT_DIGITS),
    accountHolderName: accountHolderName.trim(),
    accountType,
    ifscCode: ifscCode.trim().toUpperCase(),
    bankName: bankName.trim(),
    branchName: branchName.trim(),
  });

  const proceedWithSubmit = (payload: PostBankDetailsPayload) => {
    setSubmitError(null);
    submitMutation.mutate(payload);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ifscStatus === "stale") return;

    const accountNumberErr = validateBankAccountNumber(accountNumber);
    const confirmErr = validateBankAccountConfirmation(accountNumber, confirmAccountNumber);
    const holderErr = validateAccountHolderName(accountHolderName);
    const accountTypeErr = validateRequired(accountType, "Account type");
    const ifscFormatErr = validateIfsc(ifscCode);
    // Bank / branch are read-only and only populated by a successful IFSC lookup,
    // so surface one actionable message on the IFSC field when the lookup hasn't succeeded
    // instead of "is required" errors on inputs the user can't edit.
    const ifscErr =
      ifscFormatErr ??
      (ifscStatus !== "success"
        ? "Search a valid IFSC to fetch bank details"
        : null);
    const bankErr =
      ifscStatus === "success" ? validateBankFieldName(bankName, "Bank name") : null;
    const branchErr =
      ifscStatus === "success" ? validateBankFieldName(branchName, "Branch name") : null;

    const newErrors: FieldErrors = {};
    if (accountNumberErr) newErrors.accountNumber = accountNumberErr;
    if (confirmErr) newErrors.confirmAccountNumber = confirmErr;
    if (holderErr) newErrors.accountHolderName = holderErr;
    if (accountTypeErr) newErrors.accountType = accountTypeErr;
    if (ifscErr) newErrors.ifscCode = ifscErr;
    if (bankErr) newErrors.bankName = bankErr;
    if (branchErr) newErrors.branchName = branchErr;
    setErrors(newErrors);
    if (
      accountNumberErr ||
      confirmErr ||
      holderErr ||
      accountTypeErr ||
      ifscErr ||
      bankErr ||
      branchErr
    ) {
      return;
    }

    const payload = buildPayload();

    if (hasSalaryAccountRules) {
      const isSalaryMatch = isEnteredAccountSalaryMatch(payload.accountNumber, salaryAccounts);
      if (!isSalaryMatch) {
        setSubmitError(null);
        pendingSubmitRef.current = payload;
        setShowNonSalaryWarning(true);
        return;
      }
    }

    proceedWithSubmit(payload);
  };

  const handleModalChangeAccount = () => {
    setShowNonSalaryWarning(false);
    pendingSubmitRef.current = null;
    accountNumberRef.current?.focus();
  };

  const handleModalContinue = () => {
    const pending = pendingSubmitRef.current;
    if (!pending) {
      setShowNonSalaryWarning(false);
      return;
    }
    proceedWithSubmit(pending);
  };

  const blockConfirmPaste = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  const handleConfirmKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isPasteShortcut =
      (e.metaKey || e.ctrlKey) && (e.key === "v" || e.key === "V");
    if (isPasteShortcut) {
      e.preventDefault();
    }
  };

  const isSubmitting = submitMutation.isPending;
  const isLookingUp = ifscStatus === "loading";
  const ifscHelperMessage =
    !errors.ifscCode && ifscStatus !== "loading" ? IFSC_STATUS_MESSAGES[ifscStatus] : null;
  const ifscHelperIsError = IFSC_STATUS_ERROR_STATES.has(ifscStatus);

  let submitLabel: string;
  if (isSubmitting) {
    submitLabel = "Saving...";
  } else {
    submitLabel = "Confirm and Continue";
  }

  let salaryHintContent: ReactNode = null;
  if (shouldShowSalaryHint && !errors.accountNumber) {
    salaryHintContent = (
      <p id="accountNumber-hint" className="text-xs font-semibold text-gray-700">
        {salaryHintText}
      </p>
    );
  }

  let ifscHelperContent: ReactNode = null;
  if (!errors.ifscCode && ifscHelperMessage) {
    let ifscHelperClassName = "text-gray-500";
    if (ifscHelperIsError) {
      ifscHelperClassName = "text-red-600";
    } else if (ifscStatus === "success") {
      ifscHelperClassName = "text-button";
    }
    ifscHelperContent = (
      <p id="ifscCode-status" className={`text-sm ${ifscHelperClassName}`}>
        {ifscHelperMessage}
      </p>
    );
  }

  let ifscActionContent: ReactNode;
  if (isLookingUp) {
    ifscActionContent = (
      <span className="mt-7 flex min-h-[52px] min-w-23 items-center justify-center" aria-hidden="true">
        <Spinner />
      </span>
    );
  } else {
    ifscActionContent = (
      <AppButton
        type="button"
        variant="secondary"
        onClick={runIfscLookup}
        disabled={!isValidIfscFormat(ifscCode)}
        className="mt-7 shrink-0 px-4"
        aria-busy={isLookingUp}
      >
        Search
      </AppButton>
    );
  }

  let submitErrorContent: ReactNode = null;
  if (submitError) {
    submitErrorContent = (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {submitError}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#FFF4D9] overflow-hidden max-w-2xl mx-auto w-full">
      <form className="pb-6 px-4 sm:px-6" onSubmit={handleSubmit} noValidate>
        <div className="flex items-center gap-2 rounded-t-xl bg-[#FFE398] px-4 py-3 border border-b-0 border-[#FFF4D9] -mx-4 sm:-mx-6 sm:rounded-t-2xl">
          <BankIcon />
          <h3 className="text-sm font-bold text-gray-900">Bank Details</h3>
        </div>

        <div className="border-gray-200 rounded-b-xl -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 space-y-4">
          <div className="flex flex-col gap-2">
            <AppTextField
              id="accountNumber"
              ref={accountNumberRef}
              label="Account Number *"
              type="tel"
              inputMode="numeric"
              placeholder="Enter your bank account number"
              value={accountNumber}
              error={errors.accountNumber}
              autoComplete="off"
              onChange={(e) => {
                setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, MAX_BANK_ACCOUNT_DIGITS));
                setErrors((prev) => ({ ...prev, accountNumber: undefined, confirmAccountNumber: undefined }));
                setSubmitError(null);
              }}
            />
            {salaryHintContent}
          </div>

          <AppTextField
            id="confirmAccountNumber"
            label="Re-enter Account Number *"
            type="tel"
            inputMode="numeric"
            placeholder="Re-enter your bank account number"
            value={confirmAccountNumber}
            error={errors.confirmAccountNumber}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            onPaste={blockConfirmPaste}
            onDrop={blockConfirmPaste}
            onKeyDown={handleConfirmKeyDown}
            onChange={(e) => {
              setConfirmAccountNumber(e.target.value.replace(/\D/g, "").slice(0, MAX_BANK_ACCOUNT_DIGITS));
              setErrors((prev) => ({ ...prev, confirmAccountNumber: undefined }));
              setSubmitError(null);
            }}
          />

          <AppTextField
            id="accountHolderName"
            label="Account Holder Name *"
            placeholder="Name as per bank records"
            value={accountHolderName}
            maxLength={ACCOUNT_HOLDER_MAX_LENGTH}
            error={errors.accountHolderName}
            onChange={(e) => {
              const value = sanitizeTextInput(e.target.value, "name").slice(0, ACCOUNT_HOLDER_MAX_LENGTH);
              setAccountHolderName(value);
              setErrors((prev) => ({ ...prev, accountHolderName: undefined }));
              setSubmitError(null);
            }}
          />

          <AppSelectField
            id="accountType"
            label="Account Type *"
            value={accountType}
            onChange={(e) => {
              setAccountType(e.target.value as BankAccountType);
              setErrors((prev) => ({ ...prev, accountType: undefined }));
              setSubmitError(null);
            }}
            options={ACCOUNT_TYPE_OPTIONS}
            error={errors.accountType}
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <AppTextField
                id="ifscCode"
                label="IFSC Code *"
                type="text"
                placeholder="e.g. HDFC0001234"
                value={ifscCode}
                maxLength={11}
                error={errors.ifscCode}
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                inputClassName="uppercase tracking-wider"
                className="min-w-0 flex-1"
                onChange={(e) => {
                  const next = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);
                  setIfscCode(next);
                  setErrors((prev) => ({ ...prev, ifscCode: undefined, bankName: undefined, branchName: undefined }));
                  setSubmitError(null);
                  if (lastResolvedIfsc.current && next !== lastResolvedIfsc.current) {
                    setIfscStatus("stale");
                    clearResolvedBankFields();
                  }
                }}
                onBlur={() => {
                  const normalized = ifscCode.trim().toUpperCase();
                  if (!normalized) return;
                  if (isValidIfscFormat(normalized) && ifscStatus !== "loading") {
                    void runIfscLookup();
                  }
                }}
              />
              {ifscActionContent}
            </div>
            {ifscHelperContent}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppTextField
              id="bankName"
              label="Bank Name *"
              type="text"
              placeholder="Auto-filled from IFSC"
              value={bankName}
              readOnly
              tabIndex={-1}
              error={errors.bankName}
              inputClassName="cursor-not-allowed bg-gray-50 text-gray-700"
            />
            <AppTextField
              id="branchName"
              label="Branch Name *"
              type="text"
              placeholder="Auto-filled from IFSC"
              value={branchName}
              readOnly
              tabIndex={-1}
              error={errors.branchName}
              inputClassName="cursor-not-allowed bg-gray-50 text-gray-700"
            />
          </div>

          {submitErrorContent}

          <p className="text-xs text-gray-500 text-center mt-2">
            This account will only be used to credit your loan
          </p>

          <AppButton
            type="submit"
            fullWidth
            disabled={isSubmitting || ifscStatus === "stale"}
            className="mt-2"
          >
            {submitLabel}
          </AppButton>
        </div>
      </form>

      <NeedContactSupport />

      <NonSalaryAccountModal
        isOpen={showNonSalaryWarning}
        salaryAccounts={salaryAccounts}
        isSubmitting={isSubmitting}
        onChangeAccount={handleModalChangeAccount}
        onContinue={handleModalContinue}
      />
    </div>
  );
}
