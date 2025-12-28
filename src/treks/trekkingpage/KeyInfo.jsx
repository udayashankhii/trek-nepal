

// src/components/trek/KeyInfo.jsx
import {
  Calendar,
  BarChart2,
  MapPin,
  Users,
  ArrowUpCircle,
  Activity,
  Star as StarIcon,
  StarHalf as StarHalfIcon,
} from "lucide-react";

export default function KeyInfo({
  data = {},
  rating = 0,
  reviews = 0,
  reviewText,
  showStars = true,
}) {
  const safeRating = typeof rating === "number" && rating >= 0 && rating <= 5 ? rating : 0;
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const stats = [
    { Icon: Calendar, label: "Duration", value: data.duration, key: "duration" },
    { 
      Icon: BarChart2, 
      label: "Difficulty", 
      value: data.difficulty,
      key: "difficulty"
    },
    { Icon: MapPin, label: "Start Point", value: data.startPoint, key: "startPoint" },
    { Icon: Users, label: "Group Size", value: data.groupSize, key: "groupSize" },
    { Icon: ArrowUpCircle, label: "Max Altitude", value: data.maxAltitude, key: "maxAltitude" },
    { Icon: Activity, label: "Activity", value: data.activity, key: "activity" },
  ];


  return (
    <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-white rounded-3xl shadow-xl border border-blue-100 p-6 sm:p-8 space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">Key Information</h2>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map(({ Icon, label, value, badge, key }) => {
          const displayValue = value || "TBD";
          return (
            <div key={key} className="flex items-start gap-3">
              <Icon className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1 space-y-1">
                <dt className="text-sm font-medium text-gray-500">{label}</dt>
                <dd className="flex items-center gap-2">
                  <span className="text-base text-gray-900 font-semibold truncate">
                    {displayValue}
                  </span>
                  {badge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadge(badge)}`}>
                      {badge.charAt(0).toUpperCase() + badge.slice(1)}
                    </span>
                  )}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>

      {showStars && (reviews > 0 || reviewText) && (
        <div className="flex items-center gap-1 pt-2 border-t border-blue-100 pt-4">
          {[...Array(fullStars)].map((_, i) => (
            <StarIcon key={`full-${i}`} fill="currentColor" strokeWidth={0} className="w-5 h-5 text-yellow-400" />
          ))}
          {hasHalfStar && (
            <StarHalfIcon fill="currentColor" strokeWidth={0} className="w-5 h-5 text-yellow-400" />
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <StarIcon key={`empty-${i}`} fill="none" strokeWidth={2} className="w-5 h-5 text-gray-300" />
          ))}
          <span className="ml-2 text-sm text-gray-600 font-medium">
            {reviewText ?? `(${reviews} review${reviews !== 1 ? 's' : ''})`}
          </span>
        </div>
      )}
    </div>
  );
}
