import type { Metadata } from "next";
import { SITE_URL } from "@/utils/app-constants";

export const metadata: Metadata = {
  alternates: {
    canonical: `${SITE_URL}/auth`,
  },
};

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
