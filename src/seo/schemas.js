// src/seo/schemas.js
// JSON-LD structured data builders for Google rich results

const SITE_URL = "https://evertreknepal.com";
const SITE_NAME = "EverTrek Nepal";
const LOGO_URL = `${SITE_URL}/evertreknepallogo.webp`;
const DEFAULT_IMAGE = `${SITE_URL}/moutainimage.avif`;

// ─── Organization ─────────────────────────────────────────────────────────────
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
      width: 300,
      height: 60,
    },
    image: DEFAULT_IMAGE,
    description:
      "Licensed Nepal trekking agency offering guided treks to Everest Base Camp, Annapurna Circuit, Manaslu, Langtang, and Upper Mustang. Government-registered, TAAN member.",
    telephone: "+977-1-4701234",
    email: "infoevertreknepal@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Thamel",
      addressLocality: "Kathmandu",
      addressRegion: "Bagmati Province",
      postalCode: "44600",
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 27.7172,
      longitude: 85.3240,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    priceRange: "$$$",
    currenciesAccepted: "USD, EUR, GBP, AUD",
    paymentAccepted: "Credit Card, Bank Transfer, PayPal",
    areaServed: {
      "@type": "Country",
      name: "Nepal",
    },
    sameAs: [
      "https://www.facebook.com/evertreknepal",
      "https://www.instagram.com/evertreknepal",
      "https://www.tripadvisor.com/evertreknepal",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "312",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

// ─── WebSite (enables Google Sitelinks Searchbox) ─────────────────────────────
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: "Book guided trekking packages in Nepal — Everest, Annapurna, Manaslu, Langtang, Mustang",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/trekking-in-nepal?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── Breadcrumb ────────────────────────────────────────────────────────────────
export function buildBreadcrumbSchema(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

// ─── TouristTrip (single trek page) ───────────────────────────────────────────
export function buildTrekSchema({ trek, slug, heroData, bookingPrice, reviews = [], departures = [] }) {
  const trekName = trek?.hero?.title || trek?.trek?.title || trek?.title || "";
  const description =
    heroData?.subtitle ||
    trek?.overview?.summary ||
    `Experience the ${trekName} with expert guides. Book with EverTrek Nepal — Nepal's trusted trekking company.`;

  const imageUrl =
    heroData?.imageUrl ||
    trek?.hero?.image_url ||
    DEFAULT_IMAGE;

  const duration = trek?.trek?.duration || trek?.duration || "";
  const difficulty = heroData?.difficulty || trek?.trek?.trip_grade || trek?.trip_grade || "Moderate";
  const region = trek?.region_name || trek?.trek?.region_name || "";
  const maxAltitude = trek?.trek?.max_altitude || trek?.max_altitude || "";
  const startPoint = trek?.trek?.start_point || trek?.start_point || "Kathmandu";

  const price = bookingPrice || trek?.booking_card?.base_price || 0;

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${SITE_URL}/trek/${slug}`,
    name: trekName,
    description,
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    url: `${SITE_URL}/trek/${slug}`,
    touristType: ["Adventure Tourism", "Trekking", "Hiking"],
    itinerary: (trek?.itinerary_days || trek?.itinerary || []).slice(0, 5).map((day) => ({
      "@type": "ItemList",
      name: `Day ${day.day}: ${day.title || ""}`,
      description: (day.description || "").substring(0, 200),
    })),
    offers: price
      ? {
          "@type": "Offer",
          price: String(price),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          validFrom: new Date().toISOString().split("T")[0],
          url: `${SITE_URL}/trek-booking?trekSlug=${slug}`,
          seller: { "@id": `${SITE_URL}/#organization` },
        }
      : undefined,
    provider: { "@id": `${SITE_URL}/#organization` },
    temporalCoverage:
      departures.length > 0
        ? `${departures[0]?.start || ""}/${departures[departures.length - 1]?.end || ""}`
        : undefined,
  };

  // Add AggregateRating only when real reviews exist
  if (reviews.length > 0) {
    const avg = (
      reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length
    ).toFixed(1);
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avg,
      reviewCount: reviews.length,
      bestRating: "5",
      worstRating: "1",
    };
    schema.review = reviews.slice(0, 3).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.reviewer_name || r.name || "Traveler" },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating || 5,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: (r.comment || r.review || "").substring(0, 300),
      datePublished: r.created_at || r.date || new Date().toISOString().split("T")[0],
    }));
  }

  const additionalProps = [];
  if (duration) additionalProps.push({ "@type": "PropertyValue", name: "Duration", value: duration });
  if (difficulty) additionalProps.push({ "@type": "PropertyValue", name: "Difficulty", value: difficulty });
  if (maxAltitude) additionalProps.push({ "@type": "PropertyValue", name: "Max Altitude", value: maxAltitude });
  if (region) additionalProps.push({ "@type": "PropertyValue", name: "Region", value: region });
  if (startPoint) additionalProps.push({ "@type": "PropertyValue", name: "Start Point", value: startPoint });
  if (additionalProps.length) schema.additionalProperty = additionalProps;

  return schema;
}

// ─── FAQPage ──────────────────────────────────────────────────────────────────
export function buildFAQSchema(faqCategories) {
  const allFaqs = [];
  faqCategories.forEach((cat) => {
    (cat.faqs || cat.questions || []).forEach((faq) => {
      allFaqs.push({ q: faq.question || faq.q, a: faq.answer || faq.a });
    });
  });

  if (allFaqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.slice(0, 10).map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: (faq.a || "").substring(0, 400),
      },
    })),
  };
}

// ─── ItemList (region / category pages) ───────────────────────────────────────
export function buildTrekListSchema({ treks, regionName, pageUrl }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${regionName} Treks in Nepal`,
    description: `Browse all guided ${regionName} trekking packages in Nepal. Expert guides, best price guarantee.`,
    url: `${SITE_URL}${pageUrl}`,
    numberOfItems: treks.length,
    itemListElement: treks.map((trek, i) => {
      const slug = trek.slug || trek.trek_slug || trek.public_id || "";
      const name = trek.title || trek.trek_name || trek.name || "";
      const image = trek.card_image_url || trek.hero_image || DEFAULT_IMAGE;
      const price = trek.base_price || trek.price || 0;

      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "TouristTrip",
          name,
          url: `${SITE_URL}/trek/${slug}`,
          image,
          description: trek.overview_summary || trek.subtitle || `${name} with EverTrek Nepal`,
          offers: price
            ? {
                "@type": "Offer",
                price: String(price),
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              }
            : undefined,
          provider: { "@id": `${SITE_URL}/#organization` },
        },
      };
    }),
  };
}

// ─── TouristDestination (region page) ─────────────────────────────────────────
export function buildDestinationSchema({ regionName, description, pageUrl, image, lat, lng }) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: `${regionName} Region, Nepal`,
    description,
    url: `${SITE_URL}${pageUrl}`,
    image: image || DEFAULT_IMAGE,
    geo: lat && lng ? { "@type": "GeoCoordinates", latitude: lat, longitude: lng } : undefined,
    touristType: ["Trekkers", "Adventure Travelers", "Hikers"],
    includesAttraction: [
      {
        "@type": "TouristAttraction",
        name: `${regionName} Trekking Routes`,
        description: `World-class trekking trails through the ${regionName} region of the Himalayas`,
      },
    ],
  };
}

// ─── BlogPosting ──────────────────────────────────────────────────────────────
export function buildBlogSchema({ post, url }) {
  if (!post) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}${url}`,
    headline: post.title || "",
    description: post.excerpt || post.summary || "",
    image: post.featured_image || post.hero_image || DEFAULT_IMAGE,
    url: `${SITE_URL}${url}`,
    datePublished: post.published_at || post.created_at || new Date().toISOString(),
    dateModified: post.updated_at || post.published_at || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: post.author || "EverTrek Nepal",
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${url}` },
    keywords: post.tags?.join(", ") || "trekking nepal, himalaya, adventure travel",
  };
}
