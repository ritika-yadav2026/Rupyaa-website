"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
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
import NeedContactSupport from "./NeedContactSupport";
import ValidatedTextInput from "./ValidatedTextInput";

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

  const inputBase =
    "w-full px-4 py-3 rounded-xl border text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[48px]";
  const inputError = "border-red-500";
  const inputNormal = "border-gray-200";
  const readOnlyInput = "bg-gray-50 text-gray-700";

  const isSubmitting = submitMutation.isPending;
  const isLookingUp = ifscStatus === "loading";
  const ifscHelperMessage =
    !errors.ifscCode && ifscStatus !== "loading" ? IFSC_STATUS_MESSAGES[ifscStatus] : null;
  const ifscHelperIsError = IFSC_STATUS_ERROR_STATES.has(ifscStatus);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden max-w-2xl mx-auto w-full">

      <form className="pb-6 px-4 sm:px-6" onSubmit={handleSubmit} noValidate>
        <div className="flex items-center gap-2 rounded-t-xl bg-primary/10 px-4 py-3 border border-b-0 border-gray-200 -mx-4 sm:-mx-6 sm:rounded-t-2xl">
          <BankIcon />
          <h3 className="text-sm font-bold text-gray-900">Bank Details</h3>
        </div>

        <div className=" border-gray-200 rounded-b-xl -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 space-y-4">
          <div>
            <label htmlFor="accountNumber" className="text-sm font-medium text-gray-700 mb-1 block">
              Account Number *
            </label>
            <input
              id="accountNumber"
              ref={accountNumberRef}
              type="tel"
              inputMode="numeric"
              placeholder="Enter your bank account number"
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, MAX_BANK_ACCOUNT_DIGITS));
                setErrors((prev) => ({ ...prev, accountNumber: undefined, confirmAccountNumber: undefined }));
                setSubmitError(null);
              }}
              className={`${inputBase} ${errors.accountNumber ? inputError : inputNormal}`}
              aria-invalid={!!errors.accountNumber}
              aria-describedby={errors.accountNumber ? "accountNumber-error" : shouldShowSalaryHint ? "accountNumber-hint" : undefined}
              autoComplete="off"
            />
            {errors.accountNumber && (
              <p id="accountNumber-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.accountNumber}
              </p>
            )}
            {shouldShowSalaryHint && !errors.accountNumber && (
              <p id="accountNumber-hint" className="text-xs font-semibold text-gray-700 mt-1">
                {salaryHintText}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmAccountNumber" className="text-sm font-medium text-gray-700 mb-1 block">
              Re-enter Account Number *
            </label>
            <input
              id="confirmAccountNumber"
              type="tel"
              inputMode="numeric"
              placeholder="Re-enter your bank account number"
              value={confirmAccountNumber}
              onChange={(e) => {
                setConfirmAccountNumber(e.target.value.replace(/\D/g, "").slice(0, MAX_BANK_ACCOUNT_DIGITS));
                setErrors((prev) => ({ ...prev, confirmAccountNumber: undefined }));
                setSubmitError(null);
              }}
              onPaste={blockConfirmPaste}
              onDrop={blockConfirmPaste}
              onKeyDown={handleConfirmKeyDown}
              className={`${inputBase} ${errors.confirmAccountNumber ? inputError : inputNormal}`}
              aria-invalid={!!errors.confirmAccountNumber}
              aria-describedby={errors.confirmAccountNumber ? "confirmAccountNumber-error" : undefined}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {errors.confirmAccountNumber && (
              <p id="confirmAccountNumber-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.confirmAccountNumber}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="accountHolderName" className="text-sm font-medium text-gray-700 mb-1 block">
              Account Holder Name *
            </label>
            <ValidatedTextInput
              id="accountHolderName"
              placeholder="Name as per bank records"
              value={accountHolderName}
              policy="name"
              maxLength={100}
              onValueChange={(value) => {
                setAccountHolderName(value);
                setErrors((prev) => ({ ...prev, accountHolderName: undefined }));
                setSubmitError(null);
              }}
              className={`${inputBase} ${errors.accountHolderName ? inputError : inputNormal}`}
              aria-invalid={!!errors.accountHolderName}
              aria-describedby={errors.accountHolderName ? "accountHolderName-error" : undefined}
            />
            {errors.accountHolderName && (
              <p id="accountHolderName-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.accountHolderName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="accountType" className="text-sm font-medium text-gray-700 mb-1 block">
              Account Type *
            </label>
            <select
              id="accountType"
              value={accountType}
              onChange={(e) => {
                setAccountType(e.target.value as BankAccountType);
                setErrors((prev) => ({ ...prev, accountType: undefined }));
                setSubmitError(null);
              }}
              className={`${inputBase} bg-white ${errors.accountType ? inputError : inputNormal}`}
              aria-invalid={!!errors.accountType}
              aria-describedby={errors.accountType ? "accountType-error" : undefined}
            >
              {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.accountType && (
              <p id="accountType-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.accountType}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ifscCode" className="text-sm font-medium text-gray-700 mb-1 block">
              IFSC Code *
            </label>
            <div
              className={`flex rounded-xl border overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary ${
                errors.ifscCode ? inputError : inputNormal
              }`}
            >
              <input
                id="ifscCode"
                type="text"
                placeholder="e.g. HDFC0001234"
                value={ifscCode}
                maxLength={11}
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
                className="flex-1 px-4 py-3 min-h-[48px] focus:outline-none uppercase tracking-wider"
                aria-invalid={!!errors.ifscCode}
                aria-describedby={errors.ifscCode ? "ifscCode-error" : ifscHelperMessage ? "ifscCode-status" : undefined}
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
              />
              <div
                className="flex shrink-0 flex-col self-stretch border-l border-gray-200 bg-white min-w-23"
                aria-busy={isLookingUp}
              >
                {isLookingUp ? (
                  <span className="flex flex-1 min-h-[48px] items-center justify-center" aria-hidden="true">
                    <Spinner />
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={runIfscLookup}
                    disabled={!isValidIfscFormat(ifscCode)}
                    className="flex flex-1 min-h-[48px] items-center justify-center px-4 text-sm font-medium text-primary hover:text-primary/80 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    Search
                  </button>
                )}
              </div>
            </div>
            {errors.ifscCode && (
              <p id="ifscCode-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.ifscCode}
              </p>
            )}
            {!errors.ifscCode && ifscHelperMessage && (
              <p
                id="ifscCode-status"
                className={`text-sm mt-1 ${
                  ifscHelperIsError
                    ? "text-red-600"
                    : ifscStatus === "success"
                      ? "text-green-700"
                      : "text-gray-500"
                }`}
              >
                {ifscHelperMessage}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bankName" className="text-sm font-medium text-gray-700 mb-1 block">
                Bank Name *
              </label>
              <input
                id="bankName"
                type="text"
                placeholder="Auto-filled from IFSC"
                value={bankName}
                readOnly
                tabIndex={-1}
                className={`${inputBase} ${readOnlyInput} ${errors.bankName ? inputError : inputNormal} cursor-not-allowed`}
                aria-invalid={!!errors.bankName}
                aria-describedby={errors.bankName ? "bankName-error" : undefined}
              />
              {errors.bankName && (
                <p id="bankName-error" className="text-sm text-red-600 mt-1" role="alert">
                  {errors.bankName}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="branchName" className="text-sm font-medium text-gray-700 mb-1 block">
                Branch Name *
              </label>
              <input
                id="branchName"
                type="text"
                placeholder="Auto-filled from IFSC"
                value={branchName}
                readOnly
                tabIndex={-1}
                className={`${inputBase} ${readOnlyInput} ${errors.branchName ? inputError : inputNormal} cursor-not-allowed`}
                aria-invalid={!!errors.branchName}
                aria-describedby={errors.branchName ? "branchName-error" : undefined}
              />
              {errors.branchName && (
                <p id="branchName-error" className="text-sm text-red-600 mt-1" role="alert">
                  {errors.branchName}
                </p>
              )}
            </div>
          </div>

          {submitError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {submitError}
            </div>
          )}

          <p className="text-xs text-gray-500 text-center mt-2">
            This account will only be used to credit your loan
          </p>

          <button
            type="submit"
            disabled={isSubmitting || ifscStatus === "stale"}
            className="w-full mt-2 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Confirm and Continue"}
          </button>
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
