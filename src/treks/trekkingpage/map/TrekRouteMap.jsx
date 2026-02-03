


import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouteMap } from "../../../hooks/map/useRouteMap";
import { MapControls } from "./MapControls";
import { RouteStatusBadges } from "./RouteStatusBadges";
import {
  isValidNumber,
  formatDistance,
  computePathDistance,
  validateNepaliLocation,
} from "../../../utils/mapHelpers";

/**
 * TREK ROUTE MAP - FIXED VERSION V3
 * ✅ isMounted flag prevents state updates after unmount
 * ✅ Proper cleanup on component unmount
 * ✅ Routes don't disappear on day switches
 * ✅ Memoized callbacks prevent infinite loops
 */

export default function TrekRouteMap({
  itinerary = [],
  trekName = "Trek",
  trekMetadata = {},
  onExportComplete,
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState("all");

  const {
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
  } = useRouteMap();

  /* ---------------------------------------------------------
   * 1️⃣ NORMALIZE ITINERARY POINTS
   * --------------------------------------------------------- */
  const allMapPoints = useMemo(() => {
    return (itinerary || [])
      .map((day, index) => {
        const lat = Number(day.latitude);
        const lng = Number(day.longitude);

        if (!isValidNumber(lat) || !isValidNumber(lng)) return null;
        if (!validateNepaliLocation(lat, lng)) return null;

        return {
          index,
          day: day.day ?? index + 1,
          title: day.title || day.place_name || `Day ${index + 1}`,
          position: { lat, lng },
          placeName: day.place_name,
        };
      })
      .filter(Boolean);
  }, [itinerary]);

  /* ---------------------------------------------------------
   * 2️⃣ SELECTED POINTS (removes acclimatization for routing)
   * --------------------------------------------------------- */
  const selectedPoints = useMemo(() => {
    if (selectedDayIndex === "all") {
      return skipAcclimatizationDays(allMapPoints);
    } else {
      const idx = allMapPoints.findIndex(
        (p) => p.index === Number(selectedDayIndex)
      );
      if (idx === -1) return [];
      return allMapPoints.slice(idx, idx + 2);
    }
  }, [selectedDayIndex, allMapPoints, skipAcclimatizationDays]);

  /* ---------------------------------------------------------
   * 3️⃣ MARKERS TO DISPLAY (includes all days)
   * --------------------------------------------------------- */
  const markersToDisplay = useMemo(() => {
    return selectedDayIndex === "all" ? allMapPoints : selectedPoints;
  }, [selectedDayIndex, allMapPoints, selectedPoints]);

  /* ---------------------------------------------------------
   * 4️⃣ GOOGLE MAPS URL
   * --------------------------------------------------------- */
  const mapsUrl = useMemo(() => {
    if (selectedPoints.length === 0) return "";

    if (selectedPoints.length === 1) {
      const { lat, lng } = selectedPoints[0].position;
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }

    const origin = `${selectedPoints[0].position.lat},${selectedPoints[0].position.lng}`;
    const dest =
      `${selectedPoints[selectedPoints.length - 1].position.lat},` +
      `${selectedPoints[selectedPoints.length - 1].position.lng}`;

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=walking`;
  }, [selectedPoints]);

  /* ---------------------------------------------------------
   * 5️⃣ MAIN MAP EFFECT - UNIFIED ROUTING (FIXED)
   * --------------------------------------------------------- */
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady || markersToDisplay.length === 0) return;

    // Track if component is still mounted
    let isMounted = true;

    const executeRouting = async () => {
      // Always add fresh markers
      addMarkers(map, markersToDisplay);

      // Reset status
      setRouteInfo(null);
      setRouteSegmentInfo("");
      setDirectionsStatus("");

      /* ============================
       * 🔥 FULL TREK MODE - STITCHED ROUTING
       * ============================ */
      if (selectedDayIndex === "all") {
        if (selectedPoints.length < 2) {
          if (!isMounted) return;
          console.warn("⚠️ Not enough points for full trek");
          fitBounds(map, markersToDisplay);
          return;
        }

  

        if (!isMounted) return;
        setDrawingDirections(true);
        setDirectionsStatus("🔄 Building complete trek route...");

        try {
          // Generate the complete stitched route
          const result = await generateRoute(map, selectedPoints);

          if (!isMounted) return;

          if (!result?.success || !result.path?.length) {
            // console.warn(
            //   "⚠️ Route generation failed, using straight-line fallback"
            // );

            // Fallback: Draw straight lines between all points
            const fallbackPath = markersToDisplay.map((p) => p.position);
            drawPolyline(map, fallbackPath, false);
            fitBounds(map, markersToDisplay);

            const distance = computePathDistance(fallbackPath);
            setRouteInfo({
              success: true,
              distanceText: formatDistance(distance),
              durationText: `${markersToDisplay.length} days trek`,
              path: fallbackPath,
            });
            setDirectionsStatus("⚠️ Using simplified route (API failed)");
            return;
          }

          // ✅ SUCCESS - Draw the complete stitched route
          console.log(
            `✅ Full trek route complete: ${result.path.length} points`
          );

          drawPolyline(map, result.path, false);
          fitBounds(map, result.path);

          const totalDist = computePathDistance(result.path);
          setRouteInfo({
            success: true,
            distanceText: formatDistance(totalDist),
            durationText: `${selectedPoints.length} days trek`,
            path: result.path,
          });

          // Show status based on routing quality
          if (result.failedSegments > 0) {
            setDirectionsStatus(
              // `⚠️ ${result.failedSegments} segment(s) using straight-line fallback`
            );
          } else {
            setDirectionsStatus("✅ Complete Google route generated");
          }
        } catch (err) {
          console.error("❌ Full trek routing failed:", err);

          if (!isMounted) return;

          // Emergency fallback
          const emergencyPath = markersToDisplay.map((p) => p.position);
          drawPolyline(map, emergencyPath, false);
          fitBounds(map, markersToDisplay);

          const distance = computePathDistance(emergencyPath);
          setRouteInfo({
            success: true,
            distanceText: formatDistance(distance),
            durationText: `${markersToDisplay.length} days trek`,
            path: emergencyPath,
          });
          setDirectionsStatus("❌ Routing error - using straight lines");
        } finally {
          if (isMounted) setDrawingDirections(false);
        }
      } else {
        /* ============================
         * 📍 DAY MODE - SINGLE SEGMENT
         * ============================ */
        if (selectedPoints.length < 2) {
          if (!isMounted) return;
          console.log(`⏭️ Acclimatization day at ${selectedPoints[0]?.title}`);
          fitBounds(map, markersToDisplay);
          setRouteSegmentInfo(
            `Day ${selectedPoints[0]?.day} · Rest/Acclimatization`
          );
          return;
        }

        // Check if same location (rest day)
        const isSameLocation =
          selectedPoints[0].position.lat === selectedPoints[1].position.lat &&
          selectedPoints[0].position.lng === selectedPoints[1].position.lng;

        if (isSameLocation) {
          if (!isMounted) return;
          console.log(`⏭️ Rest day at ${selectedPoints[0].title}`);
          fitBounds(map, markersToDisplay);
          setRouteSegmentInfo(
            `Day ${selectedPoints[0].day} · Rest/Acclimatization`
          );
          return;
        }

        if (!isMounted) return;
        setDrawingDirections(true);

 try {
  const result = await generateRoute(map, selectedPoints);

  if (!isMounted) return;

  if (!result?.success || !result.path?.length) {
    // Fallback for single day
    const fallback = selectedPoints.map((p) => p.position);
    drawPolyline(map, fallback, true, { strokeColor: "#f97316" }); // ✅ ORANGE
    fitBounds(map, fallback);

    const dist = computePathDistance(fallback);
    setRouteSegmentInfo(
      `Day ${selectedPoints[0].day} · ${formatDistance(dist)}`
    );
    setDirectionsStatus("⚠️ Direct trail (off-map)");
    return;
  }

  // Success - draw the routed path
  drawPolyline(map, result.path, true, { strokeColor: "#f97316" }); // ✅ ORANGE
  fitBounds(map, result.path);

  const dist = computePathDistance(result.path);
  setRouteSegmentInfo(
    `Day ${selectedPoints[0].day} · ${formatDistance(dist)}`
  );

          if (result.source === "straight_line_fallback") {
            setDirectionsStatus("⚠️ Direct trail (no Google route)");
          }
        } catch (err) {
          console.error("❌ Day route error:", err);
          if (isMounted) setDirectionsStatus("❌ Route unavailable");
        } finally {
          if (isMounted) setDrawingDirections(false);
        }
      }
    };

    executeRouting();

    // Cleanup function - prevents state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [
    mapReady,
    selectedPoints,
    selectedDayIndex,
    markersToDisplay,
    mapInstanceRef,
    addMarkers,
    drawPolyline,
    fitBounds,
    generateRoute,
    setRouteInfo,
    setRouteSegmentInfo,
    setDirectionsStatus,
    setDrawingDirections,
  ]);

  /* ---------------------------------------------------------
   * UI ERROR STATES
   * --------------------------------------------------------- */
  if (mapError) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-6 text-center">
        <p className="text-red-600 font-semibold text-lg">⚠️ Map unavailable</p>
        <p className="text-sm text-gray-600 mt-2">{mapError}</p>
        <p className="text-xs text-gray-500 mt-3">
          Check your internet connection and API key
        </p>
      </div>
    );
  }

  if (allMapPoints.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-yellow-200 p-6 text-center">
        <p className="text-yellow-700 font-semibold text-lg">
          📍 No route data
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Add latitude & longitude to itinerary days to display route
        </p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
      {/* Header + Status */}
      <div className="space-y-3 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trek Route Map</h2>
          <p className="text-sm text-gray-500 mt-1">
            {selectedDayIndex === "all"
              ? `Complete trek route for ${trekName} (${allMapPoints.length} days)`
              : `Day ${selectedPoints[0]?.day} segment of ${trekName}`}
          </p>
        </div>

        {/* Route Status Badges */}
        <RouteStatusBadges
          mapPointsCount={allMapPoints.length}
          routeSegmentInfo={routeSegmentInfo}
          routeInfo={routeInfo}
          drawingDirections={drawingDirections}
          directionsStatus={directionsStatus}
        />
      </div>

      {/* Map Controls */}
      <MapControls
        // mapType={mapType}
        setMapType={setMapType}
        selectedDayIndex={selectedDayIndex}
        setSelectedDayIndex={setSelectedDayIndex}
        mapPoints={allMapPoints}
        mapsUrl={mapsUrl}
        onResetView={() =>
          fitBounds(mapInstanceRef.current, markersToDisplay)
        }
        routeInfo={routeInfo}
        trekMetadata={trekMetadata}
        itinerary={itinerary}
        onExportComplete={onExportComplete}
      />

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="h-[400px] md:h-[550px] w-full rounded-lg border border-gray-200 bg-gray-50 shadow-sm overflow-hidden"
      />
    </section>
  );
}