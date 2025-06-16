import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  HeartPulse,
  Luggage,
  Bus,
  HelpCircle,
  Plane,
  Shield,
} from "lucide-react";
import Treks from "../components/Treks";
import ToursDropdown from "../components/Tours";
import AboutUsDropdown from "../About us/About-us";

export default function ImprovedNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [stickyDropdown, setStickyDropdown] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false); // Add transition state
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);

  // Helpers
  const isTrekkingSection =
    location.pathname.startsWith("/trekking-in-nepal") ||
    location.pathname.startsWith("/treks/");
  const isToursSection =
    location.pathname.startsWith("/tourindex") ||
    location.pathname.startsWith("/tours/");
  const isInfoSection = location.pathname.startsWith("/travel-info/");

  // Enhanced visibility logic
  const getDropdownVisibility = (dropdownName) => {
    const isActive = activeDropdown === dropdownName;
    const shouldRender = isActive || isTransitioning;
    return { isActive, shouldRender };
  };

  // Enhanced hover handling with proper transition management
  const handleMouseEnter = (dropdownName) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }

    setIsTransitioning(true);

    if (!stickyDropdown || stickyDropdown === dropdownName) {
      setActiveDropdown(dropdownName);
    }

    // Clear transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleMouseLeave = () => {
    if (stickyDropdown) return;

    setIsTransitioning(true);

    const timeout = setTimeout(() => {
      setActiveDropdown(null);
      // Keep transition state for proper cleanup
      setTimeout(() => setIsTransitioning(false), 300);
    }, 150);
    setHoverTimeout(timeout);
  };

  // Click handler for dropdown buttons
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

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setStickyDropdown(null);
    setIsTransitioning(false);
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  }, [location.pathname]);

  // Handle outside clicks and escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsTransitioning(true);
        setActiveDropdown(null);
        setStickyDropdown(null);
        setTimeout(() => setIsTransitioning(false), 300);
      }
    };

    const handleKey = (e) => {
      if (e.key === "Escape") {
        setIsTransitioning(true);
        setActiveDropdown(null);
        setStickyDropdown(null);
        setTimeout(() => setIsTransitioning(false), 300);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Unified styles for all navbar items
  const baseNavItem =
    "relative group flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-all duration-300";
  const activeNavItem = "text-yellow-600";
  const defaultNavItem = "text-gray-700 hover:text-yellow-600";

  const navItemStyles = (isActive) => `
    ${baseNavItem}
    ${isActive ? activeNavItem : defaultNavItem}
  `;

  const aboutItems = [
    { label: "Overview", path: "/about-us" },
    { label: "Our Team", path: "/about-us/our-team" },
    { label: "How to Make a Payment", path: "/about-us/how-to-make-a-payment" },
    { label: "Privacy Policy", path: "/about-us/privacy-policy" },
    { label: "Legal Documents", path: "/about-us/legal-documents" },
  ];

  // Enhanced travel items with icons
  const travelItems = [
    {
      name: "Visa Information",
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Entry requirements & visa process",
      route: "/travel-info/visa-information",
    },
    {
      name: "Health & Safety",
      icon: HeartPulse,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Medical prep & safety guidelines",
      route: "/travel-info/health-safety",
    },
    {
      name: "Packing List",
      icon: Luggage,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: "Essential gear for your trek",
      route: "/travel-info/packing-list",
    },
    {
      name: "Transportation",
      icon: Bus,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Getting around Nepal",
      route: "/travel-info/transportation",
    },
    {
      name: "FAQs",
      icon: HelpCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Common questions answered",
      route: "/travel-info/faqs",
    },
  ];

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
        <div className="flex items-center justify-between px-0 py-4 h-25">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo5.webp"
              alt="EverTrek Nepal Logo"
              className="h-25 sm:h-25 md:h-24 object-contain"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex space-x-1.5 text-sm font-medium items-center ml-[10cm] pr-10">
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
                <span className="bg-gradient-to-r from-yellow-600 to-amber-500 absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></span>
                TREKKING IN NEPAL
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform duration-200 ${
                    activeDropdown === "trekking" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {getDropdownVisibility("trekking").shouldRender && (
                <div
                  className={`absolute left-1 bg-white shadow-xl border border-gray-200 rounded-lg z-50
                    transform-gpu will-change-transform transition-all duration-300 ease-in-out ${
                      getDropdownVisibility("trekking").isActive
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible translate-y-2"
                    }`}
                  style={{
                    width: "min(100vw, 1320px)",
                    maxHeight: "100vh",
                    overflowY: "auto",
                    transform: "translateX(-40%)",
                    marginTop: "0.5rem",
                    pointerEvents: getDropdownVisibility("trekking").isActive
                      ? "auto"
                      : "none",
                  }}
                >
                  <div
                    className="p-6 overflow-y-auto"
                    style={{
                      maxHeight: "60vh", // limits dropdown height to 70% of screen
                      scrollbarWidth: "thin", // Firefox
                    }}
                  >
                    <Treks />
                  </div>
                </div>
              )}
            </div>

            {/* TOURS IN NEPAL */}
            <div
              className="relative dropdown-container"
              onMouseEnter={() => handleMouseEnter("tours")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={navItemStyles(isToursSection)}
                onClick={() => {
                  handleDropdownClick("tours");
                  navigate("/tourindex");
                }}
              >
                <span className="bg-gradient-to-r from-yellow-600 to-amber-500 absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></span>
                TOURS IN NEPAL
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform duration-200 ${
                    activeDropdown === "tours" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {getDropdownVisibility("tours").shouldRender && (
                <div
                  className={`absolute left-0 bg-white shadow-xl border border-gray-200 rounded-lg z-50
                    transform-gpu will-change-transform transition-all duration-300 ease-in-out ${
                      getDropdownVisibility("tours").isActive
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible translate-y-2"
                    }`}
                  style={{
                    width: "400px",
                    marginTop: "0.5rem",
                    pointerEvents: getDropdownVisibility("tours").isActive
                      ? "auto"
                      : "none",
                  }}
                >
                  <div className="p-6">
                    <ToursDropdown />
                  </div>
                </div>
              )}
            </div>

            {/* TRAVEL INFO - FIXED VERSION */}
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
                <span className="bg-gradient-to-r from-yellow-600 to-amber-500 absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></span>
                TRAVEL INFO
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform duration-200 ${
                    activeDropdown === "info" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* FIXED DROPDOWN - Removed backdrop-blur and improved transitions */}
              {getDropdownVisibility("info").shouldRender && (
                <div
                  className={`absolute right-0 bg-white shadow-2xl border border-gray-100 rounded-xl z-50
                    transform-gpu will-change-transform transition-all duration-300 ease-out ${
                      getDropdownVisibility("info").isActive
                        ? "opacity-100 visible translate-y-0 scale-100"
                        : "opacity-0 invisible translate-y-2 scale-95"
                    }`}
                  style={{
                    top: "calc(100% + 0.75rem)",
                    pointerEvents: getDropdownVisibility("info").isActive
                      ? "auto"
                      : "none",
                    minWidth: "400px",
                  }}
                >
                  <div className="p-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2">
                        <Plane className="w-5 h-5 text-yellow-600" />
                        Travel Information
                      </h3>
                      <p className="text-sm text-gray-600">
                        Everything you need for your Nepal adventure
                      </p>
                    </div>

                    <ul className="space-y-2">
                      {travelItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <li key={item.name}>
                            <Link
                              to={item.route}
                              className="flex items-start p-3 space-x-3 rounded-lg transition-all duration-200
                                hover:bg-gradient-to-r hover:from-yellow-50/80 hover:to-amber-50/50
                                hover:shadow-md hover:scale-[1.02] group/item"
                              onClick={() => {
                                setActiveDropdown(null);
                                setStickyDropdown(null);
                                setIsTransitioning(false);
                              }}
                            >
                              <div
                                className={`p-2 rounded-lg ${item.bgColor} group-hover/item:scale-110 transition-transform`}
                              >
                                <IconComponent
                                  className={`w-5 h-5 ${item.color}`}
                                  strokeWidth={2.2}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-gray-800 font-semibold group-hover/item:text-yellow-700 transition-colors">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-gray-600 group-hover/item:text-gray-700 transition-colors">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-yellow-600">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Comprehensive Travel Guide
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Updated for 2025 travel requirements
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BLOG */}
            <Link
              to="/blog"
              className={navItemStyles(location.pathname === "/blog")}
            >
              <span className="bg-gradient-to-r from-yellow-600 to-amber-500 absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></span>
              BLOG
            </Link>

            {/* CONTACT US */}
            <Link
              to="/contact-us"
              className={navItemStyles(location.pathname === "/contact-us")}
            >
              <span className="bg-gradient-to-r from-yellow-600 to-amber-500 absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></span>
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
                <span className="bg-gradient-to-r from-yellow-600 to-amber-500 absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></span>
                ABOUT US
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform duration-200 ${
                    activeDropdown === "about" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {getDropdownVisibility("about").shouldRender && (
                <div
                  className={`absolute left-0 bg-white shadow-xl border border-gray-200 rounded-lg z-50
                    transform-gpu will-change-transform transition-all duration-300 ease-in-out ${
                      getDropdownVisibility("about").isActive
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible translate-y-2"
                    }`}
                  style={{
                    top: "calc(100% + 0.5rem)",
                    minWidth: "220px",
                    maxWidth: "90vw",
                    right: 0,
                    left: "auto",
                    pointerEvents: getDropdownVisibility("about").isActive
                      ? "auto"
                      : "none",
                    overflowWrap: "break-word",
                    boxSizing: "border-box",
                  }}
                >
                  <ul className="py-3">
                    {aboutItems.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className="block px-6 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                          onClick={() => {
                            setActiveDropdown(null);
                            setStickyDropdown(null);
                            setIsTransitioning(false);
                          }}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden text-gray-700 focus:outline-none"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu - ENHANCED with premium travel section */}
        {/* Mobile Menu - Responsive Upgrade */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {/* Home */}

              {/* Trekking Dropdown */}
              <div>
                <button
                  className="w-full flex justify-between items-center py-2 px-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    setActiveDropdown(
                      activeDropdown === "mob-trekking" ? null : "mob-trekking"
                    );
                  }}
                  // Add touch-specific styles
                  style={{
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  Trekking in Nepal
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      activeDropdown === "mob-trekking" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeDropdown === "mob-trekking" && (
                  <div className="pl-2 pr-2 pt-3 pb-3 bg-gray-50 rounded-md max-h-[50vh] overflow-y-auto">
                    <Treks minimal onNavigate={() => setMobileOpen(false)} />
                  </div>
                )}
              </div>

              {/* Tours Dropdown */}
              <div>
                <button
                  className="w-full flex justify-between items-center py-2 px-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setActiveDropdown((prev) =>
                      prev === "mob-tours" ? null : "mob-tours"
                    );
                  }}
                >
                  Tours in Nepal
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      activeDropdown === "mob-tours" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activeDropdown === "mob-tours" && (
                  <div className="pl-4 pt-2">
                    <ToursDropdown minimal />
                  </div>
                )}
              </div>

              {/* Travel Info Dropdown */}
              <div>
                <button
                  className="w-full flex justify-between items-center py-2 px-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setActiveDropdown((prev) =>
                      prev === "mob-travel" ? null : "mob-travel"
                    );
                  }}
                >
                  Travel Info
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      activeDropdown === "mob-travel" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activeDropdown === "mob-travel" && (
                  <div className="pl-4 pt-2 space-y-2">
                    {travelItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          to={item.route}
                          key={item.name}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-sm"
                        >
                          <Icon className={`w-5 h-5 ${item.color}`} />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* About Us */}
              <div>
                <button
                  className="w-full flex justify-between items-center py-2 px-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setActiveDropdown((prev) =>
                      prev === "mob-about" ? null : "mob-about"
                    );
                  }}
                >
                  About Us
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      activeDropdown === "mob-about" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activeDropdown === "mob-about" && (
                  <div className="pl-4 pt-2 space-y-1">
                    {aboutItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Blog & Contact */}
              <Link
                to="/blog"
                onClick={() => setMobileOpen(false)}
                className="block py-2 px-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Blog
              </Link>
              <Link
                to="/contact-us"
                onClick={() => setMobileOpen(false)}
                className="block py-2 px-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Contact Us
              </Link>

              {/* Plan Your Trip CTA */}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
