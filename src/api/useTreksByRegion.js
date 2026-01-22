// api/useTreksByRegion.js
import { useState, useEffect } from "react";
import { fetchTreksByRegion } from "../api/regionService";
import axiosInstance from "../api/axiosInstance";

export const useTreksByRegion = (regionSlug) => {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTreks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const trekList = await fetchTreksByRegion(regionSlug);
        
        // Fetch booking_card for each trek
        const treksWithPrices = await Promise.all(
          trekList.map(async (trek) => {
            try {
              const response = await axiosInstance.get(
                `treks/${trek.region || regionSlug}/${trek.slug}/booking-card/`
              );
              return {
                ...trek,
                booking_card: response.data,
                price: response.data?.base_price,
              };
            } catch (err) {
              console.warn(`No price for ${trek.slug}`);
              return trek;
            }
          })
        );
        
        setTreks(treksWithPrices);
      } catch (err) {
        console.error(`Error loading ${regionSlug} treks:`, err);
        setError(err.message || `Failed to load ${regionSlug} treks`);
      } finally {
        setLoading(false);
      }
    };

    if (regionSlug) {
      loadTreks();
    }
  }, [regionSlug]);

  return { treks, loading, error };
};
