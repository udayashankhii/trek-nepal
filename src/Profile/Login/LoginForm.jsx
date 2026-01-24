// src/components/Login/LoginForm.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "./GoogleLoginButton";
import { Link } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import { login } from "../../api/auth/auth.api.js";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = new URLSearchParams(location.search).get("next") || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear specific field error on input
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await login({ 
        email: formData.email.trim(), 
        password: formData.password 
      });

      toast.success("Welcome to EverTrek Nepal 🌄");

      if (onSuccess) {
        onSuccess();
      } else if (onClose) {
        onClose();
      }

      setTimeout(() => {
        navigate(nextPath);
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      setErrors({ form: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (onClose) onClose();
    navigate("/register");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* Mobile-first responsive container with proper padding */}
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
        
        {/* Header Section - Responsive sizing */}
        <div className="text-center mb-4 sm:mb-6">
          <img
            src="/log.webp"
            className="w-20 h-15 sm:w-18 sm:h-15 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3"
            alt="EverTrek Nepal Logo"
            loading="lazy"
          />
          <h2
            id="login-modal-title"
            className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F2A44]"
          >
            EverTrek Nepal
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Login to your account
          </p>
        </div>

        {/* Form Error Alert - Full width on mobile */}
        {errors.form && (
          <div 
            role="alert"
            className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg bg-red-50 border border-red-200"
          >
            <p className="text-xs sm:text-sm text-red-600 text-center">
              {errors.form}
            </p>
          </div>
        )}

        {/* Login Form - Mobile optimized */}
        <form 
          onSubmit={handleLogin} 
          className="space-y-3 sm:space-y-4" 
          noValidate
          aria-label="Login form"
        >
          {/* Email Field - Touch-friendly input */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <Mail 
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 
                           w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" 
                aria-hidden="true"
              />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`
                  w-full pl-10 sm:pl-12 pr-3 sm:pr-4 
                  py-2.5 sm:py-3 md:py-3.5
                  text-sm sm:text-base
                  rounded-lg sm:rounded-xl 
                  border transition-all duration-200
                  ${errors.email
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-[#1F7A63] focus:border-[#1F7A63]'
                  } 
                  focus:ring-2 focus:outline-none
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                disabled={loading}
              />
            </div>
            {errors.email && (
              <p 
                id="email-error"
                role="alert"
                className="mt-1 text-xs sm:text-sm text-red-500"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field - Touch-friendly input */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <Lock 
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 
                           w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" 
                aria-hidden="true"
              />
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={`
                  w-full pl-10 sm:pl-12 pr-3 sm:pr-4 
                  py-2.5 sm:py-3 md:py-3.5
                  text-sm sm:text-base
                  rounded-lg sm:rounded-xl 
                  border transition-all duration-200
                  ${errors.password
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-[#1F7A63] focus:border-[#1F7A63]'
                  } 
                  focus:ring-2 focus:outline-none
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                disabled={loading}
              />
            </div>
            {errors.password && (
              <p 
                id="password-error"
                role="alert"
                className="mt-1 text-xs sm:text-sm text-red-500"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password Link - Touch-friendly */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              onClick={onClose}
              className="text-xs sm:text-sm text-[#1F7A63] font-semibold 
                         hover:underline focus:underline focus:outline-none 
                         transition-colors inline-block py-1"
              tabIndex={0}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button - Touch-optimized (44px minimum) */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full 
              min-h-[44px] py-2.5 sm:py-3 md:py-3.5
              px-4
              text-sm sm:text-base font-semibold
              rounded-lg sm:rounded-xl 
              bg-[#0F2A44] text-white 
              hover:bg-[#14385C] 
              focus:bg-[#14385C]
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
            <span>{loading ? "Signing in..." : "Login"}</span>
          </button>
        </form>

        {/* Divider - Responsive spacing */}
        <div className="my-4 sm:my-5 md:my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200" aria-hidden="true"></div>
          <span className="px-3 sm:px-4 text-xs sm:text-sm text-gray-400">OR</span>
          <div className="flex-1 border-t border-gray-200" aria-hidden="true"></div>
        </div>

        {/* Google Login - Touch-optimized */}
        <GoogleLoginButton onSuccess={onSuccess} />

        {/* Register Link - Touch-friendly */}
        <p className="text-center mt-4 sm:mt-5 md:mt-6 text-xs sm:text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            onClick={handleRegisterClick}
            className="text-[#1F7A63] font-semibold hover:underline 
                       focus:underline focus:outline-none transition-colors 
                       inline-block py-1"
            tabIndex={0}
          >
            Register
          </Link>
        </p>
      </div>
    </GoogleOAuthProvider>
  );
}
