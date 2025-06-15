import { useState, Fragment } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon, BookOpenIcon, UserCircleIcon, CurrencyDollarIcon, GlobeAltIcon, TicketIcon } from '@heroicons/react/24/outline';

const FAQSection = ({ faqCategories }) => {
  const [activeCategory, setActiveCategory] = useState(faqCategories[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const getCategoryIcon = (category) => {
    const icons = {
      practical: BookOpenIcon,
      booking: TicketIcon,
      financial: CurrencyDollarIcon,
      eligibility: UserCircleIcon,
      general: GlobeAltIcon
    };
    const Icon = icons[category.icon] || BookOpenIcon;
    return <Icon className="w-5 h-5 mr-2 text-blue-600" />;
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to know about the Everest Base Camp Trek
          </p>
          
          {/* Search Input */}
          <div className="mt-8 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="lg:flex lg:gap-8">
          {/* Category Navigation */}
          <div className="lg:w-64 mb-8 lg:mb-0">
            <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">Categories</h3>
              <nav className="space-y-2">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                      activeCategory === category.id 
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {getCategoryIcon(category)}
                    {category.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="flex-1">
            {filteredCategories.map((category) => (
              <div 
                key={category.id}
                className={`${activeCategory === category.id ? 'block' : 'hidden'} space-y-4`}
              >
                <div className="flex items-center mb-6">
                  {getCategoryIcon(category)}
                  <h3 className="text-2xl font-bold text-gray-900">{category.title}</h3>
                </div>

                <div className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <Disclosure key={index} as="div" className="group">
                      {({ open }) => (
                        <div className="border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                          <Disclosure.Button className="flex justify-between items-center w-full px-6 py-4 text-left">
                            <span className="text-lg font-medium text-gray-900">
                              {faq.question}
                            </span>
                            <ChevronDownIcon
                              className={`w-6 h-6 transform transition-transform ${
                                open ? 'rotate-180 text-blue-600' : 'text-gray-400'
                              }`}
                            />
                          </Disclosure.Button>
                          
                          <Transition
                            as={Fragment}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform opacity-0 -translate-y-2"
                            enterTo="transform opacity-100 translate-y-0"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform opacity-100 translate-y-0"
                            leaveTo="transform opacity-0 -translate-y-2"
                          >
                            <Disclosure.Panel className="px-6 pb-4 pt-2 text-gray-600 prose max-w-none border-t border-gray-100">
                              {faq.answer}
                            </Disclosure.Panel>
                          </Transition>
                        </div>
                      )}
                    </Disclosure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Example usage
export default function ExampleFAQ() {
  const faqData = [
    {
      id: 'practical',
      title: 'Practical Information',
      icon: 'practical',
      questions: [
        {
          question: 'What physical fitness level is required?',
          answer: 'The Everest Base Camp Trek requires moderate to high physical fitness. You should be comfortable walking 5-7 hours daily with elevation gains. We recommend 2-3 months of preparation including cardio and strength training.'
        },
        {
          question: 'What is the best time to trek?',
          answer: 'The ideal seasons are Spring (March-May) and Autumn (September-November) when weather conditions are stable and skies are clear.'
        }
      ]
    },
    {
      id: 'booking',
      title: 'Booking & Cancellation',
      icon: 'booking',
      questions: [
        {
          question: 'How do I secure my booking?',
          answer: 'A 20% deposit secures your spot, with balance due on arrival. We offer flexible rescheduling up to 30 days before departure.'
        }
      ]
    }
    // Add other categories...
  ];

  return <FAQSection faqCategories={faqData} />;
}
