import React from "react";

// Mock data for the trek
const mockTrekData = {
  additionalInfo: [
    {
      heading: "Packing Tips",
      articles: [
        "Pack light but carry essentials.",
        "Layer your clothing for varying weather.",
      ],
      bullets: [
        "Waterproof jacket",
        "Comfortable hiking boots",
        "Sunscreen",
        "First aid kit",
        "Water bottles",
      ],
    },
    {
      heading: "Local Culture",
      articles: [
        "Respect local customs and traditions.",
        "Learn basic phrases in the local language.",
      ],
      bullets: [
        "Greet with a smile",
        "Avoid sensitive topics",
        "Remove shoes when entering homes",
        "Dress modestly",
      ],
    },
    {
      heading: "Best Time to Visit",
      articles: [
        "The ideal trekking seasons offer clear mountain views and stable weather conditions.",
      ],
      bullets: [
        "Spring (March-May)",
        "Autumn (September-November)",
        "Avoid monsoon season",
      ],
    },
  ],
  healthSafety: {
    heading: "Health & Safety Guidelines",
    paragraphs: [
      "Stay hydrated and take regular breaks during your trek.",
      "Be aware of altitude sickness symptoms and descend if necessary.",
      "Always inform someone about your trekking plans and expected return.",
    ],
    bullets: [
      "Carry a first aid kit",
      "Follow guide instructions",
      "Avoid risky areas",
      "Have emergency contacts",
      "Get travel insurance",
    ],
  },
};

// Dynamic component for Additional Information and Health & Safety
const TrekAddInfo = ({ trek = mockTrekData }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Additional Information */}
        {trek.additionalInfo && trek.additionalInfo.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Additional Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {trek.additionalInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                >
                  {info.heading && (
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {info.heading}
                    </h3>
                  )}
                  {info.articles &&
                    info.articles.map((article, articleIndex) => (
                      <p
                        key={articleIndex}
                        className="text-gray-600 mb-3 leading-relaxed"
                      >
                        {article}
                      </p>
                    ))}
                  {info.bullets && (
                    <ul className="space-y-2">
                      {info.bullets.map((bullet, bulletIndex) => (
                        <li
                          key={bulletIndex}
                          className="flex items-start text-gray-600"
                        >
                          <svg
                            className="w-4 h-4 text-blue-500 mt-1 mr-2 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Health & Safety */}
        {trek.healthSafety && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                {trek.healthSafety.heading}
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="space-y-4">
                  {trek.healthSafety.paragraphs?.map((paragraph, index) => (
                    <p key={index} className="text-gray-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                  {trek.healthSafety.bullets && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Safety Checklist:
                      </h4>
                      <ul className="space-y-2">
                        {trek.healthSafety.bullets.map((bullet, index) => (
                          <li
                            key={index}
                            className="flex items-start text-gray-600"
                          >
                            <svg
                              className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { TrekAddInfo, mockTrekData };
