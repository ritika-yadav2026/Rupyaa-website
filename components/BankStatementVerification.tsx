"use client";

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import {
  uploadBankStatement,
  UPLOAD_BANK_STATEMENT_ERROR,
  type GetUserBankStatementStatusResponse,
} from "@/lib/bank-statement-api";
import { useBankStatementStatus } from "@/hooks/useBankStatementStatus";
import {
  hasBankStatementKeyData,
  normalizeBankStatementStatus,
  shouldContinueBankStatementPolling,
} from "@/lib/bank-connect";
import BasicInfoSidebar from "@/components/BasicInfoSidebar";
import BasicInfoFooter from "@/components/BasicInfoFooter";
import BankConnectFetchingContent from "@/components/home/BankConnectFetchingContent";
import {
  BANK_CONNECT_FETCHING_SUBTEXT,
  BANK_CONNECT_STATUS_MESSAGES,
} from "@/utils/app-constants";
import UnableToDetectSalaryModal from "./UnableToDetectSalaryModal";
import { renderStatementRangeLabels } from "@/utils/bankStatementPeriod";
import { CheckIcon, PdfIcon } from "./icons";

const MAX_FILE_SIZE_MB = 40;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;


type Props = {
  showContinueToOffers?: boolean;
  /** When salary not detected, user can click "Continue" in modal to go to Application Under Review */
  onContinueAnyway?: () => void;
  onUploaded?: (callApplyLoan: boolean) => void;
  onStatusReady?: (status: GetUserBankStatementStatusResponse) => void | Promise<void>;
};

export default function BankStatementVerification({
  showContinueToOffers,
  onContinueAnyway,
  onUploaded,
  onStatusReady,
}: Props) {
  const { clearStatus, refetchWithSource, pollBankStatementStatus } =
    useBankStatementStatus();
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showSalaryErrorModal, setShowSalaryErrorModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  /** True after upload while GET /status polling runs (`isUploading` ends in `finally` before this phase). */
  const [isAwaitingStatement, setIsAwaitingStatement] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const didNavigateAfterUploadRef = useRef(false);
  const stopPollRef = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      stopPollRef.current?.();
      stopPollRef.current = null;
    },
    []
  );

  const isValidFile = (f: File) => {
    if (f.type !== "application/pdf") {
      setFileError("Only PDF files are allowed.");
      return false;
    }
    if (f.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`File size must be under ${MAX_FILE_SIZE_MB}MB.`);
      return false;
    }
    setFileError(null);
    return true;
  };

  const handleFile = (f: File | null) => {
    if (!f) {
      setFile(null);
      setFileError(null);
      return;
    }
    if (isValidFile(f)) setFile(f);
  };

  const blockFileInteraction = isUploading || isAwaitingStatement;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (blockFileInteraction) return;
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    setIsAwaitingStatement(false);
    setFileError(null);
    try {
      didNavigateAfterUploadRef.current = false;
      clearStatus();
      const confidentialCode = password.trim() || undefined;
      await uploadBankStatement(file, confidentialCode);
      const statusRes = (await refetchWithSource("manual-upload-success")).response;
      onUploaded?.(statusRes.callApplyLoan);

      const logPoll = (payload: Record<string, unknown>) => {
        if (process.env.NODE_ENV === "development") {
          console.log("[BankStatementVerification]", "poll_status", payload);
        }
      };

      if (
        statusRes.callApplyLoan &&
        hasBankStatementKeyData(statusRes.bankStatementKey)
      ) {
        didNavigateAfterUploadRef.current = true;
        await onStatusReady?.(statusRes);
        return;
      }

      const normImmediate = normalizeBankStatementStatus(
        statusRes.bankStatementStatus ?? statusRes.status
      );
      const keyImmediate = statusRes.bankStatementKey;
      logPoll({
        phase: "after_upload",
        normImmediate,
        callApplyLoan: statusRes.callApplyLoan,
        hasKey: hasBankStatementKeyData(keyImmediate),
      });
      if (
        (normImmediate === "processed" || normImmediate === "approved") &&
        statusRes.callApplyLoan &&
        hasBankStatementKeyData(keyImmediate)
      ) {
        didNavigateAfterUploadRef.current = true;
        await onStatusReady?.(statusRes);
        return;
      }

      setIsAwaitingStatement(true);
      const stopPolling = pollBankStatementStatus(
        (status, callApplyLoan, key, normalized, fullResponse) => {
          logPoll({ status, callApplyLoan, normalized, hasKey: hasBankStatementKeyData(key) });
          if (didNavigateAfterUploadRef.current) return;

          const finishPoll = () => {
            stopPolling();
            if (stopPollRef.current === stopPolling) {
              stopPollRef.current = null;
            }
            setIsAwaitingStatement(false);
          };

          if (
            callApplyLoan &&
            hasBankStatementKeyData(key) &&
            fullResponse
          ) {
            finishPoll();
            didNavigateAfterUploadRef.current = true;
            void onStatusReady?.(fullResponse);
            return;
          }

          if (
            (normalized === "processed" || normalized === "approved") &&
            callApplyLoan &&
            hasBankStatementKeyData(key)
          ) {
            finishPoll();
            didNavigateAfterUploadRef.current = true;
            if (fullResponse) void onStatusReady?.(fullResponse);
            return;
          }

          if (status === "Error") {
            finishPoll();
            didNavigateAfterUploadRef.current = true;
            toast.error(
              "Statement processing is taking longer than usual. You can continue or try again."
            );
            onContinueAnyway?.();
            return;
          }

          // Pending and in-progress are transient; the polling helper schedules another 5s tick.
          if (normalized && shouldContinueBankStatementPolling(normalized)) return;

          if (normalized && normalized !== "approved" && normalized !== "processed") {
            finishPoll();
            didNavigateAfterUploadRef.current = true;
            onContinueAnyway?.();
          }
        },
        { scenario: "manual-upload", useStopRules: true }
      );
      stopPollRef.current = stopPolling;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      if (message === UPLOAD_BANK_STATEMENT_ERROR.PASSWORD_REQUIRED) {
        setFileError("This PDF is password-protected. Please enter the password above.");
      } else if (message === UPLOAD_BANK_STATEMENT_ERROR.PASSWORD_INVALID) {
        setFileError("Invalid password. Please try again.");
      } else {
        toast.error(message);
        setFileError(message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadAgain = () => {
    setFile(null);
    setShowSalaryErrorModal(false);
    inputRef.current?.click();
  };

  const canContinue = !!file;
  const inputBase = "w-full px-4 py-3 rounded-xl border-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[48px]";
  const inputNormal = "border-gray-200";

  return (
    <div className="w-full max-w-full sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] min-w-0 mx-auto bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
      <BankConnectFetchingContent
        visible={isUploading || isAwaitingStatement}
        needOverlay={true}
        message={
          isUploading
            ? "Uploading your statement…"
            : BANK_CONNECT_STATUS_MESSAGES.fetchingBankDetails
        }
        subtext={
          isUploading
            ? "Please wait while we upload your file securely."
            : BANK_CONNECT_FETCHING_SUBTEXT
        }
      />
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-6 sm:p-8 lg:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Upload <span className="text-primary">Salary-Account</span> bank statement
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {renderStatementRangeLabels()}
          </p>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
            aria-busy={blockFileInteraction}
          >
            <div className="flex flex-col gap-1.5">
              <div
                role="region"
                aria-label="PDF statement upload"
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (blockFileInteraction) return;
                  setIsDragging(true);
                }}
                onDragLeave={() => {
                  if (!blockFileInteraction) setIsDragging(false);
                }}
                onClick={() => {
                  if (blockFileInteraction || file) return;
                  inputRef.current?.click();
                }}
                className={`flex flex-col items-center justify-center gap-2 py-8 px-4 rounded-xl border-2 border-dashed transition-colors min-h-[140px] ${
                  blockFileInteraction
                    ? "pointer-events-none cursor-not-allowed border-gray-200 bg-gray-100 opacity-60"
                    : file
                      ? "border-primary bg-primary/5 cursor-default"
                      : isDragging
                        ? "border-primary bg-primary/5 cursor-pointer"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 cursor-pointer"
                }`}
              >
                {file ? (
                  <>
                    <PdfIcon className="text-primary" width={16} height={16} />
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <div className="flex items-center gap-1.5 text-primary">
                      <CheckIcon width={16} height={16} />
                      <span className="text-sm font-medium">File uploaded successfully</span>
                    </div>
                    <button
                      type="button"
                      disabled={blockFileInteraction}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (blockFileInteraction) return;
                        inputRef.current?.click();
                      }}
                      className="mt-2 px-4 py-2.5 rounded-xl border-2 border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Upload another file
                    </button>
                  </>
                ) : (
                  <>
                    <PdfIcon width={16} height={16} />
                    <p className="text-2xl font-medium text-gray-700">Select PDF Statement</p>
                    <p className="text-base text-gray-500">File should be in .pdf format</p>
                  </>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  disabled={blockFileInteraction}
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </div>
              {fileError && (
                <p className="text-sm text-red-600" role="alert">
                  {fileError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-primary font-semibold">Required:</p>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 text-sm text-gray-700 leading-snug">
                  <CheckIcon width={16} height={16} />
                  <span className="min-w-0 pt-px">Latest statement till yesterday</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-700 leading-snug">
                  <CheckIcon width={16} height={16} />
                  <span className="min-w-0 pt-px">At least includes last 90 days</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-700 leading-snug">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-red-500 text-xs font-semibold leading-none"
                    aria-hidden
                  >
                    ✕
                  </span>
                  <span className="min-w-0 pt-px">UPI/Mini/Credit-Card statement</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-700 leading-snug">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-red-500 text-xs font-semibold leading-none"
                    aria-hidden
                  >
                    ✕
                  </span>
                  <span className="min-w-0 pt-px">Any other document than statement</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-900">
                PDF Password (if applicable)
              </label>
              <input
                id="password"
                type="text"
                value={password}
                disabled={blockFileInteraction}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g. 123456"
                className={`${inputBase} ${inputNormal} disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed`}
              />
              <p className="text-xs text-gray-500">
                If your PDF is password-protected, enter it above.
              </p>
            </div>

            <button
              type="submit"
              disabled={!canContinue || isUploading || isAwaitingStatement}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : isAwaitingStatement ? "Processing statement…" : showContinueToOffers ? "Upload Statement" : "Continue"}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6">
            Need help? <a href="/support" className="text-primary font-medium hover:underline">Contact Support</a>
          </p>
        </div>

        <div className="lg:w-[320px] xl:w-[380px] shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100">
          <BasicInfoSidebar />
        </div>
      </div>

      <BasicInfoFooter />

      <UnableToDetectSalaryModal
        isOpen={showSalaryErrorModal}
        onClose={() => setShowSalaryErrorModal(false)}
        onUploadAgain={handleUploadAgain}
        onContinue={onContinueAnyway}
      />
    </div>
  );
}
