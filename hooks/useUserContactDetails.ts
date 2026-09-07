"use client";

import { useQuery } from "@tanstack/react-query";
import { getContactDetails } from "@/lib/user-api";

export const USER_CONTACT_DETAILS_QUERY_KEY = ["user", "contacts"] as const;

type Options = {
  enabled?: boolean;
};

export function useUserContactDetails(options: Options = {}) {
  const { enabled = true } = options;
  return useQuery({
    queryKey: USER_CONTACT_DETAILS_QUERY_KEY,
    queryFn: getContactDetails,
    enabled,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    retry: 1,
  });
}
