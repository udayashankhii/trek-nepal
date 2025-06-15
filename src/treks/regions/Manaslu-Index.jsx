// src/pages/ManasluTrekIndex.jsx
import React from 'react';

function ManasluTrekIndex() {
  return (
    <div className="trek-index-page">
      <header className="trek-header manaslu">
        <h1>Manaslu Trekking Adventures</h1>
        <p>Embark on the remote Manaslu Circuit and experience untouched landscapes around the world's eighth-highest mountain.</p>
      </header>

      <section className="trek-overview">
        <h2>Overview</h2>
        <p>
          The Manaslu region offers a challenging and rewarding trekking route circling Mt. Manaslu (8,163m). 
          Trekkers traverse through Gurung villages, lush river valleys, and high mountain passes, culminating in the crossing of the Larkya La Pass at 5,106m.
        </p>
      </section>

      <section className="trek-highlights">
        <h2>Highlights</h2>
        <ul>
          <li>Spectacular up-close views of Mount Manaslu and neighboring peaks.</li>
          <li>Cross the formidable Larkya La Pass for an alpine high-altitude experience.</li>
          <li>Immerse in the rich culture of mountain villages and ancient monasteries en route.</li>
        </ul>
      </section>
    </div>
  );
}

export default ManasluTrekIndex;
