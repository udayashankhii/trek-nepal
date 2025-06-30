// src/treks/trekkingpage/TreksDetailPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTrek, fetchSimilarTreks } from "../../api/trekService";
import mockTrekHighlights from "../../data/highlights.js";
import Reviews from "../../data/reviews.js";
import everestBaseCamp from "../../data/everestBaseCamp.js";
// UI Components
import TrekAddInfo from "./AdditionalInfo.jsx";

import {
  MapPinIcon,
  CalendarIcon,
  FireIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import HeroSection from "./Hero";
import TrekSummary from "./TrekOverview.jsx";
import TrekHighlights from "./TrekHighlights";
import Itinerary from "./Itinerary";
import CostInclusions from "./CostInclusions";
import FAQSection from "./FAQSection";
import GallerySection from "./Gallery";
import ElevationChart from "./ElevationChart";
import BookingCard from "./BookingCard";
import DatesAndPrice from "./Datesandprice";
import SimilarItineraries from "./SimilarItenaries.jsx";
import TrekActions from "./TrekAction.jsx";
import TrekGallery from "./Gallery";
import KeyInfo from "./Info.jsx";
import ReviewSection from "./Reviews.jsx";
import TrekOverview from "./TrekOverview.jsx";

// Utilities
import StickyBox from "react-sticky-box";
import { MessageCircle, AlertCircle, Loader2 } from "lucide-react";
import Overview from "./TrekOverview.jsx";
import ReviewsSlider from "./ReviewSlider.jsx";

export default function TrekDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // State management
  const [trek, setTrek] = useState(null);
  const [similarTreks, setSimilarTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

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

  // Scroll functions
  const scrollToDates = () => {
    console.log("Scrolling to dates section");
    if (datesRef.current) {
      datesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const scrollToReviews = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleViewMap = () => {
    scrollToMap();
  };

  const handleBookNow = () => {
    navigate(`/book/${slug}`);
  };

  const handleInquiry = () => {
    navigate(`/inquiry?trek=${slug}`);
  };

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

  // Error state
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

  // Not found state
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

  // Safely destructure trek data with fallbacks
  const {
    id: trekId,
    name: trekName,
    subtitle = "",
    hero = {},
    summary = {},
    highlights = [],
    description = {},
    itinerary = [],
    cost = { inclusions: [], exclusions: [] },
    faqs = [],
    gallery = [],
    galleryImages = [],

    reviewsList = [],

    elevationData = [],
    booking = {},
    price = {},
    similar_treks = [],
    pdfUrl,
    mapImage,
  } = trek;

  <Helmet>
    <title>{trek?.title || "Trek Detail"}</title>
    <meta
      name="description"
      content={trek?.subtitle || "Detailed trek information"}
    />
  </Helmet>;
  // Extract booking and pricing data
  const {
    basePrice = price.base || 0,
    discount = 0,
    groups = price.groups || [],
    mapLink = "",
  } = booking;

  const originalPrice =
    discount > 0 ? basePrice + discount : price.original || basePrice;

  // Prepare gallery images
  const images =
    galleryImages.length > 0
      ? galleryImages
      : gallery.length > 0
      ? gallery
      : [
          "/trekking.png",
          "/trekkinginnepal.jpg",
          "/Namche-Approach-From-North.webp",
          "/moutainimage.avif",
          "/everest.jpeg",
        ];

  // Generate dynamic date slots (in real app, fetch from API)
  const dateSlots = trek.availableDates || [
    {
      start: "2025-05-16",
      end: "2025-05-29",
      status: "Available",
      price: basePrice,
    },
    {
      start: "2025-05-23",
      end: "2025-06-05",
      status: "Available",
      price: basePrice,
    },
    {
      start: "2025-05-30",
      end: "2025-06-12",
      status: "Available",
      price: basePrice,
    },
    {
      start: "2025-06-06",
      end: "2025-09-19",
      status: "Limited",
      price: basePrice + 100,
    },
  ];

  // Use similar treks from API or fallback to trek data
  const displaySimilarTreks =
    similarTreks.length > 0 ? similarTreks : similar_treks.slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{trek.seo?.title || `${trekName} | Nepal Trekking`}</title>
        <meta
          name="description"
          content={trek.seo?.description || description.overview}
        />
        <meta
          name="keywords"
          content={trek.seo?.keywords?.join(", ") || trek.tags?.join(", ")}
        />
        <link
          rel="canonical"
          href={trek.seo?.canonicalUrl || `/treks/${slug}`}
        />
      </Helmet>
      {/* Hero Section */}
      <HeroSection
        title={hero.title || trekName}
        subtitle={hero.subtitle || trek.subtitle || ""}
        imageUrl={hero.image || trek.image || "/fallback.jpg"}
        ctaLabel="Book This Trek"
        ctaLink={`/book/${slug}`}
        season={trek.season}
        duration={trek.duration}
        difficulty={trek.difficulty}
        location={trek.location}
        onBookNow={handleBookNow}
        onInquiry={handleInquiry}
      />

      {/* Trek Actions */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 py-10">
        {/* Left Column - Main Content */}
        <div className="flex-1 space-y-8">
          {/* Key Information */}
          <KeyInfo
            data={summary}
            rating={summary.rating || trek.rating}
            reviews={summary.reviews || `based on ${trek.reviewsCount || 0}`}
          />

          {/* Trek Overview */}
          <section className="py-16 bg-white">
            <div className="max-w-3xl mx-auto px-6">
              <Overview
                heading={everestBaseCamp.overview.heading}
                articles={everestBaseCamp.overview.articles}
                bullets={everestBaseCamp.overview.bullets}
              />
            </div>
          </section>

          {/* Trek Highlights */}
          {highlights.length > 0 && (
            <TrekHighlights
              highlights={
                highlights.length > 0 ? highlights : mockTrekHighlights
              }
            />
          )}

          {/* Trek Description */}

          {/* Cost Inclusions */}
          <CostInclusions
            inclusions={cost.inclusions}
            exclusions={cost.exclusions}
          />

          {/* Itinerary */}
          {itinerary.length > 0 && <Itinerary itinerary={itinerary} />}

          {/* FAQ Section */}
          <section id="faqs" className="scroll-mt-32">
            <FAQSection faqCategories={faqs} />
          </section>

          {/* Testimonials */}

          {/* Contact Card */}
        </div>

        <div>{/* Other trek details */}</div>
        {/* Right Column - Booking Card */}
        <aside className="w-full lg:w-96">
          <StickyBox offsetTop={200} offsetBottom={20}>
            <BookingCard
              trekId={trekId}
              trekName={trekName}
              basePrice={basePrice}
              original={originalPrice}
              groups={groups}
              mapLink={mapLink}
              onCheckAvailability={scrollToDates}
              onBookNow={handleBookNow}
            />
          </StickyBox>
        </aside>
      </div>
      <TrekAddInfo trek={{ additionalInfo: trek.additionalInfo }} />

      {/* Full Width Gallery */}
      {images.length > 0 && (
        <div className="py-8">
          <TrekGallery images={images} trekName={trekName} />
        </div>
      )}

      {/* Elevation Chart */}
      {elevationData.length > 0 && (
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

      {/* Dates & Pricing */}
      <div className="py-8">
        {/* Dates & Pricing */}
        <div className="py-8">
          <DatesAndPrice
            ref={datesRef}
            dates={dateSlots}
            trekName={trekName}
            onBookDate={(date) => navigate(`/book/${slug}?date=${date.start}`)}
          />
        </div>
        <TrekActions
          trekId={trekId}
          pdfUrl={pdfUrl}
          onViewMap={handleViewMap}
        />
      </div>

      {/* Reviews Section */}
      <div ref={reviewsRef} className="py-4 bg-gray-100">
        <div className="max-w-20xl mx-auto px-2">
          <ReviewsSlider
            reviews={reviewsList}
            trekName="Everest Base Camp Trek"
            averageRating={4.8}
            totalReviews={156}
          />
        </div>
      </div>

      {/* Similar Itineraries */}
      {displaySimilarTreks.length > 0 && (
        <div className="py-8">
          {/* Similar Itineraries */}
          {displaySimilarTreks.length > 0 && (
            <div className="py-8">
              <SimilarItineraries
                treks={displaySimilarTreks.map((trek) => ({
                  id: trek.id,
                  title: trek.name || trek.title,
                  image: trek.bannerImage || trek.image || "/fallback.jpg",
                  price: trek.price?.base || 0, // ✅ FIX HERE
                  rating: trek.rating || 5,
                  reviews: trek.reviewsCount || 0,
                  duration: trek.duration || trek.summary?.duration || "N/A",
                  slug: trek.slug,
                  region: trek.region || "everest",
                }))}
                exploreLink="/treks"
                currentTrekId={trekId}
              />
            </div>
          )}
        </div>
      )}

      {/* WhatsApp Float Button */}

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}
