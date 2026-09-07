"use client";

import { useEffect, type RefObject } from "react";
import {
  CALLBACK_OPENER_MESSAGE_TYPE,
  type CallbackCompleteMessage,
  type CallbackFlow,
  isCallbackCompleteMessage,
} from "@/lib/callback-opener-messages";

type UsePopupCallbackMessageListenerParams = {
  flow: CallbackFlow;
  popupWindowRef: RefObject<Window | null>;
  onAccepted: (message: CallbackCompleteMessage) => void;
};

/** Accept postMessage from the popup shell or a same-origin frame inside it (e.g. nested iframe). */
function isMessageFromPopupWindow(event: MessageEvent, popup: Window | null): boolean {
  if (!popup || event.source == null) return false;
  if (event.source === popup) return true;
  try {
    const src = event.source as Window;
    return src.top === popup;
  } catch {
    return false;
  }
}

export function usePopupCallbackMessageListener({
  flow,
  popupWindowRef,
  onAccepted,
}: UsePopupCallbackMessageListenerParams): void {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (!isCallbackCompleteMessage(event.data)) {
        return;
      }

      if (event.data.type !== CALLBACK_OPENER_MESSAGE_TYPE || event.data.flow !== flow) {
        return;
      }

      if (!isMessageFromPopupWindow(event, popupWindowRef.current)) {
        return;
      }

      console.log("[CallbackOpener]", "message_accepted", {
        flow: event.data.flow,
        status: event.data.status,
      });
      onAccepted(event.data);
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [flow, onAccepted, popupWindowRef]);
}
