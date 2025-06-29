import React, { useState } from "react";
import { Calendar, MapPin, Clock, Star, Shield, Mountain } from "lucide-react";
import BikeCard from "./BikeCard";
import TestimonialSection from "./Testimonials";
import BookingForm from "./BookingForm";

const BikeRentalPage = () => {
  const [selectedBike, setSelectedBike] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  const bikes = [
    {
      id: 1,
      name: "Royal Enfield Himalayan",
      type: "Adventure Touring",
      engine: "411cc",
      price: 3500,
      image: "/api/placeholder/400/300",
      features: ["ABS", "Long Range Tank", "Luggage Rack"],
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      name: "KTM Duke 390",
      type: "Street Fighter",
      engine: "373cc",
      price: 3000,
      image: "/api/placeholder/400/300",
      features: ["Digital Display", "LED Lights", "Sporty Design"],
      rating: 4.7,
      reviews: 89,
    },
    {
      id: 3,
      name: "Honda CB Hornet 160R",
      type: "Commuter",
      engine: "162cc",
      price: 2000,
      image: "/api/placeholder/400/300",
      features: ["Fuel Efficient", "Comfortable Ride", "City Friendly"],
      rating: 4.6,
      reviews: 156,
    },
    {
      id: 4,
      name: "Bajaj Pulsar NS200",
      type: "Sport Naked",
      engine: "199cc",
      price: 2500,
      image: "/api/placeholder/400/300",
      features: ["Liquid Cooled", "Perimeter Frame", "Split Seats"],
      rating: 4.5,
      reviews: 98,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-white-600/90 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/bike.jpg')",
          }}
        ></div>

        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              🚴 Authentic Nepal Adventure
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Book Your Own
            <span className="block text-yellow-300">Bike Adventure</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto leading-relaxed">
            Explore the authentic beauty of Nepal on two wheels. From bustling
            Kathmandu streets to serene mountain highways.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                document
                  .getElementById("bikes")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Browse Bikes
            </button>
            <button className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-lg transition-all duration-300">
              Watch Our Story
            </button>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-8 text-white text-center">
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm opacity-80">Happy Riders</div>
            </div>
            <div>
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm opacity-80">Destinations</div>
            </div>
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm opacity-80">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Ride With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience Nepal like never before with our premium bike rental
              service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Fully Insured</h3>
              <p className="text-gray-600">
                All our bikes come with comprehensive insurance coverage for
                your peace of mind.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mountain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Local Expertise</h3>
              <p className="text-gray-600">
                Get insider tips and route recommendations from our local team.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock assistance wherever your adventure takes you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bikes Section */}
      <section id="bikes" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Adventure Machine
            </h2>
            <p className="text-xl text-gray-600">
              From city cruisers to mountain conquerors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {bikes.map((bike) => (
              <BikeCard
                key={bike.id}
                bike={bike}
                onBook={() => {
                  setSelectedBike(bike);
                  setShowBooking(true);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Routes
            </h2>
            <p className="text-xl text-gray-600">
              Discover the most scenic and adventurous routes in Nepal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Kathmandu to Pokhara",
                distance: "200km",
                duration: "6-8 hours",
                difficulty: "Easy",
                image: "/bike.jpg",
              },
              {
                name: "Annapurna Circuit",
                distance: "230km",
                duration: "2-3 days",
                difficulty: "Moderate",
                image: "/bike2.jpg",
              },
              {
                name: "Upper Mustang",
                distance: "180km",
                duration: "3-4 days",
                difficulty: "Challenging",
                image: "/api/placeholder/400/250",
              },
            ].map((route, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={route.image}
                  alt={route.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{route.name}</h3>
                  <div className="flex justify-between text-sm opacity-90">
                    <span>{route.distance}</span>
                    <span>{route.duration}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        route.difficulty === "Easy"
                          ? "bg-green-500"
                          : route.difficulty === "Moderate"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {route.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialSection />

      {/* Booking Modal */}
      {showBooking && (
        <BookingForm
          bike={selectedBike}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  );
};

export default BikeRentalPage;
