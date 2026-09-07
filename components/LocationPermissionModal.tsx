"use client";

import { useEffect, useState, type ReactNode } from "react";
import { getLocationEnableSteps } from "@/lib/location-permission-guide";

type Props = {
  visible: boolean;
  isRequesting: boolean;
  error: string | null;
  permissionStatus: "checking" | "granted" | "denied" | "prompt";
  onAllow: () => void;
};

/**
 * Blocking modal that requires location permission before continuing.
 * Cannot be dismissed — user must allow location (or retry after denial).
 * On Try again, shows how to enable location for the site and re-requests the browser popup.
 */
export default function LocationPermissionModal({
  visible,
  isRequesting,
  error,
  permissionStatus,
  onAllow,
}: Props) {
  const [showEnableGuide, setShowEnableGuide] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowEnableGuide(false);
    }
  }, [visible]);

  if (!visible) return null;

  const isDenied = permissionStatus === "denied" || Boolean(error);
  const enableSteps = getLocationEnableSteps();

  let title = "Allow location access";
  let description =
    "We need your location to verify your application and continue with personal details. Please allow location access when prompted by your browser.";
  let buttonLabel = "Allow location";
  if (isDenied && !showEnableGuide) {
    title = "Location permission required";
    description =
      "Location access was denied. Tap Try Again for steps to enable location for this site and to show the permission popup again.";
    buttonLabel = "Try Again";
  }
  if (showEnableGuide) {
    title = "Enable location for this site";
    description =
      "Follow the steps below to allow location, then we will ask for permission again with the browser popup.";
    buttonLabel = "Try Again";
  }
  if (isRequesting) {
    buttonLabel = "Requesting…";
  }

  let errorMessage: ReactNode = null;
  if (error && !showEnableGuide) {
    errorMessage = (
      <p className="text-sm text-red-600 mb-4" role="alert">
        {error}
      </p>
    );
  }

  let guideSection: ReactNode = null;
  if (showEnableGuide) {
    guideSection = (
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left">
        <p className="text-sm font-semibold text-amber-900 mb-2">
          How to enable location
        </p>
        <ol className="list-decimal list-inside space-y-1.5 text-sm text-amber-950/90">
          {enableSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {error ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            Still blocked: {error}. Allow location in site settings, then tap Try Again.
          </p>
        ) : null}
      </div>
    );
  }

  const handlePrimaryClick = (): void => {
    if (isDenied) {
      setShowEnableGuide(true);
    }
    onAllow();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-permission-title"
      aria-describedby="location-permission-description"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 sm:p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path
              d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </div>
        <h2 id="location-permission-title" className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        <p id="location-permission-description" className="text-sm text-gray-600 mb-4">
          {description}
        </p>
        {errorMessage}
        {guideSection}
        <button
          type="button"
          onClick={handlePrimaryClick}
          disabled={isRequesting}
          className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
