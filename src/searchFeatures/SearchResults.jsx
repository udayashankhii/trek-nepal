import React from "react";
import { MapPin, Calendar, Star, ChevronRight, TrendingUp, Sparkles, Award } from "lucide-react";

export default function SearchResults({
  results = [],
  query,
  totalResults,
  onResultClick,
  onViewAll,
  suggestions = [],
  fallback = null,
}) {
  const hasResults = results.length > 0;
  const hasSuggestions = suggestions.length > 0;

  return (
    <>
      {/* Results Header */}
      {hasResults && (
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <p className="text-sm font-medium text-gray-500">
                  <span className="text-gray-900 font-bold">
                    {totalResults}
                  </span>{" "}
                  {totalResults === 1 ? "Result" : "Results"} for
                </p>
              </div>
              <p className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 italic">
                "{query}"
              </p>
            </div>
{/*  */}
          </div>
        </div>
      )}

      {/* Results Grid */}
      {hasResults && (
        <div className="p-6">
          <div className="grid grid-cols-1 gap-3">
            {results.map((result, idx) => (
              <SearchResultCard
                key={result.id}
                result={result}
                onClick={() => onResultClick(result)}
                index={idx}
              />
            ))}
          </div>
        </div>
      )}

      {/* Suggestions Section */}
      {hasSuggestions && hasResults && (
        <div className="border-t border-gray-200/50 bg-gradient-to-b from-gray-50/30 to-white p-6">
          <div className="flex items-center gap-2 mb-4">


          </div>

          <div className="grid grid-cols-1 gap-2">
            {suggestions.slice(0, 3).map((suggestion, idx) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onClick={() => onResultClick(suggestion)}
                index={idx}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fallback Popular Items */}
      {!hasResults && fallback && (fallback.treks?.length > 0 || fallback.tours?.length > 0) && (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg shadow-purple-500/20">
              <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Popular Adventures
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {[...(fallback.treks || []), ...(fallback.tours || [])].slice(0, 4).map((item, idx) => (
              <FallbackCard
                key={item.id}
                item={item}
                onClick={() => onResultClick(item)}
                index={idx}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// Main Result Card Component
function SearchResultCard({ result, onClick, index }) {
  const {
    title,
    subtitle,
    location,
    duration,
    rating,
    price,
    image_url,
    type,
    match_fields = [],
  } = result;

  return (
    <button
      onClick={onClick}
      className="group relative flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 hover:from-white hover:to-white border border-gray-200/50 hover:border-emerald-300/50 transition-all duration-300 text-left overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10"
      style={{
        animation: `slideUp 0.4s ease-out ${index * 0.05}s backwards`,
      }}
    >
      {/* Gradient Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-cyan-500/0 group-hover:from-emerald-500/5 group-hover:via-teal-500/5 group-hover:to-cyan-500/5 transition-all duration-500" />

      {/* Image Container */}
      <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
        {image_url ? (
          <>
            <img
              src={image_url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400">
            <MapPin className="w-10 h-10 text-white drop-shadow-lg" strokeWidth={2} />
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wide bg-white/95 backdrop-blur-sm text-gray-900 rounded-lg shadow-lg border border-white/50">
            {type}
          </span>
        </div>

        {/* Rating Badge */}
        {rating && (
          <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" strokeWidth={2} />
            <span className="text-xs font-bold text-gray-900">{rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 relative py-1">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {title}
          </h3>
          {result.meta?.badge && (
            <span className="flex-shrink-0 ml-2 px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter bg-emerald-100 text-emerald-700 rounded-md border border-emerald-200">
              {result.meta.badge}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-sm text-gray-500 line-clamp-1 mb-4 font-medium leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Meta Info Grid */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {location && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50/50 rounded-lg border border-blue-100/50 group-hover:bg-blue-50/80 transition-colors">
              <MapPin className="w-3.5 h-3.5 text-blue-600" strokeWidth={2.5} />
              <span className="text-xs font-semibold text-blue-700">{location}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50/50 rounded-lg border border-purple-100/50 group-hover:bg-purple-50/80 transition-colors">
              <Calendar className="w-3.5 h-3.5 text-purple-600" strokeWidth={2.5} />
              <span className="text-xs font-semibold text-purple-700">{duration}</span>
            </div>
          )}
          {result.meta?.activity && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50/50 rounded-lg border border-amber-100/50 group-hover:bg-amber-50/80 transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" strokeWidth={2.5} />
              <span className="text-xs font-semibold text-amber-700">{result.meta.activity}</span>
            </div>
          )}
        </div>

        {/* Match Tags */}
        {match_fields.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {match_fields.slice(0, 3).map((field, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200/50"
              >
                {field}
              </span>
            ))}
            {match_fields.length > 3 && (
              <span className="px-2 py-0.5 text-[10px] font-bold text-gray-500">
                +{match_fields.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="flex-shrink-0 text-right self-center min-w-[100px]">
        {price && price > 0 ? (
          <>
            <p className="text-[10px] text-gray-500 mb-0.5 font-bold uppercase tracking-wider">Starting from</p>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ${Math.round(price).toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">USD / Person</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-400 italic">Price on request</span>
          </div>
        )}
      </div>

      {/* Hover Arrow */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/30">
          <ChevronRight className="w-5 h-5 text-white" strokeWidth={3} />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </button>
  );
}

// Suggestion Card Component
function SuggestionCard({ suggestion, onClick, index }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center justify-between p-3 rounded-xl bg-white hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 border border-gray-200/50 hover:border-amber-300/50 transition-all duration-300 text-left"
      style={{
        animation: `slideIn 0.3s ease-out ${index * 0.1}s backwards`,
      }}
    >
      <div className="flex items-center gap-3">
        {/* Image Thumbnail */}
        <div className="relative w-14 h-14 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
          {suggestion.image_url ? (
            <img
              src={suggestion.image_url}
              alt={suggestion.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-400">
              <MapPin className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div>
          <p className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-1">
            {suggestion.title}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
            {suggestion.duration && (
              <>
                <Calendar className="w-3 h-3" strokeWidth={2.5} />
                {suggestion.duration}
              </>
            )}
            {suggestion.duration && suggestion.location && <span>•</span>}
            {suggestion.location && (
              <>
                <MapPin className="w-3 h-3" strokeWidth={2.5} />
                {suggestion.location}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Arrow */}
      <div className="text-gray-400 group-hover:text-amber-600 transform group-hover:translate-x-1 transition-all duration-200">
        <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </button>
  );
}

// Fallback Card Component
function FallbackCard({ item, onClick, index }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center justify-between p-3 rounded-xl bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 border border-gray-200/50 hover:border-purple-300/50 transition-all duration-300 text-left"
      style={{
        animation: `fadeIn 0.3s ease-out ${index * 0.1}s backwards`,
      }}
    >
      <div className="flex items-center gap-3">
        {/* Image Thumbnail */}
        <div className="relative w-14 h-14 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
              <Award className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div>
          <p className="text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-1">
            {item.title}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
            {item.duration && (
              <>
                <Calendar className="w-3 h-3" strokeWidth={2.5} />
                {item.duration}
              </>
            )}
            {item.duration && item.location && <span>•</span>}
            {item.location && (
              <>
                <MapPin className="w-3 h-3" strokeWidth={2.5} />
                {item.location}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Arrow */}
      <div className="text-gray-400 group-hover:text-purple-600 transform group-hover:translate-x-1 transition-all duration-200">
        <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </button>
  );
}