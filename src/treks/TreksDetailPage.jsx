




import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTrek, fetchSimilarTreks } from "../api/trekService.js";

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


  const [trek, setTrek] = useState(null);
  const [similarTreks, setSimilarTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const datesRef = useRef(null);
  const mapRef = useRef(null);
  const reviewsRef = useRef(null);



const trekName =
  trek?.hero?.title ||
  trek?.trek?.title ||
  trek?.title ;

  useEffect(() => {
  if (trekName && trekName !== "Trek Detail") {
    document.title = `${trekName} | Nepal Trekking`;
  } 
}, [trekName]);

  useEffect(() => {
    const loadTrekData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTrek(slug);
        setTrek(data);
        const similar = await fetchSimilarTreks(slug, 3);
        setSimilarTreks(similar);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load trek details");
      } finally {
        setLoading(false);
      }
    };
    if (slug) loadTrekData();
  }, [slug]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !trek) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center space-y-4 max-w-md mx-auto px-4">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
        <div className="text-2xl font-bold text-gray-800">{error || "Trek not found."}</div>
        <button
          onClick={() => navigate("/treks")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Back to Treks
        </button>
      </div>
    );
  }

  // Flatten and extract data safely from nested structure
  const flat = {
    ...trek,
    ...(trek.trek || {}),
    hero: trek.hero || {},
    overview_sections: (trek.overview?.sections || []).map(section => ({
      ...section,
      articles: section.articles || {},
      bullets: section.bullets || []
    })),
    itinerary: trek.itinerary || [],
    highlights: trek.highlights || [],
    cost: trek.cost || { inclusions: [], exclusions: [] },
    booking_card: trek.booking_card || {},
    gallery: trek.gallery || [],
    additional_info_articles: (trek.additional_info || []).flatMap(info => info.articles?.articles || []),
    additional_info_bullets: (trek.additional_info || []).flatMap(info => info.bullets || []),
    similar: trek.similar || []
  };

  // Destructure for ease of use
  const {
    region_name: region = "Nepal",
    activity = "",
    group_size: groupSize = "",
    duration = "",
    trek_grade: trekGrade = "",
    start_point: startPoint = "",
    max_altitude: maxAltitude = "",
    rating = 4.8,
    reviews = [],
    hero,
    overview_sections,
    itinerary,
    highlights,
    cost,
    booking_card: bookingCard,
    gallery,
    additional_info_articles,
    additional_info_bullets,
    similar
  } = flat;


  // Key info for summary component
  const keyInfoData = { duration, trekGrade, startPoint, groupSize, maxAltitude, activity };

  // Prepare group pricing from API booking_card, fallback if missing
  const groups =
    bookingCard.group_prices && bookingCard.group_prices.length > 0
      ? bookingCard.group_prices.map((g) => ({
          min_size: g.min_size,
          max_size: g.max_size,
          price: parseFloat(g.price),
        }))
      : [
          { min_size: 1, max_size: 3, price: parseFloat(bookingCard.base_price)  },
          { min_size: 4, max_size: 25, price: parseFloat(bookingCard.base_price)  },
        ];

  // Generate date slots fallback
  const dateSlots =
    trek.cost_dates?.length > 0
      ? trek.cost_dates
      : [
          {
            start: "2025-10-16",
            end: "2026-05-29",
            status: "Available",
            price: parseFloat(bookingCard.base_price) || 1600,
          },
        ];

  // Handlers for navigation and scroll
  const handleBookNow = () => navigate(`/trek-booking?trek_id=${flat.public_id}`);
  const scrollToDates = () => datesRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToMap = () => mapRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToReviews = () => reviewsRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section */}
      <HeroSection
        title={hero.title || trekName}
        subtitle={hero.subtitle}
        imageUrl={hero.imageUrl || flat.card_image_url || "/fallback.jpg"}
        season={hero.season}
        duration={duration}
        difficulty={hero.difficulty}
        location={hero.location}
        onBookNow={handleBookNow}
        onInquiry={() => navigate(`/inquiry?trek=${slug}`)}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 py-10">
        {/* Left Column */}
        <div className="flex-1 space-y-8">
          <KeyInfo data={keyInfoData} rating={rating} reviews={reviews.length} />

          {flat.overview && (
            <section className="py-10 bg-white rounded-lg shadow-sm">
              <TrekOverview overview={flat.overview} />
            </section>
          )}

          {highlights.length > 0 && <TrekHighlights highlights={highlights} />}

          <CostInclusions inclusions={cost.inclusions || []} exclusions={cost.exclusions || []} />

          {itinerary.length > 0 && <Itinerary itinerary={itinerary} />}

          <FAQSection faqCategories={trek.faq_categories || []} />
        </div>

        {/* Right Column */}
   <aside className="w-full lg:w-96">
  <StickyBox offsetTop={200} offsetBottom={20}>
  <BookingCard
    trekId={flat.public_id}
  trekName={trekName}
  basePrice={parseFloat(bookingCard.base_price) || 1600}
  original={parseFloat(bookingCard.original_price) || 1400}
  groups={groups}
  onCheckAvailability={scrollToDates}
  onBookNow={() => navigate(`/trek-booking?trek_id=${flat.public_id}`)} // Dynamic navigation here
/>

  </StickyBox>
</aside>

      </div>

      {/* Additional Info Section */}
      <TrekAddInfo articles={additional_info_articles} bullets={additional_info_bullets} />

      {/* Gallery */}
      {/* {gallery.length > 0 && ( */}
         <div className="py-8"> 
        {/* //   <TrekGallery images={gallery} trekName={trekName} showTitle /> */}
         <TrekGallery images={gallery} trekName={trekName} showTitle minImages={1} />
         </div> 

{/* <TrekGallery gallery={gallery} trekName={trekName} showTitle minImages={1} /> */}


      {/* Elevation Chart */}
      {trek.elevation_chart && (
        <div className="py-8 bg-white">
          <ElevationChart elevationData={trek.elevation_chart} trekName={trekName} showFullscreen />
        </div>
      )}

      {/* Dates & Pricing */}
      <div className="py-8" ref={datesRef}>
        <DatesAndPrice
          dates={dateSlots}
          groupPrices={groups}
          trekName={trekName}
          trekId={flat.public_id}
          onBookDate={(date) => navigate(`/trek-booking?trek_id=${flat.public_id}&date=${date.start}`)}
        />
      </div>

      {/* Trek Actions (Map / PDF) */}
      <div className="py-4" ref={mapRef}>
        <TrekActions
          trekId={flat.public_id}
          pdfUrl={trek.pdfUrl}
          mapImage={trek.mapImage}
          onViewMap={scrollToMap}
        />
      </div>

      {/* Reviews */}
      <div className="py-8 bg-gray-100" ref={reviewsRef}>
        <ReviewsSlider
          reviews={reviews}
          trekName={trekName}
          averageRating={rating}
          totalReviews={reviews.length}
          autoPlay
          showStats
        />
      </div>

      {/* Similar Treks */}
      <div className="py-8">
        <SimilarItineraries
          treks={similar}
          title="Similar Treks You Might Like"
          subtitle={`Discover more amazing treks in ${region}`}
          exploreLink="/treks"
          currentTrekId={flat.public_id}
          maxItems={3}
          showHeader
        />
      </div>
    </div>
  );
}
