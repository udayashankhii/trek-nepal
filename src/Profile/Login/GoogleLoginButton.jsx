// src/components/Login/GoogleLoginButton.jsx
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { googleLogin } from "../../api/auth.api.js";

export default function GoogleLoginButton({ onSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = new URLSearchParams(location.search).get("next") || "/";

  const handleSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;

    try {
      await googleLogin({ token: googleToken });

      toast.success("Logged in with Google ✅");
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Small delay for better UX
      setTimeout(() => {
        navigate(nextPath);
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error("Google login error:", err);
      toast.error(err.message || "Google login failed");
    }
  };

  const handleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="flex justify-center w-full">
      <GoogleLogin 
        onSuccess={handleSuccess} 
        onError={handleError}
        theme="outline"
        size="large"
        text="signin_with"
        shape="rectangular"
        width="100%"
        logo_alignment="left"
      />
    </div>
  );
}
