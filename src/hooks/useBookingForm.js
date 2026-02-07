// src/hooks/useBookingForm.js
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { createBooking, createBookingIntent } from "../api/service/bookingServices.js";
import { correctEndDate } from "../api/service/helper.js";

countries.registerLocale(enLocale);

export function useBookingForm(trek, hero) {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDeparture, setSelectedDeparture] = useState(null); // ✅ Track selected departure
  const [travellers, setTravellers] = useState(1);
  const [departureTime, setDepartureTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const countryList = useMemo(() => {
    const names = countries.getNames("en", { select: "official" });
    return Object.entries(names)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // ✅ NO DATE CALCULATION - removed useEffect that calculated endDate

  // Pre-fill from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    try {
      const user = JSON.parse(storedUser);
      setLead((prev) => ({
        ...prev,
        email: prev.email || user?.email || "",
        phone: prev.phone || user?.profile?.phone_number || "",
      }));
    } catch (error) {
      // ignore
    }
  }, []);

  const changeLead = (e) =>
    setLead((l) => ({ ...l, [e.target.name]: e.target.value }));

  const changePreferences = (e) =>
    setPreferences((p) => ({ ...p, [e.target.name]: e.target.value }));

  const formatCurrency = (amt, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amt);

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

  // ✅ NEW: Handle departure selection from dropdown
  const handleDepartureSelect = (departure) => {
    // ✅ CORRECT the date HERE before setting state
    const correctedEnd = correctEndDate(departure.end);

    setStartDate(departure.start);
    setEndDate(correctedEnd);  // ✅ Use corrected date
  };


  const handleBookingSubmit = async (e, formValid, totalPrice, trekSlug, currency = "USD") => {
    e.preventDefault();

    if (!formValid) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!trekSlug) {
      toast.error("Missing trek details. Please try again from the trek page.");
      return;
    }

    // ✅ Validate dates are set
    if (!startDate || !endDate) {
      toast.error("Please select departure dates.");
      return;
    }

    setSubmitting(true);

    try {
      let phoneNumber = lead.phone.trim();
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = `+977${phoneNumber}`;
      }

      console.log("📤 Creating booking intent...");

      const intent = await createBookingIntent({
        trekSlug,
        partySize: travellers,
        email: lead.email.trim(),
        phone: phoneNumber,
      });

      console.log("✅ Intent created:", intent);

      const leadName = `${lead.title} ${lead.firstName} ${lead.lastName}`.trim();

      console.log("📤 Creating booking with dates from API:", {
        startDate,
        endDate,
        departureId: selectedDeparture?.id,
      });

      const booking = await createBooking({
        trekSlug,
        bookingIntent: intent.booking_id,
        partySize: travellers,
        startDate,
        endDate,
        leadName,
        leadEmail: lead.email.trim(),
        leadPhone: phoneNumber,
        leadTitle: lead.title,
        leadFirstName: lead.firstName.trim(),
        leadLastName: lead.lastName.trim(),
        country: lead.country || "",
        emergencyContact: lead.emergencyContact || "",
        dietaryRequirements: lead.dietaryReqs || "",
        medicalConditions: lead.medicalConditions || "",
        experienceLevel: lead.experience,
        guideLanguage: preferences.guide,
        specialRequests: preferences.specialRequests || "",
        comments: preferences.comments || "",
        departureTime: departureTime || null,
        returnTime: returnTime || null,
        currency,
        notes: preferences.comments || preferences.specialRequests || "",
        metadata: {
          title: lead.title,
          first_name: lead.firstName,
          last_name: lead.lastName,
          country: lead.country,
          emergency_contact: lead.emergencyContact,
          dietary_requirements: lead.dietaryReqs,
          medical_conditions: lead.medicalConditions,
          experience: lead.experience,
          special_requests: preferences.specialRequests,
          comments: preferences.comments,
          departure_time: departureTime,
          return_time: returnTime,
          departure_id: selectedDeparture?.id, // ✅ Send departure ID if available
        },
      });

      console.log("✅ Booking created successfully:", booking);

      navigate("/payment", {
        replace: true,
        state: {
          bookingRef: booking.booking_ref,
          bookingId: intent.booking_id,
          trekSlug,
          trekName: trek?.title || trek?.name || "Your Trek",
          startDate,
          endDate,
          travellers,
          totalPrice,
          currency,
          initialPayment: (totalPrice * 0.20).toFixed(2),
          dueAmount: (totalPrice * 0.80).toFixed(2),
        },
      });

      toast.success("Booking created successfully! Redirecting to payment...");

    } catch (error) {
      console.error("❌ Booking error:", error);

      const message = error.message || "Unable to start booking. Please try again.";
      toast.error(message);

      if (
        message.toLowerCase().includes("session expired") ||
        message.toLowerCase().includes("login required") ||
        message.toLowerCase().includes("unauthorized")
      ) {
        const next = encodeURIComponent(`/trek-booking?trekSlug=${trekSlug}`);
        navigate(`/login?next=${next}`, { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate, // ✅ Still expose this for manual date input
    selectedDeparture,
    handleDepartureSelect, // ✅ NEW: Expose departure handler
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
    submitting,
    countryList,
    formatCurrency,
    formatNepalTime,
    handleBookingSubmit,
  };
}
