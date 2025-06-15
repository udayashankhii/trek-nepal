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
  data,
  rating,
  reviews,
  reviewText, // optional short text shown instead of "(n reviews)"
  showStars = true,
}) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const stats = [
    { Icon: Calendar, label: "Duration", value: data.duration },
    { Icon: BarChart2, label: "Difficulty", value: data.tripGrade },
    { Icon: MapPin, label: "Start Point", value: data.startPoint },
    { Icon: Users, label: "Group Size", value: data.groupSize },
    { Icon: ArrowUpCircle, label: "Max Altitude", value: data.maxAltitude },
    { Icon: Activity, label: "Activity", value: data.activity },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-white rounded-3xl shadow-xl border border-blue-100 p-6 sm:p-8 space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">Key Information</h2>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map(({ Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon className="w-6 h-6 text-blue-500 mt-1" />
            <div>
              <dt className="text-sm font-medium text-gray-500">{label}</dt>
              <dd className="mt-1 text-base text-gray-900 font-semibold">
                {value}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      {showStars && (reviews || reviewText) && (
        <div className="flex items-center gap-[0px] pt-1">
          {/* full stars */}
          {[...Array(fullStars)].map((_, i) => (
            <StarIcon
              key={`full-${i}`}
              fill="currentColor"
              stroke="none"
              className="w-5 h-5 text-yellow-400"
            />
          ))}

          {/* half star */}
          {hasHalfStar && (
            <StarHalfIcon
              fill="currentColor"
              stroke="none"
              className="w-5 h-5 text-yellow-400"
            />
          )}

          {/* empty stars */}
          {[...Array(emptyStars)].map((_, i) => (
            <StarIcon
              key={`empty-${i}`}
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 text-gray-300"
            />
          ))}

          {/* text at right of stars */}
          <span className="ml-2 text-sm text-gray-600">
            {reviewText ?? `(${reviews} reviews)`}
          </span>
        </div>
      )}
    </div>
  );
}
