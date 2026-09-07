import { create } from "zustand";

type GeoLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
};

type GeoState = {
  location: GeoLocation | null;
  error: string | null;
  isWatching: boolean;
  isRequesting: boolean;
  /** True after success or after all retries finished without a fix. */
  hasSettled: boolean;
};

type GeoActions = {
  setLocation: (location: GeoLocation | null) => void;
  setError: (error: string | null) => void;
  startWatching: () => void;
  /** Clears any active watch and requests location again (for retry after denial). */
  restartWatching: () => void;
  stopWatching: () => void;
};

type GeoAttempt = {
  readonly delayBeforeMs: number;
  readonly options: PositionOptions;
};

let watchId: number | null = null;
let activeSessionId = 0;

/**
 * Staggered attempts help macOS Core Location recover from kCLErrorLocationUnknown
 * (permission granted, but fix not ready yet).
 */
const GEO_ATTEMPTS: readonly GeoAttempt[] = [
  {
    delayBeforeMs: 0,
    options: { enableHighAccuracy: false, timeout: 25_000, maximumAge: 60_000 },
  },
  {
    delayBeforeMs: 2_000,
    options: { enableHighAccuracy: false, timeout: 35_000, maximumAge: 2 * 60_000 },
  },
  {
    delayBeforeMs: 3_000,
    options: { enableHighAccuracy: false, timeout: 45_000, maximumAge: 5 * 60_000 },
  },
  {
    delayBeforeMs: 4_000,
    options: { enableHighAccuracy: true, timeout: 60_000, maximumAge: 0 },
  },
] as const;

const WATCH_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 120_000,
  maximumAge: 60_000,
};

/** Extra wait after getCurrentPosition retries so watchPosition can still resolve. */
const WATCH_GRACE_MS = 8_000;

function clearActiveWatch(): void {
  if (watchId !== null && typeof navigator !== "undefined") {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

function mapGeoError(err: GeolocationPositionError): string {
  if (err.code === 1) return "Location permission denied";
  if (err.code === 2) return "Location unavailable";
  if (err.code === 3) return "Location request timed out";
  return "Failed to get location";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function requestCurrentPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function beginWatching(
  set: (partial: Partial<GeoState>) => void,
  get: () => GeoState
): void {
  if (typeof window === "undefined" || !navigator.geolocation) {
    set({
      error: "Geolocation is not supported",
      isRequesting: false,
      isWatching: false,
      hasSettled: true,
    });
    return;
  }
  const sessionId = ++activeSessionId;
  const isActive = (): boolean => sessionId === activeSessionId;
  const onSuccess = (position: GeolocationPosition): void => {
    if (!isActive()) return;
    set({
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy ?? null,
        timestamp: position.timestamp,
      },
      error: null,
      isWatching: true,
      isRequesting: false,
      hasSettled: true,
    });
  };
  const settleWithoutLocation = (errorMessage: string | null): void => {
    if (!isActive()) return;
    set({
      error: errorMessage,
      isRequesting: false,
      hasSettled: true,
    });
  };
  const onPermissionDenied = (err: GeolocationPositionError): void => {
    if (!isActive()) return;
    set({
      error: mapGeoError(err),
      location: null,
      isRequesting: false,
      hasSettled: true,
    });
  };
  set({ isWatching: true, isRequesting: true, error: null, hasSettled: false });
  watchId = navigator.geolocation.watchPosition(
    onSuccess,
    (err) => {
      if (!isActive()) return;
      if (err.code === 1) onPermissionDenied(err);
    },
    WATCH_OPTIONS
  );
  void (async () => {
    let lastError: GeolocationPositionError | null = null;
    for (const attempt of GEO_ATTEMPTS) {
      if (!isActive()) return;
      if (get().location) return;
      if (attempt.delayBeforeMs > 0) {
        await sleep(attempt.delayBeforeMs);
      }
      if (!isActive()) return;
      if (get().location) return;
      try {
        const position = await requestCurrentPosition(attempt.options);
        onSuccess(position);
        return;
      } catch (err) {
        const geoError = err as GeolocationPositionError;
        lastError = geoError;
        if (geoError.code === 1) {
          onPermissionDenied(geoError);
          return;
        }
      }
    }
    if (!isActive()) return;
    if (get().location) return;
    await sleep(WATCH_GRACE_MS);
    if (!isActive()) return;
    if (get().location) {
      set({ isRequesting: false, error: null, hasSettled: true });
      return;
    }
    settleWithoutLocation(lastError ? mapGeoError(lastError) : "Failed to get location");
  })();
}

export const useGeoStore = create<GeoState & GeoActions>((set, get) => ({
  location: null,
  error: null,
  isWatching: false,
  isRequesting: false,
  hasSettled: false,
  setLocation: (location) => set({ location, error: null, hasSettled: true }),
  setError: (error) => set({ error, location: null }),
  startWatching: () => {
    if (watchId !== null) return;
    beginWatching(set, get);
  },
  restartWatching: () => {
    activeSessionId += 1;
    clearActiveWatch();
    set({ isWatching: false, location: null, error: null, isRequesting: true, hasSettled: false });
    beginWatching(set, get);
  },
  stopWatching: () => {
    activeSessionId += 1;
    clearActiveWatch();
    set({
      isWatching: false,
      location: null,
      error: null,
      isRequesting: false,
      hasSettled: false,
    });
  },
}));
