import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { openCustomizeTripForm } from "../utils/customizeTripNavigation.js";

const departures = [
  {
    name: "Everest Base Camp Express",
    duration: "12 days",
    departure: "Jan 29, 2026",
    status: "Open spots",
    price: "$1,290",
    focus: "Heli in/out | Premium tea houses",
  },
  {
    name: "Mardi Himal Luxury Trek",
    duration: "9 days",
    departure: "Feb 03, 2026",
    status: "Guaranteed",
    price: "$980",
    focus: "Private guide | Lodge upgrades",
  },
  {
    name: "Annapurna Panorama Fly-Out",
    duration: "10 days",
    departure: "Feb 12, 2026",
    status: "Limited seats",
    price: "$1,150",
    focus: "Flight return | Spa stay",
  },
  {
    name: "Langtang Valley Retreat",
    duration: "8 days",
    departure: "Feb 19, 2026",
    status: "Available",
    price: "$860",
    focus: "Forest lodges | Cultural host",
  },
];

export default function LastMinutePage() {
  const navigate = useNavigate();

  const toIsoDate = (value) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
    return parsed.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 to-slate-700 px-4 py-20 text-white"
      >
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_45%)]" />
          <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=60')] bg-center bg-cover mix-blend-overlay" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 text-left">
          <p className="text-xs uppercase tracking-[0.7em] text-amber-300">
            Last-minute departures
          </p>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Departing soon—secure your seat.
          </h1>
          <p className="max-w-3xl text-lg text-white/80 sm:text-xl">
            These curated departures still have room for trail-ready guests. We handle logistics, permits, and luxury touches so you can focus on the ascent.
          </p>
          <div className="flex flex-wrap gap-4 text-sm uppercase tracking-[0.4em]">
            <span className="rounded-full border border-white/40 px-4 py-2">
              Tailor-made itineraries
            </span>
            <span className="rounded-full border border-white/40 px-4 py-2">
              Private guides
            </span>
            <span className="rounded-full border border-white/40 px-4 py-2">
              Support vehicles
            </span>
          </div>
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={() =>
                openCustomizeTripForm({
                  navigate,
                  slug: "last-minute-hero",
                  tripName: "Last-minute departures",
                  source: "last_minute_hero",
                })
              }
              className="rounded-full bg-amber-500 px-8 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-slate-950 transition hover:bg-amber-400"
            >
              Reserve a spot
            </button>
            <button
              onClick={() => navigate("#departures")}
              className="rounded-full border border-white/60 px-8 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-white hover:text-slate-900"
            >
              View departures
            </button>
          </div>
        </div>
      </motion.section>

      <section id="departures" className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.6em] text-amber-500">
              Available now
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">Last-minute departures</h2>
            <p className="text-sm text-slate-500">
              Each trip includes permits, boutique lodging, and English-speaking guides. Choose your revival route, then contact us to confirm the final seats.
            </p>
          </div>
          <div className="space-y-6">
            {departures.map((trip) => (
              <article
                key={trip.name}
                className="mx-auto flex max-w-4xl flex-col rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_20px_45px_rgba(15,23,42,0.1)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                      {trip.duration}
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900">{trip.name}</h3>
                  </div>
                  <span className="rounded-full border border-amber-500/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-amber-500">
                    {trip.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-500">{trip.focus}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-slate-600">
                  <span className="text-slate-900">Departure: {trip.departure}</span>
                  <span className="text-amber-500">{trip.price}</span>
                </div>
                <button
                  onClick={() =>
                    openCustomizeTripForm({
                      navigate,
                      slug: trip.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") ?? null,
                      tripName: trip.name,
                      preferredDate: toIsoDate(trip.departure),
                      source: "last_minute_card",
                    })
                  }
                  className="mt-6 self-start rounded-full border border-amber-500 px-8 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-amber-500 transition hover:bg-amber-50"
                >
                  Enquire now
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
