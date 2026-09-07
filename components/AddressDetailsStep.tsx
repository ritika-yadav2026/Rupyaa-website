"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
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
import NeedContactSupport from "./NeedContactSupport";
import ValidatedTextInput from "./ValidatedTextInput";

type Props = { onContinue?: () => void };

type FieldErrors = {
  addressLine1?: string;
  addressLine2?: string;
  pinCode?: string;
  city?: string;
  state?: string;
};

const PINCODE_DEBOUNCE_MS = 300;

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

  const inputBase =
    "w-full px-4 py-3 rounded-xl border text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[48px]";
  const inputError = "border-red-500";
  const inputNormal = "border-gray-200";
  const readOnlyInput = "bg-gray-50 text-gray-700";

  const isSubmitting = submitMutation.isPending;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden max-w-2xl mx-auto w-full">

      <form className="pb-6 px-4 sm:px-6" onSubmit={handleSubmit} noValidate>
        <div className="flex items-center gap-2 rounded-t-xl bg-primary/10 px-4 py-3 border border-b-0 border-gray-200 -mx-4 sm:-mx-6 sm:rounded-t-2xl">
          <HomeIcon />
          <h3 className="text-sm font-bold text-gray-900">Address Details</h3>
        </div>

        <div className=" border-t-0 border-gray-200 rounded-b-xl -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 space-y-4">
          <div>
            <label htmlFor="addressLine1" className="text-sm font-medium text-gray-700 mb-1 block">
              Address Line 1 *
            </label>
            <ValidatedTextInput
              id="addressLine1"
              placeholder="House / Flat no., Street"
              value={addressLine1}
              policy="address"
              maxLength={500}
              onValueChange={(value) => {
                setAddressLine1(value);
                setErrors((prev) => ({ ...prev, addressLine1: undefined }));
              }}
              className={`${inputBase} ${errors.addressLine1 ? inputError : inputNormal}`}
              aria-invalid={!!errors.addressLine1}
              aria-describedby={errors.addressLine1 ? "addressLine1-error" : undefined}
            />
            {errors.addressLine1 && (
              <p id="addressLine1-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.addressLine1}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="addressLine2" className="text-sm font-medium text-gray-700 mb-1 block">
              Address Line 2 *
            </label>
            <ValidatedTextInput
              id="addressLine2"
              placeholder="Area, Landmark"
              value={addressLine2}
              policy="address"
              maxLength={500}
              onValueChange={(value) => {
                setAddressLine2(value);
                setErrors((prev) => ({ ...prev, addressLine2: undefined }));
              }}
              className={`${inputBase} ${errors.addressLine2 ? inputError : inputNormal}`}
              aria-invalid={!!errors.addressLine2}
              aria-describedby={errors.addressLine2 ? "addressLine2-error" : undefined}
            />
            {errors.addressLine2 && (
              <p id="addressLine2-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.addressLine2}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="pinCode" className="text-sm font-medium text-gray-700 mb-1 block">
              Pincode *
            </label>
            <div
              className={`flex rounded-xl border overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary ${
                errors.pinCode ? inputError : inputNormal
              }`}
            >
              <input
                id="pinCode"
                type="tel"
                inputMode="numeric"
                placeholder="6-digit pincode"
                value={pinCode}
                onChange={(e) => {
                  setPinCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setErrors((prev) => ({ ...prev, pinCode: undefined }));
                }}
                className="flex-1 px-4 py-3 min-h-[48px] focus:outline-none"
                aria-invalid={!!errors.pinCode}
                aria-describedby={errors.pinCode ? "pinCode-error" : lookupMessage ? "pinCode-lookup" : undefined}
              />
              {lookupLoading && (
                <span className="flex items-center px-3" aria-hidden="true">
                  <Spinner />
                </span>
              )}
            </div>
            {errors.pinCode && (
              <p id="pinCode-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.pinCode}
              </p>
            )}
            {!errors.pinCode && lookupMessage && (
              <p id="pinCode-lookup" className="text-sm text-amber-600 mt-1">
                {lookupMessage}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="text-sm font-medium text-gray-700 mb-1 block">
                City *
              </label>
              <input
                id="city"
                type="text"
                placeholder="Auto-filled from pincode"
                value={city}
                readOnly
                className={`${inputBase} ${readOnlyInput} ${errors.city ? inputError : inputNormal}`}
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? "city-error" : undefined}
              />
              {errors.city && (
                <p id="city-error" className="text-sm text-red-600 mt-1" role="alert">
                  {errors.city}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="state" className="text-sm font-medium text-gray-700 mb-1 block">
                State *
              </label>
              <input
                id="state"
                type="text"
                placeholder="Auto-filled from pincode"
                value={state}
                readOnly
                className={`${inputBase} ${readOnlyInput} ${errors.state ? inputError : inputNormal}`}
                aria-invalid={!!errors.state}
                aria-describedby={errors.state ? "state-error" : undefined}
              />
              {errors.state && (
                <p id="state-error" className="text-sm text-red-600 mt-1" role="alert">
                  {errors.state}
                </p>
              )}
            </div>
          </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </button>
        </div>

      </form>

      <NeedContactSupport />
    </div>
  );
}
