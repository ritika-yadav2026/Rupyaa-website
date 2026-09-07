"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPersonalDetails } from "@/lib/user-api";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import { useGetExistingActiveLoan } from "@/services/loans/useGetExistingActiveLoan";
import {
  getCanCancelFromActiveLoanResponse,
  getLoanIdFromActiveLoanResponse,
} from "@/services/loans";
import { useUserStage } from "@/hooks/useUserStage";
import { useAuthLoggedInHint } from "@/hooks/use-auth-logged-in-hint";
import LoanCancellationModal from "@/components/LoanCancellationModal";
import { HeroLoggedOutForm } from "@/components/home/hero-section/HeroLoggedOutForm";
import { HeroLoggedInContent } from "@/components/home/hero-section/HeroLoggedInContent";
import { HeroLoggedOut } from "./HeroLoggedOut";
import { REACT_QUERY_KEYS } from "@/utils/app-constants";

export default function HeroSection() {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuthLoggedInHint();

  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState<string | null>(null);

  const { data: personalDetails } = useQuery({
    queryKey: [REACT_QUERY_KEYS.PERSONAL_DETAILS],
    queryFn: getPersonalDetails,
    enabled: isLoggedIn,
  });

  const userStageQuery = useUserStage({ enabled: isLoggedIn });
  const { data: userStage, isLoading: isLoadingStage, isFetching: isFetchingUserStage, refetch: refetchUserStageQuery } = userStageQuery;

  const activeLoanQuery = useGetExistingActiveLoan({ enabled: isLoggedIn });
  const { data: activeLoan, isLoading: isLoadingLoan, isFetching: isFetchingActiveLoan, refetch: refetchActiveLoanQuery } = activeLoanQuery;

  const [isCancellationModalVisible, setIsCancellationModalVisible] = useState(false);

  const cancellationLoanId = useMemo(
    () => getLoanIdFromActiveLoanResponse(activeLoan),
    [activeLoan]
  );
  const canCancelLoan = getCanCancelFromActiveLoanResponse(activeLoan);
  const showCancelLoanEntry = cancellationLoanId != null;

  const handleOpenCancellationModal = useCallback(() => {
    if (cancellationLoanId != null) {
      setIsCancellationModalVisible(true);
    }
  }, [cancellationLoanId]);

  const handleCloseCancellationModal = useCallback(() => {
    setIsCancellationModalVisible(false);
  }, []);

  const handleLoanCancelled = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [REACT_QUERY_KEYS.USER_STAGE_WEB] });
  }, [queryClient]);

  const firstName = personalDetails?.firstName ?? "";

  const handleRefreshStatus = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [REACT_QUERY_KEYS.EXISTING_ACTIVE_LOAN] });
    queryClient.invalidateQueries({ queryKey: [REACT_QUERY_KEYS.USER_STAGE_WEB] });
  }, [isLoggedIn, refetchActiveLoanQuery, refetchUserStageQuery]);


  const isRefreshingHeroData = isFetchingUserStage || isFetchingActiveLoan;

  return (
    <section className="relative overflow-hidden ">
      <div className={`relative z-10 ${appShellContainerClassName} min-h-[480px] lg:min-h-0`}>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-0 sm:gap-10 lg:gap-16">
          <div className="flex-1 max-w-2xl w-full relative order-1 lg:order-1 flex flex-col ">
            {isLoggedIn ? (
              <HeroLoggedInContent
                firstName={firstName}
                userStage={userStage}
                activeLoan={activeLoan}
                isLoadingStage={isLoadingStage}
                isLoadingLoan={isLoadingLoan}
                isRefreshingHeroData={isRefreshingHeroData}
                journeyCardRemountKey={0}
                onRefreshStatus={handleRefreshStatus}
                showCancelLoanEntry={showCancelLoanEntry}
                canCancelLoan={canCancelLoan}
                onCancelLoanPress={handleOpenCancellationModal}
              />
            ) : (
              <HeroLoggedOut mobile={mobile} setMobile={setMobile} mobileError={mobileError} setMobileError={setMobileError} />
            )}
          </div>
          <div className={`relative flex items-center justify-center w-full lg:flex-1 order-2 lg:order-2 min-w-0 ${isLoggedIn ? "hidden lg:flex" : ""}`}>
            <div className="relative w-full max-w-[520px] aspect-7/8 bottom-0">
              <Image
                src="/images/bannerNew.png"
                alt="ZapCash - Get your loan offer"
                fill
                className="object-contain object-bottom"
                priority = {true}
                loading = "eager"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
        {!isLoggedIn && (
          <div className="absolute bottom-0 left-0 right-0 lg:hidden z-10 pb-4">
            <HeroLoggedOutForm mobile={mobile} setMobile={setMobile} mobileError={mobileError} setMobileError={setMobileError} className="shadow-lg" />
          </div>
        )}
      </div>
      {isLoggedIn && cancellationLoanId != null ? (
        <LoanCancellationModal
          visible={isCancellationModalVisible}
          loanId={cancellationLoanId}
          onClose={handleCloseCancellationModal}
          onLoanCancelled={handleLoanCancelled}
        />
      ) : null}
    </section>
  );
}
