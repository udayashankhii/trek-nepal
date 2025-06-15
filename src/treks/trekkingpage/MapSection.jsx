// import { useState, useEffect, useRef } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Polyline,
//   Marker,
//   Popup,
//   ZoomControl,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { motion } from "framer-motion";
// import { Icon } from "leaflet";
// import L from "leaflet";
// import {
//   FaMapMarkerAlt,
//   FaRoute,
//   FaMountain,
//   FaExclamationTriangle,
// } from "react-icons/fa";

// // Fix for default marker icons in React
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// });

// // Custom marker icons
// const createCustomIcon = (color) =>
//   new Icon({
//     iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
//     shadowUrl:
//       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41],
//   });

// const TrekMap = ({
//   trekName = "Everest Base Camp Trek",
//   trekRoute = [], // Array of [lat, lng] coordinates
//   destinations = [], // Array of {name, lat, lng, description, dayNumber} objects
//   zoomLevel = 11,
//   mapCenter = [27.8, 86.7], // Default center for Everest region
//   mapHeight = "500px",
//   routeColor = "#FF5733",
//   isLoading = false,
//   onDestinationClick = () => {},
//   mapLoadError = false,
// }) => {
//   const mapRef = useRef(null);
//   const [selectedDestination, setSelectedDestination] = useState(null);
//   const [showAllDestinations, setShowAllDestinations] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Check screen size on mount and resize
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);

//     return () => {
//       window.removeEventListener("resize", checkMobile);
//     };
//   }, []);

//   // Fit map to route bounds when route changes
//   useEffect(() => {
//     if (mapRef.current && trekRoute.length > 0) {
//       const bounds = L.latLngBounds(trekRoute);
//       mapRef.current.fitBounds(bounds, { padding: [50, 50] });
//     }
//   }, [trekRoute, mapRef.current]);

//   // Handle destination selection
//   const handleDestinationClick = (destination) => {
//     setSelectedDestination(destination);
//     onDestinationClick(destination);

//     // Center map on selected destination
//     if (mapRef.current && destination) {
//       mapRef.current.setView([destination.lat, destination.lng], zoomLevel + 2);
//     }
//   };

//   // Toggle showing all destinations
//   const toggleDestinations = () => {
//     setShowAllDestinations(!showAllDestinations);
//   };

//   return (
//     <motion.section
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.6 }}
//       className="bg-white rounded-3xl shadow-xl overflow-hidden my-12 relative"
//     >
//       <div className="p-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
//             <FaRoute className="text-blue-500" />
//             <span>{trekName} Route Map</span>
//           </h2>
//         </div>

//         <div className="relative" style={{ height: mapHeight }}>
//           {isLoading ? (
//             <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
//               <div className="flex flex-col items-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//                 <p className="mt-3 text-gray-600">Loading map data...</p>
//               </div>
//             </div>
//           ) : mapLoadError ? (
//             <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
//               <div className="flex flex-col items-center text-center px-6">
//                 <FaExclamationTriangle className="text-red-500 text-4xl mb-2" />
//                 <h3 className="text-lg font-semibold text-red-700">
//                   Map could not be loaded
//                 </h3>
//                 <p className="text-gray-600 mt-1">
//                   Please check your internet connection or try again later.
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <MapContainer
//               center={mapCenter}
//               zoom={zoomLevel}
//               style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
//               zoomControl={false}
//               attributionControl={false}
//               whenCreated={(mapInstance) => {
//                 mapRef.current = mapInstance;
//               }}
//             >
//               {/* Base layer - Terrain map */}
//               <TileLayer
//                 url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
//                 attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//               />

//               {/* Trek route polyline */}
//               <Polyline
//                 positions={trekRoute}
//                 color={routeColor}
//                 weight={4}
//                 opacity={0.8}
//                 dashArray="5, 10"
//               />

//               {/* Destination markers */}
//               {destinations
//                 .filter((d) => showAllDestinations || d.isHighlight)
//                 .map((destination, index) => (
//                   <Marker
//                     key={index}
//                     position={[destination.lat, destination.lng]}
//                     icon={createCustomIcon(
//                       destination.isStart
//                         ? "green"
//                         : destination.isEnd
//                         ? "red"
//                         : "blue"
//                     )}
//                     eventHandlers={{
//                       click: () => handleDestinationClick(destination),
//                     }}
//                   >
//                     <Popup>
//                       <div className="text-center">
//                         <h3 className="font-bold text-md">
//                           {destination.name}
//                         </h3>
//                         {destination.elevation && (
//                           <div className="text-sm flex items-center justify-center gap-1 text-gray-600 mt-1">
//                             <FaMountain />
//                             <span>{destination.elevation}m</span>
//                           </div>
//                         )}
//                         {destination.dayNumber && (
//                           <div className="mt-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
//                             Day {destination.dayNumber}
//                           </div>
//                         )}
//                         {destination.description && (
//                           <p className="text-sm mt-2">
//                             {destination.description}
//                           </p>
//                         )}
//                       </div>
//                     </Popup>
//                   </Marker>
//                 ))}

//               {/* Custom zoom control position */}
//               <ZoomControl position="bottomright" />

//               {/* Attribution with proper styling */}
//               <div className="leaflet-control leaflet-bar attribution absolute bottom-0 right-0 bg-white bg-opacity-70 px-2 py-1 text-xs text-gray-700 z-[1000]">
//                 © OpenStreetMap, OpenTopoMap
//               </div>
//             </MapContainer>
//           )}

//           {/* Floating button to show all destinations */}
//           <button
//             onClick={toggleDestinations}
//             className="absolute top-4 right-4 z-[1000] bg-white shadow-lg rounded-lg px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
//           >
//             <FaMapMarkerAlt className="text-blue-500" />
//             {showAllDestinations ? "Hide" : "View"} Destinations
//           </button>

//           {/* Mobile itinerary panel (conditionally shown) */}
//           {isMobile && selectedDestination && (
//             <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white shadow-lg rounded-lg p-4 max-h-[200px] overflow-y-auto">
//               <h3 className="font-bold text-lg mb-1">
//                 {selectedDestination.name}
//               </h3>
//               {selectedDestination.dayNumber && (
//                 <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
//                   Day {selectedDestination.dayNumber}
//                 </div>
//               )}
//               <p className="text-sm text-gray-600">
//                 {selectedDestination.description}
//               </p>
//               <button
//                 onClick={() => setSelectedDestination(null)}
//                 className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
//               >
//                 ×
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Desktop itinerary sidebar (only shown on desktop and when a destination is selected) */}
//         {!isMobile && selectedDestination && (
//           <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//             <div className="flex justify-between items-start">
//               <h3 className="font-bold text-lg">{selectedDestination.name}</h3>
//               {selectedDestination.dayNumber && (
//                 <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
//                   Day {selectedDestination.dayNumber}
//                 </div>
//               )}
//             </div>
//             <p className="text-sm text-gray-600 mt-2">
//               {selectedDestination.description}
//             </p>
//           </div>
//         )}

//         {/* Optional: Legend */}
//         <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-700">
//           <div className="flex items-center">
//             <span className="w-4 h-0.5 bg-red-400 mr-2 relative dashed-line"></span>
//             <span>Trek Route</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
//             <span>Start Point</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
//             <span>Waypoints</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
//             <span>End Point</span>
//           </div>
//         </div>
//       </div>
//     </motion.section>
//   );
// };

// export default TrekMap;
