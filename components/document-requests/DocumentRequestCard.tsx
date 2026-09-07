'use client';

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import type { DocumentRequest, DocumentRequestDocument } from "@/lib/document-requests-api";
import PdfPasswordRequiredModal from "@/components/PdfPasswordRequiredModal";

const SUPPORTED_TYPES = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];
const ACCEPT_STRING = ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_FILES = 10;

function DocumentIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CloudUploadIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function formatFileSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

type StatusConfig = {
  label: string;
  className: string;
  icon?: React.ReactNode;
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending: {
    label: "Pending Upload",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  uploaded: {
    label: "Under Review",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  approved: {
    label: "Approved",
    className: "bg-green-100 text-green-800 border-green-200",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  closed: {
    label: "Closed",
    className: "bg-gray-100 text-gray-700 border-gray-200",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600 border-gray-200" },
  not_interested: { label: "Not Interested", className: "bg-gray-100 text-gray-600 border-gray-200" },
};

function getStatusConfig(status: string): StatusConfig {
  return STATUS_CONFIG[status] ?? { label: status, className: "bg-gray-100 text-gray-700 border-gray-200" };
}

type Props = {
  request: DocumentRequest;
  onUploadSuccess: () => void;
};

export default function DocumentRequestCard({ request, onUploadSuccess }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [lastUploadedDocuments, setLastUploadedDocuments] = useState<DocumentRequestDocument[]>([]);
  const [passwordModal, setPasswordModal] = useState<{
    open: boolean;
    fileName: string;
    fileIndex: number;
    errorMessage: string | null;
  }>({ open: false, fileName: "", fileIndex: 0, errorMessage: null });
  const inputRef = useRef<HTMLInputElement>(null);

  const showUploadArea = request.status === "pending" || request.status === "rejected";
  const statusConfig = getStatusConfig(request.status);

  const validateFiles = (files: File[]): string | null => {
    if (files.length === 0) return "At least one document is required";
    if (files.length > MAX_FILES) return `Maximum ${MAX_FILES} files allowed`;
    for (const f of files) {
      const ext = "." + f.name.split(".").pop()?.toLowerCase();
      if (!SUPPORTED_TYPES.includes(ext)) {
        return `Invalid file type: ${f.name}. Supported: PDF, JPG, PNG, DOC, DOCX`;
      }
      if (f.size > MAX_FILE_SIZE_BYTES) {
        return `File too large: ${f.name}. Max 10MB per file`;
      }
    }
    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files?.length) return;
    const arr = Array.from(files);
    const err = validateFiles(arr);
    if (err) {
      setFileError(err);
      setSelectedFiles([]);
      return;
    }
    setFileError(null);
    setSelectedFiles(arr);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const performUpload = async (passwords: string[] = []) => {
    const { uploadDocument } = await import("@/lib/document-requests-api");
    const formData = new FormData();
    selectedFiles.forEach((f) => formData.append("documents", f));
    if (passwords.length > 0) {
      formData.append("passwords", JSON.stringify(passwords));
    }
    const result = await uploadDocument(request._id, formData);
    return result;
  };

  const handleUploadClick = async () => {
    if (selectedFiles.length === 0) return;
    const err = validateFiles(selectedFiles);
    if (err) {
      setFileError(err);
      return;
    }
    setFileError(null);
    setIsUploading(true);
    setPasswordModal({ open: false, fileName: "", fileIndex: 0, errorMessage: null });
    try {
      const result = await performUpload();
      if (result.success) {
        setUploadSuccess(true);
        setSelectedFiles([]);
        setLastUploadedDocuments(result.data.documents);
        onUploadSuccess();
      } else if ("passwordRequired" in result.error && result.error.passwordRequired) {
        toast.error(`Password required for PDF: ${result.error.fileName}`);
        setPasswordModal({
          open: true,
          fileName: result.error.fileName,
          fileIndex: result.error.fileIndex,
          errorMessage: null,
        });
      } else if ("passwordInvalid" in result.error && result.error.passwordInvalid) {
        setPasswordModal((prev) => ({
          ...prev,
          errorMessage: "Incorrect password. Please try again.",
        }));
      } else {
        setFileError(result.error.message ?? "Upload failed");
      }
    } catch (err) {
      setFileError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    const passwords: string[] = new Array(selectedFiles.length).fill("");
    passwords[passwordModal.fileIndex] = password;
    setIsUploading(true);
    setPasswordModal((prev) => ({ ...prev, errorMessage: null }));
    try {
      const result = await performUpload(passwords);
      if (result.success) {
        setUploadSuccess(true);
        setSelectedFiles([]);
        setLastUploadedDocuments(result.data.documents);
        setPasswordModal({ open: false, fileName: "", fileIndex: 0, errorMessage: null });
        onUploadSuccess();
      } else if ("passwordInvalid" in result.error && result.error.passwordInvalid) {
        setPasswordModal((prev) => ({
          ...prev,
          errorMessage: "Incorrect password. Please try again.",
        }));
      } else {
        setPasswordModal((prev) => ({
          ...prev,
          errorMessage: result.error.message ?? "Upload failed",
        }));
      }
    } catch (err) {
      setPasswordModal((prev) => ({
        ...prev,
        errorMessage: err instanceof Error ? err.message : "Upload failed",
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasswordModalClose = () => {
    setPasswordModal({ open: false, fileName: "", fileIndex: 0, errorMessage: null });
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 sm:p-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-start gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <DocumentIcon className="text-gray-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900">{request.documentName}</h3>
              {request.description && (
                <p className="text-sm text-gray-600 mt-0.5">{request.description}</p>
              )}
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border shrink-0 ${statusConfig.className}`}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </span>
        </div>

        {request.status === "approved" && (
          <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
            <div className="flex items-center gap-2 text-green-800 font-medium">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Documents Approved
            </div>
            <p className="text-sm text-green-700 mt-1">Your documents have been approved successfully.</p>
          </div>
        )}

        {request.documents.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Already Uploaded ({request.documents.length}):</p>
            <ul className="mt-2 space-y-1">
              {request.documents.map((doc: DocumentRequestDocument) => (
                <li key={doc.fileName} className="flex items-center gap-2 text-sm">
                  <a
                    href="#"
                    className="text-primary hover:underline break-all"
                    onClick={(e) => e.preventDefault()}
                  >
                    {doc.originalName || doc.fileName}
                  </a>
                  {doc.password && <LockIcon className="text-amber-600 shrink-0" />}
                </li>
              ))}
            </ul>
          </div>
        )}

        {request.status === "rejected" && request.rejectionReason && request.rejectionReason !== "na" && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 text-red-800 font-medium">Documents Rejected</div>
            <p className="text-sm text-red-700 mt-1">Reason: {request.rejectionReason}</p>
            <p className="text-sm text-red-600 mt-1">Please resubmit the documents with the required corrections.</p>
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800 font-medium">
              <CloudUploadIcon className="w-5 h-5" />
              Documents Uploaded Successfully
            </div>
            <p className="text-sm text-blue-700 mt-1">Your documents are under review. We will update the status soon.</p>
            {(lastUploadedDocuments.length > 0 || request.documents.length > 0) && (
              <div className="mt-2">
                <p className="text-xs font-medium text-blue-700">Uploaded Files:</p>
                {(lastUploadedDocuments.length > 0 ? lastUploadedDocuments : request.documents).map((doc: DocumentRequestDocument) => (
                  <p key={doc.fileName} className="text-xs text-blue-600 flex items-center gap-1 mt-0.5">
                    {doc.originalName || doc.fileName}
                    {doc.password && <LockIcon className="text-amber-600 shrink-0" />}
                    {doc.uploadedAt && ` (Uploaded: ${formatDate(doc.uploadedAt)})`}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {showUploadArea && (
          <div className="mt-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => inputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 py-8 px-4 rounded-xl border-2 border-dashed transition-colors min-h-[140px] cursor-pointer ${
                isDragging || selectedFiles.length > 0
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
              }`}
            >
              <CloudUploadIcon className="text-gray-500" />
              <p className="text-sm text-gray-700 text-center">
                {selectedFiles.length > 0
                  ? "Add More Documents or drag and drop files here"
                  : "Click to select documents or drag and drop files here"}
              </p>
              <p className="text-xs text-gray-500">Supported formats: PDF, JPG, PNG, DOC, DOCX</p>
              <p className="text-xs text-gray-500">Max 10MB per file • You can select multiple files at once</p>
              {selectedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-600">Selected Files:</p>
                  {selectedFiles.map((f, i) => (
                    <p key={i} className="text-xs text-gray-500 flex items-center gap-1">
                      {f.name} ({formatFileSize(f.size)})
                      {f.type === "application/pdf" && (
                        <span className="text-amber-600" title="May require password">
                          <LockIcon />
                        </span>
                      )}
                    </p>
                  ))}
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT_STRING}
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              If any PDF files are password-protected, you will be prompted to enter the password during upload.
            </p>
            {fileError && <p className="text-sm text-red-600 mt-2">{fileError}</p>}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleUploadClick();
              }}
              disabled={selectedFiles.length === 0 || isUploading}
              className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium min-h-[48px] ${
                selectedFiles.length > 0 && !isUploading
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <CloudUploadIcon className="w-5 h-5" />
              {isUploading ? "Uploading…" : "Upload Documents"}
            </button>
          </div>
        )}
      </div>

      <PdfPasswordRequiredModal
        isOpen={passwordModal.open}
        fileName={passwordModal.fileName}
        onClose={handlePasswordModalClose}
        onSubmit={handlePasswordSubmit}
        isSubmitting={isUploading}
        errorMessage={passwordModal.errorMessage}
      />
    </>
  );
}
