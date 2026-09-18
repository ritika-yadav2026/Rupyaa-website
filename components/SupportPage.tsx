"use client";

import SupportIssueDropdown from "@/components/SupportIssueDropdown";
import { useSearchParams } from "next/navigation";
import type { ChangeEvent, DragEvent, FormEvent, ReactNode } from "react";
import { Suspense, useId, useRef, useState } from "react";
import toast from "react-hot-toast";
import AppDownloadQrCode from "@/components/AppDownloadQrCode";
import AppHeader from "@/components/AppHeader";
import AppStoreBadge from "@/components/AppStoreBadge";
import GooglePlayBadge from "@/components/GooglePlayBadge";
import Footer from "@/components/home/Footer";
import { useAppDownload } from "@/hooks/useAppDownload";
import { useTicketFilterOptions } from "@/hooks/useTicketFilterOptions";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import { createCustomerSupportTicket } from "@/lib/support-ticket-api";
import { useAuthStore } from "@/store/useAuthStore";
import DownloadAppSection from "./home/DownloadAppSection";
import AppButton from "@/components/app-button";
import AppTextField from "@/components/app-text-field";

const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_ATTACHMENT_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
] as const;

type SupportFormState = {
  readonly applicantReference: string;
  readonly categoryId: string;
  readonly description: string;
};

type ContactCardProps = {
  readonly title: string;
  readonly content: string;
  readonly href?: string;
  readonly icon: React.ReactNode;
};

function PhoneIcon(): React.ReactNode {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="text-black"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon(): React.ReactNode {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="text-black"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function MapPinIcon(): React.ReactNode {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="text-black"
    >
      <path d="M12 21s7-4.76 7-11a7 7 0 0 0-14 0c0 6.24 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function UploadIcon(): React.ReactNode {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-gray-500"
    >
      <path d="M16 16l-4-4-4 4" />
      <path d="M12 12v9" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
      <path d="M16 16h2a4 4 0 0 0 0-8" />
    </svg>
  );
}

function CheckIcon(): React.ReactNode {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.2l2.4 2.4L16.5 8.5" />
    </svg>
  );
}

function PersonIcon(): React.ReactNode {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-slate-900"
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 19c1.2-3.2 3.5-4.8 6.5-4.8s5.3 1.6 6.5 4.8" />
    </svg>
  );
}

function ContactCard({
  title,
  content,
  href,
  icon,
}: ContactCardProps): React.ReactNode {
  const contentNode = href ? (
    <a
      href={href}
      className="text-sm font-semibold text-slate-900 hover:underline sm:text-base"
    >
      {content}
    </a>
  ) : (
    <p className="text-sm font-semibold leading-snug text-slate-900 sm:max-w-md sm:text-base sm:leading-relaxed">
      {content}
    </p>
  );
  return (
    <section className="flex items-center gap-3 rounded-xl border border-[#FECA42] bg-[#FFFCF4] p-3 sm:min-h-[120px] sm:gap-5 sm:p-5 sm:shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FFE398] sm:size-14 sm:rounded-xl [&_svg]:h-[18px] [&_svg]:w-[18px] sm:[&_svg]:h-[26px] sm:[&_svg]:w-[26px]">
        {icon}
      </div>
      <div className="min-w-0">
        <h2 className="mb-0.5 text-xs font-medium text-slate-500 sm:mb-2 sm:text-lg sm:font-bold sm:text-slate-900">
          {title}
        </h2>
        {contentNode}
      </div>
    </section>
  );
}

function SupportPromoCard(): React.ReactNode {
  const downloadConfig = useAppDownload();

  return (
    <section className="grid gap-5 rounded-xl border border-primary/10 bg-[#e8f5e9] p-6 shadow-[0_14px_32px_rgba(15,23,42,0.06)] sm:grid-cols-[180px_1fr] sm:items-center">
      <span className="mx-auto hidden size-[170px] sm:mx-0 sm:block">
        <AppDownloadQrCode
          url={downloadConfig.url}
          label={`QR code for the Rupyaa ${downloadConfig.storeLabel} listing`}
        />
      </span>
      <div>
        <h2 className="mb-2 text-base font-bold text-slate-900">
          5 Minutes Process
        </h2>
        <p className="mb-4 max-w-xs text-sm leading-relaxed text-slate-700">
          Experience lightning fast digital lending. Apply, verify, and get
          disbursed right from your phone.
        </p>
        <ul className="mb-5 space-y-2 text-sm text-slate-700">
          <li className="flex items-center gap-2">
            <span className="text-primary">
              <CheckIcon />
            </span>
            No paperwork required
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary">
              <CheckIcon />
            </span>
            Instant eligibility check
          </li>
        </ul>
        <div className="flex flex-wrap gap-3">
          <GooglePlayBadge />
          <AppStoreBadge />
        </div>
      </div>
    </section>
  );
}

function formatPhoneNumber(phoneNumber: string | null): string {
  if (!phoneNumber) {
    return "";
  }
  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91 ${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2)}`;
  }
  return phoneNumber.trim();
}

function normalizePhoneNumber(phoneNumber: string | null): string | undefined {
  if (!phoneNumber) {
    return undefined;
  }
  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits || undefined;
}

function SupportContent(): React.ReactNode {
  const searchParams = useSearchParams();
  const isMobileSource = searchParams.get("source") === "mobile";
  const supportReturnPath = isMobileSource
    ? "/support?source=mobile"
    : "/support";
  const supportAuthHref = `/auth?returnTo=${encodeURIComponent(supportReturnPath)}`;
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const authPhoneNumber = useAuthStore((state) => state.phone);
  const displayPhoneNumber = formatPhoneNumber(authPhoneNumber);
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formState, setFormState] = useState<SupportFormState>({
    applicantReference: "",
    categoryId: "",
    description: "",
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {
    data: filterOptions,
    isPending: isFilterOptionsPending,
    isError: isFilterOptionsError,
  } = useTicketFilterOptions({ enabled: isLoggedIn && !isMobileSource });
  const categories = filterOptions?.categories ?? [];
  const issueOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));
  const selectedCategory = categories.find(
    (category) => category._id === formState.categoryId,
  );
  function updateFormField(
    fieldName: keyof SupportFormState,
    value: string,
  ): void {
    setFormState((currentFormState: SupportFormState) => ({
      ...currentFormState,
      [fieldName]: value,
    }));
  }
  function saveAttachment(selectedFile: File | null): boolean {
    if (!selectedFile) {
      setAttachment(null);
      return true;
    }
    const isAcceptedType = ACCEPTED_ATTACHMENT_TYPES.some(
      (type: string) => type === selectedFile.type,
    );
    if (!isAcceptedType) {
      toast.error("Please upload a PNG, JPG, or PDF file.");
      return false;
    }
    if (selectedFile.size > MAX_ATTACHMENT_SIZE_BYTES) {
      toast.error("File size must be under 10MB.");
      return false;
    }
    setAttachment(selectedFile);
    return true;
  }
  function handleAttachmentChange(event: ChangeEvent<HTMLInputElement>): void {
    const selectedFile = event.target.files?.[0] ?? null;
    const isSaved = saveAttachment(selectedFile);
    if (!isSaved) {
      event.target.value = "";
    }
  }
  function handleAttachmentDragOver(event: DragEvent<HTMLLabelElement>): void {
    event.preventDefault();
  }
  function handleAttachmentDrop(event: DragEvent<HTMLLabelElement>): void {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files?.[0] ?? null;
    saveAttachment(selectedFile);
  }
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login to submit a support request.");
      return;
    }
    const categoryId = formState.categoryId.trim();
    const description = formState.description.trim();
    const applicationNumber = formState.applicantReference.trim().toUpperCase();
    if (!categoryId || !selectedCategory) {
      toast.error("Please select an issue.");
      return;
    }
    if (!description) {
      toast.error("Please describe your issue or feedback.");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await createCustomerSupportTicket({
        categoryId,
        subject: selectedCategory.name,
        description,
        applicationNumber: applicationNumber || undefined,
        phoneNumber: normalizePhoneNumber(authPhoneNumber),
        files: attachment ? [attachment] : [],
      });
      const ticketId = response.ticket?.ticketId;
      toast.success(
        ticketId
          ? `Support ticket ${ticketId} created successfully.`
          : (response.message ?? "Support ticket created successfully."),
      );
      setFormState({
        applicantReference: "",
        categoryId: "",
        description: "",
      });
      setAttachment(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create support ticket.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }
  function renderForm(): ReactNode {
    if (isMobileSource) {
      return null;
    }
    if (!isLoggedIn) {
      return (
        <section className="rounded-xl bg-white p-6 text-center shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
          <h2 className="text-xl font-bold text-slate-900">
            Login to raise a support request
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Support requests are available for registered Rupyaa users.
          </p>
          <AppButton
            type="button"
            className="mt-6 px-8"
            onClick={() => {
              window.location.href = supportAuthHref;
            }}
          >
            Login
          </AppButton>
        </section>
      );
    }
    let categoryPlaceholder = "Select an issue";
    if (isFilterOptionsPending) {
      categoryPlaceholder = "Loading issues...";
    }
    let categoryErrorMessage: ReactNode = null;
    if (isFilterOptionsError) {
      categoryErrorMessage = (
        <span className="mt-2 block text-xs font-medium text-red-600">
          Unable to load categories. Please refresh and try again.
        </span>
      );
    }
    let attachmentName: ReactNode = null;
    if (attachment) {
      attachmentName = (
        <span className="mt-3 text-xs font-semibold text-slate-700">
          {attachment.name}
        </span>
      );
    }
    let submitLabel = "Submit";
    if (isSubmitting) {
      submitLabel = "Submitting...";
    }
    return (
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-xl sm:border-0 sm:p-6 sm:shadow-[0_18px_44px_rgba(15,23,42,0.08)]"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AppTextField
              id="support-application-number"
              label="Enter your application number"
              type="text"
              inputMode="text"
              value={formState.applicantReference}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateFormField("applicantReference", event.target.value)
              }
              placeholder="Loan Application Issue"
              inputClassName="border-[#FECA42] bg-[#FFFCF4] focus:border-[#FECA42] sm:border-gray-200 sm:bg-white"
            />
            <AppTextField
              id="support-registered-phone"
              label="Registered phone number"
              type="tel"
              value={displayPhoneNumber}
              readOnly
              placeholder="+91 9999999999"
              inputClassName="border-[#FECA42] bg-[#FFFCF4] text-slate-700 focus:border-[#FECA42] sm:border-gray-200 sm:bg-slate-50"
            />
          </div>
          <SupportIssueDropdown
            label="Issue"
            placeholder={categoryPlaceholder}
            value={formState.categoryId}
            options={issueOptions}
            disabled={isFilterOptionsPending || isFilterOptionsError}
            errorMessage={categoryErrorMessage}
            onChange={(categoryId: string) =>
              updateFormField("categoryId", categoryId)
            }
          />
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-800 sm:text-sm sm:normal-case sm:tracking-normal">
              Describe your issue or feedback
            </span>
            <textarea
              value={formState.description}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                updateFormField("description", event.target.value)
              }
              placeholder="Please provide details..."
              rows={5}
              className="w-full resize-none rounded-xl border border-[#FECA42] bg-[#FFFCF4] px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#FECA42] focus:ring-2 focus:ring-[#FECA42]/20 sm:border-gray-200 sm:bg-white sm:focus:border-input-border sm:focus:bg-input-bg sm:focus:ring-input-border/20"
            />
          </label>
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-800 sm:text-sm sm:normal-case sm:tracking-normal">
              Attach relevant files
            </span>
            <label
              htmlFor={fileInputId}
              onDragOver={handleAttachmentDragOver}
              onDrop={handleAttachmentDrop}
              className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-[#FECA42] bg-[#FFFCF4] px-4 text-center transition hover:bg-[#FFF4D9] sm:min-h-40 sm:border-dashed sm:border-input-border/60 sm:bg-input-bg sm:hover:border-input-border"
            >
              <UploadIcon />
              <span className="mt-3 text-sm font-bold text-gray-900">
                Upload a file{" "}
                <span className="font-medium text-gray-600">
                  or drag and drop
                </span>
              </span>
              <span className="mt-1 text-xs text-gray-500">
                PNG, JPG, PDF up to 25MB
              </span>
              {attachmentName}
            </label>
            <input
              ref={fileInputRef}
              id={fileInputId}
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleAttachmentChange}
              className="sr-only"
            />
          </div>
          <AppButton
            type="submit"
            fullWidth
            disabled={
              isSubmitting || isFilterOptionsPending || isFilterOptionsError
            }
          >
            {submitLabel}
          </AppButton>
        </div>
      </form>
    );
  }
  let downloadSection: ReactNode = null;
  if (!isMobileSource) {
    downloadSection = (
      <div className="mt-8">
        <DownloadAppSection />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 sm:bg-white">
      {!isMobileSource && <AppHeader />}
      <main className={isMobileSource ? "" : "pt-16"}>
        <div className={`${appShellContainerClassName} py-6 sm:py-10 lg:py-12`}>
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 text-center sm:mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Welcome to{" "}
                <span className="text-slate-900 sm:text-[#FECA42]">Rupyaa Support</span>
              </h1>
              <p className="mt-2 text-sm text-slate-500 sm:mt-4 sm:text-base sm:font-semibold sm:text-[#FECA42]">
                How can we help you today?
              </p>
            </div>
            <div className="grid gap-4 sm:gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:space-y-0 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
                <div className="mb-3 flex items-center gap-2 sm:hidden">
                  <PersonIcon />
                  <h2 className="text-base font-bold text-slate-900">
                    Personal Information
                  </h2>
                </div>
                <div className="space-y-3 sm:space-y-6">
                  <ContactCard
                    title="Contact Support Number"
                    content="85-0309-0309"
                    href="tel:8503090309"
                    icon={<PhoneIcon />}
                  />
                  <ContactCard
                    title="Contact Support Email"
                    content="care@rupyaa.in"
                    href="mailto:care@rupyaa.in"
                    icon={<MailIcon />}
                  />
                  <ContactCard
                    title="Address"
                    content="79, Ground Floor, World Trade Centre, Babar Lane, New Delhi - 110001, India"
                    icon={<MapPinIcon />}
                  />
                </div>
              </section>
              {renderForm()}
            </div>
            {downloadSection}
          </div>
        </div>
        {!isMobileSource && <Footer />}
      </main>
    </div>
  );
}

export default function SupportPage(): React.ReactNode {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <SupportContent />
    </Suspense>
  );
}
