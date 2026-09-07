"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_APP_DOWNLOAD_CONFIG,
  getAppDownloadConfig,
  type AppDownloadConfig,
} from "@/utils/app-download";

export function useAppDownload(): AppDownloadConfig {
  return useSyncExternalStore(
    subscribeToPlatform,
    getBrowserDownloadConfig,
    getServerDownloadConfig,
  );
}

function subscribeToPlatform(): () => void {
  return () => undefined;
}

function getBrowserDownloadConfig(): AppDownloadConfig {
  return getAppDownloadConfig(window.navigator.userAgent);
}

function getServerDownloadConfig(): AppDownloadConfig {
  return DEFAULT_APP_DOWNLOAD_CONFIG;
}
