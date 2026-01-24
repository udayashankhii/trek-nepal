import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Globe,
  Info,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Star,
  User,
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { treksData } from "../../data/treksdata";
import countries from "../../data/countries";
import axiosInstance from "../../api/service/axiosInstance";

const flexOptions = [
  { value: "exact", label: "Exact date" },
  { value: "plus_3", label: "± 3 days" },
  { value: "plus_7", label: "± 1 week" },
  { value: "flexible", label: "Flexible / Open" },
];

const accommodations = [
  { value: "standard", label: "Standard teahouse", description: "Simple, authentic lodges" },
  { value: "comfort", label: "Comfort", description: "Better rooms where possible" },
  { value: "luxury", label: "Luxury", description: "Best available hotels/lodges" },
];

const addOns = [
  {
    id: "acclimatizationDay",
    label: "Extra acclimatization day",
    description: "More time to rest and acclimatize",
  },
  {
    id: "sideTrip",
    label: "Side trip / viewpoint hike",
    description: "Add nearby highlights or viewpoints",
  },
  {
    id: "airportPickup",
    label: "Kathmandu airport pickup",
    description: "Meet & greet service at the airport",
  },
  {
    id: "katSightseeing",
    label: "Kathmandu sightseeing day",
    description: "Discover the valley before or after the trek",
  },
  {
    id: "helicopterReturn",
    label: "Helicopter return",
    description: "Quote-based final section",
    quoteBased: true,
  },
];

const budgetOptions = [
  { value: "budget", label: "Budget" },
  { value: "mid", label: "Mid-range" },
  { value: "premium", label: "Premium" },
  { value: "flexible", label: "Flexible / Not sure" },
];

const regionOptions = [
  { value: "everest", label: "Everest" },
  { value: "annapurna", label: "Annapurna" },
  { value: "langtang", label: "Langtang" },
  { value: "manaslu", label: "Manaslu" },
  { value: "dolpo", label: "Dolpo" },
  { value: "not-sure", label: "Not sure" },
];

const initialForm = {
  tripSelection: "",
  tripDisplayName: "",
  preferredRegion: "",
  preferredStartDate: "",
  dateFlexibility: "exact",
  duration: 10,
  adults: 1,
  children: 0,
  privateTrip: true,
  accommodation: "comfort",
  transport: "",
  guide: true,
  porter: "shared",
  addOns: [],
  name: "",
  email: "",
  phone: "",
  country: "",
  fitness: "",
  budget: "flexible",
  specialRequests: "",
  consent: false,
};

const stepDetails = [
  { id: 1, title: "Trip Basics", description: "Dates, group size and the perfect starting trek" },
  { id: 2, title: "Services", description: "Accommodation, transport, guide, and porter preferences" },
  { id: 3, title: "Contact & Notes", description: "Tell us how to reach you and any special requests" },
];

const getTransportOptions = (selectedTrek) => {
  const options = ["Tourist bus", "Private jeep"];
  if (!selectedTrek) {
    options.push("Domestic flight", "Helicopter");
    return Array.from(new Set(options));
  }
  if (["everest", "manaslu", "langtang", "mustang", "dolpo"].includes(selectedTrek.region)) {
    options.push("Domestic flight");
  }
  if (["everest", "dolpo"].includes(selectedTrek.region)) {
    options.push("Helicopter");
  }
  options.push("Domestic flight", "Helicopter");
  return Array.from(new Set(options));
};

const formatDate = (value) => {
  if (!value) return "Flexible / TBD";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
};

const formatRegionLabel = (value) => {
  if (!value) return "Region";
  return value
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};

const formatDurationLabel = (value) => {
  if (!value) return "Custom duration";
  return value.toString();
};

const flattenApiError = (errorPayload) => {
  if (!errorPayload) return null;
  if (typeof errorPayload === "string") return errorPayload;
  if (Array.isArray(errorPayload)) return errorPayload.join(" ");
  const entries = Object.entries(errorPayload)
    .map(([_, value]) => {
      if (Array.isArray(value)) {
        return value.join(" ");
      }
      if (typeof value === "object" && value !== null) {
        return flattenApiError(value);
      }
      return value;
    })
    .filter(Boolean);
  return entries.join(" ");
};

const validateEmail = (value) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(value);
};

export default function CustomizeTripPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [availableTreks, setAvailableTreks] = useState(() =>
    treksData.map((trek) => ({
      slug: trek.slug,
      name: trek.name,
      region: trek.region,
      duration: trek.duration,
    })),
  );
  const [treksLoading, setTreksLoading] = useState(true);
  const [treksError, setTreksError] = useState("");
  const [trekSearch, setTrekSearch] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [fromTrekPage, setFromTrekPage] = useState(false);
  const fieldRefs = useRef({});
  const suggestionsRef = useRef(null);
  const queryTripSlug = searchParams.get("trip") || searchParams.get("trek") || searchParams.get("trek_id");
  const locationTrekSlug = location.state?.trekId;
  const preselectSlug = queryTripSlug || locationTrekSlug || "";

  const registerField = (key) => (element) => {
    if (element) {
      fieldRefs.current[key] = element;
    }
  };

  const selectedTrek = useMemo(() => {
    return availableTreks.find((trek) => trek.slug === form.tripSelection);
  }, [availableTreks, form.tripSelection]);

  const transportOptions = useMemo(() => getTransportOptions(selectedTrek), [selectedTrek]);

  useEffect(() => {
    if (transportOptions.length && !transportOptions.includes(form.transport)) {
      setForm((prev) => ({ ...prev, transport: transportOptions[0] }));
    }
  }, [transportOptions, form.transport]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadTreks = async () => {
      try {
        setTreksLoading(true);
        const response = await axiosInstance.get("treks/", {
          params: {
            page_size: 60,
            q: trekSearch.trim() || undefined,
          },
          signal: controller.signal,
        });
        const payload = response.data ?? response;
        const list = payload?.results ?? payload?.items ?? payload;
        if (!Array.isArray(list)) {
          throw new Error("Unexpected trek list format");
        }
        const normalized = list
          .map((trek) => ({
            slug: trek.slug,
            name: trek.title || trek.name,
            region: trek.region || "",
            duration:
              trek.duration ||
              trek.summary?.duration ||
              trek.duration_days ||
              trek.duration_in_days ||
              "",
          }))
          .filter((trek) => trek.slug && trek.name)
          .sort((a, b) => a.name.localeCompare(b.name));
        if (isMounted) {
          setAvailableTreks(normalized);
          setTreksError("");
        }
      } catch (error) {
        if (isMounted && !controller.signal.aborted) {
          console.error("Unable to load treks for customize form:", error);
          setTreksError("Unable to load trek catalog. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setTreksLoading(false);
        }
      }
    };

    const timer = setTimeout(loadTreks, 350);
    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [trekSearch]);

  useEffect(() => {
    if (!preselectSlug) return;
    setFromTrekPage(Boolean(queryTripSlug));
    setForm((prev) => {
      const matched = availableTreks.find((trek) => trek.slug === preselectSlug);
      return {
        ...prev,
        tripSelection: matched ? matched.slug : preselectSlug,
        tripDisplayName: matched
          ? matched.name
          : prev.tripDisplayName || preselectSlug,
      };
    });
  }, [availableTreks, preselectSlug, queryTripSlug]);

  useEffect(() => {
    if (!selectedTrek?.region) return;
    setForm((prev) => {
      if (prev.preferredRegion === selectedTrek.region) {
        return prev;
      }
      return {
        ...prev,
        preferredRegion: selectedTrek.region,
      };
    });
  }, [selectedTrek?.region, selectedTrek?.slug]);

  useEffect(() => {
    if (!location.state?.preferredDates || form.preferredStartDate) return;
    const preferred = location.state.preferredDates[0]?.start;
    if (preferred) {
      setForm((prev) => ({ ...prev, preferredStartDate: preferred }));
    }
  }, [location.state?.preferredDates, form.preferredStartDate]);

  useEffect(() => {
    if (!location.state?.tripName) return;
    if (form.tripDisplayName) return;
    setForm((prev) => ({ ...prev, tripDisplayName: location.state.tripName }));
  }, [location.state?.tripName, form.tripDisplayName]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setSuggestionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateStep = (step) => {
    const stepErrors = {};
    if (step === 1) {
      const hasTrip = Boolean(form.tripSelection && form.tripSelection !== "unknown");
      const regionSelected = Boolean(form.preferredRegion);
      const unsure = form.tripSelection === "unknown";
      if (!hasTrip && !regionSelected && !unsure) {
        stepErrors.tripSelection = "Select a trek, region, or choose \"I'm not sure yet\".";
      }
      if (!form.preferredStartDate) {
        if (!(unsure && form.dateFlexibility === "flexible")) {
          stepErrors.preferredStartDate = "Choose your ideal start date.";
        }
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = new Date(form.preferredStartDate);
        if (selected < today) {
          stepErrors.preferredStartDate = "Date cannot be in the past.";
        }
      }
      if (!form.duration || form.duration < 1 || form.duration > 60) {
        stepErrors.duration = "Duration must be between 1 and 60 days.";
      }
      if (!form.adults || form.adults < 1 || form.adults > 30) {
        stepErrors.adults = "Provide at least 1 adult (max 30).";
      }
      if (form.children < 0 || form.children > 20) {
        stepErrors.children = "Children must be between 0 and 20.";
      }
    }

    if (step === 2) {
      if (!form.accommodation) {
        stepErrors.accommodation = "Select an accommodation preference.";
      }
    }

    if (step === 3) {
      if (!form.name || form.name.trim().length < 2) {
        stepErrors.name = "Enter a name that we can address.";
      }
      if (!form.email || !validateEmail(form.email)) {
        stepErrors.email = "Use a valid email address.";
      }
      if (!form.phone || form.phone.trim().length < 6) {
        stepErrors.phone = "Please share your phone or WhatsApp number.";
      }
      if (!form.country) {
        stepErrors.country = "Let us know your country of residence.";
      }
      if (form.specialRequests.length > 2000) {
        stepErrors.specialRequests = "Keep this under 2000 characters.";
      }
      if (!form.consent) {
        stepErrors.consent = "We need your consent to proceed.";
      }
    }

    return stepErrors;
  };

  const scrollToFirstError = (errorMap) => {
    const firstKey = Object.keys(errorMap)[0];
    const element = fieldRefs.current[firstKey];
    if (element && element.scrollIntoView) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleNext = () => {
    const stepErrors = validateStep(activeStep);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      scrollToFirstError(stepErrors);
      return;
    }
    setErrors({});
    setActiveStep((prev) => Math.min(3, prev + 1));
  };

  const handleBack = () => {
    setErrors({});
    setActiveStep((prev) => Math.max(1, prev - 1));
  };

  const handleTripInput = (value) => {
    const normalized = value.trim().toLowerCase();
    const matched = availableTreks.find((trek) => trek.name.toLowerCase() === normalized);
    setTrekSearch(value);
    setSuggestionsOpen(true);
    if (value === "I'm not sure yet") {
      setForm((prev) => ({
        ...prev,
        tripSelection: "unknown",
        tripDisplayName: value,
      }));
      setSuggestionsOpen(false);
      return;
    }
    if (matched) {
      setForm((prev) => ({
        ...prev,
        tripSelection: matched.slug,
        tripDisplayName: matched.name,
        preferredRegion: matched.region || prev.preferredRegion,
      }));
      setSuggestionsOpen(false);
      return;
    }
    setForm((prev) => ({
      ...prev,
      tripSelection: "",
      tripDisplayName: value,
      preferredRegion: "",
    }));
  };

  const handleSuggestionSelect = (trek) => {
    setForm((prev) => ({
      ...prev,
      tripSelection: trek.slug,
      tripDisplayName: trek.name,
      preferredRegion: trek.region || prev.preferredRegion,
    }));
    setSuggestionsOpen(false);
    setTrekSearch("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submissionErrors = validateStep(activeStep);
    if (Object.keys(submissionErrors).length) {
      setErrors(submissionErrors);
      scrollToFirstError(submissionErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setServerError("");

    const source = location.state?.source || location.pathname;
    const payload = {
      trip_slug: selectedTrek?.slug || (form.tripSelection === "unknown" ? "custom" : form.tripSelection),
      trip_name:
        selectedTrek?.name ||
        (form.tripSelection === "unknown" ? "Not sure yet" : form.tripDisplayName),
      preferred_region: form.preferredRegion,
      preferred_start_date: form.preferredStartDate || null,
      date_flexibility: form.dateFlexibility,
      duration_days: form.duration,
      adults: form.adults,
      children: form.children,
      private_trip: form.privateTrip,
      accommodation: form.accommodation,
      transport: form.transport,
      guide_required: form.guide,
      porter_preference: form.porter,
      add_ons: form.addOns,
      special_requests: form.specialRequests,
      origin_url: window.location.href,
      source,
      contact_name: form.name,
      contact_email: form.email,
      contact_phone: form.phone,
      contact_country: form.country,
      fitness_level: form.fitness,
      budget: form.budget,
      consent_to_contact: form.consent,
    };

    try {
      const response = await axiosInstance.post("customize-trip/requests/", payload);
      const requestId =
        response.data.requestId ||
        response.data.id ||
        response.data.request_id ||
        `REQ-${Date.now().toString().slice(-5)}`;
      navigate(`/customize-trip/success/${requestId}`, {
        state: {
          summary: {
            tripName: payload.trip_name,
            date: payload.preferred_start_date,
            group: `${payload.adults} adults${payload.children ? `, ${payload.children} children` : ""}`,
          },
        },
      });
    } catch (error) {
      const defaultMessage = "Something went wrong. Please try again or contact us on WhatsApp.";
      let message = defaultMessage;
      if (error.response?.status === 401) {
        message = "Please log in to submit your request.";
      } else {
        const apiMessage = flattenApiError(error.response?.data);
        if (apiMessage) {
          message = apiMessage;
        } else if (error.response?.status === 429) {
          message = "Too many requests. Please try again in a few minutes.";
        }
      }
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = Object.keys(validateStep(activeStep)).length === 0;

  const summaryRows = [
    {
      label: "Trip",
      value:
        selectedTrek?.name ||
        (form.tripSelection === "unknown"
          ? "I’m not sure yet"
          : form.tripDisplayName || "Custom trek"),
    },
    {
      label: "Preferred date",
      value: formatDate(form.preferredStartDate),
    },
    {
      label: "Group",
      value: `${form.adults} adult${form.adults === 1 ? "" : "s"}${
        form.children ? `, ${form.children} child${form.children === 1 ? "" : "ren"}` : ""
      }`,
    },
    { label: "Accommodation", value: accommodations.find((a) => a.value === form.accommodation)?.label || "Comfort" },
    { label: "Transport", value: form.transport || "Any available" },
    { label: "Guide", value: form.guide ? "Yes" : "No" },
    { label: "Porter", value: form.porter.replace(/([A-Z])/g, " $1").trim() },
    {
      label: "Add-ons",
      value: form.addOns.length
        ? form.addOns
            .map((id) => addOns.find((addOn) => addOn.id === id)?.label || id)
            .join(", ")
        : "Not yet",
    },
  ];

  const summaryTitle = "Your Request Summary";

  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10 pb-16 lg:py-14">
        <header className="mb-8 min-h-[92px] rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900/90 to-slate-900/70 px-6 py-4 text-center shadow-lg lg:px-8">
          <div className="space-y-2 text-white">
            <p className="text-xs uppercase tracking-[0.6em] text-slate-200">Customize Trip</p>
            <h1 className="text-3xl font-semibold">Customize Your Trip</h1>
            <p className="mx-auto max-w-3xl text-sm text-slate-200/90">
              Tell us what you want. We’ll create the best plan and quote. Drafts auto-save so you can return anytime.
            </p>
          </div>
        </header>

        <section className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 lg:p-10">
          <div className="space-y-6">
            <div className="grid gap-3 md:grid-cols-3">
              {stepDetails.map((step) => (
                <div
                  key={step.id}
                  className={`rounded-2xl border px-4 py-3 transition-all ${
                    activeStep === step.id ? "border-amber-400 bg-amber-50 shadow" : "border-slate-200 bg-slate-50/80"
                  }`}
                >
                  <p className="text-xs font-semibold tracking-[0.3em] text-slate-500">Step {step.id}</p>
                  <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
              ))}
            </div>

            {serverError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}{" "}
                <a
                  className="font-semibold underline"
                  href="https://wa.me/9779801234567"
                  target="_blank"
                  rel="noreferrer"
                >
                  Contact us on WhatsApp
                </a>
                .
              </div>
            )}

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <fieldset disabled={isSubmitting} className="space-y-6" aria-busy={isSubmitting}>
                    {errors && Object.keys(errors).length > 0 && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        We found some issues. Please fix the highlighted fields before continuing.
                      </div>
                    )}

                    {activeStep === 1 && (
                      <div className="space-y-6">
                        <div ref={registerField("tripSelection")}>
                          <label className="font-semibold text-slate-700 flex items-center gap-2">
                            <Info size={16} className="text-slate-400" />
                            Select a trek
                          </label>
                          <div ref={suggestionsRef} className="relative">
                            <input
                              value={form.tripDisplayName}
                              onChange={(event) => handleTripInput(event.target.value)}
                              onFocus={() => setSuggestionsOpen(true)}
                              className={`mt-2 w-full rounded-2xl border px-4 py-3 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/70 ${
                                errors.tripSelection ? "border-red-300" : "border-slate-200"
                              }`}
                              placeholder="Start typing to search..."
                            />
                            {suggestionsOpen && (
                              <div
                                className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg"
                              >
                                {treksLoading ? (
                                  <p className="px-4 py-3 text-xs text-slate-400">
                                    Loading trek catalog…
                                  </p>
                                ) : availableTreks.length === 0 ? (
                                  <p className="px-4 py-3 text-xs text-rose-500">
                                    {treksError || "No treks found."}
                                  </p>
                                ) : (
                                  availableTreks.slice(0, 8).map((trek) => (
                                    <button
                                      type="button"
                                      key={trek.slug}
                                      onMouseDown={() => handleSuggestionSelect(trek)}
                                      className="w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                                    >
                                      <div className="flex items-center justify-between font-semibold">
                                        <span>{trek.name}</span>
                                        {trek.duration && (
                                          <span className="text-xs text-slate-500">
                                            {formatDurationLabel(trek.duration)}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-400">
                                        {formatRegionLabel(trek.region)}
                                      </p>
                                    </button>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                          {treksError && (
                            <p className="mt-2 text-xs text-rose-500">{treksError}</p>
                          )}
                          {fromTrekPage && (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                              From trek page
                            </span>
                          )}
                          {form.tripSelection === "unknown" && (
                            <p className="mt-2 text-sm text-slate-500">
                              No worries — we’ll recommend the best trek based on your preferences.
                            </p>
                          )}
                          {errors.tripSelection && (
                            <p className="mt-2 text-sm text-red-600">{errors.tripSelection}</p>
                          )}
                        </div>

                        {!selectedTrek && (
                          <div>
                            <label className="font-semibold text-slate-700">Preferred region (optional)</label>
                            <select
                              name="preferredRegion"
                              value={form.preferredRegion}
                              onChange={(event) =>
                                setForm((prev) => ({ ...prev, preferredRegion: event.target.value }))
                              }
                              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
                            >
                              <option value="">Choose a region</option>
                              {regionOptions.map((region) => (
                                <option key={region.value} value={region.value}>
                                  {region.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                          <div ref={registerField("preferredStartDate")}> 
                            <label className="font-semibold text-slate-700 flex items-center gap-2">
                              <Calendar size={16} className="text-slate-400" />
                              Preferred start date
                            </label>
                            <input
                              type="date"
                              value={form.preferredStartDate}
                              onChange={(event) =>
                                setForm((prev) => ({ ...prev, preferredStartDate: event.target.value }))
                              }
                              className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/70 ${
                                errors.preferredStartDate ? "border-red-300" : "border-slate-200"
                              }`}
                            />
                            <p className="mt-1 text-sm text-slate-500">Choose your ideal start date.</p>
                            {form.tripSelection === "unknown" && form.dateFlexibility === "flexible" && (
                              <p className="text-sm text-slate-400">Date is optional when flexibility is open.</p>
                            )}
                            {errors.preferredStartDate && (
                              <p className="mt-1 text-sm text-red-600">{errors.preferredStartDate}</p>
                            )}
                          </div>
                          <div>
                            <label className="font-semibold text-slate-700">How flexible are you?</label>
                            <div className="mt-2 grid gap-2">
                              {flexOptions.map((option) => (
                                <label
                                  key={option.value}
                                  className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-slate-700 transition ${
                                    form.dateFlexibility === option.value
                                      ? "border-amber-400 bg-amber-50"
                                      : "border-slate-200 bg-white"
                                  }`}
                                >
                                  <span className="text-sm font-semibold">{option.label}</span>
                                  <input
                                    type="radio"
                                    name="dateFlexibility"
                                    value={option.value}
                                    checked={form.dateFlexibility === option.value}
                                    onChange={(event) =>
                                      setForm((prev) => ({ ...prev, dateFlexibility: event.target.value }))
                                    }
                                    className="hidden"
                                  />
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div ref={registerField("duration")}> 
                            <div className="flex items-center justify-between">
                              <label className="font-semibold text-slate-700">Trip duration (days)</label>
                              <span className="text-xs uppercase tracking-[0.5em] text-slate-400">1–60</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setForm((prev) => ({
                                    ...prev,
                                    duration: Math.max(1, prev.duration - 1),
                                  }))
                                }
                                className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-lg font-semibold text-slate-600 shadow-sm"
                              >
                                –
                              </button>
                              <input
                                type="number"
                                min={1}
                                max={60}
                                value={form.duration}
                                onChange={(event) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    duration: Math.min(60, Math.max(1, Number(event.target.value) || 1)),
                                  }))
                                }
                                className={`flex-1 rounded-2xl border px-4 py-3 text-center text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/70 ${
                                  errors.duration ? "border-red-300" : "border-slate-200"
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setForm((prev) => ({
                                    ...prev,
                                    duration: Math.min(60, prev.duration + 1),
                                  }))
                                }
                                className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-lg font-semibold text-slate-600 shadow-sm"
                              >
                                +
                              </button>
                            </div>
                            {errors.duration && (
                              <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                            )}
                          </div>

                          <div>
                            <label className="font-semibold text-slate-700">Group size</label>
                            <div className="mt-2 grid gap-3">
                              <div ref={registerField("adults")}> 
                                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Adults (required)</p>
                                <input
                                  type="number"
                                  min={1}
                                  max={30}
                                  value={form.adults}
                                  onChange={(event) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      adults: Math.max(1, Math.min(30, Number(event.target.value) || 1)),
                                    }))
                                  }
                                  className={`mt-1 w-full rounded-2xl border px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/70 ${
                                    errors.adults ? "border-red-300" : "border-slate-200"
                                  }`}
                                />
                                {errors.adults && (
                                  <p className="text-sm text-red-600">{errors.adults}</p>
                                )}
                              </div>
                              <div ref={registerField("children")}> 
                                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Children (optional)</p>
                                <input
                                  type="number"
                                  min={0}
                                  max={20}
                                  value={form.children}
                                  onChange={(event) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      children: Math.max(0, Math.min(20, Number(event.target.value) || 0)),
                                    }))
                                  }
                                  className={`mt-1 w-full rounded-2xl border px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/70 ${
                                    errors.children ? "border-red-300" : "border-slate-200"
                                  }`}
                                />
                                {errors.children && (
                                  <p className="text-sm text-red-600">{errors.children}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-3 pt-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setForm((prev) => ({
                                      ...prev,
                                      privateTrip: !prev.privateTrip,
                                    }))
                                  }
                                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                    form.privateTrip
                                      ? "border-amber-400 bg-amber-50 text-amber-700"
                                      : "border-slate-300 bg-white text-slate-600"
                                  }`}
                                >
                                  Private trip {form.privateTrip ? "ON" : "OFF"}
                                </button>
                                {!form.privateTrip && (
                                  <span className="text-sm text-slate-500">Join a group (if available)</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeStep === 2 && (
                      <div className="space-y-6">
                        <div ref={registerField("accommodation")}> 
                          <label className="font-semibold text-slate-700">Accommodation preference</label>
                          <div className="mt-3 grid gap-4 md:grid-cols-3">
                            {accommodations.map((option) => (
                              <button
                                type="button"
                                key={option.value}
                                onClick={() =>
                                  setForm((prev) => ({ ...prev, accommodation: option.value }))
                                }
                                className={`flex flex-col gap-2 rounded-2xl border px-4 py-4 text-left transition ${
                                  form.accommodation === option.value
                                    ? "border-amber-400 bg-amber-50"
                                    : "border-slate-200 bg-white"
                                }`}
                              >
                                <span className="text-sm font-semibold text-slate-900">{option.label}</span>
                                <p className="text-xs text-slate-500">{option.description}</p>
                              </button>
                            ))}
                          </div>
                          {errors.accommodation && (
                            <p className="mt-2 text-sm text-red-600">{errors.accommodation}</p>
                          )}
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700">Transport</label>
                          <select
                            value={form.transport}
                            onChange={(event) =>
                              setForm((prev) => ({ ...prev, transport: event.target.value }))
                            }
                            className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
                          >
                            {transportOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-sm text-slate-500">
                            We tailor transport options to your trek. Some regions may only support one choice.
                          </p>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700">Guide</label>
                          <div className="mt-3 flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({ ...prev, guide: true }))
                              }
                              className={`rounded-2xl border px-5 py-2 text-sm font-semibold transition ${
                                form.guide
                                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                                  : "border-slate-300 bg-white text-slate-600"
                              }`}
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({ ...prev, guide: false }))
                              }
                              className={`rounded-2xl border px-5 py-2 text-sm font-semibold transition ${
                                !form.guide
                                  ? "border-amber-400 bg-amber-50 text-amber-700"
                                  : "border-slate-300 bg-white text-slate-600"
                              }`}
                            >
                              No
                            </button>
                          </div>
                          {!form.guide && (
                            <p className="mt-2 text-sm text-slate-500">
                              Some routes require guides or are safer with a guide.
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700">Porter</label>
                          <div className="mt-3 space-y-2">
                            {[
                              { value: "none", label: "None" },
                              { value: "shared", label: "Shared porter" },
                              { value: "per_person", label: "Porter per person" },
                            ].map((option) => (
                              <label
                                key={option.value}
                                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                                  form.porter === option.value
                                    ? "border-amber-400 bg-amber-50"
                                    : "border-slate-200 bg-white"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="porter"
                                  value={option.value}
                                  checked={form.porter === option.value}
                                  onChange={(event) =>
                                    setForm((prev) => ({ ...prev, porter: event.target.value }))
                                  }
                                  className="hidden"
                                />
                                <span>{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700">Add-ons (optional)</label>
                          <div className="mt-3 space-y-3">
                            {addOns.map((option) => (
                              <label
                                key={option.id}
                                className="flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-slate-700 transition hover:border-slate-400"
                              >
                                <input
                                  type="checkbox"
                                  checked={form.addOns.includes(option.id)}
                                  onChange={() =>
                                    setForm((prev) => {
                                      const has = prev.addOns.includes(option.id);
                                      return {
                                        ...prev,
                                        addOns: has
                                          ? prev.addOns.filter((id) => id !== option.id)
                                          : [...prev.addOns, option.id],
                                      };
                                    })
                                  }
                                  className="mt-1 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-900">{option.label}</span>
                                    {option.quoteBased && (
                                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.4em] text-slate-500">
                                        Quote-based
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-500">{option.description}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeStep === 3 && (
                      <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div ref={registerField("name")}>
                            <label className="font-semibold text-slate-700">Full name</label>
                            <div className="mt-2 relative">
                              <User className="absolute left-4 top-3 text-slate-300" size={18} />
                              <input
                                type="text"
                                value={form.name}
                                onChange={(event) =>
                                  setForm((prev) => ({ ...prev, name: event.target.value }))
                                }
                                placeholder="Your full name"
                                className={`w-full rounded-2xl border px-4 py-3 text-slate-700 pl-11 focus:outline-none focus:ring-2 focus:ring-amber-400/70 ${
                                  errors.name ? "border-red-300" : "border-slate-200"
                                }`}
                              />
                            </div>
                            {errors.name && (
                              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                          </div>

                          <div ref={registerField("email")}>
                            <label className="font-semibold text-slate-700">Email</label>
                            <div className="mt-2 relative">
                              <Mail className="absolute left-4 top-3 text-slate-300" size={18} />
                              <input
                                type="email"
                                value={form.email}
                                onChange={(event) =>
                                  setForm((prev) => ({ ...prev, email: event.target.value }))
                                }
                                placeholder="you@example.com"
                                className={`w-full rounded-2xl border px-4 py-3 text-slate-700 pl-11 focus:outline-none focus:ring-2 focus:ring-amber-400/70 ${
                                  errors.email ? "border-red-300" : "border-slate-200"
                                }`}
                              />
                            </div>
                            {errors.email && (
                              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div ref={registerField("phone")}>
                            <label className="font-semibold text-slate-700">Phone / WhatsApp</label>
                            <div className="mt-2 relative">
                              <Phone className="absolute left-4 top-3 text-slate-300" size={18} />
                              <input
                                type="tel"
                                value={form.phone}
                                onChange={(event) =>
                                  setForm((prev) => ({ ...prev, phone: event.target.value }))
                                }
                                placeholder="+1 555 123 4567"
                                className={`w-full rounded-2xl border px-4 py-3 text-slate-700 pl-11 focus:outline-none focus:ring-2 focus:ring-amber-400/70 ${
                                  errors.phone ? "border-red-300" : "border-slate-200"
                                }`}
                              />
                            </div>
                            <p className="mt-1 text-sm text-slate-500">
                              Include country code, e.g., +1, +44, +61…
                            </p>
                            {errors.phone && (
                              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                          </div>

                          <div ref={registerField("country")}> 
                            <label className="font-semibold text-slate-700">Country</label>
                            <div className="mt-2 relative">
                              <Globe className="absolute left-4 top-3 text-slate-300" size={18} />
                              <select
                                value={form.country}
                                onChange={(event) =>
                                  setForm((prev) => ({ ...prev, country: event.target.value }))
                                }
                                className={`w-full rounded-2xl border px-4 py-3 pr-12 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/70 ${
                                  errors.country ? "border-red-300" : "border-slate-200"
                                }`}
                              >
                                <option value="">Select your country</option>
                                {countries.map((country) => (
                                  <option key={country} value={country}>
                                    {country}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {errors.country && (
                              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <label className="font-semibold text-slate-700">Fitness level (optional)</label>
                            <select
                              value={form.fitness}
                              onChange={(event) =>
                                setForm((prev) => ({ ...prev, fitness: event.target.value }))
                              }
                              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
                            >
                              <option value="">Choose your fitness level</option>
                              <option value="beginner">Beginner</option>
                              <option value="average">Average</option>
                              <option value="fit">Fit</option>
                              <option value="very_fit">Very fit</option>
                            </select>
                          </div>
                          <div>
                            <label className="font-semibold text-slate-700">Budget range (optional)</label>
                            <div className="mt-2 grid gap-2">
                              {budgetOptions.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() =>
                                    setForm((prev) => ({ ...prev, budget: option.value }))
                                  }
                                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                                    form.budget === option.value
                                      ? "border-amber-400 bg-amber-50"
                                      : "border-slate-200 bg-white"
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700">Special requests</label>
                          <textarea
                            value={form.specialRequests}
                            onChange={(event) =>
                              setForm((prev) => ({
                                ...prev,
                                specialRequests: event.target.value,
                              }))
                            }
                            maxLength={2000}
                            placeholder="Dietary needs, room preference, pace, altitude concerns, porter needs…"
                            rows={4}
                            className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/70 ${
                              errors.specialRequests ? "border-red-300" : "border-slate-200"
                            }`}
                          />
                          {errors.specialRequests && (
                            <p className="mt-1 text-sm text-red-600">{errors.specialRequests}</p>
                          )}
                        </div>

                        <label className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={form.consent}
                            onChange={(event) =>
                              setForm((prev) => ({ ...prev, consent: event.target.checked }))
                            }
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                          />
                          <span className="text-sm text-slate-700">
                            I agree to be contacted about this request and accept the{' '}
                            <a
                              className="text-amber-600 underline"
                              href="/privacy-policy"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Privacy Policy
                            </a>
                            .
                          </span>
                        </label>
                        {errors.consent && (
                          <p className="text-sm text-red-600">{errors.consent}</p>
                        )}
                      </div>
                    )}

                    <div className="lg:hidden">
                      <button
                        type="button"
                        onClick={() => setSummaryOpen((open) => !open)}
                        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                      >
                        <span>{summaryTitle}</span>
                        <span className="text-xs text-slate-400">
                          {summaryOpen ? "Hide" : "Show"}
                        </span>
                      </button>
                      {summaryOpen && (
                        <div className="mt-3 space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
                          {summaryRows.map((row) => (
                            <div key={row.label} className="flex items-center justify-between text-sm text-slate-600">
                              <span>{row.label}</span>
                              <span className="font-semibold text-slate-900">{row.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 pt-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex gap-3">
                        {activeStep > 1 && (
                          <button
                            type="button"
                            onClick={handleBack}
                            disabled={isSubmitting}
                            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                          >
                            Back
                          </button>
                        )}
                      </div>
                      <button
                        type={activeStep === 3 ? "submit" : "button"}
                        onClick={activeStep === 3 ? undefined : handleNext}
                        disabled={!isStepValid || isSubmitting}
                        className="group relative flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting && activeStep === 3 ? (
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                        ) : (
                          <Star className="h-4 w-4 text-white/90" />
                        )}
                        <span>
                          {activeStep === 3 ? (isSubmitting ? "Submitting…" : "Submit Request") : "Next"}
                        </span>
                      </button>
                    </div>
                  </fieldset>
                </form>
              </div>

              <div className="hidden lg:block">
                <div className="sticky top-6 space-y-5 rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-emerald-500" size={22} />
                    <p className="text-sm font-semibold text-slate-800">{summaryTitle}</p>
                  </div>
                  <div className="space-y-3">
                    {summaryRows.map((row) => (
                      <div key={row.label} className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">{row.label}</p>
                        <p className="text-sm font-semibold text-slate-900">{row.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                    Your live request summary refreshes as you customize each step.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
            <MessageCircle className="mx-auto text-emerald-500" size={48} />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">Need faster help?</h2>
            <p className="mt-2 text-sm text-slate-500">
              Our team answers requests within 24 hours (usually quicker). You can also reach us on WhatsApp for instant updates.
            </p>
            <a
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              href="https://wa.me/9779801234567"
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
