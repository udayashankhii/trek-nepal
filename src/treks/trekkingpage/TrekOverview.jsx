import React from "react";
import PropTypes from "prop-types";

/**
 * Normalize overview data:
 *  - Accepts JSON string or object
 *  - Handles sections array or single section object
 *  - Ensures heading, articles, and bullets are strings
 */
function normalizeOverview(rawOverview) {
  if (!rawOverview) return { heading: "", articles: [], bullets: [] };

  let overview = null;

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

  const section =
    Array.isArray(overview.sections) && overview.sections.length
      ? overview.sections[0]
      : overview.section || {};

  const normalizeItems = (items, fields = ["text", "title", "label"]) => {
    if (!Array.isArray(items)) return [];
    return items
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (item && typeof item === "object") {
          for (const field of fields) {
            if (item[field]) return String(item[field]).trim();
          }
        }
        return null;
      })
      .filter(Boolean);
  };

  return {
    heading: section?.heading ? String(section.heading).trim() : "",
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
      className="bg-white rounded-2xl border border-emerald-100 shadow-sm px-6 sm:px-8 md:px-10 py-8 md:py-10"
    >
      {hasHeading && (
        <header className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
            {heading}
          </h2>
        </header>
      )}

      {hasArticles && (
        <div className="space-y-4 text-[15px] md:text-base leading-relaxed text-slate-800">
          {articles.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      )}

      {hasBullets && (
        <div className="mt-8 pt-6 border-t border-emerald-100">
          <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">
            Trek Highlights
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[15px] text-slate-800">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!hasArticles && !hasBullets && (
        <div className="pt-2 text-sm text-slate-400">
          No summary available for this trek.
        </div>
      )}
    </section>
  );
}

TrekOverview.propTypes = {
  overview: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
