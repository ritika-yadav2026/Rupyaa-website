/**
 * Shared validation helpers for form fields.
 * Each function returns an error message string or null if valid.
 */

const PAN_REGEX = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_MOBILE_LENGTH = 10;
const MIN_AGE_YEARS = 18;
const MAX_AGE_YEARS = 100;
const PINCODE_LENGTH = 6;
const MIN_INCOME = 1000;
const MAX_INCOME = 1_00_00_000;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;
const MAX_ORGANIZATION_NAME_LENGTH = 200;
const MIN_BANK_ACCOUNT_DIGITS = 9;
const MAX_BANK_ACCOUNT_DIGITS = 18;
/** IFSC: 4 letters + 0 + 6 alphanumeric (e.g. HDFC0001234) */
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const MAX_SEARCH_QUERY_LENGTH = 200;
const MAX_STREET_ADDRESS_LENGTH = 500;
const MAX_PDF_PASSWORD_LENGTH = 256;

export type TextCharacterPolicy = "name" | "organization" | "address";

const TEXT_CHARACTER_PATTERNS: Record<TextCharacterPolicy, RegExp> = {
  name: /^[\p{L}\p{M}\s.'-]*$/u,
  organization: /^[\p{L}\p{M}\p{N}\s.,&'()\/-]*$/u,
  address: /^[\p{L}\p{M}\p{N}\s.,\/'#()&-]*$/u,
};

const TEXT_CHARACTER_ERRORS: Record<TextCharacterPolicy, string> = {
  name: "Use letters, spaces, periods, apostrophes or hyphens only",
  organization: "Organization name contains unsupported characters",
  address: "Address contains unsupported characters",
};

export function sanitizeTextInput(value: string, policy: TextCharacterPolicy): string {
  const allowedPattern = TEXT_CHARACTER_PATTERNS[policy];
  return Array.from(value).filter((character) => allowedPattern.test(character)).join("");
}

export function validateTextCharacters(
  value: string,
  policy: TextCharacterPolicy
): string | null {
  if (!TEXT_CHARACTER_PATTERNS[policy].test(value)) {
    return TEXT_CHARACTER_ERRORS[policy];
  }
  return null;
}

export function validatePan(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "PAN number is required";
  const normalized = trimmed.toUpperCase();
  if (!PAN_REGEX.test(normalized)) {
    return "Enter a valid PAN (e.g. ABCDE1234F)";
  }
  return null;
}

export function validateDob(value: string): string | null {
  if (!value) return "Date of birth is required";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Enter a valid date";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date > today) return "Date of birth cannot be in the future";
  const age = (today.getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  if (age < MIN_AGE_YEARS) return `You must be at least ${MIN_AGE_YEARS} years old`;
  if (age > MAX_AGE_YEARS) return "Please enter a valid date of birth";
  return null;
}

export function validateIncome(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Monthly income is required";
  const num = Number(trimmed.replace(/[₹,\s]/g, ""));
  if (Number.isNaN(num)) return "Enter a valid number";
  if (num < MIN_INCOME) return `Income must be at least ₹${MIN_INCOME.toLocaleString("en-IN")}`;
  if (num > MAX_INCOME) return "Please enter a realistic monthly income";
  return null;
}

export function validatePincode(digits: string[]): string | null {
  const full = digits.join("");
  if (full.length !== PINCODE_LENGTH) return "Enter all 6 digits of pincode";
  if (!/^\d{6}$/.test(full)) return "Pincode must contain only numbers";
  return null;
}

export function validatePincodeString(value: string): string | null {
  const digits = value.replace(/\D/g, "").split("");
  const padded = [...digits, "", "", "", "", "", ""].slice(0, 6);
  return validatePincode(padded);
}

export function validateIndianMobile(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== INDIAN_MOBILE_LENGTH) return "Enter a valid 10-digit mobile number";
  const first = digits[0];
  if (first !== "6" && first !== "7" && first !== "8" && first !== "9") {
    return "Mobile number must start with 6, 7, 8 or 9";
  }
  return null;
}

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Email is required";
  if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address";
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value.trim()) return `${fieldName} is required`;
  return null;
}

export function validateName(value: string, fieldName: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return `${fieldName} is required`;
  if (trimmed.length < MIN_NAME_LENGTH) return `${fieldName} must be at least ${MIN_NAME_LENGTH} characters`;
  if (trimmed.length > MAX_NAME_LENGTH) return `${fieldName} is too long`;
  const characterError = validateTextCharacters(trimmed, "name");
  if (characterError) return characterError;
  return null;
}

/** Letters, spaces and . ' - allowed; must start and end with a letter. */
const ACCOUNT_HOLDER_NAME_REGEX = /^[\p{L}][\p{L}\p{M}\s.'-]*[\p{L}\p{M}]$/u;

export function validateAccountHolderName(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Account holder name is required";
  if (trimmed.length < MIN_NAME_LENGTH) {
    return `Account holder name must be at least ${MIN_NAME_LENGTH} characters`;
  }
  if (trimmed.length > MAX_NAME_LENGTH) {
    return `Account holder name cannot exceed ${MAX_NAME_LENGTH} characters`;
  }
  if (!ACCOUNT_HOLDER_NAME_REGEX.test(trimmed)) {
    return "Enter a valid account holder name";
  }
  return null;
}

/** Trimmed minimum 2-character validator for bank / branch name fields. */
export function validateBankFieldName(value: string, fieldName: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return `${fieldName} is required`;
  if (trimmed.length < MIN_NAME_LENGTH) {
    return `${fieldName} must be at least ${MIN_NAME_LENGTH} characters`;
  }
  return null;
}

export function validateOptionalIndianMobile(value: string): string | null {
  if (!value.trim()) return null;
  return validateIndianMobile(value);
}

/**
 * Normalizes PAN input: A–Z and 0–9 only, max 10 chars, uppercased.
 */
export function sanitizePanInput(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
}

export function validateIfsc(value: string): string | null {
  const normalized = value.trim().toUpperCase();
  if (!normalized) return "IFSC code is required";
  if (normalized.length !== 11) return "IFSC must be exactly 11 characters";
  if (!IFSC_REGEX.test(normalized)) {
    return "Enter a valid IFSC (e.g. HDFC0001234)";
  }
  return null;
}

export function validateBankAccountNumber(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Bank account number is required";
  if (digits.length < MIN_BANK_ACCOUNT_DIGITS) {
    return `Account number must be at least ${MIN_BANK_ACCOUNT_DIGITS} digits`;
  }
  if (digits.length > MAX_BANK_ACCOUNT_DIGITS) {
    return `Account number cannot exceed ${MAX_BANK_ACCOUNT_DIGITS} digits`;
  }
  return null;
}

export function validateBankAccountConfirmation(account: string, confirm: string): string | null {
  const a = account.replace(/\D/g, "");
  const c = confirm.replace(/\D/g, "");
  if (!c) return "Please confirm your account number";
  if (a !== c) return "Account numbers do not match";
  return null;
}

/**
 * Validates OTP digit boxes; `digits` is an array of single-character strings.
 */
export function validateOtpDigits(digits: readonly string[], expectedLength: number): string | null {
  const joined = digits.join("");
  if (joined.length !== expectedLength) {
    return `Enter the ${expectedLength}-digit code`;
  }
  if (!/^\d+$/.test(joined)) {
    return "Code must contain only numbers";
  }
  return null;
}

export function validateOrganizationName(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Organization name is required";
  if (trimmed.length < MIN_NAME_LENGTH) {
    return `Organization name must be at least ${MIN_NAME_LENGTH} characters`;
  }
  if (trimmed.length > MAX_ORGANIZATION_NAME_LENGTH) {
    return "Organization name is too long";
  }
  const characterError = validateTextCharacters(trimmed, "organization");
  if (characterError) return characterError;
  return null;
}

/**
 * When office email is filled, it must be valid; empty is allowed.
 */
export function validateOptionalEmail(value: string): string | null {
  if (!value.trim()) return null;
  return validateEmail(value);
}

export function validateSearchQuery(value: string, maxLength = MAX_SEARCH_QUERY_LENGTH): string | null {
  if (value.length > maxLength) {
    return `Use at most ${maxLength} characters`;
  }
  return null;
}

export function validateStreetAddress(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_STREET_ADDRESS_LENGTH) {
    return "Address is too long";
  }
  return validateTextCharacters(trimmed, "address");
}

export function validatePdfPassword(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Password is required";
  if (trimmed.length > MAX_PDF_PASSWORD_LENGTH) {
    return "Password is too long";
  }
  return null;
}

/**
 * Partial / custom payment amount: positive number, optional upper bound (rupees).
 */
export function validatePositiveAmount(value: string, maxAmount?: number): string | null {
  const cleaned = value.trim().replace(/,/g, "");
  if (!cleaned) return "Enter an amount";
  const num = Number(cleaned);
  if (Number.isNaN(num) || num <= 0) return "Enter a valid amount greater than zero";
  if (maxAmount != null && num > maxAmount) {
    return `Amount cannot exceed ₹${maxAmount.toLocaleString("en-IN")}`;
  }
  return null;
}

export function validateTestUserId(value: string): string | null {
  const t = value.trim();
  if (!t) return "User ID is required";
  if (!/^\d+$/.test(t)) return "User ID must be a number";
  const n = Number(t);
  if (n < 1 || n > 10) return "Enter a user ID between 1 and 10";
  return null;
}

export type ReferenceMobileDistinctErrors = { ref2Mobile?: string; familyMobile?: string };

/**
 * Ensures reference and family mobiles are not all the same where applicable.
 */
export function validateReferenceMobilesDistinct(
  ref1Mobile: string,
  ref2Mobile: string,
  familyMobile: string
): ReferenceMobileDistinctErrors {
  const n1 = ref1Mobile.replace(/\D/g, "").slice(0, 10);
  const n2 = ref2Mobile.replace(/\D/g, "").slice(0, 10);
  const nf = familyMobile.replace(/\D/g, "").slice(0, 10);
  const out: ReferenceMobileDistinctErrors = {};
  if (n1.length === 10 && n2.length === 10 && n1 === n2) {
    out.ref2Mobile = "Use a different number for reference 2";
  }
  if (nf.length === 10) {
    if (nf === n1) out.familyMobile = "Family number must differ from reference 1";
    else if (nf === n2) out.familyMobile = "Family number must differ from reference 2";
  }
  return out;
}
