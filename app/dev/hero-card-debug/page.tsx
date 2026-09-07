"use client";

import { useMemo, useState } from "react";
import HeroLoggedInCardArea from "@/components/home/HeroLoggedInCardArea";
import type { HeroHomeResolvedCard } from "@/lib/build-hero-home-card";
import type { HeroLoggedInCardCase } from "@/lib/hero-home-card-case";
import { UserStagesInBackend } from "@/lib/user-stage";

/**
 * Debug page for inspecting every hero card variant with mock data.
 * Visit /dev/hero-card-debug (development). Mocks include snapshot fields so
 * `getLoggedInHeroUiCase(resolved)` matches the selected scenario.
 *
 * `journey_post_offer_enach` is a debug-only alias for post-offer at ENACH with sanctioned loan.
 */

type UiCaseOption = HeroLoggedInCardCase | "journey_post_offer_enach";

const UI_CASE_OPTIONS: readonly UiCaseOption[] = [
  "active_loan",
  "journey_pre_offer",
  "journey_post_offer",
  "journey_post_offer_enach",
  "under_review",
  "cbl_rejected",
  "unsupported_stage_download",
];

const UI_CASE_LABELS: Record<UiCaseOption, string> = {
  active_loan: "Active Loan",
  journey_pre_offer: "Pre-Offer (Registration)",
  journey_post_offer: "Post-Offer (OFFERINGS — verified)",
  journey_post_offer_enach: "Post-Offer ENACH (sanctioned, loan.amount fallback)",
  under_review: "Under Review",
  cbl_rejected: "CBL / Rejected",
  unsupported_stage_download: "Unsupported Stage (App Download)",
};

function getMockResolved(uiCase: UiCaseOption): HeroHomeResolvedCard {
  const sharedCopy = {
    title: "Check loan offers",
    heading: "Instant Loan up to",
    description: "Instant approval with ZapCash credit engine",
    actionLabel: "Check Eligibility",
    hideAction: false,
    hideProgressStepper: false,
  };

  switch (uiCase) {
    case "active_loan":
      return {
        reason: "Debug mock: active loan",
        journeyProgress: { currentStepIndex: 3 },
        parsedStage: UserStagesInBackend.ACTIVE_LOAN_DASHBOARD,
        hasActiveLoan: true,
        loanStatusLower: "active",
        loanStatusRaw: "active",
        userStageRawUpper: "ACTIVE_LOAN_DASHBOARD",
        copy: {
          title: "Loan Status",
          heading: "Your loan is active",
          description: "Close on time to avoid late fees and save on interest.",
          actionLabel: "Pay Now",
          hideProgressStepper: true,
        },
        loan: {
          _id: "loan_123",
          status: "active",
          amount: 50000,
          tenure: "90 Days",
          dueDate: "2026-06-15",
          totalPayable: 58000,
          applicationNumber: "ZC2026012456",
          amountDue: 17450,
          totalAmountPaid: 40550,
          createdAt: "2026-01-10T00:00:00.000Z",
          updatedAt: "2026-06-01T00:00:00.000Z",
        },
        applicationNumber: "ZC2026012456",
      };

    case "under_review":
      return {
        reason: "Debug mock: under review",
        journeyProgress: { currentStepIndex: 2 },
        parsedStage: UserStagesInBackend.APPLICATION_STATUS,
        hasActiveLoan: false,
        loanStatusLower: "",
        loanStatusRaw: "",
        userStageRawUpper: "APPLICATION_STATUS",
        copy: {
          title: "Under Review",
          heading: "Your Application is Under Review",
          description: "We're carefully reviewing your application. This can take up to 6 days.",
          actionLabel: "Track Status",
          hideProgressStepper: true,
        },
        hasOffer: false,
      };

    case "cbl_rejected":
      return {
        reason: "Debug mock: cbl/rejected",
        journeyProgress: { currentStepIndex: 1 },
        parsedStage: UserStagesInBackend.REJECTED,
        hasActiveLoan: false,
        loanStatusLower: "",
        loanStatusRaw: "",
        userStageRawUpper: "REJECTED",
        copy: {
          title: "Check loan offers",
          heading: "Application Status",
          description: "Please check again in 30 days.",
          hideAction: true,
          hideProgressStepper: true,
        },
        hasOffer: false,
      };

    case "unsupported_stage_download":
      return {
        reason: "Debug mock: unsupported stage",
        journeyProgress: { currentStepIndex: 0 },
        parsedStage: UserStagesInBackend.PERSONAL_DETAILS,
        hasActiveLoan: false,
        loanStatusLower: "",
        loanStatusRaw: "",
        userStageRawUpper: "UNKNOWN_WEB_STAGE_XYZ",
        copy: sharedCopy,
        hasOffer: false,
      };

    case "journey_pre_offer":
      return {
        reason: "Debug mock: pre-offer (SOFT_PULL stage)",
        journeyProgress: { currentStepIndex: 1 },
        parsedStage: UserStagesInBackend.SOFT_PULL,
        hasActiveLoan: false,
        loanStatusLower: "",
        loanStatusRaw: "",
        userStageRawUpper: "SOFT_PULL",
        hasOffer: false,
        copy: {
          title: "Check loan offers",
          heading: "Instant Loan up to",
          description: "Check eligibility in 30 seconds",
          actionLabel: "Check Eligibility",
        },
      };

    case "journey_post_offer_enach":
      return {
        reason: "Debug mock: ENACH (sanctioned loan, no offer)",
        journeyProgress: { currentStepIndex: 3 },
        parsedStage: UserStagesInBackend.ENACH,
        hasActiveLoan: true,
        loanStatusLower: "sanctioned",
        loanStatusRaw: "Sanctioned",
        userStageRawUpper: "ENACH",
        copy: {
          title: "Check loan offers",
          heading: "Your Approved Loan Amount",
          description: "Complete eNACH setup to proceed",
          actionLabel: "Setup AutoPay",
        },
        hasOffer: false,
        loan: {
          _id: "loan_mock_enach",
          status: "Sanctioned",
          amount: 50000,
          tenure: "90 Days",
          dueDate: "",
          totalPayable: 58000,
          applicationNumber: "M3UEQHC",
          createdAt: "2026-01-10T00:00:00.000Z",
          updatedAt: "2026-05-08T00:00:00.000Z",
        },
        applicationNumber: "M3UEQHC",
      };

    default:
      return {
        reason: "Debug mock: post-offer (OFFERINGS, loanStatus=verified)",
        journeyProgress: { currentStepIndex: 2 },
        parsedStage: UserStagesInBackend.OFFERINGS,
        hasActiveLoan: true,
        loanStatusLower: "verified",
        loanStatusRaw: "verified",
        userStageRawUpper: "OFFERINGS",
        hasOffer: true,
        loan: {
          _id: "loan_mock_offer",
          status: "verified",
          amount: 50000,
          tenure: "90 Days",
          dueDate: "",
          totalPayable: 58000,
          applicationNumber: "ZC2026012456",
          createdAt: "2026-01-10T00:00:00.000Z",
          updatedAt: "2026-05-08T00:00:00.000Z",
        },
        copy: {
          title: "Check loan offers",
          heading: "You're Eligible for ₹50,000",
          description: "Your personalized loan offer is ready.",
          actionLabel: "Accept & Proceed",
        },
        applicationNumber: "ZC2026012456",
      };
  }
}

export default function HeroCardDebugPage() {
  const [uiCase, setUiCase] = useState<UiCaseOption>("journey_pre_offer");

  const resolved = useMemo(() => getMockResolved(uiCase), [uiCase]);

  return (
    <main className="min-h-screen bg-[#F7FAF8] px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900">Hero Card Debug Tool</h1>
        <p className="mt-1 text-sm text-gray-600">
          Switch hero UI case to inspect rendering. All amounts come from mock{" "}
          <code className="rounded bg-gray-100 px-1 text-xs">loan.amount</code> — no API calls.
        </p>

        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <label htmlFor="hero-ui-case" className="block text-sm font-semibold text-gray-700">
            Hero UI case
          </label>
          <select
            id="hero-ui-case"
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={uiCase}
            onChange={(e) => setUiCase(e.target.value as UiCaseOption)}
          >
            {UI_CASE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {UI_CASE_LABELS[option]}
              </option>
            ))}
          </select>

          <pre className="mt-3 max-h-64 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-700">
            {JSON.stringify(resolved, null, 2)}
          </pre>
        </div>

        <div className="mt-6">
          <HeroLoggedInCardArea
            resolved={resolved}
            journeyCardRemountKey={UI_CASE_OPTIONS.indexOf(uiCase)}
            onAcceptOffer={() => {
              alert("[debug] onAcceptOffer triggered");
            }}
            onRefreshStatus={() => {
              alert("[debug] onRefreshStatus triggered");
            }}
          />
        </div>
      </div>
    </main>
  );
}
