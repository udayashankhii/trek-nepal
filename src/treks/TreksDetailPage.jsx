


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
  fetchTrekActions,
} from "../api/service/trekService.js";
import { loadGoogleMaps } from "../utils/mapHelpers.js";
import { getAccessToken } from "../api/auth/auth.api.js";
import {
  extractHeroData,
  extractGalleryData,
  preloadTrekImages,
  debugTrekImages,
  normalizeImageUrl,
} from "./trekkingpage/trekdatahelper.js";

import SEO from "../components/common/SEO";
import {
  buildTrekSchema,
  buildFAQSchema,
  buildBreadcrumbSchema,
} from "../seo/schemas";

const TrekAddInfo = lazy(() => import("./trekkingpage/AdditionalInfo.jsx"));
const HeroSection = lazy(() => import("./trekkingpage/Hero.jsx"));
const TrekHighlights = lazy(() => import("./trekkingpage/TrekHighlights.jsx"));
const Itinerary = lazy(() => import("./trekkingpage/Itinerary.jsx"));
const CostInclusions = lazy(() => import("./trekkingpage/CostInclusions.jsx"));
const FAQSection = lazy(() => import("./trekkingpage/FAQSection.jsx"));
const ElevationChart = lazy(() => import("./trekkingpage/ElevationChart.jsx"));
const BookingCard = lazy(() => import("./trekkingpage/BookingCard.jsx"));
const DatesAndPrice = lazy(() => import("./trekkingpage/Datesandprice.jsx"));
const SimilarTreks = lazy(() => import("./trekkingpage/SimilarTreks.jsx"));
const TrekActions = lazy(() => import("./trekkingpage/TrekAction.jsx"));
const TrekGallery = lazy(() => import("./trekkingpage/Gallery.jsx"));
const KeyInfo = lazy(() => import("./trekkingpage/KeyInfo.jsx"));
const TrekOverview = lazy(() => import("./trekkingpage/TrekOverview.jsx"));
const ReviewsSlider = lazy(() => import("./trekkingpage/ReviewSlider.jsx"));

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

function SectionFallback({ label = "Loading section..." }) {
  return (
    <div className="py-6 text-sm text-gray-500 flex items-center justify-center">
      {label}
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

  // ✅ Load trek data with proper error handling
  useEffect(() => {
    const loadTrekData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`📡 Fetching trek data for: ${slug}`);

        // Fetch all data in parallel
        const [
          trekData,
          actionsData,
          elevationChartData,
          similarData,
          reviewsData,
          bookingCardResult,
          costDatesData,
        ] = await Promise.allSettled([
          fetchTrek(slug),
          fetchTrekActions(slug),
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
          actionsData.status === "fulfilled" ? actionsData.value : null;
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

        console.log("✅ Trek data loaded successfully");

        // ✅ FIXED: Handle elevation chart - prioritize complete itinerary data
        let elevationChart = null;
        const itineraryData = trekResult.itinerary_days || trekResult.itinerary || [];
        
        // Always try to build from itinerary first for complete data
        if (itineraryData && itineraryData.length > 0) {
          const elevationPoints = transformItineraryToElevation(itineraryData);
          
          // Use itinerary if we have valid elevation data
          if (elevationPoints.length > 0 && elevationPoints.some(p => p.elevation > 0)) {
            elevationChart = {
              title: `${trekResult.title || trekResult.trek?.title || "Trek"} - Elevation Profile`,
              subtitle: "Daily altitude changes throughout your trek",
              points: elevationPoints,
            };
            console.log(`✅ Built elevation chart from itinerary: ${elevationPoints.length} days`);
          }
        }
        
        // Fall back to API elevation chart only if itinerary didn't work
        if (!elevationChart && apiElevationChart?.points?.length > 0) {
          elevationChart = apiElevationChart;
          console.log(`⚠️ Using API elevation chart: ${apiElevationChart.points.length} points`);
        }

        // Merge all data into trek object
        const mergedTrek = {
          ...trekResult,
          elevation_chart: elevationChart,
          cost_dates_data: costDates,
        };

        setTrek(mergedTrek);
        setSimilarTreks(similar);
        setTrekReviews(reviews?.results || []);
        setBookingCardData(bookingCard);
        setTrekActions(actions);

        // ✅ Debug and preload images
        if (import.meta.env.DEV) {
          await debugTrekImages(mergedTrek);
        }
        preloadTrekImages(mergedTrek);

      } catch (err) {
        console.error("❌ Error loading trek data:", err);
        setError(err.message || "Failed to load trek details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadTrekData();
  }, [slug]);

  // Preload Google Maps
  useEffect(() => {
    loadGoogleMaps().catch((err) => {
      console.warn("Background Google Maps preload failed:", err);
    });
  }, []);

  // Handle auto-open map from location state
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


  useEffect(() => {
    if (showMap) {
      setTimeout(() => scrollToMap(), 300);
    }
  }, [showMap]);


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

  const trekName =
    trek?.hero?.title || trek?.trek?.title || trek?.title || (loading ? "" : "Trek Detail");

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

  // ✅ Extract hero and gallery data using helper functions
  const heroData = extractHeroData(trek);
  const galleryData = extractGalleryData(trek);

  console.log("🖼️ Hero data:", heroData);
  console.log("📷 Gallery data:", galleryData.length, "images");

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
    highlights: trekHighlights = [],
    cost,
    booking_card: bookingCard,
    similar,
  } = flat;

  const keyInfoData = {
    duration: duration || trek.trek?.duration,
    difficulty: heroData.difficulty || tripGrade || trekGrade || "Moderate",
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

  // ✅ Normalize card image for SEO
  const cardImageUrl = normalizeImageUrl(
    heroData.imageUrl || flat.card_image_url
  );

  const seoSchemas = [
    buildTrekSchema({
      trek: flat,
      slug,
      heroData,
      bookingPrice:
        parseFloat(bookingCardData?.base_price || bookingCard.base_price) || 0,
      reviews: trekReviews,
      departures,
    }),
    trek.faq_categories?.length
      ? buildFAQSchema(trek.faq_categories)
      : null,
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Trekking in Nepal", path: "/trekking-in-nepal" },
      ...(region ? [{ name: region, path: `/treks/${region.toLowerCase().replace(/\s+/g, "-")}` }] : []),
      { name: trekName, path: `/trek/${slug}` },
    ]),
  ].filter(Boolean);

  const seoDescription =
    heroData.subtitle ||
    `Book your ${trekName} with EverTrek Nepal. Expert Sherpa guides, ${duration ? duration + "," : ""} ${maxAltitude ? "reaching " + maxAltitude + "," : ""} verified reviews, and best price guarantee. ${region ? "Located in the " + region + " region of Nepal." : ""}`.trim();

  const seoKeywords = [
    trekName,
    `${trekName} trek`,
    `${trekName} cost`,
    `${trekName} itinerary`,
    `${trekName} difficulty`,
    region ? `${region} trekking` : "",
    region ? `${region} trek nepal` : "",
    activity || "trekking",
    "trekking in nepal",
    "nepal trek packages",
    "guided trek nepal",
    "himalayan trekking",
  ].filter(Boolean).join(", ");

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO
        title={trekName}
        description={seoDescription}
        image={cardImageUrl}
        keywords={seoKeywords}
        url={`/trek/${slug}`}
        type="website"
        schemas={seoSchemas}
        geo={{ region: "NP", placename: `${trekName}, Nepal` }}
      />

      {/* ✅ Hero Section with extracted data */}
      <Suspense fallback={<SectionFallback label="Loading hero..." />}>
        <HeroSection
          title={heroData.title}
          subtitle={heroData.subtitle}
          imageUrl={heroData.imageUrl}
          imageAlt={heroData.imageAlt}
          imageCaption={heroData.imageCaption}
          season={heroData.season}
          duration={heroData.duration}
          difficulty={heroData.difficulty}
          location={heroData.location}
          ctaLabel={heroData.ctaLabel}
          onBookNow={
            heroData.ctaLink
              ? () => navigate(heroData.ctaLink)
              : () => handleBookNow()
          }
          onInquiry={() => navigate(`/contact-us`)}
        />
      </Suspense>

      {/* ✅ COMPACT: Reduced padding from py-10 to py-6 */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 py-6">
        {/* ✅ COMPACT: Changed space-y-8 to space-y-4 for tighter component spacing */}
        <div className="flex-1 space-y-4">
          <Suspense fallback={<SectionFallback label="Loading key info..." />}>
            <KeyInfo
              data={keyInfoData}
              rating={rating}
              reviews={reviews}
              reviewText={flat.review_text}
            />
          </Suspense>

          {flat.overview && (
            <Suspense fallback={<SectionFallback label="Loading overview..." />}>
              <TrekOverview
                overview={{
                  ...flat.overview,
                  sections: (flat.overview.sections || []).map((s) => ({
                    ...s,
                    bullets: trekHighlights.length > 0 ? [] : s.bullets,
                  })),
                }}
              />
            </Suspense>
          )}

          {trekHighlights.length > 0 && (
            <Suspense fallback={<SectionFallback label="Loading highlights..." />}>
              <TrekHighlights highlights={trekHighlights} variant="card" />
            </Suspense>
          )}

          <Suspense fallback={<SectionFallback label="Loading cost details..." />}>
            <CostInclusions
              inclusions={cost.inclusions}
              exclusions={cost.exclusions}
              title="Cost Details"
              inclusionsTitle="Includes"
              exclusionsTitle="Excludes"
            />
          </Suspense>

          <Suspense fallback={<SectionFallback label="Loading itinerary..." />}>
            <Itinerary itinerary={flat.itinerary} />
          </Suspense>
          <Suspense fallback={<SectionFallback label="Loading FAQs..." />}>
            <FAQSection faqCategories={trek.faq_categories || []} />
          </Suspense>
        </div>

        <aside className="w-full lg:w-96">
          <StickyBox offsetTop={200} offsetBottom={20}>
            <Suspense fallback={<SectionFallback label="Loading booking card..." />}>
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
            </Suspense>
          </StickyBox>
        </aside>
      </div>

      {/* ✅ COMPACT: Additional Info - no extra wrapper padding needed */}
      <Suspense fallback={<SectionFallback label="Loading details..." />}>
        <TrekAddInfo sections={infoSections} />
      </Suspense>

      {/* ✅ COMPACT: Gallery with reduced padding from py-8 to py-4 */}
      <div className="py-4">
        <Suspense fallback={<SectionFallback label="Loading gallery..." />}>
          <TrekGallery
            images={galleryData}
            trekName={trekName}
            showTitle
            minImages={1}
          />
        </Suspense>
      </div>

      {/* ✅ COMPACT: Elevation Chart with reduced padding */}
      {hasElevationData && (
        <div className="py-4">
          <Suspense fallback={<SectionFallback label="Loading elevation..." />}>
            <ElevationChart
              elevationData={elevationChartData}
              title={trek.elevation_chart?.title || "Elevation Profile"}
              subtitle={
                trek.elevation_chart?.subtitle || "Trek elevation overview"
              }
              trekName={trekName}
              showFullscreen
            />
          </Suspense>
        </div>
      )}

      {/* ✅ COMPACT: Dates and Price with reduced padding */}
      <div className="py-4" ref={datesRef}>
        <Suspense fallback={<SectionFallback label="Loading dates..." />}>
          <DatesAndPrice
            dates={departures}
            groupPrices={groupPrices}
            highlights={dateHighlights}
            trekName={trekName}
            trekId={slug}
            onBookDate={(date) => handleBookNow(date)}
          />
        </Suspense>
      </div>

      {/* ✅ COMPACT: Map section - reduced from py-6 to py-3, removed mt-6 to mt-3 */}
      <div className="py-3 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Suspense fallback={<SectionFallback label="Loading map tools..." />}>
            <TrekActions
              trekId={flat.public_id}
              trekSlug={slug}
              trekName={trekName}
              mapImage={trekActions?.mapImage}
              preferredDates={departures.filter((d) => d.status === "Available")}
            />
          </Suspense>

          <div ref={mapRef} className="mt-3">
            <Suspense fallback={<MapLoadingSpinner />}>
              <TrekRouteMap
                itinerary={flat.itinerary}
                trekName={trekName}
                trekMetadata={trekMetadata}
                fallbackMapImage={trekActions?.mapImage}
                routeGeojsonUrl={routeGeojsonUrl}
                onExportComplete={handleExportComplete}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* ✅ COMPACT: Reviews with reduced padding from py-8 to py-4 */}
      <div className="py-4 bg-gray-100" ref={reviewsRef}>
        <Suspense fallback={<SectionFallback label="Loading reviews..." />}>
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
        </Suspense>
      </div>

      {/* ✅ COMPACT: Similar Treks with reduced padding from py-8 to py-4 */}
      <div className="py-4">
        <Suspense fallback={<SectionFallback label="Loading similar treks..." />}>
          <SimilarTreks
            treks={similarTreks.length > 0 ? similarTreks : similar}
            title="Similar Treks You Might Like"
            subtitle={`Discover more amazing treks in ${region}`}
            exploreLink="/treks"
            currentTrekId={flat.public_id}
            maxItems={3}
            showHeader
          />
        </Suspense>
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