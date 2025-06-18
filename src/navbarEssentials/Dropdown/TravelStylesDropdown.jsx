// import React from "react";
// import { Link } from "react-router-dom";
// import { Mountain } from "lucide-react";
// import {
//   HiOutlineCamera,
//   HiOutlineFire,
//   HiOutlineUsers,
//   HiOutlineStar,
//   HiOutlineHeart,
//   HiOutlineGlobeAlt,
// } from "react-icons/hi";
// import { FaPaw } from "react-icons/fa";

// const travelStyles = [
//   {
//     name: "Trekking",
//     description: "Everest, Annapurna, Manaslu & Langtang regions",
//     route: "/travel-styles/trekking",
//     featured: true,
//     icon: Mountain,
//     color: "text-blue-600",
//   },
//   {
//     name: "Tours",
//     description: "Cultural tours & city exploration",
//     route: "/travel-styles/tours",
//     featured: true,
//     icon: HiOutlineCamera,
//     color: "text-orange-600",
//   },
//   {
//     name: "Peak Climbing",
//     description: "Island Peak, Mera Peak & technical climbs",
//     route: "/travel-styles/peak-climbing",
//     featured: true,
//     icon: Mountain,
//     color: "text-gray-700",
//   },
//   {
//     name: "Jungle Safari",
//     description: "Chitwan & Bardia wildlife experiences",
//     route: "/travel-styles/jungle-safari",
//     featured: true,
//     icon: FaPaw,
//     color: "text-green-600",
//   },
//   {
//     name: "Helicopter Tours",
//     description: "Everest Base Camp & scenic mountain flights",
//     route: "/travel-styles/helicopter-tours",
//     featured: true,
//     icon: HiOutlineGlobeAlt,
//     color: "text-indigo-600",
//   },
//   {
//     name: "Adventure Tours",
//     description: "White water rafting, mountain biking & more",
//     route: "/travel-styles/adventure-tours",
//     featured: true,
//     icon: HiOutlineFire,
//     color: "text-red-600",
//   },
// ];

// const TravelStylesDropdown = ({ minimal = false }) => {
//   if (minimal) {
//     return (
//       <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[220px]">
//         <ul className="space-y-0">
//           {travelStyles.map((style) => {
//             const IconComponent = style.icon;
//             return (
//               <li key={style.name}>
//                 <Link
//                   to={style.route}
//                   className="flex items-center px-4 py-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0"
//                 >
//                   <span className="font-medium">{style.name}</span>
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[280px]">
//       <ul className="space-y-0">
//         {travelStyles.map((style) => {
//           const IconComponent = style.icon;
//           return (
//             <li key={style.name}>
//               <Link
//                 to={style.route}
//                 className="flex items-center px-4 py-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 group"
//               >
//                 <IconComponent
//                   className={`w-4 h-4 mr-3 ${style.color} group-hover:text-blue-600 transition-colors`}
//                 />
//                 <div className="flex-1">
//                   <span className="font-medium block">{style.name}</span>
//                   {!minimal && (
//                     <span className="text-xs text-gray-500 mt-0.5 block">
//                       {style.description}
//                     </span>
//                   )}
//                 </div>
//               </Link>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default TravelStylesDropdown;
import React from "react";
import { Link } from "react-router-dom";

const travelStyles = [
  {
    name: "Trekking",
    route: "/travel-styles/trekking",
  },
  {
    name: "Tours",
    route: "/travel-styles/tours",
  },

  {
    name: "Jungle Safari",
    route: "/travel-styles/jungle-safari",
  },
  {
    name: "Helicopter Tours",
    route: "/travel-styles/helicopter-tours",
  },
  {
    name: "Adventure Tours",
    route: "/travel-styles/adventure-tours",
  },
  {
    name: "Bike Rental",
    route: "/travel-styles/bike-rental",
  },
  {
    name: "Photography Tours",
    route: "/travel-styles/photography-tours",
  },
  {
    name: "Spiritual Retreats",
    route: "/travel-styles/spiritual-retreats",
  },
];

const TravelStylesDropdown = () => {
  return (
    <ul className="py-2 list-none">
      {travelStyles.map((style) => (
        <li key={style.name} className="relative pl-4 py-1">
          <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></span>
          <Link
            to={style.route}
            className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200 block"
          >
            {style.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default TravelStylesDropdown;
