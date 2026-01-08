// components/common/LoadingSpinner.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * A reusable loading spinner component with customizable size, color, and text
 * @param {Object} props - Component props
 * @param {string} props.size - Size variant: 'xs', 'sm', 'md', 'lg', 'xl'
 * @param {string} props.color - Tailwind color class (e.g., 'amber-500', 'blue-600')
 * @param {string} props.text - Optional loading text to display below spinner
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fullScreen - Whether to center spinner on full screen
 */
export default function LoadingSpinner({
  size = "md",
  color = "amber-500",
  text = "",
  className = "",
  fullScreen = false,
}) {
  // Size mappings for spinner dimensions
  const sizeClasses = {
    xs: "h-4 w-4 border-2",
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-b-2",
    lg: "h-16 w-16 border-b-3",
    xl: "h-20 w-20 border-b-4",
  };

  // Text size mappings
  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const textSize = textSizeClasses[size] || textSizeClasses.md;

  const containerClasses = fullScreen
    ? "flex flex-col justify-center items-center min-h-screen"
    : "flex flex-col justify-center items-center py-12";

  return (
    <div
      className={`${containerClasses} ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={`animate-spin rounded-full ${spinnerSize} border-${color}`}
        aria-hidden="true"
      />
      {text && (
        <p className={`mt-4 ${textSize} text-gray-600 font-medium`}>
          {text}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  color: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
  fullScreen: PropTypes.bool,
};

LoadingSpinner.defaultProps = {
  size: "md",
  color: "amber-500",
  text: "",
  className: "",
  fullScreen: false,
};
