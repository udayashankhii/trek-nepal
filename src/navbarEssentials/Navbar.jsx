
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import TrekkingDropdown from "./Dropdown/TrekkingDropdown";
import TravelStylesDropdown from "./Dropdown/TravelStylesDropdown";

import TravelInfoDropdown from "./Dropdown/TravelInfoDropdown";

import AboutUsDropdown from "./Dropdown/AboutUsDropdown";
import Treks from "./Treks";

export default function ImprovedNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [stickyDropdown, setStickyDropdown] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);

  const isTrekkingSection =
    location.pathname.startsWith("/trekking-in-nepal") ||
    location.pathname.startsWith("/treks/");

  const isTravelStylesSection =
    location.pathname.startsWith("/travel-styles") ||
    location.pathname.startsWith("/tourindex");

  const isInfoSection = location.pathname.startsWith("/travel-info/");
  const getDropdownVisibility = (dropdownName) => {
    const isActive = activeDropdown === dropdownName;
    const shouldRender = isActive || isTransitioning;
    return { isActive, shouldRender };
  };

  const handleMouseEnter = (dropdownName) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setIsTransitioning(true);
    if (!stickyDropdown || stickyDropdown === dropdownName) {
      setActiveDropdown(dropdownName);
    }
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleMouseLeave = () => {
    if (stickyDropdown) return;
    setIsTransitioning(true);
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 150);
    setHoverTimeout(timeout);
  };

  const handleDropdownClick = (dropdownName) => {
    setIsTransitioning(true);
    if (stickyDropdown === dropdownName) {
      setStickyDropdown(null);
      setActiveDropdown(null);
    } else {
      setStickyDropdown(dropdownName);
      setActiveDropdown(dropdownName);
    }
    setTimeout(() => setIsTransitioning(false), 300);
  };

  useEffect(() => {
    setActiveDropdown(null);
    setStickyDropdown(null);
    setIsTransitioning(false);
    if (hoverTimeout) clearTimeout(hoverTimeout);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsTransitioning(true);
        setActiveDropdown(null);
        setStickyDropdown(null);
        setTimeout(() => setIsTransitioning(false), 300);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItemStyles = (isActive) => `
    relative group flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-all duration-300
    ${isActive ? "text-yellow-600" : "text-gray-700 hover:text-yellow-600"}
  `;

  return (
    <header
      className="z-50 sticky top-0 bg-green-50 shadow font-sans"
      ref={containerRef}
    >
      {/* Top Bar */}
      <div className="bg-[#062c5b] text-white text-sm py-2 px-4 flex justify-between items-center">
        <span>
          Free Consultation:
          <a
            href="tel:+9779801000000"
            className="underline hover:text-yellow-100 ml-1"
          >
            +977 9801-000000
          </a>
        </span>
        <div className="flex items-center gap-2">
          <span>Best Treks for 2025!</span>
          <Link
            to="/tourindex"
            className="text-sm bg-white text-yellow-600 px-3 py-1 rounded-full hover:bg-yellow-100 transition font-medium"
          >
            Read More
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-green-50 border-b border-gray-200">
        <div className="flex items-center justify-between py-4 px-4 lg:px-10">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/evertreknepallogo.webp"
              alt="EverTrek Nepal Logo"
              className="h-20 object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-5 items-center">
            {/* TREKKING IN NEPAL */}
            <div
              className="relative dropdown-container"
              onMouseEnter={() => handleMouseEnter("trekking")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={navItemStyles(isTrekkingSection)}
                onClick={() => {
                  handleDropdownClick("trekking");
                  navigate("/trekking-in-nepal");
                }}
              >
                TREKKING IN NEPAL
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform duration-200 ${
                    activeDropdown === "trekking" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {getDropdownVisibility("trekking").shouldRender && (
                <TrekkingDropdown
                  isOpen={getDropdownVisibility("trekking").isActive}
                />
              )}
            </div>

            {/* TOURS IN NEPAL */}
            <div
              className="relative dropdown-container"
              onMouseEnter={() => handleMouseEnter("travelstyles")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={navItemStyles(isTravelStylesSection)}
                onClick={() => handleDropdownClick("travelstyles")}
                >
                <span className="bg-gradient-to-r from-yellow-600 to-amber-500 absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></span>
                TRAVEL STYLES
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform duration-200 ${
                    activeDropdown === "travelstyles" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {getDropdownVisibility("travelstyles").shouldRender && (
                <div
                  className={`absolute left-0 bg-white shadow-xl border border-gray-200 rounded-lg z-50
        transform-gpu will-change-transform transition-all duration-300 ease-in-out ${
          getDropdownVisibility("travelstyles").isActive
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible translate-y-2"
        }`}
                  style={{
                    width: "320px", // Increased width to accommodate descriptions
                    marginTop: "0.5rem",
                    pointerEvents: getDropdownVisibility("travelstyles")
                      .isActive
                      ? "auto"
                      : "none",
                  }}
                >
                  <div className="p-4">
                    <TravelStylesDropdown
                      onNavigate={() => {
                        setActiveDropdown(null);
                        setStickyDropdown(null);
                        setIsTransitioning(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* TRAVEL INFO */}
            <div
              className="relative dropdown-container"
              onMouseEnter={() => handleMouseEnter("info")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={navItemStyles(isInfoSection)}
                onClick={() => handleDropdownClick("info")}
              >
                TRAVEL INFO
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform duration-200 ${
                    activeDropdown === "info" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {getDropdownVisibility("info").shouldRender && (
                <TravelInfoDropdown
                  isOpen={getDropdownVisibility("info").isActive}
                />
              )}
            </div>

            {/* BLOG */}
            <Link
              to="/blog"
              className={navItemStyles(location.pathname === "/blog")}
            >
              BLOG
            </Link>

            {/* CONTACT */}
            <Link
              to="/contact-us"
              className={navItemStyles(location.pathname === "/contact-us")}
            >
              CONTACT US
            </Link>

            {/* ABOUT US */}
            <div
              className="relative dropdown-container"
              onMouseEnter={() => handleMouseEnter("about")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={navItemStyles(
                  location.pathname.startsWith("/about-us")
                )}
                onClick={() => handleDropdownClick("about")}
              >
                ABOUT US
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform duration-200 ${
                    activeDropdown === "about" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {getDropdownVisibility("about").shouldRender && (
                <AboutUsDropdown
                  isOpen={getDropdownVisibility("about").isActive}
                />
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-gray-700"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow">
            <div className="px-4 py-6 space-y-3">
              <Link
                to="/trekking-in-nepal"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-gray-800"
              >
                Trekking in Nepal
              </Link>
              <Link
                to="/tourindex"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-gray-800"
              >
                Travel Styles
              </Link>
              <Link
                to="/travel-info/visa-information"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-gray-800"
              >
                Travel Info
              </Link>
              <Link
                to="/blog"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-gray-800"
              >
                Blog
              </Link>
              <Link
                to="/contact-us"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-gray-800"
              >
                Contact Us
              </Link>
              <Link
                to="/about-us"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-gray-800"
              >
                About Us
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
