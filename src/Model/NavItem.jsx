// components/NavItem.jsx
import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import HoverDropdown from "./NavHover";

const NavItem = ({
  title,
  to,
  subItems = [],
  isActivePath,
  mobileOpen,
  onItemClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const parentRef = useRef(null);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024 && !mobileOpen) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      setIsHovered(false);
    }
  };

  const handleMobileToggle = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
      onItemClick?.();
    }
  };

  return (
    <li
      className="relative group"
      ref={parentRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between">
        <NavLink
          to={to}
          onClick={handleMobileToggle}
          className={({ isActive }) =>
            `px-3 py-2 transition-colors duration-300 flex items-center ${
              isActive || isActivePath
                ? "text-yellow-600 border-b-2 border-yellow-600"
                : "text-gray-700 hover:text-yellow-600 border-b-2 border-transparent"
            }`
          }
        >
          {title}
          {subItems.length > 0 && (
            <ChevronDown
              className={`ml-1 w-4 h-4 transition-transform ${
                isHovered || isMobileOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </NavLink>
      </div>

      {/* Desktop Dropdown */}
      {subItems.length > 0 && (
        <HoverDropdown
          active={isHovered}
          parentRef={parentRef}
          width={
            subItems.some((item) => item.subItems)
              ? "min(100vw, 1420px)"
              : "300px"
          }
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subItems.map((item, idx) => (
              <div key={idx}>
                <NavLink
                  to={item.to}
                  className="block p-3 hover:bg-gray-50 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  {item.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {item.description}
                    </p>
                  )}
                </NavLink>
                {item.subItems && (
                  <div className="mt-2 pl-4 border-l-2 border-gray-100">
                    {item.subItems.map((subItem, subIdx) => (
                      <NavLink
                        key={subIdx}
                        to={subItem.to}
                        className="block p-2 text-sm hover:bg-gray-50 rounded"
                      >
                        {subItem.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </HoverDropdown>
      )}

      {/* Mobile Dropdown */}
      {subItems.length > 0 && isMobileOpen && (
        <div className="lg:hidden pl-4 mt-2 border-l-2 border-gray-200">
          {subItems.map((item, idx) => (
            <div key={idx} className="my-1">
              <NavLink
                to={item.to}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
                onClick={onItemClick}
              >
                {item.title}
              </NavLink>
            </div>
          ))}
        </div>
      )}
    </li>
  );
};

export default NavItem;
