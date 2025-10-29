import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  User,
  Phone,
  Globe,
  Mail,
  Star,
  Info,
  ArrowRightCircle,
  MessageCircle,
} from "lucide-react";

// FULL country list at the top
const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo, Republic of the",
  "Congo, Democratic Republic of the",
  "Costa Rica",
  "Côte d'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export default function CustomizeTrekPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const trekId = searchParams.get("trek_id");

  // Add error handling for missing trek_id
  if (!trekId) {
    console.error('Trek ID not found in URL parameters');
    // You might want to redirect or show an error message
  }

  // form state
  const [form, setForm] = useState({
    adults: 1,
    children: 0,
    date: "",
    name: "",
    email: "",
    phone: "",
    country: "",
    notes: "",
  });

  // sample slots (replace API)
  const availableDates = ["2025-09-01", "2025-09-10", "2025-09-20"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send booking request
    navigate(`/booking-confirmation?trek_id=${trekId}`);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Booking Card */}
      <div className="relative max-w-2xl mx-auto mt-20 mb-12 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
            Find Your Extraordinary View
          </h1>
          <Star className="text-yellow-400" size={32} />
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Trip Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-600 mb-2 block">Trip</label>
              <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3">
                <Info className="mr-3 text-gray-400" />
                <span className="text-gray-800 font-medium">{`Trip #${tripId}`}</span>
              </div>
            </div>
            <div>
              <label className="text-gray-600 mb-2 block">Date</label>
              <div className="relative">
                <Calendar className="absolute top-3 right-4 text-gray-300" />
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 text-gray-800 rounded-xl px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-600 mb-2 block">Adults</label>
              <input
                type="number"
                name="adults"
                min={1}
                value={form.adults}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 text-gray-800 rounded-xl px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="text-gray-600 mb-2 block">Children</label>
              <input
                type="number"
                name="children"
                min={0}
                value={form.children}
                onChange={handleChange}
                className="w-full bg-gray-50 text-gray-800 rounded-xl px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-600 mb-2 block">Full Name</label>
              <div className="relative">
                <User className="absolute top-3 left-4 text-gray-300" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Full Name"
                  className="w-full bg-gray-50 text-gray-800 rounded-xl pl-12 py-3 border border-gray-200 focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-600 mb-2 block">Phone</label>
              <div className="relative">
                <Phone className="absolute top-3 left-4 text-gray-300" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1234567890"
                  className="w-full bg-gray-50 text-gray-800 rounded-xl pl-12 py-3 border border-gray-200 focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-600 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute top-3 left-4 text-gray-300" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-gray-50 text-gray-800 rounded-xl pl-12 py-3 border border-gray-200 focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-600 mb-2 block">Country</label>
              <div className="relative">
                <Globe className="absolute top-3 left-4 text-gray-300" />
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 text-gray-800 rounded-xl pl-12 py-3 border border-gray-200 focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">-- Select Country --</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bespoke Options */}
          <div className="flex flex-col md:flex-row gap-4">
            <label className="flex items-center text-gray-700">
              <input type="checkbox" className="accent-yellow-400 mr-2" />
              Private Guide
            </label>
            <label className="flex items-center text-gray-700">
              <input type="checkbox" className="accent-yellow-400 mr-2" />
              Helicopter Transfer
            </label>
            <label className="flex items-center text-gray-700">
              <input type="checkbox" className="accent-yellow-400 mr-2" />
              Luxury Lodge Upgrade
            </label>
          </div>

          {/* Additional Information */}
          <div>
            <label className="text-gray-600 mb-2 block">Special Requests</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Let us know your preferences, dietary needs, or special requests."
              className="w-full bg-gray-50 text-gray-800 rounded-xl px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Concierge Note */}
          <div className="text-gray-500 text-sm italic mb-4">
            Your dedicated travel designer will contact you to perfect every
            detail of your journey.
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl text-lg transition"
          >
            <ArrowRightCircle className="mr-3" size={24} />
            Reserve My Bespoke Experience
          </button>
        </form>
      </div>

      {/* Premium WhatsApp Contact Section */}
      <section className="max-w-2xl mx-auto mb-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col items-center">
          <MessageCircle className="text-emerald-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Contact Us Instantly on WhatsApp
          </h2>
          <p className="text-gray-500 mb-6 text-center">
            Need quick answers or personal assistance? Our travel experts are
            available 24/7 on WhatsApp. Tap below to chat with us now!
          </p>
          <a
            href="https://wa.me/9779801234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg text-lg transition-all"
          >
            <MessageCircle size={28} className="text-white" />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
