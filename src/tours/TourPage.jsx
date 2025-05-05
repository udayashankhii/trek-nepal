// src/pages/tours/TourIndexPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Star,
  Filter,
  Search,
  Heart,
  Map,
  Calendar,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import toursData from "../data/toursdata.js";

function TourIndexPage() {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Tours" },
    { id: "day", name: "Day Tours" },
    { id: "hiking", name: "Hiking" },
    { id: "cultural", name: "Cultural Tours" },
    { id: "adventure", name: "Adventure" },
  ];

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setTours(toursData);
      setFilteredTours(toursData);
      setLoading(false);
    }, 800);
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let result = tours;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (tour) =>
          tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.duration.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (activeFilter !== "all") {
      result = result.filter((tour) => tour.categories?.includes(activeFilter));
    }

    setFilteredTours(result);
  }, [searchTerm, activeFilter, tours]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
    const Navigate = useNavigate();
  

  return (
    <>
      {/* Hero Section with Search */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-800/70 to-yellow-800/70 z-10"></div>
        <img
          src="/moutainimage.avif"
          alt="Nepal Mountains"
          className="w-full h-[60vh] object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 drop-shadow-md"
          >
            Discover Nepal's{" "}
            <span className="text-yellow-400">Premium Tours</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-center max-w-2xl mb-10"
          >
            Expertly crafted experiences in the heart of the Himalayas
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative w-full max-w-2xl"
          >
            <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden p-1">
              <input
                type="text"
                placeholder="Search tours, destinations, or activities..."
                className="w-full py-4 px-6 text-gray-700 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-green-600 text-white p-4 rounded-full hover:bg-green-700 transition">
                <Search size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Nepal Premium Tours
            </h2>
            <p className="text-gray-600 mt-1">
              {filteredTours.length} tours available for your next adventure
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 py-2 px-4 border border-gray-300 rounded-full hover:bg-gray-50 transition"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>

            <select className="py-2 px-4 border border-gray-300 rounded-full bg-white hover:bg-gray-50 transition">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Duration: Shortest</option>
              <option>Duration: Longest</option>
              <option>Rating: Highest</option>
            </select>
          </div>
        </div>

        {/* Expanded Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveFilter(category.id)}
                      className={`block px-4 py-2 w-full text-left rounded-lg transition ${
                        activeFilter === category.id
                          ? "bg-green-600 text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Duration</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-green-600" />
                    <span>1-3 Days</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-green-600" />
                    <span>4-7 Days</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-green-600" />
                    <span>8-14 Days</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-green-600" />
                    <span>15+ Days</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    className="w-full accent-green-600"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>$0</span>
                    <span>$1000+</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Clear All
              </button>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}

        {/* Tour Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
          </div>
        ) : (
          <>
            {filteredTours.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-xl">
                  No tours match your criteria
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilter("all");
                  }}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTours.map((tour) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
                  >
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(tour.id)}
                      className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-yellow-100 transition"
                      aria-label="Add to favorites"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(tour.id)
                            ? "text-red-500 fill-red-500"
                            : "text-gray-400"
                        }`}
                      />
                    </button>

                    {/* Badge */}
                    {tour.badge && (
                      <span className="absolute top-3 left-3 z-10 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        {tour.badge}
                      </span>
                    )}

                    {/* Image */}
                    <Link to={`/tours/${tour.id}`} className="relative block">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </Link>

                    {/* Content */}
                    <div className="p-5 flex flex-col gap-3">
                      <Link
                        to={`/tours/${tour.id}`}
                        className="text-xl font-semibold text-gray-900 hover:text-green-700 transition"
                      >
                        {tour.title}
                      </Link>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-lg text-green-700">
                            US${tour.price}
                          </span>
                          {tour.oldPrice && (
                            <span className="text-gray-400 line-through text-sm ml-2">
                              US${tour.oldPrice}
                            </span>
                          )}
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded ml-2">
                            P/P
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Calendar className="w-4 h-4 text-green-600" />
                          {tour.duration}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Users className="w-4 h-4 text-green-600" />
                          Max 12
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1 text-sm">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(tour.rating)
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-600">
                            ({tour.reviews})
                          </span>
                        </div>

                        <Link
                          to={`/tours/${tour.id}`}
                          className="text-green-700 hover:text-green-800 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Featured Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Premium Tours
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Map className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Expert Local Guides
              </h3>
              <p className="text-gray-600">
                Our guides have decades of experience and intimate knowledge of
                Nepal's hidden gems.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Users className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Small Group Sizes</h3>
              <p className="text-gray-600">
                We limit our groups to ensure personalized attention and
                authentic experiences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Star className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Premium Accommodations
              </h3>
              <p className="text-gray-600">
                Enjoy the best available lodges and teahouses with comfortable
                amenities.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/plan"
              className="bg-yellow-800 hover:bg-yellow-700 text-white font-semibold px-8 py-3 rounded-full shadow inline-block transition"
            >
              Plan Your Custom Trip
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">
            What Our Clients Say
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Don't just take our word for it - hear from some of our satisfied
            adventurers
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "The trek to Everest Base Camp was the adventure of a
                  lifetime. The guides were knowledgeable, patient, and made us
                  feel safe the entire journey."
                </p>
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center text-gray-500 font-bold">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-gray-500">
                      Everest Base Camp Trek, April 2025
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">
            Stay Updated with Special Offers
          </h2>
          <p className="max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter for exclusive deals, seasonal discounts,
            and expert travel tips for your Nepal adventure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-6 py-3 rounded-full text-gray-800 focus:outline-none"
            />
            <button className="bg-yellow-800 hover:bg-yellow-700 text-white px-8 py-3 rounded-full font-semibold transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
export default TourIndexPage;
