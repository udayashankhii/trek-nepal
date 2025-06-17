// src/treks/trekkingpage/AdditionalInfo.jsx
import React from "react";

const TrekAddInfo = ({ trek }) => {
  const infoList = trek.additionalInfo || [];

  if (!infoList.length) return null;

  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl px-6 py-4">
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

        <div className="bg-blue-50 border border-blue-100 rounded-b-xl p-6 space-y-6">
          {infoList.map((info, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow border border-gray-100"
            >
              {info.heading && (
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2" />
                  {info.heading}
                </h3>
              )}

              {info.articles?.map((text, i) => (
                <p key={i} className="text-gray-700 mb-2 leading-relaxed">
                  {text}
                </p>
              ))}

              {info.bullets?.length > 0 && (
                <ul className="list-none space-y-2 mt-3">
                  {info.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start text-gray-700">
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
    </section>
  );
};

export default TrekAddInfo;
