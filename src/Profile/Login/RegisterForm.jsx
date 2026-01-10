// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  User2,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { register } from "../../api/auth.api.js";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    role: "user",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
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

      toast.success("OTP sent to your email ✅");
      navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.message || "Registration failed");
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  const iconForField = (field) => {
    if (field === "username") return <User2 className="h-4 w-4 text-slate-400" />;
    if (field === "email") return <Mail className="h-4 w-4 text-slate-400" />;
    if (field === "phone_number") return <Phone className="h-4 w-4 text-slate-400" />;
    if (field === "password" || field === "confirm_password") return <Lock className="h-4 w-4 text-slate-400" />;
    return <ShieldCheck className="h-4 w-4 text-slate-400" />;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex justify-center py-10">
      <div className="w-full max-w-lg px-4">
        <div className="relative bg-white p-8 rounded-2xl shadow-[0_18px_45px_rgba(15,42,68,0.12)] border border-slate-100 overflow-hidden">
          {/* Badge */}
          <div className="absolute inset-x-0 -top-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-[10px] font-medium text-slate-100 px-3 py-1 shadow-lg">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Secure Trekker Account
            </div>
          </div>

          <h2 className="mt-2 text-2xl font-semibold text-center text-[#0F2A44] tracking-tight">
            Create EverTrek Account
          </h2>
          <p className="text-xs text-gray-500 text-center mb-6">
            Sign up with your email and phone number to get started.
          </p>

          {/* Form Error */}
          {errors.form && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600 text-center">{errors.form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {["username", "email", "phone_number"].map((field) => (
              <div key={field} className="space-y-1">
                <label
                  htmlFor={field}
                  className="flex items-center justify-between text-xs font-medium text-gray-600 tracking-wide"
                >
                  <span>{field.replace("_", " ").toUpperCase()}</span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    {iconForField(field)}
                  </span>
                  <input
                    id={field}
                    name={field}
                    placeholder={field.replace("_", " ").toUpperCase()}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    type={
                      field === "email"
                        ? "email"
                        : field === "phone_number"
                        ? "tel"
                        : "text"
                    }
                    autoComplete={
                      field === "username"
                        ? "username"
                        : field === "email"
                        ? "email"
                        : "tel"
                    }
                    className={`w-full pl-9 pr-3.5 py-2.5 border rounded-lg text-sm
                               placeholder:text-slate-400 bg-slate-50/60
                               focus:bg-white focus:outline-none focus:ring-2 transition-shadow transition-colors
                               ${errors[field] 
                                 ? 'border-red-300 focus:ring-red-500' 
                                 : 'border-slate-200 focus:ring-[#1F7A63] focus:border-transparent'
                               }`}
                  />
                </div>
                {errors[field] && (
                  <p className="text-xs text-red-500">{errors[field]}</p>
                )}
              </div>
            ))}

            {["password", "confirm_password"].map((field) => (
              <div key={field} className="space-y-1">
                <label
                  htmlFor={field}
                  className="flex items-center justify-between text-xs font-medium text-gray-600 tracking-wide"
                >
                  <span>{field.replace("_", " ").toUpperCase()}</span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    {iconForField(field)}
                  </span>
                  <input
                    id={field}
                    type="password"
                    name={field}
                    placeholder={field.replace("_", " ").toUpperCase()}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className={`w-full pl-9 pr-3.5 py-2.5 border rounded-lg text-sm
                               placeholder:text-slate-400 bg-slate-50/60
                               focus:bg-white focus:outline-none focus:ring-2 transition-shadow transition-colors
                               ${errors[field] 
                                 ? 'border-red-300 focus:ring-red-500' 
                                 : 'border-slate-200 focus:ring-[#1F7A63] focus:border-transparent'
                               }`}
                  />
                </div>
                {errors[field] && (
                  <p className="text-xs text-red-500">{errors[field]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full py-2.5 rounded-full bg-gradient-to-r from-[#1F7A63] to-[#0F2A44]
                         text-white text-sm font-semibold tracking-wide shadow-md
                         hover:from-[#1A5F4E] hover:to-[#0B2037]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                         focus-visible:ring-[#1F7A63] disabled:opacity-60 disabled:cursor-not-allowed
                         transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating..." : "Register"}
            </button>

            <p className="text-[11px] text-center text-gray-500 mt-2">
              Protected by modern encryption & secure OTP verification.
            </p>

            <p className="text-center mt-4 text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#1F7A63] font-semibold hover:underline transition-colors"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
