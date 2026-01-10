// useRegionTreks.js
import { useState, useEffect } from "react";
import { fetchRegions } from "../api/regionService"; // create this API call

export const useRegions = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRegions()
      .then((data) => setRegions(data))
      .catch(() => setError("Failed to load regions"))
      .finally(() => setLoading(false));
  }, []);

  return { regions, loading, error };
};