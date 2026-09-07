'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isInMobileApp as checkIsInMobileApp,
  sendToApp as sendToAppOriginal,
  waitForWebViewBridge
} from '@/helpers/NativeHelper';

const BRIDGE_WAIT_MS = 1500;
const BRIDGE_POLL_MS = 50;

export interface UseNativeAppReturn {
  isInMobileApp: boolean;
  sendToApp: (type: string, payload: Record<string, unknown>) => void;
  logEvent: (type: string, payload: Record<string, unknown>) => void;
  logEventAndNotifyApp: (type: string, payload: Record<string, unknown>) => Promise<void>;
}

/**
 * Hook that exposes native app bridge methods only when running inside the mobile app WebView.
 * Methods no-op when not in the app. Resolves "in app" on mount (with optional bridge wait).
 */
export function useNativeApp(): UseNativeAppReturn {
  const [isInMobileApp, setIsInMobileApp] = useState(false);

  useEffect(() => {
    if (checkIsInMobileApp()) {
      setIsInMobileApp(true);
      return;
    }
    let cancelled = false;
    waitForWebViewBridge(BRIDGE_WAIT_MS, BRIDGE_POLL_MS).then((hasBridge) => {
      if (!cancelled && hasBridge) {
        setIsInMobileApp(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const sendToApp = useCallback(
    (type: string, payload: Record<string, unknown>): void => {
      if (!isInMobileApp) return;
      sendToAppOriginal(type, payload as Record<string, any>);
    },
    [isInMobileApp]
  );

  const logEvent = useCallback(
    (type: string, payload: Record<string, unknown>): void => {
      if (!isInMobileApp) return;
      sendToAppOriginal(type, payload as Record<string, any>);
      console.log('[NativeEvent]', type, payload);
    },
    [isInMobileApp]
  );

  const logEventAndNotifyApp = useCallback(
    async (type: string, payload: Record<string, unknown>): Promise<void> => {
      if (!isInMobileApp) return;
      console.log('[NativeEvent]', type, payload);
      sendToAppOriginal(type, payload as Record<string, any>);
    },
    [isInMobileApp]
  );

  return {
    isInMobileApp,
    sendToApp,
    logEvent,
    logEventAndNotifyApp,
  };
}
