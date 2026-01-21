import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Star, MapPin, Clock, Users } from "lucide-react";
import { fetchTours } from "../../api/tourService.js";
import HeroBreadcrumbs from "../../components/Breadcrumb/HeroBreadcrumbs.jsx";
import { useHideLayoutBreadcrumbs } from "../../components/Breadcrumb/BreadcrumbVisibilityContext.jsx";

export default function Tours() {
  const { search } = useLocation();
  useHideLayoutBreadcrumbs();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const styleFilter = params.get("style");
  const categoryFilter = params.get("category");
  const tagFilter = params.get("tag");
  const queryFilter = params.get("q");
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadTours = async () => {
      setLoading(true);
      setError("");
      const data = await fetchTours({
        style: styleFilter || undefined,
        category: categoryFilter || undefined,
        tag: tagFilter || undefined,
        q: queryFilter || undefined,
      });
      if (!isMounted) return;
      setTours(data);
      setLoading(false);
      if (!data.length) {
        setError("No tours available right now.");
      }
    };
    loadTours();
    return () => {
      isMounted = false;
    };
  }, [styleFilter, categoryFilter, tagFilter, queryFilter]);

  const filteredTours = useMemo(() => {
    let result = tours;
    if (styleFilter) {
      const key = styleFilter.toLowerCase();
      result = result.filter(
        (tour) =>
          tour.travelStyle?.toLowerCase() === key ||
          tour.travel_style?.toLowerCase() === key ||
          tour.categories?.some((category) => category.toLowerCase() === key) ||
          tour.tags?.some((tag) => tag.toLowerCase() === key)
      );
    }
    if (categoryFilter) {
      const key = categoryFilter.toLowerCase();
      result = result.filter((tour) =>
        tour.categories?.some((category) => category.toLowerCase() === key)
      );
    }
    if (tagFilter) {
      const key = tagFilter.toLowerCase();
      result = result.filter((tour) =>
        tour.tags?.some((tag) => tag.toLowerCase() === key)
      );
    }
    if (queryFilter) {
      const key = queryFilter.toLowerCase();
      result = result.filter(
        (tour) =>
          tour.title?.toLowerCase().includes(key) ||
          tour.tagline?.toLowerCase().includes(key) ||
          String(tour.duration || "").toLowerCase().includes(key)
      );
    }
    return result;
  }, [styleFilter, categoryFilter, tagFilter, queryFilter, tours]);

  const seoTitle = useMemo(() => {
    if (styleFilter) return `${styleFilter} Tours in Nepal | Evertrek`;
    if (categoryFilter) return `${categoryFilter} Tours in Nepal | Evertrek`;
    if (tagFilter) return `${tagFilter} Tours in Nepal | Evertrek`;
    if (queryFilter) return `Search Tours: ${queryFilter} | Evertrek`;
    return "Nepal Tours & Travel Styles | Evertrek";
  }, [styleFilter, categoryFilter, tagFilter, queryFilter]);

  const seoDescription = useMemo(() => {
    if (styleFilter) {
      return `Discover ${styleFilter} tours in Nepal. Curated experiences, flexible schedules, and local guides.`;
    }
    if (categoryFilter) {
      return `Explore ${categoryFilter} tours in Nepal with handpicked itineraries and local expertise.`;
    }
    if (tagFilter) {
      return `Browse Nepal tours tagged ${tagFilter} for your next unforgettable journey.`;
    }
    if (queryFilter) {
      return `Search results for "${queryFilter}" across Nepal tours and travel styles.`;
    }
    return "Browse Nepal tours by travel style, duration, and highlights. Adventure, culture, scenic, and more.";
  }, [styleFilter, categoryFilter, tagFilter, queryFilter]);

  const baseUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin.replace(/\/$/, "");
  }, []);

  const canonicalUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href.split("?")[0];
  }, []);

  const heroBreadcrumbs = useMemo(() => {
    const base = [
      { label: "Home", url: "/" },
      { label: "Travel Activities", url: "/travel-activities/tours" },
    ];
    const label =
      styleFilter || categoryFilter || tagFilter || queryFilter || "Travel Styles";
    return [...base, { label }];
  }, [styleFilter, categoryFilter, tagFilter, queryFilter]);

  const listStructuredData = useMemo(() => {
    if (!filteredTours.length) return null;
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: filteredTours.slice(0, 12).map((tour, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/travel-activities/tours/${tour.slug || tour.public_id}`,
        name: tour.title,
      })),
    };
  }, [filteredTours, baseUrl]);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-5">
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      {listStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(listStructuredData)}
        </script>
      )}

      <section className="relative min-h-[60vh] mb-12 overflow-hidden">
        <img
          src="/tours"
          alt="Travel activities hero"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black/70 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20">
          <HeroBreadcrumbs breadcrumbs={heroBreadcrumbs} className="mb-6" />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            {styleFilter || categoryFilter || tagFilter
              ? `${styleFilter || categoryFilter || tagFilter} Tours in Nepal`
              : "Travel Styles in Nepal"}
          </h1>
          <p className="mt-5 max-w-3xl px-4 text-lg md:text-xl text-white/80">
            {queryFilter
              ? `Search results for "${queryFilter}".`
              : "Choose curated day tours, hikes, and cultural journeys for every travel style."}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mb-12 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
          {styleFilter || categoryFilter || tagFilter
            ? `${styleFilter || categoryFilter || tagFilter} Tours in Nepal`
            : "Travel Styles in Nepal"}
        </h1>
        <p className="mt-5 max-w-3xl mx-auto text-lg md:text-xl text-slate-600">
          {queryFilter
            ? `Search results for "${queryFilter}".`
            : "Choose from curated day tours, hikes, and cultural journeys designed for comfort, pace, and unforgettable views."}
        </p>
      </section>

      <section
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
        aria-label="Travel styles tours"
      >
        {loading && (
          <div className="col-span-full text-center text-gray-500">
            Loading tours...
          </div>
        )}
        {!loading && error && (
          <div className="col-span-full text-center text-gray-500">
            {error}
          </div>
        )}
        {filteredTours.map((tour) => (
          <Link
            key={tour.slug || tour.public_id}
            to={`/travel-activities/tours/${tour.slug || tour.id}`}
            className="block group"
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden group-hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <img
                  src={tour.image || tour.image_url}
                  alt={tour.title || "Tour"}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {tour.badge && (
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs font-semibold uppercase px-2 py-1 rounded">
                    {tour.badge}
                  </span>
                )}

                {Number(tour.oldPrice ?? tour.originalPrice ?? 0) >
                  Number(tour.basePrice ?? tour.price ?? 0) && (
                  <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    Save ${Math.round(
                      Number(tour.oldPrice ?? tour.originalPrice ?? 0) -
                        Number(tour.basePrice ?? tour.price ?? 0)
                    )}
                  </span>
                )}
              </div>

              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {tour.title}
                </h3>

                <div className="flex items-center text-sm text-gray-600 space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{tour.duration}</span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-600">
                    US${Number(tour.basePrice ?? tour.price ?? 0).toFixed(0)}
                  </span>
                {Number(tour.oldPrice ?? tour.originalPrice ?? 0) >
                  Number(tour.basePrice ?? tour.price ?? 0) && (
                  <span className="text-gray-400 line-through text-xs">
                    US${Number(tour.oldPrice ?? tour.originalPrice ?? 0).toFixed(0)}
                  </span>
                )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {tour.tagline ||
                    tour.shortDescription ||
                    tour.short_description ||
                    ""}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  {tour.location && (
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{tour.location}</span>
                    </div>
                  )}
                  {(tour.groupSize || tour.group_size) && (
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      <span>Up to {tour.groupSize || tour.group_size}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(tour.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {Number(tour.rating || 0).toFixed(1)} ({tour.reviews || tour.reviews_count || 0})
                    </span>
                  </div>

                  <span className="text-emerald-600 text-sm font-medium">
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
