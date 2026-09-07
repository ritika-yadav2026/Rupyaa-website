import { STRING_CONSTANTS } from "@/utils/app-constants";

export type DesktopPlatform = "mac" | "windows";

export type AppDownloadConfig = {
  readonly platform: DesktopPlatform;
  readonly platformLabel: string;
  readonly storeLabel: string;
  readonly url: string;
};

const DOWNLOAD_CONFIG: Record<DesktopPlatform, AppDownloadConfig> = {
  mac: {
    platform: "mac",
    platformLabel: "Mac",
    storeLabel: "App Store",
    url: STRING_CONSTANTS.APP_STORE_URL,
  },
  windows: {
    platform: "windows",
    platformLabel: "Windows",
    storeLabel: "Google Play",
    url: STRING_CONSTANTS.PLAY_STORE_URL,
  },
};

export function getAppDownloadConfig(userAgent: string): AppDownloadConfig {
  const normalizedUserAgent = userAgent.toLowerCase();

  if (normalizedUserAgent.includes("macintosh") || normalizedUserAgent.includes("mac os")) {
    return DOWNLOAD_CONFIG.mac;
  }

  return DOWNLOAD_CONFIG.windows;
}

export const DEFAULT_APP_DOWNLOAD_CONFIG = DOWNLOAD_CONFIG.windows;
