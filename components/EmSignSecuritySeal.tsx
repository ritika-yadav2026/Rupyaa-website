"use client";

import { useSyncExternalStore } from "react";

const PRODUCTION_HOSTNAMES = new Set([
  "zapcash.in",
  "www.zapcash.in",
  "staging.zapcash.in",
  // Temporary: allow local rendering for UI verification.
  // Seal "verification" isn't meaningful on localhost due to TLS/domain mismatch.
  "localhost",
  "127.0.0.1",
]);

function subscribeToHostname() {
  return () => {};
}

function getHostnameSnapshot() {
  return PRODUCTION_HOSTNAMES.has(window.location.hostname);
}

function getServerHostnameSnapshot() {
  return false;
}

export default function EmSignSecuritySeal() {
  const showSeal = useSyncExternalStore(
    subscribeToHostname,
    getHostnameSnapshot,
    getServerHostnameSnapshot
  );

  if (!showSeal) {
    return null;
  }

  return (
    <div className="emudhra-security-seal">
      <iframe
        title="emSign security seal"
        src="/emsign-seal.html"
        width="175"
        height="100"
        scrolling="no"
        className="block border-0"
        style={{ overflow: "hidden" }}
      />
    </div>
  );
}
