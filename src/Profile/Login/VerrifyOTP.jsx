// src/pages/VerifyOtp.jsx
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ShieldCheck, Loader2 } from "lucide-react";
import { verifyOtp, resendOtp } from "../../api/auth/auth.api.js";

/**
 * VerifyOtp Component
 *
 * OTP verification after registration.
 * Supports modal overlay mode via isModal prop.
 *
 * @param {boolean} isModal - Render compact for overlay use
 */
export default function VerifyOtp({ isModal = false }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const email = searchParams.get("email");

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleBackToRegister = (e) => {
    e.preventDefault();
    if (isModal) {
      navigate("/register", {
        state: { backgroundLocation: location.state?.backgroundLocation || location },
      });
    } else {
      navigate("/register", { replace: true });
    }
  };

  // Guard: No email in URL
  if (!email) {
    const noEmailContent = (
      <div className={isModal ? "px-6 py-6 sm:px-8 sm:py-7 text-center" : "bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center"}>
        <div className="w-14 h-14 mx-auto mb-3 bg-red-50 rounded-full flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-[#0F2A44] mb-2">OTP Verification</h2>
        <p className="text-sm text-gray-500 mb-5">No email found. Please register first.</p>
        <button 
          onClick={handleBackToRegister}
          className="w-full min-h-[44px] py-2.5 rounded-xl bg-[#0F2A44] text-white text-sm font-semibold
                     hover:bg-[#14385C] transition-all"
        >
          Go to Register
        </button>
      </div>
    );

    if (isModal) return noEmailContent;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
        {noEmailContent}
      </div>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await verifyOtp({ email, otp });
      toast.success("Account verified! You can now log in.");

      if (isModal) {
        navigate("/login", {
          state: { backgroundLocation: location.state?.backgroundLocation || location },
        });
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      toast.error(err.message || "Invalid code. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResending(true);
    try {
      await resendOtp({ email });
      toast.success("New code sent to your email.");
      setCountdown(60);
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error(err.message || "Couldn't resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const formContent = (
    <div className={isModal ? "px-6 py-6 sm:px-8 sm:py-7" : "bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"}>
      {/* Header */}
      <div className="text-center mb-5">
        <div className="w-14 h-14 mx-auto mb-3 bg-[#1F7A63]/10 rounded-full flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-[#1F7A63]" />
        </div>
        <h2
          id="verify-otp-modal-title"
          className="text-2xl font-bold text-[#0F2A44]"
        >
          Verify OTP
        </h2>
        <p className="text-xs text-gray-500 mt-1">We sent a verification code to:</p>
        <p className="text-sm font-semibold text-[#0F2A44] mt-0.5 break-all">{email}</p>
      </div>

      <form onSubmit={handleVerify} noValidate aria-label="OTP verification">
        <label htmlFor="otp-input" className="sr-only">6-digit OTP code</label>
        <input
          id="otp-input"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          inputMode="numeric"
          required
          autoFocus
          disabled={loading}
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300
                     text-center tracking-[0.3em] font-semibold
                     focus:ring-2 focus:ring-[#1F7A63] focus:border-[#1F7A63] focus:outline-none
                     disabled:opacity-50 transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-400"
        />

        <button 
          type="submit"
          disabled={loading || otp.length < 6}
          className="mt-4 w-full min-h-[44px] py-2.5 text-sm font-semibold rounded-xl
                     bg-[#0F2A44] text-white hover:bg-[#14385C]
                     focus:ring-4 focus:ring-[#0F2A44]/30 focus:outline-none
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2
                     transition-all transform hover:scale-[1.01] active:scale-[0.99]"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{loading ? "Verifying..." : "Verify OTP"}</span>
        </button>
      </form>

      {/* Resend */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          Didn&apos;t receive OTP?{" "}
          <button 
            type="button"
            onClick={handleResend}
            className="text-[#1F7A63] font-semibold hover:underline disabled:opacity-60 disabled:cursor-not-allowed
                       focus:underline focus:outline-none transition-colors"
            disabled={resending || countdown > 0}
          >
            {resending 
              ? "Resending..." 
              : countdown > 0 
                ? `Resend in ${countdown}s` 
                : "Resend"}
          </button>
        </p>
      </div>

      <p className="text-[11px] text-center text-gray-400 mt-3">
        Check your spam folder if you don&apos;t see the email
      </p>

      {/* Divider + back */}
      <div className="my-4 flex items-center">
        <div className="flex-1 border-t border-gray-200" aria-hidden="true" />
        <span className="px-3 text-xs text-gray-400">OR</span>
        <div className="flex-1 border-t border-gray-200" aria-hidden="true" />
      </div>

      <p className="text-center text-sm text-gray-600">
        Wrong email?{" "}
        <button
          type="button"
          onClick={handleBackToRegister}
          className="text-[#1F7A63] font-semibold hover:underline
                     focus:underline focus:outline-none transition-colors"
        >
          Register again
        </button>
      </p>
    </div>
  );

  if (isModal) {
    return formContent;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
      {formContent}
    </div>
  );
}
