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

  // Normalize images from API (handle different formats)
  const normalizedImages = React.useMemo(() => {
    if (!Array.isArray(images) || images.length === 0) {
      return [];
    }

    return images
      .map((img, idx) => {
        // Handle different API response formats
        if (typeof img === 'string') {
          return { url: img, alt: `${trekName} photo ${idx + 1}`, id: `img-${idx}` };
        }
        if (typeof img === 'object' && img !== null) {
          return {
            url: img.url || img.image || img.src || img.path || '',
            alt: img.alt || img.caption || img.description || `${trekName} photo ${idx + 1}`,
            id: img.id || `img-${idx}`,
          };
        }
        return null;
      })
      .filter(img => img && img.url); // Remove invalid entries
  }, [images, trekName]);

  // Filter out images with errors
  const validImages = normalizedImages.filter(img => !imageErrors[img.id]);

  // Auto-generate subtitle if not provided
  const displaySubtitle = subtitle || `${trekName} Photos`;

  // Handle image load error
  const handleImageError = useCallback((imageId) => {
    console.warn(`Failed to load image: ${imageId}`);
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightbox.open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightbox({ ...lightbox, open: false });
      } else if (e.key === 'ArrowLeft' && lightbox.index > 0) {
        setLightbox(l => ({ ...l, index: l.index - 1 }));
      } else if (e.key === 'ArrowRight' && lightbox.index < validImages.length - 1) {
        setLightbox(l => ({ ...l, index: l.index + 1 }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox, validImages.length]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightbox.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightbox.open]);

  // Don't render if not enough images
  if (validImages.length < minImages) {
    return null;
  }

  const openLightbox = (index) => {
    setLightbox({ open: true, index });
  };

  const closeLightbox = () => {
    setLightbox({ open: false, index: 0 });
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    if (lightbox.index > 0) {
      setLightbox(l => ({ ...l, index: l.index - 1 }));
    }
  };

  const goToNext = (e) => {
    e.stopPropagation();
    if (lightbox.index < validImages.length - 1) {
      setLightbox(l => ({ ...l, index: l.index + 1 }));
    }
  };

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Header */}
        {showTitle && (
          <div className="mb-8">
            <h2 className="text-5xl font-extrabold text-gray-900 leading-tight">
              {title}
            </h2>
            <p className="text-2xl text-gray-500 mt-2">{displaySubtitle}</p>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:h-[600px]">
          {/* Hero image: spans 2 rows, first column */}
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

          {/* Top row, columns 2 and 3 */}
          {validImages[1] && (
            <div className="relative overflow-hidden rounded-2xl shadow-md group">
              <img
                src={validImages[1].url}
                alt={validImages[1].alt}
                className="object-cover w-full h-full cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onClick={() => openLightbox(1)}
                onError={() => handleImageError(validImages[1].id)}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
            </div>
          )}

          {validImages[2] && (
            <div className="relative overflow-hidden rounded-2xl shadow-md group">
              <img
                src={validImages[2].url}
                alt={validImages[2].alt}
                className="object-cover w-full h-full cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onClick={() => openLightbox(2)}
                onError={() => handleImageError(validImages[2].id)}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
            </div>
          )}

          {/* Bottom row, columns 2 and 3 */}
          {validImages[3] && (
            <div className="relative overflow-hidden rounded-2xl shadow-md group">
              <img
                src={validImages[3].url}
                alt={validImages[3].alt}
                className="object-cover w-full h-full cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onClick={() => openLightbox(3)}
                onError={() => handleImageError(validImages[3].id)}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
            </div>
          )}

          {validImages[4] && (
            <div className="relative overflow-hidden rounded-2xl shadow-md group">
              <img
                src={validImages[4].url}
                alt={validImages[4].alt}
                className="object-cover w-full h-full cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onClick={() => openLightbox(4)}
                onError={() => handleImageError(validImages[4].id)}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
              {/* Show remaining images count if more than 5 */}
              {validImages.length > 5 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-3xl font-bold">
                  +{validImages.length - 5} more
                </div>
              )}
            </div>
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
            
            {/* Image caption */}
            {validImages[lightbox.index].alt && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 rounded-b-2xl">
                <p className="text-center">{validImages[lightbox.index].alt}</p>
              </div>
            )}
          </div>

          {/* Previous button */}
          {lightbox.index > 0 && (
            <button
              className="absolute left-4 md:left-10 text-white hover:text-gray-300 transition-colors p-2 bg-black bg-opacity-50 rounded-full"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
            </button>
          )}

          {/* Next button */}
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
