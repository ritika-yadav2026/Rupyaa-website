"use client";

import LoanWizard from "@/components/LoanWizard";
import GuestDashboardLanding from "@/components/GuestDashboardLanding";
import ZapcashLoading from "@/components/ZapcashLoading";
import { useAuthLoggedInHint } from "@/hooks/use-auth-logged-in-hint";

export default function PersonalLoanPageClient() {
  const { isLoggedIn, isPending } = useAuthLoggedInHint();

  if (isPending) {
    return (
      <div className="min-h-[50vh] w-full flex flex-col items-center justify-center">
        <ZapcashLoading />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <GuestDashboardLanding />;
  }

  return <LoanWizard />;
}
