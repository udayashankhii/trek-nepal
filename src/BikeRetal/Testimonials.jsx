import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      country: "Australia",
      rating: 5,
      text: "Incredible experience riding through the Himalayas! The bike was in perfect condition and the support team was amazing.",
      image: "/api/placeholder/80/80"
    },
    {
      name: "Marco Rodriguez",
      country: "Spain",
      rating: 5,
      text: "Best way to explore Nepal! The freedom to stop wherever you want and the authentic local experiences were unforgettable.",
      image: "/api/placeholder/80/80"
    },
    {
      name: "Priya Sharma",
      country: "India",
      rating: 5,
      text: "Professional service and well-maintained bikes. The route suggestions were spot on. Highly recommended!",
      image: "/api/placeholder/80/80"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Riders Say
          </h2>
          <p className="text-xl text-gray-600">
            Real experiences from adventurers like you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              
              <Quote className="w-8 h-8 text-orange-300 mb-4" />
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
