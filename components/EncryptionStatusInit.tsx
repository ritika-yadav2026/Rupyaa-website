"use client";

import { useEffect } from "react";
import { getEncryptionEnabled } from "@/lib/api-encryption";

/**
 * Pre-fetches encryption status from GET /api/v1/external/encryption on app load.
 * Ensures the first API call does not wait for the encryption status fetch.
 */
export function EncryptionStatusInit() {
  useEffect(() => {
    void getEncryptionEnabled();
  }, []);
  return null;
}
