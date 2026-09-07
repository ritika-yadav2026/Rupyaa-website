"use client";

import { useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  postEmploymentDetails,
  getUserStage,
  type PostEmploymentDetailsPayload,
} from "@/lib/user-api";
import { getCurrentOffer } from "@/lib/eligibility-api";
import { validateOrganizationName } from "@/lib/validation";
import { useFlowStore } from "@/store/useFlowStore";
import BasicInfoSidebar from "@/components/BasicInfoSidebar";
import BasicInfoFooter from "@/components/BasicInfoFooter";
import ValidatedTextInput from "@/components/ValidatedTextInput";

export type EmploymentMode = "salaried" | "self-employed";

export type EmploymentModeFieldErrors = {
  mode?: string;
  organization?: string;
  declaredSalaryDay?: string;
};

type EmbeddedProps = {
  embedded: true;
  mode: EmploymentMode | null;
  organizationName: string;
  declaredSalaryDay: number | "";
  errors?: EmploymentModeFieldErrors;
  disabled?: boolean;
  onModeChange: (mode: EmploymentMode) => void;
  onOrganizationNameChange: (organizationName: string) => void;
  onDeclaredSalaryDayChange: (declaredSalaryDay: number | "") => void;
};

type StandaloneProps = {
  embedded?: false;
  onContinue?: () => void;
};

type Props = EmbeddedProps | StandaloneProps;

type StageAction =
  | { type: "SHOW_PERSONAL_DETAILS" }
  | { type: "SHOW_EMPLOYMENT_MODE" }
  | { type: "SHOW_SOFT_PULL" }
  | { type: "SHOW_OFFER"; offerAmount: number | null; showUpdateButton?: boolean }
  | { type: "SHOW_DOWNLOAD_APP" };

const SALARY_DAY_OPTIONS = Array.from({ length: 31 }, (_, index) => index + 1);

function EmploymentModeFields({
  mode,
  organizationName,
  declaredSalaryDay,
  errors = {},
  disabled = false,
  onModeChange,
  onOrganizationNameChange,
  onDeclaredSalaryDayChange,
}: Omit<EmbeddedProps, "embedded">) {
  let modeError: ReactNode = null;
  if (errors.mode) {
    modeError = <p className="text-sm text-red-600" role="alert">{errors.mode}</p>;
  }

  let organizationError: ReactNode = null;
  if (errors.organization) {
    organizationError = <p className="text-sm text-red-600" role="alert">{errors.organization}</p>;
  }

  let salaryDayError: ReactNode = null;
  if (errors.declaredSalaryDay) {
    salaryDayError = <p className="text-sm text-red-600" role="alert">{errors.declaredSalaryDay}</p>;
  }

  let salariedFields: ReactNode = null;
  if (mode === "salaried") {
    salariedFields = (
      <>
        <div className="flex flex-col gap-2">
          <label htmlFor="organizationName" className="text-sm font-semibold text-gray-900">
            Organization Name
          </label>
          <ValidatedTextInput
            id="organizationName"
            value={organizationName}
            policy="organization"
            maxLength={200}
            onValueChange={onOrganizationNameChange}
            placeholder="e.g. ABC Corp"
            className={`w-full rounded-xl border-2 px-4 py-3 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.organization ? "border-red-500" : "border-gray-200"}`}
            aria-invalid={!!errors.organization}
            disabled={disabled}
          />
          {organizationError}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="declaredSalaryDay" className="text-sm font-semibold text-gray-900">
            Salary Day (1-31)
          </label>
          <select
            id="declaredSalaryDay"
            value={declaredSalaryDay}
            onChange={(event) => {
              const value = event.target.value;
              onDeclaredSalaryDayChange(value === "" ? "" : Number(value));
            }}
            className={`w-full rounded-xl border-2 bg-white px-4 py-3 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.declaredSalaryDay ? "border-red-500" : "border-gray-200"}`}
            aria-invalid={!!errors.declaredSalaryDay}
            disabled={disabled}
          >
            <option value="">Select salary day</option>
            {SALARY_DAY_OPTIONS.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500">Day of the month when your salary is credited</p>
          {salaryDayError}
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-sm font-semibold text-gray-900">Employment Type</legend>
        <label className={`flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-4 transition-colors ${mode === "salaried" ? "border-primary bg-[#e8f5e9]" : "border-gray-200 bg-white hover:border-gray-300"}`}>
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="employmentMode"
              value="salaried"
              checked={mode === "salaried"}
              onChange={() => onModeChange("salaried")}
              disabled={disabled}
              className="mt-1 h-5 w-5 shrink-0 rounded-full border-2 border-gray-300 text-primary focus:ring-primary"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-base font-semibold text-gray-900">Employed (Salaried)</span>
              <span className="text-sm text-gray-600">Choose this if you receive a regular salary from your employer directly into your bank account.</span>
            </div>
          </div>
        </label>

        <label className={`flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-4 transition-colors ${mode === "self-employed" ? "border-primary bg-[#e8f5e9]" : "border-gray-200 bg-white hover:border-gray-300"}`}>
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="employmentMode"
              value="self-employed"
              checked={mode === "self-employed"}
              onChange={() => onModeChange("self-employed")}
              disabled={disabled}
              className="mt-1 h-5 w-5 shrink-0 rounded-full border-2 border-gray-300 text-primary focus:ring-primary"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-base font-semibold text-gray-900">Self Employed/Business Owner/Freelancer</span>
              <span className="text-sm text-gray-600">Choose this if you earn through your own business, freelance work, or client projects.</span>
            </div>
          </div>
        </label>
        {modeError}
      </fieldset>

      {salariedFields}
    </div>
  );
}

function StandaloneEmploymentModeForm({ onContinue }: StandaloneProps) {
  const [mode, setMode] = useState<EmploymentMode | null>(null);
  const [organizationName, setOrganizationName] = useState("");
  const [declaredSalaryDay, setDeclaredSalaryDay] = useState<number | "">("");
  const [errors, setErrors] = useState<EmploymentModeFieldErrors>({});
  const setEmploymentDetailsSubmitted = useFlowStore((s) => s.setEmploymentDetailsSubmitted);
  const setUserStageResponse = useFlowStore((s) => s.setUserStageResponse);
  const setOfferAmount = useFlowStore((s) => s.setOfferAmount);
  const setShowUpdateButton = useFlowStore((s) => s.setShowUpdateButton);
  const setCurrentStep = useFlowStore((s) => s.setCurrentStep);
  const setFlowState = useFlowStore((s) => s.setFlowState);
  const setShowDownloadApp = useFlowStore((s) => s.setShowDownloadApp);

  const submitMutation = useMutation({
    mutationFn: async (payload: PostEmploymentDetailsPayload): Promise<{ userStage: Awaited<ReturnType<typeof getUserStage>>; action: StageAction }> => {
      await postEmploymentDetails(payload);
      const userStage = await getUserStage({ device: "web" });
      const stage = userStage.stage;
      if (stage === "PERSONAL_DETAILS") return { userStage, action: { type: "SHOW_PERSONAL_DETAILS" } };
      if (stage === "MODE_OF_EMPLOYMENT") return { userStage, action: { type: "SHOW_EMPLOYMENT_MODE" } };
      if (stage === "SOFT_PULL") return { userStage, action: { type: "SHOW_SOFT_PULL" } };
      if (stage === "OFFERINGS") {
        try {
          const offerResponse = await getCurrentOffer("components/EmploymentModeForm.tsx OFFERINGS");
          return { userStage, action: { type: "SHOW_OFFER", offerAmount: offerResponse.offer.offerAmount, showUpdateButton: offerResponse.showUpdateButton ?? false } };
        } catch {
          return { userStage, action: { type: "SHOW_OFFER", offerAmount: null } };
        }
      }
      return { userStage, action: { type: "SHOW_DOWNLOAD_APP" } };
    },
    onSuccess: (result) => {
      setEmploymentDetailsSubmitted(true);
      setUserStageResponse(result.userStage);
      if (result.action.type === "SHOW_PERSONAL_DETAILS") {
        toast.success("Employment details saved. Please complete your personal details.");
        setCurrentStep(0);
        return;
      }
      if (result.action.type === "SHOW_EMPLOYMENT_MODE") {
        toast.success("Employment details saved. Please confirm your employment type.");
        return;
      }
      if (result.action.type === "SHOW_SOFT_PULL") {
        setFlowState("soft_pull");
        onContinue?.();
        return;
      }
      if (result.action.type === "SHOW_DOWNLOAD_APP") {
        toast.success("Employment details saved. Continue on the ZapCash app.");
        setShowDownloadApp(true);
        return;
      }
      toast.success("Employment details saved successfully");
      setOfferAmount(result.action.offerAmount);
      setShowUpdateButton(result.action.showUpdateButton ?? false);
      setFlowState("offer");
      onContinue?.();
    },
    onError: (error: Error) => toast.error(error.message ?? "Failed to save employment details"),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: EmploymentModeFieldErrors = {};
    if (!mode) nextErrors.mode = "Please select your employment type";
    if (mode === "salaried") {
      const organizationError = validateOrganizationName(organizationName);
      if (organizationError) nextErrors.organization = organizationError;
      if (declaredSalaryDay === "" || declaredSalaryDay < 1 || declaredSalaryDay > 31) {
        nextErrors.declaredSalaryDay = "Please select your salary day (1-31)";
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !mode) return;

    const payload: PostEmploymentDetailsPayload = {
      employmentMode: mode,
      ...(mode === "salaried" && declaredSalaryDay !== ""
        ? { organization: organizationName.trim(), organizationName: organizationName.trim(), declaredSalaryDay }
        : {}),
    };
    submitMutation.mutate(payload);
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw]">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-6 sm:p-8 lg:p-10">
          <h2 className="mb-1 text-xl font-bold text-gray-900 sm:text-2xl">Tell Us About Your Employment Type</h2>
          <p className="mb-6 text-sm text-gray-600">We need to understand your work situation to offer the best loan options.</p>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <EmploymentModeFields
              mode={mode}
              organizationName={organizationName}
              declaredSalaryDay={declaredSalaryDay}
              errors={errors}
              onModeChange={(value) => { setMode(value); setErrors({}); }}
              onOrganizationNameChange={(value) => { setOrganizationName(value); setErrors((current) => ({ ...current, organization: undefined })); }}
              onDeclaredSalaryDayChange={(value) => { setDeclaredSalaryDay(value); setErrors((current) => ({ ...current, declaredSalaryDay: undefined })); }}
            />
            <button type="submit" disabled={submitMutation.isPending} className="mt-2 min-h-[48px] w-full rounded-xl bg-primary py-3.5 font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
              {submitMutation.isPending ? "Fetching your offer..." : "View Offers"}
            </button>
          </form>
        </div>
        <div className="shrink-0 border-t border-gray-100 lg:w-[320px] lg:border-l lg:border-t-0 xl:w-[380px]"><BasicInfoSidebar /></div>
      </div>
      <BasicInfoFooter />
    </div>
  );
}

export default function EmploymentModeForm(props: Props) {
  if (props.embedded) {
    return <EmploymentModeFields {...props} />;
  }
  return <StandaloneEmploymentModeForm {...props} />;
}
