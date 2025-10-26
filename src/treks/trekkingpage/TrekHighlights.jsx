import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  GlobeAltIcon,
  FlagIcon,
  CameraIcon,
  UsersIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { Mountain } from "lucide-react";


const iconComponents = {
  culture: GlobeAltIcon,
  scenery: Mountain,
  achievement: FlagIcon,
  photography: CameraIcon,
  community: UsersIcon,
  health: HeartIcon,
};

export default function TrekHighlights({ highlights = [] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-manrope">
            Trek Highlights
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the unforgettable experiences that make this journey
            extraordinary
          </p>
        </motion.div>

        <div
          className={
            isMobile
              ? "flex overflow-x-auto pb-8 -mx-4 px-4 space-x-4"
              : "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8"
          }
        >
          {Array.isArray(highlights) && highlights.length > 0 ? (
            highlights.map((highlight, idx) => {
              const Icon = iconComponents[highlight.icon];

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className={
                    isMobile
                      ? "min-w-[300px] flex-shrink-0 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                      : "h-full group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                  }
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-8 h-full">
                    <div className="mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                        {Icon && <Icon className="w-8 h-8 text-white" />}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {highlight.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                    <div className="absolute bottom-6 left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-block w-8 h-1 bg-blue-600 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 w-full">
              No highlights available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// ✅ Prevents runtime crash if props are missing
