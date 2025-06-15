// src/components/trek/SimilarItineraries.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, Heart, ArrowRight } from 'lucide-react';

/**
 * SimilarItineraries
 * Renders a premium "You May Also Like" section with trek cards.
 * @param {{
 *   id: string | number;
 *   image: string;
 *   title: string;
 *   duration: string;
 *   price: string;
 *   originalPrice?: string;
 *   rating: number;
 *   reviews: number;
 *   badge?: string;
 * }[]} treks
 * @param {string} exploreLink - URL for the "Explore More" button
 */
const SimilarItineraries = ({ treks, exploreLink = '/treks' }) => {
  return (
    <section className="my-12 px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <p className="text-sm text-green-600 font-medium uppercase">You May Also Like</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">Similar Itineraries</h2>
        </div>
        <Link
          to={exploreLink}
          className="mt-4 md:mt-0 inline-flex items-center bg-green-600 text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
        >
          Explore More <ArrowRight className="ml-2" size={20} />
        </Link>
      </div>

      {/* Grid of trek cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {treks.map((trek) => (
          <Link
            key={trek.id}
            to={`/treks/${trek.id}`}
            className="group block bg-white border border-gray-200 rounded-lg shadow hover:shadow-2xl transform hover:-translate-y-1 transition"
          >
            {/* Image and badge */}
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={trek.image}
                alt={trek.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {trek.badge && (
                <span className="absolute top-4 left-4 bg-green-600 text-white text-xs uppercase font-semibold px-3 py-1 rounded">
                  {trek.badge}
                </span>
              )}
              <Heart className="absolute top-4 right-4 text-white hover:text-red-500 transition" size={24} />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition">
                {trek.title}
              </h3>

              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar size={16} />
                <span>{trek.duration}</span>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-green-600 font-semibold">{trek.price}</span>
                {trek.originalPrice && (
                  <span className="line-through text-gray-400">{trek.originalPrice}</span>
                )}
                <span className="text-gray-500">P/P</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <Star className="text-yellow-400" size={16} />
                <span className="font-medium text-gray-800">{trek.rating}</span>
                <span className="text-gray-500">({trek.reviews} reviews)</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SimilarItineraries;

// Example usage:
// const sampleTreks = [
//   {
//     id: 1,
//     image: '/images/everest-basecamp.jpg',
//     title: 'Luxury Everest Base Camp Trek & Heli Return',
//     duration: '6 Days',
//     price: 'US$2500',
//     originalPrice: 'US$3025',
//     rating: 5.0,
//     reviews: 6,
//     badge: 'Luxury',
//   },
//   // ...more treks
// ];
// <SimilarItineraries treks={sampleTreks} exploreLink="/treks" />
