import React from "react";
import { Star, Fuel, Users, Shield } from "lucide-react";

const BikeCard = ({ bike, onBook }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={"/bike.jpg"}
          alt={bike.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full">
            {bike.type}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{bike.rating}</span>
            <span className="text-xs text-gray-500">({bike.reviews})</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {bike.name}
            </h3>
            <p className="text-gray-600">{bike.engine} Engine</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">
              ₹{bike.price}
            </div>
            <div className="text-sm text-gray-500">per day</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {bike.features.map((feature, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="flex space-x-4 mb-6 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Fuel className="w-4 h-4" />
            <span>Fuel Included</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4" />
            <span>Insured</span>
          </div>
        </div>

        <button
          onClick={onBook}
          className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-300"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default BikeCard;
