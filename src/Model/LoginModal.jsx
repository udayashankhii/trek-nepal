import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LoginForm from "../Profile/Login/LoginForm.jsx";

export default function LoginModal() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the background location (where user was before login)
  const backgroundLocation = location.state?.backgroundLocation;

  const handleClose = () => {
    // Navigate back or to the background location
    if (backgroundLocation) {
      navigate(backgroundLocation.pathname + backgroundLocation.search);
    } else {
      navigate(-1);
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      {/* Modal Container */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close login modal"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Login Form */}
        <LoginForm onClose={handleClose} onSuccess={handleClose} />
      </div>
    </div>
  );
}
