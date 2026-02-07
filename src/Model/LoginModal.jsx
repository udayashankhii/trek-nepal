import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LoginForm from "../Profile/Login/LoginForm.jsx";
import { useAuth } from "../api/auth/AuthContext";

export default function LoginModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const backgroundLocation = location.state?.backgroundLocation;
  const nextTarget = location.state?.next;

  const handleClose = () => {
    console.log('❌ Login cancelled');
    // Always go back to the previous page in history. 
    // This is the most reliable way to cancel a login modal 
    // and return to the safe page the user was on.
    navigate(-1);
  };

  const handleSuccess = () => {
    console.log('✅ Login success');

    // ✅ Determine target path
    // 1. Check 'next' state (explicit target)
    // 2. Check 'backgroundLocation' (where the modal is)
    // 3. Fallback to home
    const targetPath = nextTarget || backgroundLocation?.pathname || '/';
    const targetSearch = backgroundLocation?.search || '';

    console.log('🔄 LoginModal navigating to:', targetPath);

    // ⛔ HARD RELOAD FORCE - Fix sticky modal and state synchronization issues
    const finalUrl = targetPath + targetSearch;
    window.location.href = finalUrl;
  };

  // ✅ AUTO-CLOSE IF ALREADY AUTHENTICATED
  // This fixes cases where the login overlay pops up for an already logged-in user
  useEffect(() => {
    if (isAuthenticated) {
      console.log('ℹ️ User already authenticated, closing modal');
      handleSuccess();
    }
  }, [isAuthenticated]);


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
