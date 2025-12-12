import { useState } from "react";

/**
 * Basic input sanitizer – strips tags, scripts, and unsafe attributes.
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";

  return input
    .replace(/<script.*?>.*?<\/script>/gi, "") // remove <script>...</script>
    .replace(/<\/?[^>]+(>|$)/g, "") // remove HTML tags
    .replace(/on\w+="[^"]*"/gi, "") // remove inline JS (onclick, etc.)
    .replace(/javascript:[^"']*/gi, "") // remove javascript: URLs
    .trim()
    .replace(/\s+/g, " "); // normalize whitespace
}

/**
 * Recursively sanitizes all string fields within an object.
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

type ValidatorFn<T, E extends Record<string, string | undefined> = Partial<Record<keyof T, string>>> = (
  values: T,
) => E;

/**
 * Hook for managing and sanitizing form data.
 * Automatically sanitizes input values when changed or on submit.
 */
export function useSanitizedForm<
  T extends Record<string, any>,
  E extends Record<string, string | undefined> = Partial<Record<keyof T, string>>,
>(initialState: T, validate?: ValidatorFn<T, E>) {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<E>(() => ({}) as E); //The type here means “an object whose keys are the same as the keys of T, and whose values are strings.”, all keys optional because of Partial

  // Handle controlled input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // If a validation function is provided, run it on each keystroke
      if (validate) {
        const newErrors = validate(updated);
        setErrors(newErrors);
      }

      return updated;
    });
  }

  // Return fully sanitized version of the current form data
  function getSanitizedData(): T {
    return sanitizeObject(formData);
  }

  // Reset to initial state if needed
  function resetForm() {
    setFormData(initialState);
    setErrors({} as E);
  }

  function isEmpty(obj: T) {
    //check that each field in obj is empty
    const isEmpty = Object.values(obj).every(
      (value) =>
        value === "" || value === null || value === undefined || (typeof value === "number" && value === 0),
    );
    return isEmpty;
  }

  return {
    formData,
    handleChange,
    getSanitizedData,
    resetForm,
    setFormData,
    errors,
    setErrors,
    isValid: Object.keys(errors).length === 0, // exposed in case you want manual control
    isEmpty: isEmpty(formData),
  };
}
