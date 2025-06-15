// src/pages/MustangTrekIndex.jsx
import React from 'react';

function MustangTrekIndex() {
  return (
    <div className="trek-index-page">
      <header className="trek-header mustang">
        <h1>Mustang Trekking Adventures</h1>
        <p>Experience the hidden kingdom of Mustang with its striking desert landscapes and rich Tibetan-influenced culture.</p>
      </header>

      <section className="trek-overview">
        <h2>Overview</h2>
        <p>
          The Mustang region (also known as Upper Mustang) offers a unique trekking experience 
          through ancient walled cities, dramatic eroded cliffs, and centuries-old monasteries. 
          Trekkers journey into a once-forbidden kingdom that showcases a rare blend of natural beauty and cultural heritage.
        </p>
      </section>

      <section className="trek-highlights">
        <h2>Highlights</h2>
        <ul>
          <li>Explore the ancient city of Lo Manthang, the capital of Upper Mustang.</li>
          <li>Marvel at red-rock cliffs and hidden caves along the Kali Gandaki valley.</li>
          <li>Experience the Tiji Festival and the rich Tibetan Buddhist culture of the region.</li>
        </ul>
      </section>

      {/* Additional sections (e.g., trek details, itinerary, map) can be added here to match premium page standards. */}
    </div>
  );
}

export default MustangTrekIndex;
