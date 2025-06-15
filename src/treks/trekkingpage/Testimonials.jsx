// components/TestimonialsSection.js
import { useState } from "react";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    quote:
      "The Everest Base Camp Trek was a life-changing experience! The guides were knowledgeable, the scenery was breathtaking, and the support from the team was outstanding.",
    name: "Sarah Chen",
    title: "Travel Blogger, USA",
    image: "/testimonials/sarah.jpg",
    rating: 5,
  },
  {
    quote:
      "I felt safe and cared for every step of the way. Nepal Hiking Team made my Himalayan adventure seamless and unforgettable.",
    name: "Lars Mikkelsen",
    title: "Photographer, Denmark",
    image: "/testimonials/lars.jpg",
    rating: 5,
  },
  {
    quote:
      "From the first inquiry to the summit, everything was handled with professionalism and warmth. Highly recommended for anyone seeking the best trekking experience.",
    name: "Priya Sharma",
    title: "Entrepreneur, India",
    image: "/testimonials/priya.jpg",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  // Carousel navigation
  const prev = () =>
    setCurrent((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  const next = () =>
    setCurrent((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));

  return (
    <section className="py-16 bg-gray-50" id="testimonials">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
          What Our Trekkers Say
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Real stories from real adventurers. Your journey is safe in our hands.
        </p>
        {/* Carousel */}
        <div className="relative">
          <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-xl p-8 md:p-12 transition-all min-h-[320px]">
            <img
              src={testimonials[current].image}
              alt={testimonials[current].name}
              className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100 shadow-md mb-6 md:mb-0 md:mr-8"
              loading="lazy"
            />
            <div className="flex-1">
              <p className="text-lg md:text-xl text-gray-800 font-medium mb-6">
                “{testimonials[current].quote}”
              </p>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-emerald-700">{testimonials[current].name}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">{testimonials[current].title}</span>
                <span className="ml-4 flex items-center gap-1">
                  {[...Array(testimonials[current].rating)].map((_, i) => (
                    <FaStar key={i} className="text-amber-400" />
                  ))}
                </span>
              </div>
            </div>
          </div>
          {/* Carousel Controls */}
          <button
            aria-label="Previous testimonial"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2 shadow hover:bg-emerald-50 transition hidden md:block"
            onClick={prev}
          >
            ‹
          </button>
          <button
            aria-label="Next testimonial"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2 shadow hover:bg-emerald-50 transition hidden md:block"
            onClick={next}
          >
            ›
          </button>
        </div>
        {/* Dots for mobile */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${idx === current ? "bg-emerald-500" : "bg-gray-300"}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
