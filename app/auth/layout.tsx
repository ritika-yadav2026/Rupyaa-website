import { seoMetadata } from "@/lib/seo-metadata";

export const metadata = seoMetadata.auth;

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
