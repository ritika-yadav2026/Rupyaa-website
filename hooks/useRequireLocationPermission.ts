"use client";

import { useEffect, useState } from "react";
import { useGeoStore } from "@/store/useGeoStore";

type LocationPermissionStatus = "checking" | "granted" | "denied" | "prompt";

const PERMISSION_DENIED_ERROR = "Location permission denied";

/**
 * Requests browser geolocation for a screen.
 * Keeps blocking while permission is denied (user must enable it).
 * If permission is available but a fix cannot be obtained after retries,
 * allows the user to continue without location.
 */
export function useRequireLocationPermission() {
  const location = useGeoStore((s) => s.location);
  const error = useGeoStore((s) => s.error);
  const isRequesting = useGeoStore((s) => s.isRequesting);
  const hasSettled = useGeoStore((s) => s.hasSettled);
  const startWatching = useGeoStore((s) => s.startWatching);
  const restartWatching = useGeoStore((s) => s.restartWatching);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>("checking");

  useEffect(() => {
    startWatching();
  }, [startWatching]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.permissions?.query) {
      if (location) setPermissionStatus("granted");
      else if (error === PERMISSION_DENIED_ERROR) setPermissionStatus("denied");
      else if (error) setPermissionStatus("granted");
      else setPermissionStatus("prompt");
      return;
    }
    let cancelled = false;
    let permissionStatusHandle: PermissionStatus | null = null;
    const syncFromPermission = (state: PermissionState) => {
      if (cancelled) return;
      if (state === "granted") setPermissionStatus("granted");
      else if (state === "denied") setPermissionStatus("denied");
      else setPermissionStatus("prompt");
    };
    void navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (cancelled) return;
        permissionStatusHandle = result;
        syncFromPermission(result.state);
        result.onchange = () => syncFromPermission(result.state);
      })
      .catch(() => {
        if (cancelled) return;
        if (location) setPermissionStatus("granted");
        else if (error === PERMISSION_DENIED_ERROR) setPermissionStatus("denied");
        else if (error) setPermissionStatus("granted");
        else setPermissionStatus("prompt");
      });
    return () => {
      cancelled = true;
      if (permissionStatusHandle) permissionStatusHandle.onchange = null;
    };
  }, [location, error]);

  const hasLocation = location != null;
  const isPermissionDenied =
    permissionStatus === "denied" || error === PERMISSION_DENIED_ERROR;
  // Block while requesting, or whenever permission itself is denied.
  // After retries settle with permission available, allow continuing without coords.

  // Commented for now to allow the user to continue without location
  // const isBlocked = !hasLocation && (isPermissionDenied || !hasSettled);

  const isBlocked = false;

  const requestPermission = (): void => {
    restartWatching();
  };

  return {
    hasLocation,
    isBlocked,
    isRequesting,
    error,
    permissionStatus,
    location,
    requestPermission,
  };
}
