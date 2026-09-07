import type { ComponentType } from "react";
import PersonalDetailsForm from "@/components/PersonalDetailsForm";
import EmploymentModeForm from "@/components/EmploymentModeForm";
import LoanOfferScreen from "@/components/LoanOfferScreen";
import SoftPullScreen from "@/components/SoftPullScreen";
import ApplicationUnderReviewScreen from "@/components/ApplicationUnderReviewScreen";
import ContactDetailsStep from "@/components/ContactDetailsStep";
import DigiLockerStep from "@/components/DigiLockerStep";
import FaceKYCStep from "@/components/FaceKYCStep";
import PersonalFamilyDetailsStep from "@/components/PersonalFamilyDetailsStep";
import AddressDetailsStep from "@/components/AddressDetailsStep";
import FamilyDetailsStep from "@/components/FamilyDetailsStep";
import ReferenceDetailsStep from "@/components/ReferenceDetailsStep";
import BankDetailsStep from "@/components/BankDetailsStep";
import ENachMandateStep from "@/components/ENachMandateStep";
import AgreementGeneratedStep from "@/components/AgreementGeneratedStep";
import ESignStep from "@/components/ESignStep";
import LoanSanctionedStep from "@/components/LoanSanctionedStep";
import BSAMobileScreen from "@/components/BSAMobileScreen";

export type StepComponentProps = {
  onContinue?: () => void;
};

type ComponentEntry = {
  Component: ComponentType<Record<string, unknown>>;
  ctaProp: "onContinue" | null;
};

export const STEP_COMPONENTS: Record<string, ComponentEntry> = {
  PersonalDetailsForm: { Component: PersonalDetailsForm, ctaProp: "onContinue" },
  EmploymentModeForm: { Component: EmploymentModeForm, ctaProp: "onContinue" },
  SoftPullScreen: { Component: SoftPullScreen, ctaProp: "onContinue" },
  LoanOfferScreen: { Component: LoanOfferScreen, ctaProp: "onContinue" },
  BSAMobileScreen: { Component: BSAMobileScreen, ctaProp: "onContinue" },
  ContactDetailsStep: { Component: ContactDetailsStep, ctaProp: "onContinue" },
  PersonalFamilyDetailsStep: { Component: PersonalFamilyDetailsStep, ctaProp: "onContinue" },
  AddressDetailsStep: { Component: AddressDetailsStep, ctaProp: "onContinue" },
  FamilyDetailsStep: { Component: FamilyDetailsStep, ctaProp: "onContinue" },
  ReferenceDetailsStep: { Component: ReferenceDetailsStep, ctaProp: "onContinue" },
  BankDetailsStep: { Component: BankDetailsStep, ctaProp: "onContinue" },
  DigiLockerStep: { Component: DigiLockerStep, ctaProp: "onContinue" },
  FaceKYCStep: { Component: FaceKYCStep, ctaProp: "onContinue" },
  ENachMandateStep: { Component: ENachMandateStep, ctaProp: null },
  AgreementGeneratedStep: { Component: AgreementGeneratedStep, ctaProp: "onContinue" },
  ESignStep: { Component: ESignStep, ctaProp: "onContinue" },
  LoanSanctionedStep: { Component: LoanSanctionedStep, ctaProp: null },
};
