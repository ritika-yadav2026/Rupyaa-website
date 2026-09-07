"use client";

import type { ChangeEvent, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

export type SupportIssueOption = {
  readonly value: string;
  readonly label: string;
};

type SupportIssueDropdownProps = {
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly options: readonly SupportIssueOption[];
  readonly disabled?: boolean;
  readonly errorMessage?: ReactNode;
  readonly onChange: (value: string) => void;
};

function ChevronIcon({ isOpen }: { readonly isOpen: boolean }): ReactNode {
  let rotateClass = "rotate-0";
  if (isOpen) {
    rotateClass = "rotate-180";
  }
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className={`shrink-0 text-slate-500 transition-transform duration-200 ${rotateClass}`}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon(): ReactNode {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="shrink-0 text-slate-400"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </svg>
  );
}

function SelectedCheckIcon(): ReactNode {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="shrink-0 text-primary"
      aria-hidden
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const OTHERS_ISSUE_LABEL = "others";

function findOthersOption(
  options: readonly SupportIssueOption[],
): SupportIssueOption | undefined {
  return options.find(
    (option) => option.label.trim().toLowerCase() === OTHERS_ISSUE_LABEL,
  );
}

function filterIssueOptions(
  options: readonly SupportIssueOption[],
  searchQuery: string,
): SupportIssueOption[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  if (!normalizedQuery) {
    return [...options];
  }
  const matchedOptions = options.filter((option) =>
    option.label.toLowerCase().includes(normalizedQuery),
  );
  if (matchedOptions.length > 0) {
    return matchedOptions;
  }
  const othersOption = findOthersOption(options);
  if (othersOption) {
    return [othersOption];
  }
  return [];
}

/**
 * Custom searchable issue dropdown for the Support ticket form.
 */
export default function SupportIssueDropdown({
  label,
  placeholder,
  value,
  options,
  disabled = false,
  errorMessage,
  onChange,
}: SupportIssueDropdownProps): ReactNode {
  const listboxId = useId();
  const searchInputId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = filterIssueOptions(options, searchQuery);
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function handlePointerDown(event: MouseEvent): void {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (rootRef.current?.contains(target)) {
        return;
      }
      setIsOpen(false);
      setSearchQuery("");
    }
    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    searchInputRef.current?.focus();
  }, [isOpen]);
  function handleToggle(): void {
    if (disabled) {
      return;
    }
    setIsOpen((currentIsOpen) => {
      const nextIsOpen = !currentIsOpen;
      if (!nextIsOpen) {
        setSearchQuery("");
      }
      return nextIsOpen;
    });
  }
  function handleSelect(optionValue: string): void {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery("");
  }
  function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
    setSearchQuery(event.target.value);
  }
  let triggerLabel = placeholder;
  let triggerLabelClass = "text-slate-400";
  if (selectedOption) {
    triggerLabel = selectedOption.label;
    triggerLabelClass = "text-slate-900";
  }
  let triggerBorderClass =
    "border-gray-200 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/15";
  if (isOpen) {
    triggerBorderClass =
      "border-primary ring-2 ring-primary/15 hover:border-primary";
  }
  if (disabled) {
    triggerBorderClass = "border-gray-200 bg-slate-50 text-slate-400";
  }
  let optionsPanel: ReactNode = null;
  if (isOpen && !disabled) {
    let optionNodes: ReactNode;
    if (options.length === 0) {
      optionNodes = (
        <li className="px-4 py-3 text-sm text-slate-500">No issues available</li>
      );
    } else {
      optionNodes = filteredOptions.map((option) => {
        const isSelected = option.value === value;
        let optionClass =
          "flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-slate-800 transition hover:bg-primary/10";
        if (isSelected) {
          optionClass =
            "flex w-full items-center justify-between gap-3 bg-primary/10 px-4 py-3 text-left text-sm font-semibold text-primary";
        }
        let selectedIcon: ReactNode = null;
        if (isSelected) {
          selectedIcon = <SelectedCheckIcon />;
        }
        return (
          <li key={option.value} role="option" aria-selected={isSelected}>
            <button
              type="button"
              className={optionClass}
              onClick={() => handleSelect(option.value)}
            >
              <span className="min-w-0 flex-1 leading-snug">{option.label}</span>
              {selectedIcon}
            </button>
          </li>
        );
      });
    }
    optionsPanel = (
      <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
        <div className="border-b border-slate-100 p-2">
          <label htmlFor={searchInputId} className="sr-only">
            Search issues
          </label>
          <div className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
            <SearchIcon />
            <input
              ref={searchInputRef}
              id={searchInputId}
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search issues..."
              autoComplete="off"
              className="w-full bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
        <ul
          id={listboxId}
          role="listbox"
          className="max-h-56 overflow-y-auto py-1"
        >
          {optionNodes}
        </ul>
      </div>
    );
  }
  let triggerCursorClass = "cursor-pointer";
  if (disabled) {
    triggerCursorClass = "cursor-not-allowed";
  }
  return (
    <div ref={rootRef} className="relative block">
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-600">
        {label}
      </span>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={handleToggle}
        className={`flex w-full min-h-[48px] items-center justify-between gap-3 rounded-xl border bg-white px-3 py-2.5 text-left text-base outline-none transition sm:px-4 sm:py-3 ${triggerBorderClass} ${triggerCursorClass}`}
      >
        <span className={`min-w-0 flex-1 truncate ${triggerLabelClass}`}>
          {triggerLabel}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>
      {optionsPanel}
      {errorMessage}
    </div>
  );
}
