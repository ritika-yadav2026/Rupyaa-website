"use client";

import { useCallback, useMemo, useState, type ReactElement, type ReactNode } from "react";
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
import HeroSkyline from "@/components/home/HeroSkyline";
import { HeroLoggedInContent } from "@/components/home/hero-section/HeroLoggedInContent";
import { HeroLoggedOut } from "./HeroLoggedOut";
import { REACT_QUERY_KEYS } from "@/utils/app-constants";

const GUEST_HERO_BACKGROUND =
  "linear-gradient(180deg, #FFFFFF 0%, #FFFDF8 40%, #FFE9A8 78%, #F6CB4A 100%)";

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
  let skyline: ReactNode = null;
  let sectionClassName: string;
  let shellStyle: { background: string };

  if (isLoggedIn) {
    shellStyle = {
      background: "linear-gradient(180deg, #FFFFFF 0%, #FFFCF5 45%, #FFF3CC 100%)",
    };
    sectionClassName = "relative overflow-hidden pt-10 sm:pt-12 lg:pt-16";
    content = (
      <div className={appShellContainerClassName}>
        <div className="flex flex-col items-stretch justify-between gap-0 pb-8 sm:gap-10 sm:pb-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="relative order-1 flex w-full max-w-2xl flex-1 flex-col">
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
          </div>
          <div className="relative order-2 hidden min-w-0 w-full items-center justify-center lg:flex lg:flex-1">
            <div className="relative bottom-0 aspect-7/8 w-full max-w-[520px]">
              <Image
                src="/images/bannerNew.png"
                alt="Rupyaa - Get your loan offer"
                fill
                className="object-contain object-bottom"
                priority={true}
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    shellStyle = { background: GUEST_HERO_BACKGROUND };
    sectionClassName =
      "relative flex min-h-[calc(100dvh-4rem)] w-full flex-col overflow-hidden";
    skyline = (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 w-full px-0"
      >
        <HeroSkyline className="max-h-[48vh] sm:max-h-[52vh]" />
      </div>
    );
    content = (
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-[14vh] pt-6 sm:pb-[12vh]">
        <HeroLoggedOut
          mobile={mobile}
          setMobile={setMobile}
          mobileError={mobileError}
          setMobileError={setMobileError}
        />
      </div>
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
    <section className={sectionClassName} style={shellStyle}>
      {skyline}
      {content}
      {cancellationModal}
    </section>
  );
}
