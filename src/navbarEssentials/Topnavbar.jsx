import React from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { SiViber } from "react-icons/si";
import { Link } from "react-router-dom";

export default function TopBar() {
  const phoneNumber = "9779801234567"; // change to your real number

  return (
    <div className="bg-[#062c5b] text-white text-sm py-2 px-6 flex justify-between items-center">

      {/* Left Section */}
      <div className="flex items-center gap-6">

        <div className="flex items-center gap-4">
          <span className="hidden md:block">
            Free Consultation:
          </span>

          <a
            href={`tel:+${phoneNumber}`}
            className="underline hover:text-yellow-300 transition"
          >
            +977 9801234567
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg hover:text-green-400 hover:scale-110 transition-transform"
          >
            <FaWhatsapp />
          </a>

          {/* Viber */}
          <a
            href={`viber://chat?number=%2B${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg hover:text-purple-400 hover:scale-110 transition-transform"
          >
            <SiViber />
          </a>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <span className="hidden md:block">
          Best Treks for 2026!
        </span>

        <Link
          to="/blog"
          className="bg-white text-[#062c5b] px-4 py-1 rounded-full hover:bg-yellow-100 transition font-medium"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}
