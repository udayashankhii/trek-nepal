import React, { useState } from 'react';
import { TruckIcon, GlobeAltIcon, ArrowPathIcon, MapIcon } from '@heroicons/react/24/outline';

const TransportationPage = () => {
  const [activeTab, setActiveTab] = useState('flights');

  const domesticAirlines = [
    {
      name: 'Buddha Air',
      logo: '✈️',
      reliability: 'Excellent',
      fleet: '15+ aircraft',
      features: ['Most reliable', 'Modern ATR fleet', 'Multiple daily flights', 'Best safety record'],
      website: 'buddhaair.com'
    },
    {
      name: 'Yeti Airlines',
      logo: '✈️',
      reliability: 'Very Good',
      fleet: '10+ aircraft',
      features: ['Well-established', 'Good mountain experience', 'Sister company to Tara Air'],
      website: 'yetiairlines.com'
    },
    {
      name: 'Shree Airlines',
      logo: '✈️',
      reliability: 'Good',
      fleet: '5+ aircraft',
      features: ['Newer airline', 'Competitive prices', 'Growing route network'],
      website: 'shreeairlines.com'
    },
    {
      name: 'Tara Air',
      logo: '✈️',
      reliability: 'Good',
      fleet: 'STOL aircraft',
      features: ['Mountain specialist', 'Serves remote airstrips', 'Operates to Lukla', 'Sister company to Yeti'],
      website: 'taraair.com'
    }
  ];

  const popularFlights = [
    {
      route: 'Kathmandu to Pokhara',
      duration: '25 min',
      cost: '$80-130',
      frequency: '15+ daily',
      scenic: true,
      views: 'Annapurna range',
      tips: 'Request right-side window seat for best mountain views'
    },
    {
      route: 'Kathmandu to Lukla',
      duration: '30 min',
      cost: '$180-220',
      frequency: '10+ daily (weather permitting)',
      scenic: true,
      views: 'Everest approach',
      tips: 'Morning flights most reliable; notorious for weather delays'
    },
    {
      route: 'Kathmandu to Bharatpur',
      duration: '20 min',
      cost: '$60-90',
      frequency: '5+ daily',
      scenic: false,
      views: 'Chitwan access',
      tips: 'Gateway to Chitwan National Park'
    },
    {
      route: 'Pokhara to Jomsom',
      duration: '20 min',
      cost: '$100-150',
      frequency: '3+ daily (morning only)',
      scenic: true,
      views: 'Annapurna & Dhaulagiri',
      tips: 'Only operates early morning due to afternoon winds'
    }
  ];

  const busOptions = [
    {
      type: 'Tourist Deluxe',
      comfort: 'High',
      cost: '$15-25',
      features: [
        'Reclining seats',
        'A/C',
        'Designated stops',
        'Reserved seating',
        'Onboard toilet',
        'Often includes water/snack'
      ],
      routes: ['Kathmandu-Pokhara', 'Kathmandu-Chitwan', 'Kathmandu-Lumbini'],
      tips: 'Book through hotel or reputable agency; Green Line is a trusted operator'
    },
    {
      type: 'Local Tourist Bus',
      comfort: 'Medium',
      cost: '$7-15',
      features: [
        'Basic comfortable seats',
        'Sometimes A/C',
        'Frequent stops',
        'Reserved seating'
      ],
      routes: ['Most major tourist destinations'],
      tips: "Depart from Kathmandus tourist bus park in Sorhakhutte or Kantipath"
    },
    {
      type: 'Local Bus',
      comfort: 'Basic',
      cost: '$3-10',
      features: [
        'Basic seats',
        'No A/C',
        'Frequent stops',
        'Often crowded',
        'Authentic experience'
      ],
      routes: ['Everywhere in Nepal'],
      tips: 'Very cheap but can be uncomfortable for long journeys; great cultural experience'
    },
    {
      type: 'Night Bus',
      comfort: 'Varies',
      cost: '$10-30',
      features: [
        'Sleeper or semi-sleeper options',
        'Saves daytime hours',
        'Blankets sometimes provided'
      ],
      routes: ['Longer distances between major cities'],
      tips: 'Check safety record; roads can be dangerous at night, especially in monsoon'
    }
  ];

  const rideSharingApps = [
    {
      name: 'Pathao',
      type: 'Motorbike & Car',
      area: 'Kathmandu Valley',
      payment: 'Cash/Digital',
      pros: ['Cheaper than taxis', 'Fast in traffic', 'App shows route/cost'],
      website: 'pathao.com/np'
    },
    {
      name: 'Tootle',
      type: 'Motorbike',
      area: 'Kathmandu Valley',
      payment: 'Cash/Digital',
      pros: ["Nepal's original ride-share', 'Very affordable', 'Good for short distances"],
      website: 'tootle.today'
    },
    {
      name: 'InDrive',
      type: 'Car',
      area: 'Kathmandu, Pokhara',
      payment: 'Cash only',
      pros: ['Negotiate your fare', 'No surge pricing', 'Longer distance options'],
      website: 'indrive.com'
    },
    {
      name: 'Sarathi',
      type: 'Car',
      area: 'Kathmandu Valley',
      payment: 'Cash/Digital',
      pros: ['Licensed drivers', 'Professional service', 'Safer option'],
      website: 'sarathi.cab'
    }
  ];

  const specialTransport = [
    {
      name: 'Kathmandu Cable Car',
      location: 'Chandragiri Hills',
      experience: 'Scenic ride to Chandragiri hilltop with temple and panoramic views',
      cost: '$15-22',
      tips: 'Great day trip from Kathmandu; stunning views on clear days'
    },
    {
      name: 'Janakpur Railway',
      location: 'Nepal-India border (Janakpur)',
      experience: "Nepal's only functioning passenger railway",
      cost: '$1-3',
      tips: 'More of a cultural experience than efficient transport'
    },
    {
      name: 'Timal Jeep Trail',
      location: 'Koshi region',
      experience: 'Off-road adventure through remote villages',
      cost: '$80-120 (full day jeep hire)',
      tips: 'Arrange through agencies in Kathmandu for authentic village experience'
    },
    {
      name: 'Manakamana Cable Car',
      location: 'Kurintar (halfway between Kathmandu and Pokhara)',
      experience: 'Steep climb to sacred Manakamana Temple',
      cost: '$10-20 round trip',
      tips: 'Often combined with Pokhara journey; excellent valley views'
    }
  ];

  const journeyShowcases = [
    {
      title: 'The Mountain Flight Experience',
      description: 'For those short on time but wanting to see Everest, mountain flights depart Kathmandu early morning, flying parallel to the Himalayan range with spectacular views of Everest and surrounding 8,000m peaks.',
      duration: '1 hour',
      cost: '$200-250',
      tips: 'Book window seats (left side better); go during Oct-Dec for clearest views',
      highlight: true
    },
    {
      title: 'The Scenic Bus Journey',
      description: 'The Kathmandu to Pokhara highway offers spectacular scenery following the Trishuli River through changing landscapes from hills to riverside villages with distant mountain views.',
      duration: '7-8 hours',
      cost: '$15-25',
      tips: 'Prithvi Highway views best from right side heading to Pokhara',
      highlight: false
    },
    {
      title: 'The Ultimate Road Trip',
      description: 'The newly constructed Kathmandu-Kerung Highway to the Tibet border crosses breathtaking landscapes including Langtang National Park with dramatic elevation changes and spectacular mountain vistas.',
      duration: '8-9 hours',
      cost: '$150-200 (private jeep)',
      tips: 'Permits required; best arranged through agencies',
      highlight: false
    },
    {
      title: 'Everest Base Camp Helicopter Tour',
      description: 'For the ultimate splurge, helicopter tours land at Everest Base Camp or Kalapatthar viewpoint with staggering views of Everest and surrounding peaks.',
      duration: '3-4 hours',
      cost: '$1,000-1,200 per person (shared)',
      tips: 'Book in Kathmandu; weather-dependent; morning flights best',
      highlight: true
    }
  ];

  const transportTips = [
    {
      title: "Mountain Flight Bookings",
      tip: "Always book Lukla flights with 2-3 buffer days due to frequent weather cancellations.",
      icon: "🌤️"
    },
    {
      title: "Taxi Negotiations",
      tip: "Always negotiate and agree on taxi fares before getting in. Expected fare from airport to Thamel is 700-900 NPR.",
      icon: "🚕"
    },
    {
      title: "Bus Safety",
      tip: "Avoid night buses during monsoon season (June-Sept) when landslides are common.",
      icon: "🚌"
    },
    {
      title: "Offline Navigation",
      tip: "Download offline maps as internet connectivity is unreliable outside major cities.",
      icon: "🗺️"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="inline-flex items-center gap-3 mb-4">
              <TruckIcon className="w-12 h-12" />
              <h1 className="text-5xl md:text-6xl font-bold">Transportation</h1>
            </div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">
              Navigate Nepal like a local - from mountain flights to bustling buses
            </p>
          </div>
        </div>
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-pulse">✈️</div>
        <div className="absolute bottom-20 right-10 text-4xl opacity-30 animate-bounce">🚌</div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        
        {/* Transport Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('flights')}
            className={`px-6 py-3 rounded-lg text-center transition-all duration-300 ${
              activeTab === 'flights'
                ? 'bg-blue-100 text-blue-800 font-medium shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            ✈️ Domestic Flights
          </button>
          <button
            onClick={() => setActiveTab('buses')}
            className={`px-6 py-3 rounded-lg text-center transition-all duration-300 ${
              activeTab === 'buses'
                ? 'bg-blue-100 text-blue-800 font-medium shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            🚌 Bus Travel
          </button>
          <button
            onClick={() => setActiveTab('rideshare')}
            className={`px-6 py-3 rounded-lg text-center transition-all duration-300 ${
              activeTab === 'rideshare'
                ? 'bg-blue-100 text-blue-800 font-medium shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            🛵 Ride Apps & Taxis
          </button>
          <button
            onClick={() => setActiveTab('special')}
            className={`px-6 py-3 rounded-lg text-center transition-all duration-300 ${
              activeTab === 'special'
                ? 'bg-blue-100 text-blue-800 font-medium shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            🚠 Unique Transport
          </button>
        </div>

        {/* Domestic Flights */}
        {activeTab === 'flights' && (
          <section className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
                <GlobeAltIcon className="w-10 h-10 text-blue-600" />
                Domestic Airlines
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The fastest way to traverse Nepal's challenging terrain. Flying saves days of travel time and offers spectacular views!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {domesticAirlines.map((airline, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="text-3xl">{airline.logo}</span>
                        {airline.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        airline.reliability === 'Excellent' 
                          ? 'bg-green-100 text-green-800' 
                          : airline.reliability === 'Very Good'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {airline.reliability}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 font-medium">Fleet: {airline.fleet}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Key Features</h4>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        {airline.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-blue-600 font-medium">
                      Website: {airline.website}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center space-y-4 mt-16">
              <h2 className="text-4xl font-bold text-gray-800">Popular Flight Routes</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Key connections for travelers with stunning mountain views
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {popularFlights.map((flight, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-8 shadow-lg border hover:shadow-xl transition-all duration-300 ${
                    flight.scenic ? 'border-blue-200' : 'border-gray-100'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-800">{flight.route}</h3>
                      {flight.scenic && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          Scenic Route
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Duration</p>
                        <p className="text-gray-700 font-medium">{flight.duration}</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Cost</p>
                        <p className="text-gray-700 font-medium">{flight.cost}</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Frequency</p>
                        <p className="text-gray-700 font-medium">{flight.frequency}</p>
                      </div>
                    </div>
                    
                    {flight.scenic && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-blue-800">
                          <span className="font-semibold">Views:</span> {flight.views}
                        </p>
                      </div>
                    )}
                    
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        <span className="font-semibold">💡 Tip:</span> {flight.tips}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-2xl p-8 border border-red-100">
              <div className="flex items-start gap-4">
                <div className="text-4xl">⚠️</div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-red-800">Flight Safety & Weather</h3>
                  <p className="text-red-700 text-lg">
                    Nepal's mountain airports like Lukla are considered some of the most challenging in the world. 
                    Flights operate visually (not with instruments) and are highly dependent on weather conditions.
                  </p>
                  <div className="bg-white bg-opacity-50 rounded-lg p-4">
                    <ul className="list-disc pl-5 text-red-800 space-y-2">
                      <li>Always book with buffer days for mountain flights</li>
                      <li>Morning flights have highest completion rates</li>
                      <li>Seasons with clearest conditions: Oct-Nov and Mar-Apr</li>
                      <li>Weather delays of 1-3 days are common in Lukla</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Bus Travel */}
        {activeTab === 'buses' && (
          <section className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
                <TruckIcon className="w-10 h-10 text-green-600" />
                Bus Travel in Nepal
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The backbone of Nepal's transportation system. Affordable, extensive, and an authentic cultural experience!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {busOptions.map((option, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-800">{option.type}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        option.comfort === 'High' 
                          ? 'bg-green-100 text-green-800' 
                          : option.comfort === 'Medium'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {option.comfort} Comfort
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Average Cost</h4>
                      <p className="text-gray-700">{option.cost}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Features</h4>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        {option.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Common Routes</h4>
                      <p className="text-green-700">{option.routes.join(', ')}</p>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        <span className="font-semibold">💡 Tip:</span> {option.tips}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-100">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-blue-800 text-center">The Quintessential Nepal Bus Experience</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white bg-opacity-75 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🎵</span>
                      <h4 className="font-bold text-gray-800">Musical Journey</h4>
                    </div>
                    <p className="text-gray-600">Expect Nepali pop music and Bollywood hits played at enthusiastic volumes - it's all part of the experience!</p>
                  </div>
                  
                  <div className="bg-white bg-opacity-75 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🛑</span>
                      <h4 className="font-bold text-gray-800">Frequent Stops</h4>
                    </div>
                    <p className="text-gray-600">Local buses stop frequently for passengers, meals, and bathroom breaks. A 6-hour journey can easily become 9.</p>
                  </div>
                  
                  <div className="bg-white bg-opacity-75 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🥘</span>
                      <h4 className="font-bold text-gray-800">Roadside Eateries</h4>
                    </div>
                    <p className="text-gray-600">Buses stop at local restaurants where you'll get authentic Nepali meals. Dal bhat power for the journey!</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Ride Apps & Taxis */}
        {activeTab === 'rideshare' && (
          <section className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
                <ArrowPathIcon className="w-10 h-10 text-purple-600" />
                Ride Apps & Taxis
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Convenient, affordable transport in urban areas. Nepal has its own local ride-sharing apps!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {rideSharingApps.map((app, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-800">{app.name}</h3>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {app.type}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Service Area</p>
                        <p className="text-gray-700 font-medium">{app.area}</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Payment</p>
                        <p className="text-gray-700 font-medium">{app.payment}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Advantages</h4>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        {app.pros.map((pro, i) => (
                          <li key={i}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-purple-600 font-medium">
                      Website: {app.website}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-100">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🚕</div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-yellow-800">Traditional Taxi Tips</h3>
                  <p className="text-yellow-700 text-lg">
                    Traditional taxis are plentiful in Kathmandu and Pokhara, but require some negotiation skills:
                  </p>
                  <div className="bg-white bg-opacity-50 rounded-lg p-4">
                    <ul className="list-disc pl-5 text-yellow-800 space-y-2">
                      <li><strong>Always negotiate before entering</strong> - meters exist but are rarely used</li>
                      <li><strong>Airport to Thamel:</strong> 700-900 NPR (pre-negotiate)</li>
                      <li><strong>Short rides in Kathmandu:</strong> 300-500 NPR</li>
                      <li><strong>Try to have exact change</strong> - drivers often claim not to have change</li>
                      <li><strong>Remember the taxi number</strong> - useful if you leave something behind</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Unique Transport */}
        {activeTab === 'special' && (
          <section className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
                <MapIcon className="w-10 h-10 text-red-600" />
                Unique Transport Experiences
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Beyond the ordinary - special transport experiences that create lasting memories!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {specialTransport.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-800">{item.name}</h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700"><span className="font-semibold">Location:</span> {item.location}</p>
                    </div>
                    
                    <p className="text-gray-600">{item.experience}</p>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700"><span className="font-semibold">Cost:</span> {item.cost}</p>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4">
                      <p className="text-orange-800 text-sm">
                        <span className="font-semibold">💡 Tip:</span> {item.tips}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center space-y-4 mt-16">
              <h2 className="text-4xl font-bold text-gray-800">Iconic Journey Showcases</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These signature transport experiences are destinations in themselves!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {journeyShowcases.map((journey, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-8 shadow-lg border hover:shadow-xl transition-all duration-300 ${
                    journey.highlight ? 'border-purple-200 bg-gradient-to-br from-white to-purple-50' : 'border-gray-100'
                  }`}
                >
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-800">{journey.title}</h3>
                    
                    <p className="text-gray-600">{journey.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Duration</p>
                        <p className="text-gray-700 font-medium">{journey.duration}</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Approx. Cost</p>
                        <p className="text-gray-700 font-medium">{journey.cost}</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <span className="font-semibold">💡 Insider Tip:</span> {journey.tips}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Smart Transport Tips */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800">🧠 Smart Transport Tips</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seasoned traveler insights to keep your journey smooth and hassle-free
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {transportTips.map((tip, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{tip.icon}</span>
                    <h3 className="text-xl font-bold text-gray-800">{tip.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Your Nepal Adventure Awaits</h2>
            <p className="text-xl max-w-2xl mx-auto">
              Whether soaring past Everest, winding through mountain roads, or zipping through Kathmandu's vibrant streets - 
              the journey is as magical as the destination in Nepal!
            </p>
            <div className="text-6xl">✈️🚌🚢</div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default TransportationPage;
