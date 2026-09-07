"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { usePopupCallbackMessageListener } from "@/hooks/usePopupCallbackMessageListener";
import type { CallbackFlow } from "@/lib/callback-opener-messages";

const DEFAULT_WATCH_MS = 500;
/** After popup `closed` is true, `postMessage` may still be queued on the opener. Clearing `popupRef` immediately breaks `usePopupCallbackMessageListener` source checks — wait this long before treating close as "no callback". */
const POPUP_CLOSE_POSTMESSAGE_GRACE_MS = 900;

export type ExternalFlowConsentLockControls = {
  locked: boolean;
  popupRef: RefObject<Window | null>;
  /** Sets overlay true and waits one animation frame so `window.open` runs after paint. */
  prepareOpenPopup: () => Promise<void>;
  /**
   * Stores the popup; if `null` (blocked), clears overlay and returns false.
   * On success returns true — caller should then call `startWatchPopupClosed`.
   */
  attachPopup: (win: Window | null) => boolean;
  startWatchPopupClosed: () => void;
  /** Clears interval, drops popup handle, hides overlay. Use when the step completes or abandons the lock. */
  releaseLock: () => void;
  clearCloseWatcher: () => void;
};

type UseExternalFlowConsentLockParams = {
  flow: CallbackFlow;
  onPostMessageComplete: () => void;
  onPopupClosedWithoutMessage: () => void;
  /**
   * When the user closes the popup without a completing postMessage:
   * - `true` (e-sign): overlay stays locked; only `onPopupClosedWithoutMessage` runs (e.g. start polling).
   * - `false` (DigiLocker, E-NACH): `releaseLock()` then `onPopupClosedWithoutMessage` (e.g. refetch).
   */
  overlayStaysLockedOnPopupClose?: boolean;
  /**
   * When a valid callback postMessage arrives:
   * - `false` (e-sign): only `onPostMessageComplete` runs (caller typically calls `releaseLock()` inside).
   * - `true` (DigiLocker, E-NACH): hook runs `releaseLock()` first, then `onPostMessageComplete`.
   */
  releaseLockWhenPostMessageArrives?: boolean;
  /**
   * While true, the popup-close watcher ignores `closed` (step finished via another path). E-sign only.
   * Omit for flows that always unlock when the popup closes.
   */
  terminalRef?: RefObject<boolean>;
  watchClosedPollMs?: number;
};

const noopTerminalRef = { current: false } as RefObject<boolean>;

/**
 * Shared pattern: full-screen consent overlay + `window.open` popup + poll for user closing the window
 * + postMessage completion from callback (e-sign, DigiLocker, E-NACH, …).
 */
export function useExternalFlowConsentLock({
  flow,
  onPostMessageComplete,
  onPopupClosedWithoutMessage,
  overlayStaysLockedOnPopupClose = true,
  releaseLockWhenPostMessageArrives = false,
  terminalRef,
  watchClosedPollMs = DEFAULT_WATCH_MS,
}: UseExternalFlowConsentLockParams): ExternalFlowConsentLockControls {
  const [locked, setLocked] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const watcherIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /** True once a valid ZAPCASH_CALLBACK_COMPLETE message was accepted (same browsing session as this flow). */
  const completedViaPostMessageRef = useRef(false);
  /** Deferred "user closed popup / no callback" work — cancelled if postMessage wins the race. */
  const pendingClosedGraceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolvedTerminalRef = terminalRef ?? noopTerminalRef;

  const onCompleteRef = useRef(onPostMessageComplete);
  const onClosedRef = useRef(onPopupClosedWithoutMessage);

  useLayoutEffect(() => {
    onCompleteRef.current = onPostMessageComplete;
    onClosedRef.current = onPopupClosedWithoutMessage;
  }, [onPostMessageComplete, onPopupClosedWithoutMessage]);

  const clearCloseWatcher = useCallback(() => {
    if (watcherIdRef.current != null) {
      clearInterval(watcherIdRef.current);
      watcherIdRef.current = null;
    }
  }, []);

  const releaseLock = useCallback(() => {
    if (pendingClosedGraceTimerRef.current != null) {
      clearTimeout(pendingClosedGraceTimerRef.current);
      pendingClosedGraceTimerRef.current = null;
    }
    clearCloseWatcher();
    popupRef.current = null;
    setLocked(false);
  }, [clearCloseWatcher]);

  const handleMessage = useCallback(() => {
    completedViaPostMessageRef.current = true;
    if (pendingClosedGraceTimerRef.current != null) {
      clearTimeout(pendingClosedGraceTimerRef.current);
      pendingClosedGraceTimerRef.current = null;
    }
    const w = popupRef.current;
    if (w && !w.closed) {
      w.close();
    }
    clearCloseWatcher();
    if (releaseLockWhenPostMessageArrives) {
      releaseLock();
    }
    console.log("[ExternalFlowConsentLock]", "postMessage_wins_race", { flow });
    onCompleteRef.current();
  }, [clearCloseWatcher, flow, releaseLock, releaseLockWhenPostMessageArrives]);

  usePopupCallbackMessageListener({
    flow,
    popupWindowRef: popupRef,
    onAccepted: handleMessage,
  });

  const startWatchPopupClosed = useCallback(() => {
    clearCloseWatcher();
    watcherIdRef.current = setInterval(() => {
      if (resolvedTerminalRef.current) {
        clearCloseWatcher();
        return;
      }
      const w = popupRef.current;
      if (w && w.closed) {
        clearCloseWatcher();
        if (overlayStaysLockedOnPopupClose) {
          // E-sign: keep overlay locked; only transition (e.g. polling).
          onClosedRef.current();
          return;
        }
        /*
         * DigiLocker / E-NACH: `window.close()` often runs in the same turn as `postMessage` scheduling.
         * If we `releaseLock()` here, we null `popupRef` before the opener handles the message —
         * `isMessageFromPopupWindow` fails and the success path never runs.
         * Hide the overlay immediately, but keep `popupRef` until grace elapses or postMessage fires.
         */
        setLocked(false);
        if (pendingClosedGraceTimerRef.current != null) {
          clearTimeout(pendingClosedGraceTimerRef.current);
        }
        pendingClosedGraceTimerRef.current = setTimeout(() => {
          pendingClosedGraceTimerRef.current = null;
          if (completedViaPostMessageRef.current) {
            completedViaPostMessageRef.current = false;
            return;
          }
          console.log("[ExternalFlowConsentLock]", "grace_expired_popup_closed_no_postMessage", {
            flow,
          });
          releaseLock();
          onClosedRef.current();
        }, POPUP_CLOSE_POSTMESSAGE_GRACE_MS);
      }
    }, watchClosedPollMs);
  }, [clearCloseWatcher, flow, overlayStaysLockedOnPopupClose, releaseLock, resolvedTerminalRef, watchClosedPollMs]);

  useEffect(() => () => clearCloseWatcher(), [clearCloseWatcher]);

  const prepareOpenPopup = useCallback(async () => {
    completedViaPostMessageRef.current = false;
    if (pendingClosedGraceTimerRef.current != null) {
      clearTimeout(pendingClosedGraceTimerRef.current);
      pendingClosedGraceTimerRef.current = null;
    }
    setLocked(true);
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }, []);

  const attachPopup = useCallback((win: Window | null) => {
    popupRef.current = win;
    if (!win) {
      setLocked(false);
      return false;
    }
    return true;
  }, []);

  return useMemo(
    () => ({
      locked,
      popupRef,
      prepareOpenPopup,
      attachPopup,
      startWatchPopupClosed,
      releaseLock,
      clearCloseWatcher,
    }),
    [
      locked,
      prepareOpenPopup,
      attachPopup,
      startWatchPopupClosed,
      releaseLock,
      clearCloseWatcher,
    ],
  );
}
