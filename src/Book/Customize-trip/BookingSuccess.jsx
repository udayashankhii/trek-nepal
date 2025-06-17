// src/pages/booking/BookingSuccess.jsx
import React from "react";
import { Link } from "react-router-dom";

const BookingSuccess = () => {
  return (
    <div className="text-center py-32 px-6">
      <h1 className="text-5xl font-extrabold text-green-600 mb-6">
        🎉 Booking Confirmed!
      </h1>
      <p className="text-lg text-gray-700 mb-10">
        Thank you for choosing Nepal Nirvana Adventures. We'll send you a
        detailed confirmation email shortly!
      </p>

      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-full text-lg"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default BookingSuccess;
