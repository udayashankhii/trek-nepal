import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Calendar, TrendingUp } from "lucide-react";

function SimilarTourCard({ tour }) {
  const handleImageError = (e) => {
    e.target.src = "/trekking.png";
  };

  const getBadgeStyles = (badge) => {
    const lowerBadge = badge?.toLowerCase() || "";

    if (lowerBadge.includes("best") || lowerBadge.includes("seller")) {
      return "bg-green-600 text-white";
    }
    if (lowerBadge.includes("price") || lowerBadge.includes("deal")) {
      return "bg-orange-600 text-white";
    }
    if (lowerBadge.includes("new") || lowerBadge.includes("featured")) {
      return "bg-blue-600 text-white";
    }
    if (lowerBadge.includes("popular")) {
      return "bg-purple-600 text-white";
    }
    return "bg-gray-700 text-white";
  };

  return (
    <article className="group bg-white shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={handleImageError}
        />

        {tour.badge && (
          <span
            className={`absolute top-3 left-3 ${getBadgeStyles(
              tour.badge
            )} text-xs px-3 py-1 rounded-full font-semibold shadow-lg`}
          >
            {tour.badge}
          </span>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          {tour.duration && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {tour.duration}
            </span>
          )}

          {tour.rating > 0 && (
            <>
              <span className="flex items-center gap-1 text-yellow-500">
                <Star size={14} fill="currentColor" />
                {tour.rating.toFixed(1)}
              </span>
              {tour.reviews > 0 && (
                <span className="text-gray-400">({tour.reviews})</span>
              )}
            </>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 min-h-[3.5rem]">
          {tour.title}
        </h3>

        {tour.location && (
          <div className="text-xs text-gray-500 font-medium">
            📍 {tour.location}
          </div>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-sky-600 text-2xl font-bold">
            ${Number(tour.price || 0).toLocaleString()}
          </span>
          <span className="text-gray-500 text-sm">per person</span>
        </div>

        <Link
          to={tour.link || `/travel-activities/tours/${tour.slug}`}
          className="inline-flex items-center gap-1 text-green-600 text-sm font-semibold hover:gap-2 transition-all group/link"
        >
          View Details
          <ArrowRight
            size={16}
            className="group-hover/link:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </article>
  );
}

export default function SimilarTour({
  tour,
  items = [],
  title = "Similar Tours You Might Like",
  subtitle = "Explore more amazing tours and experiences",
  exploreLink = "/travel-activities/tours",
  showHeader = true,
  maxItems = 3,
}) {
  const similarTours = useMemo(() => {
    if (!tour) return [];

    const sourceItems = Array.isArray(items) && items.length > 0 ? items : [];
    const filtered = sourceItems
      .filter((item) => item.slug !== tour.slug)
      .slice(0, maxItems);

    return filtered.map((item, index) => {
      const id = item.id || item._id || `tour-${index}`;
      const titleText = item.title || item.name || "Untitled Tour";
      const image =
        item.image ||
        item.image_url ||
        item.bannerImage ||
        item.thumbnail ||
        "/trekking.png";
      const duration = item.duration || (item.days ? `${item.days} Days` : null);
      const rating = Number(item.rating || item.stars || item.averageRating || 0);
      const reviews = Number(item.reviews || item.reviews_count || item.reviewCount || 0);
      const price = Number(item.basePrice ?? item.price ?? item.cost ?? 0);
      const badge = item.badge || item.tag || item.label || "";
      const slug = item.slug || item.url || "";
      const link = item.link || `/travel-activities/tours/${slug}`;
      const location = item.location || item.region || item.area || "";

      return {
        id,
        title: titleText,
        image,
        duration,
        rating,
        reviews,
        price,
        badge,
        slug,
        link,
        location,
      };
    });
  }, [tour, maxItems]);

  if (similarTours.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {similarTours.map((item) => (
            <SimilarTourCard key={item.id} tour={item} />
          ))}
        </div>

        {exploreLink && (
          <div className="text-center">
            <Link
              to={exploreLink}
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <TrendingUp size={20} />
              Explore All Tours
              <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
