import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function ReviewCard({
  // API field names
  reviewer_name,
  reviewer_country,
  reviewer_avatar,
  body,
  // Backward compatible prop names
  avatar,
  name,
  country,
  title,
  text,
  rating,
}) {
  const [expanded, setExpanded] = useState(false);

  // Use API fields with fallback to legacy props
  const displayName = reviewer_name || name || 'Anonymous';
  const displayCountry = reviewer_country || country;
  const displayAvatar = reviewer_avatar || avatar || '/default-avatar.png';
  const displayText = body || text || '';

  const words = displayText.split(' ');
  const isLong = words.length > 35;
  const displayed = expanded
    ? displayText
    : words.slice(0, 35).join(' ') + (isLong ? '...' : '');

  return (
    <div className="bg-sky-50 border border-sky-100 rounded-none p-5 shadow-md">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={displayAvatar}
          alt={displayName}
          className="w-16 h-16 rounded-full border-2 border-sky-100 object-cover"
          onError={(e) => { e.target.src = '/default-avatar.png'; }}
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {displayName}
            {displayCountry && <span className="ml-1">— {displayCountry}</span>}
          </p>
          <div className="flex items-center mt-2 space-x-1">
            {Array.from({ length: rating || 0 }).map((_, i) => (
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
