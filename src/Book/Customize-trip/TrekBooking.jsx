// src/pages/booking/SinglePageBookingForm.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Shield,
  CreditCard,
  Plane,
  Mountain,
  CheckCircle,
  Info,
  Heart,
  Share2,
  Phone,
  Mail,
} from "lucide-react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

export default function SinglePageBookingForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tripId = searchParams.get("trip_id") || "";
  const basePrice = Number(searchParams.get("price")) || 1525;

  // Enhanced country list
  const countryList = useMemo(() => {
    const names = countries.getNames("en", { select: "official" });
    return Object.entries(names)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travellers, setTravellers] = useState(1);
  const [departureTime, setDepartureTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
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
  const [accepted, setAccepted] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  // Auto-calculate end date
  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 16); // 16-day trek
      setEndDate(end.toISOString().split("T")[0]);
    }
  }, [startDate]);

  // Simplified pricing - removed equipment and insurance
  const baseTotal = basePrice * travellers;
  const totalPrice = baseTotal;
  const initialPayment = +(totalPrice * 0.2).toFixed(2);
  const dueAmount = +(totalPrice - initialPayment).toFixed(2);

  const fmt = (amt) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amt);

  // Trek data
  const trekData = {
    "everest-base-camp": {
      name: "Everest Base Camp Trek",
      duration: "16 Days",
      difficulty: "Challenging",
      maxAltitude: "5,364m",
      bestSeason: "Mar-May, Sep-Nov",
      rating: 4.9,
      reviews: 2847,
      highlights: [
        "Stand at the base of world's highest peak",
        "Spectacular views from Kala Patthar",
        "Experience Sherpa culture in Namche Bazaar",
        "Visit ancient Tengboche Monastery",
      ],
      heroImage: "/images/everest-base-camp-hero.jpg",
    },
  };

  const currentTrek = trekData[tripId] || trekData["everest-base-camp"];

  // Validation
  const emailValid = /^\S+@\S+\.\S+$/.test(lead.email);
  const phoneValid = /^\+\d{1,3}\s?\d{4,14}$/.test(lead.phone);

  const formValid =
    startDate &&
    travellers > 0 &&
    lead.firstName.trim() &&
    lead.lastName.trim() &&
    emailValid &&
    phoneValid &&
    accepted;

  const changeLead = (e) =>
    setLead((l) => ({ ...l, [e.target.name]: e.target.value }));
  const changePreferences = (e) =>
    setPreferences((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValid) return;
    navigate("/payment", {
      state: {
        tripId,
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

  const formatNepalTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Kathmandu",
      timeZoneName: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <img
          src={currentTrek.heroImage}
          alt={currentTrek.name}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center space-x-2 mb-4">
              <Mountain className="w-6 h-6" />
              <span className="text-sm font-medium">ADVENTURE AWAITS</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">{currentTrek.name}</h1>
            <div className="flex items-center space-x-6 text-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{currentTrek.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mountain className="w-5 h-5" />
                <span>{currentTrek.maxAltitude}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span>
                  {currentTrek.rating} ({currentTrek.reviews} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Single Page Booking Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Book Your Adventure
                  </h2>
                  <p className="text-gray-600">
                    Complete your booking in one simple form
                  </p>
                </div>

                {/* Trip Details Section */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Trip Details
                    </h3>
                  </div>

                  {/* Date Selection */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Departure Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                          required
                        />
                        <Calendar className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Return Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={endDate}
                          readOnly
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-xl bg-gray-50 text-gray-600"
                        />
                        <Calendar className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500">
                        Automatically calculated (16 days)
                      </p>
                    </div>
                  </div>

                  {/* Travellers */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Number of Travellers{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center justify-between max-w-xs">
                      <button
                        type="button"
                        onClick={() => setTravellers((t) => Math.max(1, t - 1))}
                        className="w-12 h-12 bg-indigo-100 hover:bg-indigo-200 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-5 h-5 text-indigo-600" />
                      </button>
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-2xl font-bold text-gray-900">
                          {travellers}
                        </span>
                        <span className="text-gray-500">
                          {travellers === 1 ? "person" : "people"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTravellers((t) => t + 1)}
                        className="w-12 h-12 bg-indigo-100 hover:bg-indigo-200 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-5 h-5 text-indigo-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Users className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Personal Information
                    </h3>
                  </div>

                  {/* Basic Details */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Title
                      </label>
                      <select
                        name="title"
                        value={lead.title}
                        onChange={changeLead}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
                      >
                        <option>Mr.</option>
                        <option>Ms.</option>
                        <option>Mrs.</option>
                        <option>Dr.</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Experience Level
                      </label>
                      <select
                        name="experience"
                        value={lead.experience}
                        onChange={changeLead}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="firstName"
                        value={lead.firstName}
                        onChange={changeLead}
                        placeholder="Enter your first name"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="lastName"
                        value={lead.lastName}
                        onChange={changeLead}
                        placeholder="Enter your last name"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          name="email"
                          type="email"
                          value={lead.email}
                          onChange={changeLead}
                          placeholder="your@email.com"
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                          required
                        />
                        <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      </div>
                      {lead.email && !emailValid && (
                        <p className="text-sm text-red-500">
                          Please enter a valid email address
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          name="phone"
                          type="tel"
                          value={lead.phone}
                          onChange={changeLead}
                          placeholder="+1 (555) 123-4567"
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                          required
                        />
                        <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      </div>
                      {lead.phone && !phoneValid && (
                        <p className="text-sm text-red-500">
                          Please enter a valid phone number with country code
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Country Selection - Optional */}
                  <div className="space-y-2 mb-6">
                    <label className="block text-sm font-semibold text-gray-700">
                      Country (Optional)
                    </label>
                    <div className="relative">
                      <select
                        name="country"
                        value={lead.country}
                        onChange={changeLead}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 appearance-none"
                      >
                        <option value="">Select your country</option>
                        {countryList.map(({ code, name }) => (
                          <option key={code} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-2 mb-6">
                    <label className="block text-sm font-semibold text-gray-700">
                      Emergency Contact
                    </label>
                    <input
                      name="emergencyContact"
                      value={lead.emergencyContact}
                      onChange={changeLead}
                      placeholder="Name and phone number of emergency contact"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
                    />
                  </div>

                  {/* Additional Requirements */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Dietary Requirements
                      </label>
                      <input
                        name="dietaryReqs"
                        value={lead.dietaryReqs}
                        onChange={changeLead}
                        placeholder="Vegetarian, allergies, etc."
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Medical Conditions
                      </label>
                      <input
                        name="medicalConditions"
                        value={lead.medicalConditions}
                        onChange={changeLead}
                        placeholder="Any relevant medical information"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Options Section - Simplified */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Additional Information
                  </h3>

                  {/* Special Requests */}
                  <div className="space-y-2 mb-6">
                    <label className="block text-sm font-semibold text-gray-700">
                      Special Requests
                    </label>
                    <textarea
                      name="specialRequests"
                      value={preferences.specialRequests}
                      onChange={changePreferences}
                      rows={4}
                      placeholder="Any special requests or additional information..."
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 resize-none"
                    />
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Comments or Questions
                    </label>
                    <textarea
                      name="comments"
                      value={preferences.comments || ""}
                      onChange={(e) =>
                        setPreferences((p) => ({
                          ...p,
                          comments: e.target.value,
                        }))
                      }
                      rows={4}
                      placeholder="Any comments or questions you have about your trip..."
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 resize-none"
                    />
                  </div>
                </div>

                {/* Nepal Travel Times - Removed "(Optional)" */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Plane className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Nepal Travel Times
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600 mb-6">
                    If you need assistance with travel arrangements to/from
                    Nepal, please provide your preferred times.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Departure Time to Nepal
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={departureTime}
                          onChange={(e) => setDepartureTime(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0"
                        />
                        <Clock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      </div>
                      {departureTime && (
                        <p className="text-xs text-purple-600 font-medium">
                          Nepal Time: {formatNepalTime(departureTime)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Return Time from Nepal
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={returnTime}
                          onChange={(e) => setReturnTime(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0"
                        />
                        <Clock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      </div>
                      {returnTime && (
                        <p className="text-xs text-purple-600 font-medium">
                          Nepal Time: {formatNepalTime(returnTime)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Submit */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1"
                        required
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{" "}
                        <a
                          href="/terms"
                          className="text-indigo-600 underline hover:text-indigo-800"
                        >
                          Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="text-indigo-600 underline hover:text-indigo-800"
                        >
                          Privacy Policy
                        </a>
                        <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={newsletter}
                        onChange={(e) => setNewsletter(e.target.checked)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        Subscribe to our newsletter for exclusive deals and
                        trekking tips
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!formValid}
                    className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all ${
                      formValid
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {formValid
                      ? "Complete Booking & Pay Now"
                      : "Please Complete Required Fields"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar - Simplified */}
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <h3 className="font-bold text-xl mb-2">{currentTrek.name}</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{currentTrek.rating}</span>
                  <span>({currentTrek.reviews} reviews)</span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Price Breakdown
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Base price × {travellers}</span>
                      <span>{fmt(baseTotal)}</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{fmt(totalPrice)}</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="flex justify-between text-green-800 font-medium">
                        <span>Pay now (20%)</span>
                        <span>{fmt(initialPayment)}</span>
                      </div>
                      <div className="flex justify-between text-green-600 text-sm mt-1">
                        <span>Balance due</span>
                        <span>{fmt(dueAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Trek Highlights
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {currentTrek.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    We Accept
                  </h4>
                  <div className="flex items-center space-x-3">
                    <img src="/images/visa.png" alt="Visa" className="h-8" />
                    <img
                      src="/images/mastercard.png"
                      alt="Mastercard"
                      className="h-8"
                    />
                    <img
                      src="/images/stripe.png"
                      alt="Stripe"
                      className="h-8"
                    />
                    <img
                      src="/images/paypal.png"
                      alt="PayPal"
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">
                    Secure booking with 256-bit SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
