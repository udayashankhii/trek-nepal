import React from "react";
import { Link } from "react-router-dom";
import { Backpack } from "lucide-react";
import {
  GlobeAltIcon,
  HeartIcon,
  TruckIcon,
  QuestionMarkCircleIcon,
  ArrowRightIcon,


} from "@heroicons/react/24/outline";


const TravelIndex = () => {
  const travelSections = [
    {
      title: "Visa Information",
      description:
        "Everything you need to know about Nepal visa requirements, fees, and application process",
      icon: <GlobeAltIcon className="w-12 h-12" />,
      link: "/travel-info/visa-information",
      color: "blue",
      highlights: [
        "Visa on Arrival",
        "Online Application",
        "Entry Points",
        "Fee Structure",
      ],
    },
    {
      title: "Health & Safety",
      description:
        "Essential health preparations, safety tips, and emergency information for your Nepal journey",
      icon: <HeartIcon className="w-12 h-12" />,
      link: "/travel-info/health-safety",
      color: "green",
      highlights: [
        "Vaccinations",
        "Altitude Sickness",
        "Emergency Contacts",
        "Travel Insurance",
      ],
    },
    {
      title: "Packing Guide",
      description:
        "Comprehensive packing lists and gear recommendations for different seasons and trekking regions",
      icon: <Backpack className="w-6 h-6" />,
      link: "/travel-info/packing-list",
      color: "orange",
      highlights: [
        "Seasonal Gear",
        "Trekking Equipment",
        "Local Shopping",
        "What Not to Bring",
      ],
    },
    {
      title: "Transportation",
      description:
        "Navigate Nepal efficiently with our complete guide to flights, buses, taxis, and local transport",
      icon: <TruckIcon className="w-12 h-12" />,
      link: "/travel-info/transportation",
      color: "purple",
      highlights: [
        "Domestic Flights",
        "Bus Travel",
        "Ride Sharing",
        "Unique Transport",
      ],
    },
    {
      title: "FAQs",
      description:
        "Frequently asked questions about traveling to Nepal, answered by local experts",
      icon: <QuestionMarkCircleIcon className="w-12 h-12" />,
      link: "/travel-info/faqs",
      color: "indigo",
      highlights: [
        "General Travel",
        "Trekking",
        "Cultural Questions",
        "Practical Tips",
      ],
    },
  ];

  const quickTips = [
    {
      icon: "🏔️",
      title: "Best Time to Visit",
      description:
        "October-November and March-April offer the best weather and clearest mountain views",
    },
    {
      icon: "💰",
      title: "Budget Planning",
      description:
        "Budget $30-50/day for comfortable travel, including accommodation, food, and transport",
    },
    {
      icon: "🎒",
      title: "Essential Documents",
      description:
        "Passport (6+ months validity), travel insurance, and permits for trekking regions",
    },
    {
      icon: "📱",
      title: "Stay Connected",
      description:
        "Local SIM cards available at airport; WiFi common in tourist areas but limited in remote regions",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Travel Information
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto px-4">
              Your complete guide to planning and enjoying an unforgettable
              journey to Nepal
            </p>
          </div>
        </div>
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-pulse">
          🇳🇵
        </div>
        <div className="absolute bottom-20 right-10 text-4xl opacity-30 animate-bounce">
          🏔️
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Travel Sections Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800">
              Essential Travel Information
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know for a safe, comfortable, and amazing
              journey to the roof of the world
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {travelSections.map((section, index) => (
              <Link
                key={index}
                to={section.link}
                className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="space-y-6">
                  <div
                    className={`text-${section.color}-600 group-hover:text-${section.color}-700 transition-colors`}
                  >
                    {section.icon}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {section.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 text-sm">
                      Key Topics:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {section.highlights.map((highlight, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 bg-${section.color}-50 text-${section.color}-700 rounded-full text-sm font-medium`}
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                    <span>Learn More</span>
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Tips Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800">
              Quick Travel Tips
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential insights to help you prepare for your Nepal adventure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickTips.map((tip, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="text-4xl text-center">{tip.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 text-center">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-center">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-12 text-center text-white">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">
              Ready to Plan Your Nepal Adventure?
            </h2>
            <p className="text-xl max-w-2xl mx-auto">
              With all the essential information at your fingertips, you're
              ready to embark on the journey of a lifetime. Start with any
              section above to dive deeper into the details!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/travel-info/visa-information"
                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Start with Visa Info
              </Link>
              <Link
                to="/contact-us"
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                Contact Our Experts
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TravelIndex;
