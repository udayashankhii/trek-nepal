export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
export const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
export const GOOGLE_MAPS_SCRIPT_ID = "google-maps-js";

export const MAP_CONFIG = {
  defaultCenter: { lat: 27.7172, lng: 85.324 },
  defaultZoom: 7,
  minZoom: 5,
  maxZoom: 16,
};

export const COLORS = {
  primary: "#1d4ed8",
  light: "#94a3b8",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
};

// ✅ NEPAL BOUNDS VALIDATION
const NEPAL_BOUNDS = {
  minLat: 26.3,
  maxLat: 30.4,
  minLng: 80.0,
  maxLng: 88.2,
};

export const validateNepaliLocation = (lat, lng) => {
  if (
    lat < NEPAL_BOUNDS.minLat ||
    lat > NEPAL_BOUNDS.maxLat ||
    lng < NEPAL_BOUNDS.minLng ||
    lng > NEPAL_BOUNDS.maxLng
  ) {
    return false;
  }
  return true;
};

// ✅ HAVERSINE DISTANCE CALCULATOR
export const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// ✅ COMPUTE PATH DISTANCE (for segments)
export const computePathDistance = (path) => {
  if (!path || path.length < 2) return 0;

  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];
    total += calculateHaversineDistance(
      current.lat,
      current.lng,
      next.lat,
      next.lng
    );
  }
  return total;
};

// ✅ COMPUTE DISTANCE IN METERS (alias for backward compatibility)
export const computeDistanceMeters = (lat1, lon1, lat2, lon2) => {
  return calculateHaversineDistance(lat1, lon1, lat2, lon2);
};

// ✅ FIND CLOSEST INDEX IN PATH (for segment extraction)
export const findClosestIndex = (path, targetCoords) => {
  if (!path || path.length === 0) return -1;

  let closestIdx = 0;
  let minDistance = Infinity;

  for (let i = 0; i < path.length; i++) {
    const distance = calculateHaversineDistance(
      path[i].lat,
      path[i].lng,
      targetCoords.lat,
      targetCoords.lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestIdx = i;
    }
  }

  return minDistance < 5000 ? closestIdx : -1; // Within 5km
};

// ✅ FORMAT DISTANCE HELPER
export const formatDistance = (meters) => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
};

// ✅ RATE LIMIT HELPER
export const rateLimitDelay = async (delayMs = 400) => {
  return new Promise((r) => setTimeout(r, delayMs));
};

// ✅ UTILITY FUNCTIONS (existing)
export const isValidNumber = (num) => {
  return typeof num === "number" && !isNaN(num) && isFinite(num);
};

export const extractDaySegment = (routePoints, fullPath) => {
  if (!routePoints || routePoints.length < 2 || !fullPath || fullPath.length === 0) {
    return [];
  }

  const start = routePoints[0].position;
  const end = routePoints[1].position;

  let startIdx = -1;
  let endIdx = -1;
  let minStartDist = Infinity;
  let minEndDist = Infinity;

  fullPath.forEach((point, idx) => {
    const startDist = calculateHaversineDistance(
      point.lat,
      point.lng,
      start.lat,
      start.lng
    );
    const endDist = calculateHaversineDistance(
      point.lat,
      point.lng,
      end.lat,
      end.lng
    );

    if (startDist < minStartDist) {
      minStartDist = startDist;
      startIdx = idx;
    }
    if (endDist < minEndDist) {
      minEndDist = endDist;
      endIdx = idx;
    }
  });

  if (startIdx === -1 || endIdx === -1) return fullPath;
  if (startIdx > endIdx) [startIdx, endIdx] = [endIdx, startIdx];

  return fullPath.slice(startIdx, endIdx + 1);
};

// ✅ GOOGLE MAPS LOADER
export const loadGoogleMaps = (apiKey = GOOGLE_MAPS_API_KEY) => {
  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key missing"));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
  if (existingScript) {
    return new Promise((resolve, reject) => {
      const onLoad = () => {
        existingScript.removeEventListener("load", onLoad);
        existingScript.removeEventListener("error", onError);
        resolve(window.google);
      };
      const onError = () => {
        existingScript.removeEventListener("load", onLoad);
        existingScript.removeEventListener("error", onError);
        reject(new Error("Failed to load Google Maps script"));
      };
      existingScript.addEventListener("load", onLoad);
      existingScript.addEventListener("error", onError);
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,routes&loading=async`;
    script.async = true;
    script.defer = true;

    script.addEventListener("load", () => resolve(window.google));
    script.addEventListener("error", () =>
      reject(new Error("Failed to load Google Maps script"))
    );

    document.head.appendChild(script);
  });
};