// src/util/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // scroll instantly to top on a new route
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}
