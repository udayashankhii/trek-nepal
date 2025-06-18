import React from "react";
import { Link } from "react-router-dom";
import {
  Plane,
  Shield,
  Globe,
  HeartPulse,
  Luggage,
  Bus,
  HelpCircle,
} from "lucide-react";

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

export default function TravelInfoDropdown({ isOpen }) {
  return (
    <div
      className={`absolute right-0 bg-white shadow-2xl border border-gray-100 rounded-xl z-50 transition-all duration-300 ease-in-out 
        ${
          isOpen
            ? "opacity-100 visible translate-y-0 scale-100"
            : "opacity-0 invisible translate-y-2 scale-95"
        }`}
      style={{
        top: "calc(100% + 0.75rem)",
        minWidth: "400px",
        pointerEvents: isOpen ? "auto" : "none",
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
                  className="flex items-start p-3 space-x-3 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-yellow-50/80 hover:to-amber-50/50 hover:shadow-md hover:scale-[1.02] group"
                >
                  <div
                    className={`p-2 rounded-lg ${item.bgColor} group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${item.color}`}
                      strokeWidth={2.2}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-800 font-semibold group-hover:text-yellow-700 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
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
  );
}
