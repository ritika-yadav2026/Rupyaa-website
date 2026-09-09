"use client";

import type { ReactElement, ReactNode } from "react";
import AppButton from "@/components/app-button";

type InlineLinkNoticeBoxProps = {
  title?: string;
  message: string;
  linkLabel: string;
  showLink: boolean;
  onLinkPress: () => void;
  accessibilityLabel?: string;
  className?: string;
};

function NoticeRupeeIcon(): ReactElement {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11"
      style={{ backgroundColor: "#FF8A8A" }}
      aria-hidden
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white text-sm font-semibold text-white sm:h-7 sm:w-7">
        ₹
      </span>
    </span>
  );
}

/**
 * Tinted inline alert card with an optional inline action link.
 *
 * The link sits inline at the end of the message so it wraps with the body
 * text on narrow widths. Hiding the link still keeps title and message
 * rendered — used during the 24h cooldown to surface the policy copy.
 */
export default function InlineLinkNoticeBox({
  title,
  message,
  linkLabel,
  showLink,
  onLinkPress,
  accessibilityLabel,
  className,
}: InlineLinkNoticeBoxProps) {
  let titleContent: ReactNode = null;
  if (title) {
    titleContent = <p className="mb-1 text-sm font-semibold text-gray-900">{title}</p>;
  }

  let linkContent: ReactNode = null;
  if (showLink) {
    linkContent = (
      <>
        {" "}
        <AppButton
          type="button"
          variant="ghost"
          onClick={onLinkPress}
          aria-label={accessibilityLabel ?? linkLabel}
          className="inline font-semibold underline-offset-2 hover:opacity-75"
        >
          {linkLabel}
        </AppButton>
      </>
    );
  }

  return (
    <div
      className={`rounded-xl border border-[#FF8E8E] bg-[#B43F341A] px-4 py-3 text-left ${
        className ?? ""
      }`}
      role="note"
    >
      <div className="flex items-start gap-3">
        <NoticeRupeeIcon />
        <div className="min-w-0 flex-1">
          {titleContent}
          <p className="text-sm leading-relaxed text-gray-600">
            {message}
            {linkContent}
          </p>
        </div>
      </div>
    </div>
  );
}
