"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  sanitizeTextInput,
  validateRequired,
  validateStreetAddress,
  validatePincodeString,
} from "@/lib/validation";
import {
  getCityStateFromPincode,
  type PincodeLookupResult,
} from "@/lib/pincode-service";
import {
  postResidenceAddress,
  type PostResidenceAddressPayload,
} from "@/lib/user-api";
import AppButton from "@/components/app-button";
import AppTextField from "@/components/app-text-field";
import NeedContactSupport from "./NeedContactSupport";

type Props = { onContinue?: () => void };

type FieldErrors = {
  addressLine1?: string;
  addressLine2?: string;
  pinCode?: string;
  city?: string;
  state?: string;
};

const PINCODE_DEBOUNCE_MS = 300;
const ADDRESS_MAX_LENGTH = 500;

const LOOKUP_FAILURE_COPY: Record<
  Extract<PincodeLookupResult, { ok: false }>["reason"],
  string
> = {
  invalid: "Enter a valid 6-digit pincode",
  not_found: "We couldn't find that pincode. Please check and try again.",
  network_error: "Couldn't reach the pincode service. Please retry.",
  timeout: "Pincode lookup took too long. Please retry.",
};

function HomeIcon({ className = "text-primary" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin text-gray-500"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" />
    </svg>
  );
}

export default function AddressDetailsStep({ onContinue }: Props) {
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);

  const lastLookupPincodeRef = useRef<string>("");
  const activeLookupRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = pinCode.replace(/\D/g, "");
    if (trimmed.length !== 6) {
      activeLookupRef.current?.abort();
      activeLookupRef.current = null;
      if (lastLookupPincodeRef.current && lastLookupPincodeRef.current !== trimmed) {
        setCity("");
        setState("");
        lastLookupPincodeRef.current = "";
      }
      setLookupLoading(false);
      setLookupMessage(null);
      return;
    }
    if (trimmed === lastLookupPincodeRef.current) return;

    const controller = new AbortController();
    activeLookupRef.current?.abort();
    activeLookupRef.current = controller;

    const timeoutId = setTimeout(async () => {
      setLookupLoading(true);
      setLookupMessage(null);
      const result = await getCityStateFromPincode(trimmed, controller.signal);
      if (controller.signal.aborted) return;
      setLookupLoading(false);
      if (result.ok) {
        setCity(result.city);
        setState(result.state);
        setLookupMessage(null);
        lastLookupPincodeRef.current = trimmed;
        setErrors((prev) => ({ ...prev, pinCode: undefined, city: undefined, state: undefined }));
      } else {
        setCity("");
        setState("");
        lastLookupPincodeRef.current = "";
        setLookupMessage(LOOKUP_FAILURE_COPY[result.reason]);
      }
    }, PINCODE_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [pinCode]);

  const submitMutation = useMutation({
    mutationFn: postResidenceAddress,
    onSuccess: () => {
      toast.success("Address saved");
      onContinue?.();
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to save address");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addressLine1Err =
      validateRequired(addressLine1, "Address Line 1") ?? validateStreetAddress(addressLine1);
    const addressLine2Err =
      validateRequired(addressLine2, "Address Line 2") ?? validateStreetAddress(addressLine2);
    const pinCodeErr = validatePincodeString(pinCode);
    const cityErr = validateRequired(city, "City");
    const stateErr = validateRequired(state, "State");
    const newErrors: FieldErrors = {};
    if (addressLine1Err) newErrors.addressLine1 = addressLine1Err;
    if (addressLine2Err) newErrors.addressLine2 = addressLine2Err;
    if (pinCodeErr) newErrors.pinCode = pinCodeErr;
    if (cityErr) newErrors.city = cityErr;
    if (stateErr) newErrors.state = stateErr;
    setErrors(newErrors);
    if (addressLine1Err || addressLine2Err || pinCodeErr || cityErr || stateErr) return;

    const payload: PostResidenceAddressPayload = {
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      pinCode: pinCode.replace(/\D/g, "").slice(0, 6),
      city: city.trim(),
      state: state.trim(),
    };
    submitMutation.mutate(payload);
  };

  const isSubmitting = submitMutation.isPending;

  let submitLabel: string;
  if (isSubmitting) {
    submitLabel = "Saving...";
  } else {
    submitLabel = "Continue";
  }

  let pinCodeLookupContent: ReactNode = null;
  if (!errors.pinCode && lookupMessage) {
    pinCodeLookupContent = (
      <p id="pinCode-lookup" className="text-sm text-amber-600">
        {lookupMessage}
      </p>
    );
  }

  let lookupSpinner: ReactNode = null;
  if (lookupLoading) {
    lookupSpinner = (
      <span className="pointer-events-none absolute right-4 top-[2.65rem]" aria-hidden="true">
        <Spinner />
      </span>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#FFF4D9] overflow-hidden max-w-2xl mx-auto w-full">
      <form className="pb-6 px-4 sm:px-6" onSubmit={handleSubmit} noValidate>
        <div className="flex items-center gap-2 rounded-t-xl bg-[#FFE398] px-4 py-3 border border-b-0 border-[#FFF4D9] -mx-4 sm:-mx-6 sm:rounded-t-2xl">
          <HomeIcon />
          <h3 className="text-sm font-bold text-gray-900">Address Details</h3>
        </div>

        <div className="border-t-0 border-gray-200 rounded-b-xl -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 space-y-4">
          <AppTextField
            id="addressLine1"
            label="Address Line 1 *"
            placeholder="House / Flat no., Street"
            value={addressLine1}
            maxLength={ADDRESS_MAX_LENGTH}
            error={errors.addressLine1}
            onChange={(e) => {
              const value = sanitizeTextInput(e.target.value, "address").slice(0, ADDRESS_MAX_LENGTH);
              setAddressLine1(value);
              setErrors((prev) => ({ ...prev, addressLine1: undefined }));
            }}
          />

          <AppTextField
            id="addressLine2"
            label="Address Line 2 *"
            placeholder="Area, Landmark"
            value={addressLine2}
            maxLength={ADDRESS_MAX_LENGTH}
            error={errors.addressLine2}
            onChange={(e) => {
              const value = sanitizeTextInput(e.target.value, "address").slice(0, ADDRESS_MAX_LENGTH);
              setAddressLine2(value);
              setErrors((prev) => ({ ...prev, addressLine2: undefined }));
            }}
          />

          <div className="relative flex flex-col gap-2">
            <AppTextField
              id="pinCode"
              label="Pincode *"
              type="tel"
              inputMode="numeric"
              placeholder="6-digit pincode"
              value={pinCode}
              error={errors.pinCode}
              inputClassName={lookupLoading ? "pr-10" : undefined}
              onChange={(e) => {
                setPinCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                setErrors((prev) => ({ ...prev, pinCode: undefined }));
              }}
            />
            {lookupSpinner}
            {pinCodeLookupContent}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppTextField
              id="city"
              label="City *"
              type="text"
              placeholder="Auto-filled from pincode"
              value={city}
              readOnly
              error={errors.city}
              inputClassName="bg-gray-50 text-gray-700"
            />
            <AppTextField
              id="state"
              label="State *"
              type="text"
              placeholder="Auto-filled from pincode"
              value={state}
              readOnly
              error={errors.state}
              inputClassName="bg-gray-50 text-gray-700"
            />
          </div>

          <AppButton type="submit" fullWidth disabled={isSubmitting} className="mt-6">
            {submitLabel}
          </AppButton>
        </div>
      </form>

      <NeedContactSupport />
    </div>
  );
}
