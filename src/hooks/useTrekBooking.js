// src/hooks/useTrekBooking.js
import { useEffect, useState, useRef, useCallback } from "react";
import { getBookingQuote } from "../api/bookingServices";
import { fetchTrekBookingData } from "../api/trekService.js";

export function useTrekBooking(trekSlug, partySize = 1) {
  const [data, setData] = useState(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quoteError, setQuoteError] = useState(null);

  const hasFetchedDataRef = useRef(false);
  const hasFetchedQuoteRef = useRef(false);
  const abortControllerRef = useRef(null);

  // ✅ Fetch trek booking data
  useEffect(() => {
    if (!trekSlug || hasFetchedDataRef.current) return;
    hasFetchedDataRef.current = true;

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setLoading(true);
    setError(null);

    fetchTrekBookingData(trekSlug, { signal })
      .then((result) => {
        if (!signal.aborted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!signal.aborted) {
          console.error("Trek booking data error:", err);
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [trekSlug]);

  // ✅ Fetch quote separately (optional, non-blocking)
  const fetchQuote = useCallback(async () => {
    if (!trekSlug || hasFetchedQuoteRef.current) return;
    hasFetchedQuoteRef.current = true;

    const quoteController = new AbortController();
    
    try {
      setQuoteLoading(true);
      setQuoteError(null);

      const quoteData = await getBookingQuote(
        { trekSlug, partySize },
        true,
        { signal: quoteController.signal }
      );

      if (!quoteController.signal.aborted) {
        setQuote(quoteData);
        setQuoteLoading(false);
      }
    } catch (err) {
      if (!quoteController.signal.aborted) {
        // ✅ Don't log as error - quote is optional
        console.info("ℹ️ Quote unavailable (using base pricing):", err.message);
        setQuoteError(err.message);
        setQuoteLoading(false);
      }
    }

    return () => quoteController.abort();
  }, [trekSlug, partySize]);

  useEffect(() => {
    if (data && trekSlug) {
      fetchQuote();
    }
  }, [data, trekSlug, fetchQuote]);

  return {
    data,
    quote,
    loading,
    quoteLoading,
    error,
    quoteError,
  };
}
