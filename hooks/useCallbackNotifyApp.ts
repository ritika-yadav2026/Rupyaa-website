'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  logEventAndNotifyApp,
  getPayloadForWebViewMessage,
} from '@/helpers/NativeHelper';

const VALID_SOURCE_MOBILE = 'mobile';

export interface UseCallbackNotifyAppOptions {
  messageType: string;
}

export interface UseCallbackNotifyAppReturn {
  isRedirecting: boolean;
  isMobileSource: boolean;
}

/**
 * Handles native app notification for callback pages (DigiLocker, eSign, eNACH, BSA).
 * Uses NativeHelper's logEventAndNotifyApp which waits for the WebView bridge,
 * and only shows redirecting UI when the message was successfully sent.
 */
export function useCallbackNotifyApp({
  messageType,
}: UseCallbackNotifyAppOptions): UseCallbackNotifyAppReturn {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const params = searchParams.toString();
    const isValidMobileSource = source === VALID_SOURCE_MOBILE;

    if (!isValidMobileSource || !params) {
      return;
    }
 
    const payload = getPayloadForWebViewMessage(messageType, {
      source: source ?? undefined,
      params: params || undefined,
    });

    void logEventAndNotifyApp(messageType, payload).then((wasSent) => {
      if (wasSent) {
        setIsRedirecting(true);
      }
    });
  }, [searchParams, source, messageType]);

  return {
    isRedirecting,
    isMobileSource: source === VALID_SOURCE_MOBILE,
  };
}
