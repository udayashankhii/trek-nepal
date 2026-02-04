// src/Profile/Login/GoogleLoginButton.jsx (or wherever it is)
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { googleLogin } from "../../api/auth/auth.api";
import { useAuth } from "../../api/auth/AuthContext"; // ✅ ADD THIS
import LoginLoadingOverlay from "../../Model/LoginLoadingOverlay.jsx"; // ✅ If you have this

export default function GoogleLoginButton({ onSuccess, onClose }) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth(); // ✅ ADD THIS - Get login from context

  const backgroundLocation = location.state?.backgroundLocation;
  const nextPath = backgroundLocation?.pathname || 
                   new URLSearchParams(location.search).get("next") || 
                   "/";

  const handleSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    setGoogleLoading(true);

    try {
      // ✅ Call your API - it saves tokens to localStorage
      const data = await googleLogin({ token: googleToken });

      toast.success("Logged in with Google ✅", { 
        position: "top-center", 
        autoClose: 2000 
      });

      // ✅ UPDATE AUTH CONTEXT - This triggers navbar update
      authLogin(data.user);

      // Call success callbacks
      if (onSuccess) {
        onSuccess();
      }
      
      if (onClose) {
        onClose();
      }

      // ✅ Navigate without reload - context handles state
      setTimeout(() => {
        navigate(nextPath, { replace: true });
      }, 300);

    } catch (err) {
      console.error("Google login error:", err);
      toast.error(err.message || "Google login failed", { 
        position: "top-center" 
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleError = () => {
    toast.error("Google login failed");
  };

  return (
    <>
      {googleLoading && <LoginLoadingOverlay />} {/* ✅ Optional loading overlay */}
      <div className="flex justify-center w-full">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          useOneTap={false}
          auto_select={false}
        />
      </div>
    </>
  );
}
