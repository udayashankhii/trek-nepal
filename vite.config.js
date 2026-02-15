import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    mode === "analyze"
      ? visualizer({
          filename: "dist/bundle-report.html",
          template: "treemap",
          gzipSize: true,
          brotliSize: true,
          open: false,
        })
      : null,
  ].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          ui: ["@mui/material", "@emotion/react", "@emotion/styled", "@headlessui/react"],
          charts: ["recharts"],
          maps: ["leaflet", "react-leaflet"],
          motion: ["framer-motion", "gsap"],
          payments: ["@stripe/react-stripe-js", "@stripe/stripe-js"],
          icons: ["react-icons", "lucide", "lucide-react", "@heroicons/react"],
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
