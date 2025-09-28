import React from "react";

export default function TourDetail({
  title,
  longDescription,
  highlights = [],
  img,
  price,
  duration,
  reviews,
  reviewsCount,
  itinerary,
  inclusions,
  exclusions,
  bookUrl,
}) {
  return (
    <div className="max-w-3xl mx-auto bg-white/75 backdrop-blur-lg shadow-2xl rounded-3xl p-8 my-10">
      <img
        src={img}
        alt={title}
        className="w-full h-72 object-cover rounded-2xl mb-6 shadow"
      />
      <h1 className="text-4xl font-bold text-teal-900 mb-2">{title}</h1>
      <div className="flex gap-6 items-center mb-4">
        <span className="text-yellow-500 text-xl">★{reviews}</span>
        <span className="text-sm text-gray-500">
          ({reviewsCount} verified reviews)
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
          {price}
        </span>
        <span className="text-slate-700">{duration}</span>
      </div>
      <p className="text-lg text-gray-700 mb-4">{longDescription}</p>

      {highlights.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2 text-primary">
            Highlights:
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            {highlights.map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ul>
        </div>
      )}

      {itinerary && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2 text-primary">
            Itinerary:
          </h2>
          <p className="text-gray-700">{itinerary}</p>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {inclusions && inclusions.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Included:</h3>
            <ul className="list-disc list-inside text-gray-700">
              {inclusions.map((inc, i) => (
                <li key={i}>{inc}</li>
              ))}
            </ul>
          </div>
        )}
        {exclusions && exclusions.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 text-red-700">Not Included:</h3>
            <ul className="list-disc list-inside text-gray-700">
              {exclusions.map((exc, i) => (
                <li key={i}>{exc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <a
        href={bookUrl}
        className="block w-full mt-4 text-center text-lg font-bold bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:from-teal-600 hover:to-blue-600 transition"
      >
        Book This Adventure
      </a>
    </div>
  );
}
