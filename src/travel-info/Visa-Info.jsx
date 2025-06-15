import React, { useState } from 'react';
import { GlobeAltIcon, CurrencyDollarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

const VisaInformationPage = () => {
  const [activeTab, setActiveTab] = useState('fees');

  const visaFees = [
    { duration: '15 Days', price: '$30', popular: false },
    { duration: '30 Days', price: '$50', popular: true },
    { duration: '90 Days', price: '$125', popular: false },
    { duration: 'Transit (24hrs)', price: '$5', popular: false }
  ];

  const entryPoints = [
    {
      name: 'Tribhuvan International Airport',
      location: 'Kathmandu',
      type: 'Airport',
      status: '24/7 Service',
      icon: '✈️'
    },
    {
      name: 'Pokhara International Airport', 
      location: 'Pokhara',
      type: 'Airport',
      status: 'Daily Service',
      icon: '✈️'
    },
    {
      name: 'Kakarvitta Border',
      location: 'Eastern Nepal',
      type: 'Land',
      status: '6AM - 7PM',
      icon: '🚗'
    },
    {
      name: 'Birgunj Border',
      location: 'Central Nepal', 
      type: 'Land',
      status: '6AM - 7PM',
      icon: '🚗'
    },
    {
      name: 'Bhairahawa Border',
      location: 'Western Nepal',
      type: 'Land', 
      status: '6AM - 7PM',
      icon: '🚗'
    }
  ];

  const funFacts = [
    {
      icon: '🏔️',
      title: 'Conservation Impact',
      description: 'Your visa fees directly support Himalayan conservation efforts and protect endangered wildlife like snow leopards and red pandas!'
    },
    {
      icon: '⚡',
      title: 'Speed Process',
      description: 'Online pre-application can reduce your arrival time from 45 minutes to just 10 minutes at immigration counters.'
    },
    {
      icon: '🎯',
      title: 'Easy Extensions',
      description: 'Extend your stay up to 150 days per visa year! Just visit immigration offices in Kathmandu or Pokhara.'
    },
    {
      icon: '🌟',
      title: 'SAARC Bonus',
      description: 'Citizens of SAARC countries (India, Pakistan, Bangladesh, etc.) get free 30-day visas - what a deal!'
    }
  ];

  const applicationSteps = [
    {
      step: '1',
      title: 'Prepare Documents',
      description: 'Valid passport (6+ months), digital photo (1.5" x 1.5"), and travel details ready.'
    },
    {
      step: '2', 
      title: 'Online Pre-Application',
      description: 'Fill out the form at the official Nepal Immigration portal to save time on arrival.'
    },
    {
      step: '3',
      title: 'Arrival & Payment',
      description: 'Show your receipt, pay fees in cash (USD/EUR), and get your visa stamp!'
    },
    {
      step: '4',
      title: 'Adventure Begins',
      description: 'Welcome to Nepal! Your Himalayan adventure starts now. 🇳🇵'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="inline-flex items-center gap-3 mb-4">
              <GlobeAltIcon className="w-12 h-12" />
              <h1 className="text-5xl md:text-6xl font-bold">Visa Information</h1>
            </div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">
              Your gateway to the roof of the world awaits! Simple, fast, and hassle-free visa process.
            </p>
          </div>
        </div>
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">🏔️</div>
        <div className="absolute bottom-20 right-10 text-4xl opacity-30 animate-pulse">🎯</div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        
        {/* Visa Fees Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
              <CurrencyDollarIcon className="w-10 h-10 text-green-600" />
              Visa Fees & Duration
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent pricing with no hidden fees. Choose the duration that fits your adventure timeline!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visaFees.map((fee, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  fee.popular
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                {fee.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center space-y-3">
                  <div className="text-3xl font-bold text-gray-800">{fee.price}</div>
                  <div className="text-lg text-gray-600">{fee.duration}</div>
                  {fee.duration === '30 Days' && (
                    <p className="text-sm text-green-600 font-medium">Perfect for most travelers</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Special Offers */}
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-8 border border-orange-200">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-orange-800">🎉 Special Benefits</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🆓</span>
                  <div>
                    <h4 className="font-semibold text-orange-800">SAARC Citizens</h4>
                    <p className="text-orange-700">Free 30-day visa for India, Bangladesh, Pakistan, Sri Lanka, Bhutan, Maldives, Afghanistan citizens</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">👶</span>
                  <div>
                    <h4 className="font-semibold text-orange-800">Children Under 10</h4>
                    <p className="text-orange-700">Free visa (still required) for all children under 10 years old</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Entry Points */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
              <MapPinIcon className="w-10 h-10 text-blue-600" />
              Official Entry Points
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple convenient entry options by air and land. All equipped with modern visa-on-arrival facilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entryPoints.map((point, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{point.icon}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      point.status.includes('24/7') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {point.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{point.name}</h3>
                    <p className="text-gray-600 text-sm">{point.location}</p>
                    <p className="text-gray-500 text-xs mt-1">{point.type} Entry Point</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fun Facts */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800">🌟 Interesting Facts & Tips</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Beyond the basics - discover what makes Nepal's visa process unique and traveler-friendly!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {funFacts.map((fact, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{fact.icon}</span>
                    <h3 className="text-xl font-bold text-gray-800">{fact.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{fact.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
              <ClockIcon className="w-10 h-10 text-purple-600" />
              Simple Application Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From preparation to adventure - your visa journey in 4 easy steps!
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 to-green-400 hidden lg:block"></div>
            
            <div className="space-y-12">
              {applicationSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
                    {step.step}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-12 text-center text-white">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Ready for Your Nepal Adventure?</h2>
            <p className="text-xl max-w-2xl mx-auto">
              With your visa sorted, you're just steps away from experiencing the magic of the Himalayas, warm Nepali hospitality, and adventures of a lifetime!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Start Application
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default VisaInformationPage;