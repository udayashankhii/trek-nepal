// import { useState, useEffect, useRef, useCallback } from "react";
// import {
//   loadGoogleMaps,
//   MAP_CONFIG,
//   GOOGLE_MAPS_MAP_ID,
//   COLORS,
//   calculateHaversineDistance,
//   formatDistance,
//   rateLimitDelay,
//   validateNepaliLocation,
// } from "../../utils/mapHelpers";
// import { RouteCache } from "./routeCache";

// export const useRouteMap = () => {
//   const mapContainerRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const markersRef = useRef([]);
//   const baseRoutePolylineRef = useRef(null);
//   const segmentPolylineRef = useRef(null);
//   const routeCacheRef = useRef(new RouteCache());

//   const [mapReady, setMapReady] = useState(false);
//   const [mapError, setMapError] = useState("");
//   const [mapType, setMapType] = useState("terrain");
//   const [routeInfo, setRouteInfo] = useState(null);
//   const [routeSegmentInfo, setRouteSegmentInfo] = useState("");
//   const [directionsStatus, setDirectionsStatus] = useState("");
//   const [drawingDirections, setDrawingDirections] = useState(false);

//   // ✅ FILTER OUT ACCLIMATIZATION DAYS (duplicate coordinates)
//   const skipAcclimatizationDays = useCallback((routePoints) => {
//     if (!routePoints || routePoints.length < 2) return routePoints;

//     return routePoints.filter((current, index) => {
//       if (index === 0) return true;

//       const prev = routePoints[index - 1];
//       const isDuplicate =
//         prev.position.lat === current.position.lat &&
//         prev.position.lng === current.position.lng;

//       if (isDuplicate) {
//         console.log(
//           `⏭️ Skipping acclimatization day ${current.day} (same location as Day ${prev.day})`
//         );
//         return false;
//       }
//       return true;
//     });
//   }, []);

//   // ✅ Load Google Maps
//   useEffect(() => {
//     let mounted = true;
//     loadGoogleMaps()
//       .then((google) => {
//         if (!mounted) return;
//         if (!google?.maps?.Map)
//           throw new Error("Google Maps failed to initialize");
//         setMapReady(true);
//       })
//       .catch((error) => {
//         if (!mounted) return;
//         setMapError(error.message || "Unable to load Google Maps");
//       });

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // ✅ Initialize map
//   useEffect(() => {
//     const container = mapContainerRef.current;
//     if (!mapReady || !container || mapInstanceRef.current) return;

//     mapInstanceRef.current = new window.google.maps.Map(container, {
//       center: MAP_CONFIG.defaultCenter,
//       zoom: MAP_CONFIG.defaultZoom,
//       minZoom: MAP_CONFIG.minZoom,
//       maxZoom: MAP_CONFIG.maxZoom,
//       mapTypeControl: false,
//       zoomControl: true,
//       streetViewControl: false,
//       fullscreenControl: true,
//       clickableIcons: false,
//       gestureHandling: "greedy",
//       mapTypeId: mapType,
//       mapId: GOOGLE_MAPS_MAP_ID || undefined,
//     });
//   }, [mapReady, mapType]);

//   // ✅ Update map type
//   useEffect(() => {
//     if (mapInstanceRef.current && mapReady) {
//       mapInstanceRef.current.setMapTypeId(mapType);
//     }
//   }, [mapType, mapReady]);

//   // ✅ Clear overlays
//   const clearOverlays = useCallback(() => {
//     markersRef.current.forEach((marker) => {
//       if (marker?.setMap) marker.setMap(null);
//       else if ("map" in marker) marker.map = null;
//     });
//     markersRef.current = [];

//     [baseRoutePolylineRef, segmentPolylineRef].forEach((ref) => {
//       if (ref.current) {
//         ref.current.setMap(null);
//         ref.current = null;
//       }
//     });
//   }, []);

//   // ✅ Add markers
//   const addMarkers = useCallback((map, points) => {
//     const canUseAdvanced = Boolean(GOOGLE_MAPS_MAP_ID);
//     const AdvancedMarker = canUseAdvanced
//       ? window.google?.maps?.marker?.AdvancedMarkerElement
//       : null;

//     markersRef.current = points.map((point) => {
//       const title = point.placeName || point.title || `Day ${point.day}`;

//       if (AdvancedMarker) {
//         const content = document.createElement("div");
//         content.textContent = `${point.day}`;
//         content.title = title;
//         Object.assign(content.style, {
//           background: COLORS.primary,
//           borderRadius: "9999px",
//           color: "#fff",
//           fontSize: "12px",
//           fontWeight: "600",
//           padding: "4px 8px",
//           boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
//         });
//         return new AdvancedMarker({
//           map,
//           position: point.position,
//           title,
//           content,
//         });
//       }

//       return new window.google.maps.Marker({
//         position: point.position,
//         map,
//         label: `${point.day}`,
//         title,
//       });
//     });
//   }, []);

//   // ✅ Draw polyline
//   const drawPolyline = useCallback((map, path, isSegment = false) => {
//     const ref = isSegment ? segmentPolylineRef : baseRoutePolylineRef;

//     if (ref.current) ref.current.setMap(null);

//     ref.current = new window.google.maps.Polyline({
//       path,
//       geodesic: true,
//       strokeColor: isSegment ? COLORS.primary : COLORS.light,
//       strokeOpacity: isSegment ? 0.95 : 0.4,
//       strokeWeight: isSegment ? 5 : 3,
//       zIndex: isSegment ? 2 : 1,
//     });

//     ref.current.setMap(map);
//   }, []);

//   // ✅ Fit bounds
//   const fitBounds = useCallback((map, points) => {
//     if (!map || !points || points.length === 0) return;

//     if (points.length === 1) {
//       const point = points[0].position || points[0];
//       map.setCenter(point);
//       map.setZoom(10);
//       return;
//     }

//     const bounds = new window.google.maps.LatLngBounds();
//     points.forEach((point) => {
//       const position = point.position || point;
//       bounds.extend(position);
//     });
//     map.fitBounds(bounds);
//   }, []);

//   // ✅ ROUTE TWO POINTS WITH FALLBACK (CLEAN VERSION)
//   const routeTwoPoints = useCallback(
//     async (service, a, b) => {
//       // Check for acclimatization days
//       const coordsMatch =
//         a.position.lat === b.position.lat &&
//         a.position.lng === b.position.lng;

//       if (coordsMatch) {
//         console.warn(`⏭️ Skipping rest day (Day ${a.day})`);
//         return {
//           path: [],
//           distance: 0,
//           duration: 0,
//           source: "acclimatization",
//         };
//       }

//       // Validate Nepal bounds
//       const aValid = validateNepaliLocation(a.position.lat, a.position.lng);
//       const bValid = validateNepaliLocation(b.position.lat, b.position.lng);

//       if (!aValid || !bValid) {
//         throw new Error("Invalid Nepal location");
//       }

//       // Calculate straight distance for comparison
//       const straightDistance = calculateHaversineDistance(
//         a.position.lat,
//         a.position.lng,
//         b.position.lat,
//         b.position.lng
//       );

//       console.log(
//         `📏 Day ${a.day}→${b.day}: ${formatDistance(straightDistance)} (straight line)`
//       );

//       // 🔥 TRY WALKING FIRST, THEN DRIVING
//       const modes = [
//         {
//           mode: window.google.maps.TravelMode.WALKING,
//           label: "WALKING",
//         },
//         {
//           mode: window.google.maps.TravelMode.DRIVING,
//           label: "DRIVING",
//         },
//       ];

//       for (const { mode, label } of modes) {
//         try {
//           const result = await new Promise((resolve, reject) => {
//             service.route(
//               {
//                 origin: a.position,
//                 destination: b.position,
//                 travelMode: mode,
//               },
//               (result, status) => {
//                 if (status === "OK" && result?.routes?.[0]) {
//                   resolve(result);
//                 } else {
//                   reject(new Error(status));
//                 }
//               }
//             );
//           });

//           const route = result.routes[0];
//           const leg = route.legs[0];

//           console.log(`✅ ${label} route found: ${leg.distance.text}`);

//           return {
//             path: route.overview_path.map((ll) => ({
//               lat: ll.lat(),
//               lng: ll.lng(),
//             })),
//             distance: leg.distance?.value || 0,
//             duration: leg.duration?.value || 0,
//             source: "google_directions",
//           };
//         } catch (e) {
//           console.warn(`⚠️ ${label} mode failed: ${e.message}`);
//           continue;
//         }
//       }

//       // Both modes failed - use straight line
//       console.warn(
//         `⚠️ All routing modes failed for Day ${a.day}→${b.day}, using straight line`
//       );
//       return {
//         path: [a.position, b.position],
//         distance: straightDistance,
//         duration: 0,
//         source: "straight_line_fallback",
//       };
//     },
//     []
//   );

//   // ✅ GENERATE FULL ROUTE WITH INTELLIGENT FALLBACK
//   const generateRoute = useCallback(
//     async (map, routePoints) => {
//       if (!routePoints || routePoints.length < 2) {
//         return { success: false };
//       }

//       const service = new window.google.maps.DirectionsService();

//       // ========================================
//       // SINGLE SEGMENT (DAY VIEW)
//       // ========================================
//       if (routePoints.length === 2) {
//         try {
//           const seg = await routeTwoPoints(service, routePoints[0], routePoints[1]);

//           if (seg.source === "acclimatization") {
//             return { success: false };
//           }

//           return { success: true, ...seg };
//         } catch (e) {
//           console.error("Single segment failed:", e);
//           return {
//             success: true,
//             path: [routePoints[0].position, routePoints[1].position],
//             distance: calculateHaversineDistance(
//               routePoints[0].position.lat,
//               routePoints[0].position.lng,
//               routePoints[1].position.lat,
//               routePoints[1].position.lng
//             ),
//             duration: 0,
//             failedSegments: 1,
//             source: "fallback",
//           };
//         }
//       }

//       // ========================================
//       // FULL TREK - STITCH ALL SEGMENTS
//       // ========================================
//       console.log(`🗺️ Generating full trek route for ${routePoints.length} points...`);

//       let fullPath = [];
//       let totalDistance = 0;
//       let totalDuration = 0;
//       let failedSegments = 0;
//       let apiCalls = 0;

//       for (let i = 0; i < routePoints.length - 1; i++) {
//         const a = routePoints[i];
//         const b = routePoints[i + 1];

//         try {
//           apiCalls++;
//           const seg = await routeTwoPoints(service, a, b);

//           // Skip acclimatization days
//           if (seg.source === "acclimatization") {
//             console.log(`⏭️ Skipping acclimatization at Day ${a.day}`);
//             continue;
//           }

//           // Avoid duplicate points at joins
//           if (fullPath.length > 0 && seg.path.length > 0) {
//             const lastPoint = fullPath[fullPath.length - 1];
//             const firstNewPoint = seg.path[0];

//             const dist = calculateHaversineDistance(
//               lastPoint.lat,
//               lastPoint.lng,
//               firstNewPoint.lat,
//               firstNewPoint.lng
//             );

//             // Remove first point of new segment if it's within 1 meter of last point
//             if (dist < 1) {
//               seg.path = seg.path.slice(1);
//             }
//           }

//           fullPath = [...fullPath, ...seg.path];
//           totalDistance += seg.distance;
//           totalDuration += seg.duration;

//           if (seg.source === "straight_line_fallback") {
//             failedSegments++;
//           }

//           console.log(
//             `✅ Segment ${i + 1}/${routePoints.length - 1}: ${formatDistance(
//               seg.distance
//             )} (${seg.source})`
//           );

//           // Rate limiting
//           if (apiCalls < routePoints.length - 1) {
//             await rateLimitDelay(500);
//           }
//         } catch (e) {
//           console.error(`❌ Segment ${i + 1} failed:`, e);
//           failedSegments++;

//           // Add fallback straight line
//           const straightStart = a.position;
//           const straightEnd = b.position;

//           // If we already have points, don't duplicate the start
//           if (fullPath.length > 0) {
//             fullPath.push(straightEnd);
//           } else {
//             fullPath.push(straightStart, straightEnd);
//           }

//           totalDistance += calculateHaversineDistance(
//             a.position.lat,
//             a.position.lng,
//             b.position.lat,
//             b.position.lng
//           );
//         }
//       }

//       if (!fullPath.length) {
//         return { success: false };
//       }

//       console.log(
//         `🎯 Full trek complete: ${formatDistance(totalDistance)}, ${apiCalls} API calls, ${failedSegments} fallbacks`
//       );

//       return {
//         success: true,
//         path: fullPath,
//         distance: totalDistance,
//         duration: totalDuration,
//         failedSegments,
//         apiCalls,
//       };
//     },
//     [routeTwoPoints]
//   );

//   return {
//     mapContainerRef,
//     mapInstanceRef,
//     mapReady,
//     mapError,
//     mapType,
//     setMapType,
//     routeInfo,
//     setRouteInfo,
//     routeSegmentInfo,
//     setRouteSegmentInfo,
//     directionsStatus,
//     setDirectionsStatus,
//     drawingDirections,
//     setDrawingDirections,
//     clearOverlays,
//     addMarkers,
//     drawPolyline,
//     fitBounds,
//     generateRoute,
//     skipAcclimatizationDays,
//     baseRoutePolylineRef,  // ✅ ADD THIS
//   segmentPolylineRef,    
//   };
// };
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