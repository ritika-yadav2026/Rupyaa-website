"use client";

import { useEffect, type ReactElement } from "react";
import { useSearchParams } from "next/navigation";
import type { MarketingAttribution } from "@/lib/auth-api";
import {
  MarketingAttributionStorage,
  readAttributionFromSearchParams,
} from "@/lib/marketing-attribution-storage";

export function MarketingAttributionPersistence(): ReactElement {
  const searchParams = useSearchParams();

  useEffect(() => {
    const attribution: MarketingAttribution | undefined = readAttributionFromSearchParams(
      new URLSearchParams(searchParams.toString())
    );
    if (!attribution) return;
    MarketingAttributionStorage.persist(attribution);
  }, [searchParams]);

  return <></>;
}
