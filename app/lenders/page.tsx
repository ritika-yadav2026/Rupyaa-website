import SiteChrome from "@/components/SiteChrome";
import LendingPartnersSection from "@/components/lending-partners/lending-partners-section";
import { lendersPageSchema } from "@/lib/SEO-JSON-schema";
import { getSeoMetadata } from "@/lib/seo-metadata";

export const generateMetadata = () => getSeoMetadata("lenders");

export default async function LendingPartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const params = await searchParams;
  const isMobileSource = params?.source === "mobile";

  return (
    <>
      <script
        id="zapcash-lenders-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(lendersPageSchema).replace(/</g, "\\u003c"),
        }}
      />
      <SiteChrome
        hideChrome={isMobileSource}
        className="relative min-h-screen overflow-x-hidden bg-white"
      >
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #f3fbf5 0%, #f4fbf5 55%, #f8fcf8 100%)",
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.25]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(0,101,37,0.04) 0%, transparent 48%), radial-gradient(circle at 80% 80%, rgba(34,197,94,0.03) 0%, transparent 50%)",
          }}
        />
        <LendingPartnersSection />
      </SiteChrome>
    </>
  );
}
