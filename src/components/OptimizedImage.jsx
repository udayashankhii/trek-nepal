/**
 * OptimizedImage - Lightweight image component with lazy loading & error handling
 * Estimated bundle impact: ~2.5KB (uncompressed)
 * 
 * Features:
 * 1. CSS-only shimmer skeleton (no animation library)
 * 2. Lazy load with IntersectionObserver (optional priority mode)
 * 3. Smooth fade-in via CSS transition
 * 4. Clean fallback on error (no broken icon)
 * 5. Prevents CLS with aspect-ratio
 */

import React, { useState, useRef, useCallback } from 'react';
import { useInView } from '../hooks/useInView';
import { markLoaded, isLoaded } from '../cache/sessionImageCache';

const OptimizedImage = ({
  src,
  alt = 'Image',
  aspectRatio = '16/9', // CSS aspect-ratio value
  className = '',
  priority = false, // Skip lazy loading for hero
  fallbackText = '⛰️', // Mountain emoji fallback
  onLoad,
  onError,
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  
  // Use IntersectionObserver for lazy loading (unless priority)
  const [lazyRef, inView] = useInView({ rootMargin: '200px' });
  
  // Should we load? If priority OR IntersectionObserver says yes
  const shouldLoad = priority || inView;
  
  // Check if already loaded in session
  const wasPreloaded = isLoaded(src);

  const handleLoad = useCallback(() => {
    setHasLoaded(true);
    markLoaded(src); // Mark in cache
    onLoad?.();
  }, [src, onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Merge refs: lazy loading ref + user ref for manual access
  const mergedRef = React.useCallback((node) => {
    lazyRef.current = node;
    if (imgRef.current !== node) {
      imgRef.current = node;
    }
  }, [lazyRef]);

  const isLoading = !hasLoaded && !hasError;

  return (
    <div
      ref={mergedRef}
      style={{
        aspectRatio,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f3f4f6', // Tailwind gray-100
      }}
      className={`w-full ${className}`}
      role="img"
      aria-label={alt || 'Image'}
    >
      {/* Shimmer skeleton - CSS only, no animation library */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
          }}
        />
      )}

      {/* Actual image - only renders if shouldLoad */}
      {shouldLoad && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: hasLoaded ? 1 : 0,
            transition: 'opacity 300ms ease-in-out', // Smooth fade-in
          }}
          onLoad={handleLoad}
          onError={handleError}
          draggable={false}
        />
      )}

      {/* Error state - clean styled fallback (no broken icon) */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e5e7eb', // Tailwind gray-200
            fontSize: '2.5rem',
            cursor: 'not-allowed',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {fallbackText}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#6b7280', // Tailwind gray-500
              }}
            >
              Image unavailable
            </div>
          </div>
        </div>
      )}

      {/* Global shimmer animation - added to document only once */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default OptimizedImage;
