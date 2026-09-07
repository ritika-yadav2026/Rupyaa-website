import { getSeoMetadata } from "@/lib/seo-metadata";
import RecoveryCollectionPolicyPage from "@/components/RecoveryCollectionPolicyPage";

export const generateMetadata = () => getSeoMetadata("recoveryCollectionPolicy");

const page = () => {
  return <RecoveryCollectionPolicyPage />;
};

export default page;
