export type NormalizedBankStatementStatus =
  | "pending"
  | "in-progress"
  | "approved"
  | "processed"
  | "unknown"
  | "rejected";

export type BankConnectFlowScenario = "aa-flow" | "manual-upload";

export const BANK_CONNECT_RESOLUTION_INTERVAL_MS = 1000;
export const BANK_CONNECT_RESOLUTION_MAX_WAIT_MS = 60_000;
export const BANK_CONNECT_APPROVED_INTERVAL_MS = 5000;
export const BANK_CONNECT_PROCESSED_READINESS_INTERVAL_MS = 2500;
export const BANK_CONNECT_PROCESSED_READINESS_MAX_WAIT_MS = 20_000;
export const CHECKLIST_MIN_DURATION_PER_STEP_MS = 2000;
export const MIN_TERMINAL_STATUS_DELAY_MS =
  2 * CHECKLIST_MIN_DURATION_PER_STEP_MS;

export type BankConnectAttemptState =
  | "aa-only"
  | "aa-with-manual"
  | "manual-only"
  | "exhausted";

type AttemptsLeft = number | null;

export type BankConnectAttemptsLeft = {
  aaAttemptsLeft: AttemptsLeft;
  manualUploadAttemptsLeft: AttemptsLeft;
};

/** Searchable, PII-safe diagnostics for the Bank Connect controller and UI. */
export function logBankConnectDebug(
  event: string,
  details: Record<string, unknown>,
): void {
  if (process.env.NODE_ENV !== "development") return;
  console.info("[bank-connect]", `controller.${event}`, details);
}

type BankStatementAttemptPayload = {
  AAattemptsLeft?: unknown;
  aaAttemptsLeft?: unknown;
  manualUploadAttemptsLeft?: unknown;
};

function parseAttemptsLeft(value: unknown): AttemptsLeft {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

export function normalizeBankStatementStatus(value: unknown): NormalizedBankStatementStatus {
  if (typeof value !== "string" || value.trim().length === 0) return "unknown";
  const normalized = value.trim().toUpperCase().replace(/[\s_-]+/g, "");
  if (normalized === "PENDING") return "pending";
  if (normalized === "INPROGRESS") return "in-progress";
  // Backend may return the misspelled value "Aprroved".
  if (normalized === "APPROVED" || normalized === "APRROVED") return "approved";
  if (normalized === "PROCESSED") return "processed";
  if (normalized === "REJECTED") return "rejected";
  return "unknown";
}

export function resolveAaAttemptsLeft(payload: BankStatementAttemptPayload | undefined): AttemptsLeft {
  return parseAttemptsLeft(payload?.AAattemptsLeft ?? payload?.aaAttemptsLeft);
}

export function resolveManualUploadAttemptsLeft(
  payload: BankStatementAttemptPayload | undefined
): AttemptsLeft {
  return parseAttemptsLeft(payload?.manualUploadAttemptsLeft);
}

/**
 * Derives which BSA options to show based on attempt counts from getUserBankStatementStatus.
 * Missing attempt counts are treated as unavailable, except a fully missing response
 * defaults to AA-only while the initial status request is unresolved.
 */
export function resolveBankConnectAttemptState(
  attempts: BankConnectAttemptsLeft
): BankConnectAttemptState {
  const aaLeft = attempts.aaAttemptsLeft;
  const manualLeft = attempts.manualUploadAttemptsLeft;

  const aaAvailable = aaLeft != null && aaLeft > 0;
  const manualAvailable = manualLeft != null && manualLeft > 0;

  if (aaAvailable && manualAvailable) return 'aa-with-manual';
  if (aaAvailable) return 'aa-only';
  if (manualAvailable) return 'manual-only';
  if (aaLeft == null && manualLeft == null) return 'aa-only';
  return 'exhausted';
}

export function getBankConnectPollingConfig(scenario: BankConnectFlowScenario) {
  return {
    intervalMs: BANK_CONNECT_RESOLUTION_INTERVAL_MS,
    maxAttempts:
      BANK_CONNECT_RESOLUTION_MAX_WAIT_MS / BANK_CONNECT_RESOLUTION_INTERVAL_MS,
    scenario,
  } as const;
}

/** Shape of `bankStatementKey` from GET bank-statement/status (matches bank-statement-api). */
export type BankStatementKeyPayload = Record<string, unknown>;

/** True when status includes `bankStatementKey` as an object (not missing / null / non-object). */
export function hasBankStatementKeyData(key?: BankStatementKeyPayload | Record<string, unknown> | null): boolean {
  return (
    key != null &&
    typeof key === "object" &&
    !Array.isArray(key) &&
    Boolean(key.json) &&
    Boolean(key.bsaReport)
  );
}

/** Statuses that are still being processed and should be checked again on the next polling tick. */
export function shouldContinueBankStatementPolling(
  status: NormalizedBankStatementStatus,
): boolean {
  return status === "pending" || status === "in-progress";
}

export function shouldStopPolling(
  status: NormalizedBankStatementStatus,
  hasBankStatementKeyData: boolean
): boolean {
  if (status === "rejected") return true;
  if (status === "processed" && hasBankStatementKeyData) return true;
  if (status === "unknown") return true;
  if (shouldContinueBankStatementPolling(status)) return false;
  return false;
}

/** Minimal GET /user/bank-statement/status shape for terminal checks (avoids circular imports). */
export type BankStatementStatusResponseLike = {
  bankStatementStatus?: unknown;
  status?: unknown;
  bankStatementKey?: BankStatementKeyPayload | null;
};

/**
 * True when status is stable enough to stop polling and reuse cached GET /status
 * (processed or approved with a valid `bankStatementKey`).
 */
export function isTerminalBankStatementStatusResponse(
  res: BankStatementStatusResponseLike,
): boolean {
  const rawStatus = res.bankStatementStatus ?? res.status;
  const norm = normalizeBankStatementStatus(rawStatus);
  const hasKey = hasBankStatementKeyData(res.bankStatementKey);
  return (norm === "processed" || norm === "approved") && hasKey;
}
