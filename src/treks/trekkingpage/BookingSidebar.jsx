// import { useState, useEffect } from "react";
// import {
//   CalendarDaysIcon,
//   UserGroupIcon,
//   TicketIcon,
// } from "@heroicons/react/24/outline";
// import { motion } from "framer-motion";

// export default function BookingSidebar({
//   basePrice = 1250,
//   trekName = "Everest Base Camp Trek",

//   discount = 0,
// }) {
//   const [groupSize, setGroupSize] = useState(1);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [totalPrice, setTotalPrice] = useState(basePrice);
//   const [loading, setLoading] = useState(false);

//   // Calculate price with potential discounts
//   useEffect(() => {
//     let calculatedPrice = basePrice * groupSize;
//     if (groupSize >= 4) calculatedPrice *= 0.9; // 10% discount for groups of 4+
//     setTotalPrice(calculatedPrice - discount);
//   }, [groupSize, basePrice, discount]);

//   // Handle booking submission
//   const handleBooking = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Replace with actual Django API endpoint
//       const response = await fetch("/api/bookings/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           trek: trekName,
//           date: selectedDate,
//           participants: groupSize,
//           total_price: totalPrice,
//         }),
//       });

//       if (!response.ok) throw new Error("Booking failed");
//       // Handle successful booking (redirect/payment)
//     } catch (error) {
//       console.error("Booking error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.aside
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       className="sticky top-20 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-2xl p-6 h-fit"
//     >
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="border-b border-slate-200 pb-4">
//           <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <TicketIcon className="h-6 w-6 text-teal-600" />
//             Booking Details
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Secure your spot for {trekName}
//           </p>
//         </div>

//         {/* Price Display */}
//         <div className="bg-white rounded-xl p-4 shadow-sm">
//           <div className="flex justify-between items-center">
//             <span className="text-gray-600">From</span>
//             <div className="text-right">
//               {discount > 0 && (
//                 <span className="line-through text-red-500 mr-2">
//                   ${basePrice}
//                 </span>
//               )}
//               <span className="text-3xl font-bold text-teal-600">
//                 ${totalPrice.toFixed(2)}
//               </span>
//             </div>
//           </div>
//           <p className="text-sm text-gray-500 mt-2 text-center">
//             {groupSize} x ${basePrice} per person
//           </p>
//         </div>

//         {/* Booking Form */}
//         <form onSubmit={handleBooking} className="space-y-4">
//           {/* Date Picker */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
//               <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
//               Select Date
//             </label>
//             <input
//               type="date"
//               required
//               className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               min={new Date().toISOString().split("T")[0]}
//             />
//           </div>

//           {/* Group Size Selector */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
//               <UserGroupIcon className="h-5 w-5 text-gray-500" />
//               Participants
//             </label>
//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
//                 className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
//               >
//                 -
//               </button>
//               <input
//                 type="number"
//                 min="1"
//                 max="15"
//                 value={groupSize}
//                 readOnly
//                 className="w-16 text-center rounded-lg border border-gray-300 px-3 py-2"
//               />
//               <button
//                 type="button"
//                 onClick={() => setGroupSize(Math.min(15, groupSize + 1))}
//                 className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           {/* Discount Notice */}
//           {groupSize >= 4 && (
//             <div className="p-3 bg-green-50 rounded-lg text-sm text-green-700">
//               🎉 Group discount applied! (10% off for 4+ people)
//             </div>
//           )}

//           {/* Book Button */}
//           <button
//             type="submit"
//             disabled={loading || !selectedDate}
//             className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-teal-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Processing..." : "Book Now"}
//           </button>

//           {/* Security Info */}
//           <div className="text-center text-sm text-gray-500 mt-4">
//             <p>🔒 Secure SSL encryption</p>
//             <p>⭐ Best price guarantee</p>
//           </div>
//         </form>
//       </div>
//     </motion.aside>
//   );
// }
