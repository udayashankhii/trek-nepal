// src/Model/LoginModal.jsx
import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LoginForm from "../Profile/Login/LoginForm.jsx";

export default function LoginModal() {
  const navigate = useNavigate();
  const location = useLocation();

  const backgroundLocation = location.state?.backgroundLocation;

  const handleClose = () => {
    console.log('❌ Login cancelled');

    if (backgroundLocation) {
      navigate(backgroundLocation.pathname + (backgroundLocation.search || ''), {
        replace: true
      });
    } else {
      navigate(-1);
    }
  };

  const handleSuccess = () => {
    console.log('✅ Login success');

    // ✅ Clear backgroundLocation state to prevent modal from re-rendering
    const targetPath = backgroundLocation?.pathname || '/';
    const targetSearch = backgroundLocation?.search || '';

    // ✅ Navigate and replace history
    console.log('🔄 LoginModal navigating to:', targetPath);

    // ⛔ HARD RELOAD FORCE - Fix sticky modal issue
    // Using window.location.href guarantees a fresh state and breaks any redirect loops
    const finalUrl = targetPath + targetSearch;
    window.location.href = finalUrl;
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
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
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 
                     transition-colors group"
          aria-label="Close login modal"
          type="button"
        >
          <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </button>

        <LoginForm
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
