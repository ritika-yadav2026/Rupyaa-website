"use client";

import type { ReactElement, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getDocumentRequests } from "@/lib/document-requests-api";
import DocumentRequestCard from "@/components/document-requests/DocumentRequestCard";
import BasicInfoSidebar from "@/components/BasicInfoSidebar";
import AppButton from "@/components/app-button";
import ZapcashLoading from "@/components/ZapcashLoading";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import { IMAGES } from "@/lib/images";
import { REACT_QUERY_KEYS } from "@/utils/app-constants";

function ChevronRightIcon(): ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function DocumentRequestsEmptyState(): ReactElement {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center rounded-2xl border border-dashed border-[#E8D9A8] bg-[#FFFCF4] px-6 py-10 text-center sm:px-10 sm:py-14">
      <div className="relative mb-6 h-40 w-full max-w-xs sm:h-48">
        <Image
          src={IMAGES.noPendingDocuments}
          alt=""
          fill
          className="object-contain"
          sizes="320px"
        />
      </div>
      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">No Document Requests</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
        You don&apos;t have any pending document requests at the moment. We&apos;ll notify you if we
        need anything else for your application.
      </p>
      <AppButton type="button" className="mt-6 w-full max-w-md" onClick={() => router.push("/")}>
        Continue to Homepage
      </AppButton>
    </div>
  );
}

function NeedHelpBar(): ReactElement {
  return (
    <Link
      href="/support"
      className="mt-6 flex items-center gap-3 rounded-2xl border border-[#FECA42]/40 bg-[#FFF8E6] px-4 py-4 sm:px-5"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-gray-900">Need Help?</span>
        <span className="mt-0.5 block text-sm text-gray-600">
          Find answers or get in touch with our support team.
        </span>
      </span>
      <span className="shrink-0 text-gray-500">
        <ChevronRightIcon />
      </span>
    </Link>
  );
}

type DocumentRequestsShellProps = {
  readonly children: ReactNode;
  readonly showRefresh?: boolean;
  readonly isRefetching?: boolean;
  readonly onRefresh?: () => void;
};

function DocumentRequestsShell({
  children,
  showRefresh = false,
  isRefetching = false,
  onRefresh,
}: DocumentRequestsShellProps): ReactElement {
  let refreshButton: ReactNode = null;
  if (showRefresh && onRefresh) {
    refreshButton = (
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefetching}
        className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        aria-label="Refresh"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
      </button>
    );
  }

  return (
    <div className={`${appShellContainerClassName} box-border py-8 sm:py-10`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="min-w-0 w-full lg:flex-1">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Document Requests</h1>
              <p className="mt-1 text-sm text-gray-600 sm:text-base">
                Upload requested documents for your loan application.
              </p>
            </div>
            {refreshButton}
          </div>
          {children}
        </div>
        <div className="w-full shrink-0 lg:w-[300px] xl:w-[340px]">
          <div className="h-auto min-h-[420px] w-full lg:sticky lg:top-24 lg:h-[calc(100dvh-7rem)] lg:min-h-0">
            <BasicInfoSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DocumentRequestsPage(): ReactElement {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: [REACT_QUERY_KEYS.DOCUMENT_REQUESTS],
    queryFn: async () => {
      const res = await getDocumentRequests();
      return res.data;
    },
  });

  const handleRefresh = (): void => {
    void refetch();
    toast.success("List refreshed");
  };

  const handleUploadSuccess = (): void => {
    void refetch();
  };

  const requests = data ?? [];

  let status: "error" | "loading" | "empty" | "success";
  if (isError) {
    status = "error";
  } else if (isLoading && !data) {
    status = "loading";
  } else if (requests.length === 0) {
    status = "empty";
  } else {
    status = "success";
  }

  let content: ReactNode;
  switch (status) {
    case "error": {
      let errorMessage = "Failed to load document requests";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      content = (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E8D9A8] bg-[#FFFCF4] p-8 text-center">
          <p className="mb-4 text-sm text-red-600">{errorMessage}</p>
          <AppButton type="button" onClick={() => void refetch()}>
            Try Again
          </AppButton>
        </div>
      );
      break;
    }
    case "loading":
      content = (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <div className="flex flex-col items-center gap-3">
            <ZapcashLoading />
            <span className="text-sm font-medium">Loading document requests…</span>
          </div>
        </div>
      );
      break;
    case "empty":
      content = <DocumentRequestsEmptyState />;
      break;
    case "success":
      content = (
        <div>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">Documents to Upload</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Make sure the documents are clear and readable.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {requests.map((request) => (
              <DocumentRequestCard
                key={request._id}
                request={request}
                onUploadSuccess={handleUploadSuccess}
              />
            ))}
          </div>
          <NeedHelpBar />
        </div>
      );
      break;
  }

  return (
    <DocumentRequestsShell
      showRefresh={status === "success" || status === "empty"}
      isRefetching={isRefetching}
      onRefresh={handleRefresh}
    >
      {content}
    </DocumentRequestsShell>
  );
}
