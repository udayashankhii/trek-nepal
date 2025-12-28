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
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 tracking-tight">
          Important Notes for This Trek
        </h2>

        {/* Main card */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm max-w-6xl mx-auto px-6 md:px-10 py-8 md:py-10 space-y-6">
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

            const mainText =
              body || firstArticleText || getText(section); // fallback

            if (!heading && !mainText && bullets.length === 0) return null;

            return (
              <div
                key={idx}
                className="text-[15px] leading-relaxed text-emerald-900"
              >
                {heading && (
                  <p className="mb-1">
                    <span className="font-semibold">{heading}</span>
                    {mainText && (
                      <span>
                        {": "}
                        {mainText}
                      </span>
                    )}
                  </p>
                )}

                {!heading && mainText && <p className="mb-1">{mainText}</p>}

                {restArticles.length > 0 && (
                  <div className="space-y-1 mt-1">
                    {restArticles.map((a, i) => {
                      const t = getText(a);
                      if (!t) return null;
                      return <p key={i}>{t}</p>;
                    })}
                  </div>
                )}

                {bullets.length > 0 && (
                  <ul className="mt-2 ml-4 list-disc space-y-1">
                    {bullets.map((b, i) => {
                      const t = getText(b);
                      if (!t) return null;
                      return <li key={i}>{t}</li>;
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrekAddInfo;
