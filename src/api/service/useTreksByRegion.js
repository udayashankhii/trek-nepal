// api/useTreksByRegion.js
import { useState, useEffect } from "react";
import { fetchTreksByRegion } from "./regionService";
import { apiGet } from "./helper";

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
            if (trek?.booking_card || trek?.price || trek?.base_price) {
              return trek;
            }

            try {
              const bookingCard = await apiGet(
                `treks/${trek.region || regionSlug}/${trek.slug}/booking-card/`,
                {},
                true,
                { cacheTTL: 10 * 60 * 1000 }
              );

              return {
                ...trek,
                booking_card: bookingCard,
                price: bookingCard?.base_price,
              };
            } catch {
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
