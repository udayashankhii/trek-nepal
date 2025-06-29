// // src/components/TrekDescription.jsx
// import React from "react";

// function TrekSummary() {
//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-3xl mx-auto px-6">
//         <h2 className="text-4xl font-serif font-bold text-center text-gray-900 mb-8">
//           Trip Overview
//         </h2>
//         <div className="space-y-6">
//           <p className="text-lg font-sans text-gray-700 leading-relaxed">
//             If there is one journey the spirit should walk in this life, it is
//             the path to the foothill of mighty Mount Everest. The trail winds
//             through the far northeast of Nepal, resting in the quiet heart of
//             Solukhumbu.
//           </p>
//           <p className="text-lg font-sans text-gray-700 leading-relaxed">
//             Walk, explore, and discover the path once taken by the legendary
//             Everest pioneers—Hillary and Norgay—who stepped on the mountain and
//             touched the top of the world in ’53. This iconic trail weaves
//             through Sherpa land and quaint villages, up to the foothills of
//             gigantic snow-capped peaks exceeding 8,000 m.
//           </p>
//           <p className="text-lg font-sans text-gray-700 leading-relaxed">
//             Though the trek is rated moderate to challenging, no technical
//             climbing skills are required—you just need your body to be ready,
//             and your mind to embrace the adventure. Even without prior Himalayan
//             experience, your spirit will carry you.
//           </p>
//           <p className="text-lg font-sans text-gray-700 leading-relaxed">
//             Expect 5–8 hours of daily hiking, with distances varying between
//             10–12 km. The round-trip from Lukla to Everest Base Camp is roughly
//             130 km (80 mi), starting at 2,860 m and rising to a high point of
//             5,455 m on Kala Patthar.
//           </p>
//           <p className="text-lg font-sans text-gray-700 leading-relaxed">
//             Your journey begins with an exhilarating flight from Kathmandu to
//             Lukla, then on foot through Sherpa settlements—Phakding, Namche,
//             Tengboche, and Dingboche—each alive with fluttering prayer flags,
//             colorful monasteries, and Himalayan panoramas.
//           </p>
//           <p className="text-lg font-sans text-gray-700 leading-relaxed">
//             Beyond the peaks, you’ll meet the Sherpa people, visit their ancient
//             monasteries, and immerse yourself in their resilient way of life.
//             Acclimatization days in Namche Bazaar and Dingboche ensure a
//             balanced pace and deep cultural connection.
//           </p>
//           <p className="text-lg font-sans text-gray-700 leading-relaxed italic">
//             Join our specially crafted 16-day Everest Base Camp package for a
//             once-in-a-lifetime experience in the Majestic Himalayas.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }
// export default TrekSummary;

// src/components/trek/Overview.jsx
import React from "react";

export default function Overview({
  heading = null,
  articles = [],
  bullets = [],
}) {
  return (
    <section
      id="overview"
      className="bg-white rounded-lg p-6 sm:p-8 md:p-10 shadow-lg space-y-6 border border-gray-100"
    >
      {/* Heading */}
      {heading && (
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
            {heading}
          </h2>
          <div className="w-24 h-1 bg-yellow-600 mx-auto mt-4"></div>
        </div>
      )}

      {/* Paragraphs */}
      {Array.isArray(articles) && articles.length > 0 && (
        <div className="space-y-6 text-gray-700 text-base sm:text-lg leading-relaxed">
          {articles.map((paragraph, idx) => (
            <p
              key={idx}
              className={`${
                idx === articles.length - 1
                  ? "italic font-medium text-yellow-800"
                  : ""
              } text-justify`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* Bullet Points */}
      {Array.isArray(bullets) && bullets.length > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Trek Summary
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-800 text-sm sm:text-base">
            {bullets.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-2 h-2 bg-yellow-600 rounded-full mt-2"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
