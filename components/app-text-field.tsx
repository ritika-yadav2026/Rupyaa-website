import { forwardRef, type InputHTMLAttributes, type ReactElement, type ReactNode } from "react";
import { cn } from "@/utils/cn-utils";

export type AppTextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  readonly label?: ReactNode;
  readonly error?: string | null;
  readonly prefix?: ReactNode;
  readonly className?: string;
  readonly inputClassName?: string;
};

/** Idle: white + gray border. Focus: cream bg + yellow border (project-wide). */
const shellBaseClassName =
  "flex min-h-[52px] overflow-hidden rounded-xl border bg-white transition-colors focus-within:bg-input-bg focus-within:ring-2 focus-within:ring-input-border/20";
const shellNormalClassName =
  "border-gray-200 focus-within:border-input-border";
const shellErrorClassName = "border-red-500 focus-within:border-red-500";
const plainInputBaseClassName =
  "w-full min-h-[52px] rounded-xl border bg-white px-4 py-3.5 text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:bg-input-bg focus:ring-2 focus:ring-input-border/20 disabled:opacity-60";
const plainInputNormalClassName =
  "border-gray-200 focus:border-input-border";
const plainInputErrorClassName = "border-red-500 focus:border-red-500";
const prefixedInputClassName =
  "min-h-[52px] w-full flex-1 bg-transparent py-3.5 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-60";

/**
 * Shared text field: neutral idle state, cream/yellow highlight on focus.
 */
const AppTextField = forwardRef<HTMLInputElement, AppTextFieldProps>(function AppTextField(
  {
    id,
    label,
    error,
    prefix,
    className,
    inputClassName,
    disabled,
    ...inputProps
  },
  ref
): ReactElement {
  const errorId = id ? `${id}-error` : undefined;
  const hasError = Boolean(error);
  let prefixContent: ReactNode = null;
  if (typeof prefix === "string") {
    prefixContent = (
      <span className="flex shrink-0 items-center gap-3 px-4 text-sm font-medium text-gray-700">
        {prefix}
        <span className="h-5 w-px bg-gray-300" aria-hidden="true" />
      </span>
    );
  } else if (prefix) {
    prefixContent = prefix;
  }
  let errorMessage: ReactNode = null;
  if (error && errorId) {
    errorMessage = (
      <p id={errorId} className="text-sm text-red-600" role="alert">
        {error}
      </p>
    );
  }
  let labelElement: ReactNode = null;
  if (label) {
    labelElement = (
      <label htmlFor={id} className="text-sm font-semibold text-gray-800">
        {label}
      </label>
    );
  }
  let fieldControl: ReactNode;
  if (prefixContent) {
    let shellBorderClassName = shellNormalClassName;
    if (hasError) {
      shellBorderClassName = shellErrorClassName;
    }
    fieldControl = (
      <div className={cn(shellBaseClassName, shellBorderClassName)}>
        {prefixContent}
        <input
          {...inputProps}
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={cn(prefixedInputClassName, inputClassName)}
        />
      </div>
    );
  } else {
    let plainBorderClassName = plainInputNormalClassName;
    if (hasError) {
      plainBorderClassName = plainInputErrorClassName;
    }
    fieldControl = (
      <input
        {...inputProps}
        ref={ref}
        id={id}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className={cn(plainInputBaseClassName, plainBorderClassName, inputClassName)}
      />
    );
  }
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {labelElement}
      {fieldControl}
      {errorMessage}
    </div>
  );
});

export default AppTextField;
