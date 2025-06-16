const MOCK_DELAY = 300;

const MOCK_TREKS = {
  "everest-base-camp": {
    region: "everest",
    slug: "everest-base-camp",
    name: "Everest Base Camp Trek – 15 Days",
    bannerImage: "/assets/abcd.png",
    keyInfo: {
      duration: "15 Days",
      tripGrade: "Strenuous",
      startPoint: "TIA Kathmandu",
      groupSize: "1–25 pax",
      maxAltitude: "5,545 m",
      activity: "Trek, Sightseeing & Hiking",
    },
    rating: 5,
    reviews: "based on 3",
    price: {
      base: 1490,
      original: 1550,
      groups: [
        { size: "1–4", price: 1490 },
        { size: "5–10", price: 1390 },
        { size: "11–25", price: 1290 },
      ],
    },
    highlights: [
      {
        icon: "sparkles",
        title: "Luxury Welcome Dinner",
        subtitle: "Celebrate your arrival with a cultural night in Kathmandu.",
      },
      {
        icon: "globe",
        title: "Authentic Local Immersion",
        subtitle: "Connect with Sherpa communities in their mountain homes.",
      },
      {
        icon: "mountain",
        title: "Summit Viewpoint Hike",
        subtitle: "Reach Kala Patthar at 5,545 m for an unforgettable sunrise.",
      },
      {
        icon: "user",
        title: "Top-Tier Guides",
        subtitle:
          "Licensed, first-aid trained leaders with deep local expertise.",
      },
    ],
    overview: {
      heading: "Trek Overview",
      articles: [
        "The Everest Base Camp Trek is a legendary journey to the base of the world’s highest mountain, It combines majestic Himalayan scenery, rich Sherpa culture, and rewarding physical challenge.",
        "Travelers traverse suspension bridges, alpine forests, glacial moraines, and ancient monasteries.",
      ],
      bullets: [
        "14-day fully guided itinerary",
        "Max altitude: 5,545 meters",
        "Acclimatization days included",
        "Experienced Sherpa guides",
      ],
    },
    additionalInfo: [
      {
        heading: "Flight, Transportation & Luggage",
        articles: [
          "Everest trek starts at Lukla (a short flight from Kathmandu).",
          "Peak season flights may operate from Manthali (5h drive).",
        ],
        bullets: [
          "Private airport pickup & drop",
          "Luggage storage at Kathmandu hotel",
          "Flight delay risk due to weather",
        ],
      },
      {
        articles: [
          "Tea house accommodations are basic but clean.",
          "Hot showers and charging are available at extra cost.",
        ],
      },
      {
        heading: "Accommodation",
        bullets: [
          "3–5★ hotels in Kathmandu.",
          "Basic shared rooms in teahouses.",
          "Private bathrooms at select stops; shared above.",
          "Upgrades available on request.",
        ],
      },
    ],
    galleryImages: [
      "/assets/abcd.png",
      "/images/ebc-2.jpg",
      "/images/ebc-3.jpg",
      "/images/ebc-4.jpg",
    ],
    pdfUrl: "/assets/rajib.pdf",
    mapImage: "/assets/abcd.png",
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
    itinerary: [
      {
        title: "Arrival in Kathmandu & Hotel Transfer",
        description:
          "Private pickup from KTM airport, hotel check-in. Explore Thamel at leisure.",
        accommodation: "Kantipur Village Hotel",
        altitude: "1,350 m",
      },
      {
        title: "UNESCO World Heritage Site Tour",
        description:
          "Visit Kathmandu Durbar Square, Pashupatinath, Boudhanath & Patan.",
      },
      {
        title: "Hike to Kalapatthar & Return to Pheriche",
        description: "Sunrise view from 5,550 m, then trek down to Pheriche.",
        altitude: "5,545 m",
      },
      {
        title: "Fly Lukla → KTM & Departure",
        description:
          "Early flight back to Kathmandu, transfer to airport/hotel.",
      },
    ],
    healthSafety: {
      heading: "Trek Health & Safety",
      paragraphs: [
        "Altitude sickness is the biggest concern at high elevations. Acclimatization is built into the itinerary.",
        "Stay hydrated and follow your guide’s instructions at all times.",
      ],
      bullets: [
        "First-aid trained guides with emergency kits",
        "Emergency helicopter rescue can be arranged if needed",
        "Diamox (altitude medication) is available with prescription",
      ],
    },
    reviewsList: [
      {
        id: 1,
        avatar: "/icons/owl-review.svg",
        name: "Freya W.",
        country: "Italy",
        title: "Incredible trek with the best guide",
        text: "My sister and I decided to use Footprint Adventures to book the Poon Hill trek, and we're so glad we did. As first-time trekkers, we had a lot of questions before we got there, and Sharan always answered them quickly and thoroughly.",
        rating: 5,
      },
      {
        id: 2,
        avatar: "/icons/owl-review.svg",
        name: "Carlos M.",
        country: "Spain",
        title: "Unforgettable sunrise at Kala Patthar",
        text: "Absolutely worth the sweat! The dawn view from Kala Patthar was life-changing. Guides were patient, the lodges were cozy, and every meal felt like home. Highly recommend!",
        rating: 5,
      },
    ],
    altitudeChartUrl: "/assets/abcd.png",
    tripGrade: "Moderate → Challenging (5–8 h/day)",
    weather:
      "Best: Sep–Nov & Mar–May. Clear mornings, clouds later in the day.",
    foodAndWater: "Nepali & Western meals. Boiled/treated water recommended.",
    telecom: "Phone up to Pangboche; Wi-Fi at lodges (EverestLink card).",
    crew: "1 guide + 1 assistant per 5 trekkers; 1 porter per 2 trekkers.",
    equipment: "Gear rental available in Thamel; see trekking-gear page.",
    daysInfo: "Daily walks of 3–6 h, afternoons for acclimatization.",
    faq: [
      {
        q: "Where is Everest Base Camp?",
        a: "South Base Camp: 5,364 m (Nepal); North Base Camp: 5,150 m (Tibet).",
      },
      {
        q: "How hard is the trek?",
        a: "Strenuous—5–8 h/day at high altitude; proper fitness required.",
      },
    ],
    similar_treks: [], // Will populate below
  },

  "everest-view-trek": {
    region: "everest",
    slug: "everest-view-trek",
    name: "Everest View Trek – 7 Days",
    bannerImage: "/assets/everest-view-thumb.jpg",
    keyInfo: {
      duration: "7 Days",
      activity: "Trek, Panoramic Views",
    },
    rating: 4.8,
    reviews: "based on 5",
    price: {
      base: 450,
      original: null,
      groups: [],
    },
    similar_treks: [],
  },

  "ghorepani-poon-hill": {
    region: "annapurna",
    slug: "ghorepani-poon-hill",
    name: "Ghorepani Poon Hill Trek – 5 Days",
    bannerImage: "/assets/ghorepani-poonhill-thumb.jpg",
    keyInfo: {
      duration: "5 Days",
      activity: "Trek, Sunrise View",
    },
    rating: 4.7,
    reviews: "based on 4",
    price: {
      base: 390,
      original: null,
      groups: [],
    },
    similar_treks: [],
  },
};

// ─── Populate Similar Treks for Base Camp ─────────────────────────────
MOCK_TREKS["everest-base-camp"].similar_treks = [
  MOCK_TREKS["everest-view-trek"],
  MOCK_TREKS["ghorepani-poon-hill"],
];

// ─── API-like Functions (Mock) ─────────────────────────────────────────

export async function fetchTrek(slug) {
  await new Promise((r) => setTimeout(r, MOCK_DELAY));
  const trek = MOCK_TREKS[slug];
  if (!trek) throw new Error("Trek not found");
  return trek;
}

export async function fetchAllTreks() {
  await new Promise((r) => setTimeout(r, MOCK_DELAY));
  return Object.values(MOCK_TREKS);
}

export async function fetchTreksBySlugs(slugs = []) {
  const all = await fetchAllTreks();
  return all.filter((t) => slugs.includes(t.slug));
}
