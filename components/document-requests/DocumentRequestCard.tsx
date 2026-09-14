'use client';

import { useState, useRef, type ReactElement, type ReactNode } from "react";
import toast from "react-hot-toast";
import type { DocumentRequest, DocumentRequestDocument } from "@/lib/document-requests-api";
import PdfPasswordRequiredModal from "@/components/PdfPasswordRequiredModal";
import AppButton from "@/components/app-button";

const SUPPORTED_TYPES = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];
const ACCEPT_STRING = ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_FILES = 10;

function DocumentIcon({ className = "" }: { className?: string }): ReactElement {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function LockIcon({ className = "" }: { className?: string }): ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CloudUploadIcon({ className = "" }: { className?: string }): ReactElement {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
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
  icon?: ReactNode;
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending: {
    label: "Pending",
    className: "bg-[#FFF8E6] text-amber-800 border-[#FECA42]/50",
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
    label: "Action Required",
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

  let dropZoneClassName =
    "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white px-4 py-8 min-h-[140px] cursor-pointer transition-colors hover:border-gray-400";
  if (isDragging || selectedFiles.length > 0) {
    dropZoneClassName =
      "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#FECA42] bg-[#FFFCF4] px-4 py-8 min-h-[140px] cursor-pointer transition-colors";
  }

  let dropZoneLabel = "Click to select documents or drag and drop files here";
  if (selectedFiles.length > 0) {
    dropZoneLabel = "Add More Documents or drag and drop files here";
  }

  let uploadButtonLabel = "Upload Documents";
  if (isUploading) {
    uploadButtonLabel = "Uploading…";
  }

  let descriptionBlock: ReactNode = null;
  if (request.description) {
    descriptionBlock = <p className="mt-0.5 text-sm text-gray-500">{request.description}</p>;
  }

  let approvedBlock: ReactNode = null;
  if (request.status === "approved") {
    approvedBlock = (
      <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
        <p className="font-medium text-green-800">Documents Approved</p>
        <p className="mt-1 text-sm text-green-700">Your documents have been approved successfully.</p>
      </div>
    );
  }

  let alreadyUploadedBlock: ReactNode = null;
  if (request.documents.length > 0) {
    alreadyUploadedBlock = (
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700">
          Already Uploaded ({request.documents.length}):
        </p>
        <ul className="mt-2 space-y-1">
          {request.documents.map((doc: DocumentRequestDocument) => {
            let lockIcon: ReactNode = null;
            if (doc.password) {
              lockIcon = <LockIcon className="shrink-0 text-amber-600" />;
            }
            return (
              <li key={doc.fileName} className="flex items-center gap-2 text-sm">
                <span className="break-all text-gray-700">{doc.originalName || doc.fileName}</span>
                {lockIcon}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  let rejectedBlock: ReactNode = null;
  if (
    request.status === "rejected" &&
    request.rejectionReason &&
    request.rejectionReason !== "na"
  ) {
    rejectedBlock = (
      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="font-medium text-red-800">Documents Rejected</p>
        <p className="mt-1 text-sm text-red-700">Reason: {request.rejectionReason}</p>
        <p className="mt-1 text-sm text-red-600">
          Please resubmit the documents with the required corrections.
        </p>
      </div>
    );
  }

  let uploadSuccessBlock: ReactNode = null;
  if (uploadSuccess) {
    const docsToShow =
      lastUploadedDocuments.length > 0 ? lastUploadedDocuments : request.documents;
    let uploadedFilesBlock: ReactNode = null;
    if (docsToShow.length > 0) {
      uploadedFilesBlock = (
        <div className="mt-2">
          <p className="text-xs font-medium text-blue-700">Uploaded Files:</p>
          {docsToShow.map((doc: DocumentRequestDocument) => {
            let lockIcon: ReactNode = null;
            if (doc.password) {
              lockIcon = <LockIcon className="shrink-0 text-amber-600" />;
            }
            let uploadedAtText: string | null = null;
            if (doc.uploadedAt) {
              uploadedAtText = ` (Uploaded: ${formatDate(doc.uploadedAt)})`;
            }
            return (
              <p
                key={doc.fileName}
                className="mt-0.5 flex items-center gap-1 text-xs text-blue-600"
              >
                {doc.originalName || doc.fileName}
                {lockIcon}
                {uploadedAtText}
              </p>
            );
          })}
        </div>
      );
    }
    uploadSuccessBlock = (
      <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="font-medium text-blue-800">Documents Uploaded Successfully</p>
        <p className="mt-1 text-sm text-blue-700">
          Your documents are under review. We will update the status soon.
        </p>
        {uploadedFilesBlock}
      </div>
    );
  }

  let selectedFilesBlock: ReactNode = null;
  if (selectedFiles.length > 0) {
    selectedFilesBlock = (
      <div className="mt-2">
        <p className="text-xs font-medium text-gray-600">Selected Files:</p>
        {selectedFiles.map((file, index) => {
          let pdfHint: ReactNode = null;
          if (file.type === "application/pdf") {
            pdfHint = (
              <span className="text-amber-600" title="May require password">
                <LockIcon />
              </span>
            );
          }
          return (
            <p key={`${file.name}-${index}`} className="flex items-center gap-1 text-xs text-gray-500">
              {file.name} ({formatFileSize(file.size)})
              {pdfHint}
            </p>
          );
        })}
      </div>
    );
  }

  let fileErrorBlock: ReactNode = null;
  if (fileError) {
    fileErrorBlock = <p className="mt-2 text-sm text-red-600">{fileError}</p>;
  }

  let uploadAreaBlock: ReactNode = null;
  if (showUploadArea) {
    uploadAreaBlock = (
      <div className="mt-4">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={dropZoneClassName}
        >
          <p className="text-center text-sm text-gray-700">{dropZoneLabel}</p>
          <p className="text-xs text-gray-500">Supported formats: PDF, JPG, PNG. Max: 10MB per file</p>
          {selectedFilesBlock}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_STRING}
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>
        {fileErrorBlock}
        <AppButton
          type="button"
          fullWidth
          className="mt-4 gap-2"
          disabled={selectedFiles.length === 0 || isUploading}
          onClick={(e) => {
            e.stopPropagation();
            void handleUploadClick();
          }}
        >
          <CloudUploadIcon />
          {uploadButtonLabel}
        </AppButton>
      </div>
    );
  }

  return (
    <>
      <div className="w-full rounded-2xl border border-dashed border-[#E8D9A8] bg-[#FFFCF4] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E6] text-gray-700">
              <DocumentIcon />
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900">{request.documentName}</h3>
              {descriptionBlock}
            </div>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold ${statusConfig.className}`}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </span>
        </div>
        {approvedBlock}
        {alreadyUploadedBlock}
        {rejectedBlock}
        {uploadSuccessBlock}
        {uploadAreaBlock}
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
