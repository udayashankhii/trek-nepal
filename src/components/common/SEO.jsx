// src/components/common/SEO.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import { PAGE_SEO } from "../../seo/keywords";

const SITE_NAME = "EverTrek Nepal";
const SITE_URL = "https://evertreknepal.com";
const DEFAULT_IMAGE = `${SITE_URL}/moutainimage.avif`;
const DEFAULT_LOCALE = "en_US";

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  schemas = [],       // array of JSON-LD objects
  schema,             // single JSON-LD (legacy support)
  noindex = false,
  article = null,     // { publishedTime, modifiedTime, author, section, tags }
  locale = DEFAULT_LOCALE,
  alternateLocales = [],
  geo = null,         // { lat, lng, region, placename }
}) => {
  const defaults = PAGE_SEO.home;

  const metaTitle = title
    ? `${title} | ${SITE_NAME}`
    : defaults.title;

  const metaDescription = description || defaults.description;
  const metaKeywords = keywords || defaults.keywords;
  const metaImage = image || DEFAULT_IMAGE;
  const canonical = url
    ? url.startsWith("http") ? url : `${SITE_URL}${url}`
    : (typeof window !== "undefined" ? window.location.href : SITE_URL);

  // Merge legacy single schema + schemas array
  const allSchemas = [
    ...(schema ? [schema] : []),
    ...schemas,
  ].filter(Boolean);

  return (
    <Helmet>
      {/* ── Core ──────────────────────────────────────────────────── */}
      <html lang="en" />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={canonical} />

      {/* ── Robots ────────────────────────────────────────────────── */}
      {noindex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      }

      {/* ── Open Graph ────────────────────────────────────────────── */}
      <meta property="og:type" content={article ? "article" : type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || SITE_NAME} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={locale} />
      {alternateLocales.map((loc) => (
        <meta key={loc} property="og:locale:alternate" content={loc} />
      ))}

      {/* ── Article tags (blog posts) ─────────────────────────────── */}
      {article && article.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article && article.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {article && article.author && (
        <meta property="article:author" content={article.author} />
      )}
      {article && article.section && (
        <meta property="article:section" content={article.section} />
      )}
      {article && article.tags && article.tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* ── Twitter Card ──────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@evertreknepal" />
      <meta name="twitter:creator" content="@evertreknepal" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:image:alt" content={title || SITE_NAME} />

      {/* ── Geographic meta (for local search) ───────────────────── */}
      {geo && <meta name="geo.region" content={geo.region || "NP"} />}
      {geo && geo.placename && <meta name="geo.placename" content={geo.placename} />}
      {geo && geo.lat && <meta name="geo.position" content={`${geo.lat};${geo.lng}`} />}
      {geo && geo.lat && <meta name="ICBM" content={`${geo.lat}, ${geo.lng}`} />}

      {/* ── Travel/site specific ──────────────────────────────────── */}
      <meta name="theme-color" content="#0f766e" />
      <meta name="author" content={SITE_NAME} />
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${SITE_NAME}`} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />

      {/* ── Structured Data (JSON-LD) ─────────────────────────────── */}
      {allSchemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
