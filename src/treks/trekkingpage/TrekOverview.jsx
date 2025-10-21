import React from "react";
import PropTypes from "prop-types";

/**
 * Normalize overview data:
 *  - Accepts JSON string or object
 *  - Handles sections array or single section
 *  - Ensures heading is string, articles and bullets are string arrays
 */
function normalizeOverview(rawOverview) {
  if (!rawOverview) return { heading: "", articles: [], bullets: [] };

  let overview = null;

  // Try parse if string
  if (typeof rawOverview === "string" && rawOverview.trim().length) {
    try {
      overview = JSON.parse(rawOverview);
    } catch (e) {
      console.warn("TrekOverview: Failed to parse overview JSON", e);
      overview = null;
    }
  } else {
    overview = rawOverview;
  }

  if (!overview) return { heading: "", articles: [], bullets: [] };

  // Get first section
  const section =
    Array.isArray(overview.sections) && overview.sections.length
      ? overview.sections[0]
      : overview.section || {};

  // Helper to normalize items to strings
  const normalizeItems = (items, fields = ["text", "title", "label"]) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        for (const field of fields) {
          if (item[field]) return String(item[field]);
        }
        return JSON.stringify(item);
      }
      return String(item);
    });
  };

  return {
    heading: section?.heading ? String(section.heading) : "",
    articles: normalizeItems(section?.articles, ["text", "title"]),
    bullets: normalizeItems(section?.bullets, ["text", "label"]),
  };
}

export default function TrekOverview({ overview }) {
  const { heading, articles, bullets } = normalizeOverview(overview);

  const hasHeading = Boolean(heading?.trim());
  const hasArticles = articles.length > 0;
  const hasBullets = bullets.length > 0;

  return (
    <section
      id="overview"
      className="bg-white rounded-lg p-6 sm:p-8 md:p-10 shadow-lg space-y-8 border border-gray-100"
    >
      {hasHeading && (
        <header className="text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
            {heading}
          </h2>
          <div className="w-24 h-1 bg-yellow-600 mx-auto mt-4 rounded"></div>
        </header>
      )}

      {hasArticles && (
        <div className="space-y-6 text-gray-700 text-base sm:text-lg leading-relaxed">
          {articles.map((para, idx) => (
            <p
              key={idx}
              className={`text-justify ${
                idx === articles.length - 1 ? "italic font-medium text-yellow-800" : ""
              }`}
            >
              {para}
            </p>
          ))}
        </div>
      )}

      {hasBullets && (
        <div className="pt-8 border-t border-gray-200">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
            Trek Summary
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-800 text-sm sm:text-base">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-2 h-2 bg-yellow-600 rounded-full mt-2"></span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

TrekOverview.propTypes = {
  overview: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
