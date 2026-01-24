import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword as resetPasswordRequest } from "../../api/auth/auth.api.js";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
      toast.success("Reset code sent to your email ✅");
      setStep(2);
    } catch (err) {
      toast.error(err.message || "Failed to request reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPasswordRequest({ email, otp, new_password: newPassword });

      toast.success("Password reset successful ✅");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-[#0F2A44] mb-4">
          Reset Password
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          {step === 1
            ? "Enter your email to receive a reset code."
            : "Enter the code and your new password."}
        </p>

        {step === 1 ? (
          <form onSubmit={requestCode} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#1F7A63] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0F2A44] text-white font-semibold hover:bg-[#14385C] disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="text"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#1F7A63] focus:outline-none text-center tracking-widest"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#1F7A63] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0F2A44] text-white font-semibold hover:bg-[#14385C] disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
