import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock } from 'lucide-react';

const BookingForm = ({ bike, onClose }) => {
  const [formData, setFormData] = useState({
    pickupDate: '',
    returnDate: '',
    pickupLocation: 'kathmandu',
    fullName: '',
    email: '',
    phone: '',
    licenseNumber: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle booking submission
    console.log('Booking submitted:', { bike, ...formData });
    alert('Booking request submitted! We will contact you shortly.');
    onClose();
  };

  const calculateDays = () => {
    if (formData.pickupDate && formData.returnDate) {
      const pickup = new Date(formData.pickupDate);
      const returnDate = new Date(formData.returnDate);
      const diffTime = Math.abs(returnDate - pickup);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    }
    return 1;
  };

  const totalCost = bike.price * calculateDays();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Book {bike.name}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Bike Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <img src={bike.image} alt={bike.name} className="w-20 h-20 object-cover rounded-lg" />
              <div>
                <h3 className="font-semibold">{bike.name}</h3>
                <p className="text-gray-600">{bike.engine} • {bike.type}</p>
                <p className="text-orange-600 font-semibold">₹{bike.price}/day</p>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Pickup Date
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={formData.pickupDate}
                onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Return Date
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={formData.returnDate}
                onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                min={formData.pickupDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Pickup Location
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={formData.pickupLocation}
              onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
            >
              <option value="kathmandu">Kathmandu (Thamel)</option>
              <option value="pokhara">Pokhara (Lakeside)</option>
              <option value="chitwan">Chitwan National Park</option>
              <option value="airport">Tribhuvan Airport</option>
            </select>
          </div>

          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Driving License Number</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
              />
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span>Duration:</span>
              <span className="font-semibold">{calculateDays()} day(s)</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Daily Rate:</span>
              <span>₹{bike.price}</span>
            </div>
            <div className="border-t border-orange-200 pt-2">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Cost:</span>
                <span className="text-orange-600">₹{totalCost}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-300"
          >
            Submit Booking Request
          </button>

          <p className="text-sm text-gray-500 text-center">
            You will receive a confirmation email within 24 hours. Payment can be made upon pickup.
          </p>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
