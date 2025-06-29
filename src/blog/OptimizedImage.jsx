import React, { useState, useCallback, useRef, useEffect } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

const OptimizedImage = React.memo(({
  src,
  alt,
  caption,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px",
}) => {
  const [imageState, setImageState] = useState({
    loaded: false,
    error: false,
    inView: false,
  });
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) {
      setImageState(prev => ({ ...prev, inView: true }));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageState(prev => ({ ...prev, inView: true }));
          observer.disconnect();
        }
      },
      { rootMargin: "50px", threshold: 0.1 }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [priority]);

  const handleLoad = useCallback(() => {
    setImageState(prev => ({ ...prev, loaded: true }));
  }, []);

  const handleError = useCallback((e) => {
    console.error('Failed to load image:', {
      src,
      error: e.target?.error,
      naturalWidth: e.target?.naturalWidth,
      naturalHeight: e.target?.naturalHeight
    });
    setImageState(prev => ({ ...prev, error: true, loaded: true }));
  }, [src]);

  if (!src) {
    return (
      <div className="w-full h-64 sm:h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg">
        <div className="text-center text-gray-400">
          <PhotoIcon className="w-16 h-16 mx-auto mb-2" />
          <p className="text-sm">No image source provided</p>
        </div>
      </div>
    );
  }

  return (
    <figure className={`relative ${className}`} ref={imgRef}>
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        {!imageState.loaded && !imageState.error && imageState.inView && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        )}

        {imageState.error ? (
          <div className="w-full h-64 sm:h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <PhotoIcon className="w-16 h-16 mx-auto mb-2" />
              <p className="text-sm">Image unavailable</p>
              <p className="text-xs mt-1 text-gray-500 truncate max-w-xs">
                Failed to load: {src}
              </p>
            </div>
          </div>
        ) : (
          imageState.inView && (
            <img
              src={src}
              alt={alt || "Image"}
              className={`w-full h-auto object-cover transition-opacity duration-500 ${
                imageState.loaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={handleLoad}
              onError={handleError}
              loading={priority ? "eager" : "lazy"}
              sizes={sizes}
            />
          )
        )}
      </div>

      {caption && (
        <figcaption className="mt-3 text-center text-sm text-gray-600 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
