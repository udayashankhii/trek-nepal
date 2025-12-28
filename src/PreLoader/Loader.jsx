// DataPreloader.jsx
import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import { fetchAllTreks } from "../api/trekService";

export default function DataPreloader() {
  // Preload all treks
  useSWR("/treks/", fetchAllTreks, { revalidateOnMount: true });

  // Preload regions

  return null; // no UI
}
