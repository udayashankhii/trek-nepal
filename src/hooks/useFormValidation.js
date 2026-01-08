// src/hooks/useFormValidation.js
import { useMemo } from "react";

/**
 * Custom hook for form validation with memoized results
 */
export function useFormValidation(lead, startDate, travellers, accepted) {
  const emailValid = useMemo(() => {
    if (!lead.email) return false;
    return /^\S+@\S+\.\S+$/.test(lead.email);
  }, [lead.email]);

  const phoneValid = useMemo(() => {
    if (!lead.phone) return false;
    return /^\+\d{1,3}\s?\d{4,14}$/.test(lead.phone);
  }, [lead.phone]);

  const formValid = useMemo(() => {
    return (
      startDate &&
      travellers > 0 &&
      lead.firstName.trim() &&
      lead.lastName.trim() &&
      emailValid &&
      phoneValid &&
      accepted
    );
  }, [startDate, travellers, lead.firstName, lead.lastName, emailValid, phoneValid, accepted]);

  return {
    emailValid,
    phoneValid,
    formValid,
    showEmailError: lead.email && !emailValid,
    showPhoneError: lead.phone && !phoneValid,
  };
}
