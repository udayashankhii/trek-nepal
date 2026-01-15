import React from "react";
import PropTypes from "prop-types";

function normalizeOverview(rawOverview, longDescription) {
  if (!rawOverview && !longDescription) {
    return { heading: "", articles: [], bullets: [] };
  }

  let overview = null;

  if (typeof rawOverview === "string" && rawOverview.trim().length) {
    try {
      overview = JSON.parse(rawOverview);
    } catch (e) {
      console.warn("TourOverview: Failed to parse overview JSON", e);
      overview = null;
    }
  } else {
    overview = rawOverview;
  }

  const paragraphs = Array.isArray(overview?.paragraphs)
    ? overview.paragraphs
    : [longDescription].filter(Boolean);

  const points = Array.isArray(overview?.points) ? overview.points : [];

  return {
    heading: overview?.heading ? String(overview.heading).trim() : "Tour Overview",
    articles: paragraphs
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean),
    bullets: points
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean),
  };
}

export default function TourOverview({ overview, longDescription }) {
  const { heading, articles, bullets } = normalizeOverview(overview, longDescription);

  const hasHeading = Boolean(heading?.trim());
  const hasArticles = articles.length > 0;
  const hasBullets = bullets.length > 0;

  return (
    <section className="bg-white rounded-2xl border border-emerald-100 shadow-sm px-6 sm:px-8 md:px-10 py-8 md:py-10">
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
            Tour Highlights
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
          No summary available for this tour.
        </div>
      )}
    </section>
  );
}

TourOverview.propTypes = {
  overview: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  longDescription: PropTypes.string,
};
