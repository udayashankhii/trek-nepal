import React, { useState, useEffect, useRef } from "react";

// Custom Hook for Intersection Observer
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible];
};

// Package Card Component
const PackageCard = ({ package: pkg, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 group transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className={`w-full h-64 object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />

        <div
          className={`absolute top-4 right-4 bg-yellow-400 text-green-800 font-bold py-2 px-4 rounded-full transition-transform duration-300 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        >
          {pkg.price}
        </div>

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
          <span className="text-yellow-500 mr-1">⭐</span>
          <span className="text-sm font-medium">{pkg.rating}</span>
        </div>
      </div>

      <div className="p-6">
        <h3
          className={`text-2xl font-bold text-green-800 mb-2 transition-transform duration-300 ${
            isHovered ? "-translate-y-1" : "translate-y-0"
          }`}
        >
          {pkg.title}
        </h3>

        <p className="text-gray-600 mb-4 flex items-center">
          <span className="mr-2">📍</span>
          {pkg.location} • {pkg.duration}
        </p>

        <div
          className={`space-y-2 mb-6 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-70"
          }`}
        >
          {pkg.highlights.map((highlight, idx) => (
            <div
              key={idx}
              className={`flex items-center text-sm text-gray-600 transition-all duration-300`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
              {highlight}
            </div>
          ))}
        </div>

        <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
          Book Now
        </button>
      </div>
    </div>
  );
};

// Main Safari Packages Component
const SafariPackages = ({
  packages = [],
  title = "Featured Safari Experiences",
  subtitle = "Discover Nepal's incredible wildlife with our carefully curated safari packages",
  className = "",
}) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  // Default packages if none provided
  const defaultPackages = [
    {
      id: 1,
      title: "Royal Bengal Tiger Safari",
      location: "Chitwan National Park",
      duration: "3 Days / 2 Nights",
      price: "$299",
      image: "/api/placeholder/400/300",
      highlights: ["Tiger Tracking", "Elephant Safari", "Canoe Ride"],
      rating: 4.9,
    },
    {
      id: 2,
      title: "Rhino Conservation Experience",
      location: "Bardiya National Park",
      duration: "4 Days / 3 Nights",
      price: "$399",
      image: "/api/placeholder/400/300",
      highlights: ["Rhino Spotting", "Jungle Walk", "Cultural Tour"],
      rating: 4.8,
    },
    {
      id: 3,
      title: "Luxury Jungle Retreat",
      location: "Chitwan Luxury Lodge",
      duration: "5 Days / 4 Nights",
      price: "$799",
      image: "/api/placeholder/400/300",
      highlights: ["Premium Accommodation", "Private Guide", "Spa Treatment"],
      rating: 5.0,
    },
  ];

  const displayPackages = packages.length > 0 ? packages : defaultPackages;

  return (
    <section
      ref={ref}
      className={`py-20 bg-gradient-to-b from-green-50 to-white ${className}`}
    >
      <div className="container mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="text-5xl font-bold text-green-800 mb-6">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPackages.map((pkg, index) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SafariPackages;
