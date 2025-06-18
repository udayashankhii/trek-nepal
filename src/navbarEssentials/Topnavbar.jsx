import React from "react";
import { Link } from "react-router-dom";

export default function TopBar() {
  return (
    <div className="bg-[#062c5b] text-white text-sm py-2 px-4 flex justify-between items-center">
      <span>
        Free Consultation:
        <a href="tel:+9779801000000" className="underline hover:text-yellow-100 ml-1">
          +977 9801-000000
        </a>
      </span>
      <div className="flex items-center gap-2">
        <span>Best Treks for 2025!</span>
        <Link
          to="/tourindex"
          className="text-sm bg-white text-yellow-600 px-3 py-1 rounded-full hover:bg-yellow-100 transition font-medium"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}
