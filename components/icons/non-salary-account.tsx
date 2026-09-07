type IconProps = {
  className?: string;
};

export function NonSalaryIllustration({ className = "" }: IconProps) {
  return (
    <svg
      width="140"
      height="120"
      viewBox="0 0 140 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`mx-auto w-[120px] sm:w-[140px] h-auto ${className}`}
      aria-hidden="true"
    >
      <path
        d="M28 38h84l-6 58H34L28 38z"
        fill="#E8EDF2"
        stroke="#C5D0DC"
        strokeWidth="1.5"
      />
      <path d="M24 38h92v6H24v-6z" fill="#D5DEE8" />
      <path d="M38 44h64v4H38v-4z" fill="#C5D0DC" opacity="0.6" />
      <path d="M42 52h56v3H42v-3z" fill="#C5D0DC" opacity="0.4" />
      <path d="M42 59h48v3H42v-3z" fill="#C5D0DC" opacity="0.4" />
      <path
        d="M70 18L88 52H52L70 18z"
        fill="#FBBF24"
        stroke="#F59E0B"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M70 28v14"
        stroke="#92400E"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="70" cy="48" r="1.5" fill="#92400E" />
      <circle cx="98" cy="82" r="14" fill="#006525" />
      <circle cx="98" cy="78" r="5" fill="white" />
      <path d="M88 92c0-5.5 4.5-8 10-8s10 2.5 10 8" fill="white" />
    </svg>
  );
}

export function StarBadgeIcon({ className = "" }: IconProps) {
  return (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary ${className}`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
      </svg>
    </span>
  );
}

export function ClockBadgeIcon({ className = "" }: IconProps) {
  return (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#006525"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    </span>
  );
}

export function BenefitBoltIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`mx-auto ${className}`}
    >
      <path fill="#006525" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

export function BenefitShieldIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#006525"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`mx-auto ${className}`}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

export function BenefitRupeeIcon({ className = "" }: IconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`mx-auto ${className}`}
    >
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fill="#006525"
        fontSize="18"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        ₹
      </text>
    </svg>
  );
}

export const NON_SALARY_BENEFIT_ICONS = [
  BenefitBoltIcon,
  BenefitShieldIcon,
  BenefitRupeeIcon,
] as const;
