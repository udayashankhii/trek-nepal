import React from 'react';
import { Star, MapPin, Calendar } from 'lucide-react';

const ReviewSection = () => {
  const reviews = [
    {
      id: 1,
      rating: 5,
      title: "EBC Trek Via Gokyo Valley With Heli Return",
      content: "I'm overwhelmed with appreciation as I reflect on my fantastic Gokyo Valley Trek with heli return. I'd like to convey my heartfelt gratitude for organizing this flawless and amazing journey for Green Valley Nepal Treks. Exploring the calm Gokyo Valley and arriving at the unspoiled Gokyo Lakes was a fantastic adventure that will stay with me...",
      customerName: "Robert",
      customerInitial: "R",
      date: "March 25, 2024",
      location: "United Kingdom"
    },
    {
      id: 2,
      rating: 5,
      title: "Heartily Advise Green Valley Nepal Treks For EBC Trek Via Gokyo With Heli Return",
      content: "I had the pleasure of returning to Nepal, this time to see the Everest region. Discovering the breathtaking Gokyo Lake was an amazing experience. We ascended Gokyo Ri with my guide in tow and then flew in a helicopter from Gorakshep to Kathmandu. It was a stunning view from up there. The most breathtaking panoramic view of the...",
      customerName: "Gilberto",
      customerInitial: "G",
      date: "March 15, 2024",
      location: "Spain"
    }
  ];

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < rating 
                ? 'fill-emerald-500 text-emerald-500' 
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const TripAdvisorBadge = () => {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-semibold text-gray-800">TripAdvisor</span>
        </div>
        
        <h3 className="font-bold text-lg mb-2 text-gray-900 leading-tight">
          Green Valley Nepal Treks & Research Hub P Ltd
        </h3>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <Star key={index} className="w-4 h-4 fill-green-500 text-green-500" />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">1,273 reviews</span>
        </div>
        
        <p className="text-sm text-gray-600">
          #12 of 2221 Outdoor Activities in Kathmandu
        </p>
      </div>
    );
  };

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-12 gap-8">
          <div className="flex-1">
            <p className="text-emerald-600 text-sm font-semibold mb-2 uppercase tracking-wide">
              What our travelers says
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Client Reviews
            </h2>
          </div>
          
          {/* TripAdvisor Badge */}
          <div className="lg:flex-shrink-0">
            <TripAdvisorBadge />
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-emerald-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Star Rating */}
              <StarRating rating={review.rating} />
              
              {/* Review Title */}
              <h3 className="font-bold text-xl mb-4 text-gray-900 leading-tight">
                {review.title}
              </h3>
              
              {/* Review Content */}
              <p className="text-gray-700 mb-8 leading-relaxed text-base">
                {review.content}
              </p>
              
              {/* Customer Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="font-bold text-white text-lg">
                    {review.customerInitial}
                  </span>
                </div>
                
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-lg">
                    {review.customerName}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{review.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
            View All Reviews
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
