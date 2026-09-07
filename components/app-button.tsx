import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn-utils";

export type AppButtonVariant = "primary" | "secondary" | "ghost";

export type AppButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
> & {
  readonly variant?: AppButtonVariant;
  readonly fullWidth?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
};

const baseClassName =
  "inline-flex items-center justify-center rounded-xl font-semibold transition-colors disabled:cursor-not-allowed";

const variantClassNames: Record<AppButtonVariant, string> = {
  primary:
    "min-h-[52px] py-3.5 bg-button text-gray-900 hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2 disabled:opacity-60",
  secondary:
    "min-h-[52px] py-3.5 border-2 border-button bg-white text-gray-900 hover:bg-button/10 focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2 disabled:opacity-60",
  ghost:
    "min-h-0 py-0 bg-transparent text-primary hover:underline focus:outline-none disabled:opacity-50 disabled:hover:no-underline",
};

/**
 * Shared button with primary / secondary / ghost variants for consistent CTAs.
 */
export default function AppButton({
  variant = "primary",
  fullWidth = false,
  className,
  type = "button",
  children,
  ...buttonProps
}: AppButtonProps): React.ReactElement {
  let widthClassName = "";
  if (fullWidth) {
    widthClassName = "w-full";
  }
  return (
    <button
      {...buttonProps}
      type={type}
      className={cn(
        baseClassName,
        variantClassNames[variant],
        widthClassName,
        className
      )}
    >
      {children}
    </button>
  );
}
