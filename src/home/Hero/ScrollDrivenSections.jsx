import React, { useState, useEffect, useRef } from "react";
import {
  FiCamera,
  FiMapPin,
  FiUsers,
  FiStar,
  FiCalendar,
  FiTrendingUp,
  FiAward,
  FiCompass,
} from "react-icons/fi";
// Import mountain icon from a different package
import { GiMountains } from "react-icons/gi";
// Or use Material Design mountain icon
// import { MdLandscape } from 'react-icons/md';

const ScrollDrivenSections = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute("data-section");
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, sectionId]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    // Observe all sections
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const setSectionRef = (index) => (el) => {
    sectionRefs.current[index] = el;
  };

  const isVisible = (sectionId) => visibleSections.has(sectionId);

  return (
    <>
      <style>{`
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFromBottom {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .parallax-bg {
          transform: translateY(var(--scroll-offset, 0));
        }
        .scroll-reveal {
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .scroll-reveal.visible {
          opacity: 1;
        }
        .slide-left.visible { animation: slideInFromLeft 0.8s ease-out forwards; }
        .slide-right.visible { animation: slideInFromRight 0.8s ease-out forwards; }
        .slide-bottom.visible { animation: slideInFromBottom 0.8s ease-out forwards; }
        .scale-in.visible { animation: scaleIn 0.6s ease-out forwards; }
        .fade-in.visible { animation: fadeIn 1s ease-out forwards; }
      `}</style>

      <div className="scroll-driven-sections">
        {/* Featured Destinations Section */}

        {/* Statistics Section */}
       

        {/* Services Section */}
        <section
          ref={setSectionRef(2)}
          data-section="services"
          className="relative min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black"
        >
          <div className="container mx-auto px-6 py-20">
            <div
              className={`text-center mb-16 scroll-reveal fade-in ${
                isVisible("services") ? "visible" : ""
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Services
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Comprehensive trekking and mountaineering services for every
                adventure level
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div
                className={`scroll-reveal slide-left ${
                  isVisible("services") ? "visible" : ""
                }`}
              >
                <div className="space-y-8">
                  {[
                    {
                      icon: FiCompass,
                      title: "Guided Expeditions",
                      description:
                        "Expert local guides with years of mountain experience",
                    },
                    {
                      icon: FiCamera,
                      title: "Photography Tours",
                      description:
                        "Capture stunning landscapes with professional guidance",
                    },
                    {
                      icon: FiMapPin,
                      title: "Custom Itineraries",
                      description:
                        "Personalized routes tailored to your preferences and fitness level",
                    },
                  ].map((service, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-amber-400/50 transition-all duration-300"
                    >
                      <service.icon className="text-amber-400 text-2xl mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {service.title}
                        </h3>
                        <p className="text-white/80">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`scroll-reveal slide-right ${
                  isVisible("services") ? "visible" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src="/moutainimage.avif"
                    alt="Mountain Services"
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Professional Excellence
                    </h3>
                    <p className="text-white/90">
                      Certified guides and safety-first approach
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section
          ref={setSectionRef(3)}
          data-section="cta"
          className="relative py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900"
        >
          <div className="container mx-auto px-6 text-center">
            <div
              className={`scroll-reveal fade-in ${
                isVisible("cta") ? "visible" : ""
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready for Your Next Adventure?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of adventurers who have experienced the magic of
                the Himalayas
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/30">
                  Book Your Trek
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ScrollDrivenSections;
