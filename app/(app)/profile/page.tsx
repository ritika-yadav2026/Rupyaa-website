"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import {
  validateIndianMobile,
  validateIncome,
  validateName,
  validateOrganizationName,
  validatePan,
  validatePincodeString,
  validateRequired,
  validateStreetAddress,
  sanitizePanInput,
} from "@/lib/validation";
import {
  getPersonalDetails,
  getUserStage,
  type GetPersonalDetailsResponse,
} from "@/lib/user-api";
import DefaultUserAvatar from "@/components/DefaultUserAvatar";
import Footer from "@/components/home/Footer";
import { REACT_QUERY_KEYS } from "@/utils/app-constants";

type PersonalFieldKey = "fullName" | "dob" | "pan" | "phone" | "salary" | "organization";

function formatDateForDisplay(dateStr: string): string {
  if (!dateStr?.trim()) return "";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr.trim();
    return d.toLocaleDateString("en-IN", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr.trim();
  }
}

function formatIndianPhone(phone?: string | null): string {
  if (!phone?.trim()) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10) {
    const last10 = digits.slice(-10);
    return `+91 ${last10.slice(0, 5)} ${last10.slice(5)}`;
  }
  return phone.trim();
}

function formatSalaryDisplay(salary: number | null | undefined): string {
  if (salary === null || salary === undefined || Number.isNaN(Number(salary))) return "";
  return `₹${Number(salary).toLocaleString("en-IN")}`;
}

function displayOrDash(value: string): string {
  const t = value.trim();
  return t ? t : "-";
}

function formatStageLabel(stage?: string | null): string {
  if (!stage?.trim()) return "";
  return stage
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IdCardIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
      <path d="M8 12h8" />
      <path d="M8 16h4" />
      <circle cx="14" cy="9" r="2" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function RupeeIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className={className} aria-hidden>
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="22"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
        fill="currentColor"
      >
        ₹
      </text>
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M3 21h18" />
      <path d="M9 8h1" />
      <path d="M9 12h1" />
      <path d="M9 16h1" />
      <path d="M14 8h1" />
      <path d="M14 12h1" />
      <path d="M14 16h1" />
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

const EMPTY_PERSONAL: Record<PersonalFieldKey, string> = {
  fullName: "",
  dob: "",
  pan: "",
  phone: "",
  salary: "",
  organization: "",
};

const personalFieldConfig: { key: PersonalFieldKey; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "fullName", label: "Full Name", Icon: BriefcaseIcon },
  { key: "dob", label: "Date of Birth", Icon: CalendarIcon },
  { key: "pan", label: "PAN Number", Icon: IdCardIcon },
  { key: "phone", label: "Phone Number", Icon: PhoneIcon },
  { key: "salary", label: "Monthly Salary", Icon: RupeeIcon },
  { key: "organization", label: "Organization", Icon: BuildingIcon },
];

function resolveFullName(api: GetPersonalDetailsResponse): string {
  const combined = [api.firstName, api.middleName, api.lastName].filter((p) => p?.trim()).join(" ").trim();
  return (api.fullName?.trim() || combined).trim();
}

function mapApiToPersonal(api: GetPersonalDetailsResponse): Record<PersonalFieldKey, string> {
  const fullName = resolveFullName(api);
  return {
    fullName,
    dob: api.dob ? formatDateForDisplay(api.dob) : "",
    pan: (api.pan ?? "").trim(),
    phone: formatIndianPhone(api.phoneNumber),
    salary: formatSalaryDisplay(api.salary),
    organization: (api.organization ?? "").trim(),
  };
}

/**
 * True when core KYC-style fields are missing — used for a small banner only; the profile grid still shows API data.
 */
function isProfileIncomplete(api: GetPersonalDetailsResponse): boolean {
  const hasName = Boolean(resolveFullName(api));
  const hasPan = Boolean(api.pan?.trim());
  const hasDob = Boolean(api.dob?.trim());
  return !hasName || !hasPan || !hasDob;
}

export default function ProfilePage() {
  const {
    data: apiData,
    isPending: personalPending,
    isError: personalError,
    error: personalErr,
  } = useQuery({
    queryKey: [REACT_QUERY_KEYS.PERSONAL_DETAILS],
    queryFn: getPersonalDetails,
    retry: 1,
  });

  const { data: stageData, isPending: stagePending } = useQuery({
    queryKey: [REACT_QUERY_KEYS.USER_STAGE, REACT_QUERY_KEYS.WEB],
    queryFn: () => getUserStage({ device: "web" }),
    retry: 1,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [personal, setPersonal] = useState<Record<PersonalFieldKey, string>>(EMPTY_PERSONAL);
  const [street, setStreet] = useState("");
  const [cityState, setCityState] = useState("");
  const [savedPersonal, setSavedPersonal] = useState<Record<PersonalFieldKey, string>>(EMPTY_PERSONAL);
  const [savedStreet, setSavedStreet] = useState("");
  const [savedCityState, setSavedCityState] = useState("");

  useEffect(() => {
    if (!apiData) return;
    const next = mapApiToPersonal(apiData);
    setPersonal(next);
    setSavedPersonal(next);
    setStreet("");
    const pin = (apiData.pincode ?? "").trim();
    setCityState(pin);
    setSavedStreet("");
    setSavedCityState(pin);
  }, [apiData]);

  const subtitle =
    formatStageLabel(stageData?.stage) ||
    (apiData?.employmentMode?.trim() ? apiData.employmentMode.replace(/_/g, " ") : "") ||
    (apiData?.designation?.trim() ?? "") ||
    "";

  const displayNameRaw = personal.fullName.trim();
  const displayName = displayNameRaw ? displayNameRaw : "-";

  const handleStartEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setPersonal({ ...savedPersonal });
    setStreet(savedStreet);
    setCityState(savedCityState);
    setIsEditing(false);
  };

  const handleSave = () => {
    const nameErr = validateName(personal.fullName, "Full name");
    if (nameErr) {
      toast.error(nameErr);
      return;
    }
    const dobErr = validateRequired(personal.dob, "Date of birth");
    if (dobErr) {
      toast.error(dobErr);
      return;
    }
    const panErr = validatePan(personal.pan);
    if (panErr) {
      toast.error(panErr);
      return;
    }
    const phoneErr = validateIndianMobile(personal.phone);
    if (phoneErr) {
      toast.error(phoneErr);
      return;
    }
    const incomeErr = validateIncome(personal.salary);
    if (incomeErr) {
      toast.error(incomeErr);
      return;
    }
    const orgErr = validateOrganizationName(personal.organization);
    if (orgErr) {
      toast.error(orgErr);
      return;
    }
    const pinErr = validatePincodeString(cityState);
    if (pinErr) {
      toast.error(pinErr);
      return;
    }
    const streetErr = validateStreetAddress(street);
    if (streetErr) {
      toast.error(streetErr);
      return;
    }
    setSavedPersonal({ ...personal });
    setSavedStreet(street);
    setSavedCityState(cityState);
    setIsEditing(false);
    toast.success("All fields are valid.");
  };

  const updatePersonal = (key: PersonalFieldKey, value: string) => {
    if (key === "pan") {
      setPersonal((prev) => ({ ...prev, [key]: sanitizePanInput(value) }));
      return;
    }
    if (key === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setPersonal((prev) => ({
        ...prev,
        [key]: digits.length === 10 ? formatIndianPhone(digits) : digits,
      }));
      return;
    }
    setPersonal((prev) => ({ ...prev, [key]: value }));
  };

  const isLoading = personalPending || stagePending;
  const showIncompleteBanner = Boolean(apiData && isProfileIncomplete(apiData));

  return (
    <div className="flex flex-col min-h-full">
      <main className={`flex flex-col py-8 sm:py-12 flex-1 ${appShellContainerClassName}`}>
        {personalError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {personalErr instanceof Error ? personalErr.message : "Failed to load profile. Please try again."}
          </div>
        )}

        {isLoading && !apiData && (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm font-medium">Loading profile…</span>
            </div>
          </div>
        )}

        {(!isLoading || apiData) && apiData && (
          <>
            {showIncompleteBanner && (
              <div className="mb-6 rounded-2xl border border-[#C8E6C9] bg-[#E8F5E9] px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Complete your profile for faster approvals</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Add any missing details below or continue in the application flow.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <Link
                    href="/personal-loan"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 min-h-[44px] text-center"
                  >
                    Complete Profile
                  </Link>
                  <Link
                    href="/personal-loan"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white border-2 border-gray-200 text-gray-800 text-sm font-semibold hover:bg-gray-50 min-h-[44px] text-center"
                  >
                    Check Eligibility
                  </Link>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <DefaultUserAvatar aria-label="Profile" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{displayName}</h1>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-sm font-medium text-primary">Active Account</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{displayOrDash(subtitle)}</p>
                </div>
              </div>
              {/* {!isEditing && (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 min-h-[48px] transition-colors"
                >
                  <PencilIcon />
                  Edit Profile
                </button>
              )} */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <UserIcon className="text-primary shrink-0" />
                  <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                </div>
                <div className="space-y-4">
                  {personalFieldConfig.map((f) => {
                    const Icon = f.Icon;
                    const value = personal[f.key];
                    const isSalary = f.key === "salary";
                    return (
                      <div
                        key={f.key}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                          isSalary ? "bg-[#C8E6C9]/50 border border-[#A5D6A7]" : "bg-[#E8F5E9] border border-[#C8E6C9]"
                        }`}
                      >
                        <Icon className="text-primary shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500 mb-0.5">{f.label}</p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => updatePersonal(f.key, e.target.value)}
                              className="w-full text-sm font-semibold text-gray-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
                              placeholder={f.label}
                            />
                          ) : (
                            <p className="text-sm font-semibold text-gray-900">{displayOrDash(value)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <MapPinIcon className="text-primary shrink-0" />
                  <h2 className="text-lg font-bold text-gray-900">Address Information</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9]">
                    <HomeIcon className="text-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">Street Address</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={street}
                          onChange={(e) => setStreet(e.target.value.slice(0, 500))}
                          className="w-full text-sm font-semibold text-gray-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
                          placeholder="Street Address"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">{displayOrDash(street)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9]">
                    <BuildingIcon className="text-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">PIN code</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={cityState}
                          onChange={(e) => setCityState(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          className="w-full text-sm font-semibold text-gray-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
                          placeholder="PIN code"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">{displayOrDash(cityState)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 min-h-[48px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 min-h-[48px] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
