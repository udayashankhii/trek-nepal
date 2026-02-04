// main.jsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { SWRConfig } from "swr";
import axiosInstance from "./api/service/axiosInstance";
import { AuthProvider } from "./api/auth/AuthContext"; // ✅ ADD THIS

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StrictMode>
    <HelmetProvider>
      <SWRConfig
        value={{
          fetcher,
          dedupingInterval: 2000,
          revalidateOnFocus: true,
          shouldRetryOnError: false,
        }}
      >
        <ErrorBoundary>
          <AuthProvider> {/* ✅ ADD THIS WRAPPER */}
            <App />
          </AuthProvider> {/* ✅ ADD THIS CLOSING TAG */}
        </ErrorBoundary>
      </SWRConfig>
    </HelmetProvider>
  </StrictMode>
);
