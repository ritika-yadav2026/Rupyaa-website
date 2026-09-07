import { getSeoMetadata } from "@/lib/seo-metadata";
import GrievanceRedressalMechanismPage from "@/components/GrievanceRedressalMechanismPage";

export const generateMetadata = () =>
  getSeoMetadata("grievanceRedressalMechanism");

const page = () => {
  return <GrievanceRedressalMechanismPage />;
};

export default page;
