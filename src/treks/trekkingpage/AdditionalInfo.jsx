// src/treks/trekkingpage/AdditionalInfo.jsx
import React from "react";

const TrekAddInfo = ({ trek }) => {
  const infoList = trek?.additionalInfo || [];

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
{Array.isArray(info.articles) && info.articles.map((article, i) => (
  <p key={i} className="text-gray-700 mb-2 leading-relaxed">
    {typeof article === "object" && article !== null ? article.text : article}
  </p>
))}


          
              {info.bullets.map((bullet, i) => (
  <li key={i} className="flex items-start text-gray-700">
    <svg>...</svg>
    {typeof bullet === "object" && bullet !== null ? bullet.text : bullet}
  </li>
))}

              )
            </div>
          ))} 
        </div>
      </div>
    </section>
  );
};

export default TrekAddInfo;
