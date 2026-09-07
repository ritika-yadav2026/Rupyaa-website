"use client";

import { Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/components/ScrollToTop";
import { EncryptionStatusInit } from "@/components/EncryptionStatusInit";
import { MarketingAttributionPersistence } from "@/components/MarketingAttributionPersistence";
import { MicrosoftClarityAnalytics } from "@/components/MicrosoftClarityAnalytics";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <EncryptionStatusInit />
      <MicrosoftClarityAnalytics />
      <ScrollToTop />
      <Suspense fallback={null}>
        <MarketingAttributionPersistence />
      </Suspense>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "12px",
            padding: "12px 16px",
          },
        }}
      />
    </QueryClientProvider>
  );
}
