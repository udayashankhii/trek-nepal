// src/utils/imageDebugger.js
/**
 * Comprehensive image debugging utilities
 * Use this to diagnose image loading issues
 */

import { 
  normalizeImageUrl, 
  validateImageUrl, 
  extractHeroData, 
  extractGalleryData 
} from './trekDataHelpers';

/**
 * Test image URL accessibility
 * 
 * Usage:
 * import { testImageUrl } from '@/utils/imageDebugger';
 * await testImageUrl('https://example.com/image.jpg');
 */
export const testImageUrl = async (url) => {
  console.group(`🧪 Testing Image URL: ${url}`);
  
  try {
    // 1. Normalize URL
    const normalized = normalizeImageUrl(url);
    console.log('✅ Normalized URL:', normalized);
    
    // 2. Validate URL
    const result = await validateImageUrl(normalized);
    
    if (result.valid) {
      console.log('✅ Image loads successfully');
    } else {
      console.error('❌ Image failed to load:', result.error);
    }
    
    // 3. Check response headers (if accessible)
    try {
      const response = await fetch(normalized, { method: 'HEAD' });
      console.log('📊 Response Status:', response.status);
      console.log('📊 Content-Type:', response.headers.get('content-type'));
      console.log('📊 Content-Length:', response.headers.get('content-length'), 'bytes');
    } catch (err) {
      console.warn('⚠️ Could not fetch headers:', err.message);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return { valid: false, error: error.message };
  } finally {
    console.groupEnd();
  }
};

/**
 * Batch test multiple image URLs
 */
export const testMultipleImages = async (urls) => {
  console.group(`🧪 Testing ${urls.length} Images`);
  
  const results = [];
  for (const url of urls) {
    const result = await testImageUrl(url);
    results.push({ url, ...result });
  }
  
  const validCount = results.filter(r => r.valid).length;
  const invalidCount = results.filter(r => !r.valid).length;
  
  console.log(`\n📊 Results Summary:`);
  console.log(`✅ Valid: ${validCount}`);
  console.log(`❌ Invalid: ${invalidCount}`);
  console.log(`📈 Success Rate: ${((validCount / urls.length) * 100).toFixed(1)}%`);
  
  if (invalidCount > 0) {
    console.log('\n❌ Failed Images:');
    results.filter(r => !r.valid).forEach(r => {
      console.log(`  - ${r.url}`);
      console.log(`    Error: ${r.error}`);
    });
  }
  
  console.groupEnd();
  return results;
};

/**
 * Comprehensive trek data debugging
 * 
 * Usage:
 * import { debugTrekData } from '@/utils/imageDebugger';
 * await debugTrekData(trekData);
 */
export const debugTrekData = async (trek) => {
  console.group('🔍 Trek Data Debug Report');
  console.log('Trek Slug:', trek?.slug || 'N/A');
  console.log('Trek Title:', trek?.title || trek?.trek?.title || 'N/A');
  
  // Test Hero Image
  console.group('\n🖼️ Hero Section');
  const heroData = extractHeroData(trek);
  console.log('Hero Data:', heroData);
  
  if (heroData?.imageUrl) {
    await testImageUrl(heroData.imageUrl);
  } else {
    console.warn('❌ No hero image URL found');
  }
  console.groupEnd();
  
  // Test Gallery Images
  console.group('\n📷 Gallery Section');
  const galleryData = extractGalleryData(trek);
  console.log(`Found ${galleryData.length} gallery images`);
  
  if (galleryData.length > 0) {
    console.table(galleryData.map((img, idx) => ({
      index: idx,
      id: img.id,
      title: img.title || '(no title)',
      url: img.image_url,
    })));
    
    const galleryUrls = galleryData.map(img => img.image_url);
    await testMultipleImages(galleryUrls.slice(0, 5)); // Test first 5 only
  } else {
    console.warn('❌ No gallery images found');
  }
  console.groupEnd();
  
  // Check for common issues
  console.group('\n⚠️ Common Issues Check');
  
  const issues = [];
  
  // Check for relative URLs
  if (heroData?.imageUrl && !heroData.imageUrl.startsWith('http')) {
    issues.push('Hero image URL is relative (should be absolute)');
  }
  
  const relativeGalleryUrls = galleryData.filter(
    img => img.image_url && !img.image_url.startsWith('http')
  );
  if (relativeGalleryUrls.length > 0) {
    issues.push(`${relativeGalleryUrls.length} gallery images have relative URLs`);
  }
  
  // Check for missing alt text
  if (!heroData?.imageAlt) {
    issues.push('Hero image missing alt text');
  }
  
  const missingAlt = galleryData.filter(img => !img.alt);
  if (missingAlt.length > 0) {
    issues.push(`${missingAlt.length} gallery images missing alt text`);
  }
  
  if (issues.length > 0) {
    console.warn('⚠️ Issues found:');
    issues.forEach(issue => console.warn(`  - ${issue}`));
  } else {
    console.log('✅ No common issues detected');
  }
  
  console.groupEnd();
  console.groupEnd();
};

/**
 * Test backend image endpoints
 */
export const testBackendImageEndpoints = async (baseUrl) => {
  console.group('🔌 Testing Backend Image Endpoints');
  
  const endpoints = [
    '/media/images/',
    '/static/images/',
    '/uploads/treks/',
  ];
  
  for (const endpoint of endpoints) {
    const url = `${baseUrl}${endpoint}test.jpg`;
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`${response.ok ? '✅' : '❌'} ${url} - Status: ${response.status}`);
    } catch (error) {
      console.error(`❌ ${url} - Error: ${error.message}`);
    }
  }
  
  console.groupEnd();
};

/**
 * Generate image loading performance report
 */
export const generatePerformanceReport = async (urls) => {
  console.group('⚡ Image Loading Performance Report');
  
  const results = [];
  
  for (const url of urls) {
    const start = performance.now();
    const result = await validateImageUrl(url, 10000);
    const duration = performance.now() - start;
    
    results.push({
      url,
      duration: Math.round(duration),
      valid: result.valid,
    });
  }
  
  console.table(results);
  
  const avgLoadTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  const slowImages = results.filter(r => r.duration > 1000);
  
  console.log(`\n📊 Summary:`);
  console.log(`Average load time: ${Math.round(avgLoadTime)}ms`);
  console.log(`Slow images (>1s): ${slowImages.length}`);
  
  if (slowImages.length > 0) {
    console.warn('\n⚠️ Slow loading images (consider optimization):');
    slowImages.forEach(img => {
      console.warn(`  - ${img.url} (${img.duration}ms)`);
    });
  }
  
  console.groupEnd();
  return results;
};

/**
 * Check CORS configuration
 */
export const testCORS = async (imageUrl) => {
  console.group('🔐 Testing CORS Configuration');
  
  try {
    const response = await fetch(imageUrl, {
      method: 'GET',
      mode: 'cors',
    });
    
    console.log('✅ CORS request successful');
    console.log('Status:', response.status);
    console.log('Headers:');
    console.log('  Access-Control-Allow-Origin:', response.headers.get('access-control-allow-origin'));
    console.log('  Access-Control-Allow-Methods:', response.headers.get('access-control-allow-methods'));
    
  } catch (error) {
    console.error('❌ CORS error:', error.message);
    console.log('\n💡 Possible solutions:');
    console.log('  1. Add your frontend domain to CORS_ALLOWED_ORIGINS in backend');
    console.log('  2. Check if backend has CORS middleware enabled');
    console.log('  3. Verify image URL is correct');
  }
  
  console.groupEnd();
};

/**
 * Full diagnostic test
 * Run this to get a complete picture of image loading status
 */
export const runFullDiagnostic = async (trek) => {
  console.log('🚀 Starting Full Image Diagnostic...\n');
  
  const startTime = performance.now();
  
  // 1. Test trek data
  await debugTrekData(trek);
  
  // 2. Test backend endpoints
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (baseUrl) {
    await testBackendImageEndpoints(baseUrl);
  }
  
  // 3. Performance test
  const heroData = extractHeroData(trek);
  const galleryData = extractGalleryData(trek);
  const allUrls = [
    heroData?.imageUrl,
    ...galleryData.slice(0, 3).map(img => img.image_url),
  ].filter(Boolean);
  
  if (allUrls.length > 0) {
    await generatePerformanceReport(allUrls);
  }
  
  // 4. CORS test
  if (heroData?.imageUrl) {
    await testCORS(heroData.imageUrl);
  }
  
  const totalTime = performance.now() - startTime;
  console.log(`\n✅ Diagnostic complete in ${Math.round(totalTime)}ms`);
};

/**
 * Quick health check (call this on page load in development)
 */
export const quickHealthCheck = async (trek) => {
  if (import.meta.env.PROD) return; // Only in development
  
  console.log('🏥 Quick Image Health Check');
  
  const heroData = extractHeroData(trek);
  const galleryData = extractGalleryData(trek);
  
  const stats = {
    heroImage: heroData?.imageUrl ? '✅' : '❌',
    galleryImages: `${galleryData.length} found`,
    status: 'OK',
  };
  
  if (!heroData?.imageUrl) stats.status = 'WARNING';
  if (galleryData.length === 0) stats.status = 'WARNING';
  
  console.table(stats);
  
  return stats;
};

export default {
  testImageUrl,
  testMultipleImages,
  debugTrekData,
  testBackendImageEndpoints,
  generatePerformanceReport,
  testCORS,
  runFullDiagnostic,
  quickHealthCheck,
};