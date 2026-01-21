// src/pages/regions/RegionsIndex.jsx
import React from "react";
import RegionCard from "./Regions-Card";
// ← two levels up

const regions = [
  {
    slug: "everest",
    name: "Everest Region Trekking",
    image: "/everest.jpg",
    itinerariesCount: 22,
    description: "Classic EBC routes with Sherpa villages & stunning icefalls",
  },
  {
    slug: "annapurna",
    name: "Annapurna Region Trekking",
    image: "/annapurna.jpg",
    itinerariesCount: 24,
    description:
      "Diverse Annapurna Circuit, Poon Hill sunrise & tea-house comfort",
  },
  {
    slug: "langtang",
    name: "Langtang Region Trekking",
    image: "/langtang.jpg",
    itinerariesCount: 7,
    description: "Remote alpine valleys with rich Tamang cultural experiences",
  },
  {
    slug: "mustang",
    name: "Mustang Trekking",
    image: "/mustang.jpg",
    itinerariesCount: 5,
    description:
      "Ancient desert kingdom & Tibetan-style villages behind the Himalaya",
  },
   {
    slug: "manaslu",
    name: "Manaslu Region Trekking",
    image: "/manaslu.jpg",
    itinerariesCount: 8,
    description: "Diverse landscapes with ancient monasteries and pristine mountain views",
  },
];

// RegionsIndex.jsx (already correct)
export default function RegionsIndex() {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {regions.map((region) => (
          <RegionCard
            key={region.slug}
            name={region.name}
            image={region.image}
            description={region.description}
            itinerariesCount={region.itinerariesCount}
            link={`/treks/${region.slug}`}
          />
        ))}
      </div>
    </section>
  );
}
