// import React from "react";
// import { Star } from "lucide-react";
// import ReviewsSlider from "./ReviewSlider";

// const ReviewSection = ({ 
//   reviews = [], 
//   trekName = "Trek", 
//   averageRating = 5, 
//   totalReviews = 0 
// }) => {
//   const TripAdvisorBadge = () => {
//     return (
//       <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-sm">
//         <div className="flex items-center gap-3 mb-3">
//           <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
//             <span className="text-white font-bold text-sm">T</span>
//           </div>
//           <span className="font-semibold text-gray-800">TripAdvisor</span>
//         </div>

//         <h3 className="font-bold text-lg mb-2 text-gray-900 leading-tight">
//           Green Valley Nepal Treks & Research Hub P Ltd
//         </h3>

//         <div className="flex items-center gap-3 mb-3">
//           <div className="flex items-center">
//             {[...Array(5)].map((_, index) => (
//               <Star
//                 key={index}
//                 className={`w-4 h-4 ${
//                   index < Math.floor(averageRating)
//                     ? "fill-yellow-500 text-yellow-500"
//                     : "fill-gray-300 text-gray-300"
//                 }`}
//               />
//             ))}
//           </div>
//           <span className="text-sm font-medium text-gray-700">
//             {totalReviews.toLocaleString()} reviews
//           </span>
//         </div>

//         <p className="text-sm text-gray-600">
//           #12 of 2221 Outdoor Activities in Kathmandu
//         </p>
//       </div>
//     );
//   };

//   // Don't render if no reviews
//   if (!reviews || reviews.length === 0) {
//     return null;
//   }

//   return (
//     <section className="bg-gray-50 py-16 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-12 gap-8">
//           <div className="flex-1">
//             <p className="text-emerald-600 text-sm font-semibold mb-2 uppercase tracking-wide">
//               What our travelers say about
//             </p>
//             <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
//               {trekName} Reviews
//             </h2>
            
//             {/* Average Rating Display */}
//             <div className="flex items-center gap-4 mt-4">
//               <div className="flex items-center gap-2">
//                 <div className="flex items-center">
//                   {[...Array(5)].map((_, index) => (
//                     <Star
//                       key={index}
//                       className={`w-5 h-5 ${
//                         index < Math.floor(averageRating)
//                           ? "fill-yellow-500 text-yellow-500"
//                           : "fill-gray-300 text-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-xl font-semibold text-gray-900">
//                   {averageRating.toFixed(1)}
//                 </span>
//               </div>
//               <span className="text-gray-600">
//                 Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
//               </span>
//             </div>
//           </div>

//           {/* TripAdvisor Badge */}
//           <div className="lg:flex-shrink-0">
//             <TripAdvisorBadge />
//           </div>
//         </div>

//         {/* Reviews Slider */}
//         <div className="mb-8">
//           <ReviewsSlider reviews={reviews} />
//         </div>

//         {/* View More Button */}
//         <div className="text-center mt-12">
//           <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
//             View All {totalReviews} Reviews
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ReviewSection;
