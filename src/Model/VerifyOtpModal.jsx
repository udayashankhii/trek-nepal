// src/Model/VerifyOtpModal.jsx
import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useCallback } from "react";
import VerifyOtp from "../Profile/Login/VerrifyOTP.jsx";

/**
 * VerifyOtpModal — overlay modal for OTP verification.
 * Matches LoginModal / RegisterModal design language.
 */
export default function VerifyOtpModal() {
  const navigate = useNavigate();
  const location = useLocation();

  const backgroundLocation = location.state?.backgroundLocation;

  const handleClose = useCallback(() => {
    if (backgroundLocation) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  }, [backgroundLocation, navigate]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="verify-otp-modal-title"
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden
                   animate-[modalIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-gray-100
                     transition-colors group"
          aria-label="Close modal"
          type="button"
        >
          <X className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors" />
        </button>

        <VerifyOtp isModal />
      </div>
    </div>
  );
}
