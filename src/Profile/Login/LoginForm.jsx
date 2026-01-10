// src/components/Login/LoginForm.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "./GoogleLoginButton";
import { Link } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import { login } from "../../api/auth.api.js";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = new URLSearchParams(location.search).get("next") || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
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
      await login({ email: formData.email, password: formData.password });

      toast.success("Welcome to EverTrek Nepal 🌄");
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      } else if (onClose) {
        onClose();
      }

      // Navigate after short delay
      setTimeout(() => {
        navigate(nextPath);
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed. Please try again.");
      setErrors({ form: err.message });
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
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <img 
            src="/logo7.webp" 
            className="w-16 mx-auto mb-3" 
            alt="EverTrek Nepal Logo" 
            loading="lazy"
          />
          <h2 
            id="login-modal-title"
            className="text-2xl font-bold text-[#0F2A44]"
          >
            EverTrek Nepal
          </h2>
          <p className="text-sm text-gray-500 mt-1">Login to your account</p>
        </div>

        {/* Form Error */}
        {errors.form && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600 text-center">{errors.form}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          {/* Email Field */}
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-colors
                  ${errors.email 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-[#1F7A63] focus:border-[#1F7A63]'
                  } focus:ring-2 focus:outline-none`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-colors
                  ${errors.password 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-[#1F7A63] focus:border-[#1F7A63]'
                  } focus:ring-2 focus:outline-none`}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              onClick={onClose}
              className="text-sm text-[#1F7A63] font-semibold hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0F2A44] text-white font-semibold 
                     hover:bg-[#14385C] transition-all disabled:opacity-50 
                     disabled:cursor-not-allowed flex items-center justify-center gap-2
                     transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-400">OR</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google Login */}
        <GoogleLoginButton onSuccess={onSuccess} />

        {/* Register Link */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            onClick={handleRegisterClick}
            className="text-[#1F7A63] font-semibold hover:underline transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </GoogleOAuthProvider>
  );
}
