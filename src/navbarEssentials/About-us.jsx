// AboutUsDropdown.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
// src/About us/About-us.jsx
const aboutItems = [
  { label: "Overview", path: "/about-us" },
  { label: "Our Team", path: "/about-us/our-team" },
  { label: "How to Make a Payment", path: "about-us/how-to-make-a-payment" },
  { label: "Privacy Policy", path: "/about-us/privacy-policy" },
  { label: "Legal Documents", path: "/about-us/legal-documents" },
];

export default function AboutUsDropdown({ onHoverItem, hideTrigger = false }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setOpen(false);
        onHoverItem && onHoverItem(null);
      }}
    >
      {/* only render this when not embedded */}
      {!hideTrigger && (
        <button className="flex items-center font-semibold text-gray-800 hover:text-green-600 transition">
          ABOUT US <ChevronDown className="ml-1" size={18} />
        </button>
      )}

      <ul
        className={`absolute top-full left-0 w-48 bg-white rounded-lg shadow-lg mt-2
+               transition-opacity duration-200 z-50 ${
          open
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {aboutItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className="block px-6 py-3 text-gray-700 font-medium hover:bg-green-50 hover:text-green-700 transition"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
