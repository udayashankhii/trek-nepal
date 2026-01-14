
import { useCallback, useRef, useEffect, useState } from "react";

/**
 * FIXED: useRouteMap Hook - PURE JAVASCRIPT
 * ✅ Removed TypeScript syntax (<> generics)
 * ✅ Changed useState to useEffect for initialization
 * ✅ Proper ref management
 * ✅ Memoized callbacks to prevent infinite loops
 * ✅ Clean API caching system
 */

export function useRouteMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const directionsServiceRef = useRef(null);

  // Route caching to prevent duplicate API calls
  const routeCacheRef = useRef(new Map());
  const polylineRefsRef = useRef({
    base: null,
    segment: null,
  });

  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [mapType, setMapType] = useState("roadmap");
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeSegmentInfo, setRouteSegmentInfo] = useState("");
  const [directionsStatus, setDirectionsStatus] = useState("");
  const [drawingDirections, setDrawingDirections] = useState(false);

  // Initialize map
  const initializeMap = useCallback(async () => {
    if (!mapContainerRef.current) return;

    try {
      const google = window.google;

      if (!google?.maps) {
        setMapError(
          "Google Maps API not loaded. Check your API key in .env"
        );
        console.error("❌ Google Maps API not available");
        return;
      }

      const map = new google.maps.Map(mapContainerRef.current, {
        zoom: 8,
        center: { lat: 28.0, lng: 84.0 }, // Nepal center
        mapTypeId: "roadmap",
        mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || "default",
      });

      mapInstanceRef.current = map;
      directionsServiceRef.current = new google.maps.DirectionsService();

      setMapReady(true);
      console.log("✅ Map initialized successfully");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to initialize map";
      setMapError(message);
      console.error("❌ Map initialization failed:", err);
    }
  }, []);

  // ✅ FIXED: Use useEffect instead of useState for initialization
  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  // Fit map bounds to show all markers
  const fitBounds = useCallback(
    (map, points) => {
      if (!map || points.length === 0) return;

      const bounds = new window.google.maps.LatLngBounds();
      points.forEach((point) => {
        bounds.extend(point.position || point);
      });

      map.fitBounds(bounds, { padding: 50 });
    },
    []
  );

  // Add markers to map
  const addMarkers = useCallback(
    (map, points) => {
      if (!map) return;

      // Clear existing markers
      const existingMarkers = document.querySelectorAll(
        "[role='button'][jsaction*='click']"
      );
      existingMarkers.forEach((el) => {
        if (el instanceof HTMLElement) {
          const marker = el.__marker;
          if (marker) marker.setMap(null);
        }
      });

      // Add new markers
      const google = window.google;
      points.forEach((point, index) => {
        const marker = new google.maps.Marker({
          map,
          position: point.position,
          title: point.title,
          label: String(index + 1),
          animation: google.maps.Animation.DROP,
        });

        marker.__marker = marker;

        marker.addListener("click", () => {
          const infoWindow = new google.maps.InfoWindow({
            content: `<div style="padding: 10px;">
              <p style="margin: 0; font-weight: bold;">${point.title}</p>
              <p style="margin: 5px 0 0 0; font-size: 12px;">
                Lat: ${point.position.lat.toFixed(4)}, 
                Lng: ${point.position.lng.toFixed(4)}
              </p>
            </div>`,
          });
          infoWindow.open(map, marker);
        });
      });

      console.log(`✅ Added ${points.length} markers`);
    },
    []
  );

  // Draw polyline on map
  const drawPolyline = useCallback(
    (map, path, isSegment) => {
      if (!map || !path || path.length === 0) return;

      // Clear existing polyline of same type
      const ref = isSegment
        ? polylineRefsRef.current.segment
        : polylineRefsRef.current.base;

      if (ref) {
        ref.setMap(null);
      }

      const google = window.google;
      const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: isSegment ? "#3b82f6" : "#1e40af", // Blue for routes
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map,
      });

      if (isSegment) {
        polylineRefsRef.current.segment = polyline;
      } else {
        polylineRefsRef.current.base = polyline;
      }

      console.log(
        `✅ Drew ${isSegment ? "segment" : "full trek"} polyline with ${path.length} points`
      );
    },
    []
  );

  // Get cache key for route segment
  const getCacheKey = useCallback(
    (start, end) => {
      return `${start.lat.toFixed(4)},${start.lng.toFixed(4)}->${end.lat.toFixed(4)},${end.lng.toFixed(4)}`;
    },
    []
  );

  // Generate route between points
  const generateRoute = useCallback(
    async (map, points) => {
      if (!directionsServiceRef.current || points.length < 2) {
        return { success: false };
      }

      try {
        const google = window.google;
        const fullPath = [];
        let failedSegments = 0;
        const travelModes = [
          google.maps.TravelMode.WALKING,
          google.maps.TravelMode.DRIVING,
        ];

        // Process each segment
        for (let i = 0; i < points.length - 1; i++) {
          const start = points[i].position;
          const end = points[i + 1].position;
          const cacheKey = getCacheKey(start, end);

          // Check cache first
          if (routeCacheRef.current.has(cacheKey)) {
            const cached = routeCacheRef.current.get(cacheKey);
            console.log(`📏 Segment ${i + 1}/${points.length - 1} (CACHED)`);

            if (i === 0) {
              fullPath.push(...cached.path);
            } else {
              // Skip duplicate start point
              fullPath.push(...cached.path.slice(1));
            }
            continue;
          }

          console.log(`🔄 Segment ${i + 1}/${points.length - 1} (API CALL)`);

          // Try different travel modes
          let segmentPath = null;
          let usedMode = "";

          for (const mode of travelModes) {
            try {
              const result = await new Promise((resolve, reject) => {
                directionsServiceRef.current.route(
                  {
                    origin: start,
                    destination: end,
                    travelMode: mode,
                    avoidHighways: true,
                    region: "NP",
                  },
                  (response, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                      resolve(response);
                    } else {
                      reject(new Error(`Status: ${status}`));
                    }
                  }
                );
              });

              // Extract path from response
              segmentPath = result.routes[0].overview_path.map((point) => ({
                lat: point.lat(),
                lng: point.lng(),
              }));

              usedMode = mode === google.maps.TravelMode.WALKING ? "WALKING" : "DRIVING";
              console.log(
                `✅ ${usedMode} route for segment ${i + 1}/${points.length - 1}`
              );
              break;
            } catch (err) {
              console.log(
                `⚠️ ${mode} failed for segment ${i + 1}: ${err.message}`
              );
              continue;
            }
          }

          // Fallback to straight line if all modes fail
          if (!segmentPath) {
            console.log(
              `⚠️ No route found, using straight line for segment ${i + 1}`
            );
            segmentPath = [start, end];
            failedSegments++;
          }

          // Cache and add to path
          routeCacheRef.current.set(cacheKey, {
            success: true,
            path: segmentPath,
            distanceText: "",
            durationText: "",
            source: usedMode,
            failedSegments: 0,
          });

          if (i === 0) {
            fullPath.push(...segmentPath);
          } else {
            fullPath.push(...segmentPath.slice(1));
          }

          // Rate limiting
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        return {
          success: true,
          path: fullPath,
          failedSegments,
          source:
            failedSegments === 0 ? "full_google_route" : "mixed_routing",
        };
      } catch (err) {
        console.error("❌ Route generation failed:", err);
        return { success: false };
      }
    },
    [getCacheKey]
  );

  // Skip acclimatization days
  const skipAcclimatizationDays = useCallback((points) => {
    return points.filter((point, index) => {
      if (index === points.length - 1) return true;

      const current = point.position;
      const next = points[index + 1].position;

      // Include point if it's different from next (not acclimatization)
      const isDifferent =
        Math.abs(current.lat - next.lat) > 0.001 ||
        Math.abs(current.lng - next.lng) > 0.001;

      return isDifferent;
    });
  }, []);

  // Clear overlays
  const clearOverlays = useCallback(() => {
    if (polylineRefsRef.current.base) {
      polylineRefsRef.current.base.setMap(null);
      polylineRefsRef.current.base = null;
    }
    if (polylineRefsRef.current.segment) {
      polylineRefsRef.current.segment.setMap(null);
      polylineRefsRef.current.segment = null;
    }
  }, []);

  return {
    mapContainerRef,
    mapInstanceRef,
    mapReady,
    mapError,
    mapType,
    setMapType,
    routeInfo,
    setRouteInfo,
    routeSegmentInfo,
    setRouteSegmentInfo,
    directionsStatus,
    setDirectionsStatus,
    drawingDirections,
    setDrawingDirections,
    clearOverlays,
    addMarkers,
    drawPolyline,
    fitBounds,
    generateRoute,
    skipAcclimatizationDays,
  };
}