import type { ReactNode } from "react";
import { cn } from "@/utils/cn-utils";

export type AppSelectableOption = {
  readonly value: string;
  readonly title: string;
  readonly description?: string;
};

export type AppSelectableFieldProps = {
  readonly name: string;
  readonly value: string | null;
  readonly options: readonly AppSelectableOption[];
  readonly onChange: (value: string) => void;
  readonly legend?: ReactNode;
  readonly error?: string | null;
  readonly disabled?: boolean;
  readonly className?: string;
};

/**
 * Shared radio-card group: cream/yellow selected surface matching AppTextField tokens.
 */
export default function AppSelectableField({
  name,
  value,
  options,
  onChange,
  legend,
  error,
  disabled = false,
  className,
}: AppSelectableFieldProps): React.ReactElement {
  const errorId = `${name}-error`;
  const hasError = Boolean(error);
  let legendElement: ReactNode = null;
  if (legend) {
    legendElement = (
      <legend className="mb-2 text-sm font-semibold text-gray-900">{legend}</legend>
    );
  }
  let errorMessage: ReactNode = null;
  if (error) {
    errorMessage = (
      <p id={errorId} className="text-sm text-red-600" role="alert">
        {error}
      </p>
    );
  }
  return (
    <fieldset
      className={cn("flex flex-col gap-3", className)}
      disabled={disabled}
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
    >
      {legendElement}
      {options.map((option) => {
        const isSelected = value === option.value;
        let cardClassName =
          "flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors";
        if (isSelected) {
          cardClassName = cn(
            cardClassName,
            "border-input-border bg-input-bg"
          );
        } else {
          cardClassName = cn(
            cardClassName,
            "border-gray-200 bg-white hover:border-input-border/50"
          );
        }
        if (disabled) {
          cardClassName = cn(cardClassName, "cursor-not-allowed opacity-60");
        }
        let descriptionElement: ReactNode = null;
        if (option.description) {
          descriptionElement = (
            <span className="text-sm text-gray-600">{option.description}</span>
          );
        }
        return (
          <label key={option.value} className={cardClassName}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              disabled={disabled}
              className="mt-1 h-5 w-5 shrink-0 accent-button"
            />
            <span className="flex min-w-0 flex-col gap-1">
              <span className="text-base font-semibold text-gray-900">
                {option.title}
              </span>
              {descriptionElement}
            </span>
          </label>
        );
      })}
      {errorMessage}
    </fieldset>
  );
}
