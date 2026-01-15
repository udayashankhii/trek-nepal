import React from "react";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";
import HeroBreadcrumbs from "../../../components/Breadcrumb/HeroBreadcrumbs.jsx";

export default function TourHero({ tour, breadcrumbs }) {
  const heroTitle = tour.title || "Signature Nepal Experience";
  const heroSubtitle =
    tour.overview?.paragraphs?.[0] ||
    tour.shortDescription ||
    tour.short_description ||
    tour.longDescription ||
    "";
  const displayImage = tour.image || tour.image_url || "/everest.jpeg";
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <img
          src={displayImage}
          alt={heroTitle}
          className="h-[60vh] w-full object-cover object-center"
          onError={(e) => {
            e.target.src = "/everest.jpeg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/20" />
      </div>

      <div className="relative z-10 min-h-[60vh] flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 py-16 flex flex-col items-center text-center text-white">
          {breadcrumbs?.length > 0 && (
            <div className="w-full mb-4 text-[11px] uppercase tracking-[0.4em] text-white/70">
              <HeroBreadcrumbs breadcrumbs={breadcrumbs} className="" />
            </div>
          )}
          {(tour.location || tour.badge) && (
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur">
              {tour.location || "Nepal Experience"}
              {tour.location && tour.badge && <span>•</span>}
              {tour.badge}
            </span>
          )}

          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            {heroTitle}
          </h1>

          {heroSubtitle && (
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl">
              {heroSubtitle}
            </p>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-white">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur text-sm">
              <Clock className="h-5 w-5" />
              {tour.duration || "Flexible timing"}
            </span>
            {(tour.groupSize || tour.group_size) && (
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur text-sm">
                <Users className="h-5 w-5" />
                Max {tour.groupSize || tour.group_size}
              </span>
            )}
            {tour.location && (
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur text-sm">
                <MapPin className="h-5 w-5" />
                {tour.location}
              </span>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/plan"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 font-bold text-lg shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              Book Now
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/contact-us"
              className="px-8 py-3 rounded-full bg-white/10 backdrop-blur text-white font-bold text-lg shadow-lg hover:bg-white/20 transition-all"
            >
              Inquiry
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
