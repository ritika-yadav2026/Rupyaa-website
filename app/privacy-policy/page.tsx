import { getSeoMetadata } from "@/lib/seo-metadata";
import PrivacyPolicyPage from "@/components/PrivacyPolicyPage";

export const generateMetadata = () => getSeoMetadata("privacyPolicy");

const page = () => {
  return <PrivacyPolicyPage />;
};

export default page;
