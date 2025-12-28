

// src/pages/TrekDetailPage.jsx
import { fetchTrekElevationChart } from "../api/trekService.js";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTrek, fetchSimilarTreks, fetchTrekReviews, fetchTrekBookingCard } from "../api/trekService.js";

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

  const toggleMapView = () => setShowMap((prev) => !prev);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
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
    additional_info_articles: (trek.additional_info || []).flatMap(
      (info) => info.articles?.articles || []
    ),
    additional_info_bullets: (trek.additional_info || []).flatMap(
      (info) => info.bullets || []
    ),
    similar: trek.similar || [],
  };

  const {
    region_name: region = "",
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
    highlights: trekHighlights = [],
    cost,
    booking_card: bookingCard,
    gallery,
    additional_info_articles,
    additional_info_bullets,
    similar,
  } = flat;
  //

  const keyInfoData = {
    duration: duration || trek.trek?.duration,
    //  Prioritize hero.difficulty (user-facing) → trek.trip_grade (technical)
    difficulty: hero.difficulty || flat.trek_grade || flat.tripGrade || "Moderate",
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

  // Highlights used by DatesAndPrice API (optional)
  const dateHighlights = (costDateApi.highlights || [])
    .map((h) => h.highlight)
    .filter(Boolean);

  const infoSections = trek.additional_info || [];

  const handleBookNow = () =>
    navigate(`/trek-booking?trek_id=${flat.public_id}`);
  const scrollToDates = () =>
    datesRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToMap = () =>
    mapRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToReviews = () =>
    reviewsRef.current?.scrollIntoView({ behavior: "smooth" });

  const fallbackElevationData = [
    {
      day: 1,
      title: "Sample Start",
      elevation: 1000,
      description: "Start point of the trek",
    },
    {
      day: 2,
      title: "Sample Mid",
      elevation: 2000,
      description: "Mid point",
    },
    {
      day: 3,
      title: "Sample End",
      elevation: 1500,
      description: "End point",
    },
  ];

  const hasElevationData =
    trek.elevation_chart &&
    Array.isArray(trek.elevation_chart.points) &&
    trek.elevation_chart.points.length > 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 py-10">
        {/* Left Column */}
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

        {/* Right Column */}
        <aside className="w-full lg:w-96">
          <StickyBox offsetTop={200} offsetBottom={20}>
            <BookingCard
              trekId={flat.public_id}
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

      {/* Additional Info */}
      <TrekAddInfo sections={infoSections} />

      {/* Gallery */}
      <div className="py-8">
        <TrekGallery
          images={gallery}
          trekName={trekName}
          showTitle
          minImages={1}
        />
      </div>

      {/* Elevation Chart */}
      <ElevationChart
        elevationData={
          hasElevationData ? trek.elevation_chart.points : fallbackElevationData
        }
        title={
          hasElevationData
            ? trek.elevation_chart.title
            : "Elevation Chart Sample"
        }
        subtitle={
          hasElevationData
            ? trek.elevation_chart.subtitle
            : "Sample chart in absence of real data"
        }
        trekName={trekName}
        showFullscreen
      />

      {/* Dates & Pricing */}
      <div className="py-8" ref={datesRef}>
        <DatesAndPrice
          dates={departures}
          groupPrices={groupPrices}
          highlights={dateHighlights}
          trekName={trekName}
          trekId={flat.public_id}
          onBookDate={(date) =>
            navigate(
              `/trek-booking?trek_id=${flat.public_id}&date=${date.start}`
            )
          }
        />
      </div>

      {/* Trek Actions (Map / PDF) */}
      <div className="py-4" ref={mapRef}>
        <TrekActions
          trekId={flat.public_id}
          pdfUrl={trek.pdfUrl}
          onViewMap={toggleMapView}
        />

        {showMap && (
          <div className="py-4 flex justify-center">
            <img
              src={trek.mapImage}
              alt={`Map for ${trekName}`}
              className="max-w-full rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      {/* Reviews */}
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

      {/* Similar Treks */}
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
    </div>
  );
}