import React, { useState } from "react";
import {
  HeartIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const HealthSafetyPage = () => {
  const [activeSection, setActiveSection] = useState("health");

  const vaccinations = [
    {
      name: "Hepatitis A & B",
      importance: "Highly Recommended",
      description:
        "Protects against liver infections common in developing countries",
      timeline: "2-4 weeks before travel",
      color: "green",
    },
    {
      name: "Typhoid",
      importance: "Recommended",
      description: "Prevents bacterial infection from contaminated food/water",
      timeline: "2 weeks before travel",
      color: "blue",
    },
    {
      name: "Japanese Encephalitis",
      importance: "Rural Areas",
      description: "Essential if visiting rural areas during monsoon season",
      timeline: "1 month before travel",
      color: "yellow",
    },
    {
      name: "Rabies (Pre-exposure)",
      importance: "Adventure Travelers",
      description: "Crucial for trekkers and wildlife enthusiasts",
      timeline: "1 month before travel",
      color: "red",
    },
  ];

  const altitudeTips = [
    {
      icon: "🏔️",
      title: "Gradual Ascent Rule",
      description:
        "Above 3,000m, ascend no more than 500m per day and include rest days every 1,000m gain",
      tip: 'The golden rule: "Climb high, sleep low" when possible',
    },
    {
      icon: "💧",
      title: "Hydration is Key",
      description:
        "Drink 3-4 liters of water daily at altitude. Clear, frequent urination is a good sign!",
      tip: "Avoid alcohol and caffeine which can worsen dehydration",
    },
    {
      icon: "⚠️",
      title: "Know AMS Symptoms",
      description:
        "Headache, nausea, fatigue, dizziness. If symptoms worsen, descend immediately!",
      tip: "Never ascend with worsening symptoms - descent is the only cure",
    },
    {
      icon: "🍽️",
      title: "Energy & Nutrition",
      description:
        "Eat carb-rich foods like dal bhat. Your body burns 50% more calories at altitude",
      tip: 'Local saying: "24 hour dal bhat power!" - there\'s truth to it!',
    },
  ];

  const emergencyContacts = [
    {
      service: "Tourist Police",
      number: "1144",
      description: "English-speaking police for tourist assistance",
      icon: "👮‍♂️",
      color: "blue",
    },
    {
      service: "Medical Emergency",
      number: "102",
      description: "Ambulance and emergency medical services",
      icon: "🚑",
      color: "red",
    },
    {
      service: "General Police",
      number: "100",
      description: "General police emergency line",
      icon: "🚨",
      color: "blue",
    },
    {
      service: "Fire & Rescue",
      number: "101",
      description: "Fire department and rescue services",
      icon: "🚒",
      color: "orange",
    },
  ];

  const culturalSafety = [
    {
      icon: "🙏",
      title: "Temple Etiquette",
      do: "Remove shoes, dress modestly, ask before photography",
      dont: "Touch religious artifacts, point feet toward shrines",
      story:
        "Nepalis believe touching someone's head brings bad luck - avoid it!",
    },
    {
      icon: "👗",
      title: "Dress Respectfully",
      do: "Cover shoulders and knees, especially in rural areas",
      dont: "Wear revealing clothes in religious or conservative areas",
      story:
        "Dressing modestly shows respect and often leads to warmer local interactions",
    },
    {
      icon: "📸",
      title: "Photography Ethics",
      do: "Ask permission, offer to share photos with locals",
      dont: "Photograph without consent, especially children or ceremonies",
      story:
        "Many locals love seeing photos of themselves - it's a great icebreaker!",
    },
    {
      icon: "🤝",
      title: "Social Interactions",
      do: 'Use "Namaste" with palms together, accept tea when offered',
      dont: "Use left hand for eating/greeting, refuse hospitality rudely",
      story:
        "Sharing a cup of tea often leads to lifelong friendships in Nepal",
    },
  ];

  const insuranceGuide = [
    {
      coverage: "Medical Treatment",
      minimum: "$100,000+",
      description:
        "Covers hospital visits, medications, and medical procedures",
      essential: true,
    },
    {
      coverage: "Emergency Evacuation",
      minimum: "$1,000,000+",
      description:
        "Helicopter rescue from remote areas - absolutely critical for trekking",
      essential: true,
    },
    {
      coverage: "Repatriation",
      minimum: "$1,000,000+",
      description: "Transport back to home country if seriously injured",
      essential: true,
    },
    {
      coverage: "Adventure Sports",
      minimum: "Specific Coverage",
      description: "Covers trekking, climbing, rafting - check policy details",
      essential: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="inline-flex items-center gap-3 mb-4">
              <HeartIcon className="w-12 h-12" />
              <h1 className="text-5xl md:text-6xl font-bold">
                Health & Safety
              </h1>
            </div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">
              Stay healthy, stay safe, and make the most of your Himalayan
              adventure
            </p>
          </div>
        </div>
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-pulse">
          💚
        </div>
        <div className="absolute bottom-20 right-10 text-4xl opacity-30 animate-bounce">
          🛡️
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Health Preparations */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
              <ShieldCheckIcon className="w-10 h-10 text-green-600" />
              Health Preparations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Smart preparation keeps you healthy so you can focus on the
              incredible experiences Nepal offers!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {vaccinations.map((vaccine, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">
                      {vaccine.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        vaccine.color === "green"
                          ? "bg-green-100 text-green-800"
                          : vaccine.color === "blue"
                          ? "bg-blue-100 text-blue-800"
                          : vaccine.color === "yellow"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {vaccine.importance}
                    </span>
                  </div>
                  <p className="text-gray-600">{vaccine.description}</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Timeline:</span>{" "}
                      {vaccine.timeline}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Altitude Awareness */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800">
              🏔️ Altitude Mastery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conquer the heights safely! These altitude tips will keep you
              enjoying the views instead of suffering from symptoms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {altitudeTips.map((tip, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{tip.icon}</span>
                    <h3 className="text-xl font-bold text-gray-800">
                      {tip.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {tip.description}
                  </p>
                  <div className="bg-blue-100 rounded-lg p-4">
                    <p className="text-blue-800 font-medium text-sm">
                      💡 Pro Tip: {tip.tip}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Altitude Sickness Warning */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-8 border border-yellow-200">
            <div className="flex items-start gap-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-yellow-800">
                  Altitude Sickness: Know the Signs
                </h3>
                <p className="text-yellow-700 text-lg">
                  <strong>Mild AMS:</strong> Headache, nausea, fatigue,
                  dizziness, difficulty sleeping
                </p>
                <p className="text-yellow-700 text-lg">
                  <strong>Serious Warning:</strong> Confusion, difficulty
                  walking, severe breathlessness, persistent cough
                </p>
                <div className="bg-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-bold">
                    🚨 Emergency Action: If symptoms worsen or don't improve
                    with rest, descend immediately. Don't wait!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
              <PhoneIcon className="w-10 h-10 text-red-600" />
              Emergency Contacts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Save these numbers in your phone before you travel. Hope you never
              need them, but better safe than sorry!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className={`text-6xl`}>{contact.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {contact.service}
                    </h3>
                    <div
                      className={`text-3xl font-bold mb-2 ${
                        contact.color === "red"
                          ? "text-red-600"
                          : contact.color === "blue"
                          ? "text-blue-600"
                          : "text-orange-600"
                      }`}
                    >
                      {contact.number}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {contact.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cultural Safety */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800">
              🕊️ Cultural Respect & Safety
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Respectful travelers are welcomed with open hearts. These cultural
              insights keep you safe and loved by locals!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {culturalSafety.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{item.icon}</span>
                    <h3 className="text-xl font-bold text-gray-800">
                      {item.title}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-1">
                        ✅ Do:
                      </h4>
                      <p className="text-green-700">{item.do}</p>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-1">
                        ❌ Don't:
                      </h4>
                      <p className="text-red-700">{item.dont}</p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <span className="font-semibold">💫 Local Insight:</span>{" "}
                        {item.story}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Travel Insurance */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800">
              🛡️ Travel Insurance Essentials
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Not just recommended, but absolutely essential! Your insurance
              could be the difference between a minor inconvenience and a
              life-changing financial burden.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-purple-800 text-center">
                Minimum Coverage Requirements
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {insuranceGuide.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 border border-purple-100"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-gray-800">
                          {item.coverage}
                        </h4>
                        {item.essential && (
                          <span className="text-red-500 text-xl">⭐</span>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {item.minimum}
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-purple-100 rounded-lg p-6">
                <h4 className="text-lg font-bold text-purple-800 mb-3">
                  🚁 Why Helicopter Evacuation Coverage Matters
                </h4>
                <p className="text-purple-700">
                  A helicopter rescue from Everest Base Camp costs
                  $15,000-$40,000. From remote areas like Manaslu or Dolpo,
                  costs can exceed $100,000. Without proper insurance, you could
                  face bankruptcy from a medical emergency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-12 text-center text-white">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Your Health, Your Adventure</h2>
            <p className="text-xl max-w-2xl mx-auto">
              With proper preparation and awareness, you're ready to safely
              experience everything Nepal has to offer. From ancient temples to
              towering peaks - adventure awaits the prepared traveler!
            </p>
            <div className="text-6xl">🏔️💚🇳🇵</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HealthSafetyPage;
