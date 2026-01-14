// src/pages/TrekDetailPage.jsx
import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  fetchTrek, 
  fetchSimilarTreks, 
  fetchTrekReviews, 
  fetchTrekBookingCard,
  fetchTrekElevationChart 
} from "../api/trekService.js";
import { loadGoogleMaps } from "../utils/mapHelpers.js";

import TrekAddInfo from "./trekkingpage/AdditionalInfo.jsx";
import HeroSection from "./trekkingpage/Hero.jsx";
import TrekHighlights from "./trekkingpage/TrekHighlights.jsx";
import Itinerary from "./trekkingpage/Itinerary.jsx";
import CostInclusions from "./trekkingpage/CostInclusions.jsx";
import FAQSection from "./trekkingpage/FAQSection.jsx";
import ElevationChart from "./trekkingpage/ElevationChart.jsx";
import BookingCard from "./trekkingpage/BookingCard.jsx";
import DatesAndPrice from "./trekkingpage/Datesandprice.jsx";
import SimilarTreks from "./trekkingpage/SimilarTreks.jsx";
import TrekActions from "./trekkingpage/TrekAction.jsx";
import TrekGallery from "./trekkingpage/Gallery.jsx";
import KeyInfo from "./trekkingpage/KeyInfo.jsx";
import TrekOverview from "./trekkingpage/TrekOverview.jsx";
import ReviewsSlider from "./trekkingpage/ReviewSlider.jsx";

import StickyBox from "react-sticky-box";
import { Loader2 } from "lucide-react";
import TrekErrorPage from "./TrekErrorPage.jsx";

// ✅ Lazy load map component
const TrekRouteMap = lazy(() => import("./trekkingpage/map/TrekRouteMap.jsx"));

// ✅ Map loading component
function MapLoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg w-full">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-600 font-medium">Loading interactive map...</p>
      <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
    </div>
  );
}

// ✅ EXPORT NOTIFICATION TOAST
function ExportNotification({ message, type = "success" }) {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-out`}>
      <span className="text-lg">{type === "success" ? "✓" : "✗"}</span>
      <span>{message}</span>
    </div>
  );
}

export default function TrekDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [trek, setTrek] = useState(null);
  const [similarTreks, setSimilarTreks] = useState([]);
  const [trekReviews, setTrekReviews] = useState([]);
  const [bookingCardData, setBookingCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [exportNotification, setExportNotification] = useState(null); // ✅ NEW

  const datesRef = useRef(null);
  const mapRef = useRef(null);
  const reviewsRef = useRef(null);

  const trekName =
    trek?.hero?.title || trek?.trek?.title || trek?.title || "Trek Detail";

  useEffect(() => {
    if (trekName && trekName !== "Trek Detail") {
      document.title = `${trekName} | Nepal Trekking`;
    }
  }, [trekName]);

  // ✅ Preload Google Maps when user clicks "View Map"
  useEffect(() => {
    if (showMap && !mapReady) {
      loadGoogleMaps()
        .then(() => {
          setMapReady(true);
          console.log("✅ Google Maps loaded successfully");
        })
        .catch(err => {
          console.error("❌ Google Maps load failed:", err);
          setMapReady(false);
        });
    }
  }, [showMap, mapReady]);

  useEffect(() => {
    const loadTrekData = async () => {
      try {
        setLoading(true);
        setError(null);

        const trekData = await fetchTrek(slug);
        const elevationChartData = await fetchTrekElevationChart(slug);
        const similar = await fetchSimilarTreks(slug, 3);
        const reviewsData = await fetchTrekReviews(slug);
        const bookingCard = await fetchTrekBookingCard(slug);

        setTrek({ ...trekData, elevation_chart: elevationChartData });
        setSimilarTreks(similar);
        setTrekReviews(reviewsData?.results || []);
        setBookingCardData(bookingCard);
      } catch (err) {
        setError(err.message || "Failed to load trek details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadTrekData();
  }, [slug]);



   useEffect(() => {
    loadGoogleMaps()
      .then(() => {
        console.log("✅ Google Maps loaded successfully");
      })
      .catch(err => {
        console.error("❌ Google Maps load failed:", err);
      });
  }, []);
  const handleBookNow = () => navigate(`/trek-booking?trek_slug=${slug}`);
  
  const scrollToDates = () =>
    datesRef.current?.scrollIntoView({ behavior: "smooth" });
  
  const scrollToMap = () =>
    mapRef.current?.scrollIntoView({ behavior: "smooth" });
  
  const scrollToReviews = () =>
    reviewsRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (showMap) {
      setTimeout(() => scrollToMap(), 300);
    }
  }, [showMap]);

  const handleViewMap = () => {
    setShowMap((prev) => !prev);
  };

  // ✅ NEW: Handle export completion with notification
  const handleExportComplete = (result) => {
    setExportNotification({
      message: result.message,
      type: result.success ? "success" : "error",
    });
    setTimeout(() => setExportNotification(null), 4000);
  };

  // ✅ Auto-hide notification after 4 seconds
  useEffect(() => {
    if (exportNotification) {
      const timer = setTimeout(
        () => setExportNotification(null),
        4000
      );
      return () => clearTimeout(timer);
    }
  }, [exportNotification]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading trek details...</p>
        </div>
      </div>
    );
  }

  if (error || !trek) {
    return <TrekErrorPage error={error} />;
  }

  // Flatten API shape
  const flat = {
    ...trek,
    ...(trek.trek || {}),
    hero: trek.hero || {},
    overview_sections: (trek.overview?.sections || []).map((section) => ({
      ...section,
      articles: section.articles || {},
      bullets: section.bullets || [],
    })),
    itinerary: trek.itinerary || [],
    highlights: trek.highlights || [],
    cost: trek.cost || { inclusions: [], exclusions: [] },
    booking_card: trek.booking_card || {},
    gallery: trek.gallery || [],
    similar: trek.similar || [],
  };

  const {
    region_name: region = "",
    activity = "",
    group_size: groupSize = "",
    duration = "",
    trek_grade: trekGrade = "",
    trip_grade: tripGrade = "", // ✅ Handle both cases
    start_point: startPoint = "",
    max_altitude: maxAltitude = "",
    rating = 4.8,
    reviews = [],
    hero,
    itinerary,
    highlights: trekHighlights = [],
    cost,
    booking_card: bookingCard,
    gallery,
    similar,
  } = flat;

  const keyInfoData = {
    duration: duration || trek.trek?.duration,
    difficulty: hero.difficulty || tripGrade || trekGrade || "Moderate",
    startPoint: startPoint || flat.start_point || trek.trek?.start_point,
    groupSize: groupSize || flat.group_size || trek.trek?.group_size,
    maxAltitude: maxAltitude || flat.max_altitude || trek.trek?.max_altitude,
    activity: activity || trek.trek?.activity,
  };

  const costDateApi = trek.cost_date_api_response || {};

  const departures = (costDateApi.departures_by_month || []).flatMap((month) =>
    (month.departures || []).map((dep) => ({
      ...dep,
      start: dep.start,
      end: dep.end,
      status: dep.status,
      price: Number(dep.price),
      id: dep.id,
      seats_left: dep.seats_left,
    }))
  );

  const groupPrices = (
    costDateApi.groupPrices || bookingCard.group_prices || []
  ).map((gp) => ({
    ...gp,
    label:
      gp.label ||
      (gp.min_size && gp.max_size
        ? `${gp.min_size}–${gp.max_size} pax`
        : `${gp.size || 1} Person`),
    price: Number(gp.price),
    size: gp.max_size || gp.size || 1,
  }));

  const dateHighlights = (costDateApi.highlights || [])
    .map((h) => h.highlight)
    .filter(Boolean);

  const infoSections = trek.additional_info || [];
  const actionData = trek.actions || {};

  const fallbackElevationData = [
    { day: 1, title: "Trek Start", elevation: 1400, description: "Beginning" },
    { day: 2, title: "Mid Trek", elevation: 2800, description: "Ascending" },
    { day: 3, title: "High Point", elevation: 4200, description: "Peak" },
    { day: 4, title: "Trek End", elevation: 1400, description: "Descending" },
  ];

  const hasElevationData =
    trek.elevation_chart &&
    Array.isArray(trek.elevation_chart.points) &&
    trek.elevation_chart.points.length > 0;

  const routeGeojsonBySlug = {
    "annapurna-base-camp-trek": "/routes/annapurna-base-camp.geojson",
  };
  const routeGeojsonUrl = actionData.routeGeojson || routeGeojsonBySlug[slug];

  // ✅ NEW: Prepare trek metadata for export
  const trekMetadata = {
    title: trekName,
    slug,
    region: flat.region || region,
    region_name: region,
    duration: duration,
    trip_grade: tripGrade || trekGrade,
    max_altitude: maxAltitude,
    start_point: startPoint,
    rating,
    reviews: reviews.length,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <HeroSection
        title={hero.title || trekName}
        subtitle={hero.subtitle}
        imageUrl={hero.imageUrl || flat.card_image_url || "/fallback.jpg"}
        season={hero.season}
        duration={hero.duration || duration}
        difficulty={hero.difficulty}
        location={hero.location}
        ctaLabel={hero.cta_label}
        onBookNow={hero.cta_link ? () => navigate(hero.cta_link) : handleBookNow}
        onInquiry={() => navigate(`/contact-us`)}
      />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 py-10">
        <div className="flex-1 space-y-8">
          <KeyInfo
            data={keyInfoData}
            rating={rating}
            reviews={reviews}
            reviewText={flat.review_text}
          />

          {flat.overview && (
            <section className="py-10 bg-white rounded-lg shadow-sm">
              <TrekOverview overview={flat.overview} />
            </section>
          )}

          {trekHighlights.length > 0 && (
            <TrekHighlights highlights={trekHighlights} />
          )}

          <CostInclusions
            inclusions={cost.inclusions}
            exclusions={cost.exclusions}
            title="Cost Details"
            inclusionsTitle="Includes"
            exclusionsTitle="Excludes"
          />

          <Itinerary itinerary={flat.itinerary} />
          <FAQSection faqCategories={trek.faq_categories || []} />
        </div>

        <aside className="w-full lg:w-96">
          <StickyBox offsetTop={200} offsetBottom={20}>
            <BookingCard
              trekSlug={slug}
              trekName={trekName}
              basePrice={parseFloat(bookingCardData?.base_price || bookingCard.base_price) || 0}
              original={parseFloat(bookingCardData?.original_price || bookingCard.original_price) || 0}
              groups={bookingCardData?.group_prices || groupPrices}
              badgeLabel={bookingCardData?.badge_label || bookingCard.badge_label}
              securePayment={bookingCardData?.secure_payment ?? bookingCard.secure_payment}
              noHiddenFees={bookingCardData?.no_hidden_fees ?? bookingCard.no_hidden_fees}
              freeCancellation={bookingCardData?.free_cancellation ?? bookingCard.free_cancellation}
              support247={bookingCardData?.support_24_7 ?? bookingCard.support_24_7}
              trustedReviews={bookingCardData?.trusted_reviews ?? bookingCard.trusted_reviews}
              onCheckAvailability={scrollToDates}
              onBookNow={handleBookNow}
            />
          </StickyBox>
        </aside>
      </div>

      <TrekAddInfo sections={infoSections} />

      <div className="py-8">
        <TrekGallery images={gallery} trekName={trekName} showTitle minImages={1} />
      </div>

      <ElevationChart
        elevationData={hasElevationData ? trek.elevation_chart.points : fallbackElevationData}
        title={hasElevationData ? trek.elevation_chart.title : "Elevation Profile"}
        subtitle={hasElevationData ? trek.elevation_chart.subtitle : "Trek elevation overview"}
        trekName={trekName}
        showFullscreen
      />

      <div className="py-8" ref={datesRef}>
        <DatesAndPrice
          dates={departures}
          groupPrices={groupPrices}
          highlights={dateHighlights}
          trekName={trekName}
          trekId={slug}
          onBookDate={(date) => navigate(`/trek-booking?trek_slug=${slug}&date=${date.start}`)}
        />
      </div>

      {/* ✅ OPTIMIZED MAP SECTION WITH EXPORT */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Updated TrekActions - no toggle button */}
          <TrekActions
            trekId={flat.public_id}
            pdfUrl={actionData.pdfUrl || trek.pdfUrl}
          />
          
          {/* Always show map */}
          <div ref={mapRef} className="mt-12">
            <Suspense fallback={<MapLoadingSpinner />}>
              <TrekRouteMap
                itinerary={flat.itinerary}
                trekName={trekName}
                trekMetadata={trekMetadata}
                fallbackMapImage={actionData.mapImage || trek.mapImage}
                routeGeojsonUrl={routeGeojsonUrl}
                onExportComplete={handleExportComplete}
              />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="py-8 bg-gray-100" ref={reviewsRef}>
        <ReviewsSlider
          reviews={trekReviews.length > 0 ? trekReviews : reviews}
          trekName={trekName}
          averageRating={rating}
          totalReviews={trekReviews.length > 0 ? trekReviews.length : reviews.length}
          autoPlay
          showStats
        />
      </div>

      <div className="py-8">
        <SimilarTreks
          treks={similarTreks.length > 0 ? similarTreks : similar}
          title="Similar Treks You Might Like"
          subtitle={`Discover more amazing treks in ${region}`}
          exploreLink="/treks"
          currentTrekId={flat.public_id}
          maxItems={3}
          showHeader
        />
      </div>

      {/* ✅ NEW: Export notification */}
      {exportNotification && (
        <ExportNotification 
          message={exportNotification.message}
          type={exportNotification.type}
        />
      )}
    </div>
  );
}



