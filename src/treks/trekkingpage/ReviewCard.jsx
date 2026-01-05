import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';

export default function ReviewCard({
  reviewer_name,
  reviewer_country,
  reviewer_avatar,
  body,
  avatar,
  name,
  country,
  title,
  text,
  rating,
}) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Memoize computed values to prevent re-creation
  const displayName = useMemo(() => 
    reviewer_name || name || 'Anonymous', 
    [reviewer_name, name]
  );
  
  const displayCountry = useMemo(() => 
    reviewer_country || country, 
    [reviewer_country, country]
  );
  
  const displayAvatar = useMemo(() => 
    reviewer_avatar || avatar || '/default-avatar.png', 
    [reviewer_avatar, avatar]
  );
  
  const displayText = useMemo(() => 
    body || text || '', 
    [body, text]
  );

  // Memoize word processing
  const { displayed, isLong } = useMemo(() => {
    const words = displayText.split(' ');
    const isLong = words.length > 35;
    const displayed = expanded
      ? displayText
      : words.slice(0, 35).join(' ') + (isLong ? '...' : '');
    return { displayed, isLong };
  }, [displayText, expanded]);

  // Memoize star rendering
  const stars = useMemo(() => 
    Array.from({ length: rating || 0 }, (_, i) => (
      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
    )), 
    [rating]
  );

  // Fixed error handler - prevents infinite loop
  const handleImgError = (e) => {
    if (!imgError && e.target.src !== '/default-avatar.png') {
      setImgError(true);
      e.target.onerror = null;
      e.target.src = '/default-avatar.png';
    }
  };

  return (
    <div className="bg-sky-50 border border-sky-100 rounded-none p-5 shadow-md">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={displayAvatar}
          alt={displayName}
          className="w-16 h-16 rounded-full border-2 border-sky-100 object-cover"
          onError={handleImgError}
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {displayName}
            {displayCountry && <span className="ml-1">— {displayCountry}</span>}
          </p>
          <div className="flex items-center mt-2 space-x-1">
            {stars}
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
