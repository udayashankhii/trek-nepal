// main.jsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SWRConfig } from "swr";
import axiosInstance from "./api/axiosInstance";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

// ✅ create the root first
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StrictMode>
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 2000,
        revalidateOnFocus: true,
        shouldRetryOnError: false,
      }}
    >
      <App />
    </SWRConfig>
  </StrictMode>
);
