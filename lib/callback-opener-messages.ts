import { isInMobileApp } from "@/helpers/NativeHelper";

/**
 * PostMessage contract for callback pages that notify `window.opener` when a flow completes.
 * Popup size and centered position for all external flows live in `open-external-flow-popup.ts`
 * (`openCenteredExternalFlowPopup`, `EXTERNAL_FLOW_POPUP_SIZE`).
 */

const CALLBACK_OPENER_LOG_PREFIX = "[CallbackOpener]";

export const CALLBACK_OPENER_MESSAGE_TYPE = "ZAPCASH_CALLBACK_COMPLETE";

export const CALLBACK_FLOWS = {
  BSA: "bsa",
  DIGILOCKER: "digilocker",
  ESIGN: "esign",
  ENACH: "enach",
  PAYMENT: "payment",
} as const;

export type CallbackFlow = (typeof CALLBACK_FLOWS)[keyof typeof CALLBACK_FLOWS];

export type CallbackCompleteMessage = {
  type: typeof CALLBACK_OPENER_MESSAGE_TYPE;
  flow: CallbackFlow;
  search: string;
  status?: string;
};

function buildSearchForLog(search: string): string {
  if (!search) return "";
  const maxLength = 120;
  if (search.length <= maxLength) return search;
  return `${search.slice(0, maxLength)}...`;
}

export function isCallbackCompleteMessage(data: unknown): data is CallbackCompleteMessage {
  if (!data || typeof data !== "object") return false;
  const message = data as Partial<CallbackCompleteMessage>;
  return (
    message.type === CALLBACK_OPENER_MESSAGE_TYPE &&
    typeof message.flow === "string" &&
    typeof message.search === "string" &&
    (typeof message.status === "string" || typeof message.status === "undefined")
  );
}

export function notifyOpenerCallbackComplete(params: {
  flow: CallbackFlow;
  search: string;
  status?: string;
}): void {
  const { flow, search, status } = params;

  console.log(CALLBACK_OPENER_LOG_PREFIX, "effect_start", {
    flow,
    search: buildSearchForLog(search),
  });

  if (typeof window === "undefined") {
    console.log(CALLBACK_OPENER_LOG_PREFIX, "skip_ssr", { flow });
    return;
  }

  if (isInMobileApp()) {
    console.log(CALLBACK_OPENER_LOG_PREFIX, "skip_in_mobile_webview", { flow });
    return;
  }

  const payload: CallbackCompleteMessage = {
    type: CALLBACK_OPENER_MESSAGE_TYPE,
    flow,
    search,
    status,
  };

  if (window.opener) {
    window.opener.postMessage(payload, window.location.origin);
    console.log(CALLBACK_OPENER_LOG_PREFIX, "postmessage_sent", {
      flow,
      targetOrigin: window.location.origin,
      hasStatus: Boolean(status),
    });
  } else {
    console.log(CALLBACK_OPENER_LOG_PREFIX, "skip_postmessage_no_opener", { flow });
  }

  window.close();
  console.log(CALLBACK_OPENER_LOG_PREFIX, "window_close_invoked", { flow });
}
