import React, { useState, useEffect, useMemo } from 'react';
import OptimizedImage from './OptimizedImage'; // FIXED: Correct import path

const ImageLightbox = React.memo(({ image, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const imageSrc = image?.url || image;
  const imageAlt = image?.alt || "Gallery image";
  const imageCaption = image?.caption;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          aria-label="Close lightbox"
        >
          ×
        </button>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="max-w-full max-h-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
          onError={(e) => {
            console.error('Failed to load lightbox image:', imageSrc);
            e.target.style.display = 'none';
          }}
        />
        {imageCaption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 rounded-b-lg">
            <p className="text-center">{imageCaption}</p>
          </div>
        )}
      </div>
    </div>
  );
});

ImageLightbox.displayName = 'ImageLightbox';

const ImageGallery = React.memo(({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // FIXED: Moved useMemo to top level and added proper validation
  const validImages = useMemo(() => {
    if (!Array.isArray(images)) {
      console.log('ImageGallery: images is not an array', images);
      return [];
    }
    
    const filtered = images.filter(image => {
      const src = image?.url || image;
      const isValid = src && typeof src === 'string' && src.trim() !== '';
      if (!isValid) {
        console.log('ImageGallery: Invalid image filtered out', image);
      }
      return isValid;
    });
    
    console.log('ImageGallery: Valid images count', filtered.length);
    return filtered;
  }, [images]);

  if (validImages.length === 0) {
    console.log('ImageGallery: No valid images to display');
    return null;
  }

  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Photo Gallery
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {validImages.map((image, index) => {
          const imageSrc = image?.url || image;
          const imageAlt = image?.alt || `Gallery image ${index + 1}`;
          const imageCaption = image?.caption;

          return (
            <div
              key={`gallery-image-${index}`}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage(image)}
            >
              <OptimizedImage
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {imageCaption && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium">{imageCaption}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <ImageLightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
});

ImageGallery.displayName = 'ImageGallery';

export default ImageGallery;
