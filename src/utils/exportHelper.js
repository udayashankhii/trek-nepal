import { computePathDistance, computeDistanceMeters, findClosestIndex } from "./mapHelpers";

/**
 * EXPORT LIBRARY FOR TREK ROUTES
 * Handles JSON, GPX, GeoJSON, and KML formats with full metadata
 */

// ============================================================================
// 1. JSON EXPORT - Full trek data with segments and statistics
// ============================================================================

export const convertRouteToJSON = (routeData, itinerary, trekMetadata) => {
  if (!routeData?.success || !routeData.path) {
    throw new Error("Route generation failed - cannot export");
  }

  const validWaypoints = itinerary.filter(
    (day) =>
      Number.isFinite(Number(day.latitude)) &&
      Number.isFinite(Number(day.longitude))
  );

  const segments = generateSegments(validWaypoints, routeData.path);

  return {
    metadata: {
      name: trekMetadata.title || "Trek",
      slug: trekMetadata.slug || "",
      region: trekMetadata.region || "",
      duration: trekMetadata.duration || "",
      difficulty: trekMetadata.trip_grade || "",
      version: "1.0",
      exportedAt: new Date().toISOString(),
      exportedFrom: "EverTrek Nepal",
    },

    statistics: {
      totalDistance: {
        meters: Math.round(routeData.distance),
        kilometers: (routeData.distance / 1000).toFixed(2),
        miles: (routeData.distance / 1609.34).toFixed(2),
      },
      estimatedDuration: {
        seconds: Math.round(routeData.duration),
        hours: Math.round(routeData.duration / 3600),
        days: itinerary.length,
        formatted: formatDuration(routeData.duration),
      },
      elevationData: {
        startAltitude: itinerary?.altitude || "N/A",
        maxAltitude: trekMetadata.max_altitude || "N/A",
        endAltitude: itinerary[itinerary.length - 1]?.altitude || "N/A",
      },
      qualityMetrics: {
        routePointsCount: routeData.path.length,
        failedSegments: routeData.failedSegments || 0,
        routeAccuracy: routeData.failedSegments ? "partial" : "full",
      },
    },

    waypoints: validWaypoints.map((day, idx) => ({
      id: idx + 1,
      day: day.day ?? idx + 1,
      title: day.title || "",
      placeName: day.place_name || "",
      description: day.description || "",
      coordinates: {
        latitude: Number(day.latitude),
        longitude: Number(day.longitude),
      },
      altitude: day.altitude || null,
      duration: day.duration || null,
      distance: day.distance || null,
      accommodation: day.accommodation || null,
      meals: day.meals || null,
    })),

    route: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: routeData.path.map((p) => [p.lng, p.lat]),
          },
          properties: {
            name: `${trekMetadata.title} - Full Route`,
            distance: Math.round(routeData.distance),
            duration: routeData.duration,
          },
        },
      ],
    },

    segments: segments.map((seg, idx) => ({
      id: idx + 1,
      day: seg.day,
      from: seg.from,
      to: seg.to,
      distance: {
        meters: Math.round(seg.distance),
        kilometers: (seg.distance / 1000).toFixed(2),
      },
      coordinates: seg.coordinates.map((p) => ({
        latitude: p.lat,
        longitude: p.lng,
      })),
    })),

    exportInfo: {
      format: "JSON",
      compression: "none",
      encoding: "UTF-8",
      geoJsonCompatible: true,
      compatibleApps: [
        "Google Maps",
        "Mapbox",
        "AllTrails",
        "Garmin BaseCamp",
        "CalTopo",
      ],
    },
  };
};

// ============================================================================
// 2. GPX EXPORT - Standard format for GPS devices
// ============================================================================

export const convertRouteToGPX = (routeData, itinerary, trekMetadata) => {
  if (!routeData?.success || !routeData.path) {
    throw new Error("Route generation failed - cannot export");
  }

  const validWaypoints = itinerary.filter(
    (day) =>
      Number.isFinite(Number(day.latitude)) &&
      Number.isFinite(Number(day.longitude))
  );

  const waypointElements = validWaypoints
    .map(
      (day, idx) => `  <wpt lat="${Number(day.latitude).toFixed(6)}" lon="${Number(day.longitude).toFixed(6)}">
    <name>Day ${day.day || idx + 1}: ${sanitizeXML(day.place_name || day.title || "Stop")}</name>
    <desc>${sanitizeXML(day.title || "")}</desc>
    <ele>${extractElevation(day.altitude)}</ele>
    <type>${day.place_name || "Waypoint"}</type>
  </wpt>`
    )
    .join("\n");

  const trackpoints = routeData.path
    .map(
      (point, idx) => `    <trkpt lat="${point.lat.toFixed(6)}" lon="${point.lng.toFixed(6)}">
      <ele>${extractElevation(point.elevation || "0")}</ele>
      <time>${generateTimestamp(idx, routeData.path.length)}</time>
      <extensions>
        <speed>0</speed>
      </extensions>
    </trkpt>`
    )
    .join("\n");

  const segments = generateSegments(validWaypoints, routeData.path);
  const segmentElements = segments
    .map((seg, idx) => {
      const segmentPoints = seg.coordinates
        .map(
          (point) => `      <trkpt lat="${point.lat.toFixed(6)}" lon="${point.lng.toFixed(6)}">
        <ele>${extractElevation(point.elevation || "0")}</ele>
      </trkpt>`
        )
        .join("\n");

      return `    <trkseg name="Day ${seg.day}">
      <name>Day ${seg.day}: ${sanitizeXML(seg.from)} to ${sanitizeXML(seg.to)}</name>
${segmentPoints}
    </trkseg>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="EverTrek Nepal" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  
  <metadata>
    <name>${sanitizeXML(trekMetadata.title || "Trek")}</name>
    <desc>${sanitizeXML(trekMetadata.region_name || "")} | ${trekMetadata.duration || ""} | Difficulty: ${trekMetadata.trip_grade || "N/A"}</desc>
    <author>
      <name>EverTrek Nepal</name>
      <link href="https://evertrek.com" />
    </author>
    <copyright author="EverTrek Nepal">
      <year>2026</year>
      <license>https://evertrek.com/license</license>
    </copyright>
    <time>${new Date().toISOString()}</time>
    <keywords>trek, nepal, himalaya, ${sanitizeXML(trekMetadata.region || "")}</keywords>
    <bounds minlat="${getMinLat(validWaypoints)}" minlon="${getMinLng(validWaypoints)}" maxlat="${getMaxLat(validWaypoints)}" maxlon="${getMaxLng(validWaypoints)}" />
  </metadata>

  <!-- WAYPOINTS: Daily stops and key locations -->
${waypointElements}

  <!-- TRACK: Complete route -->
  <trk>
    <name>${sanitizeXML(trekMetadata.title || "Trek")} - Complete Route</name>
    <desc>${trekMetadata.region_name || ""}</desc>
    <type>Trekking</type>
    <trkseg>
${trackpoints}
    </trkseg>
  </trk>

  <!-- DAILY SEGMENTS: Routes for each day -->
  <trk>
    <name>${sanitizeXML(trekMetadata.title || "Trek")} - Daily Segments</name>
${segmentElements}
  </trk>

</gpx>`;
};

// ============================================================================
// 3. GEOJSON EXPORT - Web-friendly format for mapping libraries
// ============================================================================

export const convertRouteToGeoJSON = (routeData, itinerary, trekMetadata) => {
  if (!routeData?.success || !routeData.path) {
    throw new Error("Route generation failed - cannot export");
  }

  const validWaypoints = itinerary.filter(
    (day) =>
      Number.isFinite(Number(day.latitude)) &&
      Number.isFinite(Number(day.longitude))
  );

  const features = [];

  // Full route feature
  features.push({
    type: "Feature",
    id: "full-route",
    geometry: {
      type: "LineString",
      coordinates: routeData.path.map((p) => [p.lng, p.lat]),
    },
    properties: {
      name: `${trekMetadata.title} - Full Route`,
      description: `Complete trek route from ${validWaypoints?.place_name} to ${validWaypoints[validWaypoints.length - 1]?.place_name}`,
      distance: Math.round(routeData.distance),
      duration: routeData.duration,
      type: "route",
      style: {
        stroke: "#1d4ed8",
        strokeWidth: 3,
        strokeOpacity: 0.8,
      },
    },
  });

  // Waypoint features
  validWaypoints.forEach((day, idx) => {
    features.push({
      type: "Feature",
      id: `waypoint-${idx}`,
      geometry: {
        type: "Point",
        coordinates: [Number(day.longitude), Number(day.latitude)],
      },
      properties: {
        name: day.place_name || day.title || `Day ${day.day || idx + 1}`,
        day: day.day || idx + 1,
        description: day.title || "",
        altitude: day.altitude || null,
        accommodation: day.accommodation || null,
        type: "waypoint",
        style: {
          markerColor:
            idx === 0 ? "#10b981" : idx === validWaypoints.length - 1 ? "#ef4444" : "#3b82f6",
          markerSize: "medium",
          markerSymbol: idx === 0 ? "S" : idx === validWaypoints.length - 1 ? "E" : idx,
        },
      },
    });
  });

  // Daily segment features
  const segments = generateSegments(validWaypoints, routeData.path);
  segments.forEach((seg) => {
    features.push({
      type: "Feature",
      id: `segment-day-${seg.day}`,
      geometry: {
        type: "LineString",
        coordinates: seg.coordinates.map((p) => [p.lng, p.lat]),
      },
      properties: {
        name: `Day ${seg.day}: ${seg.from} → ${seg.to}`,
        day: seg.day,
        from: seg.from,
        to: seg.to,
        distance: Math.round(seg.distance),
        type: "segment",
        style: {
          stroke: "#f59e0b",
          strokeWidth: 2,
          strokeOpacity: 0.5,
        },
      },
    });
  });

  return {
    type: "FeatureCollection",
    name: trekMetadata.title || "Trek Route",
    features,
  };
};

// ============================================================================
// 4. KML EXPORT - For Google Earth
// ============================================================================

export const convertRouteToKML = (routeData, itinerary, trekMetadata) => {
  if (!routeData?.success || !routeData.path) {
    throw new Error("Route generation failed - cannot export");
  }

  const validWaypoints = itinerary.filter(
    (day) =>
      Number.isFinite(Number(day.latitude)) &&
      Number.isFinite(Number(day.longitude))
  );

  const placemarks = validWaypoints
    .map(
      (day, idx) => `
    <Placemark>
      <name>Day ${day.day || idx + 1}: ${sanitizeXML(day.place_name || day.title || "Stop")}</name>
      <description>${sanitizeXML(day.title || "")}</description>
      <Point>
        <coordinates>${Number(day.longitude).toFixed(6)},${Number(day.latitude).toFixed(6)},${extractElevation(day.altitude)}</coordinates>
      </Point>
    </Placemark>`
    )
    .join("\n");

  const routeCoordinates = routeData.path
    .map((p) => `${p.lng.toFixed(6)},${p.lat.toFixed(6)},0`)
    .join(" ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${sanitizeXML(trekMetadata.title || "Trek")}</name>
    <description>${sanitizeXML(trekMetadata.region_name || "")} | ${trekMetadata.duration || ""}</description>
    <Style id="routeStyle">
      <LineStyle>
        <color>ff1d4ed8</color>
        <width>3</width>
      </LineStyle>
    </Style>
    <Folder>
      <name>Daily Stops</name>
${placemarks}
    </Folder>
    <Placemark>
      <name>${sanitizeXML(trekMetadata.title || "Trek")} Route</name>
      <styleUrl>#routeStyle</styleUrl>
      <LineString>
        <coordinates>
${routeCoordinates}
        </coordinates>
      </LineString>
    </Placemark>
  </Document>
</kml>`;
};

// ============================================================================
// 5. HELPER FUNCTIONS
// ============================================================================

const generateSegments = (waypoints, fullPath) => {
  if (waypoints.length < 2 || fullPath.length < 2) return [];

  const segments = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const currentDay = waypoints[i];
    const nextDay = waypoints[i + 1];

    const startCoords = {
      lat: Number(currentDay.latitude),
      lng: Number(currentDay.longitude),
    };
    const endCoords = {
      lat: Number(nextDay.latitude),
      lng: Number(nextDay.longitude),
    };

    const startIdx = findClosestIndex(fullPath, startCoords);
    const endIdx = findClosestIndex(fullPath, endCoords);

    if (startIdx === -1 || endIdx === -1) continue;

    const from = Math.min(startIdx, endIdx);
    const to = Math.max(startIdx, endIdx);
    const segmentPath = fullPath.slice(from, to + 1);
    const segmentDistance = computePathDistance(segmentPath);

    segments.push({
      day: currentDay.day || i + 1,
      from: currentDay.place_name || currentDay.title || `Day ${i + 1}`,
      to: nextDay.place_name || nextDay.title || `Day ${i + 2}`,
      distance: segmentDistance,
      coordinates: segmentPath,
    });
  }

  return segments;
};

const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds)) return "0h";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

const extractElevation = (alt) => {
  if (!alt) return "0";
  if (typeof alt === "number") return alt.toString();
  const match = alt.toString().match(/\d+/);
  return match ? match : "0";
};

const sanitizeXML = (text) => {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const generateTimestamp = (index, total) => {
  const baseTime = new Date();
  const increment = (12 * 60 * 60 * 1000) / total;
  const pointTime = new Date(baseTime.getTime() + index * increment);
  return pointTime.toISOString();
};

const getMinLat = (waypoints) =>
  Math.min(...waypoints.map((w) => Number(w.latitude))).toFixed(6);
const getMaxLat = (waypoints) =>
  Math.max(...waypoints.map((w) => Number(w.latitude))).toFixed(6);
const getMinLng = (waypoints) =>
  Math.min(...waypoints.map((w) => Number(w.longitude))).toFixed(6);
const getMaxLng = (waypoints) =>
  Math.max(...waypoints.map((w) => Number(w.longitude))).toFixed(6);

// ============================================================================
// 6. DOWNLOAD & EXPORT FUNCTIONS
// ============================================================================

const downloadFile = (content, filename, mimeType = "text/plain") => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportTrekRoute = async (
  routeData,
  itinerary,
  trekMetadata,
  format = "json"
) => {
  try {
    const timestamp = new Date().toISOString().split("T");
    const safeName = (trekMetadata.title || "trek")
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase();

    let content, mimeType, filename;

    switch (format) {
      case "json":
        const jsonData = convertRouteToJSON(routeData, itinerary, trekMetadata);
        content = JSON.stringify(jsonData, null, 2);
        mimeType = "application/json";
        filename = `${safeName}-${timestamp}.json`;
        break;

      case "gpx":
        content = convertRouteToGPX(routeData, itinerary, trekMetadata);
        mimeType = "application/gpx+xml";
        filename = `${safeName}-${timestamp}.gpx`;
        break;

      case "geojson":
        const geoJsonData = convertRouteToGeoJSON(
          routeData,
          itinerary,
          trekMetadata
        );
        content = JSON.stringify(geoJsonData, null, 2);
        mimeType = "application/geo+json";
        filename = `${safeName}-${timestamp}.geojson`;
        break;

      case "kml":
        content = convertRouteToKML(routeData, itinerary, trekMetadata);
        mimeType = "application/vnd.google-earth.kml+xml";
        filename = `${safeName}-${timestamp}.kml`;
        break;

      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    downloadFile(content, filename, mimeType);

    return {
      success: true,
      message: `✓ Trek exported as ${format.toUpperCase()}`,
      filename,
      size: new Blob([content]).size,
    };
  } catch (error) {
    return {
      success: false,
      message: `✗ Export failed: ${error.message}`,
    };
  }
};

export const exportTrekRouteMultiple = async (
  routeData,
  itinerary,
  trekMetadata,
  formats = ["json", "gpx"]
) => {
  const results = [];

  for (const format of formats) {
    const result = await exportTrekRoute(
      routeData,
      itinerary,
      trekMetadata,
      format
    );
    results.push(result);
    // Stagger downloads
    await new Promise((r) => setTimeout(r, 500));
  }

  return {
    success: results.every((r) => r.success),
    message: `Exported ${results.filter((r) => r.success).length}/${results.length} formats`,
    results,
  };
};
