// data/treksData.js
import everestBaseCamp from './everestBaseCamp.js';

// Transform your detailed data into search-compatible format
export const treksData = [
  {
    id: everestBaseCamp.id,
    name: everestBaseCamp.name,
    slug: everestBaseCamp.slug,
    description: everestBaseCamp.overview.articles[0],
    image: everestBaseCamp.bannerImage,
    images: everestBaseCamp.galleryImages,
    price: everestBaseCamp.price.base,
    originalPrice: everestBaseCamp.price.original,
    duration: parseInt(everestBaseCamp.summary.duration),
    difficulty: everestBaseCamp.summary.tripGrade,
    region: everestBaseCamp.region,
    maxAltitude: parseInt(everestBaseCamp.summary.maxAltitude.replace(/[^\d]/g, '')),
    groupSize: everestBaseCamp.summary.groupSize,
    bestSeason: everestBaseCamp.weather,
    highlights: everestBaseCamp.highlights.map(h => h.title),
    included: everestBaseCamp.cost.inclusions,
    excluded: everestBaseCamp.cost.exclusions,
    rating: everestBaseCamp.rating,
    reviewCount: everestBaseCamp.reviewsCount,
    availability: everestBaseCamp.availability.seasons.length > 0,
    featured: everestBaseCamp.featured,
    tags: everestBaseCamp.tags,
    itinerary: everestBaseCamp.itinerary,
    faqs: everestBaseCamp.faqs,
    reviews: everestBaseCamp.reviewsList,
    elevationData: everestBaseCamp.elevationData,
    similarTreks: everestBaseCamp.similar_treks
  },
  // Add more treks here following the same pattern
  {
    id: "annapurna-circuit-001",
    name: "Annapurna Circuit Trek - 16 Days",
    slug: "annapurna-circuit-trek",
    description: "Experience diverse landscapes from subtropical forests to high mountain deserts in this legendary circuit.",
    image: "/annapurna.jpeg",
    images: ["/annapurna.jpeg", "/annapurna-2.jpg"],
    price: 899,
    originalPrice: 1099,
    duration: 16,
    difficulty: "Moderate",
    region: "annapurna",
    maxAltitude: 5416,
    groupSize: "2-15",
    bestSeason: "March-May, October-December",
    highlights: ["Thorong La Pass at 5,416m", "Diverse landscapes", "Hot springs at Tatopani", "Muktinath Temple"],
    included: ["Accommodation", "Meals", "Guide"],
    excluded: ["Flights", "Insurance"],
    rating: 4.7,
    reviewCount: 203,
    availability: true,
    featured: true,
    tags: ["circuit", "diverse", "temple", "hot-springs"],
    itinerary: [],
    faqs: [],
    reviews: [],
    elevationData: [],
    similarTreks: []
  }
];

export const regions = [
  { id: 1, name: "everest", displayName: "Everest", count: 15, image: "/everest-region.jpg" },
  { id: 2, name: "annapurna", displayName: "Annapurna", count: 22, image: "/annapurna-region.jpg" },
  { id: 3, name: "manaslu", displayName: "Manaslu", count: 8, image: "/manaslu-region.jpg" },
  { id: 4, name: "langtang", displayName: "Langtang", count: 12, image: "/langtang-region.jpg" }
];

export const difficulties = ["Easy", "Moderate", "Strenuous", "Challenging"];
export const durations = ["1-7 days", "8-14 days", "15-21 days", "22+ days"];
