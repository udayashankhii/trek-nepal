

// import React, { useState, useCallback, useEffect, useMemo } from "react";
// import { X, ChevronLeft, ChevronRight } from "lucide-react";

// /**
//  * TrekGallery - Minimal, always-visible image grid and lightbox.
//  *
//  * Props:
//  *  - images: array of { image_url, title, alt, caption, id }
//  *  - trekName: string for alt/title fallback
//  *  - title: gallery title
//  *  - subtitle: gallery subtitle
//  *  - showTitle: boolean to show section title
//  *  - minImages: minimum images to display gallery (default 1)
//  */
// function TrekGallery({
//   images = [],
//   trekName = "Trek",
//   title = "Media Gallery",
//   subtitle,
//   showTitle = true,
//   minImages = 1,
// }) {
//   const [lightbox, setLightbox] = useState({ open: false, index: 0 });

//   // Clean markdown/bracket/image URLs
//   const cleanUrl = useCallback((url) => {
//     if (!url) return "";
//     const markdown = url.match(/\[([^\]]*)\]\(([^)]*)\)/);
//     if (markdown) return markdown[2];
//     if (url.startsWith("[") && url.endsWith("]")) return url.slice(1, -1);
//     return url;
//   }, []);

//   // Normalize full URLs (absolute/local)
//   const getFullUrl = useCallback((raw) => {
//     const url = cleanUrl(raw);
//     if (!url) return "";
//     if (/^https?:\/\//i.test(url)) return url;
//     const origin = window.location.origin.replace(/\/$/, "");
//     return url.startsWith("/") ? `${origin}${url}` : `${origin}/${url}`;
//   }, [cleanUrl]);

//   // Consolidate/normalize image objects
//   const validImages = useMemo(() => (
//     Array.isArray(images)
//       ? images
//           .map((img, idx) => {
//             if (!img) return null;
//             let imageUrl;
//             if (typeof img === "string") {
//               imageUrl = img;
//             } else {
//               imageUrl = img.image_url || img.url || img.image || img.src || img.path;
//             }
//             const url = getFullUrl(imageUrl);
//             return url
//               ? {
//                   url,
//                   id: img.id || `img-${idx}`,
//                   alt:
//                     img.alt ||
//                     img.caption ||
//                     img.title ||
//                     img.description ||
//                     `${trekName} photo ${idx + 1}`,
//                 }
//               : null;
//           })
//           .filter(Boolean)
//       : []
//   ), [images, trekName, getFullUrl]);

//   const displaySubtitle = subtitle || `${trekName} Photos`;

//   // Keyboard events for modal
//   useEffect(() => {
//     if (!lightbox.open) return;
//     const keyHandler = (e) => {
//       if (e.key === "Escape") setLightbox(l => ({ ...l, open: false }));
//       else if (e.key === "ArrowLeft" && lightbox.index > 0)
//         setLightbox(l => ({ ...l, index: l.index - 1 }));
//       else if (e.key === "ArrowRight" && lightbox.index < validImages.length - 1)
//         setLightbox(l => ({ ...l, index: l.index + 1 }));
//     };
//     window.addEventListener("keydown", keyHandler);
//     return () => window.removeEventListener("keydown", keyHandler);
//   }, [lightbox, validImages.length]);

//   // Prevent scrolling with modal
//   useEffect(() => {
//     document.body.style.overflow = lightbox.open ? "hidden" : "unset";
//     return () => { document.body.style.overflow = "unset"; };
//   }, [lightbox.open]);

//   // Do not render section if not enough images
//   if (validImages.length < minImages) {
//     return (
//       <div className="max-w-xl mx-auto text-center py-10 text-gray-400">
//         No gallery images available.
//       </div>
//     );
//   }

//   // Lightbox modal control
//   const openLightbox = index => setLightbox({ open: true, index });
//   const closeLightbox = () => setLightbox({ open: false, index: 0 });
//   const goToPrev = e => {
//     e.stopPropagation();
//     if (lightbox.index > 0) setLightbox(l => ({ ...l, index: l.index - 1 }));
//   };
//   const goToNext = e => {
//     e.stopPropagation();
//     if (lightbox.index < validImages.length - 1)
//       setLightbox(l => ({ ...l, index: l.index + 1 }));
//   };

//   return (
//     <section className="w-full bg-white py-12">
//       <div className="max-w-screen-xl mx-auto px-4">
//         {showTitle && (
//           <div className="mb-8">
//             <h2 className="text-4xl font-extrabold text-gray-900">{title}</h2>
//             <p className="text-lg text-gray-500 mt-2">{displaySubtitle}</p>
//           </div>
//         )}
//         {/* Image grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 min-h-[350px]">
//           {validImages.map((img, idx) => (
//             <div
//               key={img.id}
//               className={`relative rounded-xl shadow-lg bg-gray-200 ${
//                 idx === 0 ? "md:row-span-2 md:col-span-1 h-[520px]" : "h-64"
//               }`}
//               style={{ cursor: "pointer" }}
//               onClick={() => openLightbox(idx)}
//             >
//               <img
//                 src={img.url}
//                 alt={img.alt}
//                 className="object-cover w-full h-full"
//                 loading="lazy"
//                 draggable={false}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* Lightbox modal */}
//       {lightbox.open && validImages[lightbox.index] && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
//           onClick={closeLightbox}
//           role="dialog"
//           aria-modal="true"
//           tabIndex={-1}
//           aria-label="Image gallery viewer"
//         >
//           {/* Close button */}
//           <button
//             className="absolute top-6 right-8 text-white hover:text-gray-400 transition z-10"
//             onClick={closeLightbox}
//             aria-label="Close image viewer"
//           >
//             <X className="w-8 h-8" />
//           </button>
//           {/* Counter */}
//           <div className="absolute top-6 left-8 text-white text-lg font-semibold z-10">
//             {lightbox.index + 1} / {validImages.length}
//           </div>
//           {/* Main image */}
//           <div className="relative max-h-[75vh] max-w-[90vw] flex items-center justify-center">
//             <img
//               src={validImages[lightbox.index].url}
//               alt={validImages[lightbox.index].alt}
//               className="max-h-[75vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
//               style={{ margin: "auto" }}
//               draggable={false}
//               onClick={e => e.stopPropagation()}
//             />
//             {validImages[lightbox.index].alt && (
//               <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white px-4 py-3 text-center rounded-b-2xl">
//                 <span>{validImages[lightbox.index].alt}</span>
//               </div>
//             )}
//           </div>
//           {/* Prev/Next navigation */}
//           {lightbox.index > 0 && (
//             <button
//               className="absolute left-8 text-white hover:text-gray-300 bg-black bg-opacity-40 p-2 rounded-full"
//               onClick={goToPrev}
//               aria-label="View previous image"
//             >
//               <ChevronLeft className="w-8 h-8" />
//             </button>
//           )}
//           {lightbox.index < validImages.length - 1 && (
//             <button
//               className="absolute right-8 text-white hover:text-gray-300 bg-black bg-opacity-40 p-2 rounded-full"
//               onClick={goToNext}
//               aria-label="View next image"
//             >
//               <ChevronRight className="w-8 h-8" />
//             </button>
//           )}
//         </div>
//       )}
//     </section>
//   );
// }

// export default TrekGallery;



// src/trekkingpage/Gallery.jsx
/**
 * TrekGallery Component
 * 
 * Displays gallery images uploaded via Django admin panel.
 * Images are served from media/trek_gallery/
 * 
 * Backend sends absolute URLs via TrekGalleryImageSerializer:
 * {
 *   id: 1,
 *   image_url: "http://localhost:8000/media/trek_gallery/ebc-1.jpg",
 *   title: "Namche Bazaar",
 *   caption: "Gateway to Everest",
 *   altText: "Colorful buildings...",
 *   order: 1
 * }
 */
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { createImageErrorHandler, getFallbackImage } from "./trekdatahelper";
import OptimizedImage from "../../components/OptimizedImage";
import { getThumbnailUrl } from "../../utils/imageUtils";

function TrekGallery({
  images = [],
  trekName = "Trek",
  title = "Media Gallery",
  subtitle,
  showTitle = true,
  minImages = 1,
}) {
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  /**
   * Normalize and validate images
   */
  const validImages = useMemo(() => {
    if (!Array.isArray(images)) {
      console.warn('TrekGallery: images prop should be an array, got:', typeof images);
      return [];
    }

    const normalized = images
      .map((img, idx) => {
        if (!img) return null;

        // Handle different input formats
        let url;
        if (typeof img === 'string') {
          url = img;
        } else {
          url = img.image_url || img.url || img.image || img.src || img.path || '';
        }

        if (!url) {
          console.warn(`Gallery image ${idx} has no URL`);
          return null;
        }

        return {
          url,
          id: img.id || `img-${idx}`,
          title: img.title || '',
          caption: img.caption || '',
          alt: img.altText || 
               img.alt_text || 
               img.alt || 
               img.title || 
               `${trekName} photo ${idx + 1}`,
        };
      })
      .filter(Boolean);

    console.log(`✅ TrekGallery: Loaded ${normalized.length} valid images`);
    return normalized;
  }, [images, trekName]);

  const displaySubtitle = subtitle || `${validImages.length} photos from ${trekName}`;

  /**
   * Keyboard navigation in lightbox
   */
  useEffect(() => {
    if (!lightbox.open) return;
    
    const keyHandler = (e) => {
      if (e.key === "Escape") {
        setLightbox(l => ({ ...l, open: false }));
      } else if (e.key === "ArrowLeft" && lightbox.index > 0) {
        setLightbox(l => ({ ...l, index: l.index - 1 }));
      } else if (e.key === "ArrowRight" && lightbox.index < validImages.length - 1) {
        setLightbox(l => ({ ...l, index: l.index + 1 }));
      }
    };
    
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [lightbox, validImages.length]);

  /**
   * Prevent body scrolling when lightbox is open
   */
  useEffect(() => {
    document.body.style.overflow = lightbox.open ? "hidden" : "unset";
    return () => { 
      document.body.style.overflow = "unset"; 
    };
  }, [lightbox.open]);

  /**
   * Don't render if not enough images
   */
  if (validImages.length < minImages) {
    return (
      <div className="max-w-xl mx-auto text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-lg text-gray-600">No gallery images available</p>
        {/* <p className="text-sm text-gray-400 mt-2">Images can be uploaded via the admin panel</p> */}
      </div>
    );
  }

  // Lightbox controls
  const openLightbox = (index) => setLightbox({ open: true, index });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });
  
  const goToPrev = (e) => {
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
        {/* Section Header */}
        {showTitle && (
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900">{title}</h2>
            <p className="text-lg text-gray-500 mt-2">{displaySubtitle}</p>
          </div>
        )}

        {/* Image Grid - Responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 min-h-[350px]">
          {validImages.map((img, idx) => {
            return (
              <div
                key={img.id}
                className={`relative rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer ${
                  idx === 0 ? "md:row-span-2 md:col-span-1" : ""
                }`}
                onClick={() => openLightbox(idx)}
                role="button"
                tabIndex={0}
                aria-label={`View ${img.alt} in fullscreen`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(idx);
                  }
                }}
              >
                <OptimizedImage
                  src={getThumbnailUrl(img.url)}
                  alt={img.alt}
                  aspectRatio={idx === 0 ? "1/1" : "1/1"}
                  className="rounded-xl"
                  fallbackText="⛰️"
                />

                {/* Image title overlay */}
                {img.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs font-medium truncate">
                      {img.title}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox.open && validImages[lightbox.index] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery viewer"
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-8 text-white hover:text-gray-400 transition z-10 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2"
            onClick={closeLightbox}
            aria-label="Close image viewer"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Image counter */}
          <div className="absolute top-6 left-8 text-white text-lg font-semibold z-10 bg-black/50 px-4 py-2 rounded-full backdrop-blur">
            {lightbox.index + 1} / {validImages.length}
          </div>

          {/* Main image container */}
          <div className="relative max-h-[80vh] max-w-[90vw] flex items-center justify-center">
            <img
              src={validImages[lightbox.index].url}
              alt={validImages[lightbox.index].alt}
              className="max-h-[80vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
              draggable={false}
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                console.error('Lightbox image failed to load');
                if (e.target.src !== getFallbackImage('gallery')) {
                  e.target.src = getFallbackImage('gallery');
                }
              }}
            />

            {/* Caption overlay */}
            {(validImages[lightbox.index].caption || validImages[lightbox.index].title) && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white px-6 py-4 text-center rounded-b-2xl">
                <p className="text-base font-medium">
                  {validImages[lightbox.index].caption || validImages[lightbox.index].title}
                </p>
                {validImages[lightbox.index].caption && validImages[lightbox.index].title && (
                  <p className="text-sm text-gray-300 mt-1">
                    {validImages[lightbox.index].title}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Previous button */}
          {lightbox.index > 0 && (
            <button
              className="absolute left-8 text-white hover:text-gray-300 bg-black bg-opacity-40 p-3 rounded-full transition hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={goToPrev}
              aria-label="View previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Next button */}
          {lightbox.index < validImages.length - 1 && (
            <button
              className="absolute right-8 text-white hover:text-gray-300 bg-black bg-opacity-40 p-3 rounded-full transition hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={goToNext}
              aria-label="View next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Thumbnail strip (optional enhancement) */}
          {validImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg backdrop-blur max-w-[90vw] overflow-x-auto">
              {validImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox({ open: true, index: idx });
                  }}
                  className={`w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                    idx === lightbox.index 
                      ? 'border-white scale-110' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getThumbnailUrl(img.url)}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = getFallbackImage('gallery');
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default TrekGallery;