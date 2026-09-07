import { getSeoMetadata } from "@/lib/seo-metadata";
import SupportPage from "@/components/SupportPage";
import { supportPageSchema } from "@/lib/SEO-JSON-schema";

export const generateMetadata = () => getSeoMetadata("support");



const page = () => {
  return (
    <>
      <script
        id="zapcash-support-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(supportPageSchema).replace(/</g, "\\u003c"),
        }}
      />
      <SupportPage />
    </>
  );
};

export default page;
