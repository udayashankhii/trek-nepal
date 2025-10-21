import React, { useState, useEffect } from "react";
import {  FiMapPin, FiStar, FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useMouseTracking, useIntersectionObserver } from "./animationUtils";
import { Mountain } from "lucide-react";



const heroSlides = [
  {
    id: 1,
    title: "Everest Base Camp",
    subtitle: "The Ultimate Himalayan Adventure",
    description:
      "Journey to the base of the world's highest peak through stunning Sherpa villages and ancient monasteries.",
    image: "/everest.jpeg",
    stats: {
      elevation: "5,364m",
      duration: "14 days",
      difficulty: "Challenging",
    },
    particles: 150,
    bgGradient: "from-blue-900 to-indigo-900",
    // New weather/conditions field
    weather: {
      temperature: "-5°C",
      location: "Base Camp",
      condition: "Clear Sky",
      remark: "Perfect for trekking",
      visibility: "10km",
      wind: "15 km/h",
      isVisible: true,
      animationDelay: "1.2s",
    }
  },
  {
    id: 2,
    title: "Annapurna Circuit",
    subtitle: "Classic Mountain Loop Trek",
    description:
      "Experience diverse landscapes from subtropical forests to high mountain deserts in this legendary circuit.",
    image: "/annapurna.jpeg",
    stats: { elevation: "5,416m", duration: "16 days", difficulty: "Moderate" },
    particles: 120,
    bgGradient: "from-purple-900 to-pink-900",
    weather: {
      temperature: "2°C",
      location: "Thorong La",
      condition: "Partly Cloudy",
      remark: "Carry layers",
      visibility: "8km",
      wind: "10 km/h",
      isVisible: true,
      animationDelay: "1.2s",
    }
  },
  {
    id: 3,
    title: "Manaslu Circuit",
    subtitle: "Off the Beaten Path",
    description:
      "Discover untouched mountain wilderness and authentic Tibetan culture in this remote Himalayan region.",
    image: "/annapurna.jpeg",
    stats: {
      elevation: "5,106m",
      duration: "12 days",
      difficulty: "Challenging",
    },
    particles: 180,
    bgGradient: "from-emerald-900 to-teal-900",
    weather: {
      temperature: "-3°C",
      location: "Larke Pass",
      condition: "Snow Showers",
      remark: "Crampons advised",
      visibility: "5km",
      wind: "20 km/h",
      isVisible: true,
      animationDelay: "1.2s",
    }
  },
  {
    id: 4,
    title: "Langtang Valley",
    subtitle: "Valley of Glaciers",
    description:
      "Trek through pristine forests and traditional Tamang villages beneath towering Himalayan peaks.",
    image: "/moutainimage.avif",
    stats: { elevation: "4,984m", duration: "8 days", difficulty: "Easy" },
    particles: 100,
    bgGradient: "from-orange-900 to-red-900",
    weather: {
      temperature: "4°C",
      location: "Kyanjin Gompa",
      condition: "Sunny",
      remark: "Excellent views",
      visibility: "12km",
      wind: "8 km/h",
      isVisible: true,
      animationDelay: "1.2s",
    }
  },
];

const FloatingParticle = ({ delay, duration, size, opacity, left, top }) => (
  <div
    className={`absolute rounded-full bg-white animate-pulse pointer-events-none 
                w-[${size}px] h-[${size}px] opacity-${Math.round(opacity * 100)}`}
    style={{
      left: `${left}%`,
      top: `${top}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
    }}
  />
);

const StatCard = ({ icon: Icon, label, value, delay, isVisible }) => (
  <div
    className={`bg-black/20 backdrop-blur-md rounded-lg sm:rounded-xl p-2 xs:p-3 sm:p-4 
                border border-white/10 hover:bg-black/30 transition-all duration-500 
                transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20
                ${isVisible ? "animate-[slideInUp_0.6s_ease-out_forwards]" : "opacity-0"}`}
    style={{ animationDelay: `${delay}s` }}
  >
    {Icon && <Icon className="text-amber-400 mb-1 sm:mb-2 w-4 h-4 sm:w-5 sm:h-5" />}
    <div className="text-white/90 text-xs sm:text-sm font-medium leading-tight">{label}</div>
    <div className="text-white text-sm sm:text-lg font-bold">{value}</div>
  </div>
);



// Professional, dynamic WeatherWidget
const WeatherWidget = ({
  isVisible,
  temperature,
  location,
  condition,
  remark,
  visibility,
  wind,
  animationDelay = "1.2s", // Default value
}) => (
  <div
    className={`bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg 
                rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 
                transition-all duration-700
                ${isVisible ? "animate-[slideInRight_0.8s_ease-out_forwards]" : "opacity-0"}`}
    style={{ animationDelay }}
  >
    <h4 className="text-white font-semibold mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
      <FiCalendar className="mr-2 text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
      Current Conditions
    </h4>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-white text-2xl sm:text-3xl font-bold">{temperature}</div>
        <div className="text-white/70 text-xs sm:text-sm">{location}</div>
      </div>
      <div className="text-right">
        <div className="text-white/90 text-xs sm:text-sm font-medium">{condition}</div>
        <div className="text-emerald-400 text-xs sm:text-sm">{remark}</div>
      </div>
    </div>
    <div className="mt-3 sm:mt-4 flex items-center justify-between text-xs text-white/60">
      <span>Visibility: {visibility}</span>
      <span>Wind: {wind}</span>
    </div>
  </div>
);

// const WeatherWidget = ({ isVisible }) => (
//  <div
//   className={`bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg 
//  rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 
//  transition-all duration-700
//  ${isVisible ? "animate-[slideInRight_0.8s_ease-out_forwards]" : "opacity-0"}`}
// style={{ animationDelay: "1.2s" }}
// >
//  <h4 className="text-white font-semibold mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
// <FiCalendar className="mr-2 text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
//  Current Conditions
//  </h4>
//  <div className="flex items-center justify-between">
//  <div>
// <div className="text-white text-2xl sm:text-3xl font-bold">-5°C</div>
//  <div className="text-white/70 text-xs sm:text-sm">Base Camp</div>
//  </div>
//  <div className="text-right">
//  <div className="text-white/90 text-xs sm:text-sm font-medium">Clear Sky</div>
//  <div className="text-emerald-400 text-xs sm:text-sm">Perfect for trekking</div>
//  </div>
//  </div>
// <div className="mt-3 sm:mt-4 flex items-center justify-between text-xs text-white/60">
// <span>Visibility: 10km</span>
//  <span>Wind: 15 km/h</span>
//  </div>
// </div>
// );




export default function EnhancedHeroSection(
 
) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState([]);
  const [mouseRef, mousePosition] = useMouseTracking();
  const [heroRef, isVisible] = useIntersectionObserver();
  const navigate = useNavigate();

  // Generate particles data once
  useEffect(() => {
    const generateParticles = () => {
      const currentSlideData = heroSlides[currentSlide];
      const newParticles = Array.from({ length: currentSlideData.particles }).map((_, i) => ({
        id: `${currentSlide}-${i}`,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        size: 2 + Math.random() * 8,
        opacity: 0.1 + Math.random() * 0.3,
        left: Math.random() * 100,
        top: Math.random() * 100,
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, [currentSlide]);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);



  const currentSlideData = heroSlides[currentSlide];

  return (
    <section
      ref={(el) => {
        mouseRef.current = el;
        heroRef.current = el;
      }}
      className={`relative w-full min-h-screen h-screen flex items-center overflow-hidden 
                 bg-gradient-to-br ${currentSlideData.bgGradient} transition-all duration-1000`}
    >
      {/* Dynamic Background with Parallax */}
      <div className="absolute inset-0 z-0">
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-[3000ms] ease-in-out ${
              idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat transform transition-transform duration-300 scale-110"
              style={{
                backgroundImage: `url(${slide.image})`,
                transform: `scale(1.1) translate3d(${mousePosition.x * 15}px, ${mousePosition.y * 15}px, 0)`,
              }}
            />
          </div>
        ))}

        {/* Enhanced Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 z-20" />
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {particles.map((particle) => (
          <FloatingParticle
            key={particle.id}
            delay={particle.delay}
            duration={particle.duration}
            size={particle.size}
            opacity={particle.opacity}
            left={particle.left}
            top={particle.top}
          />
        ))}
      </div>

      {/* Main Content Grid - Fully Responsive */}
      <div className="relative z-40 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center">
        {/* Left Content - Enhanced Responsive */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1">
          {/* Slide Indicators with Animation */}
          <div className="flex space-x-2 sm:space-x-3 mb-4 sm:mb-6 justify-center lg:justify-start">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`relative overflow-hidden transition-all duration-500 rounded-full ${
                  idx === currentSlide
                    ? "w-8 sm:w-10 lg:w-12 h-2 sm:h-2.5 lg:h-3 bg-amber-400 shadow-lg shadow-amber-400/50"
                    : "w-2 sm:w-2.5 lg:w-3 h-2 sm:h-2.5 lg:h-3 bg-white/30 hover:bg-white/50 hover:scale-125"
                }`}
              >
                {idx === currentSlide && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-orange-400 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Enhanced Text Content - Fully Responsive */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6 text-center lg:text-left">
            <h1
              className={`text-white text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
                         font-black leading-tight tracking-tight 
                         bg-gradient-to-r from-white via-white to-amber-200 bg-clip-text text-transparent ${
                           isLoaded ? "animate-[fadeInUp_0.8s_ease-out_forwards]" : "opacity-0"
                         }`}
              style={{ animationDelay: "0.1s" }}
            >
              {currentSlideData.title}
            </h1>

            <h2
              className={`text-amber-400 text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-light ${
                isLoaded ? "animate-[fadeInUp_0.8s_ease-out_forwards]" : "opacity-0"
              }`}
              style={{ animationDelay: "0.2s" }}
            >
              {currentSlideData.subtitle}
            </h2>

            <p
              className={`text-white/90 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed mx-auto lg:mx-0 px-4 lg:px-0 ${
                isLoaded ? "animate-[fadeInUp_0.8s_ease-out_forwards]" : "opacity-0"
              }`}
              style={{ animationDelay: "0.3s" }}
            >
              {currentSlideData.description}
            </p>
          </div>

          {/* Enhanced Search Form - Fully Responsive */}
        

          {/* Enhanced Action Buttons - Fully Responsive */}
          <div
            className={`flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 lg:px-0 ${
              isLoaded ? "animate-[fadeInUp_0.8s_ease-out_forwards]" : "opacity-0"
            }`}
            style={{ animationDelay: "0.5s" }}
          >
            <button
              onClick={() => navigate("/trekking-in-nepal")}
              className="group px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-lg sm:rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
            >
              <span className="flex items-center justify-center space-x-2">
                <Mountain className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span>Discover Treks</span>
              </span>
            </button>

            <button className="group px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-transparent border-2 border-amber-400 text-amber-400 font-bold rounded-lg sm:rounded-xl hover:bg-amber-400 hover:text-black transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
              <span className="flex items-center justify-center space-x-2">
                <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" />
                <span>View Map</span>
              </span>
            </button>
          </div>
        </div>

        {/* Right Stats Panel - Enhanced Responsive */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6 order-1 lg:order-2 px-4 lg:px-0">
          <div
            className={`bg-black/20 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-all duration-500 ${
              isVisible ? "animate-[slideInRight_0.8s_ease-out_forwards]" : "opacity-0"
            }`}
            style={{ animationDelay: "0.6s" }}
          >
            <h3 className="text-white text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center">
              <FiStar className="text-amber-400 mr-2 w-5 h-5 sm:w-6 sm:h-6" />
              Trek Highlights
            </h3>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
              <StatCard
                icon={Mountain}
                label="Max Elevation"
                value={currentSlideData.stats.elevation}
                delay={0.7}
                isVisible={isVisible}
              />
              <StatCard
                icon={FiCalendar}
                label="Duration"
                value={currentSlideData.stats.duration}
                delay={0.8}
                isVisible={isVisible}
              />
              <StatCard
                icon={FiStar}
                label="Difficulty"
                value={currentSlideData.stats.difficulty}
                delay={0.9}
                isVisible={isVisible}
              />
            </div>
          </div>

          <WeatherWidget isVisible={isVisible} />
        </div>
      </div>

      {/* Scroll Down Indicator */}
 
    </section>
  );
}
