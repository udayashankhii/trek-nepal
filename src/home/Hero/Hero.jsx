


import React, { useState, useEffect } from "react";
import { FiMapPin, FiStar, FiCalendar, FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useMouseTracking, useIntersectionObserver } from "./animationUtils";
import { Mountain, CloudRain, CloudSnow, Cloud, Sun } from "lucide-react";
import { fetchWeatherData } from "../../api/service/weatherService";

const heroSlides = [
  {
    id: 1,
    title: "Everest Base Camp",
    subtitle: "The Ultimate Himalayan Adventure",
    description:
      "Journey to the base of the world's highest peak through stunning Sherpa villages and ancient monasteries.",
    image: "/everest.jpeg",
    trekUrl: "/treks/everest/everest-base-camp-trek-classic",
    locationKey: "everest",
    stats: {
      elevation: "5,364m",
      duration: "14 days",
      difficulty: "Challenging",
    },
    particles: 150,
    bgGradient: "from-blue-900 to-indigo-900",
  },
  {
    id: 2,
    title: "Annapurna Circuit",
    subtitle: "Classic Mountain Loop Trek",
    description:
      "Experience diverse landscapes from subtropical forests to high mountain deserts in this legendary circuit.",
    image: "/annapurna.jpeg",
    trekUrl: "/treks/annapurna/annapurna-circuit-trek",
    locationKey: "annapurna",
    stats: { elevation: "5,416m", duration: "16 days", difficulty: "Moderate" },
    particles: 120,
    bgGradient: "from-purple-900 to-pink-900",
  },
  {
    id: 3,
    title: "Manaslu Circuit",
    subtitle: "Off the Beaten Path",
    description:
      "Discover untouched mountain wilderness and authentic Tibetan culture in this remote Himalayan region.",
    image: "/annapurna.jpeg",
    trekUrl: "/treks/manaslu/manaslu-circuit-trek",
    locationKey: "manaslu",
    stats: {
      elevation: "5,106m",
      duration: "12 days",
      difficulty: "Challenging",
    },
    particles: 180,
    bgGradient: "from-emerald-900 to-teal-900",
  },
  {
    id: 4,
    title: "Langtang Valley",
    subtitle: "Valley of Glaciers",
    description:
      "Trek through pristine forests and traditional Tamang villages beneath towering Himalayan peaks.",
    image: "/moutainimage.avif",
    trekUrl: "/treks/langtang/langtang-valley-trek",
    locationKey: "langtang",
    stats: { elevation: "4,984m", duration: "8 days", difficulty: "Easy" },
    particles: 100,
    bgGradient: "from-orange-900 to-red-900",
  },
];

const FloatingParticle = ({ delay, duration, size, opacity, left, top }) => (
  <div
    className="absolute rounded-full bg-white animate-pulse pointer-events-none"
    style={{
      left: `${left}%`,
      top: `${top}%`,
      width: `${size}px`,
      height: `${size}px`,
      opacity,
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
                ${
                  isVisible
                    ? "animate-[slideInUp_0.6s_ease-out_forwards]"
                    : "opacity-0"
                }`}
    style={{ animationDelay: `${delay}s` }}
  >
    {Icon && (
      <Icon className="text-amber-400 mb-1 sm:mb-2 w-4 h-4 sm:w-5 sm:h-5" />
    )}
    <div className="text-white/90 text-xs sm:text-sm font-medium leading-tight">
      {label}
    </div>
    <div className="text-white text-sm sm:text-lg font-bold">{value}</div>
  </div>
);

// Weather icon component based on severity
const WeatherIcon = ({ severity, className = "w-6 h-6" }) => {
  const icons = {
    clear: Sun,
    partly_cloudy: Cloud,
    cloudy: Cloud,
    rain: CloudRain,
    snow: CloudSnow,
    thunderstorm: CloudRain,
    drizzle: CloudRain,
    fog: Cloud,
    freezing: CloudSnow,
  };

  const Icon = icons[severity] || Cloud;
  return <Icon className={className} />;
};

const WeatherWidget = ({
  isVisible,
  weatherData,
  isLoading,
  hasError,
  animationDelay = "1.2s",
}) => {
  if (isLoading) {
    return (
      <div
        className={`bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg 
                    rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 
                    transition-all duration-700
                    ${
                      isVisible
                        ? "animate-[slideInRight_0.8s_ease-out_forwards]"
                        : "opacity-0"
                    }`}
        style={{ animationDelay }}
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  const {
    temperature = "--",
    location = "",
    condition = "",
    remark = "",
    visibility = "--",
    wind = "--",
    severity = "clear",
    error = false,
  } = weatherData || {};

  return (
    <div
      className={`bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg 
                  rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 
                  transition-all duration-700
                  ${
                    isVisible
                      ? "animate-[slideInRight_0.8s_ease-out_forwards]"
                      : "opacity-0"
                  }`}
      style={{ animationDelay }}
    >
      <h4 className="text-white font-semibold mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
        <FiCalendar className="mr-2 text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
        Current Conditions
        {error && (
          <FiAlertCircle className="ml-2 text-yellow-400 w-4 h-4" title="Using cached or fallback data" />
        )}
      </h4>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <WeatherIcon 
            severity={severity} 
            className="text-white w-8 h-8 sm:w-10 sm:h-10" 
          />
          <div>
            <div className="text-white text-2xl sm:text-3xl font-bold">
              {temperature}
            </div>
            <div className="text-white/70 text-xs sm:text-sm">{location}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-white/90 text-xs sm:text-sm font-medium">
            {condition}
          </div>
          <div className={`text-xs sm:text-sm font-medium ${
            remark.includes("Dangerous") || remark.includes("Extreme")
              ? "text-red-400"
              : remark.includes("Perfect") || remark.includes("Good")
              ? "text-emerald-400"
              : "text-amber-400"
          }`}>
            {remark}
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 flex items-center justify-between text-xs text-white/60">
        <span>Visibility: {visibility}</span>
        <span>Wind: {wind}</span>
      </div>

      {error && (
        <div className="mt-2 text-xs text-yellow-400/80 flex items-center">
          <FiAlertCircle className="mr-1 w-3 h-3" />
          Real-time data temporarily unavailable
        </div>
      )}
    </div>
  );
};

export default function EnhancedHeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [weatherLoading, setWeatherLoading] = useState({});

  const [mouseRef, mousePosition] = useMouseTracking();
  const [heroRef, isVisible] = useIntersectionObserver();

  const navigate = useNavigate();

  // Fetch weather data for current slide
  useEffect(() => {
    const currentSlideData = heroSlides[currentSlide];
    const locationKey = currentSlideData.locationKey;

    // Skip if already loaded or loading
    if (weatherData[locationKey] || weatherLoading[locationKey]) {
      return;
    }

    // Set loading state
    setWeatherLoading((prev) => ({ ...prev, [locationKey]: true }));

    // Fetch weather data
    fetchWeatherData(locationKey)
      .then((data) => {
        setWeatherData((prev) => ({ ...prev, [locationKey]: data }));
      })
      .catch((error) => {
        console.error(`Failed to fetch weather for ${locationKey}:`, error);
      })
      .finally(() => {
        setWeatherLoading((prev) => ({ ...prev, [locationKey]: false }));
      });
  }, [currentSlide]);

  // Generate particles
  useEffect(() => {
    const currentSlideData = heroSlides[currentSlide];
    const newParticles = Array.from({ length: currentSlideData.particles }).map(
      (_, i) => ({
        id: `${currentSlide}-${i}`,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        size: 2 + Math.random() * 8,
        opacity: 0.1 + Math.random() * 0.3,
        left: Math.random() * 100,
        top: Math.random() * 100,
      })
    );
    setParticles(newParticles);
  }, [currentSlide]);

  // Auto-advance slides
  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const currentSlideData = heroSlides[currentSlide];
  const currentLocationKey = currentSlideData.locationKey;
  const currentWeather = weatherData[currentLocationKey];
  const isWeatherLoading = weatherLoading[currentLocationKey];

  const handleDiscover = () => {
    if (!currentSlideData?.trekUrl) return;
    navigate(currentSlideData.trekUrl);
  };

  const handleViewMap = () => {
    if (!currentSlideData?.trekUrl) return;
    navigate(currentSlideData.trekUrl, { state: { openMap: true } });
  };

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
                transform: `scale(1.1) translate3d(${
                  mousePosition.x * 15
                }px, ${mousePosition.y * 15}px, 0)`,
              }}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 z-20" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {particles.map((particle) => (
          <FloatingParticle key={particle.id} {...particle} />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-40 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center">
        {/* Left */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1">
          {/* Slide Indicators */}
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
                aria-label={`Go to slide ${idx + 1}`}
              >
                {idx === currentSlide && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-orange-400 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Text */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6 text-center lg:text-left">
            <h1
              className={`text-white text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
                         font-black leading-tight tracking-tight 
                         bg-gradient-to-r from-white via-white to-amber-200 bg-clip-text text-transparent ${
                           isLoaded
                             ? "animate-[fadeInUp_0.8s_ease-out_forwards]"
                             : "opacity-0"
                         }`}
              style={{ animationDelay: "0.1s" }}
            >
              {currentSlideData.title}
            </h1>

            <h2
              className={`text-amber-400 text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-light ${
                isLoaded
                  ? "animate-[fadeInUp_0.8s_ease-out_forwards]"
                  : "opacity-0"
              }`}
              style={{ animationDelay: "0.2s" }}
            >
              {currentSlideData.subtitle}
            </h2>

            <p
              className={`text-white/90 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed mx-auto lg:mx-0 px-4 lg:px-0 ${
                isLoaded
                  ? "animate-[fadeInUp_0.8s_ease-out_forwards]"
                  : "opacity-0"
              }`}
              style={{ animationDelay: "0.3s" }}
            >
              {currentSlideData.description}
            </p>
          </div>

          {/* Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 lg:px-0 ${
              isLoaded
                ? "animate-[fadeInUp_0.8s_ease-out_forwards]"
                : "opacity-0"
            }`}
            style={{ animationDelay: "0.5s" }}
          >
            <button
              onClick={handleDiscover}
              className="group px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-lg sm:rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
            >
              <span className="flex items-center justify-center space-x-2">
                <Mountain className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span>Discover Treks</span>
              </span>
            </button>

            <button
              onClick={handleViewMap}
              className="group px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-transparent border-2 border-amber-400 text-amber-400 font-bold rounded-lg sm:rounded-xl hover:bg-amber-400 hover:text-black transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              <span className="flex items-center justify-center space-x-2">
                <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" />
                <span>View Map</span>
              </span>
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6 order-1 lg:order-2 px-4 lg:px-0">
          <div
            className={`bg-black/20 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-all duration-500 ${
              isVisible
                ? "animate-[slideInRight_0.8s_ease-out_forwards]"
                : "opacity-0"
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

          <WeatherWidget
            isVisible={isVisible}
            weatherData={currentWeather}
            isLoading={isWeatherLoading}
            hasError={currentWeather?.error}
            animationDelay="1.2s"
          />
        </div>
      </div>
    </section>
  );
}










// import React, { useState, useEffect } from "react";
// import { FiMapPin, FiStar, FiCalendar } from "react-icons/fi";
// import { Mountain } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// // Optional: Custom animated particle component, keep if you want extra effects
// const FloatingParticle = ({ delay, duration, size, opacity, left, top }) => (
//   <div
//     className="absolute rounded-full bg-white pointer-events-none"
//     style={{
//       width: size,
//       height: size,
//       left: `${left}%`,
//       top: `${top}%`,
//       opacity,
//       animation: `pulse ${duration}s ${delay}s infinite`,
//     }}
//   />
// );

// // Stats card component, driven by API
// const StatCard = ({ icon: Icon, label, value, delay, isVisible }) => (
//   <div
//     className={`bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10 
//       transition-all duration-500 transform hover:scale-105 hover:shadow-lg 
//       ${isVisible ? "animate-fadeInUp" : "opacity-0"}`}
//     style={{ animationDelay: `${delay}s` }}
//   >
//     {Icon && <Icon className="text-amber-400 mb-2 w-5 h-5" />}
//     <div className="text-white/90 text-sm font-medium">{label}</div>
//     <div className="text-white text-lg font-bold">{value}</div>
//   </div>
// );

// const WeatherWidget = ({
//   isVisible,
//   temperature,
//   location,
//   condition,
//   remark,
//   visibility,
//   wind,
//   animationDelay = "1.2s",
// }) => (
//   <div
//     className={`bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg 
//       rounded-xl p-6 border border-white/10 transition-all duration-700 
//       ${isVisible ? "animate-fadeInRight" : "opacity-0"}`}
//     style={{ animationDelay }}
//   >
//     <h4 className="text-white font-semibold mb-3 flex items-center text-base">
//       <FiCalendar className="mr-2 text-blue-400 w-5 h-5" />
//       Current Conditions
//     </h4>
//     <div className="flex items-center justify-between mb-2">
//       <div>
//         <div className="text-white text-3xl font-bold">{temperature}</div>
//         <div className="text-white/70 text-sm">{location}</div>
//       </div>
//       <div className="text-right">
//         <div className="text-white/90 text-sm font-medium">{condition}</div>
//         <div className="text-emerald-400 text-sm">{remark}</div>
//       </div>
//     </div>
//     <div className="flex items-center justify-between text-xs text-white/60">
//       <span>Visibility: {visibility}</span>
//       <span>Wind: {wind}</span>
//     </div>
//   </div>
// );

// // Main dynamic hero section component
// export default function EverestHeroSection() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const navigate = useNavigate();

//  useEffect(() => {
//   axios.get('http://127.0.0.1:8000/api/treks/everest-base-camp-trek/detail/')
// // NOT localhost:8000!

//     .then((res) => {
//        // <-- LOG THE DATA SHAPE!
//       setData(res.data);
//       setLoading(false);
//       setIsLoaded(true);
//     })
//     .catch(() => {
//       setLoading(false);
//     });
// }, []);


//   if (loading) {
//     return (
//       <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900">
//         <span className="text-white text-lg">Loading...</span>
//       </section>
//     );
//   }

//   // Data safety checks
//   if (!data || !data.hero || !data.trek) {
//     return (
//       <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900">
//         <span className="text-red-400 text-lg">Error loading trek info.</span>
//       </section>
//     );
//   }

//   const { hero, trek } = data;
//   const stats = {
//     elevation: trek.max_altitude + "m",
//     duration: trek.duration,
//     difficulty: hero.difficulty,
//   };

//   // Example weather values, you can fetch from a weather API or keep static
//   const weather = {
//     temperature: "-5°C",
//     location: hero.location,
//     condition: "Clear Sky",
//     remark: "Perfect for trekking",
//     visibility: "10km",
//     wind: "15 km/h",
//     isVisible: true,
//     animationDelay: "1.2s",
//   };

//   return (
//     <section className={`relative w-full min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900 transition-all duration-1000`}>
//       <div className="absolute inset-0 z-0">
//         <img src={hero.imageUrl} alt={hero.title} className="w-full h-full object-cover rounded-xl opacity-90" />
//         <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-20" />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 z-20" />
//       </div>
//       <div className="relative z-40 w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
//         <div className="lg:col-span-7 space-y-8">
//           <h1 className={`text-white text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-white to-amber-200 bg-clip-text text-transparent
//             ${isLoaded ? "animate-fadeInUp" : "opacity-0"}`}>{hero.title}</h1>
//           <h2 className="text-amber-400 text-2xl font-light">{hero.subtitle}</h2>
//           <p className="text-white/90 text-lg max-w-2xl">{trek.activity}</p>
//           <div className="flex flex-col sm:flex-row gap-4 pt-2">
//             <button
//               onClick={() => navigate("/trekking-in-nepal")}
//               className="px-8 py-4 bg-white/20 font-bold text-white rounded-xl hover:bg-white/30 transition-all"
//             >
//               <span className="flex items-center space-x-2">
//                 <Mountain className="w-6 h-6" />
//                 <span>{hero.cta_label || "Book This Trek"}</span>
//               </span>
//             </button>
//             <button className="px-8 py-4 bg-transparent border-2 border-amber-400 text-amber-400 font-bold rounded-xl hover:bg-amber-400 hover:text-black transition-all">
//               <span className="flex items-center space-x-2">
//                 <FiMapPin className="w-6 h-6" />
//                 <span>View Map</span>
//               </span>
//             </button>
//           </div>
//         </div>
//         <div className="lg:col-span-5 space-y-6">
//           <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
//             <h3 className="text-white text-xl font-bold mb-6 flex items-center">
//               <FiStar className="text-amber-400 mr-2 w-6 h-6" />
//               Trek Highlights
//             </h3>
//             <div className="grid grid-cols-3 gap-4">
//               <StatCard icon={Mountain} label="Max Elevation" value={stats.elevation} delay={0.7} isVisible={isLoaded} />
//               <StatCard icon={FiCalendar} label="Duration" value={stats.duration} delay={0.8} isVisible={isLoaded} />
//               <StatCard icon={FiStar} label="Difficulty" value={stats.difficulty} delay={0.9} isVisible={isLoaded} />
//             </div>
//             <WeatherWidget {...weather} />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
