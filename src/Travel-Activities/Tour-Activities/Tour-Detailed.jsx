import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTourDetail, fetchTourReviews, fetchTourSimilar } from "../../api/tourService.js";
import TourHero from "./Tour-Detailed-Pages/tour-hero.jsx";
import TourKeyInfo from "./Tour-Detailed-Pages/tour-key_info.jsx";
import TourOverview from "./Tour-Detailed-Pages/tour-overview.jsx";
import TourItinerary from "./Tour-Detailed-Pages/tour-itenerary.jsx";
import TourBookingCard from "./Tour-Detailed-Pages/tour-bookingcard.jsx";
import TourGallery from "./Tour-Detailed-Pages/tour-gallery.jsx";
import SimilarTour from "./Tour-Detailed-Pages/tour-similar_tour.jsx";
import CostInclusions from "../../treks/trekkingpage/CostInclusions.jsx";
import TourAdditionalInfo from "./Tour-Detailed-Pages/tour-additionalinfo.jsx";
import ReviewsSlider from "../../treks/trekkingpage/ReviewSlider.jsx";
import { useHideLayoutBreadcrumbs } from "../../components/Breadcrumb/BreadcrumbVisibilityContext.jsx";

export default function TourDetail() {
  const { slug } = useParams();
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarTours, setSimilarTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [travelerCount, setTravelerCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const seo = tour?.seo || {};
  const highlightList = useMemo(() => {
    if (!tour) return [];
    if (Array.isArray(tour.highlights) && tour.highlights.length > 0) {
      return tour.highlights;
    }
    if (Array.isArray(tour.highlight_items) && tour.highlight_items.length > 0) {
      return tour.highlight_items.map((item) => item.text).filter(Boolean);
    }
    return [];
  }, [tour]);

  const heroBreadcrumbs = useMemo(() => {
    const crumbs = [
      { label: "Home", url: "/" },
      { label: "Travel Activities", url: "/travel-activities/tours" },
    ];
    if (tour?.travelStyle) {
      crumbs.push({ label: tour.travelStyle });
    }
    crumbs.push({ label: tour?.title || "Tour Detail" });
    return crumbs;
  }, [tour?.travelStyle, tour?.title]);

  const seoTitle = useMemo(() => {
    const fallback = tour?.title ? `${tour.title} | Evertrek Nepal Tours` : "Tour | Evertrek Nepal";
    return (seo?.meta_title || seo?.og_title || seo?.twitter_title || fallback).trim();
  }, [seo, tour]);

  const seoDescription = useMemo(() => {
    const overviewParagraph = Array.isArray(tour?.overview?.paragraphs)
      ? tour.overview.paragraphs[0]
      : "";
    const fallback =
      tour?.shortDescription ||
      tour?.short_description ||
      tour?.tagline ||
      overviewParagraph ||
      tour?.longDescription ||
      tour?.long_description ||
      "Explore Nepal with a curated tour experience led by local experts.";
    return (
      seo?.meta_description ||
      seo?.og_description ||
      seo?.twitter_description ||
      String(fallback || "").trim()
    );
  }, [seo, tour]);

  const canonicalUrl = useMemo(() => {
    if (seo?.canonical_url) return seo.canonical_url;
    if (typeof window === "undefined") return "";
    return window.location.href.split("?")[0];
  }, [seo]);

  const ogImage = seo?.og_image_url || tour?.image_url || tour?.image || "";
  const twitterImage = seo?.twitter_image_url || ogImage;

  const structuredData = useMemo(() => {
    if (
      seo?.structured_data &&
      typeof seo.structured_data === "object" &&
      Object.keys(seo.structured_data).length > 0
    ) {
      return seo.structured_data;
    }
    const price = Number(tour?.basePrice ?? tour?.price ?? 0);
    const hasPrice = Number.isFinite(price) && price > 0;
    return {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: tour?.title || "Nepal Tour",
      description: seoDescription,
      image: ogImage || undefined,
      touristType: tour?.travelStyle || tour?.travel_style || undefined,
      itinerary:
        Array.isArray(tour?.itineraryDays) && tour.itineraryDays.length > 0
          ? tour.itineraryDays.map((day) => ({
              "@type": "TouristTrip",
              name: day.title,
              description: day.description,
            }))
          : undefined,
      offers: hasPrice
        ? {
            "@type": "Offer",
            price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: canonicalUrl || undefined,
          }
        : undefined,
      aggregateRating:
        Number(tour?.reviews_count || tour?.reviews || 0) > 0
          ? {
              "@type": "AggregateRating",
              ratingValue: Number(tour?.rating || 0),
              reviewCount: Number(tour?.reviews_count || tour?.reviews || 0),
            }
          : undefined,
    };
  }, [seo, tour, seoDescription, ogImage, canonicalUrl]);

  const breadcrumbData = useMemo(() => {
    if (Array.isArray(seo?.breadcrumbs) && seo.breadcrumbs.length > 0) {
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: seo.breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name || crumb.title || `Step ${index + 1}`,
          item: crumb.url || crumb.link || "",
        })),
      };
    }
    return null;
  }, [seo]);
  useHideLayoutBreadcrumbs();
  useEffect(() => {
    let isMounted = true;
    const loadTour = async () => {
      if (!slug) return;
      setLoading(true);
      setError("");
      try {
        const data = await fetchTourDetail(slug);
        if (!isMounted) return;
        setTour(data);
        if (Array.isArray(data?.reviews_list)) {
          setReviews(
            data.reviews_list.map((review, idx) => ({
              id: review.id || `${review.author_name}-${idx}`,
              name: review.author_name || "Anonymous",
              title: review.title || "Review",
              text: review.body || "",
              rating: Number(review.rating || 0),
            }))
          );
        }
        if (Array.isArray(data?.similar_tours)) {
          setSimilarTours(data.similar_tours);
        }
        setLoading(false);
        const [reviewsData, similarData] = await Promise.all([
          fetchTourReviews(slug),
          fetchTourSimilar(slug),
        ]);
        if (!isMounted) return;
        if (!Array.isArray(data?.reviews_list)) {
          setReviews(
            Array.isArray(reviewsData)
              ? reviewsData.map((review, idx) => ({
                  id: review.id || `${review.author_name}-${idx}`,
                  name: review.author_name || "Anonymous",
                  title: review.title || "Review",
                  text: review.body || "",
                  rating: Number(review.rating || 0),
                }))
              : []
          );
        }
        if (!Array.isArray(data?.similar_tours)) {
          setSimilarTours(Array.isArray(similarData) ? similarData : []);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load tour.");
        setLoading(false);
      }
    };
    loadTour();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const totalPrice = useMemo(() => {
    const base =
      tour?.groupPrices?.find((tier) => tier.label === selectedGroup)?.price ??
      tour?.basePrice ??
      tour?.price ??
      0;
    return Number(base) * travelerCount;
  }, [tour, selectedGroup, travelerCount]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-lg text-center bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-900">Loading tour...</h1>
          <p className="text-gray-600 mt-2">Fetching latest tour details.</p>
        </div>
      </div>
    );
  }

  if (!tour || error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-lg text-center bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-900">Tour not found</h1>
          <p className="text-gray-600 mt-2">
            {error || "The tour you are looking for is not available right now."}
          </p>
          <Link
            to="/travel-activities/tours"
            className="inline-block mt-6 text-emerald-600 font-semibold"
          >
            View all tours →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {Array.isArray(seo?.meta_keywords) && seo.meta_keywords.length > 0 && (
        <meta name="keywords" content={seo.meta_keywords.join(", ")} />
      )}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:title" content={seo?.og_title || seoTitle} />
      <meta property="og:description" content={seo?.og_description || seoDescription} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:alt" content={tour?.title || "Tour image"} />}
      <meta name="twitter:card" content={twitterImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={seo?.twitter_title || seoTitle} />
      <meta name="twitter:description" content={seo?.twitter_description || seoDescription} />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
      <meta
        name="robots"
        content={`${seo?.robots_noindex ? "noindex" : "index"},${seo?.robots_nofollow ? "nofollow" : "follow"}`}
      />
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      {breadcrumbData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      )}

      <TourHero tour={tour} breadcrumbs={heroBreadcrumbs} />

      <div className="sticky top-[92px] z-30 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-600">
          <a href="#overview" className="hover:text-emerald-700 transition">
            Overview
          </a>
          <a href="#itinerary" className="hover:text-emerald-700 transition">
            Itinerary
          </a>
          <a href="#cost-details" className="hover:text-emerald-700 transition">
            Cost Details
          </a>
          <a href="#reviews" className="hover:text-emerald-700 transition">
            Reviews
          </a>
          <Link
            to="/contact-us"
            className="ml-auto rounded-full bg-emerald-600 px-4 py-2 text-white text-xs font-semibold"
          >
            Ask a Question
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-10">
        <div className="space-y-10">
          <section id="overview" className="space-y-10">
            <TourKeyInfo tour={tour} />
            <TourOverview overview={tour.overview} longDescription={tour.longDescription} />
          </section>

          {highlightList.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Highlights
              </h2>
              <ul className="mt-4 grid gap-3 text-gray-600">
                {highlightList.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <TourItinerary days={tour.itineraryDays || tour.itinerary_days || []} />

          {(tour.cost?.inclusions?.length > 0 ||
            tour.cost?.exclusions?.length > 0) && (
            <section id="cost-details">
              <CostInclusions
                inclusions={tour.cost?.inclusions}
                exclusions={tour.cost?.exclusions}
                title="Cost Details"
                inclusionsTitle="Includes"
                exclusionsTitle="Excludes"
              />
            </section>
          )}

          <TourAdditionalInfo
            sections={
              tour.additional_info ||
              tour.additionalInfo ||
              tour.additional_info_sections ||
              []
            }
          />

          <div className="py-8 bg-gray-100">
            <ReviewsSlider reviews={reviews} />
          </div>

          <TourGallery
            images={tour.gallery_images || tour.gallery || []}
            tourName={tour.title}
          />
          <SimilarTour tour={tour} items={similarTours} />
        </div>

        <aside className="space-y-6">
          <TourBookingCard
            tour={tour}
            selectedGroup={selectedGroup}
            onSelectGroup={setSelectedGroup}
            travelerCount={travelerCount}
            onTravelerChange={setTravelerCount}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            totalPrice={totalPrice}
          />

          <div className="bg-emerald-50 rounded-2xl p-6 text-sm text-emerald-900">
            <h3 className="font-semibold text-base">Need custom timing?</h3>
            <p className="mt-2 text-emerald-800/90">
              We can tailor pick-up times, private guide options, and add-on
              experiences. Just tell us your preferred schedule.
            </p>
            <Link
              to="/contact-us"
              className="inline-flex items-center mt-4 font-semibold text-emerald-700"
            >
              Ask our team →
            </Link>
          </div>

          {(Array.isArray(tour.internal_links) && tour.internal_links.length > 0) ||
          (Array.isArray(tour.backlinks) && tour.backlinks.length > 0) ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-sm text-gray-700">
              <h3 className="text-base font-semibold text-gray-900">
                Helpful Resources
              </h3>
              {Array.isArray(tour.internal_links) && tour.internal_links.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    Related Articles
                  </p>
                  <ul className="mt-3 space-y-2">
                    {tour.internal_links.map((link) => (
                      <li key={`${link.url}-${link.label}`}>
                        <a
                          href={link.url}
                          className="text-emerald-700 hover:text-emerald-800 font-medium"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(tour.backlinks) && tour.backlinks.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    References
                  </p>
                  <ul className="mt-3 space-y-2">
                    {tour.backlinks.map((link) => (
                      <li key={`${link.url}-${link.source_name || "source"}`}>
                        <a
                          href={link.url}
                          className="text-gray-600 hover:text-gray-800"
                          rel={link.rel || "noopener noreferrer"}
                          target="_blank"
                        >
                          {link.anchor_text || link.source_name || link.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
