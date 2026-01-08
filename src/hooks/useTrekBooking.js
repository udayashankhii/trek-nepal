import { useState, useEffect } from "react";
import { fetchTrekBookingData } from "../api/trekService";

/**
 * Custom hook to fetch and manage trek booking data
 * @param {string} trekId - Trek slug/ID
 * @returns {Object} { loading, error, data }
 */
export function useTrekBooking(trekId) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadTrekData() {
      if (!trekId) {
        setState({
          loading: false,
          error: "No trek ID provided",
          data: null,
        });
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await fetchTrekBookingData(trekId);

        if (isMounted) {
          setState({
            loading: false,
            error: null,
            data,
          });
        }
      } catch (err) {
        if (isMounted) {
          setState({
            loading: false,
            error: err.message || "Failed to load trek data",
            data: null,
          });
        }
      }
    }

    loadTrekData();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [trekId]);

  return state;
}
