"use client";

import { useReducer, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  validatePan,
  validateDob,
  validateIncome,
  validatePincodeString,
  validateOrganizationName,
  sanitizePanInput,
} from "@/lib/validation";
import {
  getPersonalDetails,
  type PostPersonalDetailsPayload,
} from "@/lib/user-api";
import AppButton from "@/components/app-button";
import AppTextField from "@/components/app-text-field";
import AppSelectField from "@/components/app-select-field";
import BasicInfoSidebar from "@/components/BasicInfoSidebar";
import BasicInfoFooter from "@/components/BasicInfoFooter";
import LocationPermissionModal from "@/components/LocationPermissionModal";
import { useRequireLocationPermission } from "@/hooks/useRequireLocationPermission";
import { REACT_QUERY_KEYS } from "@/utils/app-constants";
import EmploymentModeForm from "@/components/EmploymentModeForm";
import { submitPersonalEmploymentDetails } from "@/services/user/submit-personal-employment-details";
import { useFlowStore } from "@/store/useFlowStore";

type EmploymentMode = "salaried" | "self-employed";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

type FieldErrors = {
  panNumber?: string;
  dob?: string;
  income?: string;
  pincode?: string;
  gender?: string;
  employmentMode?: string;
  organization?: string;
  declaredSalaryDay?: string;
};

type FormState = {
  panNumber: string;
  dob: string;
  income: string;
  pincode: string;
  gender: string;
  employmentMode: EmploymentMode | null;
  organization: string;
  declaredSalaryDay: number | "";
  errors: FieldErrors;
};

const INITIAL_STATE: FormState = {
  panNumber: "",
  dob: "",
  income: "",
  pincode: "",
  gender: "",
  employmentMode: null,
  organization: "",
  declaredSalaryDay: "",
  errors: {},
};

type FormAction =
  | { type: "SET_PAN_NUMBER"; payload: string }
  | { type: "SET_DOB"; payload: string }
  | { type: "SET_INCOME"; payload: string }
  | { type: "SET_PINCODE"; payload: string }
  | { type: "SET_GENDER"; payload: string }
  | { type: "SET_EMPLOYMENT_MODE"; payload: EmploymentMode }
  | { type: "SET_ORGANIZATION"; payload: string }
  | { type: "SET_DECLARED_SALARY_DAY"; payload: number | "" }
  | { type: "SET_VALIDATION_ERRORS"; payload: FieldErrors }
  | { type: "SET_PREFILL"; payload: Partial<Omit<FormState, "errors">> };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_PAN_NUMBER":
      return { ...state, panNumber: action.payload, errors: { ...state.errors, panNumber: undefined } };
    case "SET_DOB":
      return { ...state, dob: action.payload, errors: { ...state.errors, dob: undefined } };
    case "SET_INCOME":
      return { ...state, income: action.payload, errors: { ...state.errors, income: undefined } };
    case "SET_PINCODE":
      return { ...state, pincode: action.payload, errors: { ...state.errors, pincode: undefined } };
    case "SET_GENDER":
      return { ...state, gender: action.payload, errors: { ...state.errors, gender: undefined } };
    case "SET_EMPLOYMENT_MODE":
      return { ...state, employmentMode: action.payload, errors: { ...state.errors, employmentMode: undefined } };
    case "SET_ORGANIZATION":
      return { ...state, organization: action.payload, errors: { ...state.errors, organization: undefined } };
    case "SET_DECLARED_SALARY_DAY":
      return { ...state, declaredSalaryDay: action.payload, errors: { ...state.errors, declaredSalaryDay: undefined } };
    case "SET_VALIDATION_ERRORS":
      return { ...state, errors: action.payload };
    case "SET_PREFILL":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function parseDobToDateInput(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function formatIncomeDisplay(value: string): string {
  const num = value.replace(/\D/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("en-IN");
}

export default function PersonalDetailsForm() {
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);
  const { panNumber, dob, income, pincode, gender, employmentMode, organization, declaredSalaryDay, errors } = state;
  const setFlowFromUserStage = useFlowStore((flowState) => flowState.setFlowFromUserStage);
  const {
    isBlocked,
    isRequesting,
    error: locationError,
    permissionStatus,
    location,
    requestPermission,
  } = useRequireLocationPermission();

  const { data: personalDetails } = useQuery({
    queryKey: [REACT_QUERY_KEYS.PERSONAL_DETAILS],
    queryFn: getPersonalDetails,
    retry: 1,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  const getEmploymentMode = (employmentMode: string | undefined): EmploymentMode | null => {
    switch (employmentMode) {
      case "salaried":
        return "salaried";
      case "self-employed":
        return "self-employed";
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!personalDetails) return;
    const pincodeStr = personalDetails.pincode ?? "";
    dispatch({
      type: "SET_PREFILL",
      payload: {
        panNumber: personalDetails.pan ?? "",
        dob: parseDobToDateInput(personalDetails.dob ?? ""),
        income: personalDetails.salary != null ? String(personalDetails.salary) : "",
        pincode: pincodeStr,
        gender: personalDetails.gender ?? "",
        employmentMode: getEmploymentMode(personalDetails.employmentMode),
        organization: personalDetails.organization ?? "",
        declaredSalaryDay: personalDetails.declaredSalaryDay ?? "",
      },
    });
  }, [personalDetails]);

  const submitMutation = useMutation({
    mutationFn: submitPersonalEmploymentDetails,
    onSuccess: (userStage) => {
      toast.success("Personal and employment details saved");
      setFlowFromUserStage(
        userStage.showDashboard,
        userStage.stage,
        userStage.sectionsCompleted,
        userStage.context,
        userStage,
      );
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to save details");
    },
  });

  const handleIncomeChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    dispatch({ type: "SET_INCOME", payload: digits });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const panNumberErr = validatePan(panNumber);
    const dobErr = validateDob(dob);
    const incomeErr = validateIncome(income);
    const pincodeErr = validatePincodeString(pincode);
    const genderErr = !gender.trim() ? "Please select your gender" : null;
    const employmentModeErr = !employmentMode ? "Please select your employment type" : null;
    let organizationErr: string | null = null;
    let declaredSalaryDayErr: string | null = null;
    if (employmentMode === "salaried") {
      organizationErr = validateOrganizationName(organization);
      declaredSalaryDayErr =
        declaredSalaryDay === "" || declaredSalaryDay < 1 || declaredSalaryDay > 31
          ? "Please select your salary day (1-31)"
          : null;
    }
    const newErrors: FieldErrors = {};
    if (panNumberErr) newErrors.panNumber = panNumberErr;
    if (dobErr) newErrors.dob = dobErr;
    if (incomeErr) newErrors.income = incomeErr;
    if (pincodeErr) newErrors.pincode = pincodeErr;
    if (genderErr) newErrors.gender = genderErr;
    if (employmentModeErr) newErrors.employmentMode = employmentModeErr;
    if (organizationErr) newErrors.organization = organizationErr;
    if (declaredSalaryDayErr) newErrors.declaredSalaryDay = declaredSalaryDayErr;
    dispatch({ type: "SET_VALIDATION_ERRORS", payload: newErrors });
    if (
      panNumberErr ||
      dobErr ||
      incomeErr ||
      pincodeErr ||
      genderErr ||
      employmentModeErr ||
      organizationErr ||
      declaredSalaryDayErr ||
      !employmentMode
    ) return;
    const pincodeStr = pincode.replace(/\D/g, "").slice(0, 6);
    const salaryNum = Number(income.replace(/,/g, ""));
    const dobFormatted = dob ? dob.slice(0, 10) : "";
    const payload: PostPersonalDetailsPayload = {
      pincode: pincodeStr,
      pan: panNumber.trim().toUpperCase(),
      dob: dobFormatted,
      salary: salaryNum,
      gender: gender.trim(),
      employmentMode,
      ...(employmentMode === "salaried" && declaredSalaryDay !== ""
        ? {
            organization: organization.trim(),
            declaredSalaryDay,
          }
        : {}),
      ...(location
        ? {
            geolocation: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          }
        : {}),
    };
    submitMutation.mutate(payload);
  };

  let submitLabel = "Continue";
  if (submitMutation.isPending) {
    submitLabel = "Saving...";
  }

  let formShellClassName =
    "w-full max-w-full sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] min-w-0 mx-auto bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden";
  if (isBlocked) {
    formShellClassName += " pointer-events-none select-none opacity-60";
  }

  return (
    <>
      <LocationPermissionModal
        visible={isBlocked}
        isRequesting={isRequesting}
        error={locationError}
        permissionStatus={permissionStatus}
        onAllow={requestPermission}
      />
      <div className={formShellClassName} aria-hidden={isBlocked}>
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-6 sm:p-8 lg:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Personal &amp; Employment Details</h2>
            <p className="text-sm text-gray-600 mb-6">
              Please provide your personal and employment details to start the application.
            </p>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <AppTextField
                id="pan_number"
                label="PAN Number"
                type="text"
                placeholder="e.g., ABCDE1234F"
                value={panNumber}
                onChange={(e) =>
                  dispatch({ type: "SET_PAN_NUMBER", payload: sanitizePanInput(e.target.value) })
                }
                error={errors.panNumber}
                disabled={isBlocked}
              />

              <AppSelectField
                id="gender"
                label="Gender"
                value={gender}
                onChange={(e) => dispatch({ type: "SET_GENDER", payload: e.target.value })}
                placeholder="Select gender"
                options={GENDER_OPTIONS}
                error={errors.gender}
                disabled={isBlocked}
              />

              <AppTextField
                id="dob"
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={(e) => dispatch({ type: "SET_DOB", payload: e.target.value })}
                error={errors.dob}
                disabled={isBlocked}
              />

              <AppTextField
                id="income"
                label="Monthly Income"
                type="text"
                inputMode="numeric"
                prefix="₹"
                placeholder="40,000 - 50,000"
                value={income ? formatIncomeDisplay(income) : ""}
                onChange={(e) => handleIncomeChange(e.target.value)}
                error={errors.income}
                disabled={isBlocked}
              />

              <AppTextField
                id="pincode"
                label="Pincode (Current Address)"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="e.g., 110006"
                value={pincode}
                onChange={(e) =>
                  dispatch({
                    type: "SET_PINCODE",
                    payload: e.target.value.replace(/\D/g, "").slice(0, 6),
                  })
                }
                error={errors.pincode}
                disabled={isBlocked}
              />

              <EmploymentModeForm
                embedded
                mode={employmentMode}
                organizationName={organization}
                declaredSalaryDay={declaredSalaryDay}
                errors={{
                  mode: errors.employmentMode,
                  organization: errors.organization,
                  declaredSalaryDay: errors.declaredSalaryDay,
                }}
                disabled={isBlocked}
                onModeChange={(value) => dispatch({ type: "SET_EMPLOYMENT_MODE", payload: value })}
                onOrganizationNameChange={(value) => dispatch({ type: "SET_ORGANIZATION", payload: value })}
                onDeclaredSalaryDayChange={(value) => dispatch({ type: "SET_DECLARED_SALARY_DAY", payload: value })}
              />

              <AppButton
                type="submit"
                fullWidth
                disabled={submitMutation.isPending || isBlocked}
                className="mt-2"
              >
                {submitLabel}
              </AppButton>
            </form>
          </div>

          <div className="lg:w-[320px] xl:w-[380px] shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100">
            <BasicInfoSidebar />
          </div>
        </div>

        <BasicInfoFooter />
      </div>
    </>
  );
}
