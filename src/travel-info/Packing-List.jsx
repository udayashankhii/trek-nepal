import React, { useState } from "react";
import {
  BeakerIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  // BackpackIcon is removed from here since it doesn't exist in heroicons
} from "@heroicons/react/24/outline";
import { Backpack } from "lucide-react";
// Let's invent a BackpackIcon since it's not in the standard Heroicons
const BackpackIcon = ({ className, ...props }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm4 0h8m-8 8h8"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
    />
  </svg>
);

const PackingInformationPage = () => {
  const [activeCategory, setActiveCategory] = useState("essentials");
  const [selectedSeason, setSelectedSeason] = useState("autumn");

  const seasons = [
    { id: "autumn", name: "Autumn (Sep-Nov)", icon: "🍂", color: "orange" },
    { id: "winter", name: "Winter (Dec-Feb)", icon: "❄️", color: "blue" },
    { id: "spring", name: "Spring (Mar-May)", icon: "🌸", color: "pink" },
    {
      id: "summer",
      name: "Summer/Monsoon (Jun-Aug)",
      icon: "☔",
      color: "green",
    },
  ];

  const trekRegions = [
    {
      name: "Everest Region",
      elevation: "3,440m - 5,545m",
      temp: "-15°C to 20°C",
      features: ["High altitude", "Cold nights", "Sunny days", "Wind exposure"],
      icon: "🏔️",
    },
    {
      name: "Annapurna Region",
      elevation: "1,000m - 5,416m",
      temp: "-5°C to 25°C",
      features: [
        "Diverse elevations",
        "Hot valleys",
        "Alpine weather",
        "Rain forests",
      ],
      icon: "⛰️",
    },
    {
      name: "Langtang Region",
      elevation: "1,400m - 4,984m",
      temp: "-5°C to 22°C",
      features: ["Less extreme", "Varied landscape", "Moderate climate"],
      icon: "🏞️",
    },
    {
      name: "Mustang Region",
      elevation: "2,800m - 3,800m",
      temp: "-5°C to 25°C",
      features: [
        "Desert-like",
        "Dry climate",
        "Strong winds",
        "Little rainfall",
      ],
      icon: "🏜️",
    },
  ];

  const gearCategories = [
    { id: "essentials", name: "Essential Gear", icon: "✨" },
    { id: "clothing", name: "Clothing & Layers", icon: "👕" },
    { id: "footwear", name: "Footwear", icon: "👟" },
    { id: "electronics", name: "Electronics & Gadgets", icon: "📱" },
    { id: "personal", name: "Personal Items", icon: "🧴" },
    { id: "documents", name: "Documents & Money", icon: "📄" },
  ];

  const seasonalGear = {
    autumn: {
      essentials: [
        {
          item: "Trekking Backpack",
          recommendation: "50-70L main pack, 15-25L daypack",
          description:
            "Choose a comfortable, well-fitted pack that transfers weight to your hips",
          essential: true,
          note: "A backpack with an internal frame offers better weight distribution",
        },
        {
          item: "Four-Season Sleeping Bag",
          recommendation: "Rated for -10°C to -15°C for high altitude",
          description:
            "Down offers better warmth-to-weight ratio, synthetic is better when wet",
          essential: true,
          note: "Consider renting in Kathmandu to save luggage space",
        },
        {
          item: "Trekking Poles",
          recommendation: "Collapsible, adjustable poles",
          description:
            "Reduces strain on knees during steep descents and provides stability on uneven terrain",
          essential: true,
          note: "Carbon fiber is lighter but aluminum is more durable",
        },
        {
          item: "Headlamp",
          recommendation: "LED with 200+ lumens",
          description:
            "Essential for early morning starts and navigating tea houses at night",
          essential: true,
          note: "Pack extra batteries - they're expensive in mountain villages",
        },
      ],
      clothing: [
        {
          item: "Down Jacket",
          recommendation: "700+ fill power",
          description:
            "Your essential warmth layer for cold evenings and high altitude",
          essential: true,
          note: "Can be rented in Kathmandu, but quality varies",
        },
        {
          item: "Layering System",
          recommendation: "Base + mid + outer layers",
          description:
            "Base: moisture-wicking, Mid: insulating, Outer: windproof/waterproof",
          essential: true,
          note: "The key to Nepal trekking is adaptable layers you can add/remove",
        },
        {
          item: "Trekking Shirts",
          recommendation: "3-4 short sleeve, 2 long sleeve",
          description: "Quick-dry, moisture-wicking synthetic or wool blend",
          essential: true,
          note: "Merino wool prevents odor but synthetic dries faster",
        },
        {
          item: "Trekking Pants",
          recommendation: "2-3 pairs, convertible recommended",
          description:
            "Lightweight, quick-dry pants, ideally with zip-off legs",
          essential: true,
          note: "Avoid cotton - it takes forever to dry and gets cold when wet",
        },
      ],
      footwear: [
        {
          item: "Hiking Boots",
          recommendation: "Mid to high-top, waterproof",
          description:
            "Well broken-in boots with ankle support and good traction",
          essential: true,
          note: "Never bring brand new boots on a trek - guaranteed blisters!",
        },
        {
          item: "Trekking Socks",
          recommendation: "4-5 pairs wool blend",
          description:
            "Moisture-wicking, cushioned socks specifically designed for hiking",
          essential: true,
          note: "Invest in quality socks - your feet will thank you",
        },
        {
          item: "Camp Shoes",
          recommendation: "Light sandals or trail runners",
          description: "Something comfortable to change into at tea houses",
          essential: false,
          note: "Your feet need to breathe after a long day of trekking",
        },
        {
          item: "Gaiters",
          recommendation: "Mid-height waterproof",
          description: "Keeps debris and water out of your boots",
          essential: false,
          note: "Essential if there's a chance of snow on your route",
        },
      ],
      electronics: [
        {
          item: "Power Bank",
          recommendation: "20,000+ mAh capacity",
          description: "Essential for charging devices on multi-day treks",
          essential: true,
          note: "Charging costs increase with altitude - often $3-5 per device",
        },
        {
          item: "Camera",
          recommendation: "Weatherproof with spare batteries",
          description: "You'll want to capture Nepal's incredible scenery",
          essential: false,
          note: "Cold drains batteries quickly - keep them warm in inside pockets",
        },
        {
          item: "Headphones",
          recommendation: "Comfortable for long wear",
          description: "For entertainment during rest days or long bus rides",
          essential: false,
          note: "Noise-cancelling can be a blessing in noisy tea houses",
        },
        {
          item: "Adapter",
          recommendation: "Type C/D compatible",
          description: "Nepal uses Type C/D outlets, 230V",
          essential: true,
          note: "Multi-adapters are available cheaply in Thamel, Kathmandu",
        },
      ],
      personal: [
        {
          item: "First Aid Kit",
          recommendation: "Basic kit plus altitude medications",
          description:
            "Include: bandages, blister treatment, pain relievers, altitude sickness meds",
          essential: true,
          note: "Diamox (for altitude) requires prescription in most countries",
        },
        {
          item: "Water Purification",
          recommendation: "Tablets or UV purifier",
          description:
            "Don't rely on buying bottled water - it's expensive and creates waste",
          essential: true,
          note: "Steripen is great but bring backup tablets in case batteries die",
        },
        {
          item: "Sunscreen & Lip Balm",
          recommendation: "SPF 50+, water-resistant",
          description:
            "UV radiation is intense at altitude, even on cloudy days",
          essential: true,
          note: "Apply sunscreen even under chin/nose - reflection from snow burns!",
        },
        {
          item: "Personal Medications",
          recommendation: "Original packaging with prescriptions",
          description: "Bring more than you think you need in case of delays",
          essential: true,
          note: "Pharmacies in Kathmandu can supply many medications without prescription",
        },
      ],
      documents: [
        {
          item: "Passport & Visa",
          recommendation: "Valid for 6+ months after entry",
          description: "Keep in waterproof pouch with photocopies",
          essential: true,
          note: "Store digital copies in cloud storage and share with someone at home",
        },
        {
          item: "Trekking Permits",
          recommendation: "TIMS card and conservation permits",
          description: "Required for all trekking regions",
          essential: true,
          note: "Your trekking agency can arrange these, or get them yourself in Kathmandu",
        },
        {
          item: "Travel Insurance",
          recommendation: "Coverage up to 6,000m with helicopter evacuation",
          description: "Print policy details and emergency contact numbers",
          essential: true,
          note: "Verify your policy covers trekking at your planned altitude",
        },
        {
          item: "Cash & Cards",
          recommendation: "USD/EUR + credit card",
          description: "ATMs unavailable in trekking regions",
          essential: true,
          note: "Bring more cash than you think you'll need - prices increase with altitude",
        },
      ],
    },
    winter: {
      essentials: [
        {
          item: "Expedition Sleeping Bag",
          recommendation: "Rated for -20°C or lower",
          description: "High-quality down bag essential for winter treks",
          essential: true,
          note: "Consider a sleeping bag liner for extra warmth",
        },
        {
          item: "Insulated Water Bottles",
          recommendation: "Thermos-style for hot drinks",
          description: "Regular bottles freeze at high altitude in winter",
          essential: true,
          note: "Fill with hot water at night to use as a hot water bottle in your sleeping bag",
        },
      ],
      clothing: [
        {
          item: "Expedition Down Jacket",
          recommendation: "800+ fill power",
          description: "Heavier duty than autumn/spring requirements",
          essential: true,
          note: "Layer with a waterproof shell for snow protection",
        },
        {
          item: "Thermal Base Layers",
          recommendation: "Heavyweight merino wool",
          description: "Top and bottom thermal layers are essential",
          essential: true,
          note: "Pack extras - washing and drying is difficult in winter",
        },
      ],
      footwear: [
        {
          item: "Insulated Hiking Boots",
          recommendation: "Rated for -10°C or lower",
          description:
            "Regular hiking boots are insufficient for high passes in winter",
          essential: true,
          note: "Goretex doesn't breathe well at very low temperatures",
        },
        {
          item: "Crampons/Microspikes",
          recommendation: "Lightweight trail crampons",
          description: "Essential for icy trails and high passes",
          essential: true,
          note: "Practice using them before your trek",
        },
      ],
    },
    spring: {
      essentials: [
        {
          item: "Allergy Medications",
          recommendation: "Non-drowsy antihistamines",
          description: "Spring brings flowers and pollen to lower elevations",
          essential: false,
          note: "If you have known allergies, don't forget your medications",
        },
      ],
      clothing: [
        {
          item: "Rain Jacket & Pants",
          recommendation: "Lightweight, packable",
          description: "Spring can bring unexpected showers",
          essential: true,
          note: "A poncho can substitute but offers less protection in windy conditions",
        },
      ],
    },
    summer: {
      essentials: [
        {
          item: "Leech Socks",
          recommendation: "Full coverage",
          description: "Protects against leeches in wet, forested areas",
          essential: true,
          note: "Tuck pants into socks for complete protection",
        },
        {
          item: "Heavy-duty Rain Gear",
          recommendation: "Fully waterproof, not just water-resistant",
          description: "Monsoon rains can be intense and prolonged",
          essential: true,
          note: "Consider a rain cover for your backpack as well",
        },
      ],
      personal: [
        {
          item: "Mosquito Repellent",
          recommendation: "30%+ DEET",
          description: "Lowland areas have mosquitoes during monsoon",
          essential: true,
          note: "Consider permethrin-treated clothing for extra protection",
        },
        {
          item: "Quick-dry Towel",
          recommendation: "Microfiber, multiple sizes",
          description: "Essential during monsoon when nothing dries quickly",
          essential: true,
          note: "Bring extras since they may not dry overnight",
        },
      ],
    },
  };

  const localInsights = [
    {
      title: "Rent vs. Buy",
      description:
        "Quality trekking gear is available for rent in Kathmandu's Thamel district at a fraction of purchase cost.",
      recommendation:
        "Consider renting bulky items like down jackets and sleeping bags to save luggage space.",
      icon: "💰",
    },
    {
      title: "Support Local",
      description:
        "North Face, Mountain Hardwear and other brand knockoffs are widely available in Kathmandu.",
      recommendation:
        "Some 'local versions' are surprisingly good quality at 70-80% less than authentic items.",
      icon: "🛍️",
    },
    {
      title: "Weight Matters",
      description:
        "If hiring a porter, weight limit is typically 15kg/33lbs per trekker.",
      recommendation:
        "Pack smart and keep your bag under the limit - porters will thank you!",
      icon: "⚖️",
    },
    {
      title: "Trash Management",
      description: "Trekking regions have limited waste management facilities.",
      recommendation:
        "Pack out all trash, especially batteries, plastic wrappers, and non-biodegradable items.",
      icon: "♻️",
    },
  ];

  const getSeasonalGear = (category) => {
    return seasonalGear[selectedSeason][category] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="inline-flex items-center gap-3 mb-4">
              <Backpack className="w-6 h-6" />
              <h1 className="text-5xl md:text-6xl font-bold">Packing Guide</h1>
            </div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">
              Pack smart, trek happy! Everything you need for your Himalayan
              adventure
            </p>
          </div>
        </div>
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">
          🧗‍♂️
        </div>
        <div className="absolute bottom-20 right-10 text-4xl opacity-30 animate-pulse">
          🎒
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Season Selector */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
              <SunIcon className="w-10 h-10 text-yellow-600" />
              Choose Your Season
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nepal's seasonal variations require different gear. Select your
              travel time for tailored recommendations!
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {seasons.map((season) => (
              <button
                key={season.id}
                onClick={() => setSelectedSeason(season.id)}
                className={`p-6 rounded-xl text-center transition-all duration-300 ${
                  selectedSeason === season.id
                    ? `bg-${season.color}-100 border-2 border-${season.color}-500 shadow-lg`
                    : "bg-white border border-gray-200 hover:shadow"
                }`}
              >
                <div className="text-4xl mb-2">{season.icon}</div>
                <h3
                  className={`text-lg font-bold ${
                    selectedSeason === season.id
                      ? `text-${season.color}-800`
                      : "text-gray-800"
                  }`}
                >
                  {season.name}
                </h3>
              </button>
            ))}
          </div>
        </section>

        {/* Trekking Regions */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800">
              🏞️ Regional Considerations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Different trekking regions have different climate patterns. Know
              before you go!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {trekRegions.map((region, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                      <span className="text-3xl">{region.icon}</span>
                      {region.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-1">
                        Elevation
                      </h4>
                      <p className="text-gray-600">{region.elevation}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-1">
                        Temperature
                      </h4>
                      <p className="text-gray-600">{region.temp}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Special Considerations
                    </h4>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      {region.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Packing Categories */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800">
              🎒 Essential Gear Guide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for a comfortable, safe trek in{" "}
              {seasons.find((s) => s.id === selectedSeason).name}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {gearCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full text-center transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === category.id
                    ? "bg-orange-100 text-orange-800 border-2 border-orange-400 shadow-md"
                    : "bg-white border border-gray-200 text-gray-700 hover:shadow"
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Gear Lists */}
          <div className="space-y-6">
            {getSeasonalGear(activeCategory).length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {getSeasonalGear(activeCategory).map((gear, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-xl p-6 shadow-md border transition-all duration-300 hover:shadow-lg ${
                      gear.essential ? "border-orange-300" : "border-gray-200"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-800">
                          {gear.item}
                        </h3>
                        {gear.essential && (
                          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">
                            Essential
                          </span>
                        )}
                      </div>

                      <div className="bg-orange-50 rounded-lg p-3">
                        <p className="text-orange-800 font-medium">
                          {gear.recommendation}
                        </p>
                      </div>

                      <p className="text-gray-600">{gear.description}</p>

                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-blue-800 text-sm">
                          <span className="font-semibold">💡 Insider Tip:</span>{" "}
                          {gear.note}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-xl">
                <p className="text-gray-600 text-lg">
                  Standard recommendations apply for this season. See Autumn
                  list for basics!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Local Insights */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800">
              💫 Local Insights & Hacks
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Insider tips you won't find in standard packing lists!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {localInsights.map((insight, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{insight.icon}</span>
                    <h3 className="text-xl font-bold text-gray-800">
                      {insight.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {insight.description}
                  </p>
                  <div className="bg-white bg-opacity-50 rounded-lg p-4">
                    <p className="text-purple-800 font-medium">
                      <span className="font-bold">Tip:</span>{" "}
                      {insight.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What Not To Bring */}
        <section className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 border border-red-100">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-red-800 text-center">
              🚫 What NOT To Pack
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white bg-opacity-75 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🪑</span>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">
                      Camping Furniture
                    </h4>
                    <p className="text-gray-600">
                      Trekking chairs, tables or other camping furniture -
                      you'll be staying in tea houses with basic furnishings
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-75 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">👗</span>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">
                      Excessive Clothing
                    </h4>
                    <p className="text-gray-600">
                      Multiple outfit changes - you'll wear the same few items
                      repeatedly. Function over fashion!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-75 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🥫</span>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">
                      Excessive Food
                    </h4>
                    <p className="text-gray-600">
                      Tea houses serve meals, so you only need some snacks and
                      energy bars for the trail
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-75 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💎</span>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Valuables</h4>
                    <p className="text-gray-600">
                      Jewelry, expensive watches, or unnecessary electronics
                      that you'll worry about losing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl p-12 text-center text-white">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Ready for Your Trek?</h2>
            <p className="text-xl max-w-2xl mx-auto">
              With the right gear, you're all set for an incredible Himalayan
              adventure. Remember the trekker's mantra: pack light, pack right,
              and embrace the journey!
            </p>
            <div className="text-6xl">🏔️🎒🧗‍♀️</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PackingInformationPage;
