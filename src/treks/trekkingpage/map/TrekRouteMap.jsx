import React, { useEffect, useMemo, useRef, useState } from "react";

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-js";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

const loadGoogleMaps = (apiKey) => {
  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key missing"));
  }

  if (window.google && window.google.maps) {
    return Promise.resolve(window.google);
  }

  const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", () => resolve(window.google));
      existingScript.addEventListener("error", () =>
        reject(new Error("Failed to load Google Maps script"))
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=marker&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });
};

const isValidNumber = (value) =>
  typeof value === "number" && !Number.isNaN(value);

export default function TrekRouteMap({
  itinerary = [],
  trekName = "Trek",
  fallbackMapImage,
  routeGeojsonUrl,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const baseRoutePolylineRef = useRef(null);
  const segmentPolylineRef = useRef(null);
  const directionsRendererRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState("all");
  const [mapError, setMapError] = useState("");
  const [mapType, setMapType] = useState("terrain");
  const [routeInfo, setRouteInfo] = useState(null);
  const [directionsStatus, setDirectionsStatus] = useState("");
  const [drawingDirections, setDrawingDirections] = useState(false);
  const [routePath, setRoutePath] = useState([]);
  const [routeSource, setRouteSource] = useState("");
  const [routeLoadError, setRouteLoadError] = useState("");
  const [routeSegmentInfo, setRouteSegmentInfo] = useState("");

  const toRadians = (value) => (value * Math.PI) / 180;
  const computeDistanceMeters = (from, to) => {
    if (!from || !to) return 0;
    const earthRadius = 6371000;
    const lat1 = toRadians(from.lat);
    const lat2 = toRadians(to.lat);
    const dLat = lat2 - lat1;
    const dLng = toRadians(to.lng - from.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  };
  const computePathDistance = (path) => {
    if (!Array.isArray(path) || path.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < path.length; i += 1) {
      const prev = path[i - 1];
      const curr = path[i];
      total += computeDistanceMeters(prev, curr);
    }
    return total;
  };

  const findClosestIndex = (path, point) => {
    if (!Array.isArray(path) || path.length === 0 || !point) return -1;
    let bestIndex = 0;
    let bestDist = Infinity;
    for (let i = 0; i < path.length; i += 1) {
      const candidate = path[i];
      const dist = computeDistanceMeters(candidate, point);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    }
    return bestIndex;
  };

  const formatDistance = (meters) => {
    if (!Number.isFinite(meters)) return "";
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  };

  const formatDuration = (seconds) => {
    if (!Number.isFinite(seconds)) return "";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  useEffect(() => {
    let active = true;
    if (!routeGeojsonUrl) {
      setRoutePath([]);
      setRouteSource("");
      setRouteLoadError("");
      return undefined;
    }

    const loadRoute = async () => {
      try {
        setRouteLoadError("");
        const response = await fetch(routeGeojsonUrl);
        if (!response.ok) {
          throw new Error("Unable to load route file.");
        }
        const data = await response.json();
        if (!active) return;

        let coordinates = [];
        if (data?.type === "FeatureCollection") {
          const feature = data.features?.find(
            (f) => f?.geometry?.type === "LineString"
          );
          coordinates = feature?.geometry?.coordinates || [];
        } else if (data?.type === "Feature") {
          coordinates = data.geometry?.coordinates || [];
        } else if (data?.type === "LineString") {
          coordinates = data.coordinates || [];
        }

        const path = coordinates
          .map((coord) => {
            const [lng, lat] = coord || [];
            if (!isValidNumber(lat) || !isValidNumber(lng)) return null;
            return { lat, lng };
          })
          .filter(Boolean);

        setRoutePath(path);
        setRouteSource(path.length > 1 ? "gpx" : "");
        if (path.length > 1) {
          const distance = computePathDistance(path);
          setRouteInfo({
            distanceText: formatDistance(distance),
          });
        }
        setRouteSegmentInfo("");
      } catch (error) {
        if (!active) return;
        setRoutePath([]);
        setRouteSource("");
        setRouteLoadError(error.message || "Failed to load route file.");
        setRouteSegmentInfo("");
      }
    };

    loadRoute();
    return () => {
      active = false;
    };
  }, [routeGeojsonUrl]);

  const points = useMemo(() => {
    return (itinerary || [])
      .map((day, index) => {
        const lat = Number(day.latitude);
        const lng = Number(day.longitude);
        if (!isValidNumber(lat) || !isValidNumber(lng)) return null;
        return {
          index,
          day: day.day ?? index + 1,
          title: day.title || day.place_name || `Day ${day.day ?? index + 1}`,
          placeName: day.place_name || "",
          position: { lat, lng },
        };
      })
      .filter(Boolean);
  }, [itinerary]);

  const mapPoints = useMemo(() => {
    if (routePath.length < 2) return points;
    const maxDistanceMeters = 3000;
    return points
      .map((point) => {
        const closestIndex = findClosestIndex(routePath, point.position);
        const closestPoint = routePath[closestIndex];
        const distanceToRoute = computeDistanceMeters(
          closestPoint,
          point.position
        );
        return {
          ...point,
          closestIndex,
          distanceToRoute,
        };
      })
      .filter((point) => point.distanceToRoute <= maxDistanceMeters);
  }, [points, routePath]);

  const selectedPoints = useMemo(() => {
    if (selectedDayIndex === "all") return mapPoints;
    const currentIndex = mapPoints.findIndex(
      (point) => point.index === selectedDayIndex
    );
    if (currentIndex === -1) return [];
    return mapPoints.slice(currentIndex, currentIndex + 2);
  }, [mapPoints, selectedDayIndex]);

  const mapsUrl = useMemo(() => {
    if (selectedPoints.length === 0) return "";
    if (selectedPoints.length === 1) {
      const { lat, lng } = selectedPoints[0].position;
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }
    const origin = selectedPoints[0].position;
    const destination = selectedPoints[selectedPoints.length - 1].position;
    const waypoints = selectedPoints.slice(1, -1).map((point) => {
      const { lat, lng } = point.position;
      return `${lat},${lng}`;
    });
    const params = new URLSearchParams({
      api: "1",
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      travelmode: "walking",
    });
    if (waypoints.length > 0) {
      params.set("waypoints", waypoints.join("|"));
    }
    return `https://www.google.com/maps/dir/?${params.toString()}`;
  }, [selectedPoints]);

  useEffect(() => {
    let mounted = true;

    if (!GOOGLE_MAPS_API_KEY) {
      setMapError("Google Maps API key is not configured.");
      return undefined;
    }

    loadGoogleMaps(GOOGLE_MAPS_API_KEY)
      .then((google) => {
        if (!mounted) return;
        if (!google?.maps?.Map) {
          throw new Error(
            "Google Maps failed to initialize. Check API activation, billing, and key restrictions."
          );
        }
        setMapReady(true);
      })
      .catch((error) => {
        if (!mounted) return;
        setMapError(error.message || "Unable to load Google Maps.");
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const mapContainer = mapContainerRef.current;
    if (!mapReady || !mapContainer) return;
    if (!(mapContainer instanceof Element) || !mapContainer.isConnected) return;
    if (mapInstanceRef.current) return;

    mapInstanceRef.current = new window.google.maps.Map(mapContainer, {
      center: { lat: 27.7172, lng: 85.324 },
      zoom: 7,
      minZoom: 5,
      maxZoom: 16,
      mapTypeControl: false,
      zoomControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      clickableIcons: false,
      gestureHandling: "greedy",
      mapTypeId: mapType,
      mapId: GOOGLE_MAPS_MAP_ID || undefined,
    });
  }, [mapReady]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;
    map.setMapTypeId(mapType);
  }, [mapType, mapReady]);

  const clearMapOverlays = () => {
    markersRef.current.forEach((marker) => {
      if (marker?.setMap) {
        marker.setMap(null);
      } else if ("map" in marker) {
        marker.map = null;
      }
    });
    markersRef.current = [];

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (baseRoutePolylineRef.current) {
      baseRoutePolylineRef.current.setMap(null);
      baseRoutePolylineRef.current = null;
    }

    if (segmentPolylineRef.current) {
      segmentPolylineRef.current.setMap(null);
      segmentPolylineRef.current = null;
    }

    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
  };

  const addMarkers = (map, routePoints) => {
    const canUseAdvancedMarkers = Boolean(GOOGLE_MAPS_MAP_ID);
    const AdvancedMarker = canUseAdvancedMarkers
      ? window.google?.maps?.marker?.AdvancedMarkerElement
      : null;

    markersRef.current = routePoints.map((point) => {
      const title = point.placeName || point.title || `Day ${point.day}`;
      if (AdvancedMarker) {
        const content = document.createElement("div");
        content.textContent = `${point.day}`;
        content.title = title;
        content.style.background = "#1d4ed8";
        content.style.borderRadius = "9999px";
        content.style.color = "#fff";
        content.style.fontSize = "12px";
        content.style.fontWeight = "600";
        content.style.padding = "4px 8px";
        content.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
        return new AdvancedMarker({
          map,
          position: point.position,
          title,
          content,
        });
      }

      return new window.google.maps.Marker({
        position: point.position,
        map,
        label: `${point.day}`,
        title,
      });
    });
  };

  const fitBounds = (map, routePoints) => {
    if (routePoints.length === 1) {
      map.setCenter(routePoints[0].position);
      map.setZoom(10);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    routePoints.forEach((point) => bounds.extend(point.position));
    map.fitBounds(bounds);
  };

  const drawPolyline = (map, routePoints) => {
    polylineRef.current = new window.google.maps.Polyline({
      path: routePoints.map((point) => point.position),
      geodesic: true,
      strokeColor: "#1d4ed8",
      strokeOpacity: 0.9,
      strokeWeight: 3,
    });
    polylineRef.current.setMap(map);
  };

  const drawRoutePolyline = (map, path) => {
    baseRoutePolylineRef.current = new window.google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#2563eb",
      strokeOpacity: 0.55,
      strokeWeight: 4,
    });
    baseRoutePolylineRef.current.setMap(map);
  };

  const drawRouteSegment = (map, path) => {
    segmentPolylineRef.current = new window.google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#1d4ed8",
      strokeOpacity: 0.95,
      strokeWeight: 5,
    });
    segmentPolylineRef.current.setMap(map);
  };

  const fitBoundsForPath = (map, path) => {
    if (path.length === 1) {
      map.setCenter(path[0]);
      map.setZoom(10);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    path.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds);
  };

  const drawDirections = (map, routePoints) => {
    if (routePoints.length < 2) return false;
    if (routePoints.length > 23) return false;

    const service = new window.google.maps.DirectionsService();
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      preserveViewport: false,
      polylineOptions: {
        strokeColor: "#1d4ed8",
        strokeOpacity: 0.9,
        strokeWeight: 3,
      },
    });

    const origin = routePoints[0].position;
    const destination = routePoints[routePoints.length - 1].position;
    const waypoints = routePoints.slice(1, -1).map((point) => ({
      location: point.position,
      stopover: true,
    }));

    return new Promise((resolve) => {
      service.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: window.google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === "OK") {
            directionsRendererRef.current.setDirections(result);
            const legs = result?.routes?.[0]?.legs || [];
            const totalDistance = legs.reduce(
              (sum, leg) => sum + (leg.distance?.value || 0),
              0
            );
            const totalDuration = legs.reduce(
              (sum, leg) => sum + (leg.duration?.value || 0),
              0
            );
            resolve({
              drawn: true,
              info: {
                distanceText: formatDistance(totalDistance),
                durationText: formatDuration(totalDuration),
              },
            });
          } else {
            resolve({ drawn: false, status });
          }
        }
      );
    });
  };

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    clearMapOverlays();
    if (routePath.length === 0) {
      setRouteInfo(null);
    }
    setDirectionsStatus("");
    setDrawingDirections(false);

    if (mapPoints.length === 0) return;

    const routePoints = selectedPoints;

    if (routePoints.length === 0) return;

    addMarkers(map, routePoints);
    if (routePath.length > 1) {
      if (selectedDayIndex === "all") {
        drawRoutePolyline(map, routePath);
        fitBoundsForPath(map, routePath);
        setRouteSegmentInfo("");
      } else {
        const currentIndex = mapPoints.findIndex(
          (point) => point.index === selectedDayIndex
        );
        const currentPoint = mapPoints[currentIndex];
        const nextPoint = mapPoints[currentIndex + 1];
        if (currentPoint) {
          const startIndex =
            Number.isFinite(currentPoint.closestIndex) &&
            currentPoint.closestIndex >= 0
              ? currentPoint.closestIndex
              : findClosestIndex(routePath, currentPoint.position);
          const endIndex =
            nextPoint && Number.isFinite(nextPoint.closestIndex)
              ? nextPoint.closestIndex
              : nextPoint && nextPoint.position
                ? findClosestIndex(routePath, nextPoint.position)
                : startIndex;
          const from = Math.min(startIndex, endIndex);
          const to = Math.max(startIndex, endIndex);
          const segment = routePath.slice(from, to + 1);
          if (segment.length > 1) {
            drawRoutePolyline(map, routePath);
            drawRouteSegment(map, segment);
            fitBoundsForPath(map, segment);
            const distance = computePathDistance(segment);
            setRouteSegmentInfo(
              `Day ${currentPoint.day} segment · ${formatDistance(distance)}`
            );
          } else {
            drawRoutePolyline(map, routePath);
            fitBounds(map, routePoints);
            setRouteSegmentInfo("");
          }
        }
      }
      setDirectionsStatus("");
      return;
    }

    fitBounds(map, routePoints);

    const drawFallbackPolyline = () => {
      if (routePoints.length > 1) {
        drawPolyline(map, routePoints);
      }
    };

    const maybeDrawDirections = async () => {
      setDrawingDirections(true);
      const result = await drawDirections(map, routePoints);
      setDrawingDirections(false);
      if (!result?.drawn) {
        drawFallbackPolyline();
        setDirectionsStatus(result?.status || "Directions unavailable");
        return;
      }
      setRouteInfo(result.info || null);
    };

    if (routePoints.length > 1) {
      maybeDrawDirections();
    }
  }, [mapReady, mapPoints, selectedDayIndex, selectedPoints, routePath]);

  if (!GOOGLE_MAPS_API_KEY || mapError) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
        <p className="text-sm font-semibold text-gray-800">Map unavailable</p>
        <p className="mt-2 text-sm text-gray-600">
          {mapError || "Google Maps API key is missing."}
        </p>
        {fallbackMapImage && (
          <img
            src={fallbackMapImage}
            alt={`Map for ${trekName}`}
            className="mt-4 max-w-full rounded-xl shadow-md"
          />
        )}
      </div>
    );
  }

  if (mapPoints.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
        <p className="text-sm text-gray-600">
          Add latitude and longitude to itinerary days to render the trek route.
        </p>
        {fallbackMapImage && (
          <img
            src={fallbackMapImage}
            alt={`Map for ${trekName}`}
            className="mt-4 max-w-full rounded-xl shadow-md"
          />
        )}
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            Trek Route Map
          </h2>
          <p className="text-sm text-gray-500">
            View the day-by-day route for {trekName}.
          </p>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
            Route line
            <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
            Day markers
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
              {mapPoints.length} day points
            </span>
            {routeSource === "gpx" && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                GPX trail route
              </span>
            )}
            {routeSegmentInfo && (
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
                {routeSegmentInfo}
              </span>
            )}
            {routeInfo?.distanceText && (
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
                Distance: {routeInfo.distanceText}
              </span>
            )}
            {routeInfo?.durationText && (
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
                Est. time: {routeInfo.durationText}
              </span>
            )}
            {drawingDirections && (
              <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                Calculating walking route...
              </span>
            )}
            {directionsStatus && routeSource !== "gpx" && (
              <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-500">
                Using straight-line route (Directions unavailable)
              </span>
            )}
            {routeLoadError && (
              <span className="rounded-full bg-rose-50 px-3 py-1 font-semibold text-rose-600">
                Route file missing
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (mapsUrl) window.open(mapsUrl, "_blank", "noopener,noreferrer");
            }}
            disabled={!mapsUrl}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              mapsUrl
                ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            }`}
          >
            Open in Google Maps
          </button>
          <button
            type="button"
            onClick={() => setMapType("terrain")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              mapType === "terrain"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            Terrain
          </button>
          <button
            type="button"
            onClick={() => setMapType("satellite")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              mapType === "satellite"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => {
              const map = mapInstanceRef.current;
              if (!map || selectedPoints.length === 0) return;
              fitBounds(map, selectedPoints);
            }}
            className="px-3 py-1.5 rounded-full text-xs font-semibold border bg-white text-gray-600 border-gray-300 hover:border-gray-400"
          >
            Reset View
          </button>
          <button
            type="button"
            onClick={() => setSelectedDayIndex("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              selectedDayIndex === "all"
                ? "bg-blue-700 text-white border-blue-700"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            Full Trek
          </button>
          {mapPoints.map((point) => (
            <button
              key={point.index}
              type="button"
              onClick={() => setSelectedDayIndex(point.index)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                selectedDayIndex === point.index
                  ? "bg-blue-700 text-white border-blue-700"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
              }`}
            >
              Day {point.day}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={mapContainerRef}
        className="relative h-[360px] sm:h-[420px] md:h-[520px] w-full overflow-hidden rounded-xl border border-gray-200"
      >
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-center">
              <div className="mx-auto mb-3 h-8 w-8 rounded-full border-2 border-slate-300 border-t-blue-600" />
              <p className="text-sm font-semibold text-slate-700">Loading map</p>
              <p className="text-xs text-slate-500">Preparing your route...</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
