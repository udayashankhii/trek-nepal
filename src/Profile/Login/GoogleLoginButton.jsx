// src/components/Login/GoogleLoginButton.jsx
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { googleLogin } from "../../api/auth/auth.api"; // ✅ Same folder import

export default function GoogleLoginButton({ onSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = new URLSearchParams(location.search).get("next") || "/";

const handleSuccess = async (credentialResponse) => {
  const googleToken = credentialResponse.credential;

  try {
    await googleLogin({ token: googleToken });
    toast.success("Logged in with Google ✅", { position: "top-center", autoClose: 2000 });
    
    if (onSuccess) onSuccess();
    
    // ✅ Navigate without reload - let React handle state
    navigate(nextPath, { replace: true });
    
  } catch (err) {
    console.error("Google login error:", err);
    toast.error(err.message || "Google login failed", { position: "top-center" });
  }
};

  const handleError = () => {
    toast.error("Google login failed");
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
  useOneTap={false}  // ✅ Reduces COOP warnings
  auto_select={false}
/>
    </div>
  );
}
