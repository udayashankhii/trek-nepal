/**
 * useInView - Custom hook using IntersectionObserver
 * Lightweight: ~0.5KB
 * 
 * Fire-once hook: observer disconnects after element becomes visible
 * Prevents memory leaks, supports optional rootMargin
 * Falls back to true if IntersectionObserver not available
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Detect if element is in viewport
 * @param {Object} options
 * @param {string} options.rootMargin - e.g., "200px" to trigger 200px before entering
 * @returns {[ref, boolean]} - [ref to attach, isInView boolean]
 */
export function useInView(options = {}) {
  const { rootMargin = '200px' } = options;
  
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    // Graceful fallback if IntersectionObserver not supported (rare, old browsers)
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    if (!ref.current) return;

    // Fire once: disconnect after becoming visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Disconnect after first visibility (fire-once pattern)
          observer.disconnect();
          observerRef.current = null;
        }
      },
      { rootMargin }
    );

    observer.observe(ref.current);
    observerRef.current = observer;

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [rootMargin]);

  return [ref, isInView];
}

export default useInView;
