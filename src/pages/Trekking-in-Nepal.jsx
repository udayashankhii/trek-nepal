import React from "react";
import { ArrowRight } from "lucide-react";
import TrekHero from "./Trekhero";
import RegionsIndex from "../treks/regions/Region-Index";
import { useState } from "react";

export default function TrekkingInNepalPage() {
  const [ctaClicked, setCtaClicked] = useState(false);
  const handleCtaClick = () => {
    setCtaClicked(true);
    // Navigate or perform your action here, e.g.:
    window.location.href = "/treks/everest";
    // or use your router's navigate function
  };
  return (
    <div className="min-50-screen bg-gray-50">
      {/* Hero Section */}
      <TrekHero
        title="Trekking in Nepal"
        subtitle="Discover the majestic Himalayas with our expert-guided treks"
        backgroundImage="/trekkinginnepal.jpg"
        ctaText="View Packages"
        ctaLink="/treks/everest"
        ctaDisabled={ctaClicked}
        onCtaClick={handleCtaClick}
        heightClass="min-h-[50vh]"
      />

      {/* Trekking in Nepal Overview */}
      <section className="py-12 px-6 max-w-4xl mx-auto space-y-6 text-gray-700">
        <h2 className="text-3xl font-bold text-center">Trekking in Nepal</h2>
        <p>
          Embark on an unforgettable journey with Trekking in Nepal, immersing
          yourself in the breathtaking panorama of the world’s tallest mountain
          ranges. Nepal Trekking offers a unique blend of remarkable scenery,
          diverse topography, and the warmth of friendly locals. Elevate your
          adventure to new heights with the Best Trekking Collection for 2024.
        </p>
        <p>
          Experience the Himalayan wonders of Nepal through a special fusion of
          outdoor activities and cultural exploration. Explore the rich tapestry
          of Nepali cultures, religions, societies, languages, ethnic groups,
          and geology, making it your most gratifying trekking adventure. Choose
          from a variety of options tailored to different lengths and difficulty
          levels, including Easy Trekking, Standard Trekking, Tea House
          Trekking, Camping Trekking, and Adventure Trekking.
        </p>
        <p>
          Delight in the beauty of Nepal’s landscapes, from snow-covered
          mountains and rhododendron-filled valleys to bamboo and alpine
          forests. Traverse rocky slopes, encounter glaciers, and witness frozen
          lakes and diverse wildlife. Immerse yourself in the coexistence of
          religions against the backdrop of Nepal’s unique geological
          conditions.
        </p>
        <p>
          For the ultimate trekking experience, seize the opportunity with Green
          Valley Nepal Treks, offering the Best Trekking Collection for 2024.
          Uncover the charm of Nepal’s natural wonders, diverse cultures, and
          the thrill of trekking through this exceptional selection.{" "}
          <a href="/contact" className="text-orange-600 hover:underline">
            Contact us now
          </a>{" "}
          to discuss your trekking aspirations and secure your reservation for
          an unparalleled adventure in Nepal Trekking.
        </p>
      </section>

      {/* Trekking with a Guide */}
      <section className="py-12 px-6 max-w-4xl mx-auto space-y-4 text-gray-700 bg-white">
        <h3 className="text-2xl font-semibold">
          Trekking in Nepal with a Guide?
        </h3>
        <p>
          You can hike on your own or with a guide, whether it’s to Everest Base
          Camp, Annapurna Base Camp, or another well-known Nepal trek. There are
          numerous benefits to traveling with a guide service like Green Valley
          Nepal Treks:
        </p>
        <ul className="space-y-3">
          <li className="flex items-start">
            <ArrowRight className="mt-1 mr-2 w-5 h-5 text-green-500" />
            Trek with knowledgeable local guides and support personnel, ensuring
            an enriching cultural experience while contributing to local
            communities.
          </li>
          <li className="flex items-start">
            <ArrowRight className="mt-1 mr-2 w-5 h-5 text-green-500" />
            We handle all aspects of your trek, including permits,
            transportation, meals, equipment, lodging in teahouses, and porter
            services.
          </li>
          <li className="flex items-start">
            <ArrowRight className="mt-1 mr-2 w-5 h-5 text-green-500" />
            The Himalayas are challenging and hazardous; with an experienced
            guide, you’ll feel secure and have protocols in place for
            emergencies.
          </li>
          <li className="flex items-start">
            <ArrowRight className="mt-1 mr-2 w-5 h-5 text-green-500" />
            Learn about the natural and cultural history of the region from
            experts, turning your trek into a truly immersive educational
            adventure.
          </li>
        </ul>
      </section>

      {/* Featured Treks Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-semibold mb-6">Featured Treks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* <TrekCard trek={trekObject} /> */}
          </div>
        </div>
      </section>
      <RegionsIndex />

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center">
        <h4 className="text-2xl font-bold mb-4">
          Ready to start your journey?
        </h4>
        <a
          href="/contact-us"
          className="inline-block px-6 py-3 bg-white text-orange-500 font-semibold rounded-full hover:bg-gray-100"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
}
