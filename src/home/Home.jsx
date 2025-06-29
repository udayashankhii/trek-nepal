// src/pages/Home.jsx
import React from "react";
import Navbar from "../navbarEssentials/Navbar";
import Footer from "./Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FeaturedTreksGrid from "./FeaturedTreks";
// Import our advanced components
import AdvancedMountainHomePage from "./Hero/AdvancedMountainHomePage";
import ImprovedNavbar from "../navbarEssentials/Navbar";

export default function Home() {
  return (
    <>
      {/* Advanced Mountain Home Page without search props */}
      <AdvancedMountainHomePage />

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
              <button
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
              </button>
            </div>
          </div>

          {/* Enhanced Featured Trek Grid */}
          <div className="relative">
            <FeaturedTreksGrid />
          </div>
        </div>
      </section>

      {/* Additional Enhanced Sections */}
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CallToActionSection />
    </>
  );
}
// Additional enhanced sections to complement the advanced hero
const WhyChooseUsSection = () => {
  const features = [
    {
      icon: "🏔️",
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
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

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

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      location: "California, USA",
      text: "The Everest Base Camp trek exceeded all my expectations. The guides were incredible, and the experience was truly life-changing.",
      rating: 5,
      image: "🇺🇸",
    },
    {
      name: "James Thompson",
      location: "London, UK",
      text: "Professional service from start to finish. The Annapurna Circuit was perfectly organized and absolutely breathtaking.",
      rating: 5,
      image: "🇬🇧",
    },
    {
      name: "Maria Rodriguez",
      location: "Barcelona, Spain",
      text: "An adventure of a lifetime! The team's expertise and care made me feel safe throughout the entire Langtang trek.",
      rating: 5,
      image: "🇪🇸",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Stories from the{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Summit
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from adventurers who've experienced the magic of the Himalayas
            with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl mr-4">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              <div className="flex text-amber-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-xl">
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CallToActionSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
      <div className="absolute inset-0 bg-[url('/mountain-pattern.svg')] opacity-10"></div>

      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
      <div
        className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-xl opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Ready for Your Next{" "}
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Adventure?
          </span>
        </h2>

        <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
          Join thousands of adventurers who've discovered the magic of the
          Himalayas. Your journey to the roof of the world starts here.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="group px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
            <span className="flex items-center space-x-3">
              <span>Start Your Journey</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
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
            </span>
          </button>

          <button className="group px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <span className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 group-hover:animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>Talk to Expert</span>
            </span>
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center space-x-8 text-white/70">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Free Consultation</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Best Price Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};
