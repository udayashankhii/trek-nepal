import React from "react";
import Itinerary from "../../../treks/trekkingpage/Itinerary.jsx";

export default function TourItinerary({ days }) {
  if (!days || days.length === 0) return null;
  return (
    <div id="itinerary">
      <Itinerary
        days={days.map((day) => ({
          day: day.day,
          title: day.title,
          description: day.description,
          duration: day.duration,
          distance: day.distance,
          meals: day.meals,
        }))}
        defaultExpanded={false}
        allowMultiple
      />
    </div>
  );
}
