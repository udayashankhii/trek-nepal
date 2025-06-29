import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function ReviewCard({
  avatar,
  name,
  country,
  title,
  text,
  rating,
}) {
  const [expanded, setExpanded] = useState(false);
  const words = text.split(' ');
  const isLong = words.length > 35;
  const displayed = expanded
    ? text
    : words.slice(0, 35).join(' ') + (isLong ? '...' : '');

  return (
    <div className="bg-sky-50 border border-sky-100 rounded-none p-5 shadow-md">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={avatar}
          alt={name}
          className="w-16 h-16 rounded-full border-2 border-sky-100 object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {name}
            {country && <span className="ml-1">— {country}</span>}
          </p>
          <div className="flex items-center mt-2 space-x-1">
            {Array.from({ length: rating }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 text-yellow-400 fill-current"
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed text-justify">
        {displayed}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 text-indigo-600 font-medium hover:underline"
          >
            {expanded ? 'read less' : '+ read more'}
          </button>
        )}
      </p>
    </div>
  );
}
