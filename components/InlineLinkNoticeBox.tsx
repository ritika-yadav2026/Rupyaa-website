"use client";

type InlineLinkNoticeBoxProps = {
  title?: string;
  message: string;
  linkLabel: string;
  showLink: boolean;
  onLinkPress: () => void;
  accessibilityLabel?: string;
  className?: string;
};

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
  return (
    <div
      className={`rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-left ${
        className ?? ""
      }`}
      role="note"
    >
      {title ? (
        <p className="mb-1 text-sm font-semibold text-gray-900">{title}</p>
      ) : null}
      <p className="text-sm leading-relaxed text-gray-600">
        {message}
        {showLink ? (
          <>
            {" "}
            <button
              type="button"
              onClick={onLinkPress}
              aria-label={accessibilityLabel ?? linkLabel}
              className="font-semibold text-primary underline-offset-2 hover:opacity-75 hover:underline focus:outline-none focus-visible:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-sm"
            >
              {linkLabel}
            </button>
          </>
        ) : null}
      </p>
    </div>
  );
}
