/**
 * Default user silhouette when no profile photo is available.
 */
type DefaultUserAvatarProps = {
  className?: string;
  iconClassName?: string;
  "aria-label"?: string;
};

export default function DefaultUserAvatar({
  className = "w-16 h-16 sm:w-20 sm:h-20",
  iconClassName = "w-9 h-9 sm:w-11 sm:h-11 text-primary",
  "aria-label": ariaLabel = "Default profile avatar",
}: DefaultUserAvatarProps) {
  return (
    <div
      className={`rounded-full bg-primary/10 flex items-center justify-center shrink-0 ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClassName}
        aria-hidden
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
}
