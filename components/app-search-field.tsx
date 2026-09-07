"use client";

import type { ChangeEvent, FormEvent, ReactNode } from "react";

export type AppSearchFieldProps = {
  readonly id: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder: string;
  /** Exposed to assistive tech when no visible label is present */
  readonly ariaLabel: string;
  readonly maxLength?: number;
  readonly className?: string;
  readonly inputClassName?: string;
  readonly error?: string | null;
  readonly errorId?: string;
  /** Called when the user presses Enter or activates the hidden submit control */
  readonly onSubmitSearch?: () => void;
  readonly leading?: ReactNode;
};

/**
 * Accessible search control: semantic `role="search"`, Enter submits without navigation,
 * and optional validation message linkage.
 */
export default function AppSearchField(props: AppSearchFieldProps): React.ReactElement {
  const maxLength = props.maxLength ?? 200;
  const errorId = props.errorId ?? `${props.id}-error`;
  const executeSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    props.onSubmitSearch?.();
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    props.onChange(e.target.value.slice(0, maxLength));
  };
  return (
    <form role="search" onSubmit={executeSubmit} className={props.className}>
      {props.leading}
      <input
        id={props.id}
        type="search"
        name={props.id}
        value={props.value}
        onChange={handleChange}
        placeholder={props.placeholder}
        maxLength={maxLength}
        autoComplete="off"
        enterKeyHint="search"
        aria-label={props.ariaLabel}
        aria-invalid={Boolean(props.error)}
        aria-describedby={props.error ? errorId : undefined}
        className={props.inputClassName}
      />
      <button type="submit" className="sr-only">
        Apply search filter
      </button>
      {props.error ? (
        <p id={errorId} className="text-sm text-red-600 mt-1" role="alert">
          {props.error}
        </p>
      ) : null}
    </form>
  );
}
