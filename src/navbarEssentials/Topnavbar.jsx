import React from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { SiViber } from "react-icons/si";
import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

export default function TopBar() {
  const phoneNumber = "+9779763416898";

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
            +977 9763416898
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-xl hover:bg-green-500/20 hover:text-green-300 hover:scale-110 transition-all duration-200"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp />
          </a>

          {/* Viber */}
          <a
            href={`viber://chat?number=%2B${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-xl hover:bg-purple-500/20 hover:text-purple-300 hover:scale-110 transition-all duration-200"
            aria-label="Chat on Viber"
          >
            <SiViber />
          </a>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <Link
          to="/customize-trek"
          className="hidden sm:inline-flex items-center gap-2 border border-white rounded-full px-5 py-1.5 text-white font-semibold text-sm hover:bg-white hover:text-[#062c5b] transition-all duration-300"
        >
          <Compass size={16} />
          Start Planning
        </Link>

        <div className="hidden md:block w-px h-5 bg-white/30" />

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
