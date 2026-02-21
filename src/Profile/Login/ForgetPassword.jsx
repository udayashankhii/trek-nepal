import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import {
  forgotPassword,
  resetPassword as resetPasswordRequest,
} from "../../api/auth/auth.api.js";

/**
 * ForgotPassword Component
 *
 * Two-step password reset: (1) request code, (2) enter code + new password.
 * Supports modal overlay mode via isModal prop.
 *
 * @param {boolean} isModal - Render compact for overlay use
 */
export default function ForgotPassword({ isModal = false }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleBackToLogin = (e) => {
    e.preventDefault();
    if (isModal) {
      navigate("/login", {
        state: { backgroundLocation: location.state?.backgroundLocation || location },
      });
    } else {
      navigate("/login", { replace: true });
    }
  };

  // STEP 1: Request reset code
  const requestCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPassword({ email });
      toast.success("Reset code sent! Check your inbox.");
      setStep(2);
    } catch (err) {
      toast.error(err.message || "Couldn't send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPasswordRequest({
        email,
        otp,
        new_password: newPassword,
      });

      toast.success("Password changed successfully! Please log in with your new password.");

      if (isModal) {
        navigate("/login", {
          state: { backgroundLocation: location.state?.backgroundLocation || location },
        });
      } else {
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.message || "Password reset failed. Please check your code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className={isModal ? "px-6 py-6 sm:px-8 sm:py-7" : "w-full max-w-md bg-white rounded-2xl shadow-xl p-8"}>
      {/* Header */}
      <div className="text-center mb-5">
        <div className="w-14 h-14 mx-auto mb-3 bg-[#1F7A63]/10 rounded-full flex items-center justify-center">
          <KeyRound className="w-7 h-7 text-[#1F7A63]" />
        </div>
        <h2
          id="forgot-pw-modal-title"
          className="text-2xl font-bold text-[#0F2A44]"
        >
          Reset Password
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {step === 1
            ? "Enter your email to receive a reset code."
            : "Enter the code and your new password."}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 1 ? "bg-[#1F7A63]" : "bg-gray-200"}`} />
        <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 2 ? "bg-[#1F7A63]" : "bg-gray-200"}`} />
      </div>

      {step === 1 ? (
        <form onSubmit={requestCode} noValidate aria-label="Request reset code">
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
              disabled={loading}
              className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-gray-300
                         focus:ring-2 focus:ring-[#1F7A63] focus:border-[#1F7A63] focus:outline-none
                         disabled:opacity-50 transition-all placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full min-h-[44px] py-2.5 text-sm font-semibold rounded-xl
                       bg-[#0F2A44] text-white hover:bg-[#14385C]
                       focus:ring-4 focus:ring-[#0F2A44]/30 focus:outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2
                       transition-all transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{loading ? "Sending..." : "Send Reset Code"}</span>
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} noValidate aria-label="Reset password">
          <div className="space-y-3">
            {/* OTP input */}
            <div>
              <label htmlFor="reset-otp" className="sr-only">Reset code</label>
              <input
                id="reset-otp"
                type="text"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]{6}"
                autoFocus
                disabled={loading}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300
                           text-center tracking-[0.3em] font-semibold
                           focus:ring-2 focus:ring-[#1F7A63] focus:border-[#1F7A63] focus:outline-none
                           disabled:opacity-50 transition-all placeholder:text-gray-400 placeholder:tracking-normal placeholder:font-normal"
              />
            </div>

            {/* New password */}
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                disabled={loading}
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-gray-300
                           focus:ring-2 focus:ring-[#1F7A63] focus:border-[#1F7A63] focus:outline-none
                           disabled:opacity-50 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full min-h-[44px] py-2.5 text-sm font-semibold rounded-xl
                       bg-[#0F2A44] text-white hover:bg-[#14385C]
                       focus:ring-4 focus:ring-[#0F2A44]/30 focus:outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2
                       transition-all transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{loading ? "Resetting..." : "Reset Password"}</span>
          </button>
        </form>
      )}

      {/* Divider + back to login */}
      <div className="my-4 flex items-center">
        <div className="flex-1 border-t border-gray-200" aria-hidden="true" />
        <span className="px-3 text-xs text-gray-400">OR</span>
        <div className="flex-1 border-t border-gray-200" aria-hidden="true" />
      </div>

      <p className="text-center text-sm text-gray-600">
        Remember your password?{" "}
        <button
          type="button"
          onClick={handleBackToLogin}
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
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4">
      {formContent}
    </div>
  );
}
