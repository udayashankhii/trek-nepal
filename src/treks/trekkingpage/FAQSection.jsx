// src/trekkingpage/FAQSection.jsx
import React, { useState, useMemo } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { 
  BookOpenIcon, 
  TicketIcon, 
  CurrencyDollarIcon, 
  UserCircleIcon, 
  GlobeAltIcon,
  QuestionMarkCircleIcon 
} from '@heroicons/react/24/outline';

// Icon mapping for categories
const ICONS = {
  practical: BookOpenIcon,
  booking: TicketIcon,
  financial: CurrencyDollarIcon,
  eligibility: UserCircleIcon,
  general: GlobeAltIcon,
  default: QuestionMarkCircleIcon
};

const FAQSection = ({ 
  faqCategories = [],
  title = "Frequently Asked Questions",
  subtitle = "Find answers grouped by topic for your convenience.",
  showCategories = true 
}) => {
  // Normalize FAQ data from API
  const normalizedFAQs = useMemo(() => {
    if (!Array.isArray(faqCategories) || faqCategories.length === 0) {
      return [];
    }

    return faqCategories
      .map((category, catIndex) => {
        // Handle different API response formats
        const categoryId = category.id || category.category || `category-${catIndex}`;
        const categoryTitle = category.title || category.name || category.category || 'General';
        const categoryIcon = category.icon || 'general';
        
        // Normalize questions array
        let questions = [];
        if (Array.isArray(category.questions)) {
          questions = category.questions;
        } else if (Array.isArray(category.faqs)) {
          questions = category.faqs;
        } else if (Array.isArray(category.items)) {
          questions = category.items;
        }

        // Map questions to consistent format
        const normalizedQuestions = questions
          .map((faq, qIndex) => {
            if (typeof faq === 'object' && faq !== null) {
              return {
                question: faq.question || faq.q || faq.title || '',
                answer: faq.answer || faq.a || faq.description || faq.content || '',
                id: faq.id || `${categoryId}-q${qIndex}`
              };
            }
            return null;
          })
          .filter(q => q && q.question && q.answer); // Remove invalid entries

        // Only return category if it has valid questions
        if (normalizedQuestions.length === 0) {
          return null;
        }

        return {
          id: categoryId,
          title: categoryTitle,
          icon: categoryIcon,
          questions: normalizedQuestions
        };
      })
      .filter(Boolean); // Remove null entries
  }, [faqCategories]);

  const [activeCategory, setActiveCategory] = useState(
    normalizedFAQs.length > 0 ? normalizedFAQs[0].id : null
  );
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);

  // Find active category data
  const activeCategoryData = useMemo(() => {
    return normalizedFAQs.find(cat => cat.id === activeCategory);
  }, [normalizedFAQs, activeCategory]);

  const handleToggle = (index) => {
    setOpenQuestionIndex(prev => (prev === index ? null : index));
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setOpenQuestionIndex(null); // Reset open question on category change
  };

  // Don't render if no FAQs
  if (normalizedFAQs.length === 0) {
    return null;
  }

  // If only one category and showCategories is false, skip category buttons
  const shouldShowCategories = showCategories && normalizedFAQs.length > 1;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 text-gray-600 text-lg">
          {subtitle}
        </p>
      </div>

      {/* Category Buttons - Only show if multiple categories */}
      {shouldShowCategories && (
        <div className="flex flex-wrap justify-center gap-3">
          {normalizedFAQs.map((category) => {
            const Icon = ICONS[category.icon] || ICONS.default;
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 flex items-center gap-2 rounded-full border transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                aria-pressed={isActive}
                aria-label={`View ${category.title} FAQs`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{category.title}</span>
                <span className="text-xs opacity-75">
                  ({category.questions.length})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* FAQ Questions for Active Category */}
      <div className="max-w-3xl mx-auto space-y-4">
        {activeCategoryData ? (
          activeCategoryData.questions.map((faq, index) => {
            const isOpen = openQuestionIndex === index;
            
            return (
              <div
                key={faq.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span className="font-medium text-left text-gray-800 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`w-5 h-5 flex-shrink-0 transform transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    className="px-4 py-3 bg-white text-gray-700 border-t"
                  >
                    {/* Handle both plain text and HTML answers */}
                    {typeof faq.answer === 'string' ? (
                      faq.answer.includes('<') ? (
                        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                      ) : (
                        <p className="whitespace-pre-line">{faq.answer}</p>
                      )
                    ) : (
                      <p>{String(faq.answer)}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No FAQs available for this category.</p>
          </div>
        )}
      </div>

      {/* Show all categories if only one exists (no tabs) */}
      {!shouldShowCategories && normalizedFAQs.length === 1 && (
        <div className="max-w-3xl mx-auto space-y-4">
          {normalizedFAQs[0].questions.map((faq, index) => {
            const isOpen = openQuestionIndex === index;
            
            return (
              <div
                key={faq.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span className="font-medium text-left text-gray-800 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`w-5 h-5 flex-shrink-0 transform transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    className="px-4 py-3 bg-white text-gray-700 border-t"
                  >
                    {typeof faq.answer === 'string' ? (
                      faq.answer.includes('<') ? (
                        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                      ) : (
                        <p className="whitespace-pre-line">{faq.answer}</p>
                      )
                    ) : (
                      <p>{String(faq.answer)}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FAQSection;
