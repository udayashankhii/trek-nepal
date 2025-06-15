import React, { useState } from "react";

export default function TrekGallery({
  images = [],
  title = "Media Gallery",
  subtitle = "Everest Base Camp Trek Photos",
}) {
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  // Ensure at least 5 images for the layout
  if (!images || images.length < 5) return null;

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-5xl font-extrabold text-gray-900 leading-tight">
            {title}
          </h2>
          <p className="text-2xl text-gray-500 mt-2">{subtitle}</p>
        </div>
        {/* Single grid, no nesting */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:h-[600px]">
          {/* Hero image: spans 2 rows, first column */}
          <img
            src={images[0]}
            alt="Hero group"
            className="object-cover w-full h-full rounded-2xl shadow-xl cursor-pointer transition-transform duration-300 hover:scale-105 md:row-span-2 md:col-span-1"
            onClick={() => setLightbox({ open: true, index: 0 })}
            loading="lazy"
          />
          {/* Top row, columns 2 and 3 */}
          <img
            src={images[1]}
            alt="Gallery 2"
            className="object-cover w-full h-full rounded-2xl shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => setLightbox({ open: true, index: 1 })}
            loading="lazy"
          />
          <img
            src={images[2]}
            alt="Gallery 3"
            className="object-cover w-full h-full rounded-2xl shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => setLightbox({ open: true, index: 2 })}
            loading="lazy"
          />
          {/* Bottom row, columns 2 and 3 */}
          <img
            src={images[3]}
            alt="Gallery 4"
            className="object-cover w-full h-full rounded-2xl shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => setLightbox({ open: true, index: 3 })}
            loading="lazy"
          />
          <img
            src={images[4]}
            alt="Gallery 5"
            className="object-cover w-full h-full rounded-2xl shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => setLightbox({ open: true, index: 4 })}
            loading="lazy"
          />
        </div>
      </div>
      {/* Lightbox */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 transition-opacity duration-300"
          onClick={() => setLightbox({ ...lightbox, open: false })}
        >
          <button
            className="absolute top-8 right-10 text-white text-4xl font-extrabold"
            onClick={() => setLightbox({ ...lightbox, open: false })}
          >
            &times;
          </button>
          <img
            src={images[lightbox.index]}
            alt={`Gallery Image ${lightbox.index + 1}`}
            className="max-h-[80vh] max-w-[90vw] rounded-2xl shadow-2xl transition-transform duration-300"
          />
          {lightbox.index > 0 && (
            <button
              className="absolute left-10 text-white text-4xl font-bold"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((l) => ({ ...l, index: l.index - 1 }));
              }}
            >
              &#8592;
            </button>
          )}
          {lightbox.index < images.length - 1 && (
            <button
              className="absolute right-10 text-white text-4xl font-bold"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((l) => ({ ...l, index: l.index + 1 }));
              }}
            >
              &#8594;
            </button>
          )}
        </div>
      )}
    </section>
  );
}
