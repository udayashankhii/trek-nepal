// DataPreloader.jsx
import { useEffect, useState } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAllTreks } from "../api/trekService";

export default function DataPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Preload all treks
  const { data: treksData, isLoading: treksLoading } = useSWR(
    "/treks/",
    fetchAllTreks,
    { revalidateOnMount: true }
  );

  // Simulate smooth progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90 && treksLoading) return prev;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [treksLoading]);

  useEffect(() => {
    if (!treksLoading && loadingProgress < 90) {
      setLoadingProgress(100);
    }
  }, [treksLoading]);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="mountain-pattern"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M50 10 L70 50 L30 50 Z"
                  fill="currentColor"
                  className="text-white"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mountain-pattern)" />
          </svg>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-4 max-w-md w-full">
          {/* Logo/Brand Area with Mountain Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            {/* Mountain Icon Animation */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0"
              >
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow-2xl"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Mountain peaks */}
                  <motion.path
                    d="M20 80 L35 45 L50 60 L65 30 L80 80 Z"
                    fill="url(#mountain-gradient)"
                    stroke="#10b981"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  {/* Snow caps */}
                  <motion.path
                    d="M35 45 L40 38 L45 45 Z"
                    fill="white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  />
                  <motion.path
                    d="M65 30 L70 23 L75 30 Z"
                    fill="white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  />
                  <defs>
                    <linearGradient
                      id="mountain-gradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#ring-gradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="10 5"
                    opacity="0.5"
                  />
                  <defs>
                    <linearGradient id="ring-gradient">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </div>

            {/* Brand Name */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-wide"
            >
              EverTrek Nepal
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-emerald-300 text-sm md:text-base font-light"
            >
              Discover Your Next Adventure
            </motion.p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mb-6"
          >
            {/* Progress Container */}
            <div className="relative w-full h-2 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-600/30">
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Progress Fill */}
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 bg-[length:200%_100%] rounded-full shadow-lg shadow-emerald-500/50"
                initial={{ width: "0%" }}
                animate={{
                  width: `${loadingProgress}%`,
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  width: { duration: 0.3, ease: "easeOut" },
                  backgroundPosition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              />
            </div>

            {/* Progress Text */}
            <motion.div
              className="mt-3 flex items-center justify-center gap-2 text-slate-300"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm font-medium">
                {Math.round(loadingProgress)}%
              </span>
              <span className="text-xs">• Loading experiences</span>
            </motion.div>
          </motion.div>

          {/* Loading Messages */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="space-y-2"
          >
            <AnimatePresence mode="wait">
              <LoadingMessage progress={loadingProgress} />
            </AnimatePresence>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-emerald-400 rounded-full"
                animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-emerald-500/30 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-emerald-500/30 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-emerald-500/30 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-emerald-500/30 rounded-br-lg" />
      </motion.div>
    </AnimatePresence>
  );
}

// Loading message component with rotating messages
function LoadingMessage({ progress }) {
  const messages = [
    { text: "Preparing trek routes", range: [0, 25] },
    { text: "Loading destinations", range: [25, 50] },
    { text: "Gathering adventure details", range: [50, 75] },
    { text: "Almost ready", range: [75, 90] },
    { text: "Welcome aboard!", range: [90, 100] },
  ];

  const currentMessage = messages.find(
    (msg) => progress >= msg.range[0] && progress < msg.range[1]
  ) || messages[messages.length - 1];

  return (
    <motion.p
      key={currentMessage.text}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="text-slate-400 text-sm font-light tracking-wide"
    >
      {currentMessage.text}
    </motion.p>
  );
}
