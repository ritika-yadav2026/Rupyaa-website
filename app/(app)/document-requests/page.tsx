"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getDocumentRequests } from "@/lib/document-requests-api";
import DocumentRequestCard from "@/components/document-requests/DocumentRequestCard";
import Footer from "@/components/home/Footer";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import type { DocumentRequest } from "@/lib/document-requests-api";
import { REACT_QUERY_KEYS } from "@/utils/app-constants";

function formatRequestDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getDocumentIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("bank") || lower.includes("statement")) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 shrink-0">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  }
  if (lower.includes("aadhaar") || lower.includes("aadhar")) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 shrink-0">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M8 12h8" />
        <path d="M8 16h4" />
      </svg>
    );
  }
  if (lower.includes("pan")) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 shrink-0">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <circle cx="12" cy="10" r="6" />
        <path d="M12 14v4" />
      </svg>
    );
  }
  if (lower.includes("address")) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 shrink-0">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 shrink-0">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function getTableStatus(request: DocumentRequest): { label: string; className: string } {
  if (request.status === "rejected") {
    return { label: "Action Required", className: "bg-red-100 text-red-700" };
  }
  if (request.status === "pending") {
    return { label: "Pending", className: "bg-amber-100 text-amber-800" };
  }
  if (request.status === "uploaded" || request.status === "approved") {
    return { label: "Uploaded", className: "bg-green-100 text-green-700" };
  }
  return { label: request.status, className: "bg-gray-100 text-gray-700" };
}

function FolderSearchIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary/40">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      <circle cx="11" cy="11" r="8" strokeDasharray="2 2" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type DocumentRequestRowProps = {
  request: DocumentRequest;
  onUploadSuccess: () => void;
};

function DocumentRequestRow({ request, onUploadSuccess }: DocumentRequestRowProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const status = getTableStatus(request);
  const needsUpload = request.status === "pending" || request.status === "rejected";

  return (
    <>
      <tr className="border-b border-gray-200 last:border-b-0">
        <td className="py-4 px-4">
          <div className="flex items-center gap-3">
            {getDocumentIcon(request.documentName)}
            <span className="font-medium text-gray-900">{request.documentName}</span>
          </div>
        </td>
        <td className="py-4 px-4 text-sm text-gray-600">{formatRequestDate(request.date || request.createdAt)}</td>
        <td className="py-4 px-4">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}>
            {status.label}
          </span>
        </td>
        <td className="py-4 px-4">
          {needsUpload ? (
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <UploadIcon />
              Upload
            </button>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-600 text-sm font-medium">
              <CheckIcon />
              Uploaded
            </span>
          )}
        </td>
      </tr>
      {showUploadModal && (
        <tr>
          <td colSpan={4} className="p-0">
            <div className="bg-gray-50 border-t border-b border-gray-200 px-4 py-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-900">Upload: {request.documentName}</h4>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Close
                </button>
              </div>
              <DocumentRequestCard
                request={request}
                onUploadSuccess={() => {
                  onUploadSuccess();
                  setShowUploadModal(false);
                }}
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function DocumentRequestsPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: [REACT_QUERY_KEYS.DOCUMENT_REQUESTS],
    queryFn: async () => {
      const res = await getDocumentRequests();
      return res.data;
    },
  });

  const handleRefresh = () => {
    refetch();
    toast.success("List refreshed");
  };

  const handleUploadSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-full">
        <main className={`flex flex-col items-center py-8 flex-1 ${appShellContainerClassName}`}>
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Document Requests</h1>
            <p className="text-primary text-sm sm:text-base mt-1">Upload requested documents for your loan application.</p>
          </div>
          <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <div className="animate-pulse w-12 h-12 rounded-full bg-gray-200" />
            <p className="text-sm text-gray-500">Loading document requests…</p>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col min-h-full">
        <main className={`flex flex-col items-center py-8 flex-1 ${appShellContainerClassName}`}>
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Document Requests</h1>
            <p className="text-primary text-sm sm:text-base mt-1">Upload requested documents for your loan application.</p>
          </div>
          <div className="w-full bg-[#E8F5E9] rounded-2xl border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[200px] text-center">
            <p className="text-sm text-red-600 mb-4">{error instanceof Error ? error.message : "Failed to load document requests"}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  const requests = data ?? [];

  if (requests.length === 0) {
    return (
      <div className="flex flex-col min-h-full">
        <main className={`flex flex-col items-center py-8 sm:py-12 flex-1 ${appShellContainerClassName}`}>
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Document Requests</h1>
            <p className="text-primary text-sm sm:text-base mt-1">Upload requested documents for your loan application.</p>
          </div>
          <div className="w-full max-w-5xl mx-auto rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] p-10 sm:p-12 md:p-14 lg:p-16 flex flex-col items-center justify-center min-h-[min(52vh,420px)] text-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-primary/15 flex items-center justify-center mb-8">
              <FolderSearchIcon />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 max-w-3xl">No Document Requests</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mb-10">
              You don&apos;t have any pending document requests at the moment.
              <br />
              We&apos;ll notify you if we need anything else for your application.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              Continue to Homepage
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <main className={`flex flex-col py-8 sm:py-12 flex-1 ${appShellContainerClassName}`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Document Requests</h1>
            <p className="text-primary text-sm sm:text-base mt-1">Upload requested documents for your loan application.</p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefetching}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 disabled:opacity-50"
            aria-label="Refresh"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>
        <div className="bg-[#E8F5E9] rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Document Details</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested On</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <DocumentRequestRow
                    key={request._id}
                    request={request}
                    onUploadSuccess={handleUploadSuccess}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
