// LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "./GogleLogin";
import { Link } from "react-router-dom";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginForm({ onClose }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/accounts/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Invalid credentials");

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("role", data.role);

      toast.success("Welcome to EverTrek Nepal 🌄");
      onClose(); // Close modal
      navigate("/");
      window.location.reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    onClose(); // Close login modal
    navigate("/register"); // Navigate to register page
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="p-8">
        <div className="text-center mb-6">
          <img src="/logo7.webp" className="w-16 mx-auto mb-3" alt="Logo" />
          <h2 className="text-2xl font-bold text-[#0F2A44]">
            EverTrek Nepal
          </h2>
          <p className="text-sm text-gray-500">Login to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#1F7A63] focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#1F7A63] focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0F2A44] text-white font-semibold hover:bg-[#14385C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="my-5 text-center text-sm text-gray-400">OR</div>

        {/* Google Login Button */}
        <GoogleLoginButton />

<p className="text-center mt-6 text-sm">
  Don&apos;t have an account?{" "}
  <Link
    to="/register"
    onClick={onClose}
    className="text-[#1F7A63] font-semibold hover:underline"
  >
    Register
  </Link>
</p>

      </div>
    </GoogleOAuthProvider>
  );
}

