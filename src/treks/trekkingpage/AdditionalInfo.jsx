// src/trekkingpage/TrekAddInfo.jsx
import React from "react";

// Safely normalize any text (string or object with text/title/description)
const getText = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item.trim();
  if (typeof item === "object") {
    const candidate =
      item.text ?? item.title ?? item.description ?? item.label ?? "";
    return String(candidate).trim();
  }
  return "";
};

const TrekAddInfo = ({ sections = [] }) => {
  if (!Array.isArray(sections) || sections.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title with icon */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-600 to-emerald-400 rounded-full"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Trek Additional Information
          </h2>
        </div>

        {/* Premium card with shadow and border */}
        <div className="relative bg-white border-2 border-slate-200 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 max-w-6xl mx-auto overflow-hidden">
          {/* Accent top border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"></div>
          
          <div className="px-8 md:px-12 py-10 md:py-12">
            <div className="space-y-8">
              {sections.map((section, idx) => {
                if (!section) return null;

                const heading = getText(section.heading);
                const body = getText(section.body);
                const articles = Array.isArray(section.articles)
                  ? section.articles
                  : [];
                const bullets = Array.isArray(section.bullets)
                  ? section.bullets
                  : [];

                const firstArticleText = getText(articles[0]);
                const restArticles = articles.slice(1);
                const mainText = body || firstArticleText || getText(section);

                if (!heading && !mainText && bullets.length === 0) return null;

                return (
                  <div
                    key={idx}
                    className="group relative pl-6 border-l-4 border-emerald-100 hover:border-emerald-400 transition-all duration-300"
                  >
                    {/* Content wrapper */}
                    <div className="text-base leading-relaxed">
                      {heading && (
                        <div className="mb-3">
                          <h3 className="font-bold text-lg text-slate-900 mb-1.5">
                            {heading}
                          </h3>
                          {mainText && (
                            <p className="text-slate-700 font-medium">
                              {mainText}
                            </p>
                          )}
                        </div>
                      )}

                      {!heading && mainText && (
                        <p className="text-slate-700 font-medium mb-2">
                          {mainText}
                        </p>
                      )}

                      {restArticles.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {restArticles.map((a, i) => {
                            const t = getText(a);
                            if (!t) return null;
                            return (
                              <p key={i} className="text-slate-600">
                                {t}
                              </p>
                            );
                          })}
                        </div>
                      )}

                      {bullets.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {bullets.map((b, i) => {
                            const t = getText(b);
                            if (!t) return null;
                            return (
                              <li
                                key={i}
                                className="flex items-start gap-3 text-slate-700"
                              >
                                <span className="inline-flex items-center justify-center w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                                <span>{t}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrekAddInfo;
