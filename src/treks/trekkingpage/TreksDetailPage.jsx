// src/treks/trekkingpage/TreksDetailPage.jsx
import React, { useRef } from "react";
import everestBaseCamp from "../../data/everestBaseCamp.jsx";

// UI Components
import HeroSection from "./Hero";
// import TrekActions from "../../components/trek/TrekActions";
import TrekSummary from "./TrekSummary";
import TrekHighlights from "./TrekHighlights";
import TrekDescription from "./TrekDescription";
import Itinerary from "./Itinerary";
import CostInclusions from "./CostInclusions";
import FAQSection from "./FAQSection";
import GallerySection from "./Gallery";
import TestimonialsSection from "./Testimonials";
import TrekMap from "./TrekMap";
import ElevationChart from "./ElevationChart";
import TrekContactCard from "./ContactForm";
import BookingCard from "./BookingCard";
import DatesAndPrice from "./Datesandprice";
import SimilarItineraries from "./SimilarItenaries.jsx";
import TrekActions from "./TrekAction.jsx";
import { MessageCircle } from "lucide-react";
import TrekGallery from "./Gallery";
import StickyBox from "react-sticky-box";
import KeyInfo from "./Info.jsx";
import ReviewSection from "./Reviews.jsx";

export default function TrekDetailPage() {
  const {
    id: trekId,
    hero,
    summary,
    highlights,
    description,
    itinerary,
    cost: { inclusions, exclusions },
    faqs,
    gallery,
    testimonials,
    map: { image: mapImage, description: mapDescription },
    elevationData,
    booking: { trekName, basePrice, discount = 0, groups = [], mapLink = "" },
  } = everestBaseCamp;

  const originalPrice = discount > 0 ? basePrice + discount : basePrice;
  const datesRef = useRef(null);
  const mapRef = useRef(null);
  const scrollToDates = () => {
    console.log("Scroll function called");
    console.log("datesRef.current:", datesRef.current);

    if (datesRef.current) {
      datesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    } else {
      console.error("datesRef is not attached to any element");
    }
  };

  const scrollToMap = () =>
    mapRef.current?.scrollIntoView({ behavior: "smooth" });

  // Temporary sample data (replace with API-driven values)
  const dateSlots = [
    {
      start: "2025-05-16",
      end: "2025-05-29",
      status: "Available",
      price: 1190,
    },
    {
      start: "2025-05-23",
      end: "2025-06-05",
      status: "Available",
      price: 1190,
    },
    {
      start: "2025-05-30",
      end: "2025-06-12",
      status: "Available",
      price: 1190,
    },
  ];
  const similarTreks = [
    {
      id: "sleep-basecamp",
      image: "/images/everest-sleep-basecamp.jpg",
      title: "Sleep at Base Camp – 15 Days",
      duration: "15 Days",
      price: "US$2275",
      rating: 5.0,
      reviews: 3,
    },
    {
      id: "lux-helitrek",
      image: "/images/everest-heli-luxury.jpg",
      title: "Luxury Everest Heli Trek – 6 Days",
      duration: "6 Days",
      price: "US$2500",
      originalPrice: "US$3025",
      rating: 5.0,
      reviews: 6,
      badge: "Luxury",
    },
    {
      id: "gokyo-heli-return",
      image: "/images/everest-gokyo-heli.jpg",
      title: "Gokyo to EBC with Helicopter Return – 15 Days",
      duration: "15 Days",
      price: "US$2275",
      rating: 5.0,
      reviews: 3,
    },
  ];
  const images = [
    "/trekking.png",
    "/trekkinginnepal.jpg",
    "/Namche-Approach-From-North.webp",
    "/moutainimage.avif",
    "/everest.jpeg",
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero + Actions */}
      <HeroSection {...hero} />
      <TrekActions
        trekId={trekId}
        pdfUrl={hero.pdfLink}
        onViewMap={scrollToMap} // pass the scroll handler
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 py-10">
        <div className="flex-1 space-y-8">
          <KeyInfo
            data={summary}
            rating={summary.rating}
            reviews={summary.reviews}
          />
          <TrekSummary overview={summary.overview} />
          <TrekHighlights highlights={highlights} />
          <TrekDescription
            overview={description.overview}
            sections={description.sections}
          />
          <CostInclusions inclusions={inclusions} exclusions={exclusions} />
          <Itinerary itinerary={itinerary} />
          <div></div>
          {/* <TestimonialsSection testimonials={testimonials} /> */}
          {/* Map Section */}
          <div ref={mapRef}>
            <TrekMap mapImage={mapImage} mapDescription={mapDescription} />
          </div>
          {/* <FAQSection faqCategories={faqs} /> */}
          {/* <ElevationChart data={elevationData} />
          <TrekContactCard trekDetails={{ trekName, basePrice, discount }} /> */}
        </div>

        <aside className="w-full lg:w-96">
          <StickyBox offsetTop={200} offsetBottom={150}>
            <BookingCard
              trekId={trekId}
              basePrice={basePrice}
              original={originalPrice}
              groups={groups}
              mapLink={mapLink}
              onCheckAvailability={scrollToDates}
            />
          </StickyBox>
        </aside>
      </div>
      {/* FULL WIDTH GALLERY */}
      <TrekGallery images={images} />
      {/* Dates & Similar */}
      <DatesAndPrice
        ref={datesRef}
        dates={dateSlots}
        trekName="Everest Base Camp Trek"
      />
      <ReviewSection/>
      <SimilarItineraries treks={similarTreks} exploreLink="/treks" />
    </div>
  );
}
