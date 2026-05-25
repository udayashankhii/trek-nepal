// src/seo/keywords.js
// Keyword strategy for EverTrek Nepal — targeting foreign trekkers searching on Google

export const GLOBAL_KEYWORDS =
  "trekking in nepal, nepal trekking packages, nepal trek, himalayan trekking, guided trek nepal, nepal trekking company, best trekking in nepal, nepal adventure tours, nepal mountain trekking, trekking holidays nepal";

export const REGION_KEYWORDS = {
  everest: [
    "everest base camp trek",
    "everest trek",
    "khumbu region trekking",
    "EBC trek",
    "everest base camp trek cost",
    "everest base camp trek difficulty",
    "guided everest base camp trek",
    "everest base camp trek 14 days",
    "kala patthar trek",
    "three passes trek nepal",
    "gokyo lakes trek",
    "lukla trek nepal",
    "sherpa culture trek",
    "everest region trekking packages",
    "how to trek everest base camp",
    "everest base camp altitude",
    "tengboche monastery trek",
    "namche bazaar trek",
  ].join(", "),

  annapurna: [
    "annapurna circuit trek",
    "annapurna base camp trek",
    "annapurna circuit trekking",
    "poon hill trek nepal",
    "mardi himal trek",
    "annapurna sanctuary trek",
    "annapurna trekking packages",
    "annapurna circuit trek cost",
    "annapurna circuit difficulty",
    "annapurna base camp altitude",
    "best trek annapurna region",
    "annapurna trek 10 days",
    "annapurna trek 14 days",
    "pokhara trekking packages",
    "annapurna panorama trek",
    "thorong la pass trek",
    "mustang annapurna trek",
  ].join(", "),

  langtang: [
    "langtang valley trek",
    "langtang trek nepal",
    "gosaikunda trek",
    "langtang national park trek",
    "langtang trek itinerary",
    "langtang trek cost",
    "langtang valley trekking",
    "kyanjin gompa trek",
    "helambu trek",
    "langtang trek from kathmandu",
    "langtang trek difficulty",
    "gosaikunda lake trek",
    "tamang heritage trail",
  ].join(", "),

  manaslu: [
    "manaslu circuit trek",
    "manaslu trek nepal",
    "manaslu trekking",
    "manaslu circuit trek cost",
    "manaslu circuit itinerary",
    "manaslu restricted area permit",
    "manaslu trek difficulty",
    "world eighth highest peak trek",
    "manaslu trek 2025",
    "manaslu circuit 14 days",
    "tsum valley trek",
    "off the beaten path nepal",
    "remote trek nepal",
  ].join(", "),

  mustang: [
    "upper mustang trek",
    "mustang trek nepal",
    "lo manthang trek",
    "forbidden kingdom trek",
    "upper mustang restricted area",
    "mustang trekking packages",
    "upper mustang trek cost",
    "mustang nepal permit",
    "lo manthang nepal",
    "mustang circuit trek",
    "tibetan culture trek nepal",
    "rain shadow area nepal trek",
    "desert trek nepal",
    "annapurna mustang trek",
  ].join(", "),
};

export const PAGE_SEO = {
  home: {
    title: "EverTrek Nepal | #1 Trekking Agency in Nepal — Everest, Annapurna, Manaslu",
    description:
      "Book your dream Himalayan trek with EverTrek Nepal. Expert-guided treks to Everest Base Camp, Annapurna Circuit, Manaslu Circuit, Langtang Valley & Upper Mustang. Best price guarantee. 4.9★ rated.",
    keywords:
      "trekking in nepal, nepal trekking agency, everest base camp trek, annapurna circuit trek, best trekking company nepal, himalayan trek packages, nepal adventure travel",
  },

  trekkingInNepal: {
    title: "Trekking in Nepal 2025 — All Trek Packages | EverTrek Nepal",
    description:
      "Discover the best trekking in Nepal for 2025. From easy Poon Hill to extreme Everest Base Camp — compare all Nepal trek packages, costs, difficulty levels, and best seasons. Expert guides included.",
    keywords:
      "trekking in nepal 2025, nepal trek packages, best treks nepal, nepal trekking cost, easy treks nepal, moderate treks nepal, challenging treks nepal, nepal hiking packages, all inclusive trek nepal",
  },

  everest: {
    title: "Everest Base Camp Trek 2025 — Packages, Cost & Itinerary | EverTrek Nepal",
    description:
      "Book your Everest Base Camp trek with EverTrek Nepal. Expert Sherpa guides, teahouse accommodation, all permits included. Compare 14-day, 16-day & 21-day packages. From $1,299 per person.",
    keywords: REGION_KEYWORDS.everest,
  },

  annapurna: {
    title: "Annapurna Circuit & Base Camp Trek 2025 — Packages | EverTrek Nepal",
    description:
      "Trek the legendary Annapurna Circuit or Annapurna Base Camp with expert guides. Compare all Annapurna trekking packages, costs, and itineraries. Best treks in the Annapurna region of Nepal.",
    keywords: REGION_KEYWORDS.annapurna,
  },

  langtang: {
    title: "Langtang Valley Trek 2025 — Packages & Itinerary | EverTrek Nepal",
    description:
      "Explore Langtang Valley, Gosaikunda Lake, and the Tamang Heritage Trail with expert guides. Nepal's closest trek from Kathmandu. Book your Langtang trekking package today.",
    keywords: REGION_KEYWORDS.langtang,
  },

  manaslu: {
    title: "Manaslu Circuit Trek 2025 — Remote Himalayan Trek | EverTrek Nepal",
    description:
      "The Manaslu Circuit Trek — Nepal's most dramatic off-the-beaten-path adventure. Circle the world's 8th highest peak with expert guides. Restricted area permits arranged. Full packages from $1,599.",
    keywords: REGION_KEYWORDS.manaslu,
  },

  mustang: {
    title: "Upper Mustang Trek 2025 — Forbidden Kingdom | EverTrek Nepal",
    description:
      "Explore the ancient kingdom of Lo Manthang on the Upper Mustang Trek. Rare Tibetan culture, dramatic desert landscapes, and restricted area access. All-inclusive packages with EverTrek Nepal.",
    keywords: REGION_KEYWORDS.mustang,
  },

  blog: {
    title: "Nepal Trekking Blog — Tips, Guides & Itineraries | EverTrek Nepal",
    description:
      "Expert Nepal trekking guides, packing lists, best season advice, altitude sickness tips, and trek reviews. Everything a foreign trekker needs to plan the perfect Nepal adventure.",
    keywords:
      "nepal trekking blog, trek tips nepal, everest base camp guide, best time trek nepal, altitude sickness nepal, nepal trekking permits, what to pack nepal trek",
  },

  contact: {
    title: "Contact EverTrek Nepal — Book Your Trek Today",
    description:
      "Get in touch with EverTrek Nepal's trekking experts. Call, WhatsApp, or email us to book your Himalayan adventure. Based in Thamel, Kathmandu. 24/7 support.",
    keywords:
      "contact nepal trekking agency, book trek nepal, evertrek nepal contact, kathmandu trekking company, nepal trek booking",
  },

  about: {
    title: "About EverTrek Nepal — Trusted Nepal Trekking Agency Since 2010",
    description:
      "EverTrek Nepal is a government-registered, TAAN-certified trekking company based in Kathmandu. 15+ years of experience guiding foreign travelers through the Himalayas. Meet our expert Sherpa team.",
    keywords:
      "about evertrek nepal, nepal trekking company history, registered nepal trekking agency, TAAN member nepal, trusted nepal tour operator",
  },

  visaInfo: {
    title: "Nepal Visa Guide 2025 — Requirements for Foreign Trekkers",
    description:
      "Complete Nepal visa guide for trekkers. Cost, on-arrival process, trekking permit requirements, TIMS card, and national park fees. Updated for 2025.",
    keywords:
      "nepal visa 2025, nepal visa on arrival, nepal trekking permit, TIMS card nepal, sagarmatha national park fee, nepal entry requirements, tourist visa nepal",
  },

  packingList: {
    title: "Nepal Trek Packing List 2025 — What to Bring | EverTrek Nepal",
    description:
      "Expert-curated Nepal trekking packing list for 2025. Clothes, gear, medication, and electronics you need for Everest, Annapurna, or any Himalayan trek. Download our free checklist.",
    keywords:
      "nepal trekking packing list, what to bring nepal trek, everest base camp gear list, trekking equipment nepal, altitude sickness medicine, trek clothing nepal",
  },
};

// Region metadata for schemas and meta geo tags
export const REGION_META = {
  everest: {
    lat: 27.9881,
    lng: 86.9250,
    image: "https://evertreknepal.com/everest.jpg",
    pageUrl: "/treks/everest-treks",
    regionName: "Everest Khumbu",
    description:
      "The Everest region of Nepal is home to Mount Everest (8,848m), the world's highest peak. Trekking routes lead through Sherpa villages, Buddhist monasteries, and breathtaking Himalayan landscapes to Everest Base Camp.",
  },
  annapurna: {
    lat: 28.5964,
    lng: 83.8200,
    image: "https://evertreknepal.com/annapurna.jpg",
    pageUrl: "/treks/annapurna",
    regionName: "Annapurna",
    description:
      "The Annapurna region features some of Nepal's most diverse and beautiful trekking routes, from the world's most popular Annapurna Circuit to the classic Annapurna Base Camp trek through rhododendron forests.",
  },
  langtang: {
    lat: 28.2144,
    lng: 85.5340,
    image: "https://evertreknepal.com/langtang.jpg",
    pageUrl: "/treks/langtang",
    regionName: "Langtang",
    description:
      "Langtang is Nepal's closest trekking region to Kathmandu, offering stunning mountain views, Tamang cultural experiences, sacred Gosaikunda Lake, and the dramatic Langtang Valley.",
  },
  manaslu: {
    lat: 28.5494,
    lng: 84.5597,
    image: "https://evertreknepal.com/manaslu.jpg",
    pageUrl: "/treks/manaslu",
    regionName: "Manaslu",
    description:
      "The Manaslu Circuit is Nepal's most remote and dramatic trekking route, circling the world's 8th highest peak through pristine wilderness, traditional villages, and high mountain passes.",
  },
  mustang: {
    lat: 29.1811,
    lng: 83.9739,
    image: "https://evertreknepal.com/mustang.jpg",
    pageUrl: "/treks/mustang",
    regionName: "Upper Mustang",
    description:
      "Upper Mustang, known as the Forbidden Kingdom, is one of Nepal's most unique trekking destinations — a restricted area preserving ancient Tibetan culture, cave monasteries, and dramatic desert landscapes.",
  },
};
