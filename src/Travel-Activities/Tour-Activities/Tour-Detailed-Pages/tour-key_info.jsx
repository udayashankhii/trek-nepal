import React from "react";
import KeyInfo from "../../../treks/trekkingpage/KeyInfo.jsx";

export default function TourKeyInfo({ tour }) {
  return (
    <KeyInfo
      data={{
        duration: tour.duration,
        difficulty: tour.difficulty,
        startPoint: tour.startPoint || tour.start_point,
        groupSize: tour.groupSize || tour.group_size,
        maxAltitude: tour.maxAltitude || tour.max_altitude,
        activity: tour.activity,
      }}
      rating={tour.rating}
      reviews={tour.reviews || tour.reviews_count || 0}
      reviewText={`${tour.reviews || tour.reviews_count || 0} review${
        (tour.reviews || tour.reviews_count || 0) !== 1 ? "s" : ""
      }`}
    />
  );
}
