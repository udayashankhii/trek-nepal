// src/hooks/useBookingForm.js
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

/**
 * Parse duration string to extract number of days
 */
function parseDurationDays(duration) {
  if (!duration) return 16;
  const match = String(duration).match(/\d+/);
  return match ? parseInt(match[0], 10) : 16;
}

/**
 * Custom hook for booking form state and business logic
 */
export function useBookingForm(trekData, hero) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const trekId = searchParams.get("trek_id") || "";

  // Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travellers, setTravellers] = useState(1);
  const [departureTime, setDepartureTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [accepted, setAccepted] = useState(false);

  const [lead, setLead] = useState({
    title: "Mr.",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    emergencyContact: "",
    dietaryReqs: "",
    medicalConditions: "",
    experience: "beginner",
  });

  const [preferences, setPreferences] = useState({
    guide: "english",
    specialRequests: "",
    comments: "",
  });

  // Country list with memoization
  const countryList = useMemo(() => {
    const names = countries.getNames("en", { select: "official" });
    return Object.entries(names)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Auto-calculate end date based on trek duration
  useEffect(() => {
    if (startDate && hero?.duration) {
      const days = parseDurationDays(hero.duration);
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + days);
      setEndDate(end.toISOString().split("T")[0]);
    } else {
      setEndDate("");
    }
  }, [startDate, hero?.duration]);

  // Handlers
  const changeLead = (e) => {
    const { name, value } = e.target;
    setLead((prev) => ({ ...prev, [name]: value }));
  };

  const changePreferences = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e, formValid, totalPrice) => {
    e.preventDefault();
    if (!formValid) return;

    navigate("/payment", {
      state: {
        trekId,
        startDate,
        endDate,
        travellers,
        totalPrice,
        lead,
        preferences,
        departureTime,
        returnTime,
      },
    });
  };

  // Utility functions
  const formatNepalTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Kathmandu",
      timeZoneName: "short",
    });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return {
    // State
    trekId,
    startDate,
    setStartDate,
    endDate,
    travellers,
    setTravellers,
    departureTime,
    setDepartureTime,
    returnTime,
    setReturnTime,
    lead,
    changeLead,
    preferences,
    changePreferences,
    accepted,
    setAccepted,
    countryList,
    // Methods
    handleSubmit,
    formatNepalTime,
    formatCurrency,
  };
}
