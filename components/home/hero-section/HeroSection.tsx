"use client";

import { useCallback, useMemo, useState, type ReactElement, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPersonalDetails } from "@/lib/user-api";
import { useGetExistingActiveLoan } from "@/services/loans/useGetExistingActiveLoan";
import {
  getCanCancelFromActiveLoanResponse,
  getLoanIdFromActiveLoanResponse,
} from "@/services/loans";
import { useUserStage } from "@/hooks/useUserStage";
import { useAuthLoggedInHint } from "@/hooks/use-auth-logged-in-hint";
import LoanCancellationModal from "@/components/LoanCancellationModal";
import HeroSkyline from "@/components/home/HeroSkyline";
import { HeroLoggedInContent } from "@/components/home/hero-section/HeroLoggedInContent";
import { HeroLoggedOut } from "./HeroLoggedOut";
import { REACT_QUERY_KEYS } from "@/utils/app-constants";
import { PERSONAL_LOAN_PAGE_GRADIENT } from "@/lib/personal-loan-page-gradient";

export default function HeroSection(): ReactElement {
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
  const {
    data: userStage,
    isLoading: isLoadingStage,
    isFetching: isFetchingUserStage,
    refetch: refetchUserStageQuery,
  } = userStageQuery;

  const activeLoanQuery = useGetExistingActiveLoan({ enabled: isLoggedIn });
  const {
    data: activeLoan,
    isLoading: isLoadingLoan,
    isFetching: isFetchingActiveLoan,
    refetch: refetchActiveLoanQuery,
  } = activeLoanQuery;

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

  let content: ReactNode;
  if (isLoggedIn) {
    content = (
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
    );
  } else {
    content = (
      <HeroLoggedOut
        mobile={mobile}
        setMobile={setMobile}
        mobileError={mobileError}
        setMobileError={setMobileError}
      />
    );
  }

  let cancellationModal: ReactNode = null;
  if (isLoggedIn && cancellationLoanId != null) {
    cancellationModal = (
      <LoanCancellationModal
        visible={isCancellationModalVisible}
        loanId={cancellationLoanId}
        onClose={handleCloseCancellationModal}
        onLoanCancelled={handleLoanCancelled}
      />
    );
  }

  return (
    <section
      className="relative flex h-[calc(100dvh-4rem)] min-h-[calc(100dvh-4rem)] w-full flex-col overflow-hidden bg-white"
      style={{ background: PERSONAL_LOAN_PAGE_GRADIENT }}
    >
      <HeroSkyline />
      <div className="relative z-[2] mx-auto flex w-full flex-1 flex-col items-center justify-start px-4 pb-10 pt-5 sm:justify-center sm:pt-6">
        {content}
      </div>
      {cancellationModal}
    </section>
  );
}
