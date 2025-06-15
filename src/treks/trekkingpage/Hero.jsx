// src/trekkingpage/HeroSection.jsx
import React from "react";
import {
  MapPinIcon,
  CalendarIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
// replace/add any heroicon you actually use below

export default function HeroSection({
  title,
  subtitle,
  highlights = [],
  imageUrl,
  ctaLabel = "Book This Trek",
  ctaLink = "#",
  season,
  duration,
  difficulty,
  location,
}) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Background Image */}
      <img
        src={"/abcd.png"}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
        loading="eager"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        {/* Badge */}
        <span className="mb-4 inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1 rounded-full backdrop-blur">
          {location} &bull; {season}
        </span>

        {/* Title */}
        {/* <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
          {title}
        </h1> */}

        {/* Subtitle */}
        {/* <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
          {subtitle}
        </p> */}

        {/* Highlights */}
        <div className="flex flex-wrap justify-items-center gap-4 mb-8">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg shadow backdrop-blur-sm"
            >
              {/* you can map label → icon here */}
              {item.label === "Location" && <MapPinIcon className="h-5 w-5" />}
              {item.label === "Duration" && (
                <CalendarIcon className="h-5 w-5" />
              )}
              {item.label === "Difficulty" && <FireIcon className="h-5 w-5" />}
              <span className="font-medium">{item.label}</span>
              {item.value && (
                <span className="text-sm text-white/70">{item.value}</span>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href={ctaLink}
          className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-lg shadow-lg hover:scale-105 transition-transform"
        >
          {ctaLabel}
        </a>
      </div>

      {/* Decorative Card */}
      {/* <div className="hidden md:block absolute bottom-8 right-8 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl px-8 py-6">
        <div className="flex flex-col items-start gap-1 text-blue">
          <span className="font-bold text-lg">{duration}</span>
          <span className="text-sm uppercase tracking-wide">{difficulty}</span>
        </div>
      </div> */}
    </section>
  );
}
