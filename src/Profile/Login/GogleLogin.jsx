// GoogleLoginButton.jsx (Updated for better styling in modal)
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginButton() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/accounts/google-login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: googleToken }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.detail || "Backend rejected Google token");
      }

      const data = await res.json();

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("role", data.role);

      toast.success("Logged in with Google ✅");
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
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
        width="100%"
      />
    </div>
  );
}