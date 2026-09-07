import { getSeoMetadata } from "@/lib/seo-metadata";
import TermsPage from "@/components/text";

export const generateMetadata = () => getSeoMetadata("terms");

const page = () => {
  return <TermsPage />;
};

export default page;
