import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAboutPage } from "../api/aboutInfoService.js";
import HeroBreadcrumbs from "../components/Breadcrumb/HeroBreadcrumbs.jsx";
import { useHideLayoutBreadcrumbs } from "../components/Breadcrumb/BreadcrumbVisibilityContext.jsx";

const DEFAULT_HERO =
 <img src="/tours.jpg"
  alt="Himalayan mountain landscape"
 />;

const renderParagraphs = (text) => {
  if (!text) return [];
  if (Array.isArray(text)) return text.filter(Boolean);
  return String(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

const buttonVariants = {
  hero: "bg-white text-slate-900 shadow-2xl hover:bg-slate-100",
  ghost: "border border-white/50 text-white hover:bg-white/10",
  primary: "bg-emerald-500 text-slate-900 shadow-lg hover:bg-emerald-400",
  secondary: "border border-slate-200 text-slate-900 hover:bg-slate-50",
};

const ActionButton = ({ url, label, variant = "primary", className = "" }) => {
  if (!url || !label) return null;
  const classes = `inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${buttonVariants[variant] ||
    buttonVariants.primary} ${className}`;
  const isExternal = /^https?:\/\//i.test(url);
  if (isExternal) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className={classes}>
        {label}
      </a>
    );
  }
  return (
    <Link to={url} className={classes}>
      {label}
    </Link>
  );
};

const resolveCTA = (cta) => {
  if (!cta) return null;
  const primary = cta.primary || {};
  const label =
    cta.primary_label ||
    primary.label ||
    cta.label ||
    cta.heading ||
    cta.title ||
    "";
  const url =
    cta.primary_url ||
    primary.url ||
    cta.url ||
    cta.link ||
    cta.cta_url ||
    "";
  if (!label || !url) return null;
  return { label, url };
};

const SectionHeading = ({ title, description }) => (
  <>
    {title && (
      <h2
        className="text-2xl font-semibold text-slate-900"
        style={{ fontFamily: '"Playfair Display", serif' }}
      >
        {title}
      </h2>
    )}
    {description && (
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
        {description}
      </p>
    )}
  </>
);

const TeamSection = ({ members, description }) => {
  if (!members?.length) return null;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
      <SectionHeading
        title="Meet the local experts"
        description="Guides, support staff, and planners with decades of Himalayan experience."
      />
      <div className="mt-4 text-sm text-slate-600 leading-relaxed">
        {description ||
          "Our team blends mountain-born guides, camp staff, and planners to deliver consistently safe, curated adventures."}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {members.map((member) => (
          <div
            key={member.name}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            {member.image && (
              <img
                src={member.image}
                alt={member.name}
                className="h-20 w-20 rounded-full object-cover"
              />
            )}
            <p className="mt-3 text-lg font-semibold text-slate-900">
              {member.name}
            </p>
            <p className="text-sm text-slate-500">{member.role}</p>
            {member.bio && (
              <p className="mt-2 text-sm text-slate-600">{member.bio}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const DocumentSection = ({ documents }) => {
  if (!documents?.length) return null;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
      <SectionHeading
        title="Reference documents"
        description="Download or preview supporting PDFs for clarity."
      />
      <div className="mt-4 space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.title}
            className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            {doc.image && (
              <div className="h-16 w-16 overflow-hidden rounded-2xl">
                <img
                  src={doc.image}
                  alt={doc.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-slate-900">{doc.title}</p>
              {doc.summary && (
                <p className="text-xs text-slate-500">{doc.summary}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutPageLayout = ({ slug }) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useHideLayoutBreadcrumbs();

  useEffect(() => {
    let isMounted = true;
    const loadPage = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAboutPage(slug);
        if (!isMounted) return;
        setPage(data);
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Unable to load page.");
        setLoading(false);
      }
    };
    loadPage();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const canonicalUrl =
    typeof window !== "undefined" ? window.location.href.split("?")[0] : "";

  const seoTitle = useMemo(() => {
    if (!page) return "EverTrek Nepal";
    return page.meta_title || `${page.title} | EverTrek Nepal`;
  }, [page]);

  const seoDescription = useMemo(() => {
    if (!page) return "EverTrek Nepal - premium Himalayan journeys.";
    return page.meta_description || page.summary || page.subtitle || "";
  }, [page]);

  const ogImage = page?.og_image_url || page?.hero_image_url || DEFAULT_HERO;

  const structuredData = useMemo(() => {
    if (!page) return null;
    const base = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      description: seoDescription,
      url: canonicalUrl || undefined,
    };
    if (page.slug === "about-us") {
      return [
        base,
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "EverTrek Nepal",
          url: canonicalUrl || "https://evertreknepal.com",
          slogan: page.subtitle || "Premium Himalayan journeys led by local experts.",
        },
      ];
    }
    return base;
  }, [page, seoDescription, canonicalUrl]);

  const heroActions = useMemo(
    () =>
      (page?.ctas ?? []).map(resolveCTA).filter(Boolean),
    [page],
  );

  const primaryHeroAction = heroActions[0] || null;
  const supportingHeroActions = heroActions.slice(1);

  const heroStats = page?.stats || [];
  const featureItems = page?.features || [];
  const featureIntroduction =
    page?.features_description || page?.subtitle || "";
  const summaryParagraphs = renderParagraphs(page?.summary);

  const blockList = page?.blocks || [];
  const hasTeamBlock = blockList.some((block) => block.type === "team");
  const hasDocumentsBlock = blockList.some((block) => block.type === "documents");

  const heroSubtitle = page?.subtitle || page?.summary || "";
  const teamDescription =
    page?.team_description || page?.team_summary || "";
  const breadcrumbs = useMemo(() => {
    const base = [
      { label: "Home", url: "/" },
      { label: "About Us", url: "/about-us" },
    ];
    if (page?.slug && page.slug !== "about-us") {
      return [
        ...base,
        { label: page.title || "Overview", url: `/about-us/${page.slug}` },
      ];
    }
    return base;
  }, [page]);

  const renderBlock = (block, index) => {
    const blockClasses = "rounded-3xl border border-slate-200 bg-white p-6 shadow-xl";
    if (block.type === "stats") {
      return (
        <div key={`stats-${index}`} className={`${blockClasses} grid gap-4 sm:grid-cols-2 md:grid-cols-3`}>
          {block.items?.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-slate-50 p-4 text-center"
            >
              <p className="text-3xl font-semibold text-slate-900">
                {item.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (block.type === "content") {
      return (
        <div key={`content-${index}`} className={blockClasses}>
          {block.heading && <SectionHeading title={block.heading} />}
          {renderParagraphs(block.body).map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 text-sm text-slate-600 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      );
    }

    if (block.type === "feature_grid") {
      return (
        <div key={`grid-${index}`} className={blockClasses}>
          <SectionHeading title={block.heading} description={block.description} />
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {block.items?.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <p className="text-lg font-semibold text-slate-900">
                  {item.title}
                </p>
                <p className="mt-3 text-sm text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === "team") {
      return (
        <div key={`team-${index}`} className={blockClasses}>
          <SectionHeading title={block.heading} description={block.description} />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {block.items?.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center"
              >
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                  />
                )}
                <p className="mt-3 text-lg font-semibold text-slate-900">
                  {member.name}
                </p>
                <p className="text-sm text-slate-600">{member.role}</p>
                {member.bio && (
                  <p className="text-xs text-slate-500">{member.bio}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === "documents") {
      return (
        <div key={`docs-${index}`} className={blockClasses}>
          <SectionHeading title={block.heading} />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {block.items?.map((doc) => (
              <div
                key={doc.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
              >
                {doc.image && (
                  <img
                    src={doc.image}
                    alt={doc.title}
                    className="h-44 w-full rounded-t-2xl object-cover"
                  />
                )}
                <div className="p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {doc.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === "steps") {
      return (
        <div key={`steps-${index}`} className={blockClasses}>
          <SectionHeading title={block.heading} description={block.description} />
          <div className="mt-6 space-y-5">
            {block.items?.map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="text-sm font-semibold text-emerald-600">
                  {item.step}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === "policy") {
      return (
        <div key={`policy-${index}`} className={blockClasses}>
          <SectionHeading title={block.heading} description={block.description} />
          <div className="grid gap-4">
            {block.items?.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <p className="text-lg font-semibold text-slate-900">
                  {item.title}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {item.bullets?.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-slate-600"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === "testimonials") {
      return (
        <div key={`testimonials-${index}`} className={blockClasses}>
          <SectionHeading
            title="Traveler testimonials"
            description={block.description}
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {block.items?.map((item, idx) => (
              <div
                key={`${item.author || "guest"}-${idx}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow"
              >
                <p className="text-sm text-slate-600">"{item.quote}"</p>
                <p className="mt-4 text-sm font-semibold text-slate-900">
                  {item.author}
                </p>
                {item.detail && (
                  <p className="text-xs text-slate-500">{item.detail}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === "milestones") {
      return (
        <div key={`milestones-${index}`} className={blockClasses}>
          <SectionHeading
            title={block.heading || "Milestones"}
            description={block.description}
          />
          <div className="mt-6 space-y-4">
            {block.items?.map((item) => (
              <div
                key={item.year}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {item.year}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === "cta") {
      return (
        <div
          key={`cta-${index}`}
          className="rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-xl"
        >
          <SectionHeading title={block.heading} description={block.body} />
          <div className="mt-6 flex flex-wrap gap-3">
            {block.primary && (
              <ActionButton
                label={block.primary.label}
                url={block.primary.url}
                variant="primary"
              />
            )}
            {block.secondary && (
              <ActionButton
                label={block.secondary.label}
                url={block.secondary.url}
                variant="ghost"
              />
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-lg text-center bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Loading...
          </h1>
          <p className="text-slate-600 mt-2">Preparing your experience.</p>
        </div>
      </div>
    );
  }

  if (!page || error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-lg text-center bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Page unavailable
          </h1>
          <p className="text-slate-600 mt-2">
            {error || "We could not load this page right now."}
          </p>
          <Link
            to="/"
            className="inline-block mt-6 text-emerald-600 font-semibold"
          >
            Back to home →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-slate-50 text-slate-900">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Manrope:wght@400;500;600;700&display=swap"
      />
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {Array.isArray(page.meta_keywords) && page.meta_keywords.length > 0 && (
        <meta name="keywords" content={page.meta_keywords.join(", ")} />
      )}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <img
            src={page.hero_image_url || DEFAULT_HERO}
            alt={page.title}
            className="h-[60vh] w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-900/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.25),transparent_55%)]" />
        </div>
        <div className="relative z-10 min-h-[60vh] flex items-center">
          <div className="max-w-6xl mx-auto px-6 py-16 text-white">
            <HeroBreadcrumbs breadcrumbs={breadcrumbs} className="mb-3" />
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
              {page.hero_badge || "EverTrek Nepal"}
            </p>
            <h1
              className="mt-4 text-4xl md:text-6xl font-semibold leading-tight"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              {page.title}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl">
              {heroSubtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {primaryHeroAction && (
                <ActionButton
                  label={primaryHeroAction.label}
                  url={primaryHeroAction.url}
                  variant="hero"
                />
              )}
              {supportingHeroActions.map((action, index) => (
                <ActionButton
                  key={`${action.label}-${index}`}
                  label={action.label}
                  url={action.url}
                  variant="ghost"
                />
              ))}
            </div>
            {heroStats.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center"
                  >
                    <p className="text-3xl font-semibold text-white">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/70">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            {summaryParagraphs.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <SectionHeading
                  title="Overview"
                  description="A concise summary of our ethos and approach."
                />
                <div className="mt-4 space-y-3 text-sm text-slate-600 leading-relaxed">
                  {summaryParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {featureItems.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <SectionHeading
                  title="Why travelers choose us"
                  description={featureIntroduction}
                />
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {featureItems.map((feature) => (
                    <div
                      key={feature.title}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <p className="text-lg font-semibold text-slate-900">
                        {feature.title}
                      </p>
                      <p className="mt-3 text-sm text-slate-600">
                        {feature.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {blockList.map((block, index) => renderBlock(block, index))}
          </div>
          <aside className="space-y-6">
            {!hasTeamBlock && page.team_members?.length > 0 && (
              <TeamSection members={page.team_members} description={teamDescription} />
            )}
            {!hasDocumentsBlock && page.documents?.length > 0 && (
              <DocumentSection documents={page.documents} />
            )}
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-600 to-teal-600 p-6 text-white shadow-lg">
              <h3 className="text-lg font-semibold">Need tailored advice?</h3>
              <p className="mt-2 text-sm text-white/90">
                Our Nepal travel planners are ready to design an itinerary just for you.
              </p>
              <ActionButton
                label="Speak with our team"
                url="/contact-us"
                variant="secondary"
                className="mt-4 bg-white text-slate-900"
              />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default AboutPageLayout;
