// src/pages/TrekDetailPage.jsx
import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchTrek,
  fetchSimilarTreks,
  fetchTrekReviews,
  fetchTrekBookingCard,
  fetchTrekElevationChart,
  fetchTrekCostAndDates
} from "../api/service/trekService.js";
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

// ✅ Export notification toast
function ExportNotification({ message, type = "success" }) {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-out z-50`}>
      <span className="text-lg">{type === "success" ? "✓" : "✗"}</span>
      <span>{message}</span>
    </div>
  );
}

/**
 * ✅ Transform itinerary_days altitude data to elevation chart format
 * Converts "1,337m" string → 1337 number
 * Handles various altitude formats and extracts numeric elevation
 */
function transformItineraryToElevation(itineraryDays) {
  if (!Array.isArray(itineraryDays) || itineraryDays.length === 0) {
    return [];
  }

  return itineraryDays.map((day) => {
    // Parse altitude string: "1,337m" or "3,870m" → 1337 or 3870
    const altitudeStr = day.altitude || "0m";
    const elevation = parseInt(
      altitudeStr.replace(/,/g, "").replace(/m/g, "").trim(),
      10
    ) || 0;

    return {
      day: day.day,
      title: day.title || `Day ${day.day}`,
      elevation: elevation, // Now a number
      description: day.description ? day.description.substring(0, 150) : "",
    };
  });
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
  const [exportNotification, setExportNotification] = useState(null);

  const datesRef = useRef(null);
  const mapRef = useRef(null);
  const reviewsRef = useRef(null);

  const trekName =
    trek?.hero?.title || trek?.trek?.title || trek?.title || "Trek Detail";

  // Update document title
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
        })
        .catch((err) => {
          console.error("Failed to load Google Maps:", err);
          setMapReady(false);
        });
    }
  }, [showMap, mapReady]);

  // ✅ UPDATED: Fetch all trek data and transform elevation data
  useEffect(() => {
    const loadTrekData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Fetch all data in parallel
        const [
          trekData,
          elevationChartData,
          similarData,
          reviewsData,
          bookingCardResult,
          costDatesData,
        ] = await Promise.allSettled([
          fetchTrek(slug),
          fetchTrekElevationChart(slug),
          fetchSimilarTreks(slug, 3),
          fetchTrekReviews(slug),
          fetchTrekBookingCard(slug),
          fetchTrekCostAndDates(slug),
        ]);

        // Extract fulfilled values
        const trekResult = trekData.status === "fulfilled" ? trekData.value : null;
        const apiElevationChart = elevationChartData.status === "fulfilled" ? elevationChartData.value : null;
        const similar = similarData.status === "fulfilled" ? similarData.value : [];
        const reviews = reviewsData.status === "fulfilled" ? reviewsData.value : { results: [] };
        const bookingCard = bookingCardResult.status === "fulfilled" ? bookingCardResult.value : null;
        const costDates = costDatesData.status === "fulfilled" ? costDatesData.value : null;

        if (!trekResult) {
          throw new Error("Trek not found");
        }

        // ✅ PRIORITY 1: Use API elevation chart if available
        let elevationChart = apiElevationChart;

        // ✅ PRIORITY 2: Transform itinerary_days if API chart doesn't exist or is empty
        if (!elevationChart || !elevationChart.points || elevationChart.points.length === 0) {
          const itineraryData = trekResult.itinerary_days || trekResult.itinerary || [];
          const elevationPoints = transformItineraryToElevation(itineraryData);

          if (elevationPoints.length > 0) {
            elevationChart = {
              title: `${trekResult.title || trekResult.trek?.title || "Trek"} - Elevation Profile`,
              subtitle: "Daily altitude changes throughout your trek",
              points: elevationPoints,
            };
            console.log("✅ Elevation chart created from itinerary_days:", elevationPoints.length, "points");
          } else {
            console.warn("⚠️ No elevation data available from API or itinerary");
          }
        } else {
          console.log("✅ Using API elevation chart:", apiElevationChart.points?.length, "points");
        }

        // ✅ Merge all data into trek object
        setTrek({
          ...trekResult,
          elevation_chart: elevationChart,
          cost_dates_data: costDates,
        });
        setSimilarTreks(similar);
        setTrekReviews(reviews?.results || []);
        setBookingCardData(bookingCard);
      } catch (err) {
        console.error("Error loading trek data:", err);
        setError(err.message || "Failed to load trek details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadTrekData();
  }, [slug]);

  // Preload Google Maps in background
  useEffect(() => {
    loadGoogleMaps().catch((err) => {
      console.warn("Background Google Maps preload failed:", err);
    });
  }, []);

  const handleBookNow = () => navigate(`/trek-booking?trekSlug=${slug}`);

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

  // ✅ Handle export completion with notification
  const handleExportComplete = (result) => {
    setExportNotification({
      message: result.message,
      type: result.success ? "success" : "error",
    });
  };

  // ✅ Auto-hide notification after 4 seconds
  useEffect(() => {
    if (exportNotification) {
      const timer = setTimeout(() => setExportNotification(null), 4000);
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
    itinerary: trek.itinerary || trek.itinerary_days || [],
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
    trip_grade: tripGrade = "",
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

  // ✅ CORRECTED: Extract cost and dates data
  const costDatesData = trek.cost_dates_data || trek.cost_dates || {};

  // ✅ 1. FLATTEN departures_by_month structure
  let rawDepartures = [];
  if (costDatesData.departures_by_month && Array.isArray(costDatesData.departures_by_month)) {
    rawDepartures = costDatesData.departures_by_month.flatMap(monthGroup => 
      Array.isArray(monthGroup.departures) ? monthGroup.departures : []
    );
  } else if (costDatesData.departures && Array.isArray(costDatesData.departures)) {
    rawDepartures = costDatesData.departures;
  } else if (trek.departures && Array.isArray(trek.departures)) {
    rawDepartures = trek.departures;
  }

  const departures = rawDepartures.map((dep) => ({
    start: dep.start || dep.start_date,
    end: dep.end || dep.end_date,
    status: dep.status || "Available",
    price: Number(dep.price || dep.base_price || 0),
    id: dep.id || `${dep.start}-${dep.end}`,
    seats_left: dep.seats_left || null,
  }));

  // ✅ 2. HANDLE both camelCase and snake_case for groupPrices
  let rawGroupPrices = [];
  if (costDatesData.group_prices && Array.isArray(costDatesData.group_prices)) {
    rawGroupPrices = costDatesData.group_prices;
  } else if (costDatesData.groupPrices && Array.isArray(costDatesData.groupPrices)) {
    rawGroupPrices = costDatesData.groupPrices;
  } else if (bookingCard.group_prices && Array.isArray(bookingCard.group_prices)) {
    rawGroupPrices = bookingCard.group_prices;
  }

  const groupPrices = rawGroupPrices.map((gp) => {
    const price = typeof gp.price === "string" ? parseFloat(gp.price) : Number(gp.price || 0);
    return {
      label: gp.label || (gp.min_size && gp.max_size ? `${gp.min_size}–${gp.max_size} pax` : `${gp.size || 1} Person`),
      price: price,
      size: gp.max_size || gp.size || gp.min_size || 1,
    };
  });

  // ✅ 3. EXTRACT highlights
  let dateHighlights = [];
  if (costDatesData.highlights && Array.isArray(costDatesData.highlights)) {
    dateHighlights = costDatesData.highlights.map(h => 
      typeof h === "string" ? h : (h.highlight || h.text || "")
    ).filter(Boolean);
  } else if (trek.date_highlights && Array.isArray(trek.date_highlights)) {
    dateHighlights = trek.date_highlights;
  }

  const infoSections = trek.additional_info || [];
  const actionData = trek.actions || {};

  // ✅ UPDATED: Check for elevation data properly
  const elevationChartData = trek.elevation_chart?.points || [];
  const hasElevationData = Array.isArray(elevationChartData) && elevationChartData.length > 0;

  const routeGeojsonBySlug = {
    "annapurna-base-camp-trek": "/routes/annapurna-base-camp.geojson",
  };
  const routeGeojsonUrl = actionData.routeGeojson || routeGeojsonBySlug[slug];

  // ✅ Prepare trek metadata for export
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
              basePrice={
                parseFloat(
                  bookingCardData?.base_price || bookingCard.base_price
                ) || 0
              }
              original={
                parseFloat(
                  bookingCardData?.original_price || bookingCard.original_price
                ) || 0
              }
              groups={
                bookingCardData?.group_prices || bookingCard.group_prices || []
              }
              badgeLabel={
                bookingCardData?.badge_label || bookingCard.badge_label
              }
              securePayment={
                bookingCardData?.secure_payment ?? bookingCard.secure_payment
              }
              noHiddenFees={
                bookingCardData?.no_hidden_fees ?? bookingCard.no_hidden_fees
              }
              freeCancellation={
                bookingCardData?.free_cancellation ??
                bookingCard.free_cancellation
              }
              support247={
                bookingCardData?.support_24_7 ?? bookingCard.support_24_7
              }
              trustedReviews={
                bookingCardData?.trusted_reviews ?? bookingCard.trusted_reviews
              }
              onCheckAvailability={scrollToDates}
              onBookNow={handleBookNow}
            />
          </StickyBox>
        </aside>
      </div>

      <TrekAddInfo sections={infoSections} />

      <div className="py-8">
        <TrekGallery
          images={gallery}
          trekName={trekName}
          showTitle
          minImages={1}
        />
      </div>

      {/* ✅ UPDATED: Elevation Chart with proper data handling */}
      {hasElevationData && (
        <ElevationChart
          elevationData={elevationChartData}
          title={trek.elevation_chart?.title || "Elevation Profile"}
          subtitle={trek.elevation_chart?.subtitle || "Trek elevation overview"}
          trekName={trekName}
          showFullscreen
        />
      )}

      <div className="py-8" ref={datesRef}>
        <DatesAndPrice
          dates={departures}
          groupPrices={groupPrices}
          highlights={dateHighlights}
          trekName={trekName}
          trekId={slug}
          onBookDate={(date) =>
            navigate(`/trek-booking?trekSlug=${slug}&date=${date.start}`)
          }
        />
      </div>

      {/* ✅ Map section with export */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <TrekActions
            trekId={flat.public_id}
            pdfUrl={actionData.pdfUrl || trek.pdfUrl}
          />

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
          totalReviews={
            trekReviews.length > 0 ? trekReviews.length : reviews.length
          }
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

      {/* ✅ Export notification */}
      {exportNotification && (
        <ExportNotification
          message={exportNotification.message}
          type={exportNotification.type}
        />
      )}
    </div>
  );
}
