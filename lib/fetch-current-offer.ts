import { normalizeBackendStage } from "@/config/stageMapping";
import { isPendingOfferStatusForUnderReview } from "@/helpers/loan-helper";
import { getFiniteOfferAmount } from "@/lib/bsa-processed-offer";
import { getCurrentOffer } from "@/lib/eligibility-api";
import { logOfferCurrentEvent } from "@/lib/offer-current-debug";
import { useCurrentOfferStore } from "@/store/useCurrentOfferStore";
import { useFlowStore } from "@/store/useFlowStore";

const DEDUP_MS = 1500;

let inFlight: Promise<{ ok: boolean }> | null = null;

/**
 * Loads GET /offer/current for the approved-offer screen only when backend stage is OFFERINGS
 * and the offer is not pending under review. Skips when the store is already hydrated.
 */
export async function ensureCurrentOfferForApprovedStep(options?: {
  from?: string;
}): Promise<void> {
  const from = options?.from ?? "ensureCurrentOfferForApprovedStep";
  const flow = useFlowStore.getState();
  const stage = flow.userStageResponse?.stage;
  const stageNorm = stage ? normalizeBackendStage(stage) : "";

  if (stageNorm !== "OFFERINGS") {
    logOfferCurrentEvent("ensureCurrentOfferForApprovedStep → skip (not OFFERINGS)", {
      from,
      stage: stage ?? null,
    });
    return;
  }

  if (isPendingOfferStatusForUnderReview(flow.userStageResponse?.context?.offerStatus)) {
    logOfferCurrentEvent("ensureCurrentOfferForApprovedStep → skip (pending under review)", {
      from,
    });
    return;
  }

  const last = useCurrentOfferStore.getState().lastResult;
  if (last !== null) {
    logOfferCurrentEvent("ensureCurrentOfferForApprovedStep → skip (lastResult set)", {
      from,
      kind: last.kind,
    });
    return;
  }

  logOfferCurrentEvent("ensureCurrentOfferForApprovedStep → scheduling fetch", { from });
  await fetchCurrentOfferForBankStatement({ from });
}

/**
 * Fetches GET /offer/current, updates {@link useCurrentOfferStore} and flow offer fields.
 * Dedupes concurrent calls and skips duplicate refresh within ~1500 ms after a successful response.
 * Does not sync user stage (navigation stability — same as native ApprovedOfferStep).
 */
export async function fetchCurrentOfferForBankStatement(options?: {
  /** Bypass short-window dedupe after success (explicit user refresh). */
  force?: boolean;
  /** Caller label for debug logs (e.g. `useApprovedOfferStep:mount`). */
  from?: string;
}): Promise<{ ok: boolean }> {
  const from = options?.from ?? "fetchCurrentOfferForBankStatement";

  if (inFlight) {
    logOfferCurrentEvent("fetchCurrentOfferForBankStatement → reuse inFlight", { from });
    return inFlight;
  }

  const store = useCurrentOfferStore.getState();
  const now = Date.now();
  const last = store.lastResult;
  if (
    !options?.force &&
    last?.kind === "success" &&
    now - last.at < DEDUP_MS
  ) {
    logOfferCurrentEvent("fetchCurrentOfferForBankStatement → skipped (recent success)", {
      from,
      ageMs: now - last.at,
      dedupMs: DEDUP_MS,
    });
    return Promise.resolve({ ok: true });
  }

  logOfferCurrentEvent("fetchCurrentOfferForBankStatement → starting network", {
    from,
    force: Boolean(options?.force),
    lastResultKind: last?.kind ?? null,
  });

  inFlight = (async (): Promise<{ ok: boolean }> => {
    try {
      const data = await getCurrentOffer(`fetch-current-offer.ts ← ${from}`);
      const at = Date.now();
      useCurrentOfferStore.getState().setLastResult({ kind: "success", data, at });
      const flow = useFlowStore.getState();
      const amt = getFiniteOfferAmount(data.offer);
      flow.setOfferAmount(amt != null ? amt : null);
      flow.setShowUpdateButton(data.showUpdateButton ?? false);
      logOfferCurrentEvent("fetchCurrentOfferForBankStatement → success", { from });
      return { ok: true };
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Unable to load offer. Please try again.";
      useCurrentOfferStore.getState().setLastResult({
        kind: "error",
        message,
        at: Date.now(),
      });
      const flow = useFlowStore.getState();
      flow.setOfferAmount(null);
      flow.setShowUpdateButton(false);
      logOfferCurrentEvent("fetchCurrentOfferForBankStatement → error", {
        from,
        message,
      });
      return { ok: false };
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}
