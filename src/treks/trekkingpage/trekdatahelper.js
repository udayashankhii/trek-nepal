// src/utils/trekDataHelpers.js
/**
 * Production-level helper functions for trek data extraction and image handling
 * 
 * Features:
 * - Robust URL normalization
 * - Multiple fallback strategies
 * - Comprehensive error handling
 * - Image preloading
 * - Debug utilities
 */

/**
 * Get base URL from environment variables
 */
const getBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 
                  import.meta.env.VITE_ADMIN_API_BASE_URL || 
                  'http://localhost:8000';
  
  // Remove trailing slash for consistency
  return baseUrl.replace(/\/$/, '');
};

/**
 * Normalize URL to absolute format
 * Handles: relative URLs, protocol-relative URLs, malformed URLs
 * 
 * @param {string} url - URL to normalize
 * @param {boolean} throwOnInvalid - Throw error if URL is invalid
 * @returns {string|null} Normalized absolute URL or null
 */
export const normalizeImageUrl = (url, throwOnInvalid = false) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmedUrl = url.trim();
  
  // Already absolute HTTP/HTTPS
  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }
  
  // Protocol-relative URL (//example.com/image.jpg)
  if (trimmedUrl.startsWith('//')) {
    return `https:${trimmedUrl}`;
  }
  
  // Relative URL - prepend base URL
  if (trimmedUrl.startsWith('/')) {
    return `${getBaseUrl()}${trimmedUrl}`;
  }
  
  // Data URL (base64 embedded images)
  if (trimmedUrl.startsWith('data:image/')) {
    return trimmedUrl;
  }
  
  // Invalid format
  if (throwOnInvalid) {
    throw new Error(`Invalid image URL format: ${trimmedUrl}`);
  }
  
  console.warn('⚠️ Unable to normalize URL:', trimmedUrl);
  return null;
};

/**
 * Extract and normalize hero section data
 * 
 * @param {Object} trek - Trek data from API
 * @returns {Object} Normalized hero data
 */
export const extractHeroData = (trek) => {
  if (!trek) {
    console.warn('extractHeroData: No trek data provided');
    return getDefaultHeroData();
  }

  const hero = trek.hero || trek.hero_section || {};
  const trekInfo = trek.trek || trek;

  // Extract image URL with multiple fallback sources
  const rawImageUrl = hero.imageUrl || 
                      hero.image_url || 
                      hero.image || 
                      trekInfo.card_image_url ||
                      trekInfo.hero_image ||
                      null;

  const imageUrl = normalizeImageUrl(rawImageUrl) || '/everest.jpeg';

  return {
    // Image
    imageUrl,
    imageAlt: hero.imageAlt || 
              hero.image_alt || 
              `${trekInfo.title || 'Trek'} hero image`,
    imageCaption: hero.imageCaption || hero.image_caption || '',
    
    // Text content
    title: hero.title || trekInfo.title || 'Trek Adventure',
    subtitle: hero.subtitle || trekInfo.review_text || trekInfo.subtitle || '',
    
    // Info badges
    season: hero.season || trekInfo.season || '',
    duration: hero.duration || trekInfo.duration || '',
    difficulty: hero.difficulty || trekInfo.trip_grade || trekInfo.trek_grade || '',
    location: hero.location || trekInfo.region_name || trekInfo.region || '',
    
    // CTA
    ctaLabel: hero.cta_label || hero.ctaLabel || 'Book This Trek',
    ctaLink: hero.cta_link || hero.ctaLink || '',
  };
};

/**
 * Default hero data for fallback
 */
const getDefaultHeroData = () => ({
  imageUrl: '/everest.jpeg',
  imageAlt: 'Trek adventure',
  imageCaption: '',
  title: 'Trek Adventure',
  subtitle: '',
  season: '',
  duration: '',
  difficulty: '',
  location: '',
  ctaLabel: 'Book This Trek',
  ctaLink: '',
});

/**
 * Extract and normalize gallery images
 * 
 * @param {Object} trek - Trek data from API
 * @returns {Array} Normalized gallery images
 */
export const extractGalleryData = (trek) => {
  if (!trek) {
    console.warn('extractGalleryData: No trek data provided');
    return [];
  }

  // Try multiple data sources
  const rawGallery = trek.gallery || 
                     trek.gallery_images || 
                     trek.images || 
                     [];

  if (!Array.isArray(rawGallery)) {
    console.warn('extractGalleryData: Gallery data is not an array:', rawGallery);
    return [];
  }

  // Filter and normalize images
  const normalizedImages = rawGallery
    .map((img, index) => {
      if (!img) return null;

      // Extract URL from various possible fields
      const rawUrl = img.image_url || 
                     img.url || 
                     img.image || 
                     img.src || 
                     img.path || 
                     (typeof img === 'string' ? img : null);

      const imageUrl = normalizeImageUrl(rawUrl);
      
      if (!imageUrl) {
        console.warn(`Gallery image ${index} has no valid URL:`, img);
        return null;
      }

      return {
        id: img.id || `gallery-${index}`,
        image_url: imageUrl,
        title: img.title || '',
        caption: img.caption || '',
        altText: img.altText || 
                 img.alt_text || 
                 img.alt || 
                 img.title || 
                 `Gallery image ${index + 1}`,
        order: img.order !== undefined ? img.order : index,
      };
    })
    .filter(Boolean); // Remove null entries

  console.log(`✅ Extracted ${normalizedImages.length} valid gallery images`);
  return normalizedImages;
};

/**
 * Validate image URL by attempting to load it
 * 
 * @param {string} url - Image URL to validate
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<{valid: boolean, url: string, error?: string}>}
 */
export const validateImageUrl = (url, timeout = 5000) => {
  if (!url) {
    return Promise.resolve({ valid: false, url, error: 'No URL provided' });
  }

  return new Promise((resolve) => {
    const img = new Image();
    let timeoutId;

    const cleanup = () => {
      clearTimeout(timeoutId);
      img.onload = null;
      img.onerror = null;
    };

    img.onload = () => {
      cleanup();
      console.log('✅ Image loaded:', url);
      resolve({ valid: true, url });
    };

    img.onerror = () => {
      cleanup();
      console.error('❌ Image failed to load:', url);
      resolve({ valid: false, url, error: 'Failed to load' });
    };

    timeoutId = setTimeout(() => {
      cleanup();
      console.error('⏱️ Image load timeout:', url);
      resolve({ valid: false, url, error: 'Timeout' });
    }, timeout);

    img.src = url;
  });
};

/**
 * Batch validate multiple image URLs
 * 
 * @param {Array<string>} urls - Array of image URLs
 * @returns {Promise<Array>} Validation results
 */
export const validateImageUrls = async (urls) => {
  if (!Array.isArray(urls)) return [];
  
  const results = await Promise.all(
    urls.map(url => validateImageUrl(url))
  );
  
  const validCount = results.filter(r => r.valid).length;
  console.log(`📊 Image validation: ${validCount}/${urls.length} valid`);
  
  return results;
};

/**
 * Debug helper - logs all image URLs from trek data
 * 
 * @param {Object} trek - Trek data from API
 */
export const debugTrekImages = async (trek) => {
  if (!trek) {
    console.log('❌ No trek data available');
    return;
  }

  console.group('🖼️ Trek Images Debug');
  
  try {
    // Hero image
    const hero = extractHeroData(trek);
    console.log('Hero Image:', hero?.imageUrl);
    
    if (hero?.imageUrl) {
      const heroResult = await validateImageUrl(hero.imageUrl);
      console.log('Hero validation:', heroResult.valid ? '✅ Valid' : '❌ Invalid');
    }
    
    // Gallery images
    const gallery = extractGalleryData(trek);
    console.log(`Gallery Images: ${gallery.length} total`);
    
    if (gallery.length > 0) {
      console.table(gallery.map((img, idx) => ({
        index: idx,
        url: img.image_url,
        title: img.title || '(no title)',
      })));
      
      // Validate first 3 gallery images
      const galleryUrls = gallery.slice(0, 3).map(img => img.image_url);
      await validateImageUrls(galleryUrls);
    }
  } catch (error) {
    console.error('Error debugging images:', error);
  } finally {
    console.groupEnd();
  }
};

/**
 * Get fallback image URL
 * 
 * @param {string} type - 'hero' or 'gallery'
 * @returns {string} Fallback image URL
 */
export const getFallbackImage = (type = 'hero') => {
  const fallbacks = {
    hero: import.meta.env.VITE_FALLBACK_HERO_IMAGE || '/everest.jpeg',
    gallery: import.meta.env.VITE_FALLBACK_GALLERY_IMAGE || '/fallback.jpg',
  };
  
  return fallbacks[type] || '/fallback.jpg';
};

/**
 * Preload images for better performance
 * 
 * @param {Object} trek - Trek data from API
 * @param {number} maxGalleryImages - Max gallery images to preload
 */
export const preloadTrekImages = (trek, maxGalleryImages = 3) => {
  if (!trek) return;

  const imagesToPreload = new Set(); // Use Set to avoid duplicates
  
  try {
    // Add hero image
    const hero = extractHeroData(trek);
    if (hero?.imageUrl && !hero.imageUrl.startsWith('data:')) {
      imagesToPreload.add(hero.imageUrl);
    }
    
    // Add gallery images (first N)
    const gallery = extractGalleryData(trek);
    gallery
      .slice(0, maxGalleryImages)
      .forEach(img => {
        if (img.image_url && !img.image_url.startsWith('data:')) {
          imagesToPreload.add(img.image_url);
        }
      });
    
    // Preload using link tags
    imagesToPreload.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      link.onload = () => console.log('✅ Preloaded:', url);
      link.onerror = () => console.warn('⚠️ Preload failed:', url);
      document.head.appendChild(link);
    });
    
    console.log(`🚀 Preloading ${imagesToPreload.size} images`);
  } catch (error) {
    console.error('Error preloading images:', error);
  }
};

/**
 * Extract card image URL for trek cards/listings
 * 
 * @param {Object} trek - Trek data
 * @returns {string} Card image URL
 */
export const extractCardImageUrl = (trek) => {
  if (!trek) return getFallbackImage('gallery');

  const rawUrl = trek.card_image_url || 
                 trek.cardImageUrl ||
                 trek.image_url ||
                 trek.imageUrl ||
                 trek.hero?.imageUrl ||
                 trek.hero?.image_url;

  return normalizeImageUrl(rawUrl) || getFallbackImage('gallery');
};

/**
 * Create image error handler for React components
 * 
 * @param {string} fallbackUrl - Fallback image URL
 * @returns {Function} Error handler function
 */
export const createImageErrorHandler = (fallbackUrl = '/fallback.jpg') => {
  return (e) => {
    if (e.target.src === fallbackUrl) {
      console.error('❌ Fallback image also failed to load');
      return;
    }
    
    console.warn('⚠️ Image failed, using fallback:', e.target.src);
    e.target.src = fallbackUrl;
  };
};

/**
 * Get image dimensions from URL
 * 
 * @param {string} url - Image URL
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${url}`));
    };
    
    img.src = url;
  });
};

export default {
  normalizeImageUrl,
  extractHeroData,
  extractGalleryData,
  validateImageUrl,
  validateImageUrls,
  debugTrekImages,
  getFallbackImage,
  preloadTrekImages,
  extractCardImageUrl,
  createImageErrorHandler,
  getImageDimensions,
};