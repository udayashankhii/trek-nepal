const GH_KEY = import.meta.env.VITE_GRAPHHOPPER_API_KEY;

export async function getHikingRoute(a, b) {
  if (!GH_KEY) throw new Error("GraphHopper key missing");

  const url =
    `https://graphhopper.com/api/1/route` +
    `?point=${a.lat},${a.lng}` +
    `&point=${b.lat},${b.lng}` +
    `&profile=hike` +
    `&points_encoded=false` +
    `&key=${GH_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.paths?.length) {
    throw new Error("No hiking route");
  }

  const path = data.paths[0].points.coordinates.map(
    ([lng, lat]) => ({ lat, lng })
  );

  return {
    path,
    distance: data.paths[0].distance,
    duration: data.paths[0].time,
    source: "graphhopper",
  };
}
