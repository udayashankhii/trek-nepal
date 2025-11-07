import React from "react";

const TrekAddInfo = ({ sections = [] }) => {
  if (!Array.isArray(sections) || sections.length === 0) return null;

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

        <div className="bg-blue-50 border border-blue-100 rounded-b-xl p-6 space-y-10">
          {sections.map((section, i) => (
            <div key={i} className="space-y-4">
              {section.heading && (
                <h3 className="text-lg font-bold text-blue-900 mb-2">{section.heading}</h3>
              )}
              {section.articles && section.articles.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                  {section.articles.map((article, j) => (
                    <p key={j} className="text-gray-700 mb-2 leading-relaxed">
                      {typeof article === "object" && article !== null
                        ? article.text
                        : article}
                    </p>
                  ))}
                </div>
              )}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="list-disc list-inside space-y-1">
                  {section.bullets.map((bullet, k) => (
                    <li key={k} className="flex items-start text-gray-700">
                      <span className="mr-2 mt-1 text-blue-500">•</span>
                      {typeof bullet === "object" && bullet !== null
                        ? bullet.text
                        : bullet}
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
