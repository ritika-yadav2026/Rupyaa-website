import { create } from "zustand";
import type { GetCurrentOfferResponse } from "@/lib/eligibility-api";

export type CurrentOfferLastResult =
  | { kind: "success"; data: GetCurrentOfferResponse; at: number }
  | { kind: "error"; message: string; at: number };

type CurrentOfferState = {
  /** Null until first GET /offer/current completes (success or failure). */
  lastResult: CurrentOfferLastResult | null;
  setLastResult: (result: CurrentOfferLastResult | null) => void;
  clear: () => void;
};

export const useCurrentOfferStore = create<CurrentOfferState>((set) => ({
  lastResult: null,
  setLastResult: (result) => set({ lastResult: result }),
  clear: () => set({ lastResult: null }),
}));
