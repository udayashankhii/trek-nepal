import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import Treks from "../components/Treks";
import ToursDropdown from "../components/Tours";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const Navigate = useNavigate();


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".dropdown-trigger") &&
        !e.target.closest(".mega-menu")
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-green-600 text-white text-sm py-2 px-4 lg:px-6 flex justify-between items-center">
        <span className="flex items-center">
          🏔️ Free Consultation:
          <a
            href="tel:+9779801000000"
            className="underline ml-1 hover:text-yellow-200 transition"
          >
            +977 9801-000000
          </a>
        </span>
        <span className="hidden sm:block">🌄 Best Treks in 2025!</span>
      </div>

      {/* Main navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 lg:gap-3">
            <img
              src="/logonirvana.png"
              alt="Nepal Nirvana Logo"
              className="h-10 w-auto"
            />
            <span className="text-xl lg:text-2xl font-bold text-gray-800">
              Nepal Nirvana <span className="text-red-600">Adventours</span>
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-5 xl:space-x-8 text-gray-700 font-medium">
            <Link
              to="/"
              className="hover:text-green-600 transition-colors duration-200"
            >
              Home
            </Link>

            {/* Trekking dropdown */}
            <div className="dropdown-container">
              <button
                className="dropdown-trigger inline-flex items-center hover:text-green-600 transition-colors duration-200"
                onClick={() => toggleDropdown("trekking")}
                onMouseEnter={() => toggleDropdown("trekking")}
              >
                Trekking in Nepal
                <ChevronDown
                  className={`ml-1 transition-transform duration-200 ${
                    activeDropdown === "trekking" ? "rotate-180" : ""
                  }`}
                  size={16}
                />
              </button>

              <div
                className={`mega-menu absolute left-0 w-screen bg-white shadow-xl border border-gray-200 z-50 transition-all duration-300 ${
                  activeDropdown === "trekking"
                    ? "opacity-100 visible"
                    : "opacity-0 invisible pointer-events-none"
                }`}
                style={{ top: "calc(100% + 1px)" }}
                onMouseLeave={() => toggleDropdown(null)}
              >
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <Treks />
                </div>
              </div>
            </div>

            {/* Tours dropdown */}
            <div className="relative dropdown-container">
              <button
                className="dropdown-trigger inline-flex items-center hover:text-green-600 transition-colors duration-200"
                onClick={() => Navigate('/tourindex')}
                onMouseEnter={() => toggleDropdown("tours")}
              >
                Tours in Nepal
                <ChevronDown
                  className={`ml-1 transition-transform duration-200 ${
                    activeDropdown === "tours" ? "rotate-180" : ""
                  }`}
                  size={16}
                />
              </button>

              <div
                className={`mega-menu absolute left-0 bg-white shadow-xl border border-gray-200 z-50 transition-all duration-300 ${
                  activeDropdown === "tours"
                    ? "opacity-100 visible"
                    : "opacity-0 invisible pointer-events-none"
                }`}
                style={{ top: "calc(100% + 1px)" }}
                onMouseLeave={() => toggleDropdown(null)}
              >
                <div className="p-6 min-w-[300px]">
                  <ToursDropdown />
                </div>
              </div>
            </div>

            {/* Travel Info dropdown */}
            <div className="relative dropdown-container">
              <button
                className="dropdown-trigger inline-flex items-center hover:text-green-600 transition-colors duration-200"
                onClick={() => toggleDropdown("info")}
                onMouseEnter={() => toggleDropdown("info")}
              >
                Travel Info
                <ChevronDown
                  className={`ml-1 transition-transform duration-200 ${
                    activeDropdown === "info" ? "rotate-180" : ""
                  }`}
                  size={16}
                />
              </button>

              <div
                className={`mega-menu absolute right-0 bg-white shadow-xl border border-gray-200 z-50 transition-all duration-300 ${
                  activeDropdown === "info"
                    ? "opacity-100 visible"
                    : "opacity-0 invisible pointer-events-none"
                }`}
                style={{ top: "calc(100% + 1px)" }}
                onMouseLeave={() => toggleDropdown(null)}
              >
                <ul className="py-3 min-w-[220px]">
                  {[
                    "Visa Information",
                    "Health & Safety",
                    "Packing List",
                    "FAQs",
                  ].map((item) => (
                    <li key={item}>
                      <Link
                        to={`/travel-info/${item
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="block px-5 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link
              to="/contact"
              className="hover:text-green-600 transition-colors duration-200"
            >
              Contact Us
            </Link>

            <Link
              to="/plan"
              className="bg-yellow-800 hover:bg-yellow-700 text-white font-semibold px-5 py-2.5 rounded shadow ml-4 transition-colors duration-200"
            >
              Plan Your Trip
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-gray-700 focus:outline-none"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="px-4 py-3 divide-y divide-gray-100">
            <Link to="/" className="block py-2.5 text-gray-800">
              Home
            </Link>

            <div className="py-2">
              <div
                className="flex justify-between items-center py-2.5 text-gray-800"
                onClick={() => toggleDropdown("mob-trekking")}
              >
                <span>Trekking in Nepal</span>
                <ChevronDown
                  className={
                    activeDropdown === "mob-trekking" ? "rotate-180" : ""
                  }
                  size={20}
                />
              </div>

              {activeDropdown === "mob-trekking" && (
                <div className="pl-4 py-2">
                  <Treks minimal={true} />
                </div>
              )}
            </div>

            <div className="py-2">
              <div
                className="flex justify-between items-center py-2.5 text-gray-800"
                onClick={() => toggleDropdown("mob-tours")}
              >
                <span>Tours in Nepal</span>
                <ChevronDown
                  className={activeDropdown === "mob-tours" ? "rotate-180" : ""}
                  size={20}
                />
              </div>

              {activeDropdown === "mob-tours" && (
                <div className="pl-4 py-2">
                  <ToursDropdown minimal={true} />
                </div>
              )}
            </div>

            <Link to="/contact" className="block py-2.5 text-gray-800">
              Contact Us
            </Link>

            <div className="py-3">
              <Link
                to="/plan"
                className="block w-full bg-yellow-800 text-white text-center py-3 rounded-md font-medium"
              >
                Plan Your Trip
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
