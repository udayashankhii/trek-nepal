import React from "react";
import { FiSearch } from "react-icons/fi";

const Hero = ({ searchTerm, setSearchTerm }) => {
  return (
    <section
      className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: "url('/trekkinginnepal.jpg')",
      }}
    >
      {/* Optional Overlay (darken background for better text visibility) */}
      <div className="absolute inset-0 bg-black opacity-30 z-0" />

      <div className="text-white text-center px-4 z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          Discover Nepal’s{" "}
          <span className="text-yellow-400">Majestic Treks</span>
        </h1>
        <p className="text-xl md:text-2xl mb-4 max-w-2xl mx-auto">
          Begin your once-in-a-lifetime Himalayan adventure with Nepal Nirvana
          Adventours.
        </p>

        {/* Search Box */}
        <div className="max-w-xl mx-auto bg-white rounded-full shadow-lg overflow-hidden">
          <div className="flex items-center">
            <span className="px-4 text-gray-500">
              <FiSearch size={22} />
            </span>
            <input
              type="text"
              placeholder="Search trek or region..."
              className="w-full py-3 px-2 text-gray-700 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-yellow-800 hover:bg-yellow-600 text-white px-6 py-3 transition-all">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
