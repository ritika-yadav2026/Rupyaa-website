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
              "linear-gradient(180deg, #FFFCF4 0%, #FFF9EB 55%, #FFFFFF 100%)",
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(254,202,66,0.12) 0%, transparent 48%), radial-gradient(circle at 80% 80%, rgba(254,202,66,0.08) 0%, transparent 50%)",
          }}
        />
        <LendingPartnersSection />
      </SiteChrome>
    </>
  );
}
