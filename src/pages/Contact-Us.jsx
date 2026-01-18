import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Twitter,
  Instagram,
  Facebook,
} from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-green-600 to-teal-500 text-white py-24 text-center overflow-hidden"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="max-w-2xl mx-auto text-lg">
          We’re here to help you plan the trek of a lifetime. Reach out to us
          with any questions.
        </p>
      </motion.section>

      <div className="flex-grow container mx-auto px-6 lg:px-20 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-semibold text-gray-800">
            Contact Information
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-700">Address</h3>
                <p className="text-gray-600">Thimi, Bhaktapur, Nepal</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-700">Email</h3>
                <p className="text-gray-600">info@evertreknepal.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Phone className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-700">Phone</h3>
                <p className="text-gray-600">+977 1 2345678</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-4">
            <a
              href="#"
              className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition"
            >
              <Facebook className="w-5 h-5 text-white" />
            </a>
            <a
              href="#"
              className="p-3 bg-blue-400 rounded-full hover:bg-blue-500 transition"
            >
              <Twitter className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://www.instagram.com/evertrek_nepal/"
              className="p-3 bg-pink-500 rounded-full hover:bg-pink-600 transition"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 rounded-2xl shadow-lg space-y-6"
          action="https://formspree.io/f/your-form-id"
          method="POST"
        >
          <h2 className="text-2xl font-semibold text-gray-800">
            Send Us a Message
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="subject">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Submit
          </button>
        </motion.form>
      </div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-96 overflow-hidden"
      >
        <iframe
          title="Our Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.04085918491!2d85.31282181502142!3d27.7007692326604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190f7e1c0e15%3A0xbdc4df0df3e8b5e1!2sLazimpat%2C+Kathmandu%2C+Nepal!5e0!3m2!1sen!2sus!4v1616482345658!5m2!1sen!2sus"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        />
      </motion.div>

      {/* Footer Spacer */}
      <div className="h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </div>
  );
}
