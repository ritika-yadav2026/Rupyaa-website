import type { ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn-utils";

export type AppSelectOption = {
  readonly value: string;
  readonly label: string;
};

export type AppSelectFieldProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "className" | "children"
> & {
  readonly label?: ReactNode;
  readonly error?: string | null;
  readonly hint?: ReactNode;
  readonly options: readonly AppSelectOption[];
  readonly className?: string;
  readonly selectClassName?: string;
  readonly placeholder?: string;
};

/** Same surface as AppTextField: white + gray idle, cream + yellow on focus. */
const selectBaseClassName =
  "w-full min-h-[52px] appearance-none rounded-xl border bg-white px-4 py-3.5 pr-10 text-gray-900 transition-colors focus:outline-none focus:bg-input-bg focus:ring-2 focus:ring-input-border/20 focus:border-input-border disabled:opacity-60 disabled:cursor-not-allowed";
const selectNormalClassName = "border-gray-200";
const selectErrorClassName = "border-red-500 focus:border-red-500";

function ChevronIcon(): React.ReactElement {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Shared select field — same border/background focus behavior as AppTextField.
 */
export default function AppSelectField({
  id,
  label,
  error,
  hint,
  options,
  className,
  selectClassName,
  placeholder,
  disabled,
  ...selectProps
}: AppSelectFieldProps): React.ReactElement {
  const errorId = id ? `${id}-error` : undefined;
  const hintId = id ? `${id}-hint` : undefined;
  const hasError = Boolean(error);
  let borderClassName = selectNormalClassName;
  if (hasError) {
    borderClassName = selectErrorClassName;
  }
  let describedBy: string | undefined;
  const describedByParts: string[] = [];
  if (hint && hintId) {
    describedByParts.push(hintId);
  }
  if (hasError && errorId) {
    describedByParts.push(errorId);
  }
  if (describedByParts.length > 0) {
    describedBy = describedByParts.join(" ");
  }
  let labelElement: ReactNode = null;
  if (label) {
    labelElement = (
      <label htmlFor={id} className="text-sm font-semibold text-gray-800">
        {label}
      </label>
    );
  }
  let placeholderOption: ReactNode = null;
  if (placeholder !== undefined) {
    placeholderOption = (
      <option value="" disabled={selectProps.required === true}>
        {placeholder}
      </option>
    );
  }
  let hintElement: ReactNode = null;
  if (hint) {
    hintElement = (
      <p id={hintId} className="text-xs text-gray-500">
        {hint}
      </p>
    );
  }
  let errorMessage: ReactNode = null;
  if (error && errorId) {
    errorMessage = (
      <p id={errorId} className="text-sm text-red-600" role="alert">
        {error}
      </p>
    );
  }
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {labelElement}
      <div className="relative">
        <select
          {...selectProps}
          id={id}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          className={cn(selectBaseClassName, borderClassName, selectClassName)}
        >
          {placeholderOption}
          {options.map((option) => (
            <option key={option.value || "empty"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronIcon />
      </div>
      {hintElement}
      {errorMessage}
    </div>
  );
}
