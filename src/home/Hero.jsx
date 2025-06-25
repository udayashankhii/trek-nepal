import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const heroSlides = [
  {
    id: 1,
    title: "Everest Base Camp",
    subtitle: "The Ultimate Himalayan Adventure",
    description:
      "Journey to the base of the world's highest peak through stunning Sherpa villages and ancient monasteries.",
    image: "/everest.jpeg",
  },
  {
    id: 2,
    title: "Annapurna Circuit",
    subtitle: "Classic Mountain Loop Trek",
    description:
      "Experience diverse landscapes from subtropical forests to high mountain deserts in this legendary circuit.",
    image: "/annapurna.jpeg",
  },
  {
    id: 3,
    title: "Manaslu Circuit",
    subtitle: "Off the Beaten Path",
    description:
      "Discover untouched mountain wilderness and authentic Tibetan culture in this remote Himalayan region.",
    image: "/annapurna.jpeg",
  },
  {
    id: 4,
    title: "Langtang Valley",
    subtitle: "Valley of Glaciers",
    description:
      "Trek through pristine forests and traditional Tamang villages beneath towering Himalayan peaks.",
    image: "/moutainimage.avif",
  },
];

export default function HeroSection({
  searchTerm = "",
  setSearchTerm = () => {},
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);


const handleSearch = (e) => {
  e.preventDefault();
  if (searchTerm.trim()) {
    // Navigate to search results page with search query
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);  // Changed this line
  }
};


  const handleExploreClick = () => {
    navigate("/trekking-in-nepal");
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
      <section className="relative w-full h-full min-h-[400px] flex items-center overflow-hidden bg-gray-900">
        {/* Crossfade Images */}
        <div className="absolute inset-0 z-0 w-full h-full">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-[2500ms] ease-in-out ${
                idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>
        {/* Main Content */}
        <div className="relative z-10 w-full flex flex-col justify-center items-start h-full px-6 max-w-3xl mx-auto">
          <h1
            className="text-white text-5xl md:text-7xl font-extrabold mb-4 leading-tight"
            style={{
              animation: "fadeInUp 0.8s ease-out forwards",
              animationDelay: "0.1s",
            }}
          >
            {heroSlides[currentSlide].title}
          </h1>
          <h2
            className="text-amber-400 text-2xl md:text-3xl font-light mb-2"
            style={{
              animation: "fadeInUp 0.8s ease-out forwards",
              animationDelay: "0.2s",
            }}
          >
            {heroSlides[currentSlide].subtitle}
          </h2>
          <p
            className="text-white/90 text-xl md:text-2xl mb-8 max-w-2xl"
            style={{
              animation: "fadeInUp 0.8s ease-out forwards",
              animationDelay: "0.3s",
            }}
          >
            {heroSlides[currentSlide].description}
          </p>
          <form
            className="w-full max-w-xl"
            style={{
              animation: "fadeInUp 0.8s ease-out forwards",
              animationDelay: "0.5s",
            }}
            onSubmit={handleSearch}
          >
            <div className="flex items-center bg-white/80 backdrop-blur-md rounded-full shadow-lg px-4 py-2 border border-white/30">
              <FiSearch className="text-gray-500 mr-2" size={22} />
              <input
                type="text"
                placeholder="Search trek, region, or adventure..."
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search treks"
                autoComplete="off"
              />

              <button
                type="submit"
                className="ml-4 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition duration-200"
              >
                Search
              </button>
            </div>
          </form>
          <button
            onClick={handleExploreClick}
            className="mt-8 px-8 py-4 bg-white text-gray-900 font-bold rounded-full shadow-lg hover:bg-gray-100 transition duration-200"
            style={{
              animation: "fadeInUp 0.8s ease-out forwards",
              animationDelay: "0.7s",
            }}
          >
            Explore Treks
          </button>
        </div>
      </section>
    </>
  );
}
