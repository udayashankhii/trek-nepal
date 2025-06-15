import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  ShieldCheck,
  CreditCard,
  User,
  Calendar,
  Hotel,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
export default function BookingPage() {
  const [tripDetails] = useState({
    title: "Everest Base Camp Trek - 14 Days",
    basePrice: 1175,
    addOns: [
      { name: "Kathmandu to Lukla Helicopter", price: 400 },
      { name: "Porter Service", price: 220 },
      { name: "Lukla to Kathmandu Helicopter", price: 500 },
      { name: "Upgraded Accommodation", price: 150 },
      { name: "Extra Nights in Kathmandu", price: 40 },
    ],
    discount: 0,
    total: 2485,
    advance: 248,
    balance: 2237,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    startDate: "",
    travelers: 1,
    specialRequests: "",
  });
  const [showPayment, setShowPayment] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPayment(true);
    // Add your payment logic here
  };
  const BookingPage = () => {
    const [searchParams] = useSearchParams();
    const tripId = searchParams.get("trip_id");

    if (!tripId) {
      return <ErrorComponent message="Trip ID is required" />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900">
        {/* Premium WhatsApp Floating Button */}
        <a
          href="https://wa.me/9779801234567"
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 rounded-full shadow-2xl hover:scale-105 hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300 border-4 border-white"
          aria-label="Enquire on WhatsApp"
        >
          <MessageCircle size={32} className="text-white drop-shadow" />
        </a>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <h1 className="text-4xl font-bold mb-6 text-blue-700">
                  Complete Your Booking
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Details */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-blue-600">
                      <User className="text-blue-400" />
                      Personal Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name *"
                        className="bg-gray-100 border border-gray-200 rounded-xl p-4 w-full focus:ring-2 focus:ring-blue-300"
                        required
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name *"
                        className="bg-gray-100 border border-gray-200 rounded-xl p-4 w-full focus:ring-2 focus:ring-blue-300"
                        required
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email *"
                        className="bg-gray-100 border border-gray-200 rounded-xl p-4 w-full focus:ring-2 focus:ring-blue-300"
                        required
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="bg-gray-100 border border-gray-200 rounded-xl p-4 w-full focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                  </div>

                  {/* Trip Preferences */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-blue-600">
                      <Calendar className="text-blue-400" />
                      Trip Details
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="bg-gray-100 border border-gray-200 rounded-xl p-4 w-full"
                        required
                      />
                      <select
                        name="travelers"
                        value={formData.travelers}
                        onChange={handleChange}
                        className="bg-gray-100 border border-gray-200 rounded-xl p-4 w-full"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "Person" : "People"}
                          </option>
                        ))}
                      </select>
                      <select className="bg-gray-100 border border-gray-200 rounded-xl p-4 w-full">
                        <option>Standard Package</option>
                        <option>Premium Package</option>
                        <option>Luxury Package</option>
                      </select>
                    </div>
                  </div>

                  {/* Add-Ons */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-blue-600">
                      <Hotel className="text-blue-400" />
                      Additional Services
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {tripDetails.addOns.map((addOn, index) => (
                        <label
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-blue-50 transition"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="w-5 h-5 accent-blue-500"
                            />
                            <span>{addOn.name}</span>
                          </div>
                          <span className="text-blue-700 font-medium">
                            + ${addOn.price}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow"
                  >
                    Proceed to Secure Payment
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold mb-6 text-blue-700">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between">
                    <span>Base Price</span>
                    <span>${tripDetails.basePrice}</span>
                  </div>
                  {tripDetails.addOns.map((addOn, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-gray-500"
                    >
                      <span>+ {addOn.name}</span>
                      <span>${addOn.price}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${tripDetails.total}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Advance Payment</span>
                    <span className="text-blue-600 font-semibold">
                      ${tripDetails.advance}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Balance on Arrival</span>
                    <span>${tripDetails.balance}</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                  <ShieldCheck className="text-emerald-500" />
                  <span>3D Secure & SSL Encrypted Payment</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Security Assurance */}
          <div className="mt-12 grid md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-white border border-gray-100 rounded-xl shadow">
              <CreditCard className="mx-auto text-blue-600 mb-3" />
              <h3 className="font-semibold">Secure Payments</h3>
              <p className="text-sm text-gray-500">256-bit SSL encryption</p>
            </div>
            {/* Add more assurance blocks as needed */}
          </div>
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
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <BookingPage />
    </div>
  );
}
