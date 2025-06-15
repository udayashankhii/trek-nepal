import React from 'react';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: 'Rajib Adhikari',
    role: 'Co-Founder & Adventure Leader',
    img: '/images/rajib.jpg',
    bio: 'Visionary trekker and lead guide—Rajib’s passion for the Himalayas inspires every expedition.',
  },
  {
    name: 'Udaya Shankhi',
    role: 'Co-Founder & Tech Director',
    img: '/images/udaya.jpg',
    bio: 'Tech innovator behind our seamless booking experience, ensuring smooth journeys.',
  },
  {
    name: 'Pasang Sherpa',
    role: 'Lead Mountain Guide',
    img: '/images/team_pasang.jpg',
    bio: 'Local legend with over 15 Everest summits—Pasang’s expertise keeps you safe and motivated.',
  },
  {
    name: 'Pema Gurung',
    role: 'Trek & Culture Guide',
    img: '/images/team_pema.jpg',
    bio: 'Cultural ambassador blending adventure with authentic Himalayan heritage.',
  },
  {
    name: 'Sunita Lama',
    role: 'Sustainability & Safety Officer',
    img: '/images/team_sunita.jpg',
    bio: 'Champion of eco-friendly treks, Sunita ensures every trip leaves a positive footprint.',
  },
  {
    name: 'Arjun Thapa',
    role: 'Operations Manager',
    img: '/images/team_arjun.jpg',
    bio: 'Logistics guru orchestrating flawless itineraries from start to finish.',
  },
];

export default function OurTeamPage() {
  return (
    <main className="bg-gray-50 text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-96 flex items-center justify-center" style={{ backgroundImage: "url('/images/team-hero.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Meet Our Team</h1>
          <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto">
            The heart and soul of Evertrek Nepal—passionate locals and innovators guiding your adventure.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={member.name}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col items-center p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover mb-4 shadow-inner"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Join Our Journey</h2>
          <p className="text-gray-600 mb-8">
            Ready to embark on an unforgettable adventure? Our team is here to make it happen.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}
