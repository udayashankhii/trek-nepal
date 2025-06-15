// src/data/everestBaseCamp.js

/**
 * Full data module for the Everest Base Camp Trek.
 * Includes hero, summary, highlights, description, itinerary (16 days),
 * cost details, FAQs, gallery images, testimonials, map info, elevation data,
 * and booking defaults.
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
    duration: "15 Days",
    tripGrade: "Strenuous",
    startPoint: "TIA Kathmandu",
    groupSize: "1–25 pax",
    maxAltitude: "5,545 m",
    activity: "Trek, Sightseeing & Hiking",
    rating: 5,
    reviews: 3,
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
      description:
        "Scenic flight to Lukla, then hike along the Dudh Koshi river to Phakding village.",
      highlights: ["Lukla airstrip", "Prayer flags"],
      image: "/images/day1.jpg",
    },
    {
      day: 2,
      title: "Phakding → Namche Bazaar",
      elevation: "3,440 m",
      duration: "6 hrs trekking",
      description:
        "Cross suspension bridges, enter Sagarmatha National Park, arrive in Sherpa hub Namche.",
      highlights: ["NP gate", "Himalayan views"],
      image: "/images/day2.jpg",
    },
    {
      day: 3,
      title: "Acclimatization Day in Namche",
      elevation: "3,440 m",
      duration: "Explore local sights",
      description:
        "Day hike to Everest View Hotel for panoramic vistas and cultural immersion.",
      highlights: ["Hotel viewpoint", "Sherpa museum"],
      image: "/images/day3.jpg",
    },
    {
      day: 4,
      title: "Namche → Tengboche",
      elevation: "3,867 m",
      duration: "5 hrs trekking",
      description:
        "Trek through forests, visit Tengboche Monastery with Everest backdrop.",
      highlights: ["Monastery", "Prayer chants"],
      image: "/images/day4.jpg",
    },
    {
      day: 5,
      title: "Tengboche → Dingboche",
      elevation: "4,360 m",
      duration: "5 hrs trekking",
      description:
        "Gentle ascent with Himalayan panoramas en route to Dingboche.",
      highlights: ["Thukla pass", "Island Peak view"],
      image: "/images/day5.jpg",
    },
    {
      day: 6,
      title: "Acclimatization in Dingboche",
      elevation: "4,360 m",
      duration: "Short hikes",
      description:
        "Hike to Nagarjuna Hill for altitude adaptation and 360° views.",
      highlights: ["Hilltop view", "Sherpa tea"],
      image: "/images/day6.jpg",
    },
    {
      day: 7,
      title: "Dingboche → Lobuche",
      elevation: "4,940 m",
      duration: "5 hrs trekking",
      description: "Cross Khumbu Glacier moraines to arrive in Lobuche.",
      highlights: ["Glacier", "Memorial wall"],
      image: "/images/day7.jpg",
    },
    {
      day: 8,
      title: "Lobuche → Everest BC → Gorak Shep",
      elevation: "5,364/5,164 m",
      duration: "8 hrs trekking",
      description: "Summit trek to EBC then descend to Gorak Shep.",
      highlights: ["EBC signpost", "Glacial terrain"],
      image: "/images/day8.jpg",
    },
    {
      day: 9,
      title: "Gorak Shep → Kala Patthar → Pheriche",
      elevation: "5,545/4,371 m",
      duration: "7 hrs trekking",
      description:
        "Pre-dawn hike to Kala Patthar for sunrise, descend to Pheriche.",
      highlights: ["Sunrise view", "Everest panorama"],
      image: "/images/day9.jpg",
    },
    {
      day: 10,
      title: "Pheriche → Tengboche",
      elevation: "3,867 m",
      duration: "6 hrs trekking",
      description: "Retrace steps through forests back to Tengboche.",
      highlights: ["Forest trail", "Monastery visit"],
      image: "/images/day10.jpg",
    },
    {
      day: 11,
      title: "Tengboche → Namche Bazaar",
      elevation: "3,440 m",
      duration: "5 hrs trekking",
      description: "Easy descent to Namche, explore cafes and shops.",
      highlights: ["Coffee shops", "Local market"],
      image: "/images/day11.jpg",
    },
    {
      day: 12,
      title: "Namche → Lukla",
      elevation: "2,860 m",
      duration: "6 hrs trekking",
      description: "Final trek leg through terraced fields back to Lukla.",
      highlights: ["Terraced fields", "Farewell party"],
      image: "/images/day12.jpg",
    },
    {
      day: 13,
      title: "Lukla → Kathmandu",
      elevation: "1,400 m",
      duration: "Flight + transfer",
      description: "Morning flight to Kathmandu, hotel transfer.",
      highlights: ["Scenic flight", "City return"],
      image: "/images/day13.jpg",
    },
    {
      day: 14,
      title: "Leisure Day in Kathmandu",
      elevation: "1,400 m",
      duration: "Sightseeing",
      description: "Visit Pashupatinath, Boudhanath & Durbar Square.",
      highlights: ["Cultural tour", "Shopping"],
      image: "/images/day14.jpg",
    },
    {
      day: 15,
      title: "Optional Excursions",
      elevation: null,
      duration: "Varies",
      description: "Choose Nagarkot sunrise or Pokhara day trip.",
      highlights: ["Nagarkot", "Paragliding"],
      image: "/images/day15.jpg",
    },
    {
      day: 16,
      title: "Departure from Kathmandu",
      elevation: "1,400 m",
      duration: null,
      description: "Transfer to airport for flight home.",
      highlights: ["Airport transfer", "Farewells"],
      image: "/images/day16.jpg",
    },
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
    {
      id: "accommodation",
      icon: "home",
      title: "Accommodation",
      questions: [
        {
          question: "What are tea-house facilities?",
          answer: "Basic twin-sharing rooms with shared bathrooms.",
        },
        {
          question: "Are single rooms available?",
          answer: "Limited; subject to availability at extra cost.",
        },
      ],
    },
    {
      id: "gear",
      icon: "box",
      title: "Equipment",
      questions: [
        {
          question: "What gear to bring?",
          answer:
            "Layered clothing, sleeping bag (rated to -10°C), trekking boots.",
        },
        {
          question: "Can I rent equipment?",
          answer: "Yes, sleeping bags and down jackets available in Kathmandu.",
        },
      ],
    },
    {
      id: "safety",
      icon: "shield",
      title: "Safety",
      questions: [
        {
          question: "How is altitude sickness managed?",
          answer:
            "We follow gradual ascent and rest days; guides carry oxygen.",
        },
        {
          question: "Is travel insurance required?",
          answer: "Yes, must cover high-altitude evacuation.",
        },
      ],
    },
  ],

  gallery: [
    "/images/gallery1.jpg",
    "/images/gallery2.jpg",
    "/images/gallery3.jpg",
    "/images/gallery4.jpg",
    "/images/gallery5.jpg",
  ],

  testimonials: [
    {
      name: "Sarah Chen",
      title: "Travel Blogger, USA",
      image: "/testimonials/sarah.jpg",
      quote: "Life-changing journey!",
      rating: 5,
    },
    {
      name: "Rajiv Thapa",
      title: "Photographer, Nepal",
      image: "/testimonials/rajiv.jpg",
      quote: "Epic scenery and professional support.",
      rating: 4.5,
    },
    {
      name: "Emily Wong",
      title: "Adventure Seeker, UK",
      image: "/testimonials/emily.jpg",
      quote: "Exceeded all expectations!",
      rating: 5,
    },
  ],

  map: {
    image: "/images/everest-map.jpg",
    description: "Topographic map marking Lukla, Namche, EBC & Kala Patthar.",
  },

  elevationData: [
    { day: "Day 1", elevation: 2860 },
    { day: "Day 2", elevation: 3440 },
    { day: "Day 3", elevation: 3440 },
    { day: "Day 4", elevation: 3867 },
    { day: "Day 5", elevation: 4360 },
    { day: "Day 6", elevation: 4360 },
    { day: "Day 7", elevation: 4940 },
    { day: "Day 8", elevation: 5364 },
    { day: "Day 9", elevation: 5545 },
    { day: "Day 10", elevation: 3867 },
    { day: "Day 11", elevation: 3440 },
    { day: "Day 12", elevation: 2860 },
    { day: "Day 13", elevation: 1400 },
    { day: "Day 14", elevation: 1400 },
    { day: "Day 15", elevation: null },
    { day: "Day 16", elevation: 1400 },
  ],

  booking: {
    trekName: "Everest Base Camp Trek",
    basePrice: 1250,
    discount: 0,

    groups: [
      { size: 1, price: 1250 },
      { size: 2, price: 2400 },
      { size: 4, price: 4500 },
      { size: 6, price: 6600 },
    ],

    mapLink: "https://goo.gl/maps/YourGoogleMapLinkHere",
  },
};

// Optional “View on map” link
// mapLink: "https://goo.gl/maps/YourGoogleMapLinkHere"

export default everestBaseCamp;
