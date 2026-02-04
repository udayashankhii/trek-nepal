// src/components/Login/LoginLoadingOverlay.jsx
import { Loader2 } from "lucide-react";

export default function LoginLoadingOverlay() {
  return (
    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center rounded-2xl">
      {/* Loading Container */}
      <div className="text-center px-8 py-12">
        {/* Animated Logo */}
        <div className="mb-6 relative">
          <div className="w-24 h-24 mx-auto relative animate-pulse">
            <img
              src="/log.webp"
              alt="EverTrek Nepal"
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Spinning Ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-gray-200 border-t-[#1F7A63] rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#0F2A44]">
            Signing you in...
          </h3>
          <p className="text-sm text-gray-500">
            Please wait while we authenticate your account
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-[#1F7A63] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#1F7A63] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-[#1F7A63] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
}
