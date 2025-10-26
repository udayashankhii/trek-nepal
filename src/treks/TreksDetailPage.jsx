
// // src/treks/trekkingpage/TreksDetailPage.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { fetchTrek, fetchSimilarTreks } from "../api/trekService.js";

// // UI Components
// import TrekAddInfo from "./trekkingpage/AdditionalInfo.jsx";
// import HeroSection from "./trekkingpage/Hero.jsx";
// import TrekHighlights from "./trekkingpage/TrekHighlights.jsx";
// import Itinerary from "./trekkingpage/Itinerary.jsx";
// import CostInclusions from "./trekkingpage/CostInclusions.jsx";
// import FAQSection from "./trekkingpage/FAQSection.jsx";
// import ElevationChart from "./trekkingpage/ElevationChart.jsx";
// import BookingCard from "./trekkingpage/BookingCard.jsx";
// import DatesAndPrice from "./trekkingpage/Datesandprice.jsx";
// import SimilarItineraries from "./trekkingpage/SimilarItenaries.jsx";
// import TrekActions from "./trekkingpage/TrekAction.jsx";
// import TrekGallery from "./trekkingpage/Gallery.jsx";
// import KeyInfo from "./trekkingpage/Info.jsx";
// import TrekOverview from "./trekkingpage/TrekOverview.jsx";
// import ReviewsSlider from "./trekkingpage/ReviewSlider.jsx";

// // Utilities
// import StickyBox from "react-sticky-box";
// import { AlertCircle, Loader2 } from "lucide-react";

// export default function TrekDetailPage() {
//   const { slug } = useParams();
//   const navigate = useNavigate();

//   // State management
//   const [trek, setTrek] = useState(null);
//   const [similarTreks, setSimilarTreks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Refs for scrolling
//   const datesRef = useRef(null);
//   const mapRef = useRef(null);
//   const reviewsRef = useRef(null);

//   // Fetch trek data
//   useEffect(() => {
//     const loadTrekData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
// const trekData = await fetchTrek(slug);
// setTrek(trekData);              // <-- Store the whole response: GOOD!

//         // Fetch similar treks
//         try {
//           const similar = await fetchSimilarTreks(slug, 3);
//           setSimilarTreks(similar);
//         } catch (similarError) {
//           console.warn("Failed to load similar treks:", similarError);
//           setSimilarTreks([]);
//         }
//       } catch (err) {
//         console.error("Error loading trek:", err);
//         setError(err.message || "Failed to load trek details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (slug) {
//       loadTrekData();
//     } else {
//       setError("No trek specified");
//       setLoading(false);
//     }
//   }, [slug]);

//   // Scroll functions
//   const scrollToDates = () => {
//     if (datesRef.current) {
//       datesRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//         inline: "nearest",
//       });
//     }
//   };

//   const scrollToMap = () => {
//     if (mapRef.current) {
//       mapRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "center",
//       });
//     }
//   };

//   const scrollToReviews = () => {
//     if (reviewsRef.current) {
//       reviewsRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   };

//   const handleViewMap = () => {
//     scrollToMap();
//   };

//   const handleBookNow = () => {
//     navigate(`/trip-booking?trip_id=${trek?.id || slug}`);
//   };

//   const handleInquiry = () => {
//     navigate(`/inquiry?trek=${slug}`);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
//           <div className="text-xl font-medium text-gray-700">
//             Loading trek details...
//           </div>
//           <div className="text-sm text-gray-500">
//             Please wait while we fetch the information
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center space-y-4 max-w-md mx-auto px-4">
//           <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
//           <div className="text-2xl font-bold text-gray-800">
//             Oops! Something went wrong
//           </div>
//           <div className="text-gray-600">{error}</div>
//           <div className="space-x-4">
//             <button
//               onClick={() => window.location.reload()}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               Try Again
//             </button>
//             <button
//               onClick={() => navigate("/treks")}
//               className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
//             >
//               Browse Treks
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Not found state
//   if (!trek) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center space-y-4 max-w-md mx-auto px-4">
//           <div className="text-6xl">🏔️</div>
//           <div className="text-2xl font-bold text-gray-800">Trek Not Found</div>
//           <div className="text-gray-600">
//             The trek you're looking for doesn't exist or has been removed.
//           </div>
//           <button
//             onClick={() => navigate("/treks")}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
//           >
//             Explore All Treks
//           </button>
//         </div>
//       </div>
//     );
//   }

//  // Safe destructure with fallbacks and key mapping from backend response (snake_case) to frontend keys (camelCase)
// const {
//   id: trekId = "",
//   name: trekName = "Unknown Trek",
//   subtitle = "",
//   hero = {},
//   highlights = [],
//   description = {},
//   itinerary = [],
//   cost = { inclusions: [], exclusions: [] },
//   faqs = [],
//   gallery = [],
//   galleryImages = [],
//   reviewsList = [],
//   elevationData = [],
//   booking = {},
//   price = {},
//   similar_treks = [],
//   activity = "",
//   group_size: groupSize = "",
//   max_altitude: maxAltitude = "",
//   pdfUrl = "",
//   mapImage = "",
//   seo = {},
//   tags = [],
//   season = "",
//   duration = "",
//   trip_grade: tripGrade = "",     // map backend's trip_grade to tripGrade
//   start_point: startPoint = "",   // map backend's start_point to startPoint
//   difficulty = "",
//   location = "",
//   rating = 0,
//   reviews: reviewsCount = 0,
//   additionalInfo = null,
//   availableDates = [],
//   overview = null,
// } = trek || {};

// // Compose keyInfoData exactly as KeyInfo component expects
// const keyInfoData = {
//   duration,
//   tripGrade,
//   startPoint,
//   groupSize,
//   maxAltitude,
//   activity,
// };


//   // Extract booking and pricing data
//   const basePrice = price?.base || booking?.basePrice || 1200; // Fallback price
//   const discount = booking?.discount || 0;
//   const originalPrice = discount > 0 ? basePrice + discount : price?.original || basePrice + 300;
//   const groups = price?.groups || booking?.groups || [
//     { size: 1, price: 1190 },
//     { size: 4, price: 1090 },
//     { size: 7, price: 1020 },
//     { size: 12, price: 990 },
//   ];

//   // Prepare gallery images with fallback
//   const images =
//     galleryImages?.length >= 5
//       ? galleryImages
//       : gallery?.length >= 5
//       ? gallery
//       : [
//           "/trekking.png",
//           "/trekkinginnepal.jpg",
//           "/Namche-Approach-From-North.webp",
//           "/moutainimage.avif",
//           "/everest.jpeg",
//         ];

//   // Generate date slots with fallbacks
//   const dateSlots = availableDates?.length > 0 
//     ? availableDates 
//     : [
//         { start: "2025-05-16", end: "2025-05-29", status: "Available", price: basePrice },
//         { start: "2025-05-23", end: "2025-06-05", status: "Available", price: basePrice },
//         { start: "2025-05-30", end: "2025-06-12", status: "Available", price: basePrice },
//         { start: "2025-06-06", end: "2025-09-19", status: "Limited", price: basePrice + 100 },
//       ];

//   const displayTitle = hero?.title || trekName || "Untitled Trek";

//   // Use similar treks from API or fallback to trek data
//   const displaySimilarTreks =
//     similarTreks?.length > 0 
//       ? similarTreks 
//       : similar_treks?.length > 0 
//       ? similar_treks.slice(0, 3) 
//       : [];

//   // Safe meta description
//   const metaDescription =
//     seo?.description || 
//     subtitle || 
//     (typeof description?.overview === "string" ? description.overview : "") ||
//     "";

//   // DEBUG: Log what's rendering
//   // console.log("Rendering sections:", {
//   //  hasOverview: overview != null,
//   //    hasHighlights: highlights?.length > 0,
//   //    hasCostInclusions: true, // Always show
//   //   hasDescription: description != null,
//   //   hasHero: true, // Always show
//   //   hasItinerary: itinerary?.length > 0,
//   //   hasFAQs: faqs?.length > 0,
//   //   hasGallery: images?.length >= 5,
//   //   hasElevation: elevationData?.length > 0,
//   //   hasDates: dateSlots?.length > 0,
//   //   hasReviews: reviewsList?.length > 0,
//   //   hasSimilar: displaySimilarTreks?.length > 0,
//   // });
//       // console.log("Summary data:", summary);




//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* SEO Meta Tags */}
//       <title>{seo?.title || `${trekName} | Nepal Trekking`}</title>
//       <meta name="description" content={metaDescription} />
//       <meta name="keywords" content={seo?.keywords?.join(", ") || tags?.join(", ") || ""} />
//       <link rel="canonical" href={seo?.canonicalUrl || `/treks/${slug}`} />

//       {/* Hero Section */}
//       <HeroSection
//         title={displayTitle}
//         subtitle={hero?.subtitle || subtitle || ""}
//         imageUrl={hero?.image || trek?.image || "/fallback.jpg"}
//         season={season}
//         duration={duration}
//         difficulty={difficulty}
//         location={location}
//         onBookNow={handleBookNow}
//         onInquiry={handleInquiry}
//       />


//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 py-10">
//         {/* Left Column - Main Content */}
//         <div className="flex-1 space-y-8">
//           {/* Key Information */}
//  {trek && (
//   <KeyInfo
//     data={keyInfoData}
//     rating={rating}
//     reviews={reviewsCount}
//   />
// )}



//           {/* Trek Overview */}
//           {overview && (
//             <section className="py-16 bg-white rounded-lg shadow-sm">
//               <div className="max-w-3xl mx-auto px-6">
//                 <TrekOverview overview={overview} />
//               </div>
//             </section>
//           )}

//           {/* Trek Highlights */}
//           {highlights?.length > 0 && (
//             <TrekHighlights highlights={highlights} />
//           )}

//           {/* Cost Inclusions - ALWAYS SHOW */}
//           <CostInclusions
//             inclusions={cost?.inclusions || []}
//             exclusions={cost?.exclusions || []}
//           />

//           {/* Itinerary */}
//           {itinerary?.length > 0 && (
//             <Itinerary itinerary={itinerary} />
//           )}

//           {/* FAQ Section - ALWAYS SHOW */}
//           <section id="faqs" className="scroll-mt-32">
//             <FAQSection faqCategories={faqs || []} />
//           </section>
//         </div>

//         {/* Right Column - Booking Card */}
//         <aside className="w-full lg:w-96">
//           <StickyBox offsetTop={200} offsetBottom={20}>
//             <BookingCard
//               trekId={trekId}
//               trekName={trekName}
//               basePrice={basePrice}
//               original={originalPrice}
//               groups={groups}
//               onCheckAvailability={scrollToDates}
//               onBookNow={handleBookNow}
//             />
//           </StickyBox>
//         </aside>
//       </div>

//       {/* Additional Info - ALWAYS SHOW */}
//       <TrekAddInfo trek={{ additionalInfo: Array.isArray(additionalInfo) ? additionalInfo : [] }} />


//       {/* Full Width Gallery - ALWAYS SHOW */}
//       <div className="py-8">
//         <TrekGallery 
//           images={images} 
//           trekName={trekName}
//           showTitle={true}
//         />
//       </div>

//       {/* Elevation Chart */}
//       {elevationData?.length > 0 && (
//         <div className="py-8 bg-white">
//           <div className="max-w-7xl mx-auto px-4">
//             <ElevationChart
//               elevationData={elevationData}
//               trekName={trekName}
//               showFullscreen={true}
//             />
//           </div>
//         </div>
//       )}

//       {/* Dates & Pricing - ALWAYS SHOW */}
//       <div className="py-8" ref={datesRef}>
//         <DatesAndPrice
//           dates={dateSlots}
//           groupPrices={groups}
//           trekName={trekName}
//           trekId={trekId}
//           onBookDate={(date) => navigate(`/trip-booking?trip_id=${trekId}&date=${date.start}`)}
//         />
//       </div>

//       {/* Trek Actions - ALWAYS SHOW */}
//       <div className="py-4" ref={mapRef}>
//         <TrekActions
//           trekId={trekId}
//           pdfUrl={pdfUrl || ""}
//           mapImage={mapImage || ""}
//           onViewMap={handleViewMap}
//         />
//       </div>

//       {/* Reviews Section - ALWAYS SHOW */}
//       <div ref={reviewsRef} className="py-8 bg-gray-100">
//         <div className="max-w-7xl mx-auto px-4">
//           <ReviewsSlider
//             reviews={reviewsList?.length > 0 ? reviewsList : []}
//             trekName={trekName}
//             averageRating={rating || 4.8}
//             totalReviews={reviewsCount || 0}
//             autoPlay={true}
//             showStats={true}
//           />
//         </div>
//       </div>

//       {/* Similar Itineraries - ALWAYS SHOW */}
//       <div className="py-8">
//         <SimilarItineraries
//           treks={displaySimilarTreks}
//           title="Similar Treks You Might Like"
//           subtitle={`Discover more amazing treks in ${trek.region || 'Nepal'}`}
//           exploreLink="/treks"
//           currentTrekId={trekId}
//           maxItems={3}
//           showHeader={true}
//         />
//       </div>

//       {/* Back to Top Button */}
//     
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTrek, fetchSimilarTreks } from "../api/trekService.js";

// UI Components (as before)
import TrekAddInfo from "./trekkingpage/AdditionalInfo.jsx";
import HeroSection from "./trekkingpage/Hero.jsx";
import TrekHighlights from "./trekkingpage/TrekHighlights.jsx";
import Itinerary from "./trekkingpage/Itinerary.jsx";
import CostInclusions from "./trekkingpage/CostInclusions.jsx";
import FAQSection from "./trekkingpage/FAQSection.jsx";
import ElevationChart from "./trekkingpage/ElevationChart.jsx";
import BookingCard from "./trekkingpage/BookingCard.jsx";
import DatesAndPrice from "./trekkingpage/Datesandprice.jsx";
import SimilarItineraries from "./trekkingpage/SimilarItenaries.jsx";
import TrekActions from "./trekkingpage/TrekAction.jsx";
import TrekGallery from "./trekkingpage/Gallery.jsx";
import KeyInfo from "./trekkingpage/Info.jsx";
import TrekOverview from "./trekkingpage/TrekOverview.jsx";
import ReviewsSlider from "./trekkingpage/ReviewSlider.jsx";

import StickyBox from "react-sticky-box";
import { AlertCircle, Loader2 } from "lucide-react";

export default function TrekDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // State management
  const [trek, setTrek] = useState(null);
  const [similarTreks, setSimilarTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for scrolling
  const datesRef = useRef(null);
  const mapRef = useRef(null);
  const reviewsRef = useRef(null);

  // Fetch trek data
  useEffect(() => {
    const loadTrekData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch main trek data
        const trekData = await fetchTrek(slug);
        setTrek(trekData);

        // Fetch similar treks
        try {
          const similar = await fetchSimilarTreks(slug, 3);
          setSimilarTreks(similar);
        } catch (similarError) {
          console.warn("Failed to load similar treks:", similarError);
          setSimilarTreks([]);
        }
      } catch (err) {
        console.error("Error loading trek:", err);
        setError(err.message || "Failed to load trek details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadTrekData();
    } else {
      setError("No trek specified");
      setLoading(false);
    }
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <div className="text-xl font-medium text-gray-700">
            Loading trek details...
          </div>
          <div className="text-sm text-gray-500">
            Please wait while we fetch the information
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <div className="text-2xl font-bold text-gray-800">
            Oops! Something went wrong
          </div>
          <div className="text-gray-600">{error}</div>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/treks")}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Browse Treks
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!trek) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <div className="text-6xl">🏔️</div>
          <div className="text-2xl font-bold text-gray-800">Trek Not Found</div>
          <div className="text-gray-600">
            The trek you're looking for doesn't exist or has been removed.
          </div>
          <button
            onClick={() => navigate("/treks")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Explore All Treks
          </button>
        </div>
      </div>
    );
  }

  // Destructure correct fields from backend:
  const {
    trek: trekInfo = {},
    hero = {},
    overview = null,
    itinerary = [],
    highlights = [],
    cost = { inclusions: [], exclusions: [] },
    faq_categories: faqs = [],
    gallery = [],
    elevation_chart: elevationData = [],
    booking_card: booking = {},
    additional_info: additionalInfo = [],
    similar = [],
    // Optional: cost_dates, actions, etc.
  } = trek || {};

  // For Key Info
  const {
    public_id: trekId = "",
    title: trekName = "",
    duration = "",
    trip_grade: tripGrade = "",
    start_point: startPoint = "",
    group_size: groupSize = "",
    max_altitude: maxAltitude = "",
    activity = "",
    rating = 0,
    reviews: reviewsCount = 0,
  } = trekInfo || {};

  const keyInfoData = {
    duration,
    tripGrade,
    startPoint,
    groupSize,
    maxAltitude,
    activity,
  };

  // Gallery images
  const images = gallery;

  // Booking/pricing
  const basePrice = booking?.base_price ? parseFloat(booking.base_price) : 1200;
  const originalPrice = booking?.original_price
    ? parseFloat(booking.original_price)
    : basePrice + 300;
  const groups = (booking?.group_prices || []).map(gp => ({
    size: gp.max_size || 1,
    price: gp.price,
  }));

  // Similar treks (API or fallback)
  const displaySimilarTreks = similarTreks.length > 0 ? similarTreks : similar.slice(0, 3);

  // Meta/SEO
  const displayTitle = hero?.title || trekName;
  const metaDescription =
    hero?.subtitle || overview?.sections?.[0]?.articles?.description || "";

  // Main render
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* SEO Meta Tags */}
      <title>{displayTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Hero Section */}
      <HeroSection
        title={displayTitle}
        subtitle={hero?.subtitle}
        imageUrl={hero?.imageUrl}
        season={hero?.season}
        duration={hero?.duration}
        difficulty={hero?.difficulty}
        location={hero?.location}
        onBookNow={() => navigate(`/trip-booking?trip_id=${trekId || slug}`)}
        onInquiry={() => navigate(`/inquiry?trek=${slug}`)}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 py-10">
        {/* Left Column - Main Content */}
        <div className="flex-1 space-y-8">
          <KeyInfo
            data={keyInfoData}
            rating={rating}
            reviews={reviewsCount}
          />

          {overview && (
            <section className="py-16 bg-white rounded-lg shadow-sm">
              <div className="max-w-3xl mx-auto px-6">
                <TrekOverview overview={overview} />
              </div>
            </section>
          )}

          {highlights.length > 0 && (
            <TrekHighlights highlights={highlights} />
          )}

          <CostInclusions
            inclusions={cost?.inclusions || []}
            exclusions={cost?.exclusions || []}
          />

          {itinerary.length > 0 && (
            <Itinerary itinerary={itinerary} />
          )}

          <section id="faqs" className="scroll-mt-32">
            <FAQSection faqCategories={faqs} />
          </section>
        </div>

        {/* Right Column - Booking Card */}
        <aside className="w-full lg:w-96">
          <StickyBox offsetTop={200} offsetBottom={20}>
            <BookingCard
              trekId={trekId}
              trekName={trekName}
              basePrice={basePrice}
              original={originalPrice}
              groups={groups}
              onCheckAvailability={() =>
                datesRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              onBookNow={() =>
                navigate(`/trip-booking?trip_id=${trekId || slug}`)
              }
            />
          </StickyBox>
        </aside>
      </div>

      {/* Additional Info */}
      <TrekAddInfo trek={{ additionalInfo: Array.isArray(additionalInfo) ? additionalInfo : [] }} />

      {/* Full Width Gallery */}
      <div className="py-8">
        <TrekGallery
          images={images}
          trekName={trekName}
          showTitle={true}
        />
      </div>

      {/* Elevation Chart */}
      {Array.isArray(elevationData) && elevationData.length > 0 && (
        <div className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <ElevationChart
              elevationData={elevationData}
              trekName={trekName}
              showFullscreen={true}
            />
          </div>
        </div>
      )}

      {/* Similar Itineraries */}
      <div className="py-8">
        <SimilarItineraries
          treks={displaySimilarTreks}
          title="Similar Treks You Might Like"
          subtitle={`Discover more amazing treks in ${trekInfo?.region_name || 'Nepal'}`}
          exploreLink="/treks"
          currentTrekId={trekId}
          maxItems={3}
          showHeader={true}
        />
      </div>

      {/* Back to Top Button */}
     
    </div>
  );
}
