// import { useEffect, useState } from "react";
// import { Loader2, Calendar, Users, CreditCard, Clock, ChevronRight, Filter } from "lucide-react";
// import { fetchUserBookingHistory } from "../../api/service/bookingServices";

// const STATUS_CONFIG = {
//   pending_payment: {
//     label: "Pending Payment",
//     color: "text-amber-700",
//     bg: "bg-amber-50",
//     border: "border-amber-200",
//     dot: "bg-amber-500"
//   },
//   paid: {
//     label: "Confirmed",
//     color: "text-emerald-700",
//     bg: "bg-emerald-50",
//     border: "border-emerald-200",
//     dot: "bg-emerald-500"
//   },
//   cancelled: {
//     label: "Cancelled",
//     color: "text-slate-600",
//     bg: "bg-slate-50",
//     border: "border-slate-200",
//     dot: "bg-slate-400"
//   },
// };

// export default function MyBookingsPage() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");

//   useEffect(() => {
//     const loadBookings = async () => {
//       try {
//         const data = await fetchUserBookingHistory();
//         setBookings(Array.isArray(data.results) ? data.results : []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadBookings();
//   }, []);

//   const filteredBookings = bookings.filter(b => 
//     filter === "all" || b.status === filter
//   );

//   const getStatusCounts = () => {
//     return {
//       all: bookings.length,
//       paid: bookings.filter(b => b.status === "paid").length,
//       pending_payment: bookings.filter(b => b.status === "pending_payment").length,
//       cancelled: bookings.filter(b => b.status === "cancelled").length,
//     };
//   };

//   const counts = getStatusCounts();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="text-center">
//           <Loader2 className="w-8 h-8 text-slate-600 animate-spin mx-auto mb-3" />
//           <p className="text-sm text-slate-600">Loading your bookings...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-semibold text-slate-900 mb-1">My Bookings</h1>
//           <p className="text-slate-600">Manage and track all your trek reservations</p>
//         </div>

//         {/* Filter Tabs */}
//         {bookings.length > 0 && (
//           <div className="bg-white rounded-lg border border-slate-200 p-1 mb-6 inline-flex gap-1">
//             <button
//               onClick={() => setFilter("all")}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                 filter === "all"
//                   ? "bg-slate-900 text-white"
//                   : "text-slate-600 hover:text-slate-900"
//               }`}
//             >
//               All ({counts.all})
//             </button>
//             <button
//               onClick={() => setFilter("paid")}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                 filter === "paid"
//                   ? "bg-slate-900 text-white"
//                   : "text-slate-600 hover:text-slate-900"
//               }`}
//             >
//               Confirmed ({counts.paid})
//             </button>
//             <button
//               onClick={() => setFilter("pending_payment")}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                 filter === "pending_payment"
//                   ? "bg-slate-900 text-white"
//                   : "text-slate-600 hover:text-slate-900"
//               }`}
//             >
//               Pending ({counts.pending_payment})
//             </button>
//             <button
//               onClick={() => setFilter("cancelled")}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                 filter === "cancelled"
//                   ? "bg-slate-900 text-white"
//                   : "text-slate-600 hover:text-slate-900"
//               }`}
//             >
//               Cancelled ({counts.cancelled})
//             </button>
//           </div>
//         )}

//         {/* Bookings List */}
//         {filteredBookings.length === 0 ? (
//           <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
//             <div className="max-w-sm mx-auto">
//               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Calendar className="w-8 h-8 text-slate-400" />
//               </div>
//               <h3 className="text-lg font-medium text-slate-900 mb-2">
//                 {filter === "all" ? "No bookings yet" : `No ${filter.replace("_", " ")} bookings`}
//               </h3>
//               <p className="text-slate-600">
//                 {filter === "all" 
//                   ? "Start planning your next adventure"
//                   : "Try selecting a different filter"}
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredBookings.map((booking) => {
//               const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.cancelled;
//               const startDate = new Date(booking.start_date);
//               const endDate = new Date(booking.end_date);
//               const isUpcoming = startDate > new Date();
              
//               return (
//                 <div
//                   key={booking.booking_ref}
//                   className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all duration-200 overflow-hidden group"
//                 >
//                   <div className="p-6">
//                     {/* Header Row */}
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex-1 min-w-0">
//                         <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate">
//                           {booking.trek_title}
//                         </h3>
//                         <div className="flex items-center gap-2 text-sm text-slate-500">
//                           <span className="font-mono">#{booking.booking_ref}</span>
//                         </div>
//                       </div>
                      
//                       {/* Status Badge */}
//                       <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${status.bg} ${status.border}`}>
//                         <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
//                         <span className={`text-xs font-medium ${status.color}`}>
//                           {status.label}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Details Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       {/* Dates */}
//                       <div className="flex items-start gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
//                           <Calendar className="w-5 h-5 text-slate-600" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-xs font-medium text-slate-500 mb-0.5">Trek Dates</p>
//                           <p className="text-sm text-slate-900">
//                             {new Intl.DateTimeFormat("en-US", { 
//                               month: "short", 
//                               day: "numeric",
//                               year: "numeric"
//                             }).format(startDate)}
//                             {" - "}
//                             {new Intl.DateTimeFormat("en-US", { 
//                               month: "short", 
//                               day: "numeric",
//                               year: "numeric"
//                             }).format(endDate)}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Party Size */}
//                       <div className="flex items-start gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
//                           <Users className="w-5 h-5 text-slate-600" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-xs font-medium text-slate-500 mb-0.5">Party Size</p>
//                           <p className="text-sm text-slate-900">
//                             {booking.party_size} {booking.party_size === 1 ? "person" : "people"}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Total Amount */}
//                       <div className="flex items-start gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
//                           <CreditCard className="w-5 h-5 text-slate-600" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-xs font-medium text-slate-500 mb-0.5">Total Amount</p>
//                           <p className="text-sm font-semibold text-slate-900">
//                             {booking.currency} {parseFloat(booking.total_amount).toLocaleString('en-US', {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 2
//                             })}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Booking Date */}
//                       <div className="flex items-start gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
//                           <Clock className="w-5 h-5 text-slate-600" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-xs font-medium text-slate-500 mb-0.5">Booked On</p>
//                           <p className="text-sm text-slate-900">
//                             {new Intl.DateTimeFormat("en-US", {
//                               month: "short",
//                               day: "numeric",
//                               year: "numeric",
//                               hour: "numeric",
//                               minute: "2-digit"
//                             }).format(new Date(booking.created_at))}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Action Button */}
                   
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import {
  Loader2,
  Calendar,
  Users,
  CreditCard,
  Clock,
} from "lucide-react";
import { fetchUserBookingHistory } from "../../api/service/bookingServices";

const STATUS_CONFIG = {
  pending_payment: {
    label: "Pending Payment",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  paid: {
    label: "Confirmed",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

const ITEMS_PER_PAGE = 20;

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchUserBookingHistory();
        setBookings(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filteredBookings = bookings.filter(
    (b) => filter === "all" || b.status === filter
  );

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const counts = {
    all: bookings.length,
    paid: bookings.filter((b) => b.status === "paid").length,
    pending_payment: bookings.filter((b) => b.status === "pending_payment").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-slate-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">
            My Bookings
          </h1>
          <p className="text-slate-600">
            Manage and track all your trek reservations
          </p>
        </div>

        {/* Filter Tabs */}
        {bookings.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-1 mb-6 inline-flex gap-1">
            {[
              ["all", "All", counts.all],
              ["paid", "Confirmed", counts.paid],
              ["pending_payment", "Pending", counts.pending_payment],
              ["cancelled", "Cancelled", counts.cancelled],
            ].map(([key, label, count]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        )}

        {/* Bookings List */}
        {paginatedBookings.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {filter === "all"
                  ? "No bookings yet"
                  : `No ${filter.replace("_", " ")} bookings`}
              </h3>
              <p className="text-slate-600">
                {filter === "all"
                  ? "Start planning your next adventure"
                  : "Try selecting a different filter"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedBookings.map((booking) => {
                const status =
                  STATUS_CONFIG[booking.status] ||
                  STATUS_CONFIG.cancelled;

                const startDate = new Date(booking.start_date);
                const endDate = new Date(booking.end_date);

                return (
                  <div
                    key={booking.booking_ref}
                    className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {booking.trek_title}
                          </h3>
                          <p className="text-sm text-slate-500 font-mono">
                            #{booking.booking_ref}
                          </p>
                        </div>

                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${status.bg} ${status.border}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                          />
                          <span
                            className={`text-xs font-medium ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Detail
                          icon={<Calendar />}
                          label="Trek Dates"
                          value={`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
                        />
                        <Detail
                          icon={<Users />}
                          label="Party Size"
                          value={`${booking.party_size} ${
                            booking.party_size === 1 ? "person" : "people"
                          }`}
                        />
                        <Detail
                          icon={<CreditCard />}
                          label="Total Amount"
                          value={`${booking.currency} ${Number(
                            booking.total_amount
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}`}
                          bold
                        />
                        <Detail
                          icon={<Clock />}
                          label="Booked On"
                          value={new Date(
                            booking.created_at
                          ).toLocaleString()}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border rounded-md disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm border rounded-md disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Detail({ icon, label, value, bold }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p
          className={`text-sm ${
            bold ? "font-semibold" : ""
          } text-slate-900`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
