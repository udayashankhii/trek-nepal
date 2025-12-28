import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  
  const email = searchParams.get("email");

  // Guard: No email in URL
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <h2 className="text-xl font-bold text-[#0F2A44] mb-4">OTP Verification</h2>
          <p className="text-gray-600 mb-6">No email found in link.</p>
          <button 
            onClick={() => navigate("/register")}
            className="w-full py-3 rounded-xl bg-[#1F7A63] text-white font-semibold hover:bg-[#1A5F4E]"
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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/accounts/verify-otp/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid OTP");

      toast.success("Account verified successfully! ✅");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-[#0F2A44] mb-6">
          Verify OTP
        </h2>
        
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-2">OTP sent to:</p>
          <p className="font-semibold text-[#0F2A44]">{email}</p>
        </div>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1F7A63] focus:outline-none text-center text-lg tracking-widest"
          required
        />

        <button 
          type="submit"
          disabled={loading || otp.length < 6}
          className="w-full mt-6 py-3 rounded-xl bg-[#0F2A44] text-white font-semibold hover:bg-[#14385C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="text-center mt-4 text-sm text-gray-500">
          Didn't receive OTP?{" "}
          <button 
            type="button"
            onClick={() => navigate("/register")}
            className="text-[#1F7A63] font-semibold hover:underline"
          >
            Resend
          </button>
        </p>
      </form>
    </div>
  );
}
