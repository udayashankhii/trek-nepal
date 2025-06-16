// src/components/trek/FAQSection.jsx
import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { BookOpenIcon, TicketIcon, CurrencyDollarIcon, UserCircleIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const ICONS = {
  practical: BookOpenIcon,
  booking: TicketIcon,
  financial: CurrencyDollarIcon,
  eligibility: UserCircleIcon,
  general: GlobeAltIcon
};

const FAQSection = ({ faqCategories }) => {
  const [activeCategory, setActiveCategory] = useState(faqCategories[0].id);
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenQuestionIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-gray-600 text-lg">
          Find answers grouped by topic for your convenience.
        </p>
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {faqCategories.map((category) => {
          const Icon = ICONS[category.icon] || BookOpenIcon;
          return (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setOpenQuestionIndex(null); // reset on category change
              }}
              className={`px-4 py-2 flex items-center gap-2 rounded-full border ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              {category.title}
            </button>
          );
        })}
      </div>

      {/* FAQ Questions for Active Category */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqCategories
          .find((cat) => cat.id === activeCategory)
          ?.questions.map((faq, index) => {
            const isOpen = openQuestionIndex === index;
            return (
              <div
                key={index}
                className="border rounded-lg overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200"
                >
                  <span className="font-medium text-left text-gray-800">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`w-5 h-5 transform transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 py-3 bg-white text-gray-700 border-t">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default FAQSection;
