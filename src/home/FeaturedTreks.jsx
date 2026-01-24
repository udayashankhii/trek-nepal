

// src/components/home/HomeFeaturedTreks.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import TrekCard from "../treks/TrekCard";
import { fetchAllTreks } from "../api/service/trekService"

export default function HomeFeaturedTreks() {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeaturedTreks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all treks
        const allTreks = await fetchAllTreks();
        
        // Filter featured treks (you can add a 'featured' field in your API)
        // For now, let's take top-rated treks with most reviews
        const featuredTreks = allTreks
          .sort((a, b) => {
            // Sort by rating first, then by review count
            const ratingDiff = (Number(b.rating) || 0) - (Number(a.rating) || 0);
            if (ratingDiff !== 0) return ratingDiff;
            return (Number(b.reviews) || 0) - (Number(a.reviews) || 0);
          })
          .slice(0, 6); // Take top 6 treks

        setTreks(featuredTreks);
      } catch (err) {
        console.error("Error loading featured treks:", err);
        setError(err.message || "Failed to load featured treks");
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedTreks();
  }, []);

  // Loading State
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            
          </div>

          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading featured treks...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Treks
            </h2>
          </div>

          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center max-w-md">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Unable to Load Treks
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty State
  if (!treks || treks.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Treks
            </h2>
          </div>

          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center max-w-md">
              <p className="text-gray-600 mb-6">
                No featured treks available at the moment.
              </p>
              <Link
                to="/treks"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse All Treks
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Success State - Display Treks
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        

        {/* Trek Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {treks.map((trek) => (
            <TrekCard
              key={trek.slug || trek.public_id}
              trek={trek}
              variant="detailed"
              showDetails
            />
          ))}
        </div>

        {/* Call to Action */}
   
      </div>
    </section>
  );
}