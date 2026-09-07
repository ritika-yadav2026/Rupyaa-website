"use client";

import { useRouter } from "next/navigation";
import { ActiveLoanCard } from "@/components/home/ActiveLoanCard";
import {
  getActiveLoanStatusPill,
  resolveActiveLoanScreenType,
} from "@/helpers/loan-helper";
import type { DisplayLoan } from "@/types/hero-logged-in-card";
import type { Loan } from "@/lib/eligibility-api";
import { useEnableFullWebJourney } from "@/hooks/useEnableFullWebJourney";
import { STRING_CONSTANTS } from "@/utils/app-constants";

type ActiveLoanHeroCardProps = {
  loan: DisplayLoan;
  actionLabel: string;
  showCancelLoanEntry?: boolean;
  canCancelLoan?: boolean;
  onCancelLoanPress?: () => void;
};

export function ActiveLoanHeroCard({
  loan,
  actionLabel,
  showCancelLoanEntry = false,
  canCancelLoan = false,
  onCancelLoanPress,
}: ActiveLoanHeroCardProps) {
  const router = useRouter();
  const enableFullWebJourney = useEnableFullWebJourney();
  // const enableFullWebJourney = false;
  const screenType = resolveActiveLoanScreenType(loan as Loan);
  const href = screenType === "foreclosure" ? "/foreclosure" : "/payment";
  const amountDue =
    typeof loan.amountDue === "number" && loan.amountDue > 0 ? loan.amountDue : undefined;

  const getActionLabel = () => {
    // if (enableFullWebJourney) {
    //   return actionLabel;
    // }
    // return 'Download App';
    return actionLabel
  };

  const getOnActionPress = () => {
    // if (enableFullWebJourney) {
    //   return () => router.push(href);
    // }
    // return () => window.location.href = STRING_CONSTANTS.PLAY_STORE_URL;

    return () => router.push(href);
  };
    
  return (
    <ActiveLoanCard
      amount={loan.amount}
      amountDue={amountDue}
      dueDate={loan.dueDate ?? ""}
      statusPill={getActiveLoanStatusPill(loan as Loan)}
      actionLabel={getActionLabel()}
      onActionPress={getOnActionPress()}
      showCancelLoanEntry={showCancelLoanEntry}
      canCancelLoan={canCancelLoan}
      onCancelLoanPress={onCancelLoanPress}
    />
  );
}
