// src/Model/RegisterModal.jsx
import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useCallback } from "react";
import Register from "../Profile/Login/RegisterForm.jsx";

/**
 * RegisterModal Component
 *
 * Professional overlay modal for registration — matches LoginModal style.
 * Wider layout with compact fields to avoid scrollbar.
 */
export default function RegisterModal() {
  const navigate = useNavigate();
  const location = useLocation();

  const backgroundLocation = location.state?.backgroundLocation;

  const handleClose = useCallback(() => {
    if (backgroundLocation) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  }, [backgroundLocation, navigate]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[520px] overflow-hidden
                   animate-[modalIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-gray-100 
                     transition-colors group"
          aria-label="Close register modal"
          type="button"
        >
          <X className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors" />
        </button>

        {/* Register form */}
        <Register isModal onClose={handleClose} />
      </div>
    </div>
  );
}
