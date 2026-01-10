// src/hooks/useFormValidation.js
import { useMemo } from "react";

export function useFormValidation(lead, startDate, travellers, accepted) {
  // Email validation with useMemo
  const emailValid = useMemo(() => {
    return /^\S+@\S+\.\S+$/.test(lead?.email || "");
  }, [lead?.email]);

  // Phone validation with useMemo
  const phoneValid = useMemo(() => {
    return /^\+?\d{10,15}$/.test((lead?.phone || "").replace(/[\s()-]/g, ""));
  }, [lead?.phone]);

  const showEmailError = lead?.email && !emailValid;
  const showPhoneError = lead?.phone && !phoneValid;

  // Form validation with all dependencies
  const formValid = useMemo(() => {
    const isValid = (
      startDate &&
      travellers > 0 &&
      lead?.firstName?.trim() &&
      lead?.lastName?.trim() &&
      emailValid &&
      phoneValid &&
      accepted
    );

    // Debug log - remove after fixing
    console.log("🔍 Form Validation:", {
      startDate: !!startDate,
      travellers: travellers > 0,
      firstName: !!lead?.firstName?.trim(),
      lastName: !!lead?.lastName?.trim(),
      emailValid,
      phoneValid,
      accepted,
      OVERALL: isValid
    });

    return isValid;
  }, [startDate, travellers, lead?.firstName, lead?.lastName, emailValid, phoneValid, accepted]);

  return {
    emailValid,
    phoneValid,
    showEmailError,
    showPhoneError,
    formValid,
  };
}
