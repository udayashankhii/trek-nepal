const mockBlogPosts = [
  {
    id: 1,
    slug: "everest-base-camp-trek",
    title: "Everest Base Camp Trek: Journey to the Roof of the World",
    metaDescription:
      "Experience the ultimate trekking adventure to Everest Base Camp, where breathtaking views and challenging trails create memories of a lifetime.",
    description:
      "Experience the ultimate trekking adventure to Everest Base Camp, where breathtaking views and challenging trails create memories of a lifetime.",
    category: "Trekking",
    region: "Everest Region",
    publishDate: "2025-06-28T10:32:00+05:45",
    date: "2025-06-28T10:32:00+05:45",
    readTime: 15,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
      alt: "Everest Base Camp Trek",
      caption: "The breathtaking view of Everest Base Camp",
    },
    images: [
      {
        url: "/annapurna.jpeg",
        alt: "Sunrise over Everest Base Camp",
        caption:
          "Sunrise over Everest Base Camp, with the world’s highest peaks glowing in the morning light.",
      },
      {
        url: "/everest.jpeg",
        alt: "Lukla Airport",
        caption:
          "The thrilling landing at Lukla Airport, the gateway to the Everest region.",
      },
      {
        url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200",
        alt: "Suspension Bridge",
        caption:
          "Suspension bridges are a thrilling part of the journey to Everest Base Camp.",
      },
      {
        url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200",
        alt: "Namche Bazaar",
        caption:
          "Namche Bazaar, the Sherpa heartland and a vital acclimatization stop.",
      },
      {
        url: "https://images.unsplash.com/photo-1517821099605-1b7c9d8e6b8a?w=1200",
        alt: "Tengboche Monastery",
        caption: "Tengboche Monastery, a spiritual highlight of the trek.",
      },
      {
        url: "https://images.unsplash.com/photo-1464013778555-8e723c2f01f8?w=1200",
        alt: "Sherpa Guide",
        caption: "Sherpa guide, the backbone of Himalayan expeditions.",
      },
      {
        url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=1200",
        alt: "Himalayan Landscape",
        caption: "Dramatic Himalayan landscapes unfold at every turn.",
      },
      {
        url: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=1200",
        alt: "Trekking Gear",
        caption: "Essential gear for high-altitude trekking.",
      },
      {
        url: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=1200",
        alt: "Everest Base Camp Celebration",
        caption:
          "Celebrating at Everest Base Camp—an achievement of a lifetime.",
      },
    ],
    content: {
      introduction:
        "The Everest Base Camp (EBC) trek is more than just a bucket-list adventure—it’s a journey into the heart of the Himalayas, a test of endurance, and an immersion into the legendary Sherpa culture. For decades, trekkers from around the globe have flocked to Nepal for a chance to stand at the foot of the world’s tallest mountain, Mount Everest (Sagarmatha). This comprehensive guide will walk you through every step of the adventure, from preparation and logistics to daily experiences and the emotional highs and lows of reaching Base Camp.",
      sections: [
        {
          id: "overview",
          title: "Trek Overview",
          content:
            "The classic Everest Base Camp trek begins with a dramatic flight from Kathmandu to Lukla, a small mountain airstrip perched on a cliffside. From there, the trail winds through lush forests, vibrant Sherpa villages, and high-altitude landscapes, culminating at the iconic Base Camp. Along the way, trekkers are treated to jaw-dropping views of Everest, Lhotse, Nuptse, Ama Dablam, and countless other Himalayan giants.",
          subsections: [
            "Duration: 12–14 days",
            "Maximum Altitude: 5,364m (17,598ft)",
            "Difficulty: Challenging",
            "Best Seasons: March–May, September–November",
          ],
        },
        {
          id: "itinerary",
          title: "Day-by-Day Itinerary",
          content:
            "Detailed itinerary for each day, including highlights, altitudes, and experiences. (Insert the full day-by-day breakdown here as in the previous answer.)",
        },
        {
          id: "culture",
          title: "The Sherpa Culture and Local Life",
          content:
            "The Sherpa people are renowned for their hospitality, resilience, and mountaineering prowess. Along the trail, you’ll encounter prayer wheels, mani stones, and fluttering prayer flags—symbols of Buddhist faith. Visit monasteries, chat with locals, and sample traditional foods like dal bhat and yak cheese. The warmth of Sherpa teahouses and the camaraderie among trekkers make the journey unforgettable.",
        },
        {
          id: "nature",
          title: "Scenery, Wildlife, and Natural Wonders",
          content:
            "The EBC trek traverses diverse ecosystems, from lush forests and rhododendron groves to windswept alpine deserts. Keep an eye out for Himalayan tahr, musk deer, and colorful pheasants. Above the tree line, the stark beauty of the Khumbu Glacier and the towering peaks will leave you breathless.",
        },
        {
          id: "preparation",
          title: "Preparation and Packing Tips",
          content:
            "Fitness: Train with cardio, strength, and hiking exercises. Prepare for long days and steep ascents. Packing List: Sturdy hiking boots, layered clothing, down jacket, sleeping bag, trekking poles, water purification, snacks, first aid kit, sunscreen, sunglasses, camera. Permits: Sagarmatha National Park Permit, Khumbu Pasang Lhamu Rural Municipality Permit. Guides and Porters: Hiring local guides and porters not only supports the community but also enhances safety and enjoyment.",
        },
        {
          id: "challenges",
          title: "Challenges and Rewards",
          content:
            "Trekking to Everest Base Camp is physically and mentally demanding. The altitude, cold, and basic facilities can be tough. However, the sense of achievement, the friendships forged, and the awe-inspiring scenery make every step worthwhile. Acclimatize properly, stay hydrated, and ascend slowly. Know the symptoms of AMS (acute mountain sickness) and never ignore them.",
        },
        {
          id: "faqs",
          title: "Frequently Asked Questions",
          content:
            "Q: When is the best time to trek? A: Spring (March–May) and autumn (September–November) offer the best weather and views. Q: How difficult is the trek? A: It’s challenging due to the altitude and long days, but no technical climbing is required. Q: Can I trek solo? A: Solo trekking is possible, but hiring a guide is recommended for safety and cultural insights. Q: What’s the accommodation like? A: Teahouses offer basic rooms with shared bathrooms and hearty meals. Q: How much does it cost? A: Budget $1,200–$2,000 for the trek, including permits, guides, food, and flights.",
        },
        {
          id: "responsibility",
          title: "Responsible Trekking",
          content:
            "Leave No Trace: Pack out all waste and avoid single-use plastics. Support Local: Choose local guides, porters, and teahouses. Respect Culture: Dress modestly and ask before photographing people or religious sites.",
        },
        {
          id: "conclusion",
          title: "Conclusion",
          content:
            "The Everest Base Camp trek is a life-changing journey that rewards you with breathtaking scenery, cultural richness, and a profound sense of accomplishment. Whether you’re a seasoned trekker or a first-timer, standing at the foot of Everest is an experience you’ll cherish forever. Prepare well, trek responsibly, and embrace every moment on the trail to the roof of the world.",
        },
      ],
    },
    tags: ["everest", "trekking", "nepal", "adventure", "himalayas"],
    difficulty: "Challenging",
    views: "2.5k",
    likes: 156,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 2,
    slug: "annapurna-circuit-trek",
    title: "Annapurna Circuit Trek: Complete Guide for 2025",
    metaDescription:
      "Discover the classic Annapurna Circuit trek with our comprehensive guide including route details, preparation tips, and what to expect.",
    description:
      "Discover the classic Annapurna Circuit trek with our comprehensive guide including route details, preparation tips, and what to expect.",
    category: "Trekking",
    region: "Annapurna Region",
    publishDate: "2025-06-25T14:20:00+05:45",
    date: "2025-06-25T14:20:00+05:45",
    readTime: 12,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200",
      alt: "Annapurna Circuit Trek",
      caption: "Stunning views along the Annapurna Circuit",
    },
    content: {
      introduction:
        "The Annapurna Circuit is one of Nepal's most diverse and rewarding treks, offering incredible mountain views, cultural experiences, and varied landscapes.",
      sections: [
        {
          id: "highlights",
          title: "Trek Highlights",
          content:
            "The Annapurna Circuit offers an incredible diversity of landscapes, from subtropical forests to high alpine terrain, crossing the famous Thorong La Pass at 5,416 meters.",
          subsections: [
            "Thorong La Pass (5,416m)",
            "Muktinath Temple",
            "Diverse landscapes and ecosystems",
            "Rich cultural experiences",
          ],
        },
      ],
    },
    tags: ["annapurna", "circuit", "trekking", "thorong-la", "nepal"],
    difficulty: "Moderate",
    views: "1.8k",
    likes: 98,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 3,
    slug: "langtang-valley-trek",
    title: "Langtang Valley Trek: Hidden Gem of Nepal",
    metaDescription:
      "Explore the beautiful Langtang Valley, known for its stunning mountain views, rich culture, and diverse wildlife in this comprehensive trekking guide.",
    description:
      "Explore the beautiful Langtang Valley, known for its stunning mountain views, rich culture, and diverse wildlife in this comprehensive trekking guide.",
    category: "Trekking",
    region: "Langtang Region",
    publishDate: "2025-06-20T09:15:00+05:45",
    date: "2025-06-20T09:15:00+05:45",
    readTime: 10,
    image:
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200",
      alt: "Langtang Valley Trek",
      caption: "Beautiful landscapes of Langtang Valley",
    },
    content: {
      introduction:
        "Discover the hidden gem of Nepal with the Langtang Valley trek, offering spectacular mountain views and rich cultural experiences.",
      sections: [
        {
          id: "overview",
          title: "Valley Overview",
          content:
            "Langtang Valley is often called the 'Valley of Glaciers' and offers some of the most accessible high mountain scenery in Nepal.",
          subsections: [
            "Duration: 7-10 days",
            "Maximum altitude: 4,984m",
            "Difficulty: Moderate",
            "Best time: October-November, March-May",
          ],
        },
      ],
    },
    tags: ["langtang", "trekking", "nepal", "valley", "culture"],
    difficulty: "Moderate",
    views: "1.2k",
    likes: 67,
    isLiked: false,
    isBookmarked: false,
  },
];
export default mockBlogPosts;
