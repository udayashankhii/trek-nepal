// components/HoverDropdown.jsx
import React from "react";

const HoverDropdown = ({
  children,
  active,
  position = "left",
  width = "300px",
  parentRef,
}) => {
  const positionClass = position === "left" ? "left-0" : "right-0";

  return (
    <div
      className={`absolute ${positionClass} bg-white shadow-xl border border-gray-200 rounded-lg z-50 transition-all duration-300 ${
        active ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      style={{
        width,
        top:
          parentRef?.current?.getBoundingClientRect().bottom +
          window.scrollY +
          4,
      }}
    >
      <div className="p-6">{children}</div>
    </div>
  );
};

export default HoverDropdown;
