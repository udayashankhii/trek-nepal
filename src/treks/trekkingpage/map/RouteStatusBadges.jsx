import React from "react";

export function RouteStatusBadges({
  mapPointsCount,
  routeSegmentInfo,
  routeInfo,
  drawingDirections,
  directionsStatus,
}) {
  return (
    <div className="mt-3 space-y-2">
      {/* Map points count */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-blue-700">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
          {mapPointsCount} {mapPointsCount === 1 ? "waypoint" : "waypoints"}
        </span>
      </div>

      {/* Loading state */}
      {drawingDirections && (
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-amber-700">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
            Generating route...
          </span>
        </div>
      )}

      {/* Route segment info (single day) */}
      {routeSegmentInfo && !drawingDirections && (
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-green-700">
            <span className="inline-block h-2 w-2 rounded-full bg-green-600" />
            {routeSegmentInfo}
          </span>
        </div>
      )}

      {/* Full route info */}
      {routeInfo && !drawingDirections && !routeSegmentInfo && (
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-green-700">
            <span className="inline-block h-2 w-2 rounded-full bg-green-600" />
            {routeInfo.distanceText}
            {routeInfo.durationText && ` • ${routeInfo.durationText}`}
          </span>
        </div>
      )}

      {/* Directions status (warnings/errors) */}
      {directionsStatus && (
        <div className="flex items-center gap-2 text-xs font-medium">
          {directionsStatus.startsWith("⚠️") ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-amber-700">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-600" />
              {directionsStatus.replace("⚠️  ", "")}
            </span>
          ) : directionsStatus.startsWith("❌") ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-red-700">
              <span className="inline-block h-2 w-2 rounded-full bg-red-600" />
              {directionsStatus.replace("❌ ", "")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-blue-700">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
              {directionsStatus}
            </span>
          )}
        </div>
      )}
    </div>
  );
}