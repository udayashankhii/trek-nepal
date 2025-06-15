import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function TrekHero({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  ctaLink,
}) {
  return (
    <section
      className="relative h-100 flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 text-center"
      >
        <h1 className="text-4xl font-extrabold">{title}</h1>
        <p className="mt-2 text-lg">{subtitle}</p>
        <a
          href={ctaLink}
          className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-orange-500 rounded-full hover:bg-orange-600"
        >
          <span>{ctaText}</span>
          <ArrowRight className="w-5 h-5" />
        </a>
      </motion.div>
    </section>
  );
}
