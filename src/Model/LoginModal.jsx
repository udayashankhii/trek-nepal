

// src/Model/LoginModal.jsx
import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LoginForm from "../Profile/Login/LoginForm.jsx";
import { useAuth } from "../api/auth/AuthContext";

/**
 * LoginModal Component
 * 
 * RESPONSIBILITY: Handle modal display and post-login navigation ONLY
 * Receives redirect info from location state and passes it through after login
 */
export default function LoginModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // ✅ Extract all navigation info from location state
  const backgroundLocation = location.state?.backgroundLocation;
  const nextTarget = location.state?.next;
  const customizeState = location.state?.customizeState; // ✅ NEW: For customize trek

  const handleClose = () => {
    console.log('❌ Login modal closed by user');
    
    if (backgroundLocation) {
      // Go back to the background page
      navigate(-1);
    } else {
      // Direct URL access — go home
      navigate('/', { replace: true });
    }
  };

  const handleSuccess = () => {
    console.log('✅ Login successful in modal');

    // ✅ Determine where to navigate after login
    let targetPath = '/';
    let navigationState = null;

    if (nextTarget) {
      // Priority 1: Explicit 'next' target (from BookingCard, etc.)
      targetPath = nextTarget;
      navigationState = customizeState; // Pass through any state (trek info, etc.)
      console.log('🎯 Redirecting to explicit target:', nextTarget);
    } else if (backgroundLocation) {
      // Priority 2: Return to background location (where modal opened)
      targetPath = backgroundLocation.pathname + (backgroundLocation.search || '');
      console.log('🔙 Returning to background location:', targetPath);
    }

    // ✅ Navigate using React Router (no hard reload)
    navigate(targetPath, {
      state: navigationState,
      replace: true // Replace login route in history
    });
  };

  // ✅ Auto-close if already authenticated (prevents double modal)
  useEffect(() => {
    if (isAuthenticated) {
      console.log('ℹ️ User already authenticated, auto-redirecting');
      handleSuccess();
    }
  }, [isAuthenticated]);

  // ✅ Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // ✅ Close modal on Escape key
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
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 
                     transition-colors group"
          aria-label="Close login modal"
          type="button"
        >
          <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </button>

        {/* Login form - only responsible for login, not navigation */}
        <LoginForm
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}