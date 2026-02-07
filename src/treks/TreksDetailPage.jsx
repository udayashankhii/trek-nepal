


// src/treks/TrekDetailPage.jsx
import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  fetchTrek,
  fetchSimilarTreks,
  fetchTrekReviews,
  fetchTrekBookingCard,
  fetchTrekElevationChart,
  fetchTrekCostAndDates,
  fetchTrekActions, // ✅ ADD THIS IMPORT
} from "../api/service/trekService.js";
import { loadGoogleMaps } from "../utils/mapHelpers.js";
import { getAccessToken } from "../api/auth/auth.api.js";

import SEO from "../components/common/SEO";
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
import TrekDetailSkeleton from "./trekkingpage/TrekDetailSkeleton.jsx";

const TrekRouteMap = lazy(() => import("./trekkingpage/map/TrekRouteMap.jsx"));

function MapLoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg w-full">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-600 font-medium">Loading interactive map...</p>
      <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
    </div>
  );
}

function ExportNotification({ message, type = "success" }) {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-out z-50`}
    >
      <span className="text-lg">{type === "success" ? "✓" : "✗"}</span>
      <span>{message}</span>
    </div>
  );
}

function transformItineraryToElevation(itineraryDays) {
  if (!Array.isArray(itineraryDays) || itineraryDays.length === 0) {
    return [];
  }

  return itineraryDays.map((day) => {
    const altitudeStr = day.altitude || "0m";
    const elevation =
      parseInt(altitudeStr.replace(/,/g, "").replace(/m/g, "").trim(), 10) || 0;

    return {
      day: day.day,
      title: day.title || `Day ${day.day}`,
      elevation: elevation,
      description: day.description ? day.description.substring(0, 150) : "",
    };
  });
}

export default function TrekDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [openedOnceRef, setOpenedOnceRef] = useState(false); // Using state instead of ref for some logic if needed, but keeping original ref logic where possible
  const openedOnceRefObj = useRef(false);

  const [trek, setTrek] = useState(null);
  const [similarTreks, setSimilarTreks] = useState([]);
  const [trekReviews, setTrekReviews] = useState([]);
  const [bookingCardData, setBookingCardData] = useState(null);
  const [trekActions, setTrekActions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [exportNotification, setExportNotification] = useState(null);

  const datesRef = useRef(null);
  const mapRef = useRef(null);
  const reviewsRef = useRef(null);

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

  // ✅ FIXED: Correct Promise.allSettled array order
  useEffect(() => {
    const loadTrekData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Fetch all data in parallel with correct order
        const [
          trekData,
          actionsData, // ✅ ADDED: Actions result
          elevationChartData,
          similarData,
          reviewsData,
          bookingCardResult,
          costDatesData,
        ] = await Promise.allSettled([
          fetchTrek(slug),
          fetchTrekActions(slug), // ✅ This is now the 2nd item
          fetchTrekElevationChart(slug),
          fetchSimilarTreks(slug, 3),
          fetchTrekReviews(slug),
          fetchTrekBookingCard(slug),
          fetchTrekCostAndDates(slug),
        ]);

        // Extract fulfilled values
        const trekResult =
          trekData.status === "fulfilled" ? trekData.value : null;
        const actions =
          actionsData.status === "fulfilled" ? actionsData.value : null; // ✅ ADDED
        const apiElevationChart =
          elevationChartData.status === "fulfilled"
            ? elevationChartData.value
            : null;
        const similar =
          similarData.status === "fulfilled" ? similarData.value : [];
        const reviews =
          reviewsData.status === "fulfilled"
            ? reviewsData.value
            : { results: [] };
        const bookingCard =
          bookingCardResult.status === "fulfilled"
            ? bookingCardResult.value
            : null;
        const costDates =
          costDatesData.status === "fulfilled" ? costDatesData.value : null;

        if (!trekResult) {
          throw new Error("Trek not found");
        }

        // Handle elevation chart
        let elevationChart = apiElevationChart;

        if (
          !elevationChart ||
          !elevationChart.points ||
          elevationChart.points.length === 0
        ) {
          const itineraryData =
            trekResult.itinerary_days || trekResult.itinerary || [];
          const elevationPoints = transformItineraryToElevation(itineraryData);

          if (elevationPoints.length > 0) {
            elevationChart = {
              title: `${trekResult.title || trekResult.trek?.title || "Trek"
                } - Elevation Profile`,
              subtitle: "Daily altitude changes throughout your trek",
              points: elevationPoints,
            };
          }
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
        setTrekActions(actions);
      } catch (err) {
        console.error("Error loading trek data:", err);
        setError(err.message || "Failed to load trek details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadTrekData();
  }, [slug]);

  useEffect(() => {
    loadGoogleMaps().catch((err) => {
      console.warn("Background Google Maps preload failed:", err);
    });
  }, []);

  useEffect(() => {
    if (!openedOnceRefObj.current && location.state?.openMap) {
      openedOnceRefObj.current = true;
      setShowMap(true);
    }
  }, [location.state]);

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
    setShowMap(true);
    scrollToMap();
  };

  const handleExportComplete = (result) => {
    setExportNotification({
      message: result.message,
      type: result.success ? "success" : "error",
    });
  };

  useEffect(() => {
    if (exportNotification) {
      const timer = setTimeout(() => setExportNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [exportNotification]);

  const handleBookNow = (selectedDate = null) => {
    const isAuthenticated = !!getAccessToken();
    const bookingDate =
      selectedDate || departures.find((d) => d.status === "Available");

    const bookingParams = new URLSearchParams({ trekSlug: slug });
    if (bookingDate && bookingDate.start && bookingDate.end) {
      bookingParams.set("startDate", bookingDate.start);
      bookingParams.set("endDate", bookingDate.end);
    }
    const bookingUrl = `/trek-booking?${bookingParams.toString()}`;

    if (isAuthenticated) {
      navigate(bookingUrl);
    } else {
      navigate("/login", {
        state: {
          backgroundLocation: location,
          next: bookingUrl,
        },
      });
    }
  };

  const trekName = trek?.hero?.title || trek?.trek?.title || trek?.title || (loading ? "" : "Trek Detail");

  if (loading) {
    return (
      <>
        <SEO title={trekName} />
        <TrekDetailSkeleton />
      </>
    );
  }

  if (error || !trek) {
    return <TrekErrorPage error={error} />;
  }

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

  const costDatesData = trek.cost_dates_data || trek.cost_dates || {};

  let rawDepartures = [];
  if (
    costDatesData.departures_by_month &&
    Array.isArray(costDatesData.departures_by_month)
  ) {
    rawDepartures = costDatesData.departures_by_month.flatMap((monthGroup) =>
      Array.isArray(monthGroup.departures) ? monthGroup.departures : []
    );
  } else if (
    costDatesData.departures &&
    Array.isArray(costDatesData.departures)
  ) {
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

  let rawGroupPrices = [];
  if (
    costDatesData.group_prices &&
    Array.isArray(costDatesData.group_prices)
  ) {
    rawGroupPrices = costDatesData.group_prices;
  } else if (
    costDatesData.groupPrices &&
    Array.isArray(costDatesData.groupPrices)
  ) {
    rawGroupPrices = costDatesData.groupPrices;
  } else if (
    bookingCard.group_prices &&
    Array.isArray(bookingCard.group_prices)
  ) {
    rawGroupPrices = bookingCard.group_prices;
  }

  const groupPrices = rawGroupPrices.map((gp) => {
    const price =
      typeof gp.price === "string"
        ? parseFloat(gp.price)
        : Number(gp.price || 0);
    return {
      label:
        gp.label ||
        (gp.min_size && gp.max_size
          ? `${gp.min_size}–${gp.max_size} pax`
          : `${gp.size || 1} Person`),
      price: price,
      size: gp.max_size || gp.size || gp.min_size || 1,
    };
  });

  let dateHighlights = [];
  if (costDatesData.highlights && Array.isArray(costDatesData.highlights)) {
    dateHighlights = costDatesData.highlights
      .map((h) => (typeof h === "string" ? h : h.highlight || h.text || ""))
      .filter(Boolean);
  } else if (trek.date_highlights && Array.isArray(trek.date_highlights)) {
    dateHighlights = trek.date_highlights;
  }

  const infoSections = trek.additional_info || [];

  const elevationChartData = trek.elevation_chart?.points || [];
  const hasElevationData =
    Array.isArray(elevationChartData) && elevationChartData.length > 0;

  // ✅ Use trekActions for route geojson
  const routeGeojsonUrl = trekActions?.routeGeojson;

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

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trekName,
    description: hero.subtitle || `Enjoy the ${trekName} in Nepal.`,
    image: hero.imageUrl || flat.card_image_url,
    touristType: [activity || "Trekking"],
    itinerary: flat.itinerary.map((day) => ({
      "@type": "ItineraryItem",
      name: `Day ${day.day}: ${day.title}`,
      description: day.description,
    })),
    offers: {
      "@type": "Offer",
      price: bookingCardData?.base_price || bookingCard.base_price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO
        title={trekName}
        description={
          hero.subtitle ||
          `Book your ${trekName} with EverTrek Nepal. Verified reviews, best price guarantee, and expert guides.`
        }
        image={hero.imageUrl || flat.card_image_url}
        keywords={`${trekName}, trekking in nepal, ${region}, ${activity}`}
        schema={seoSchema}
      />

      <HeroSection
        title={hero.title || trekName}
        subtitle={hero.subtitle}
        imageUrl={hero.imageUrl || flat.card_image_url || "/fallback.jpg"}
        season={hero.season}
        duration={hero.duration || duration}
        difficulty={hero.difficulty}
        location={hero.location}
        ctaLabel={hero.cta_label}
        onBookNow={
          hero.cta_link ? () => navigate(hero.cta_link) : () => handleBookNow()
        }
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
            <TrekOverview
              overview={{
                ...flat.overview,
                sections: (flat.overview.sections || []).map((s) => ({
                  ...s,
                  bullets: trekHighlights.length > 0 ? [] : s.bullets,
                })),
              }}
            />
          )}

          {trekHighlights.length > 0 && (
            <TrekHighlights highlights={trekHighlights} variant="card" />
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
                bookingCardData?.group_prices ||
                bookingCard.group_prices ||
                []
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

      {hasElevationData && (
        <ElevationChart
          elevationData={elevationChartData}
          title={trek.elevation_chart?.title || "Elevation Profile"}
          subtitle={
            trek.elevation_chart?.subtitle || "Trek elevation overview"
          }
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
          onBookDate={(date) => handleBookNow(date)}
        />
      </div>

      {/* ✅ Map section with actions */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <TrekActions
            trekId={flat.public_id}
            trekSlug={slug}
            trekName={trekName}
            // pdfUrl={trekActions?.pdfUrl} // ✅ From API
            mapImage={trekActions?.mapImage} // ✅ From API
            preferredDates={departures.filter((d) => d.status === "Available")}
          />

          <div ref={mapRef} className="mt-12">
            <Suspense fallback={<MapLoadingSpinner />}>
              <TrekRouteMap
                itinerary={flat.itinerary}
                trekName={trekName}
                trekMetadata={trekMetadata}
                fallbackMapImage={trekActions?.mapImage} // ✅ From API
                routeGeojsonUrl={routeGeojsonUrl} // ✅ From API
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

      {exportNotification && (
        <ExportNotification
          message={exportNotification.message}
          type={exportNotification.type}
        />
      )}

      {/* Mobile Sticky Booking Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              From
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900">
                $
                {(
                  bookingCardData?.base_price ||
                  bookingCard.base_price ||
                  0
                ).toLocaleString()}
              </span>
            </div>
          </div>
          <button
            onClick={handleBookNow}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-95 text-center"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
