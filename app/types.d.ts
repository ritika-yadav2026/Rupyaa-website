// Extend the Window interface to include dataLayer (for Google Tag Manager)
export {};

declare global {
  interface Window {
    dataLayer?: any[];
  }
}