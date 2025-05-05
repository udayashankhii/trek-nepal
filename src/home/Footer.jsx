import React from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiMail, FiPhone, FiClock } from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTripadvisor,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-extrabold text-yellow-400 mb-4">
            Nepal Nirvana <span className="text-white">Adventours</span>
          </h2>
          <p>
            Trusted by thousands of trekkers since 2010 for immersive Himalayan
            experiences.
          </p>
          <div className="flex space-x-4 mt-4">
            <SocialIcon
              Icon={FaFacebookF}
              link="https://facebook.com/"
              label="Facebook"
            />
            <SocialIcon
              Icon={FaInstagram}
              link="https://instagram.com/"
              label="Instagram"
            />
            <SocialIcon
              Icon={FaYoutube}
              link="https://youtube.com/"
              label="YouTube"
            />
            <SocialIcon
              Icon={FaTripadvisor}
              link="https://tripadvisor.com/"
              label="TripAdvisor"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/tours">Trekking Packages</FooterLink>
            <FooterLink to="/blog">Travel Blog</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">
            Contact Us
          </h3>
          <ul className="space-y-3">
            <ContactItem icon={<FiMapPin />} text="Thamel, Kathmandu, Nepal" />
            <ContactItem icon={<FiPhone />} text="+977 1-1234567" />
            <ContactItem icon={<FiMail />} text="info@nepalnirvana.com" />
            <ContactItem icon={<FiClock />} text="Mon–Sat: 9:00 AM – 6:00 PM" />
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">
            Newsletter
          </h3>
          <p className="mb-4">
            Get updates & exclusive trekking deals in your inbox.
          </p>
          <form className="flex flex-col sm:flex-row items-stretch">
            <input
              type="email"
              placeholder="Your email"
              className="p-2 text-gray-900 rounded-l-md w-full sm:w-auto sm:flex-1 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-r-md mt-2 sm:mt-0 transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-xs">
        <p>
          &copy; {new Date().getFullYear()} Nepal Nirvana Adventours. All rights
          reserved.
        </p>
        <div className="mt-2 flex justify-center gap-6">
          <FooterLink to="/privacy-policy" small>
            Privacy Policy
          </FooterLink>
          <FooterLink to="/terms" small>
            Terms & Conditions
          </FooterLink>
        </div>
      </div>
    </footer>
  );
};

// Subcomponents
const SocialIcon = ({ Icon, link, label }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="bg-gray-800 hover:bg-yellow-500 text-white p-2 rounded-full transition-colors"
  >
    {/* now ESLint sees you *are* using the Icon prop */}
    <Icon className="h-4 w-4" />
  </a>
);

const FooterLink = ({ to, children, small = false }) => (
  <li>
    <Link
      to={to}
      className={`hover:text-yellow-400 transition-colors ${
        small ? "text-xs" : "text-sm"
      }`}
    >
      {children}
    </Link>
  </li>
);

const ContactItem = ({ icon, text }) => (
  <li className="flex items-start">
    <span className="text-yellow-400 mr-2 mt-1">{icon}</span>
    <span>{text}</span>
  </li>
);

export default Footer;
