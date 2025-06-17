// src/data/everestBaseCamp.js
import FAQSection from "../treks/trekkingpage/FAQSection";

const everestBaseCamp = {
  // ==================== API & DATABASE ESSENTIALS ====================
  id: "ebc-001", // Unique database ID
  slug: "everest-base-camp-trek", // URL-friendly identifier for routing
  region: "everest", // For filtering and categorization
  status: "active", // active, inactive, draft, archived
  featured: true, // For featured trek listings
  priority: 1, // Display order priority
  createdAt: "2024-01-15T00:00:00Z", // Database timestamp
  updatedAt: "2025-06-16T10:09:00Z", // Last modified timestamp
  publishedAt: "2024-01-15T00:00:00Z", // When trek was published

  // ==================== BASIC INFORMATION ====================
  name: "Everest Base Camp Trek – 15 Days",
  shortName: "EBC Trek",
  title: "Everest Base Camp Trek",
  subtitle:
    "Follow in the footsteps of legends through Sherpa villages & Himalayan panoramas",
  bannerImage: "/assets/abcd.png",

  // ==================== SUMMARY & KEY INFO ====================
  summary: {
    duration: "15 Days",
    tripGrade: "Strenuous",
    startPoint: "TIA Kathmandu",
    groupSize: "1–25 pax",
    maxAltitude: "5,545 m",
    activity: "Trek, Sightseeing & Hiking",
    rating: 5,
    reviewsCount: 3,
  },

  keyInfo: {
    duration: "15 Days",
    tripGrade: "Strenuous",
    startPoint: "TIA Kathmandu",
    groupSize: "1–25 pax",
    maxAltitude: "5,545 m",
    activity: "Trek, Sightseeing & Hiking",
  },

  // ==================== PRICING STRUCTURE ====================
  price: {
    base: 1490,
    original: 1550,
    currency: "USD",
    discountPercentage: 4,
    groups: [
      { size: "1–4", price: 1490, pricePerPerson: 1490 },
      { size: "5–10", price: 1390, pricePerPerson: 1390 },
      { size: "11–25", price: 1290, pricePerPerson: 1290 },
    ],
  },

  booking: {
    trekName: "Everest Base Camp Trek",
    basePrice: 1490,
    discount: 60,
    finalPrice: 1490,
    groups: [
      { size: 1, price: 1490 },
      { size: 2, price: 2980 },
      { size: 4, price: 5960 },
      { size: 6, price: 8340 },
    ],
    mapLink: "https://goo.gl/maps/EverestBaseCampTrek",
    bookingUrl: "/book/everest-base-camp",
  },

  // ==================== RATING & REVIEWS ====================
  rating: 5,
  reviews: "based on 3",
  reviewsCount: 3,
  averageRating: 4.85,
  totalReviews: 3,

  // ==================== TREK HIGHLIGHTS ====================
  highlights: [
    {
      id: 1,
      icon: "sparkles",
      title: "Luxury Welcome Dinner",
      subtitle: "Celebrate your arrival with a cultural night in Kathmandu",
      description:
        "Experience authentic Nepali culture with traditional dance and cuisine",
    },
    {
      id: 2,
      icon: "globe",
      title: "Authentic Local Immersion",
      subtitle: "Connect with Sherpa communities in their mountain homes",
      description:
        "Stay in traditional tea houses and learn about Sherpa culture",
    },
    {
      id: 3,
      icon: "mountain",
      title: "Summit Viewpoint Hike",
      subtitle: "Reach Kala Patthar at 5,545 m for an unforgettable sunrise",
      description:
        "Witness breathtaking views of Everest, Lhotse, and surrounding peaks",
    },
    {
      id: 4,
      icon: "user",
      title: "Top-Tier Guides",
      subtitle: "Licensed, first-aid trained leaders with deep local expertise",
      description:
        "Professional guides ensure your safety and enrich your experience",
    },
  ],

  // ==================== OVERVIEW & DESCRIPTION ====================
  overview: {
    heading: "Trek Overview",
    articles: [
      "The Everest Base Camp Trek is a legendary journey to the base of the world's highest mountain. It combines majestic Himalayan scenery, rich Sherpa culture, and rewarding physical challenge.",
      "Travelers traverse suspension bridges, alpine forests, glacial moraines, and ancient monasteries while experiencing the warmth of Sherpa hospitality.",
    ],
    bullets: [
      "15-day fully guided itinerary",
      "Maximum altitude: 5,545 meters at Kala Patthar",
      "Two acclimatization days included for safety",
      "Experienced Sherpa guides and porters",
      "Tea house accommodation throughout the trek",
      "All permits and park fees included",
    ],
  },

  description: {
    overview:
      "If there is one journey the spirit should walk in this life, it's to the roof of the world. This trek weaves history, culture, and epic vistas into every step.",
    sections: [
      {
        id: 1,
        title: "Trip Overview",
        content:
          "Walk, explore, and discover the same trails first pioneered by Sir Edmund Hillary & Tenzing Norgay in 1953.",
      },
      {
        id: 2,
        title: "Acclimatization",
        content:
          "We build in two acclimatization days at Namche Bazaar & Dingboche for a safe, enjoyable ascent.",
      },
      {
        id: 3,
        title: "Local Interaction",
        content:
          "Stay in family-run tea houses, meet experienced Sherpa guides, and learn about Buddhist monastery rituals.",
      },
    ],
  },

  // ==================== COST INCLUSIONS & EXCLUSIONS ====================
  cost: {
    inclusions: [
      "Airport pick-up & drop by private vehicle",
      "Kathmandu city tour with professional guide",

      "11 nights tea house accommodation (twin-sharing basis)",
      "Licensed English-speaking trekking guide",
      "One porter per 2 trekkers (maximum 10 kg per person)",
      "All necessary permits and park entry fees",
    ],
    exclusions: [
      "International airfare to/from Nepal",
      "Travel and rescue insurance (mandatory)",
      "Personal expenses (drinks, Wi-Fi, laundry, phone calls)",
      "Sleeping bag and personal trekking gear rental",
      "Tips for guide, porter, and driver",
      "Extra meals in Kathmandu",
      "Hot showers and battery charging during trek",
      "Personal trekking equipment",
      "Any expenses arising due to unforeseen circumstances",
    ],
  },

  // Alternative naming for backward compatibility
  includes: [
    "Airport pick-up & drop by private vehicle",
    "Kathmandu city tour with guide",
    "3× nights hotel + breakfast",
    "Full board meals + daily tea & soup",
    "Round-trip flight KTM ↔ Lukla",
    "11 nights tea-house twin-sharing",
    "Licensed English-speaking guide",
    "A porter per 2 trekkers (max 10 kg each)",
    "All permits & park fees",
    "Welcome dinner with cultural show",
    "Medical kit carried by guide",
  ],

  excludes: [
    "International airfare",
    "Travel insurance",
    "Personal expenses (drinks, Wi-Fi)",
    "Sleeping bag & gear rental",
    "Tips for guide/staff",
  ],

  // ==================== DETAILED ITINERARY ====================
  itinerary: [
    {
      id: 1,
      day: 1,
      title: "Arrival in Kathmandu & Hotel Transfer",
      elevation: "1,350 m",
      duration: null,
      walkingHours: null,
      description:
        "Private pickup from Tribhuvan International Airport, hotel check-in, and orientation. Explore Thamel district at leisure.",
      accommodation: "3-star hotel in Kathmandu",
      meals: "Welcome dinner",
      altitude: "1,350 m",
      highlights: ["Airport transfer", "Hotel check-in", "Thamel exploration"],
      image: "/images/day1.jpg",
      activities: ["Airport pickup", "Hotel check-in", "Trip briefing"],
    },
    {
      id: 2,
      day: 2,
      title: "UNESCO World Heritage Site Tour",
      elevation: "1,400 m",
      duration: "6-7 hours sightseeing",
      walkingHours: "4-5 hours",
      description:
        "Guided tour of Kathmandu Durbar Square, Pashupatinath Temple, Boudhanath Stupa & Patan Durbar Square.",
      accommodation: "3-star hotel in Kathmandu",
      meals: "Breakfast",
      altitude: "1,400 m",
      highlights: ["Cultural tour", "UNESCO sites", "Shopping time"],
      image: "/images/day2.jpg",
      activities: ["Cultural sightseeing", "Shopping", "Trek preparation"],
    },
    {
      id: 3,
      day: 3,
      title: "Kathmandu → Lukla → Phakding",
      elevation: "2,743 m",
      duration: "5 hours trekking",
      walkingHours: "3-4 hours",
      description:
        "Early morning scenic flight to Lukla (35 minutes), then trek along the Dudh Koshi river to Phakding village.",
      accommodation: "Tea house",
      meals: "Breakfast, Lunch, Dinner",
      altitude: "2,743 m",
      highlights: [
        "Lukla airstrip landing",
        "First day trekking",
        "Prayer flags",
      ],
      image: "/images/day3.jpg",
      activities: ["Scenic flight", "Trek start", "River crossing"],
    },
    {
      id: 4,
      day: 4,
      title: "Phakding → Namche Bazaar",
      elevation: "3,440 m",
      duration: "6 hours trekking",
      walkingHours: "5-6 hours",
      description:
        "Cross several suspension bridges, enter Sagarmatha National Park, and arrive in the Sherpa capital Namche Bazaar.",
      accommodation: "Tea house",
      meals: "Breakfast, Lunch, Dinner",
      altitude: "3,440 m",
      highlights: [
        "National park entry",
        "Hillary Bridge",
        "First Everest view",
      ],
      image: "/images/day4.jpg",
      activities: ["Bridge crossings", "Park entry", "Steep ascent"],
    },
    {
      id: 5,
      day: 5,
      title: "Acclimatization Day in Namche Bazaar",
      elevation: "3,440 m",
      duration: "Explore local area",
      walkingHours: "3-4 hours",
      description:
        "Rest day with optional hike to Everest View Hotel for acclimatization and panoramic mountain views.",
      accommodation: "Tea house",
      meals: "Breakfast, Lunch, Dinner",
      altitude: "3,440 m",
      highlights: ["Everest View Hotel", "Sherpa Museum", "Market exploration"],
      image: "/images/day5.jpg",
      activities: ["Acclimatization hike", "Cultural exploration", "Rest"],
    },
    {
      id: 6,
      day: 6,
      title: "Namche Bazaar → Tengboche",
      elevation: "3,867 m",
      duration: "5 hours trekking",
      walkingHours: "5-6 hours",
      description:
        "Trek through rhododendron forests with stunning mountain views to reach Tengboche Monastery.",
      accommodation: "Tea house",
      meals: "Breakfast, Lunch, Dinner",
      altitude: "3,867 m",
      highlights: [
        "Tengboche Monastery",
        "Mountain panorama",
        "Evening prayers",
      ],
      image: "/images/day6.jpg",
      activities: ["Forest trekking", "Monastery visit", "Photography"],
    },
    {
      id: 7,
      day: 7,
      title: "Tengboche → Dingboche",
      elevation: "4,360 m",
      duration: "5 hours trekking",
      walkingHours: "5-6 hours",
      description:
        "Descend to Debuche, cross the Imja River, and ascend to the beautiful valley of Dingboche.",
      accommodation: "Tea house",
      meals: "Breakfast, Lunch, Dinner",
      altitude: "4,360 m",
      highlights: ["Imja Valley", "Stone walls", "Island Peak view"],
      image: "/images/day7.jpg",
      activities: ["Valley trekking", "River crossing", "Altitude gain"],
    },
    {
      id: 8,
      day: 8,
      title: "Acclimatization Day in Dingboche",
      elevation: "4,360 m",
      duration: "Rest day with optional hike",
      walkingHours: "3-4 hours",
      description:
        "Second acclimatization day with optional hike to Nagarjuna Hill for better altitude adaptation.",
      accommodation: "Tea house",
      meals: "Breakfast, Lunch, Dinner",
      altitude: "4,360 m",
      highlights: [
        "Nagarjuna Hill",
        "360° mountain views",
        "Rest and recovery",
      ],
      image: "/images/day8.jpg",
      activities: ["Acclimatization hike", "Rest", "Preparation"],
    },
    {
      id: 9,
      day: 9,
      title: "Dingboche → Lobuche",
      elevation: "4,940 m",
      duration: "5 hours trekking",
      walkingHours: "5-6 hours",
      description:
        "Trek through the Khumbu Glacier's terminal moraine to reach Lobuche with views of Nuptse.",
      accommodation: "Tea house",
      meals: "Breakfast, Lunch, Dinner",
      altitude: "4,940 m",
      highlights: ["Thukla Pass", "Memorial stones", "Glacier views"],
      image: "/images/day9.jpg",
      activities: ["Moraine trekking", "Memorial visit", "High altitude"],
    },
    {
      id: 10,
      day: 10,
      title: "Lobuche → Everest Base Camp → Gorak Shep",
      elevation: "5,364 m / 5,164 m",
      duration: "8 hours trekking",
      walkingHours: "7-8 hours",
      description:
        "Early morning trek to Everest Base Camp, then return to Gorak Shep for overnight stay.",
      accommodation: "Tea house",
      meals: "Breakfast, Lunch, Dinner",
      altitude: "5,364 m (EBC) / 5,164 m (Gorak Shep)",
      highlights: [
        "Everest Base Camp",
        "Khumbu Icefall",
        "Achievement celebration",
      ],
      image: "/images/day10.jpg",
      activities: ["Base camp visit", "Photography", "Celebration"],
    },
    {
      id: 11,
      day: 11,
      title: "Gorak Shep → Kala Patthar → Pheriche",
      elevation: "5,545 m / 4,371 m",
      duration: "7 hours trekking",
      walkingHours: "6-7 hours",
      description:
        "Pre-dawn hike to Kala Patthar for sunrise views of Everest, then descend to Pheriche.",
      accommodation: "Tea house",
      meals: "Breakfast, Lunch, Dinner",
      altitude: "5,545 m (Kala Patthar) / 4,371 m (Pheriche)",
      highlights: [
        "Kala Patthar sunrise",
        "Everest summit view",
        "Descent begins",
      ],
      image: "/images/day11.jpg",
      activities: ["Sunrise hike", "Summit views", "Long descent"],
    },
    {
      id: 12,
      day: 12,
      title: "Pheriche → Tengboche",
      elevation: "3,867 m",
      duration: "6 hours trekking",
      walkingHours: "5-6 hours",
      description:
        "Retrace steps through the valley, crossing the Imja River back to Tengboche Monastery.",
      accommodation: "Tea house",
      meals: "Breakfast, Lunch, Dinner",
      altitude: "3,867 m",
      highlights: ["Monastery return", "Forest trails", "Familiar paths"],
      image: "/images/day12.jpg",
      activities: ["Descent trekking", "Monastery visit", "Reflection"],
    },
    {
      id: 13,
      day: 13,
      title: "Tengboche → Namche Bazaar",
      elevation: "3,440 m",
      duration: "5 hours trekking",
      walkingHours: "4-5 hours",
      description:
        "Pleasant descent through forests back to the bustling Sherpa town of Namche Bazaar.",
      accommodation: "Tea house",
      meals: "Breakfast, Lunch, Dinner",
      altitude: "3,440 m",
      highlights: ["Forest descent", "Namche return", "Celebration time"],
      image: "/images/day13.jpg",
      activities: ["Easy descent", "Shopping", "Celebration"],
    },
    {
      id: 14,
      day: 14,
      title: "Namche Bazaar → Lukla",
      elevation: "2,860 m",
      duration: "6 hours trekking",
      walkingHours: "6-7 hours",
      description:
        "Final day of trekking through familiar trails, terraced fields, and villages back to Lukla.",
      accommodation: "Tea house",
      meals: "Breakfast, Lunch, Dinner",
      altitude: "2,860 m",
      highlights: ["Final trekking day", "Familiar trails", "Trek completion"],
      image: "/images/day14.jpg",
      activities: ["Final trek", "Farewell party", "Celebration"],
    },
    {
      id: 15,
      day: 15,
      title: "Lukla → Kathmandu",
      elevation: "1,400 m",
      duration: "Flight + transfer",
      walkingHours: null,
      description:
        "Morning flight back to Kathmandu, hotel transfer, and free time for shopping or relaxation.",
      accommodation: "3-star hotel in Kathmandu",
      meals: "Breakfast",
      altitude: "1,400 m",
      highlights: ["Return flight", "City return", "Shopping time"],
      image: "/images/day15.jpg",
      activities: ["Flight", "Hotel transfer", "Free time"],
    },
    {
      id: 16,
      day: 16,
      title: "Departure from Kathmandu",
      elevation: "1,400 m",
      duration: null,
      walkingHours: null,
      description:
        "Transfer to Tribhuvan International Airport for your departure flight home.",
      accommodation: null,
      meals: "Breakfast",
      altitude: "1,400 m",
      highlights: ["Airport transfer", "Departure", "Journey ends"],
      image: "/images/day16.jpg",
      activities: ["Airport transfer", "Departure"],
    },
  ],

  // ==================== ADDITIONAL INFORMATION ====================
  additionalInfo: [
    {
      id: 1,
      heading: "Flight, Transportation & Luggage",
      articles: [
        "The Everest trek begins with a scenic flight to Lukla, one of the world's most challenging airports.",
        "During peak season, flights may operate from Manthali airport (requiring a 5-hour drive from Kathmandu).",
        "Weather conditions can cause flight delays, so we recommend having flexible travel plans.",
      ],
      bullets: [
        "Private airport pickup and drop-off service",
        "Complimentary luggage storage at Kathmandu hotel during trek",
        "Flight delay insurance recommended due to weather dependency",
        "Domestic flight weight limit: 15kg checked + 5kg hand luggage",
      ],
    },
    {
      id: 2,
      heading: "Accommodation",
      articles: [
        "Tea house accommodations are basic but clean, providing an authentic mountain experience.",
        "Hot showers and device charging are available at most locations for an additional cost.",
        "Rooms become more basic as altitude increases, with shared facilities above 4,000m.",
      ],
      bullets: [
        "3-5 star hotels in Kathmandu with modern amenities",
        "Twin-sharing rooms in tea houses throughout the trek",
        "Private bathrooms available at lower elevations",
        "Shared bathroom facilities at higher altitudes",
        "Single room supplements available on request (subject to availability)",
      ],
    },
    // {
    //   id: 3,
    //   heading: "Health & Safety",
    //   articles: [
    //     "Altitude sickness is the primary concern on this trek, with proper acclimatization being crucial.",
    //     "Our guides are trained in first aid and carry comprehensive medical kits.",
    //     "Emergency helicopter evacuation can be arranged if needed (insurance required).",
    //   ],
    //   bullets: [
    //     "Two acclimatization days built into the itinerary",
    //     "Experienced guides trained in altitude sickness recognition",
    //     "Comprehensive first aid kit carried by guide",
    //     "Emergency communication devices available",
    //     "Travel insurance with high-altitude coverage mandatory",
    //   ],
    // },
  ],

  // ==================== HEALTH & SAFETY ====================
  healthSafety: {
    heading: "Trek Health & Safety",
    paragraphs: [
      "Altitude sickness is the biggest concern at high elevations. Our carefully planned itinerary includes proper acclimatization days.",
      "Stay hydrated, follow your guide's instructions, and inform them immediately of any symptoms.",
      "All guides are trained in first aid and carry comprehensive medical kits for emergencies.",
    ],
    bullets: [
      "First-aid trained guides with emergency medical kits",
      "Emergency helicopter rescue coordination available",
      "Altitude sickness medication (Diamox) consultation available",
      "Comprehensive travel insurance with evacuation coverage required",
      "Regular health checks during the trek",
    ],
  },
  // Herosection

  // ==================== FAQ SECTION ====================
  faqs: [
    {
      id: "general",
      icon: "help",
      title: "General Information",
      questions: [
        {
          id: 1,
          question: "What is the best time to trek to Everest Base Camp?",
          answer:
            "The best times are March-May (spring) and September-November (autumn) for clear skies, stable weather, and excellent mountain views.",
        },
        {
          id: 2,
          question: "What fitness level is required?",
          answer:
            "Moderate to good fitness level required. Prior hiking experience recommended. You should be able to walk 5-7 hours daily for consecutive days.",
        },
        {
          id: 3,
          question: "How difficult is the Everest Base Camp trek?",
          answer:
            "Considered strenuous due to high altitude, long daily walks (5-8 hours), and challenging terrain. Proper preparation is essential.",
        },
      ],
    },
    {
      id: "accommodation",
      icon: "home",
      title: "Accommodation & Meals",
      questions: [
        {
          id: 4,
          question: "What are tea house facilities like?",
          answer:
            "Basic but clean twin-sharing rooms with shared bathrooms. Facilities become more basic at higher altitudes.",
        },
        {
          id: 5,
          question: "What food is available during the trek?",
          answer:
            "Mix of Nepali and international cuisine. Dal bhat (rice and lentils), pasta, pizza, and soups are commonly available.",
        },
        {
          id: 6,
          question: "Are single rooms available?",
          answer:
            "Limited single rooms available at lower elevations for additional cost. Not guaranteed at higher altitudes.",
        },
      ],
    },
    {
      id: "gear",
      icon: "box",
      title: "Equipment & Gear",
      questions: [
        {
          id: 7,
          question: "What essential gear do I need?",
          answer:
            "Layered clothing system, sleeping bag (-10°C rated), trekking boots, down jacket, and personal items. Full gear list provided upon booking.",
        },
        {
          id: 8,
          question: "Can I rent equipment in Kathmandu?",
          answer:
            "Yes, sleeping bags, down jackets, and other trekking gear can be rented in Thamel, Kathmandu.",
        },
        {
          id: 9,
          question: "What about luggage during the trek?",
          answer:
            "Porters carry up to 10kg per person. Extra luggage can be stored at your Kathmandu hotel.",
        },
      ],
    },
    {
      id: "safety",
      icon: "shield",
      title: "Safety & Health",
      questions: [
        {
          id: 10,
          question: "How is altitude sickness managed?",
          answer:
            "Gradual ascent profile, acclimatization days, experienced guides monitoring symptoms, and emergency evacuation procedures if needed.",
        },
        {
          id: 11,
          question: "Is travel insurance required?",
          answer:
            "Yes, comprehensive travel insurance covering high-altitude trekking and emergency evacuation up to 6,000m is mandatory.",
        },
        {
          id: 12,
          question: "What emergency procedures are in place?",
          answer:
            "Satellite communication devices, trained guides, helicopter evacuation coordination, and 24/7 support from our Kathmandu office.",
        },
      ],
    },
  ],

  // Alternative FAQ format for compatibility
  // const faqData = [
  //   {
  //     q: "Where is Everest Base Camp located?",
  //     a: "South Base Camp is at 5,364m in Nepal; North Base Camp is at 5,150m in Tibet, China.",
  //   },
  //   {
  //     q: "How hard is the Everest Base Camp trek?",
  //     a: "Strenuous difficulty requiring 5-8 hours daily walking at high altitude. Good fitness and preparation essential.",
  //   },
  //   {
  //     q: "Best time to trek to Everest Base Camp?",
  //     a: "March-May and September-November offer the best weather and mountain views.",
  //   },
  //   {
  //     q: "What fitness level is required?",
  //     a: "Moderate to good fitness. Ability to walk 5-7 hours daily with a daypack for 2 weeks.",
  //   },
  // ],

  // ==================== MEDIA & GALLERY ====================
  gallery: [
    "/images/ebc-gallery-1.jpg",
    "/images/ebc-gallery-2.jpg",
    "/images/ebc-gallery-3.jpg",
    "/images/ebc-gallery-4.jpg",
    "/images/ebc-gallery-5.jpg",
    "/images/ebc-gallery-6.jpg",
  ],

  galleryImages: [
    "/guide.jpg",
    "/moutainimage.avif",
    "/trekking.png",
    "/trekkinginnepal.jpg",
    "/guide.jpg",
  ],

  pdfUrl: "/assets/rajib.pdf",
  mapImage: "/assets/abcd.png",
  altitudeChartUrl: "/assets/abcd.png",

  map: {
    image: "/images/everest-map.jpg",
    description:
      "Detailed trekking route map showing the path from Lukla to Everest Base Camp via Namche Bazaar, Tengboche, Dingboche, and Lobuche.",
    downloadUrl: "/downloads/everest-map.pdf",
  },

  // ==================== REVIEWS & TESTIMONIALS ====================
  reviewsList: [
    {
      id: 1,
      avatar: "/icons/owl-review.svg",
      name: "Freya Williams",
      country: "Italy",
      title: "Incredible trek with the best guide",
      text: "My sister and I decided to use this company for the EBC trek, and we're so glad we did. As first-time high-altitude trekkers, we had many questions, and they were always answered quickly and thoroughly. Our guide was exceptional!",
      rating: 5,
      date: "2024-11-15",
      verified: true,
    },
    {
      id: 2,
      avatar: "/icons/owl-review.svg",
      name: "Carlos Martinez",
      country: "Spain",
      title: "Unforgettable sunrise at Kala Patthar",
      text: "Absolutely worth every step! The dawn view from Kala Patthar was life-changing. Guides were patient and knowledgeable, the tea houses were cozy, and every meal felt like home. Highly recommend this trek!",
      rating: 5,
      date: "2024-10-28",
      verified: true,
    },
    {
      id: 3,
      avatar: "/icons/owl-review.svg",
      name: "Sarah Chen",
      country: "Australia",
      title: "Well-organized and safe",
      text: "Excellent organization from start to finish. The acclimatization schedule worked perfectly, and I never felt rushed. The guides' knowledge of altitude sickness management gave me confidence throughout the trek.",
      rating: 5,
      date: "2024-09-20",
      verified: true,
    },
  ],

  testimonials: [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Travel Blogger, Australia",
      image: "/testimonials/sarah.jpg",
      quote: "Life-changing journey to the roof of the world!",
      rating: 5,
      date: "2024-09-20",
    },
    {
      id: 2,
      name: "Rajiv Thapa",
      title: "Photographer, Nepal",
      image: "/testimonials/rajiv.jpg",
      quote: "Epic scenery and professional support throughout.",
      rating: 4.5,
      date: "2024-10-05",
    },
    {
      id: 3,
      name: "Emily Wong",
      title: "Adventure Seeker, UK",
      image: "/testimonials/emily.jpg",
      quote: "Exceeded all expectations! Perfectly organized.",
      rating: 5,
      date: "2024-11-02",
    },
  ],

  // ==================== ELEVATION DATA ====================
  elevationData: [
    { day: "Day 1", elevation: 1400, location: "Kathmandu" },
    { day: "Day 2", elevation: 1400, location: "Kathmandu" },
    { day: "Day 3", elevation: 2860, location: "Phakding" },
    { day: "Day 4", elevation: 3440, location: "Namche Bazaar" },
    { day: "Day 5", elevation: 3440, location: "Namche Bazaar" },
    { day: "Day 6", elevation: 3867, location: "Tengboche" },
    { day: "Day 7", elevation: 4360, location: "Dingboche" },
    { day: "Day 8", elevation: 4360, location: "Dingboche" },
    { day: "Day 9", elevation: 4940, location: "Lobuche" },
    { day: "Day 10", elevation: 5364, location: "Everest Base Camp" },
    { day: "Day 11", elevation: 5545, location: "Kala Patthar" },
    { day: "Day 12", elevation: 4371, location: "Pheriche" },
    { day: "Day 13", elevation: 3867, location: "Tengboche" },
    { day: "Day 14", elevation: 3440, location: "Namche Bazaar" },
    { day: "Day 15", elevation: 2860, location: "Lukla" },
    { day: "Day 16", elevation: 1400, location: "Kathmandu" },
  ],

  // ==================== ADDITIONAL TREK DETAILS ====================
  tripGrade: "Strenuous (5–8 hours daily walking)",
  weather:
    "Best seasons: September–November & March–May. Clear mornings, possible afternoon clouds.",
  foodAndWater:
    "Nepali and international cuisine available. Boiled or treated water recommended.",
  telecom:
    "Mobile network available up to Pangboche. Wi-Fi available at tea houses (additional cost).",
  crew: "1 guide + 1 assistant guide per 8 trekkers; 1 porter per 2 trekkers.",
  equipment:
    "Comprehensive gear rental available in Kathmandu's Thamel district.",
  daysInfo:
    "Daily walks of 5–8 hours with afternoons for rest and acclimatization.",

  // ==================== SIMILAR TREKS ====================
  similar_treks: [
    {
      id: "evt-001",
      region: "everest",
      slug: "everest-view-trek",
      name: "Everest View Trek – 7 Days",
      bannerImage: "/assets/everest-view-thumb.jpg",
      price: { base: 450 },
      rating: 4.8,
      duration: "7 Days",
      difficulty: "Moderate",
    },
    {
      id: "gph-001",
      region: "annapurna",
      slug: "ghorepani-poon-hill",
      name: "Ghorepani Poon Hill Trek – 5 Days",
      bannerImage: "/assets/ghorepani-poonhill-thumb.jpg",
      price: { base: 390 },
      rating: 4.7,
      duration: "5 Days",
      difficulty: "Easy",
    },
    {
      id: "abc-001",
      region: "annapurna",
      slug: "annapurna-base-camp",
      name: "Annapurna Base Camp Trek – 12 Days",
      bannerImage: "/assets/annapurna-bc-thumb.jpg",
      price: { base: 850 },
      rating: 4.9,
      duration: "12 Days",
      difficulty: "Moderate",
    },
  ],

  // ==================== SEO & METADATA ====================
  seo: {
    title: "Everest Base Camp Trek - 15 Days | Nepal Himalaya Trekking",
    description:
      "Join our expertly guided 15-day Everest Base Camp trek. Experience Sherpa culture, stunning mountain views, and reach the base of the world's highest peak safely.",
    keywords: [
      "everest base camp trek",
      "nepal trekking",
      "himalaya adventure",
      "sherpa culture",
      "kala patthar",
      "everest trek 15 days",
    ],
    canonicalUrl: "/treks/everest-base-camp",
    ogImage: "/images/ebc-og-image.jpg",
    structuredData: {
      "@type": "TouristTrip",
      name: "Everest Base Camp Trek",
      description: "15-day guided trek to Everest Base Camp",
      duration: "P15D",
      offers: {
        "@type": "Offer",
        price: "1490",
        priceCurrency: "USD",
      },
    },
  },

  // ==================== BOOKING & AVAILABILITY ====================
  availability: {
    seasons: ["spring", "autumn", "winter"],
    months: [3, 4, 5, 9, 10, 11, 12], // March-May, Sep-Dec
    minGroupSize: 1,
    maxGroupSize: 25,
    advanceBookingDays: 30,
    blackoutDates: [], // Dates when trek is not available
    peakSeasonSurcharge: 0, // Additional cost during peak season
  },

  // booking: {
  //   ...everestBaseCamp.booking, // Extend existing booking object
  //   minAdvanceBooking: 30, // Days
  //   cancellationPolicy: "Free cancellation up to 30 days before departure",
  //   paymentTerms: "25% deposit required, balance due 30 days before departure",
  //   groupDiscounts: true,
  //   customDates: true,
  // },

  // ==================== TAGS & CATEGORIES ====================
  tags: [
    "everest",
    "base-camp",
    "high-altitude",
    "sherpa-culture",
    "kala-patthar",
    "tea-house-trek",
    "nepal-trekking",
    "himalaya",
  ],
  categories: ["trekking", "adventure", "cultural", "high-altitude"],
  difficulty: "strenuous",
  fitnessLevel: "moderate-to-high",
  trekType: "tea-house",
  region: "everest",
  country: "nepal",

  // ==================== ADDITIONAL API FIELDS ====================
  isActive: true,
  isPublished: true,
  isFeatured: true,
  isPopular: true,
  sortOrder: 1,
  viewCount: 0,
  bookingCount: 0,
  language: "en",
  currency: "USD",
  timezone: "Asia/Kathmandu",
};

export default everestBaseCamp;
