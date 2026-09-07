/**
 * Extends the Window interface to include React Native WebView
 * This allows TypeScript to recognize the WebView bridge object
 */
declare global {
    interface Window {
      ReactNativeWebView?: {
        postMessage: (message: string) => void;
      };
    }
  }
  
  /**
   * Sends messages to React Native app via WebView bridge
   * 
   * Messages are sent as JSON with { type, payload } structure
   * 
   * Example message types:
   * - AUTH_SUCCESS: Authentication succeeded
   * - AUTH_FAILED: Authentication failed
   * - USER_MISMATCH: Email mismatch detected
   * - TOKEN_EXPIRED: Token has expired
   * - WEBVIEW_READY: WebView is ready and authenticated
   * 
   * @param type - Message type identifier
   * @param payload - Message data as key-value pairs
   */
  export const sendToApp = (type: string, payload: Record<string, any>): void => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
    }
  };
  
  /**
   * Logs an event for mobile web and native app.
   * Sends to native app via WebView bridge when available; always logs to console for debugging.
   *
   * @param type - Event type identifier (e.g. DIGILOCKER_SUCCESS, BANK_STATEMENT_SUCCESS)
   * @param payload - Event data as key-value pairs
   */
  export const logEvent = (type: string, payload: Record<string, unknown>): void => {
    sendToApp(type, payload as Record<string, any>);
    console.log('[NativeEvent]', type, payload);
  };
  
  const WEBVIEW_BRIDGE_WAIT_MS = 1500;
  const WEBVIEW_BRIDGE_POLL_MS = 50;
  
  /**
   * Logs an event and notifies the native app when running in a WebView.
   * Uses isInMobileApp to send immediately when the bridge exists; otherwise waits for the
   * bridge via waitForWebViewBridge so the app does not miss the event. Always logs to console.
   *
   * @param type - Event type identifier (e.g. DIGILOCKER_SUCCESS, BANK_STATEMENT_SUCCESS)
   * @param payload - Event data as key-value pairs
   * @returns Promise<boolean> - true if message was sent to native app, false otherwise
   */
  export const logEventAndNotifyApp = async (
    type: string,
    payload: Record<string, unknown>
  ): Promise<boolean> => {
    console.log('[NativeEvent]', type, payload);
    if (isInMobileApp()) {
      sendToApp(type, payload as Record<string, any>);
      return true;
    }
    const hasBridge = await waitForWebViewBridge(WEBVIEW_BRIDGE_WAIT_MS, WEBVIEW_BRIDGE_POLL_MS);
    if (hasBridge) {
      sendToApp(type, payload as Record<string, any>);
      return true;
    }
    return false;
  };
  
  /**
   * Check if page is opened in mobile app WebView
   * 
   * Returns true if the ReactNativeWebView object exists on window
   * This is automatically injected by React Native WebView component
   * 
   * @returns boolean - true if running in mobile app WebView
   */
  export const isInMobileApp = (): boolean => {
    if (typeof window === 'undefined') return false;
    return typeof window.ReactNativeWebView !== 'undefined';
  };
  
  /**
   * Wait for ReactNativeWebView bridge to be available
   * 
   * React Native WebView injects the bridge object after page load.
   * Due to timing variations, it may not be immediately available when
   * React hydrates. This function polls for the bridge with a timeout.
   * 
   * @param timeoutMs - Maximum time to wait in milliseconds (default: 3000ms)
   * @param intervalMs - Polling interval in milliseconds (default: 100ms)
   * @returns Promise<boolean> - resolves to true if bridge found, false if timeout
   */
  export const waitForWebViewBridge = (
    timeoutMs: number = 3000,
    intervalMs: number = 100
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false);
        return;
      }
      if (window.ReactNativeWebView) {
        resolve(true);
        return;
      }
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (window.ReactNativeWebView) {
          clearInterval(checkInterval);
          resolve(true);
          return;
        }
        if (Date.now() - startTime >= timeoutMs) {
          clearInterval(checkInterval);
          console.log('WebView bridge not found after timeout');
          resolve(false);
        }
      }, intervalMs);
    });
  };
  
  
  export const getPayloadForWebViewMessage = (type: string, payload: Record<string, unknown>): Record<string, unknown> => {
    const webViewPayload = {
      type,
      payload,
      timestamp: Date.now(),
    };
    return webViewPayload;
  };
