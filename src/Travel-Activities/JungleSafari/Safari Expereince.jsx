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

// Experience Card Component
const ExperienceCard = ({ experience, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 group transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ 
        transitionDelay: `${index * 200}ms`,
        background: experience.gradient 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={experience.backgroundImage}
          alt={experience.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 h-96 flex flex-col justify-between text-white">
        <div>
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-3">{experience.icon}</span>
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
              {experience.category}
            </span>
          </div>

          <h3
            className={`text-3xl font-bold mb-4 transition-transform duration-300 ${
              isHovered ? "-translate-y-2" : "translate-y-0"
            }`}
          >
            {experience.title}
          </h3>

          <p className="text-lg opacity-90 mb-6 leading-relaxed">
            {experience.description}
          </p>
        </div>

        <div
          className={`transition-all duration-500 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-yellow-400 mr-2">⭐</span>
              <span className="font-semibold">{experience.rating}</span>
              <span className="text-sm opacity-75 ml-2">({experience.reviews} reviews)</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">{experience.price}</span>
              <span className="text-sm opacity-75 block">per person</span>
            </div>
          </div>

          <button className="w-full bg-white text-gray-800 font-bold py-3 rounded-2xl hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105">
            Book Experience
          </button>
        </div>
      </div>
    </div>
  );
};

// Activity Timeline Component
const ActivityTimeline = ({ activities, isVisible }) => {
  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div
          key={index}
          className={`flex items-start transition-all duration-700 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}
          style={{ transitionDelay: `${index * 200}ms` }}
        >
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-6">
            {index + 1}
          </div>
          <div className="flex-grow">
            <h4 className="text-xl font-bold text-green-800 mb-2">{activity.title}</h4>
            <p className="text-gray-600 mb-2">{activity.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-4">⏱️ {activity.duration}</span>
              <span>📍 {activity.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Safari Experience Component
const SafariExperience = ({ 
  experiences = [],
  className = ""
}) => {
  const [heroRef, heroVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [experiencesRef, experiencesVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [timelineRef, timelineVisible] = useIntersectionObserver({ threshold: 0.1 });

  // Default experiences data
  const defaultExperiences = [
    {
      id: 1,
      title: "Tiger Tracking Adventure",
      description: "Experience the thrill of tracking the majestic Royal Bengal Tigers in their natural habitat with expert guides.",
      category: "Wildlife",
      icon: "🐅",
      rating: 4.9,
      reviews: 234,
      price: "$299",
      gradient: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
      backgroundImage: "/api/placeholder/600/400"
    },
    {
      id: 2,
      title: "Rhino Conservation Safari",
      description: "Join our conservation efforts while observing the endangered one-horned rhinoceros in protected reserves.",
      category: "Conservation",
      icon: "🦏",
      rating: 4.8,
      reviews: 189,
      price: "$399",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      backgroundImage: "/api/placeholder/600/400"
    },
    {
      id: 3,
      title: "Jungle Night Safari",
      description: "Discover the mysterious nocturnal wildlife of Nepal's jungles under the starlit sky.",
      category: "Night Adventure",
      icon: "🌙",
      rating: 4.7,
      reviews: 156,
      price: "$199",
      gradient: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
      backgroundImage: "/api/placeholder/600/400"
    },
    {
      id: 4,
      title: "Bird Watching Expedition",
      description: "Explore Nepal's incredible avian diversity with over 900 bird species in pristine natural habitats.",
      category: "Birding",
      icon: "🦅",
      rating: 4.6,
      reviews: 98,
      price: "$149",
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      backgroundImage: "/api/placeholder/600/400"
    },
    {
      id: 5,
      title: "Elephant Safari Experience",
      description: "Gentle giants guide you through dense forests for an unforgettable wildlife viewing experience.",
      category: "Traditional",
      icon: "🐘",
      rating: 4.8,
      reviews: 267,
      price: "$249",
      gradient: "linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)",
      backgroundImage: "/api/placeholder/600/400"
    },
    {
      id: 6,
      title: "Photography Safari",
      description: "Capture stunning wildlife moments with professional photography guidance and premium equipment.",
      category: "Photography",
      icon: "📸",
      rating: 4.9,
      reviews: 145,
      price: "$449",
      gradient: "linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)",
      backgroundImage: "/api/placeholder/600/400"
    }
  ];

  const sampleActivities = [
    {
      title: "Early Morning Game Drive",
      description: "Begin your adventure at dawn when wildlife is most active. Spot tigers, rhinos, and various bird species.",
      duration: "3 hours",
      location: "Chitwan National Park"
    },
    {
      title: "Canoe Ride & River Safari",
      description: "Navigate through pristine rivers while observing crocodiles, water birds, and riverside wildlife.",
      duration: "2 hours",
      location: "Rapti River"
    },
    {
      title: "Jungle Walk with Naturalist",
      description: "Explore dense forests on foot with expert naturalists sharing insights about flora and fauna.",
      duration: "2.5 hours",
      location: "Buffer Zone"
    },
    {
      title: "Cultural Village Tour",
      description: "Experience local Tharu culture and traditional lifestyle in authentic village settings.",
      duration: "2 hours",
      location: "Tharu Village"
    },
    {
      title: "Sunset Wildlife Viewing",
      description: "End your day watching wildlife gather at watering holes during the golden hour.",
      duration: "2 hours",
      location: "Observation Tower"
    }
  ];

  const displayExperiences = experiences.length > 0 ? experiences : defaultExperiences;

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}
      >
        <div className="absolute inset-0">
          <img
            src="/api/placeholder/1920/1080"
            alt="Safari Adventure"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div
          className={`relative z-10 text-center text-white px-6 transition-all duration-1000 ${
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            Safari
            <span className="block text-yellow-400">Experiences</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed">
            Immerse yourself in Nepal's incredible wildlife and create unforgettable memories in pristine natural habitats[1]
          </p>
          <button className="bg-yellow-400 text-gray-900 font-bold py-4 px-8 rounded-full text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">
            Explore Adventures
          </button>
        </div>
      </section>

      {/* Safari Experiences Grid */}
      <section
        ref={experiencesRef}
        className="py-20 bg-gradient-to-b from-green-50 to-white"
      >
        <div className="container mx-auto px-6">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              experiencesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <h2 className="text-5xl font-bold text-green-800 mb-6">
              Unforgettable Wildlife Adventures
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our carefully curated safari experiences, each designed to showcase Nepal's incredible biodiversity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayExperiences.map((experience, index) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                index={index}
                isVisible={experiencesVisible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Activity Timeline */}
      <section
        ref={timelineRef}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div
              className={`transition-all duration-1000 ${
                timelineVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
              }`}
            >
              <h2 className="text-4xl font-bold text-green-800 mb-6">
                Your Safari Journey
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Experience a perfectly planned adventure that combines wildlife viewing, cultural immersion, and conservation awareness in Nepal's most pristine natural environments.
              </p>
              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Professional Guides
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  Safety First
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  Eco-Friendly
                </div>
              </div>
            </div>

            <div
              className={`transition-all duration-1000 ${
                timelineVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
              }`}
            >
              <ActivityTimeline activities={sampleActivities} isVisible={timelineVisible} />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready for Your Safari Adventure?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Book your unforgettable wildlife experience today and discover the magic of Nepal's incredible biodiversity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-400 text-gray-900 font-bold py-4 px-8 rounded-full text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">
              Book Now
            </button>
            <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-white hover:text-green-700 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SafariExperience;
