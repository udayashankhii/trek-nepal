// src/pages/Home.jsx
import React from "react";
import Navbar from "../navbarEssentials/Navbar";
import Footer from "./Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FeaturedTreksGrid from "./FeaturedTreks";
// Import our advanced components
import MountainHomePage from "./Hero/AdvancedMountainHomePage";
import ImprovedNavbar from "../navbarEssentials/Navbar";
import HomeFeaturedTreks from "./FeaturedTreks";
import { useNavigate } from "react-router-dom";
import SEO from "../components/common/SEO";

export default function Home() {
  return (
    <>
      <SEO />
      {/* Advanced Mountain Home Page without search props */}
      <MountainHomePage />

      {/* Featured Treks Section - Enhanced */}
      {/* Featured Treks Section - Enhanced */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"></div>
                <p className="text-sky-500 uppercase text-sm font-bold tracking-wider">
                  Trending Adventures
                </p>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Best Treks in{" "}
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Nepal
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Discover breathtaking trails that lead to the roof of the world,
                where every step unveils nature's grandest masterpiece.
              </p>
            </div>

            {/* Enhanced Navigation Buttons */}
            <div className="hidden md:flex space-x-3">
              {/* <button
                type="button"
                className="group p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-sky-200 transition-all duration-300 transform hover:scale-105"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-sky-500 transition-colors duration-300" />
              </button>
              <button
                type="button"
                className="group p-4 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button> */}
            </div>
          </div>

          {/* Enhanced Featured Trek Grid */}
          <div className="relative">
            <HomeFeaturedTreks />
          </div>
        </div>
      </section>

      {/* Additional Enhanced Sections */}
      <WhyChooseUsSection />
      <CallToActionSection />
    </>
  );
}
// Additional enhanced sections to complement the advanced hero
const WhyChooseUsSection = () => {
  const features = [
    {
      icon: "",
      title: "Expert Local Guides",
      description:
        "Our certified Sherpa guides have decades of mountain experience and intimate knowledge of every trail.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "🛡️",
      title: "Safety First",
      description:
        "Comprehensive safety protocols, emergency equipment, and 24/7 support ensure your peace of mind.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: "🌟",
      title: "Authentic Experiences",
      description:
        "Immerse yourself in local culture with stays in traditional teahouses and village communities.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: "🎯",
      title: "Customized Itineraries",
      description:
        "Tailored adventures that match your fitness level, interests, and time constraints perfectly.",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Adventures
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            With over 15 years of experience in the Himalayas, we've perfected
            the art of creating unforgettable mountain adventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-transparent"
            >
              {/* Gradient background on hover */}
              {/* <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div> */}

              <div className="relative z-10">
                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const CallToActionSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-24 bg-sky-50 overflow-hidden">
      {/* subtle texture */}
      <div className="absolute inset-0 bg-[url('/mountain-pattern.svg')] opacity-[0.06]" />

      <div className="relative max-w-3xl mx-auto text-center px-6">
        <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
          Ready for your next{" "}
          <span className="text-sky-600">adventure?</span>
        </h2>

        <p className="mt-6 text-lg text-slate-600 leading-relaxed">
          Explore Nepal’s most iconic trekking routes with trusted local guides and
          thoughtfully crafted itineraries.
        </p>

        <div className="mt-10">
          <button
            onClick={() => navigate("/trekking-in-nepal")}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl
                   bg-sky-600 text-white font-semibold
                   hover:bg-sky-500 transition-colors"
          >
            Start your journey
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>



  );
};
