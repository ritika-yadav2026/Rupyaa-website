/**
 * Single source of truth for externally opened consent / bridge windows (`window.open`).
 * All flows use {@link buildCenteredPopupFeatures}; sizes are grouped here by use-case.
 */
export const EXTERNAL_FLOW_POPUP_SIZE = {
  /**
   * E-sign (Doqfy), Cashfree E-NACH bridge, Google OAuth (via {@link runWithCenteredThirdPartyPopups}).
   * Change `width` / `height` once; those flows pick it up.
   */
  bridge: { width: 600, height: 700 },
  /**
   * DigiLocker + BSA consent — narrower than bridge flows.
   */
  consent: { width: 500, height: 700 },
} as const;

export type ExternalFlowPopupPreset = keyof typeof EXTERNAL_FLOW_POPUP_SIZE;

/**
 * Where the browser should anchor `left` / `top` before optional offsets:
 * - `"screen"`: center inside the OS work area (`screen.avail*`, taskbar-safe). Best for “true” screen center.
 * - `"opener"`: center over the parent window (`screenX` + half of `outerWidth`). Use if multi-monitor puts
 *   the popup on the wrong display, or if `"screen"` still feels wrong in your setup.
 *
 * Flip this constant to adjust without touching math.
 */
const POPUP_CENTER_STRATEGY: "screen" | "opener" = "screen";

/** Nudge position in pixels after centering (+ right / + down). */
const POPUP_POSITION_OFFSET_X = 0;
const POPUP_POSITION_OFFSET_Y = 0;

const GOOGLE_OAUTH_POPUP_URL_PATTERN = /accounts\.google\.com|\/o\/oauth2/i;

function hrefFromWindowOpenUrl(url?: string | URL): string {
  if (typeof url === "string") return url;
  if (url instanceof URL) return url.href;
  return "";
}

function isGoogleOAuthPopupUrl(href: string): boolean {
  return GOOGLE_OAUTH_POPUP_URL_PATTERN.test(href);
}

/**
 * Builds a `window.open` `features` string with `width`, `height`, and computed `left` / `top` so the new
 * window opens centered instead of using hard-coded coordinates (which break on wide or multi-monitor desktops).
 *
 * Prefer {@link openCenteredExternalFlowPopup} at call sites.
 *
 * Other tunables in this file: {@link POPUP_CENTER_STRATEGY}, {@link POPUP_POSITION_OFFSET_X},
 * {@link POPUP_POSITION_OFFSET_Y}.
 */
export function buildCenteredPopupFeatures(options: {
  width: number;
  height: number;
  resizable?: boolean;
  scrollbars?: boolean;
}): string {
  const { width, height, resizable = true, scrollbars = true } = options;
  const behavior = `resizable=${resizable ? "yes" : "no"},scrollbars=${scrollbars ? "yes" : "no"}`;

  if (typeof window === "undefined") {
    return `width=${width},height=${height},${behavior}`;
  }

  let left: number;
  let top: number;

  if (POPUP_CENTER_STRATEGY === "opener") {
    left = Math.round(window.screenX + (window.outerWidth - width) / 2);
    top = Math.round(window.screenY + (window.outerHeight - height) / 2);
  } else {
    const scr = window.screen as Screen & { availLeft?: number; availTop?: number };
    const availLeftEdge = typeof scr.availLeft === "number" ? scr.availLeft : 0;
    const availTopEdge = typeof scr.availTop === "number" ? scr.availTop : 0;
    left = availLeftEdge + Math.max(0, Math.floor((window.screen.availWidth - width) / 2));
    top = availTopEdge + Math.max(0, Math.floor((window.screen.availHeight - height) / 2));
  }

  left += POPUP_POSITION_OFFSET_X;
  top += POPUP_POSITION_OFFSET_Y;

  return `width=${width},height=${height},left=${left},top=${top},${behavior}`;
}

export type OpenExternalFlowPopupParams = {
  url: string;
  windowName: string;
  features: string;
};

/**
 * Opens a URL in a new browser window (or tab). Returns `null` if blocked or unavailable.
 */
export function openExternalFlowPopup({
  url,
  windowName,
  features,
}: OpenExternalFlowPopupParams): Window | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.open(url, windowName, features);
}

/**
 * Preferred API for DigiLocker, BSA, E-sign, E-NACH, etc. — centered popup using {@link EXTERNAL_FLOW_POPUP_SIZE}.
 */
export function openCenteredExternalFlowPopup(params: {
  url: string;
  windowName: string;
  preset?: ExternalFlowPopupPreset;
}): Window | null {
  const preset = params.preset ?? "bridge";
  return openExternalFlowPopup({
    url: params.url,
    windowName: params.windowName,
    features: buildCenteredPopupFeatures({ ...EXTERNAL_FLOW_POPUP_SIZE[preset] }),
  });
}

/**
 * Google Identity Services opens OAuth via its own `window.open` (no size/position hooks).
 * Wrap `login()` from `useGoogleLogin` so those popups use the same centered features as bridge flows.
 */
export function runWithCenteredThirdPartyPopups<T>(
  fn: () => T,
  preset: ExternalFlowPopupPreset = "bridge",
): T {
  if (typeof window === "undefined") {
    return fn();
  }

  const originalOpen = window.open;
  const centeredFeatures = buildCenteredPopupFeatures({ ...EXTERNAL_FLOW_POPUP_SIZE[preset] });

  window.open = function patchedOpen(url, target, features) {
    const href = hrefFromWindowOpenUrl(url);
    const nextFeatures = href && isGoogleOAuthPopupUrl(href) ? centeredFeatures : features;
    return originalOpen.call(window, url, target, nextFeatures);
  };

  try {
    return fn();
  } finally {
    window.open = originalOpen;
  }
}
