/**
 * Common Scroll Performance Pitfalls - Examples to AVOID
 * 
 * Use these as reference when implementing new features
 */

// ================================================================
// ❌ ANTIPATTERN 1: Unthrottled Scroll Listeners
// ================================================================

// BAD ❌
function BadScrollListener() {
  React.useEffect(() => {
    const handleScroll = () => {
      // This fires 300+ times per second!
      setState(window.scrollY);
      updatePosition();
      triggerAnimation();
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

// GOOD ✅
function GoodScrollListener() {
  React.useEffect(() => {
    let rafId = null;
    let lastScrollY = 0;
    
    const handleScroll = () => {
      // Only update 60 times per second (16ms intervals)
      if (rafId) cancelAnimationFrame(rafId);
      
      const newScrollY = window.scrollY;
      if (Math.abs(newScrollY - lastScrollY) < 16) return;
      
      lastScrollY = newScrollY;
      
      rafId = requestAnimationFrame(() => {
        setState(newScrollY);
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}

// ================================================================
// ❌ ANTIPATTERN 2: Layout-Thrashing CSS
// ================================================================

// BAD ❌ - Triggers reflow
const badStyles = `
  .element {
    top: 100px;          /* Reflow */
    left: 50px;          /* Reflow */
    width: 100px;        /* Reflow */
    position: absolute;
  }
`;

// GOOD ✅ - GPU accelerated
const goodStyles = `
  .element {
    transform: translate(50px, 100px);  /* No reflow, GPU accelerated */
    width: 100px;                        /* Set once */
  }
`;

// ================================================================
// ❌ ANTIPATTERN 3: Reading Layout Properties in Loop
// ================================================================

// BAD ❌ - Causes layout thrashing
function BadLayoutRead() {
  const elements = document.querySelectorAll('.item');
  
  elements.forEach(el => {
    // Each read forces browser to calculate layout
    const height = el.offsetHeight;    // Read
    el.style.top = (height + 10) + 'px'; // Write
  });
}

// GOOD ✅ - Batch reads then writes
function GoodLayoutRead() {
  const elements = document.querySelectorAll('.item');
  const heights = [];
  
  // Read all
  elements.forEach(el => {
    heights.push(el.offsetHeight);
  });
  
  // Write all
  elements.forEach((el, i) => {
    el.style.transform = `translateY(${heights[i] + 10}px)`;
  });
}

// ================================================================
// ❌ ANTIPATTERN 4: Missing will-change
// ================================================================

// BAD ❌
const badAnimated = `
  .animated {
    opacity: 1;
    transition: opacity 0.3s;
  }
`;

// GOOD ✅
const goodAnimated = `
  .animated {
    opacity: 1;
    transition: opacity 0.3s;
    will-change: opacity;  /* Hints to browser */
  }
  
  .animated:hover {
    opacity: 0.5;
  }
`;

// ================================================================
// ❌ ANTIPATTERN 5: Unoptimized Image Rendering
// ================================================================

// BAD ❌ - Images cause paint on scroll
export function BadImageGallery() {
  return (
    <div>
      {images.map(img => (
        <img 
          key={img.id}
          src={img.url}
          alt={img.alt}
          // Scrolling causes repaints
        />
      ))}
    </div>
  );
}

// GOOD ✅ - Images optimized
export function GoodImageGallery() {
  return (
    <div>
      {images.map(img => (
        <img 
          key={img.id}
          src={img.url}
          alt={img.alt}
          loading="lazy"  // Lazy load
          style={{
            backfaceVisibility: 'hidden',  // GPU acceleration
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
      ))}
    </div>
  );
}

// ================================================================
// ❌ ANTIPATTERN 6: Full Page Reflow on Scroll
// ================================================================

// BAD ❌
const badLayout = `
  /* Scrolling affects entire document */
  * {
    transition: all 0.3s;
  }
  
  body {
    /* No containment = full reflow */
  }
`;

// GOOD ✅
const goodLayout = `
  /* Limit reflow to specific sections */
  section {
    contain: layout style paint;  /* Isolate layout */
  }
  
  /* Only transition needed properties */
  button {
    transition: color 0.2s, background-color 0.2s;
  }
`;

// ================================================================
// ❌ ANTIPATTERN 7: Heavy Transforms
// ================================================================

// BAD ❌ - Complex calculations every frame
function BadParallax() {
  const [offset, setOffset] = React.useState(0);
  
  const handleScroll = () => {
    const complex = Math.sin(window.scrollY * 0.01) * Math.cos(window.scrollY * 0.02);
    setOffset(complex);  // Heavy calculation
  };
  
  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  }, []);
}

// GOOD ✅ - Delegate to CSS
function GoodParallax() {
  return (
    <div 
      style={{
        backgroundAttachment: 'fixed',  // CSS parallax, no JS
        backgroundImage: 'url(...)'
      }}
    />
  );
}

// ================================================================
// ❌ ANTIPATTERN 8: No Event Listener Cleanup
// ================================================================

// BAD ❌ - Memory leak
function BadScrollComponent() {
  React.useEffect(() => {
    const handleScroll = () => { /* ... */ };
    window.addEventListener('scroll', handleScroll);
    // ❌ Missing cleanup - listener accumulates!
  }, []);
}

// GOOD ✅ - Proper cleanup
function GoodScrollComponent() {
  React.useEffect(() => {
    const handleScroll = () => { /* ... */ };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // ✅ Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}

// ================================================================
// ❌ ANTIPATTERN 9: Synchronous DOM Manipulation
// ================================================================

// BAD ❌
function BadDOMUpdate() {
  const elements = document.querySelectorAll('.item');
  
  elements.forEach((el, i) => {
    // Synchronous - blocks rendering
    el.textContent = generateComplexContent(i);
    el.style.color = calculateColor(i);
    el.className = getClass(i);
  });
}

// GOOD ✅ - Use DocumentFragment
function GoodDOMUpdate() {
  const fragment = document.createDocumentFragment();
  const elements = document.querySelectorAll('.item');
  
  elements.forEach((el, i) => {
    // Update offline first
    el.textContent = generateComplexContent(i);
    el.style.color = calculateColor(i);
    el.className = getClass(i);
    fragment.appendChild(el.cloneNode(true));
  });
  
  // Single paint operation
  document.body.appendChild(fragment);
}

// ================================================================
// ❌ ANTIPATTERN 10: Animating Wrong Properties
// ================================================================

// BAD ❌ - Expensive repaints
const expensiveAnimation = `
  @keyframes bad {
    0% { width: 0; height: 0; }
    100% { width: 100px; height: 100px; }
  }
  
  .element {
    animation: bad 1s;  /* Triggers layout recalc */
  }
`;

// GOOD ✅ - GPU accelerated
const fastAnimation = `
  @keyframes good {
    0% { transform: scale(0); }
    100% { transform: scale(1); }
  }
  
  .element {
    animation: good 1s;  /* No layout recalc */
    will-change: transform;
  }
`;

// ================================================================
// SUMMARY: Performance Checklist
// ================================================================

/*
✅ DO:
  - Throttle/debounce scroll events to 60fps
  - Use transform and opacity for animations
  - Add will-change to frequently animated elements
  - Use requestAnimationFrame for smooth updates
  - Implement intersection observer for lazy loading
  - Batch DOM reads and writes
  - Use contain: layout style paint for sections
  - Clean up event listeners on component unmount
  - Lazy load images and content
  - Test on mobile devices

❌ DON'T:
  - Listen to every scroll event without throttling
  - Animate top, left, width, height properties
  - Read layout properties inside loops
  - Forget will-change hints
  - Manipulate DOM synchronously
  - Add listeners without cleanup
  - Use inline styles for animations
  - Override transitions/transforms globally
  - Ignore mobile performance
  - Skip DevTools Performance profiling
*/

export default {
  examples: {
    BadScrollListener,
    GoodScrollListener,
    BadImageGallery,
    GoodImageGallery,
    BadParallax,
    GoodParallax,
    BadScrollComponent,
    GoodScrollComponent
  }
};
