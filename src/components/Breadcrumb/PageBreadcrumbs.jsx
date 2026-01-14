// src/components/Breadcrumb/PageBreadcrumbs.jsx
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import HeroBreadcrumbs from "./HeroBreadcrumbs.jsx";
import { useBreadcrumbVisibility } from "./BreadcrumbVisibilityContext.jsx";

const SEGMENT_LABELS = {
  "trekking-in-nepal": "Trekking in Nepal",
  "travel-styles": "Travel Styles",
  "travel-info": "Travel Info",
  "visa-information": "Visa Information",
  "health-safety": "Health & Safety",
  "packing-list": "Packing List",
  transportation: "Transportation",
  faqs: "FAQs",
  "contact-us": "Contact Us",
  "about-us": "About Us",
  "our-team": "Our Team",
  "how-to-make-a-payment": "Payment Guide",
  "privacy-policy": "Privacy Policy",
  "legal-documents": "Legal Documents",
  everest: "Everest Treks",
  annapurna: "Annapurna Treks",
  langtang: "Langtang Treks",
  manaslu: "Manaslu Treks",
  mustang: "Mustang Treks",
  treks: "Treks",
  "trek-booking": "Trek Booking",
  payment: "Payment",
  "customize-trip": "Customize Trip",
  "travel-activities": "Travel Activities",
  tours: "Tours",
  blog: "Blog",
  login: "Login",
  register: "Register",
  "verify-otp": "Verify OTP",
  "forgot-password": "Forgot Password",
  booking: "Booking",
  trekdetailpage: "Trek Details",
};
const SEGMENT_TARGETS = {
  treks: "/trekking-in-nepal",
};
const formatSegmentLabel = (segment) => {
  if (!segment) return "";

  const normalized = segment.toLowerCase();
  if (SEGMENT_LABELS[normalized]) return SEGMENT_LABELS[normalized];

  return normalized
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1)}` : ""))
    .join(" ")
    .trim();
};

const createBreadcrumbs = (pathname) => {
  const cleanedPath = pathname.replace(/\/+$/, "");
  const segments = cleanedPath.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: "Home" }];
  }

  const crumbs = [{ label: "Home", url: "/" }];
  let cumulativePath = "";

  segments.forEach((segment, index) => {
    cumulativePath += `/${segment}`;
    const decodedSegment = decodeURIComponent(segment);
    const label = formatSegmentLabel(decodedSegment);

    // map some segments to custom URLs
    const customUrl = SEGMENT_TARGETS[decodedSegment.toLowerCase()];

    crumbs.push({
      label: label || decodedSegment,
      ...(index < segments.length - 1
        ? { url: customUrl || cumulativePath }
        : {}),
    });
  });

  return crumbs;
};


const PageBreadcrumbs = () => {
  const location = useLocation();
  const { isHidden } = useBreadcrumbVisibility();

  // ✅ Hide on Home route only
  const isHome =
    location.pathname === "/" || location.pathname.replace(/\/+$/, "") === "";

  const breadcrumbs = useMemo(
    () => createBreadcrumbs(location.pathname),
    [location.pathname],
  );

  if (isHidden || isHome || !breadcrumbs || breadcrumbs.length === 0) return null;

  return (
    <div className="bg-white/40 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <HeroBreadcrumbs
          breadcrumbs={breadcrumbs}
          className="text-[10px] tracking-[0.5em]"
          textClassName="text-slate-500 hover:text-slate-700"
          separatorClassName="text-slate-300"
        />
      </div>
    </div>
  );
};

export default PageBreadcrumbs;
