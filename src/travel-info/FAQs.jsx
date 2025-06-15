import React, { useState } from "react";
import {
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const FAQPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const faqCategories = [
    { id: "all", name: "All Questions", icon: "🔍" },
    { id: "visa", name: "Visa & Entry", icon: "🛂" },
    { id: "trekking", name: "Trekking & Activities", icon: "🥾" },
    { id: "accommodation", name: "Accommodation", icon: "🏨" },
    { id: "money", name: "Money & Expenses", icon: "💰" },
    { id: "culture", name: "Culture & Customs", icon: "🙏" },
    { id: "food", name: "Food & Drink", icon: "🍽️" },
  ];

  const faqs = [
    {
      id: 1,
      question: "Do I need a visa before arriving in Nepal?",
      answer:
        "Most nationalities can obtain a visa on arrival at Tribhuvan International Airport or at major land border crossings. Visa fees are $30 (15 days), $50 (30 days), or $125 (90 days), payable in cash. For a smoother process, you can fill out the application form online at the Nepal Immigration website before arrival. SAARC country nationals (except Afghanistan) receive a free 30-day visa.",
      category: "visa",
      popular: true,
    },
    {
      id: 2,
      question: "Is travel insurance required for trekking?",
      answer:
        "Yes, comprehensive travel insurance is absolutely mandatory for trekking in Nepal. Your policy must cover high-altitude trekking (up to 6,000m), helicopter evacuation, and medical treatment. A helicopter rescue from places like Everest Base Camp can cost $5,000-$10,000. Verify your policy specifically covers 'trekking' or 'hiking' as some general travel policies exclude these activities. Many trekking companies will verify your insurance details before departure.",
      category: "trekking",
      popular: true,
    },
    {
      id: 3,
      question: "What's the best time to visit Nepal?",
      answer:
        "The optimal seasons for visiting Nepal are autumn (September-November) and spring (March-May). These periods offer the clearest skies, moderate temperatures, and spectacular mountain views - perfect for trekking and outdoor activities. Winter (December-February) brings colder temperatures but fewer tourists and still offers clear mountain views - great for lower-altitude treks. Summer/monsoon season (June-August) brings heavy rainfall, cloudy skies, and leeches in forest areas, but offers lush landscapes, fewer tourists, and is ideal for rain shadow areas like Upper Mustang and Dolpo.",
      category: "trekking",
      popular: true,
    },
    {
      id: 4,
      question: "What about altitude sickness during treks?",
      answer:
        "Altitude sickness (AMS) is a serious concern for trekkers in Nepal, especially on routes that go above 3,000m. To minimize risk: (1) Ascend slowly (no more than 500m elevation gain per day above 3,000m), (2) Include acclimatization days, (3) Stay hydrated with 3-4 liters of water daily, (4) Consider preventive medication like Diamox (consult your doctor), (5) Recognize early symptoms: headache, nausea, dizziness, fatigue, and (6) If symptoms worsen, descend immediately - this is the only guaranteed cure. Remember: physical fitness has no relation to altitude sickness susceptibility; it can affect anyone regardless of age or fitness level.",
      category: "trekking",
      popular: true,
    },
    {
      id: 5,
      question: "Are credit cards widely accepted in Nepal?",
      answer:
        "Credit cards are accepted at higher-end hotels, restaurants and shops in Kathmandu, Pokhara and other major tourist areas. However, many small businesses, tea houses on trekking routes, and rural areas operate cash-only. Visa and MasterCard are most widely accepted; American Express less so. Most establishments that accept cards add a 3-4% surcharge. ATMs are readily available in major cities but become scarce in trekking regions. Always carry sufficient cash (Nepali Rupees) when heading to remote areas. The higher you go in altitude, the more expensive things get, and no credit cards are accepted in most mountain tea houses.",
      category: "money",
      popular: false,
    },
    {
      id: 6,
      question: "What's the deal with Nepal's famous Dal Bhat?",
      answer:
        "Dal Bhat is Nepal's national dish and trekking fuel! This hearty meal consists of steamed rice (bhat) served with lentil soup (dal), vegetable curry, pickles (achar), and sometimes meat curry. The magic of Dal Bhat lies in the unlimited refills - once you finish your plate, the server will come around with seconds (and thirds!) at no extra cost. This protein-rich, carbohydrate-loaded meal provides sustained energy for trekking, which is why you'll hear guides say '24 hour dal bhat power!' A typical Dal Bhat costs 500-800 NPR in trekking regions, with prices increasing with altitude. Eating like a local means enjoying this twice daily!",
      category: "food",
      popular: false,
    },
    {
      id: 7,
      question: "How fit do I need to be for trekking in Nepal?",
      answer:
        "Nepal offers treks for all fitness levels, but even the easiest routes require basic fitness and comfort with walking for multiple hours daily. For popular treks like Everest Base Camp or Annapurna Circuit, you should be able to walk 5-7 hours per day with a light daypack, over multiple consecutive days. Altitude makes trekking more challenging regardless of fitness. The best preparation includes: (1) Regular cardio exercise 2-3 months before your trip, (2) Strengthening exercises for legs and core, (3) Practice hikes with your daypack, especially on hills, (4) Breaking in your hiking boots well before the trek. Remember that mental determination often matters as much as physical fitness - many routes are more about persistence than athletic ability.",
      category: "trekking",
      popular: false,
    },
    {
      id: 8,
      question: "What type of accommodation can I expect during treks?",
      answer:
        "Most popular trekking routes in Nepal like Everest, Annapurna, and Langtang offer tea house accommodation - simple lodges run by local families. Standard tea houses provide: Basic twin rooms with simple beds and blankets (bringing your own sleeping bag is recommended), Shared bathrooms (private bathrooms available in some locations for higher price), Common dining areas often with a heating stove, Basic menu with Nepali and Western food options. Comfort levels decrease with altitude, and prices increase (from $3-5 at lower elevations to $15-20 at higher points). More remote treks like Upper Dolpo or Kanchenjunga require camping equipment and support. Higher-end 'luxury' tea houses with better amenities are emerging on popular routes for travelers seeking more comfort.",
      category: "accommodation",
      popular: false,
    },
    {
      id: 9,
      question:
        "How do I get an internet connection and phone service in Nepal?",
      answer:
        "Getting connected in Nepal is straightforward: Purchase a local SIM card at Kathmandu airport or from Nepal Telecom (NTC) or Ncell shops in major cities. You'll need your passport. NTC offers better coverage in remote mountain areas, while Ncell has faster data in cities. Data packages are inexpensive (approximately $10 for 10GB). During treks, most tea houses offer Wi-Fi for an additional fee ($2-5 per device), but speeds decrease significantly at higher altitudes. Above 4,000m, connectivity becomes limited and unreliable. For emergency communication in very remote areas, consider renting a satellite phone or communicator device. Power outages are common, so bring a power bank for charging devices.",
      category: "money",
      popular: false,
    },
    {
      id: 10,
      question: "What are Nepal's unique cultural customs I should know about?",
      answer:
        "Nepal has rich cultural traditions to respect: (1) Greet people with 'Namaste' with palms together, (2) Remove shoes before entering homes and temples, (3) Dress modestly when visiting religious sites (covered shoulders and knees), (4) Ask permission before photographing people, especially during ceremonies, (5) Public displays of affection are frowned upon, (6) The head is considered sacred - avoid touching people's heads, (7) Eat with your right hand only (left hand is considered unclean), (8) Walk clockwise around Buddhist stupas and Hindu temples, (9) Don't step over people or food, (10) Pointing with a single finger is considered rude - use your whole hand or chin instead. Nepali people are generally understanding of cultural differences but greatly appreciate visitors who make an effort to respect local customs.",
      category: "culture",
      popular: true,
    },
    {
      id: 11,
      question: "What permits do I need for trekking in Nepal?",
      answer:
        "Trekking permits in Nepal depend on your route: (1) All treks require a TIMS Card (Trekkers' Information Management System) - approximately $10 per person. (2) National Park Entry Permits are needed for treks within national parks (Sagarmatha/Everest: $30, Annapurna: $30, Langtang: $30). (3) Special Region Permits are required for restricted areas like Upper Mustang ($500 for 10 days), Upper Dolpo ($500 for 10 days), and Kanchenjunga ($20 per week). Most trekking agencies handle permit arrangements if you're going with a guide. Independent trekkers can obtain permits in Kathmandu from the Nepal Tourism Board office or the Immigration Department. Always carry your permits during your trek as they're checked at multiple checkpoints.",
      category: "trekking",
      popular: false,
    },
    {
      id: 12,
      question: "Is it safe to drink the water in Nepal?",
      answer:
        "Tap water in Nepal is not safe to drink without treatment. Here are your options: (1) Bottled water is widely available in cities and along major trekking routes, but creates plastic waste. (2) Water purification tablets are inexpensive and effective. (3) SteriPEN or UV purifiers work well and are environmentally friendly. (4) Many trekking lodges offer boiled water for a fee (cheaper than bottled water). (5) Portable water filters are excellent for longer treks. Tea houses at higher elevations collect and boil water from local streams. The environmental impact of plastic bottles is significant in Nepal, so consider bringing your own purification method. Even when brushing teeth, use purified water. Ice in drinks should be avoided unless you're certain it's made from purified water.",
      category: "food",
      popular: false,
    },
    {
      id: 13,
      question: "Do I need a guide or porter for trekking?",
      answer:
        "While some routes can be done independently, hiring a guide and/or porter is highly recommended for several reasons: (1) Safety - guides know the terrain, weather patterns, and how to handle emergencies including altitude sickness. (2) Cultural insight - guides explain local customs, traditions, and help with language barriers. (3) Convenience - guides handle permits, accommodations, and logistics. (4) Employment - tourism provides vital income for local communities. (5) Some remote areas legally require guides. Porters typically carry up to 15kg of your belongings, allowing you to trek with just a daypack. Current rates (2024) are approximately $25-30/day for guides and $20-25/day for porters, plus tips. Many trekkers choose a guide-porter combination (one person who both guides and carries some weight) as a cost-effective option.",
      category: "trekking",
      popular: false,
    },
    {
      id: 14,
      question: "How much money should I budget for Nepal?",
      answer:
        "Nepal can accommodate various budgets. For daily expenses excluding trekking: Budget travelers can manage on $30-40/day (basic accommodation, local meals, public transport). Mid-range travelers should budget $50-100/day (better hotels, mix of Western/local food, taxis). Luxury travelers will spend $150+/day (top hotels, fine dining, private transport). For trekking, add: $25-50/day for food and accommodation on the trail (prices increase with altitude). $25-30/day for a guide and $20-25/day for a porter if hired. Permit costs (varies by region). Other expenses to consider: Souvenirs and handicrafts, Entry fees for cultural sites ($10-20 per major site), Optional activities like paragliding ($100), mountain flights ($200), or rafting ($60+). ATMs are available in major cities, but trekking regions require cash. Most places only accept Nepali Rupees, so exchange money in Kathmandu or Pokhara.",
      category: "money",
      popular: true,
    },
    {
      id: 15,
      question: "What are Nepal's most spectacular festivals to experience?",
      answer:
        "Nepal's calendar is filled with vibrant festivals: (1) Dashain (Oct) - Nepal's biggest festival celebrating the victory of good over evil with kite flying, bamboo swings, and family gatherings. (2) Tihar/Diwali (Oct/Nov) - Festival of lights with beautiful oil lamp displays and flower decorations. (3) Holi (Mar) - The famous color festival where people throw colored powders and water. (4) Bisket Jatra (Apr) - Nepali New Year in Bhaktapur featuring massive chariot processions and tug-of-war competitions. (5) Indra Jatra (Sep) - Kathmandu's most exciting street festival with masked dances and the appearance of the Living Goddess Kumari. (6) Losar (Feb/Mar) - Tibetan New Year celebrated in mountain regions with colorful monastery rituals. (7) Buddha Jayanti (May) - Buddha's birthday celebrated at Lumbini (his birthplace) and Buddhist sites. For the most authentic experience, venture beyond tourist areas to see how locals celebrate these traditions.",
      category: "culture",
      popular: false,
    },
    {
      id: 16,
      question: "What should I do in case of an emergency while in Nepal?",
      answer:
        "For emergencies in Nepal: (1) Medical emergencies: Contact your travel insurance's 24-hour assistance line immediately. In Kathmandu, quality hospitals include CIWEC Hospital (specialized in travel medicine), Nepal Mediciti, and Grande International Hospital. (2) For trekking emergencies: Alert your guide immediately. If independent, contact the nearest tea house owner for help. (3) Important emergency numbers: Tourist Police: 1144, Ambulance: 102, Police: 100. (4) For helicopter evacuation (typically needed for severe altitude sickness): Contact your insurance's emergency line or, if with a trekking company, they will arrange this. (5) Keep your embassy/consulate contact information handy. (6) The Nepal Tourism Board can also assist tourists in emergency situations: +977-1-4256909. Always keep physical and digital copies of your insurance policy, passport, and emergency contacts.",
      category: "trekking",
      popular: false,
    },
    {
      id: 17,
      question: "What vaccinations do I need for Nepal?",
      answer:
        "Recommended vaccinations for Nepal include: (1) Routine vaccines (MMR, diphtheria-tetanus-pertussis, varicella, polio, flu shot), (2) Hepatitis A and Typhoid (highly recommended due to potential food/water contamination), (3) Hepatitis B (for longer stays), (4) Japanese Encephalitis (for rural areas, especially during monsoon), (5) Rabies (strongly considered for trekkers and those visiting rural areas), (6) COVID-19 vaccines and boosters. Consult with a travel medicine specialist at least 4-6 weeks before your trip, as some vaccines require multiple doses. No vaccines are officially required for entry into Nepal (unless you're arriving from a Yellow Fever endemic country), but protecting your health is important. Remember that malaria is present in the Terai (lowland) regions of Nepal, though not in Kathmandu or trekking areas above 2,000m. Consider appropriate prophylaxis if visiting these areas.",
      category: "trekking",
      popular: false,
    },
    {
      id: 18,
      question:
        "What kind of power outlets are used in Nepal and will I need an adapter?",
      answer:
        "Nepal uses Type C, D, and M electrical outlets with a standard voltage of 230V and frequency of 50Hz. Type C is the European-style outlet with two round pins, Type D has three round pins in a triangular pattern, and Type M has three larger round pins. Most hotels and guesthouses in tourist areas have at least one of these types. A universal travel adapter with surge protection is your best option. Power outages (load shedding) are common throughout Nepal, especially during the dry season, though much improved in recent years. Many accommodations have backup generators or solar systems, but it's wise to bring a power bank for charging essential devices. In trekking regions, tea houses often charge for device charging (100-500 NPR depending on altitude) as power is limited and expensive in remote areas.",
      category: "accommodation",
      popular: false,
    },
    {
      id: 19,
      question:
        "Can I trek in Nepal independently or do I need to book with an agency?",
      answer:
        "Trekking independently is possible on many popular routes in Nepal, including the Annapurna Circuit, Everest Base Camp, and Langtang Valley. Benefits of independent trekking include flexibility with your itinerary and potentially lower costs. However, since 2023, Nepal has implemented new regulations requiring all trekkers to hire at least a registered guide (not necessarily a full agency) for safety reasons. Some remote regions have always required guides and special permits, including Upper Mustang, Upper Dolpo, Manaslu, Kanchenjunga, and Tsum Valley. Even if legally possible, hiring at least a guide is recommended for safety, cultural insights, and supporting the local economy. The middle ground many trekkers choose is hiring a guide and arranging everything else themselves, rather than booking a full-service package. This provides safety and knowledge while maintaining some independence and keeping costs lower.",
      category: "trekking",
      popular: false,
    },
    {
      id: 20,
      question:
        "What's the local transportation like in Kathmandu and Pokhara?",
      answer:
        "Local transportation in Nepal's major cities includes: (1) Taxis: Abundant in Kathmandu and Pokhara, but always negotiate the fare before entering or insist on using the meter (rarely used without asking). Airport to Thamel typically costs 700-900 NPR. (2) Ride-sharing apps: Pathao and InDrive work in Kathmandu and Pokhara, often cheaper than taxis. (3) Local buses: Very cheap (15-30 NPR) but crowded and challenging to navigate without local knowledge. (4) Tempo: Small three-wheeled electric vehicles following fixed routes in Kathmandu (15-20 NPR). (5) Rickshaws: Found in tourist areas, good for short distances after price negotiation. (6) Walking: Both cities have areas enjoyable to explore on foot, though Kathmandu's narrow sidewalks and traffic require caution. (7) Motorcycle rental: Available for experienced riders with international driving licenses (1,000-1,500 NPR/day). Kathmandu traffic is chaotic by Western standards, so choose your transportation method based on your comfort level.",
      category: "money",
      popular: false,
    },
  ];

  const handleToggleFAQ = (id) => {
    if (openFAQ === id) {
      setOpenFAQ(null);
    } else {
      setOpenFAQ(id);
    }
  };

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularFAQs = faqs.filter((faq) => faq.popular);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="inline-flex items-center gap-3 mb-4">
              <QuestionMarkCircleIcon className="w-12 h-12" />
              <h1 className="text-5xl md:text-6xl font-bold">FAQ</h1>
            </div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">
              Everything you need to know about traveling in Nepal
            </p>
          </div>
        </div>
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-pulse">
          ❓
        </div>
        <div className="absolute bottom-20 right-10 text-4xl opacity-30 animate-bounce">
          🇳🇵
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Search and Filter */}
        <section className="space-y-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-12 pr-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all"
              />
              <svg
                className="absolute left-4 top-4 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-center transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === category.id
                    ? "bg-purple-100 text-purple-800 font-medium shadow-md"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Popular Questions */}
        {searchTerm === "" && activeCategory === "all" && (
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-800">
                🔥 Popular Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Quick answers to our most frequently asked questions
              </p>
            </div>

            <div className="space-y-4">
              {popularFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <button
                    onClick={() => handleToggleFAQ(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <h3 className="text-xl font-bold text-gray-800">
                      {faq.question}
                    </h3>
                    <span className="text-purple-600 ml-4">
                      {openFAQ === faq.id ? (
                        <ChevronUpIcon className="h-6 w-6" />
                      ) : (
                        <ChevronDownIcon className="h-6 w-6" />
                      )}
                    </span>
                  </button>

                  {openFAQ === faq.id && (
                    <div className="p-6 pt-0">
                      <p className="text-gray-600">{faq.answer}</p>
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {
                            faqCategories.find((cat) => cat.id === faq.category)
                              .icon
                          }{" "}
                          {
                            faqCategories.find((cat) => cat.id === faq.category)
                              .name
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All FAQs or Filtered Results */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800">
              {searchTerm !== ""
                ? `Search Results (${filteredFAQs.length})`
                : activeCategory !== "all"
                ? `${
                    faqCategories.find((cat) => cat.id === activeCategory).icon
                  } ${
                    faqCategories.find((cat) => cat.id === activeCategory).name
                  } (${filteredFAQs.length})`
                : "All Questions"}
            </h2>
          </div>

          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <button
                    onClick={() => handleToggleFAQ(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <h3 className="text-xl font-bold text-gray-800">
                      {faq.question}
                    </h3>
                    <span className="text-purple-600 ml-4">
                      {openFAQ === faq.id ? (
                        <ChevronUpIcon className="h-6 w-6" />
                      ) : (
                        <ChevronDownIcon className="h-6 w-6" />
                      )}
                    </span>
                  </button>

                  {openFAQ === faq.id && (
                    <div className="p-6 pt-0">
                      <p className="text-gray-600">{faq.answer}</p>
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {
                            faqCategories.find((cat) => cat.id === faq.category)
                              .icon
                          }{" "}
                          {
                            faqCategories.find((cat) => cat.id === faq.category)
                              .name
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-gray-50 rounded-xl">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No results found
              </h3>
              <p className="text-gray-600">
                Try different keywords or browse categories instead
              </p>
            </div>
          )}
        </section>

        {/* Still Have Questions */}
        <section className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-12 text-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-800">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Can't find what you're looking for? Our travel experts are ready
              to help with personalized advice for your Nepal adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                Contact Us
              </button>
              <button className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-purple-600 hover:text-white transition-all">
                Chat Now
              </button>
            </div>
          </div>
        </section>

        {/* Nepal Travel Facts */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-800">
              🇳🇵 Quick Nepal Facts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential information for your journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="text-2xl mb-3">⏰</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Local Time
              </h3>
              <p className="text-gray-600">Nepal Standard Time (GMT+5:45)</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="text-2xl mb-3">💰</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Currency</h3>
              <p className="text-gray-600">Nepali Rupee (NPR)</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="text-2xl mb-3">🔌</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Power</h3>
              <p className="text-gray-600">230V, 50Hz (Types C, D, M)</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="text-2xl mb-3">📞</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Country Code
              </h3>
              <p className="text-gray-600">+977</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="text-2xl mb-3">🗣️</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Languages
              </h3>
              <p className="text-gray-600">
                Nepali (official), English (widely spoken in tourist areas)
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="text-2xl mb-3">☎️</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Emergency
              </h3>
              <p className="text-gray-600">
                Tourist Police: 1144, Ambulance: 102, Police: 100
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQPage;
