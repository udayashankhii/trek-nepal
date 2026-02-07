import React from "react";
import { Link } from "react-router-dom";

const aboutItems = [
  { label: "Overview", path: "/about-us" },
  { label: "Our Team", path: "/about-us/our-team" },
  { label: "How to Make a Payment", path: "/about-us/how-to-make-a-payment" },
  { label: "Privacy Policy", path: "/about-us/privacy-policy" },
  { label: "Legal Documents", path: "/about-us/legal-documents" },
  { label: "Terms and Conditions", path: "/terms-and-conditions" },
];

export default function AboutUsDropdown({ isOpen }) {
  return (
    <div
      className={`absolute right-0 bg-white shadow-xl border border-gray-200 rounded-lg transition-all duration-300 ${
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      style={{
        top: "calc(100% + 0.5rem)",
        minWidth: "220px",
        right: 0,
        zIndex: 50,
      }}
    >
      <ul className="py-3">
        {aboutItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className="block px-6 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
