// src/data/everestBaseCamp.js

/**
 * Full data module for the Everest Base Camp Trek,
 * now exported as an ID-keyed lookup so you can do
 * allTreksData[1] → everestBaseCamp object.
 */

const everestBaseCamp = {
  hero: {
    title: "Everest Base Camp Trek",
    subtitle:
      "Follow in the footsteps of legends through Sherpa villages & Himalayan panoramas.",
    highlights: [
      { label: "Duration", value: "16 days" },
      { label: "Difficulty", value: "Moderate" },
      { label: "Season", value: "Mar–May, Sep–Nov" },
      { label: "Location", value: "Solukhumbu, Nepal" },
    ],
    imageUrl: "/images/everest-hero.jpg",
    ctaLabel: "Book Now",
    ctaLink: "/book",
    season: "Mar–May, Sep–Nov",
    duration: "16 days",
    difficulty: "Moderate",
    location: "Everest Region",
  },
  summary: {
    overview:
      "Embark on a breathtaking journey from Lukla to Everest Base Camp at 5,364 m—one of the most iconic treks in the world.",
  },
  highlights: [
    {
      icon: "culture",
      title: "Sherpa Culture",
      description:
        "Immerse yourself in local traditions, tea-houses & mountain hospitality.",
    },
    {
      icon: "scenery",
      title: "Panoramic Views",
      description: "Stand in awe before Everest, Lhotse, Nuptse & Ama Dablam.",
    },
    {
      icon: "wildlife",
      title: "Himalayan Flora & Fauna",
      description: "Spot cheer pheasants, musk deer and rhododendron forests.",
    },
    {
      icon: "photography",
      title: "Photography",
      description: "Capture iconic sunrises over towering peaks.",
    },
  ],
  description: {
    overview:
      "If there is one journey the spirit should walk in this life, it’s to the roof of the world. This trek weaves history, culture, and epic vistas into every step.",
    sections: [
      {
        title: "Trip Overview",
        content:
          "Walk, explore, and discover the same trails first pioneered by Sir Edmund Hillary & Tenzing Norgay.",
      },
      {
        title: "Acclimatization",
        content:
          "We build in two acclimatization days at Namche & Dingboche for a safe, enjoyable ascent.",
      },
      {
        title: "Local Interaction",
        content:
          "Stay in family-run tea-houses, meet Sherpa guides, and learn about Buddhist monastery rituals.",
      },
    ],
  },
  itinerary: [
    {
      day: 1,
      title: "Kathmandu → Lukla → Phakding",
      elevation: "2,743 m",
      duration: "5 hrs trekking",
      description: "Scenic flight…",
      highlights: ["Lukla airstrip", "Prayer flags"],
      image: "/images/day1.jpg",
    },
    {
      day: 2,
      title: "Phakding → Namche Bazaar",
      elevation: "3,440 m",
      duration: "6 hrs trekking",
      description: "Cross suspension bridges…",
      highlights: ["NP gate", "Himalayan views"],
      image: "/images/day2.jpg",
    },
    /* …days 3–16… */
  ],
  cost: {
    inclusions: [
      "Airport pick-up & drop",
      "All permits & TIMS",
      "Tea-house accommodation",
      "All meals on trek",
      "Sherpa guide & porter",
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
    ],
  },
  faqs: [
    {
      id: "general",
      icon: "help",
      title: "General",
      questions: [
        {
          question: "Best time to trek?",
          answer: "March–May & September–November for clear skies.",
        },
        {
          question: "Required fitness level?",
          answer: "Moderate; prior hiking experience recommended.",
        },
      ],
    },
    /* accommodation, gear, safety… */
  ],
  gallery: [
    "/images/gallery1.jpg",
    "/images/gallery2.jpg",
    /* …more… */
  ],
  testimonials: [
    {
      name: "Sarah Chen",
      title: "Travel Blogger, USA",
      image: "/testimonials/sarah.jpg",
      quote: "Life-changing journey!",
      rating: 5,
    },
    /* …more… */
  ],
  map: {
    image: "/images/everest-map.jpg",
    description: "Topographic map marking Lukla, Namche, EBC & Kala Patthar.",
  },
  elevationData: [
    { day: "Day 1", elevation: 2860 },
    /* …up through Day 16… */
  ],
  booking: {
    trekName: "Everest Base Camp Trek",
    basePrice: 1250,
    discount: 0,
    groups: [
      { size: 1, price: 1250 },
      { size: 2, price: 2400 },
      /* … */
    ],
    mapLink: "https://goo.gl/maps/YourGoogleMapLinkHere",
  },
};

// — now wrap it under its ID so we can do allTreksData[1] → everestBaseCamp
const allTreksData = {
  1: everestBaseCamp,
};

export default allTreksData;
