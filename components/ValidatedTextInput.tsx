import type { ChangeEvent, InputHTMLAttributes } from "react";
import {
  sanitizeTextInput,
  type TextCharacterPolicy,
} from "@/lib/validation";

type ValidatedTextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type" | "value"
> & {
  value: string;
  policy: TextCharacterPolicy;
  onValueChange: (value: string) => void;
};

export default function ValidatedTextInput({
  value,
  policy,
  onValueChange,
  maxLength,
  ...inputProps
}: ValidatedTextInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let nextValue = sanitizeTextInput(event.target.value, policy);
    if (maxLength !== undefined) {
      nextValue = nextValue.slice(0, maxLength);
    }
    onValueChange(nextValue);
  };

  return (
    <input
      {...inputProps}
      type="text"
      value={value}
      maxLength={maxLength}
      onChange={handleChange}
    />
  );
}
