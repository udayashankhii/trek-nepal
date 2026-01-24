/**
 * Scroll Performance Monitoring Script
 * Add this to your main.jsx or App.jsx during development
 * 
 * Usage:
 * import { startPerformanceMonitoring } from './utils/performance-monitor.js'
 * startPerformanceMonitoring()
 */

export const startPerformanceMonitoring = () => {
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 60;

  // FPS Counter
  const calculateFPS = () => {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
      fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      console.log(`FPS: ${fps}`);
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(calculateFPS);
  };

  // Start FPS monitoring
  requestAnimationFrame(calculateFPS);

  // Scroll Event Listener Counter
  let scrollEventCount = 0;
  let lastResetTime = Date.now();

  window.addEventListener('scroll', () => {
    scrollEventCount++;
  }, { passive: true });

  setInterval(() => {
    const now = Date.now();
    const timeDiff = now - lastResetTime;
    const eventsPerSecond = Math.round((scrollEventCount / timeDiff) * 1000);
    
    console.log(`Scroll Events/sec: ${eventsPerSecond}`);
    
    scrollEventCount = 0;
    lastResetTime = now;
  }, 5000);

  // Long Task Detection
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn(`Long Task: ${entry.duration.toFixed(0)}ms at ${entry.name}`);
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.log('Long Task API not available');
    }
  }

  // Paint Timing
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`Paint Timing - ${entry.name}: ${entry.startTime.toFixed(0)}ms`);
        }
      });

      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.log('Paint Timing API not available');
    }
  }

  console.log('✅ Performance monitoring started');
};

/**
 * Measure rendering performance of a component
 * 
 * Usage:
 * const { startMeasure, endMeasure } = createMeasurePoint('ComponentName')
 * startMeasure()
 * // ... do work
 * endMeasure()
 */
export const createMeasurePoint = (name) => {
  return {
    startMeasure: () => {
      performance.mark(`${name}-start`);
    },
    endMeasure: () => {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name)[0];
      console.log(`${name} took ${measure.duration.toFixed(2)}ms`);
    }
  };
};

/**
 * Detect slow animations
 * Add to components that use animations
 */
export const detectSlowAnimations = () => {
  let lastFrameTime = performance.now();
  let frameDrops = 0;

  const checkFrame = () => {
    const currentTime = performance.now();
    const frameDuration = currentTime - lastFrameTime;

    // Frame should take ~16.67ms (60fps)
    if (frameDuration > 33) { // More than 2 frames
      frameDrops++;
      console.warn(`Frame drop detected: ${frameDuration.toFixed(0)}ms (expected ~16.67ms)`);
    }

    lastFrameTime = currentTime;
    requestAnimationFrame(checkFrame);
  };

  requestAnimationFrame(checkFrame);
};

/**
 * Monitor memory usage
 * Available in Chrome with --enable-precise-memory-info flag
 */
export const monitorMemory = () => {
  if (performance.memory) {
    setInterval(() => {
      const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
      const limit = (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2);
      const percentage = ((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100).toFixed(0);

      console.log(`Memory: ${used}MB / ${limit}MB (${percentage}%)`);
    }, 5000);
  }
};

/**
 * Quick performance report
 */
export const generatePerformanceReport = () => {
  const metrics = performance.getEntries();
  
  console.group('📊 Performance Report');
  
  // Navigation Timing
  if (performance.timing) {
    const timing = performance.timing;
    console.log('Navigation Timings:');
    console.log(`- DNS Lookup: ${timing.domainLookupEnd - timing.domainLookupStart}ms`);
    console.log(`- TCP Connection: ${timing.connectEnd - timing.connectStart}ms`);
    console.log(`- Time to First Byte: ${timing.responseStart - timing.navigationStart}ms`);
    console.log(`- DOM Interactive: ${timing.domInteractive - timing.navigationStart}ms`);
    console.log(`- DOM Complete: ${timing.domComplete - timing.navigationStart}ms`);
  }

  // First Contentful Paint
  const fcpMetric = metrics.find(m => m.name === 'first-contentful-paint');
  if (fcpMetric) {
    console.log(`First Contentful Paint (FCP): ${fcpMetric.startTime.toFixed(0)}ms`);
  }

  // Largest Contentful Paint
  const lcpMetrics = metrics.filter(m => m.entryType === 'largest-contentful-paint');
  if (lcpMetrics.length) {
    const lcp = lcpMetrics[lcpMetrics.length - 1];
    console.log(`Largest Contentful Paint (LCP): ${lcp.renderTime.toFixed(0)}ms`);
  }

  console.groupEnd();
};
