// // JungleSafariPage.js - Main page component
// import React, { useState, useEffect, useRef } from "react";
// import { useIntersectionObserver } from "./useIntersectionObserver";
// const JungleSafariPage = () => {

//   // JungleSafariPage.js - Main page component
//   return (
//     <div className="min-h-screen">
//       <JungleSafariHero />
//       <SafariPackages />
//       <WildlifeStats />
//       <SafariExperiences />
//       <BookingSection />
//     </div>
//   );
// };

// // React 19 Compatible Hero Section with CSS animations
// const JungleSafariHero = () => {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [activeTab, setActiveTab] = useState("packages");

//   useEffect(() => {
//     const timer = setTimeout(() => setIsLoaded(true), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 overflow-hidden">
//       {/* Animated Background Pattern */}
//       <div
//         className="absolute inset-0 opacity-10 animate-pulse"
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//           backgroundSize: "60px 60px",
//           animation: "backgroundMove 20s ease-in-out infinite alternate",
//         }}
//       />

//       {/* CSS-only floating particles */}
//       <div className="absolute inset-0">
//         {[...Array(15)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-30 animate-bounce"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 3}s`,
//               animationDuration: `${3 + Math.random() * 2}s`,
//             }}
//           />
//         ))}
//       </div>

//       <div className="relative z-10 container mx-auto px-6 pt-20">
//         {/* Staggered animations using CSS */}
//         <div
//           className={`text-center mb-12 transition-all duration-1000 ease-out ${
//             isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//           }`}
//         >
//           <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
//             Wild
//             <span
//               className={`text-yellow-400 block transition-all duration-1000 delay-300 ease-out ${
//                 isLoaded
//                   ? "opacity-100 translate-x-0"
//                   : "opacity-0 -translate-x-12"
//               }`}
//             >
//               Adventures
//             </span>
//           </h1>

//           <p
//             className={`text-xl text-green-100 max-w-2xl mx-auto transition-all duration-1000 delay-500 ease-out ${
//               isLoaded ? "opacity-100" : "opacity-0"
//             }`}
//           >
//             Experience Nepal's pristine wilderness with luxury jungle safaris in
//             Chitwan and Bardiya National Parks
//           </p>
//         </div>

//         {/* Search card with CSS animations */}
//         <div
//           className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl transition-all duration-1000 delay-700 ease-out ${
//             isLoaded
//               ? "opacity-100 translate-y-0 scale-100"
//               : "opacity-0 translate-y-24 scale-95"
//           }`}
//         >
//           <SearchInterface activeTab={activeTab} setActiveTab={setActiveTab} />
//         </div>
//       </div>

//       {/* Custom CSS for background animation */}
//       <style jsx>{`
//         @keyframes backgroundMove {
//           0% {
//             background-position: 0% 0%;
//           }
//           100% {
//             background-position: 100% 100%;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// // Search Interface Component
// const SearchInterface = ({ activeTab, setActiveTab }) => {
//   const [searchData, setSearchData] = useState({
//     destination: "",
//     dates: "",
//     guests: 2,
//     duration: "3 days",
//   });

//   const tabs = [
//     { id: "packages", label: "Safari Packages", icon: "🦏" },
//     { id: "custom", label: "Custom Tours", icon: "🗺️" },
//     { id: "luxury", label: "Luxury Camps", icon: "⭐" },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Tab Navigation */}
//       <div className="flex space-x-2 bg-white/10 rounded-2xl p-2">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
//               activeTab === tab.id
//                 ? "bg-white text-green-800 shadow-lg scale-105"
//                 : "text-white hover:bg-white/10"
//             }`}
//           >
//             <span className="mr-2">{tab.icon}</span>
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Search Form */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <SearchField
//           label="Destination"
//           value={searchData.destination}
//           placeholder="Chitwan National Park"
//           icon="📍"
//         />
//         <SearchField
//           label="Check-in"
//           value={searchData.dates}
//           placeholder="Select dates"
//           icon="📅"
//         />
//         <SearchField
//           label="Guests"
//           value={searchData.guests}
//           placeholder="2 Adults"
//           icon="👥"
//         />
//         <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
//           Search Safaris
//         </button>
//       </div>
//     </div>
//   );
// };

// const SearchField = ({ label, value, placeholder, icon }) => (
//   <div className="bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
//     <label className="text-green-100 text-sm font-medium mb-2 block">
//       <span className="mr-2">{icon}</span>
//       {label}
//     </label>
//     <input
//       type="text"
//       placeholder={placeholder}
//       className="w-full bg-transparent text-white placeholder-green-200 border-none outline-none text-lg focus:ring-0"
//     />
//   </div>
// );

// // React 19 Compatible Safari Packages with Intersection Observer
// const SafariPackages = () => {
//   const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

//   const packages = [
//     {
//       id: 1,
//       title: "Royal Bengal Tiger Safari",
//       location: "Chitwan National Park",
//       duration: "3 Days / 2 Nights",
//       price: "$299",
//       image: "/api/placeholder/400/300",
//       highlights: ["Tiger Tracking", "Elephant Safari", "Canoe Ride"],
//       rating: 4.9,
//     },
//     {
//       id: 2,
//       title: "Rhino Conservation Experience",
//       location: "Bardiya National Park",
//       duration: "4 Days / 3 Nights",
//       price: "$399",
//       image: "/api/placeholder/400/300",
//       highlights: ["Rhino Spotting", "Jungle Walk", "Cultural Tour"],
//       rating: 4.8,
//     },
//     {
//       id: 3,
//       title: "Luxury Jungle Retreat",
//       location: "Chitwan Luxury Lodge",
//       duration: "5 Days / 4 Nights",
//       price: "$799",
//       image: "/api/placeholder/400/300",
//       highlights: ["Premium Accommodation", "Private Guide", "Spa Treatment"],
//       rating: 5.0,
//     },
//   ];

//   return (
//     <section
//       ref={ref}
//       className="py-20 bg-gradient-to-b from-green-50 to-white"
//     >
//       <div className="container mx-auto px-6">
//         <div
//           className={`text-center mb-16 transition-all duration-1000 ${
//             isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//           }`}
//         >
//           <h2 className="text-5xl font-bold text-green-800 mb-6">
//             Featured Safari Experiences
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Discover Nepal's incredible wildlife with our carefully curated
//             safari packages
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {packages.map((pkg, index) => (
//             <PackageCard
//               key={pkg.id}
//               package={pkg}
//               index={index}
//               isVisible={isVisible}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// // Package Card Component
// const PackageCard = ({ package: pkg, index, isVisible }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 group transform ${
//         isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//       }`}
//       style={{ transitionDelay: `${index * 200}ms` }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="relative overflow-hidden">
//         <img
//           src={pkg.image}
//           alt={pkg.title}
//           className={`w-full h-64 object-cover transition-transform duration-700 ${
//             isHovered ? "scale-110" : "scale-100"
//           }`}
//         />

//         <div
//           className={`absolute top-4 right-4 bg-yellow-400 text-green-800 font-bold py-2 px-4 rounded-full transition-transform duration-300 ${
//             isHovered ? "scale-110" : "scale-100"
//           }`}
//         >
//           {pkg.price}
//         </div>

//         <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
//           <span className="text-yellow-500 mr-1">⭐</span>
//           <span className="text-sm font-medium">{pkg.rating}</span>
//         </div>
//       </div>

//       <div className="p-6">
//         <h3
//           className={`text-2xl font-bold text-green-800 mb-2 transition-transform duration-300 ${
//             isHovered ? "-translate-y-1" : "translate-y-0"
//           }`}
//         >
//           {pkg.title}
//         </h3>

//         <p className="text-gray-600 mb-4 flex items-center">
//           <span className="mr-2">📍</span>
//           {pkg.location} • {pkg.duration}
//         </p>

//         <div
//           className={`space-y-2 mb-6 transition-opacity duration-300 ${
//             isHovered ? "opacity-100" : "opacity-70"
//           }`}
//         >
//           {pkg.highlights.map((highlight, idx) => (
//             <div
//               key={idx}
//               className={`flex items-center text-sm text-gray-600 transition-all duration-300`}
//               style={{ transitionDelay: `${idx * 100}ms` }}
//             >
//               <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
//               {highlight}
//             </div>
//           ))}
//         </div>

//         <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
//           Book Now
//         </button>
//       </div>
//     </div>
//   );
// };

// // React 19 Compatible Wildlife Stats with CSS Counter Animation
// const WildlifeStats = () => {
//   const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });
//   const [hasAnimated, setHasAnimated] = useState(false);

//   useEffect(() => {
//     if (isVisible && !hasAnimated) {
//       setHasAnimated(true);
//     }
//   }, [isVisible, hasAnimated]);

//   const stats = [
//     { number: 68, label: "Tiger Population", icon: "🐅" },
//     { number: 645, label: "One-Horned Rhinos", icon: "🦏" },
//     { number: 543, label: "Bird Species", icon: "🦅" },
//     { number: 15, label: "Years Experience", icon: "🏆" },
//   ];

//   return (
//     <section ref={ref} className="py-20 bg-green-800 relative overflow-hidden">
//       <div
//         className="absolute inset-0 opacity-10"
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//           backgroundSize: "60px 60px",
//         }}
//       />

//       <div className="container mx-auto px-6 relative z-10">
//         <div
//           className={`text-center mb-16 transition-all duration-1000 ${
//             isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//           }`}
//         >
//           <h2 className="text-5xl font-bold text-white mb-6">
//             Wildlife Conservation Impact
//           </h2>
//           <p className="text-xl text-green-100 max-w-3xl mx-auto">
//             Contributing to Nepal's wildlife conservation through responsible
//             tourism
//           </p>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//           {stats.map((stat, index) => (
//             <StatCard
//               key={index}
//               stat={stat}
//               index={index}
//               isVisible={isVisible}
//               hasAnimated={hasAnimated}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// // Stat Card with CSS Counter Animation
// const StatCard = ({ stat, index, isVisible, hasAnimated }) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     if (hasAnimated) {
//       const duration = 2000; // 2 seconds
//       const steps = 60;
//       const increment = stat.number / steps;
//       let current = 0;

//       const timer = setInterval(() => {
//         current += increment;
//         if (current >= stat.number) {
//           setCount(stat.number);
//           clearInterval(timer);
//         } else {
//           setCount(Math.floor(current));
//         }
//       }, duration / steps);

//       return () => clearInterval(timer);
//     }
//   }, [hasAnimated, stat.number]);

//   return (
//     <div
//       className={`text-center bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 transition-all duration-700 transform ${
//         isVisible
//           ? "opacity-100 translate-y-0 scale-100"
//           : "opacity-0 translate-y-12 scale-90"
//       }`}
//       style={{ transitionDelay: `${index * 200}ms` }}
//     >
//       <div className="text-6xl mb-4 animate-pulse">{stat.icon}</div>

//       <div
//         className={`text-4xl font-bold text-yellow-400 mb-2 transition-all duration-300 ${
//           count === stat.number ? "scale-110" : "scale-100"
//         }`}
//       >
//         {count}+
//       </div>

//       <p className="text-white text-lg font-medium">{stat.label}</p>
//     </div>
//   );
// };

// // Custom Hook for Intersection Observer (React 19 Compatible)
// const useIntersectionObserver = (options = {}) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       setIsVisible(entry.isIntersecting);
//     }, options);

//     if (ref.current) {
//       observer.observe(ref.current);
//     }

//     return () => {
//       if (ref.current) {
//         observer.unobserve(ref.current);
//       }
//     };
//   }, [options]);

//   return [ref, isVisible];
// };

//   return (
//     <div className="min-h-screen">
//       <JungleSafariHero />
//       <SafariPackages />
//       <WildlifeStats />
//       <SafariExperiences />
//       <BookingSection />
//     </div>
//   );
// };

// // React 19 Compatible Hero Section with CSS animations
// const JungleSafariHero = () => {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [activeTab, setActiveTab] = useState("packages");

//   useEffect(() => {
//     const timer = setTimeout(() => setIsLoaded(true), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 overflow-hidden">
//       {/* Animated Background Pattern */}
//       <div
//         className="absolute inset-0 opacity-10 animate-pulse"
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//           backgroundSize: "60px 60px",
//           animation: "backgroundMove 20s ease-in-out infinite alternate",
//         }}
//       />

//       {/* CSS-only floating particles */}
//       <div className="absolute inset-0">
//         {[...Array(15)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-30 animate-bounce"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 3}s`,
//               animationDuration: `${3 + Math.random() * 2}s`,
//             }}
//           />
//         ))}
//       </div>

//       <div className="relative z-10 container mx-auto px-6 pt-20">
//         {/* Staggered animations using CSS */}
//         <div
//           className={`text-center mb-12 transition-all duration-1000 ease-out ${
//             isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//           }`}
//         >
//           <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
//             Wild
//             <span
//               className={`text-yellow-400 block transition-all duration-1000 delay-300 ease-out ${
//                 isLoaded
//                   ? "opacity-100 translate-x-0"
//                   : "opacity-0 -translate-x-12"
//               }`}
//             >
//               Adventures
//             </span>
//           </h1>

//           <p
//             className={`text-xl text-green-100 max-w-2xl mx-auto transition-all duration-1000 delay-500 ease-out ${
//               isLoaded ? "opacity-100" : "opacity-0"
//             }`}
//           >
//             Experience Nepal's pristine wilderness with luxury jungle safaris in
//             Chitwan and Bardiya National Parks
//           </p>
//         </div>

//         {/* Search card with CSS animations */}
//         <div
//           className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl transition-all duration-1000 delay-700 ease-out ${
//             isLoaded
//               ? "opacity-100 translate-y-0 scale-100"
//               : "opacity-0 translate-y-24 scale-95"
//           }`}
//         >
//           <SearchInterface activeTab={activeTab} setActiveTab={setActiveTab} />
//         </div>
//       </div>

//       {/* Custom CSS for background animation */}
//       <style jsx>{`
//         @keyframes backgroundMove {
//           0% {
//             background-position: 0% 0%;
//           }
//           100% {
//             background-position: 100% 100%;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// // Search Interface Component
// const SearchInterface = ({ activeTab, setActiveTab }) => {
//   const [searchData, setSearchData] = useState({
//     destination: "",
//     dates: "",
//     guests: 2,
//     duration: "3 days",
//   });

//   const tabs = [
//     { id: "packages", label: "Safari Packages", icon: "🦏" },
//     { id: "custom", label: "Custom Tours", icon: "🗺️" },
//     { id: "luxury", label: "Luxury Camps", icon: "⭐" },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Tab Navigation */}
//       <div className="flex space-x-2 bg-white/10 rounded-2xl p-2">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
//               activeTab === tab.id
//                 ? "bg-white text-green-800 shadow-lg scale-105"
//                 : "text-white hover:bg-white/10"
//             }`}
//           >
//             <span className="mr-2">{tab.icon}</span>
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Search Form */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <SearchField
//           label="Destination"
//           value={searchData.destination}
//           placeholder="Chitwan National Park"
//           icon="📍"
//         />
//         <SearchField
//           label="Check-in"
//           value={searchData.dates}
//           placeholder="Select dates"
//           icon="📅"
//         />
//         <SearchField
//           label="Guests"
//           value={searchData.guests}
//           placeholder="2 Adults"
//           icon="👥"
//         />
//         <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
//           Search Safaris
//         </button>
//       </div>
//     </div>
//   );
// };

// const SearchField = ({ label, value, placeholder, icon }) => (
//   <div className="bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
//     <label className="text-green-100 text-sm font-medium mb-2 block">
//       <span className="mr-2">{icon}</span>
//       {label}
//     </label>
//     <input
//       type="text"
//       placeholder={placeholder}
//       className="w-full bg-transparent text-white placeholder-green-200 border-none outline-none text-lg focus:ring-0"
//     />
//   </div>
// );

// // React 19 Compatible Safari Packages with Intersection Observer
// const SafariPackages = () => {
//   const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

//   const packages = [
//     {
//       id: 1,
//       title: "Royal Bengal Tiger Safari",
//       location: "Chitwan National Park",
//       duration: "3 Days / 2 Nights",
//       price: "$299",
//       image: "/api/placeholder/400/300",
//       highlights: ["Tiger Tracking", "Elephant Safari", "Canoe Ride"],
//       rating: 4.9,
//     },
//     {
//       id: 2,
//       title: "Rhino Conservation Experience",
//       location: "Bardiya National Park",
//       duration: "4 Days / 3 Nights",
//       price: "$399",
//       image: "/api/placeholder/400/300",
//       highlights: ["Rhino Spotting", "Jungle Walk", "Cultural Tour"],
//       rating: 4.8,
//     },
//     {
//       id: 3,
//       title: "Luxury Jungle Retreat",
//       location: "Chitwan Luxury Lodge",
//       duration: "5 Days / 4 Nights",
//       price: "$799",
//       image: "/api/placeholder/400/300",
//       highlights: ["Premium Accommodation", "Private Guide", "Spa Treatment"],
//       rating: 5.0,
//     },
//   ];

//   return (
//     <section
//       ref={ref}
//       className="py-20 bg-gradient-to-b from-green-50 to-white"
//     >
//       <div className="container mx-auto px-6">
//         <div
//           className={`text-center mb-16 transition-all duration-1000 ${
//             isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//           }`}
//         >
//           <h2 className="text-5xl font-bold text-green-800 mb-6">
//             Featured Safari Experiences
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Discover Nepal's incredible wildlife with our carefully curated
//             safari packages
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {packages.map((pkg, index) => (
//             <PackageCard
//               key={pkg.id}
//               package={pkg}
//               index={index}
//               isVisible={isVisible}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// // Package Card Component
// const PackageCard = ({ package: pkg, index, isVisible }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 group transform ${
//         isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//       }`}
//       style={{ transitionDelay: `${index * 200}ms` }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="relative overflow-hidden">
//         <img
//           src={pkg.image}
//           alt={pkg.title}
//           className={`w-full h-64 object-cover transition-transform duration-700 ${
//             isHovered ? "scale-110" : "scale-100"
//           }`}
//         />

//         <div
//           className={`absolute top-4 right-4 bg-yellow-400 text-green-800 font-bold py-2 px-4 rounded-full transition-transform duration-300 ${
//             isHovered ? "scale-110" : "scale-100"
//           }`}
//         >
//           {pkg.price}
//         </div>

//         <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
//           <span className="text-yellow-500 mr-1">⭐</span>
//           <span className="text-sm font-medium">{pkg.rating}</span>
//         </div>
//       </div>

//       <div className="p-6">
//         <h3
//           className={`text-2xl font-bold text-green-800 mb-2 transition-transform duration-300 ${
//             isHovered ? "-translate-y-1" : "translate-y-0"
//           }`}
//         >
//           {pkg.title}
//         </h3>

//         <p className="text-gray-600 mb-4 flex items-center">
//           <span className="mr-2">📍</span>
//           {pkg.location} • {pkg.duration}
//         </p>

//         <div
//           className={`space-y-2 mb-6 transition-opacity duration-300 ${
//             isHovered ? "opacity-100" : "opacity-70"
//           }`}
//         >
//           {pkg.highlights.map((highlight, idx) => (
//             <div
//               key={idx}
//               className={`flex items-center text-sm text-gray-600 transition-all duration-300`}
//               style={{ transitionDelay: `${idx * 100}ms` }}
//             >
//               <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
//               {highlight}
//             </div>
//           ))}
//         </div>

//         <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
//           Book Now
//         </button>
//       </div>
//     </div>
//   );
// };

// // React 19 Compatible Wildlife Stats with CSS Counter Animation
// const WildlifeStats = () => {
//   const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });
//   const [hasAnimated, setHasAnimated] = useState(false);

//   useEffect(() => {
//     if (isVisible && !hasAnimated) {
//       setHasAnimated(true);
//     }
//   }, [isVisible, hasAnimated]);

//   const stats = [
//     { number: 68, label: "Tiger Population", icon: "🐅" },
//     { number: 645, label: "One-Horned Rhinos", icon: "🦏" },
//     { number: 543, label: "Bird Species", icon: "🦅" },
//     { number: 15, label: "Years Experience", icon: "🏆" },
//   ];

//   return (
//     <section ref={ref} className="py-20 bg-green-800 relative overflow-hidden">
//       <div
//         className="absolute inset-0 opacity-10"
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//           backgroundSize: "60px 60px",
//         }}
//       />

//       <div className="container mx-auto px-6 relative z-10">
//         <div
//           className={`text-center mb-16 transition-all duration-1000 ${
//             isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//           }`}
//         >
//           <h2 className="text-5xl font-bold text-white mb-6">
//             Wildlife Conservation Impact
//           </h2>
//           <p className="text-xl text-green-100 max-w-3xl mx-auto">
//             Contributing to Nepal's wildlife conservation through responsible
//             tourism
//           </p>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//           {stats.map((stat, index) => (
//             <StatCard
//               key={index}
//               stat={stat}
//               index={index}
//               isVisible={isVisible}
//               hasAnimated={hasAnimated}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// // Stat Card with CSS Counter Animation
// const StatCard = ({ stat, index, isVisible, hasAnimated }) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     if (hasAnimated) {
//       const duration = 2000; // 2 seconds
//       const steps = 60;
//       const increment = stat.number / steps;
//       let current = 0;

//       const timer = setInterval(() => {
//         current += increment;
//         if (current >= stat.number) {
//           setCount(stat.number);
//           clearInterval(timer);
//         } else {
//           setCount(Math.floor(current));
//         }
//       }, duration / steps);

//       return () => clearInterval(timer);
//     }
//   }, [hasAnimated, stat.number]);

//   return (
//     <div
//       className={`text-center bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 transition-all duration-700 transform ${
//         isVisible
//           ? "opacity-100 translate-y-0 scale-100"
//           : "opacity-0 translate-y-12 scale-90"
//       }`}
//       style={{ transitionDelay: `${index * 200}ms` }}
//     >
//       <div className="text-6xl mb-4 animate-pulse">{stat.icon}</div>

//       <div
//         className={`text-4xl font-bold text-yellow-400 mb-2 transition-all duration-300 ${
//           count === stat.number ? "scale-110" : "scale-100"
//         }`}
//       >
//         {count}+
//       </div>

//       <p className="text-white text-lg font-medium">{stat.label}</p>
//     </div>
//   );
// };

// // Custom Hook for Intersection Observer (React 19 Compatible)
// const useIntersectionObserver = (options = {}) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       setIsVisible(entry.isIntersecting);
//     }, options);

//     if (ref.current) {
//       observer.observe(ref.current);
//     }

//     return () => {
//       if (ref.current) {
//         observer.unobserve(ref.current);
//       }
//     };
//   }, [options]);

//   return [ref, isVisible];
// };

// export default JungleSafariPage;

// JungleSafariPage.js - Main page component
import React, { useState, useEffect, useRef } from "react";
import JungleSafariHero from "./JUngleHero";
import WildlifeStats from "./WildlifeStats";
import SafariPackages from "./SafariPackages";
import SafariExperience from "./Safari Expereince";
const JungleSafariPage = () => (
  <div className="min-h-screen">
    {/* <JungleSafariHero /> */}
    <SafariPackages />
    <WildlifeStats />
    <SafariExperience />
  </div>
);

export default JungleSafariPage;
