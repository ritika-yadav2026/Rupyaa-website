"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserBankStatementStatus,
  type BankStatementKey,
  type BankStatementStatus,
  type GetUserBankStatementStatusResponse,
} from "@/lib/bank-statement-api";
import {
  BANK_CONNECT_APPROVED_INTERVAL_MS,
  BANK_CONNECT_PROCESSED_READINESS_INTERVAL_MS,
  BANK_CONNECT_PROCESSED_READINESS_MAX_WAIT_MS,
  BANK_CONNECT_RESOLUTION_INTERVAL_MS,
  BANK_CONNECT_RESOLUTION_MAX_WAIT_MS,
  hasBankStatementKeyData,
  normalizeBankStatementStatus,
  resolveAaAttemptsLeft,
  resolveManualUploadAttemptsLeft,
  shouldStopPolling,
  type BankConnectFlowScenario,
  type NormalizedBankStatementStatus,
} from "@/lib/bank-connect";

export const BANK_STATEMENT_STATUS_QUERY_KEY = [
  "user",
  "bankStatementStatus",
] as const;

export type BankStatementStatusSource =
  | "step-entry"
  | "webview-success"
  | "webview-close"
  | "manual-upload-success"
  | "pending-poll"
  | "processed-readiness"
  | "attempt-refresh";

export type BankStatementStatusEvent = {
  source: BankStatementStatusSource;
  status: NormalizedBankStatementStatus;
  response: GetUserBankStatementStatusResponse;
};

type PollOptions = {
  scenario?: BankConnectFlowScenario;
  useStopRules?: boolean;
};

export type BankStatementStatusCallback = (
  status: BankStatementStatus,
  callApplyLoan: boolean,
  bankStatementKey?: BankStatementKey,
  normalizedStatus?: NormalizedBankStatementStatus,
  fullResponse?: GetUserBankStatementStatusResponse,
) => void;

function logBsaPolling(event: string, details: Record<string, unknown>): void {
  if (process.env.NODE_ENV !== "development") return;
  console.info("[bank-connect]", `bsaPolling.${event}`, details);
}

export function useBankStatementStatus(options?: {
  onStatusResolved?: (event: BankStatementStatusEvent) => void;
}) {
  const queryClient = useQueryClient();
  const callbackRef = useRef(options?.onStatusResolved);
  const runIdRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const [isPolling, setIsPolling] = useState(false);

  callbackRef.current = options?.onStatusResolved;

  const query = useQuery({
    queryKey: BANK_STATEMENT_STATUS_QUERY_KEY,
    queryFn: getUserBankStatementStatus,
    enabled: false,
    // always fresh data, never stale
    staleTime: 0,
  });

  const stopPolling = useCallback((reason = "cancelled") => {
    runIdRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    if (mountedRef.current) setIsPolling(false);
    logBsaPolling("approvedStop", { reason });
  }, []);

  const fetchWithSource = useCallback(
    async (
      source: BankStatementStatusSource,
      fetchOptions: { notify?: boolean } = {},
    ): Promise<BankStatementStatusEvent> => {
      const startedAt = Date.now();
      let response: GetUserBankStatementStatusResponse;
      try {
        response = await getUserBankStatementStatus();
      } catch (error) {
        logBsaPolling("fetchResult", {
          source,
          status: "unknown",
          success: false,
          reason:
            error instanceof Error ? error.message : "status-request-failed",
          elapsedMs: Date.now() - startedAt,
        });
        throw error;
      }
      const status = normalizeBankStatementStatus(
        response.bankStatementStatus ?? response.status,
      );

      // All status reads update one cache, including internal readiness checks.
      queryClient.setQueryData(BANK_STATEMENT_STATUS_QUERY_KEY, response);
      logBsaPolling("fetchResult", {
        source,
        status,
        success: true,
        aaAttemptsLeft: resolveAaAttemptsLeft(response),
        manualUploadAttemptsLeft: resolveManualUploadAttemptsLeft(response),
        elapsedMs: Date.now() - startedAt,
      });

      const event = { source, status, response };
      if (fetchOptions.notify !== false) {
        logBsaPolling("notifyController", { source, status });
        callbackRef.current?.(event);
      }
      return event;
    },
    [queryClient],
  );

  const pollBankStatementStatus = useCallback(
    (onStatus: BankStatementStatusCallback, pollOptions: PollOptions = {}) => {
      stopPolling("replaced");
      const runId = runIdRef.current + 1;
      runIdRef.current = runId;
      const startedAt = Date.now();
      let readinessStartedAt: number | null = null;
      setIsPolling(true);
      const label = pollOptions.scenario ?? "legacy";
      logBsaPolling(`resolution.${label}.start`, { runId });

      const tick = async (): Promise<void> => {
        if (runIdRef.current !== runId) return;
        try {
          const source: BankStatementStatusSource = readinessStartedAt
            ? "processed-readiness"
            : "pending-poll";
          // Do not notify during readiness: it runs inside the processed handler.
          // Notifying would recursively start the processed handler again.
          const event = await fetchWithSource(source, {
            notify: source !== "processed-readiness",
          });
          if (runIdRef.current !== runId) return;
          const response = event.response;
          const raw =
            response.bankStatementStatus ??
            (response.status as BankStatementStatus | undefined) ??
            "Pending";
          const hasKey = hasBankStatementKeyData(response.bankStatementKey);
          onStatus(raw, response.callApplyLoan, response.bankStatementKey, event.status, response);
          if (runIdRef.current !== runId) return;

          if (pollOptions.useStopRules && shouldStopPolling(event.status, hasKey)) {
            stopPolling(`status=${event.status}`);
            return;
          }

          let delayMs = BANK_CONNECT_RESOLUTION_INTERVAL_MS;
          if (event.status === "approved") {
            delayMs = BANK_CONNECT_APPROVED_INTERVAL_MS;
          } else if (event.status === "processed" && !hasKey) {
            readinessStartedAt ??= Date.now();
            if (response.callApplyLoan) {
              stopPolling("callApplyLoan=true");
              return;
            }
            if (Date.now() - readinessStartedAt >= BANK_CONNECT_PROCESSED_READINESS_MAX_WAIT_MS) {
              onStatus("Error", false);
              stopPolling("processed-readiness-timeout");
              return;
            }
            delayMs = BANK_CONNECT_PROCESSED_READINESS_INTERVAL_MS;
          } else if (Date.now() - startedAt >= BANK_CONNECT_RESOLUTION_MAX_WAIT_MS) {
            onStatus("Error", false);
            stopPolling("resolution-timeout");
            return;
          }

          // Schedule after the request settles instead of using setInterval,
          // preventing overlapping requests on slow connections.
          timerRef.current = setTimeout(() => void tick(), delayMs);
        } catch {
          if (runIdRef.current !== runId) return;
          onStatus("Error", false, undefined, "unknown");
          stopPolling("request-failed");
        }
      };

      void tick();
      return () => {
        if (runIdRef.current === runId) stopPolling("cancelled");
      };
    },
    [fetchWithSource, stopPolling],
  );

  const clearStatus = useCallback(() => {
    stopPolling("status-cleared");
    queryClient.removeQueries({ queryKey: BANK_STATEMENT_STATUS_QUERY_KEY, exact: true });
  }, [queryClient, stopPolling]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      runIdRef.current += 1;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    bankStatementResponse: query.data,
    bankStatementStatus: query.data
      ? normalizeBankStatementStatus(query.data.bankStatementStatus ?? query.data.status)
      : undefined,
    isPolling,
    refetchWithSource: fetchWithSource,
    pollBankStatementStatus,
    stopPolling,
    clearStatus,
  };
}
