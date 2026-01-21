// src/components/ExperienceSelector.jsx
import React from "react";
import { motion } from "framer-motion";

export default function ExperienceSelector({ selected, onChange, options }) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white/70 backdrop-blur-md shadow-sm p-1">
      {options.map((opt) => {
        const active = opt.value === selected;

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="relative px-4 py-2 text-sm rounded-full"
          >
            {active && (
              <motion.span
                layoutId="exp-pill"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                className="absolute inset-0 rounded-full bg-slate-900"
              />
            )}

            <motion.span
              className={`relative z-10 font-medium ${
                active ? "text-white" : "text-slate-700"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              {opt.label}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}
