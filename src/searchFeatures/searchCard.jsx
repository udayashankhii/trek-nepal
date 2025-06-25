  // ...existing code...
import React from 'react';
import { Link } from 'react-router-dom';

const SearchCard = ({ trek }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={trek.image} 
        alt={trek.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{trek.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{trek.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-amber-600 font-bold">${trek.price}</span>
          <span className="text-gray-500">{trek.duration} days</span>
        </div>
        <div className="mt-4">
          <Link 
            to={`/trek/${trek.slug}`}
            className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-md transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;