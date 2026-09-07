import { normalizeSalaryAccountSuffix } from "@/utils/mapSalaryAccountsResponse";

/** Returns the last 4 digits of the entered account number after stripping non-digits. */
export function getAccountLastFourDigits(accountNumber: string): string {
  const digits = accountNumber.replace(/\D/g, "");
  return digits.slice(-4);
}

/**
 * Checks whether the entered account number matches any of the configured
 * salary account suffixes. When the suffix list is empty (e.g. backend returned
 * nothing or salary validation is disabled), the entered account is accepted.
 */
export function isEnteredAccountSalaryMatch(
  accountNumber: string,
  salaryAccounts: string[]
): boolean {
  if (salaryAccounts.length === 0) return true;

  const enteredLastFour = getAccountLastFourDigits(accountNumber);
  if (enteredLastFour.length < 4) return false;

  const normalizedSuffixes = salaryAccounts
    .map(normalizeSalaryAccountSuffix)
    .filter((item): item is string => item !== null);

  return normalizedSuffixes.some((suffix) => suffix === enteredLastFour);
}
