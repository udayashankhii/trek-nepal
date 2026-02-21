// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  User2,
  Mail,
  Phone,
  Lock,
  Loader2,
} from "lucide-react";
import { register } from "../../api/auth/auth.api.js";

/**
 * Register Component
 *
 * Compact, professional registration form.
 * In modal mode: renders without wrapper, two-column layout, no scrollbar.
 * In standalone mode: renders with full-page wrapper.
 *
 * @param {boolean} isModal - When true, renders compact for overlay use
 */
export default function Register({ isModal = false }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    role: "user",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone_number || formData.phone_number.length < 10) {
      newErrors.phone_number = "Please enter a valid phone number";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData);
      toast.success("Verification code sent to your email.");
      navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.message || "Registration failed. Please try again.");
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (isModal) {
      navigate("/login", {
        state: { backgroundLocation: location.state?.backgroundLocation || location },
      });
    } else {
      navigate("/login", { replace: true });
    }
  };

  /* ───── Reusable field renderer ───── */
  const renderField = (field, { type = "text", placeholder, icon: Icon, autoComplete }) => (
    <div key={field}>
      <label htmlFor={field} className="sr-only">
        {placeholder}
      </label>
      <div className="relative">
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          id={field}
          name={field}
          type={type}
          placeholder={placeholder}
          value={formData[field]}
          onChange={handleChange}
          required
          autoComplete={autoComplete}
          disabled={loading}
          aria-invalid={errors[field] ? "true" : "false"}
          className={`
            w-full pl-10 pr-3 py-2.5
            text-sm rounded-xl border
            transition-all duration-200
            placeholder:text-gray-400
            disabled:opacity-50 disabled:cursor-not-allowed
            ${errors[field]
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-[#1F7A63] focus:border-[#1F7A63]'
            }
            focus:ring-2 focus:outline-none
          `}
        />
      </div>
      {errors[field] && (
        <p className="mt-0.5 text-[11px] text-red-500">{errors[field]}</p>
      )}
    </div>
  );

  /* ───── Modal content ───── */
  const formContent = (
    <div className={isModal ? "px-6 py-6 sm:px-8 sm:py-7" : "relative bg-white p-8 rounded-2xl shadow-[0_18px_45px_rgba(15,42,68,0.12)] border border-slate-100 overflow-hidden"}>

      {/* Header */}
      <div className="text-center mb-5">
        <img
          src="/log.webp"
          className="w-14 h-14 mx-auto mb-2"
          alt="EverTrek Nepal Logo"
          loading="lazy"
        />
        <h2
          id="register-modal-title"
          className="text-2xl font-bold text-[#0F2A44]"
        >
          EverTrek Nepal
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Create your trekker account
        </p>
      </div>

      {/* Form Error */}
      {errors.form && (
        <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200">
          <p className="text-xs text-red-600 text-center">{errors.form}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate aria-label="Registration form">
        {/* Row 1: Username & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {renderField("username", {
            placeholder: "Username",
            icon: User2,
            autoComplete: "username",
          })}
          {renderField("email", {
            type: "email",
            placeholder: "Email address",
            icon: Mail,
            autoComplete: "email",
          })}
        </div>

        {/* Row 2: Phone (full width) */}
        <div className="mt-3">
          {renderField("phone_number", {
            type: "tel",
            placeholder: "Phone number",
            icon: Phone,
            autoComplete: "tel",
          })}
        </div>

        {/* Row 3: Password & Confirm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {renderField("password", {
            type: "password",
            placeholder: "Password",
            icon: Lock,
            autoComplete: "new-password",
          })}
          {renderField("confirm_password", {
            type: "password",
            placeholder: "Confirm password",
            icon: Lock,
            autoComplete: "new-password",
          })}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
            mt-5 w-full
            min-h-[44px] py-2.5
            text-sm font-semibold
            rounded-xl
            bg-[#0F2A44] text-white
            hover:bg-[#14385C]
            focus:ring-4 focus:ring-[#0F2A44]/30
            focus:outline-none
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
            transform hover:scale-[1.01] active:scale-[0.99]
            touch-manipulation
          "
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          <span>{loading ? "Creating account..." : "Create Account"}</span>
        </button>
      </form>

      {/* Divider */}
      <div className="my-4 flex items-center">
        <div className="flex-1 border-t border-gray-200" aria-hidden="true" />
        <span className="px-3 text-xs text-gray-400">OR</span>
        <div className="flex-1 border-t border-gray-200" aria-hidden="true" />
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={handleLoginClick}
          disabled={loading}
          className="text-[#1F7A63] font-semibold hover:underline
                     focus:underline focus:outline-none transition-colors"
        >
          Login
        </button>
      </p>
    </div>
  );

  if (isModal) {
    return formContent;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex justify-center items-center py-10">
      <div className="w-full max-w-[520px] px-4">
        {formContent}
      </div>
    </div>
  );
}
