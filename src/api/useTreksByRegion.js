// api/useTreksByRegion.js
import { useState, useEffect } from "react";
import { fetchTreksByRegion } from "../api/regionService";

export const useTreksByRegion = (regionSlug) => {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTreks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTreksByRegion(regionSlug);
        setTreks(data);
      } catch (err) {
        console.error(`Error loading ${regionSlug} treks:`, err);
        setError(err.message || `Failed to load ${regionSlug} treks`);
      } finally {
        setLoading(false);
      }
    };

    loadTreks();
  }, [regionSlug]);

  return { treks, loading, error };
};