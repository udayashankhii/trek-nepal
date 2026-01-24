// src/pages/VerifyOtp.jsx
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { verifyOtp, resendOtp } from "../../api/auth/auth.api.js";

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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

  // Guard: No email in URL
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0F2A44] mb-4">OTP Verification</h2>
          <p className="text-gray-600 mb-6">No email found in URL.</p>
          <button 
            onClick={() => navigate("/register")}
            className="w-full py-3 rounded-xl bg-[#1F7A63] text-white font-semibold hover:bg-[#1A5F4E] transition-colors"
          >
            Go to Register
          </button>
        </div>
      </div>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await verifyOtp({ email, otp });

      toast.success("Account verified successfully! ✅");
      navigate("/login");
    } catch (err) {
      console.error("OTP verification error:", err);
      toast.error(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResending(true);
    try {
      await resendOtp({ email });
      toast.success("OTP resent to your email ✅");
      setCountdown(60); // 60 second cooldown
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error(err.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigate("/register")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1F7A63] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Register
        </button>

        <form
          onSubmit={handleVerify}
          className="bg-white p-8 rounded-2xl shadow-xl"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#1F7A63]/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#1F7A63]" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-[#0F2A44] mb-2">
            Verify OTP
          </h2>
          
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-1">We sent a verification code to:</p>
            <p className="font-semibold text-[#0F2A44] break-all">{email}</p>
          </div>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1F7A63] focus:outline-none text-center text-lg tracking-widest font-semibold"
            required
            autoFocus
          />

          <button 
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full mt-6 py-3 rounded-xl bg-[#0F2A44] text-white font-semibold 
                     hover:bg-[#14385C] disabled:opacity-50 disabled:cursor-not-allowed 
                     transition-all flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Didn't receive OTP?{" "}
              <button 
                type="button"
                onClick={handleResend}
                className="text-[#1F7A63] font-semibold hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
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

          <p className="text-xs text-center text-gray-400 mt-4">
            Check your spam folder if you don't see the email
          </p>
        </form>
      </div>
    </div>
  );
}
