// components/TrekContactCard.js
import { FaWhatsapp, FaPhoneAlt, FaRegCalendarCheck, FaShieldAlt } from 'react-icons/fa';

export default function TrekContactCard({ trekDetails }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      {/* Pricing & Offers */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          ${trekDetails.price} 
          <span className="text-lg text-gray-500">/ person</span>
        </h2>
        <div className="flex items-center gap-2 text-emerald-600">
          <FaShieldAlt />
          <span className="text-sm">Best Price Guarantee</span>
        </div>
      </div>

      {/* Contact Channels Grid */}
      <div className="grid gap-4 mb-8">
        <a href={`https://wa.me/${trekDetails.whatsapp}?text=Hi! I'm interested in ${trekDetails.title}`}
           className="bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-xl flex items-center gap-3 transition-colors">
          <FaWhatsapp className="text-2xl" />
          <span>Instant WhatsApp Booking</span>
        </a>

        <div className="flex gap-4">
          <a href={`tel:${trekDetails.phone}`}
             className="flex-1 bg-gray-100 hover:bg-gray-200 p-4 rounded-xl flex items-center gap-3">
            <FaPhoneAlt />
            <span>{trekDetails.phone}</span>
          </a>
          <a href={`mailto:${trekDetails.email}`}
             className="flex-1 bg-gray-100 hover:bg-gray-200 p-4 rounded-xl flex items-center gap-3">
            <FaRegCalendarCheck />
            <span>Email Inquiry</span>
          </a>
        </div>
      </div>

      {/* Booking Form */}
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input type="date" 
                 className="p-3 border rounded-lg focus:ring-2 ring-emerald-500 outline-none"
                 min={new Date().toISOString().split('T')[0]} />
          <select className="p-3 border rounded-lg focus:ring-2 ring-emerald-500 outline-none">
            {[1,2,3,4,5,6,7,8].map(n => 
              <option key={n}>{n} Person{n > 1 ? 's' : ''}</option>
            )}
          </select>
        </div>

        <div className="space-y-2">
          <input type="text" placeholder="Full Name" 
                 className="w-full p-3 border rounded-lg focus:ring-2 ring-emerald-500 outline-none" />
          <input type="email" placeholder="Email" 
                 className="w-full p-3 border rounded-lg focus:ring-2 ring-emerald-500 outline-none" />
          <textarea placeholder="Special Requirements" 
                    className="w-full p-3 border rounded-lg focus:ring-2 ring-emerald-500 outline-none"
                    rows="3" />
        </div>

        <button type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-6 rounded-xl font-semibold transition-colors">
          Secure My Spot Now
        </button>
      </form>

      {/* Trust Badges */}
      <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <FaShieldAlt />
          <span>SSL Secure Booking</span>
        </div>
        <div>24/7 Support</div>
      </div>
    </div>
  )
}
