

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * TrekGallery - Minimal, always-visible image grid and lightbox.
 *
 * Props:
 *  - images: array of { image_url, title, alt, caption, id }
 *  - trekName: string for alt/title fallback
 *  - title: gallery title
 *  - subtitle: gallery subtitle
 *  - showTitle: boolean to show section title
 *  - minImages: minimum images to display gallery (default 1)
 */
function TrekGallery({
  images = [],
  trekName = "Trek",
  title = "Media Gallery",
  subtitle,
  showTitle = true,
  minImages = 1,
}) {
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  // Clean markdown/bracket/image URLs
  const cleanUrl = useCallback((url) => {
    if (!url) return "";
    const markdown = url.match(/\[([^\]]*)\]\(([^)]*)\)/);
    if (markdown) return markdown[2];
    if (url.startsWith("[") && url.endsWith("]")) return url.slice(1, -1);
    return url;
  }, []);

  // Normalize full URLs (absolute/local)
  const getFullUrl = useCallback((raw) => {
    const url = cleanUrl(raw);
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    const origin = window.location.origin.replace(/\/$/, "");
    return url.startsWith("/") ? `${origin}${url}` : `${origin}/${url}`;
  }, [cleanUrl]);

  // Consolidate/normalize image objects
  const validImages = useMemo(() => (
    Array.isArray(images)
      ? images
          .map((img, idx) => {
            if (!img) return null;
            let imageUrl;
            if (typeof img === "string") {
              imageUrl = img;
            } else {
              imageUrl = img.image_url || img.url || img.image || img.src || img.path;
            }
            const url = getFullUrl(imageUrl);
            return url
              ? {
                  url,
                  id: img.id || `img-${idx}`,
                  alt:
                    img.alt ||
                    img.caption ||
                    img.title ||
                    img.description ||
                    `${trekName} photo ${idx + 1}`,
                }
              : null;
          })
          .filter(Boolean)
      : []
  ), [images, trekName, getFullUrl]);

  const displaySubtitle = subtitle || `${trekName} Photos`;

  // Keyboard events for modal
  useEffect(() => {
    if (!lightbox.open) return;
    const keyHandler = (e) => {
      if (e.key === "Escape") setLightbox(l => ({ ...l, open: false }));
      else if (e.key === "ArrowLeft" && lightbox.index > 0)
        setLightbox(l => ({ ...l, index: l.index - 1 }));
      else if (e.key === "ArrowRight" && lightbox.index < validImages.length - 1)
        setLightbox(l => ({ ...l, index: l.index + 1 }));
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [lightbox, validImages.length]);

  // Prevent scrolling with modal
  useEffect(() => {
    document.body.style.overflow = lightbox.open ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [lightbox.open]);

  // Do not render section if not enough images
  if (validImages.length < minImages) {
    return (
      <div className="max-w-xl mx-auto text-center py-10 text-gray-400">
        No gallery images available.
      </div>
    );
  }

  // Lightbox modal control
  const openLightbox = index => setLightbox({ open: true, index });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });
  const goToPrev = e => {
    e.stopPropagation();
    if (lightbox.index > 0) setLightbox(l => ({ ...l, index: l.index - 1 }));
  };
  const goToNext = e => {
    e.stopPropagation();
    if (lightbox.index < validImages.length - 1)
      setLightbox(l => ({ ...l, index: l.index + 1 }));
  };

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        {showTitle && (
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900">{title}</h2>
            <p className="text-lg text-gray-500 mt-2">{displaySubtitle}</p>
          </div>
        )}
        {/* Image grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 min-h-[350px]">
          {validImages.map((img, idx) => (
            <div
              key={img.id}
              className={`relative rounded-xl shadow-lg bg-gray-200 ${
                idx === 0 ? "md:row-span-2 md:col-span-1 h-[520px]" : "h-64"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => openLightbox(idx)}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="object-cover w-full h-full"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Lightbox modal */}
      {lightbox.open && validImages[lightbox.index] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          aria-label="Image gallery viewer"
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-8 text-white hover:text-gray-400 transition z-10"
            onClick={closeLightbox}
            aria-label="Close image viewer"
          >
            <X className="w-8 h-8" />
          </button>
          {/* Counter */}
          <div className="absolute top-6 left-8 text-white text-lg font-semibold z-10">
            {lightbox.index + 1} / {validImages.length}
          </div>
          {/* Main image */}
          <div className="relative max-h-[75vh] max-w-[90vw] flex items-center justify-center">
            <img
              src={validImages[lightbox.index].url}
              alt={validImages[lightbox.index].alt}
              className="max-h-[75vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
              style={{ margin: "auto" }}
              draggable={false}
              onClick={e => e.stopPropagation()}
            />
            {validImages[lightbox.index].alt && (
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white px-4 py-3 text-center rounded-b-2xl">
                <span>{validImages[lightbox.index].alt}</span>
              </div>
            )}
          </div>
          {/* Prev/Next navigation */}
          {lightbox.index > 0 && (
            <button
              className="absolute left-8 text-white hover:text-gray-300 bg-black bg-opacity-40 p-2 rounded-full"
              onClick={goToPrev}
              aria-label="View previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}
          {lightbox.index < validImages.length - 1 && (
            <button
              className="absolute right-8 text-white hover:text-gray-300 bg-black bg-opacity-40 p-2 rounded-full"
              onClick={goToNext}
              aria-label="View next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default TrekGallery;
