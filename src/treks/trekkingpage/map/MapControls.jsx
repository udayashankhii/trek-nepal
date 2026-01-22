
import React, { useState } from "react";
import {
  MapPin,
  Map as MapIcon,
  Download,
  Share2,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

/**
 * MAP CONTROLS - FIXED VERSION
 * ✅ Buttons highlight in BLUE (not grey)
 * ✅ Proper state management
 * ✅ Full feature support
 * ✅ JavaScript only (no TypeScript syntax in JSX)
 */

export function MapControls({
  mapType,
  setMapType,
  selectedDayIndex,
  setSelectedDayIndex,
  mapPoints = [],
  mapsUrl,
  onResetView,
  routeInfo,
  trekMetadata = {},
  itinerary = [],
  onExportComplete,
}) {
  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Map type options
  const mapTypeOptions = ["roadmap", "terrain", "satellite"];

  // Handle day selection
  const handleDaySelect = (dayIndex) => {
    setSelectedDayIndex(dayIndex);
    setShowDayDropdown(false);
    console.log(
      `📍 Selected: ${dayIndex === "all" ? "Full Trek" : `Day ${dayIndex}`}`
    );
  };

  // Export route as GPX
  const handleExportGPX = async () => {
    if (!routeInfo?.path || routeInfo.path.length === 0) {
      onExportComplete?.({
        success: false,
        message: "❌ No route data to export",
      });
      return;
    }

    try {
      setExporting(true);

      // Generate GPX content
      const gpxContent = generateGPX(routeInfo.path, trekMetadata);

      // Create and download file
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:application/gpx+xml;charset=utf-8," +
          encodeURIComponent(gpxContent)
      );
      element.setAttribute(
        "download",
        `${trekMetadata.title || "trek"}-route.gpx`
      );
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      onExportComplete?.({
        success: true,
        message: `✅ Exported ${trekMetadata.title || "Trek"} route as GPX`,
      });

      console.log("✅ GPX export successful");
    } catch (err) {
      console.error("❌ Export failed:", err);
      onExportComplete?.({
        success: false,
        message:
          "❌ Export failed: " +
          (err instanceof Error ? err.message : "Unknown error"),
      });
    } finally {
      setExporting(false);
    }
  };

  // Export route as JSON
  const handleExportJSON = async () => {
    if (!routeInfo?.path || routeInfo.path.length === 0) {
      onExportComplete?.({
        success: false,
        message: "❌ No route data to export",
      });
      return;
    }

    try {
      setExporting(true);

      const exportData = {
        trek: trekMetadata,
        route: {
          points: routeInfo.path,
          distance: routeInfo.distanceText,
          duration: routeInfo.durationText,
          pointCount: routeInfo.path.length,
        },
        exportDate: new Date().toISOString(),
      };

      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:application/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(exportData, null, 2))
      );
      element.setAttribute(
        "download",
        `${trekMetadata.title || "trek"}-route.json`
      );
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      onExportComplete?.({
        success: true,
        message: `✅ Exported ${trekMetadata.title || "Trek"} route as JSON`,
      });

      console.log("✅ JSON export successful");
    } catch (err) {
      console.error("❌ Export failed:", err);
      onExportComplete?.({
        success: false,
        message:
          "❌ Export failed: " +
          (err instanceof Error ? err.message : "Unknown error"),
      });
    } finally {
      setExporting(false);
    }
  };

  // Open in Google Maps
  const handleOpenMaps = () => {
    if (!mapsUrl) {
      onExportComplete?.({
        success: false,
        message: "❌ No route to open in Google Maps",
      });
      return;
    }
    window.open(mapsUrl, "_blank");
    console.log("🗺️ Opened in Google Maps");
  };

  // Get map type icon
  const getMapTypeIcon = (type) => {
    switch (type) {
      case "roadmap":
        return <MapIcon className="w-4 h-4 inline mr-1" />;
      case "terrain":
        return "🏔️";
      case "satellite":
        return "🛰️";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-3">
      {/* First Row: Map Type + Day Selector + Reset */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Map Type Selector */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {mapTypeOptions.map((type) => (
            <button
              key={type}
              onClick={() => setMapType(type)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                mapType === type
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              title={`Switch to ${type} view`}
            >
              {getMapTypeIcon(type)}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Day Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDayDropdown(!showDayDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            {selectedDayIndex === "all" ? "Full Trek" : `Day ${selectedDayIndex}`}
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {showDayDropdown && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
              <button
                onClick={() => handleDaySelect("all")}
                className={`w-full text-left px-4 py-2 text-sm ${
                  selectedDayIndex === "all"
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Full Trek
              </button>
{mapPoints.map((point) => (
  <button
    key={point.index}
    onClick={() => handleDaySelect(String(point.day))} // use point.day instead of point.index
    className={`w-full text-left px-4 py-2 text-sm border-t border-gray-200 ${
      selectedDayIndex === String(point.day)
        ? "bg-blue-50 text-blue-700 font-semibold"
        : "text-gray-700 hover:bg-gray-50"
    }`}
  >
    Day {point.day}: {point.title}
  </button>
))}

            </div>
          )}
        </div>

        {/* Reset View Button */}
        <button
          onClick={() => {
            onResetView?.();
            console.log("🔄 Map view reset");
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 transition-colors"
          title="Reset map view to show all points"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Second Row: Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Open in Google Maps */}
        <button
          onClick={handleOpenMaps}
          className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={!mapsUrl}
        >
          <MapIcon className="w-4 h-4" />
          Open in Google Maps
        </button>

        {/* Share Button */}
        <button
          onClick={() => {
            if (navigator.share && mapsUrl) {
              navigator.share({
                title: trekMetadata.title || "Trek",
                text: "Check out this trek route!",
                url: mapsUrl,
              });
            } else if (mapsUrl) {
              navigator.clipboard.writeText(mapsUrl);
              onExportComplete?.({
                success: true,
                message: "✅ Route link copied to clipboard",
              });
            }
          }}
          className="flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
          disabled={!mapsUrl}
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>

        {/* Export Menu */}
        <div className="relative group">
          <button
            className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
            disabled={exporting || !routeInfo?.path?.length}
          >
            <Download className="w-4 h-4" />
            Export
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Export Dropdown */}
          <div className="absolute right-0 mt-0 w-48 bg-white border border-gray-300 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            <button
              onClick={handleExportGPX}
              disabled={exporting || !routeInfo?.path?.length}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium border-b border-gray-200 disabled:opacity-50"
            >
              📍 Export as GPX
            </button>
            <button
              onClick={handleExportJSON}
              disabled={exporting || !routeInfo?.path?.length}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium disabled:opacity-50"
            >
              📄 Export as JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Generate GPX XML format for route
 * Compatible with: Google Maps, Strava, AllTrails, hiking apps
 */
function generateGPX(path, trekMetadata) {
  const waypoints = path
    .map(
      (point, index) => `
    <trkpt lat="${point.lat}" lon="${point.lng}">
      <ele>0</ele>
      <time>${new Date().toISOString()}</time>
      <name>Point ${index + 1}</name>
    </trkpt>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="EverTrek Nepal" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${trekMetadata.title || "Trek Route"}</name>
    <desc>Trek route exported from EverTrek Nepal
Region: ${trekMetadata.region_name || "Nepal"}
Duration: ${trekMetadata.duration || "Unknown"}
Difficulty: ${trekMetadata.trip_grade || "Unknown"}
Max Altitude: ${trekMetadata.max_altitude || "Unknown"} m
    </desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>${trekMetadata.title || "Trek Route"}</name>
    <trkseg>
${waypoints}
    </trkseg>
  </trk>
</gpx>`;
}

export default MapControls;