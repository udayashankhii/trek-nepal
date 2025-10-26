// src/trekkingpage/Gallery.jsx
import React, { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function TrekGallery({
  images = [],
  trekName = "Trek",
  title = "Media Gallery",
  subtitle,
  minImages = 5,
  showTitle = true,
}) {
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [imageErrors, setImageErrors] = useState({});

  // Helper to clean URLs wrapped in brackets or markdown link format
  const cleanUrl = (url) => {
    if (!url) return "";
    
    // Handle markdown link format: [text](url) -> extract url
    const markdownMatch = url.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (markdownMatch) {
      return markdownMatch[2]; // Return the URL part
    }
    
    // Handle simple bracket wrapping: [url] -> extract url
    if (url.startsWith("[") && url.endsWith("]")) {
      return url.slice(1, -1);
    }
    
    return url;
  };

  // Normalize image URLs from API response handling absolute and relative URLs
  const getFullUrl = (path) => {
    const cleanedPath = cleanUrl(path);
    if (!cleanedPath) return "";
    // Return absolute URLs as is
    if (/^https?:\/\//i.test(cleanedPath)) return cleanedPath;
    // Prepend current origin for relative URLs
    return `${window.location.origin}${cleanedPath.startsWith("/") ? "" : "/"}${cleanedPath}`;
  };

  // Memoize normalized images
  const normalizedImages = React.useMemo(() => {
    if (!Array.isArray(images) || images.length === 0) return [];

    return images
      .map((img, idx) => {
        if (typeof img === "string") {
          return {
            url: getFullUrl(img),
            alt: `${trekName} photo ${idx + 1}`,
            id: `img-${idx}`,
          };
        }
        if (img && typeof img === "object") {
          const rawUrl = img.image_url || img.url || img.image || img.src || img.path;
          return {
            url: getFullUrl(rawUrl),
            alt: img.alt || img.caption || img.title || img.description || `${trekName} photo ${idx + 1}`,
            id: img.id || `img-${idx}`,
          };
        }
        return null;
      })
      .filter((img) => img && img.url);
  }, [images, trekName]);

  // Filter out images with load errors
  const validImages = normalizedImages.filter((img) => !imageErrors[img.id]);

  // Subtitle fallback
  const displaySubtitle = subtitle || `${trekName} Photos`;

  // Image load error handler
  const handleImageError = useCallback((imageId) => {
    console.warn(`Failed to load image: ${imageId}`);
    setImageErrors((prev) => ({ ...prev, [imageId]: true }));
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightbox.open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setLightbox({ ...lightbox, open: false });
      } else if (e.key === "ArrowLeft" && lightbox.index > 0) {
        setLightbox((l) => ({ ...l, index: l.index - 1 }));
      } else if (e.key === "ArrowRight" && lightbox.index < validImages.length - 1) {
        setLightbox((l) => ({ ...l, index: l.index + 1 }));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox, validImages.length]);

  // Prevent page scroll when lightbox open
  useEffect(() => {
    if (lightbox.open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightbox.open]);

  // Don't render gallery if not enough valid images; instead show fallback
  if (validImages.length < minImages) {
    return null; // Or render a message saying no images available
  }

  // Lightbox handlers
  const openLightbox = (index) => {
    setLightbox({ open: true, index });
  };
  const closeLightbox = () => {
    setLightbox({ open: false, index: 0 });
  };
  const goToPrevious = (e) => {
    e.stopPropagation();
    if (lightbox.index > 0) setLightbox((l) => ({ ...l, index: l.index - 1 }));
  };
  const goToNext = (e) => {
    e.stopPropagation();
    if (lightbox.index < validImages.length - 1) setLightbox((l) => ({ ...l, index: l.index + 1 }));
  };

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        {showTitle && (
          <div className="mb-8">
            <h2 className="text-5xl font-extrabold text-gray-900 leading-tight">{title}</h2>
            <p className="text-2xl text-gray-500 mt-2">{displaySubtitle}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:h-[600px]">
          {/* Hero image */}
          {validImages[0] && (
            <div className="relative md:row-span-2 md:col-span-1 overflow-hidden rounded-2xl shadow-xl group">
              <img
                src={validImages[0].url}
                alt={validImages[0].alt}
                className="object-cover w-full h-full cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onClick={() => openLightbox(0)}
                onError={() => handleImageError(validImages[0].id)}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
            </div>
          )}

          {/* Top row, cols 2 and 3 */}
          {[1, 2, 3, 4].map((idx) =>
            validImages[idx] ? (
              <div key={idx} className="relative overflow-hidden rounded-2xl shadow-md group">
                <img
                  src={validImages[idx].url}
                  alt={validImages[idx].alt}
                  className="object-cover w-full h-full cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  onClick={() => openLightbox(idx)}
                  onError={() => handleImageError(validImages[idx].id)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                {idx === 4 && validImages.length > 5 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-3xl font-bold">
                    +{validImages.length - 5} more
                  </div>
                )}
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox.open && validImages[lightbox.index] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-opacity duration-300"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 md:top-8 md:right-10 text-white hover:text-gray-300 transition-colors z-10"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 md:top-8 md:left-10 text-white text-lg font-semibold z-10">
            {lightbox.index + 1} / {validImages.length}
          </div>

          {/* Main image */}
          <div className="relative max-h-[80vh] max-w-[90vw] flex items-center justify-center">
            <img
              src={validImages[lightbox.index].url}
              alt={validImages[lightbox.index].alt}
              className="max-h-[80vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {validImages[lightbox.index].alt && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 rounded-b-2xl">
                <p className="text-center">{validImages[lightbox.index].alt}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          {lightbox.index > 0 && (
            <button
              className="absolute left-4 md:left-10 text-white hover:text-gray-300 transition-colors p-2 bg-black bg-opacity-50 rounded-full"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
            </button>
          )}
          {lightbox.index < validImages.length - 1 && (
            <button
              className="absolute right-4 md:right-10 text-white hover:text-gray-300 transition-colors p-2 bg-black bg-opacity-50 rounded-full"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
