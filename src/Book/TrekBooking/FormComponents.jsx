// src/components/FormComponents.jsx
import React from "react";
import { Users, Plus, Minus } from "lucide-react";

/**
 * Reusable Input Field with Icon and Validation
 */
export function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  Icon = null,
  error = "",
  readOnly = false,
  min = "",
  helperText = "",
  className = "",
}) {
  const inputClasses = `w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors ${
    Icon ? "pl-12" : ""
  } ${
    readOnly
      ? "border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed"
      : "border-gray-200 focus:border-indigo-500"
  }`;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          min={min}
          className={inputClasses}
        />
        {Icon && <Icon className="absolute left-4 top-4 w-5 h-5 text-gray-400" />}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}

/**
 * Reusable Select Dropdown with Icon
 */
export function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  Icon = null,
  placeholder = "Select an option",
  className = "",
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 ${
            Icon ? "pl-12 appearance-none" : ""
          }`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option, idx) => {
            const optionValue = typeof option === "string" ? option : option.value;
            const optionLabel = typeof option === "string" ? option : option.label;
            return (
              <option key={idx} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
        {Icon && <Icon className="absolute left-4 top-4 w-5 h-5 text-gray-400" />}
      </div>
    </div>
  );
}

/**
 * Reusable Textarea Field
 */
export function TextareaField({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder = "",
  required = false,
  className = "",
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 resize-none"
      />
    </div>
  );
}

/**
 * Section Container with Gradient Background
 */
export function SectionContainer({
  Icon = null,
  title,
  subtitle = "",
  children,
  gradientFrom = "indigo-50",
  gradientTo = "purple-50",
  iconColor = "indigo-600",
}) {
  return (
    <div
      className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-2xl p-6`}
    >
      {(Icon || title) && (
        <div className="flex items-center space-x-3 mb-6">
          {Icon && <Icon className={`w-6 h-6 text-${iconColor}`} />}
          {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
        </div>
      )}
      {subtitle && <p className="text-sm text-gray-600 mb-6">{subtitle}</p>}
      {children}
    </div>
  );
}

/**
 * Traveller Counter Component
 */
export function TravellerCounter({ travellers, setTravellers }) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        Number of Travellers <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center justify-between max-w-xs">
        <button
          type="button"
          onClick={() => setTravellers((t) => Math.max(1, t - 1))}
          className="w-12 h-12 bg-indigo-100 hover:bg-indigo-200 rounded-full flex items-center justify-center transition-colors"
          aria-label="Decrease travellers"
        >
          <Minus className="w-5 h-5 text-indigo-600" />
        </button>

        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-2xl font-bold text-gray-900">{travellers}</span>
          <span className="text-gray-500">
            {travellers === 1 ? "person" : "people"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setTravellers((t) => t + 1)}
          className="w-12 h-12 bg-indigo-100 hover:bg-indigo-200 rounded-full flex items-center justify-center transition-colors"
          aria-label="Increase travellers"
        >
          <Plus className="w-5 h-5 text-indigo-600" />
        </button>
      </div>
    </div>
  );
}

/**
 * Submit Button with Validation States
 */
export function SubmitButton({ 
  formValid, 
  submitting = false,
  text = "Complete Booking & Pay Now" 
}) {
  return (
    <button
      type="submit"
      disabled={!formValid || submitting}
      className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all ${
        formValid && !submitting
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      {submitting
        ? "Creating Booking..."
        : formValid
        ? text
        : "Please Complete Required Fields"}
    </button>
  );
}
