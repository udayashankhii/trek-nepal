


import React from "react";

const OverviewPage = () => {
  return (
    <main className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-75 overflow-hidden bg-gray-900">
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/annapurna.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 1
          }}
        >
          {/* Fallback gradient if image doesn't load */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
        </div>

        {/* Dark Overlay for text readability */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-40"
          style={{ zIndex: 2 }}
        ></div>

        {/* Hero Content */}
        <div 
          className="relative text-center text-white px-4 max-w-5xl"
          style={{ zIndex: 3 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-2xl">
            Find Your Nirvana in the Himalayas
          </h1>
          <p className="text-lg md:text-2xl mb-8 drop-shadow-lg">
            Embark on a journey of a lifetime with EverTrekNepal
          </p>
          
            < a href="/trekking-in-nepal"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
            Start Your Journey
          </a>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto md:flex md:items-center md:space-x-8">
          {/* Story Text */}
          <div className="md:w-1/2 md:pr-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              EverTrekNepal began with a simple idea between two
              friends, <strong>Rajib Adhikari</strong> and{" "}
              <strong>Udaya Shankhi</strong>. Both were successful tech
              developers in Kathmandu, but every chance they got, they escaped
              the 9-5 grind to trek in the Himalayas. In 2010, fueled by their
              shared passion for the mountains, they traded keyboards for hiking
              boots and turned their weekend adventures into a full-time
              calling.
            </p>
            <p className="text-gray-700 leading-relaxed">
              What started as a dream to share the Himalayas with a few
              colleagues has grown into a thriving adventure travel company.
              Rajib and Udaya infused their tech-savvy mindset into the
              business, making trip planning and logistics seamless for
              travelers. Their mission from day one was clear: to offer
              authentic, life-changing experiences in Nepal and the greater
              Himalayan region, with a focus on innovation, safety, and
              sustainability. Today, EverTrekNepal has guided
              thousands of trekkers to their dreams, all while staying true to
              the founders' original vision of adventure, community, and
              integrity.
            </p>
          </div>
          {/* Story Image */}
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img
              src="/langtang.jpg"
              alt="Founders Rajib and Udaya"
              className="w-full rounded-lg shadow-lg object-cover h-96"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Local Guides */}
            <div className="text-center p-6 hover:shadow-xl transition-shadow rounded-lg bg-white">
              <div className="text-5xl mb-4">🧭</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Local Guides
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Explore with people who call these mountains home. Our guides
                are born and raised in the regions we trek, providing
                insider knowledge and genuine connections that no outsider can
                match.
              </p>
            </div>
            {/* Immersive Itineraries */}
            <div className="text-center p-6 hover:shadow-xl transition-shadow rounded-lg bg-white">
              <div className="text-5xl mb-4">🏔️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Immersive Itineraries
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Go beyond sightseeing. Every journey is filled with cultural
                encounters, off-the-beaten-path trails, and meaningful
                experiences. Live the local culture and leave with stories
                you'll cherish.
              </p>
            </div>
            {/* Tech-Enabled Convenience */}
            <div className="text-center p-6 hover:shadow-xl transition-shadow rounded-lg bg-white">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Tech‑Enabled Convenience
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enjoy a hassle-free adventure powered by technology. From easy
                online booking to digital itineraries and GPS tracking, our
                tech-savvy founders ensure your trip is smooth and
                connected.
              </p>
            </div>
            {/* Sustainability & Safety */}
            <div className="text-center p-6 hover:shadow-xl transition-shadow rounded-lg bg-white">
              <div className="text-5xl mb-4">♻️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Sustainability & Safety
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Travel responsibly with a company that puts safety and the
                planet first. We follow strict safety protocols and
                eco-friendly practices – leaving nothing behind but footprints
                and positive impacts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Guides & Community Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto md:flex md:items-center md:space-x-8">
          {/* Image (Local community) */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img
              src="/guide.jpg"
              alt="Our local guides and community"
              className="w-full rounded-2xl shadow-2xl object-cover h-96"
            />
          </div>
          {/* Text Content */}
          <div className="md:w-1/2 md:pl-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Local Guides &amp; Community
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We believe adventure travel is best led by those who live it every
              day. That's why we hire local guides and staff from the
              communities we explore. By choosing local, we directly support
              local economies and help preserve these beautiful regions for
              future generations. Our tours create jobs and
              empower our guides to share their heritage, ensuring your trip
              benefits the people and places you visit.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cultural exchange is at the heart of what we do. You won't just
              pass through villages – you'll become part of them. Enjoy
              home-cooked meals in remote homesteads, learn traditional songs
              under the stars, and forge genuine connections. Our guides act as
              cultural ambassadors, bridging worlds so that travelers and locals
              learn from each other.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We are deeply committed to sustainable, responsible tourism.
              From adhering to Leave No Trace principles to supporting
              community-led conservation projects, we strive to minimize our
              footprint. Safety is equally
              paramount – our guides are trained in first aid and altitude
              awareness, and we never compromise on well-being in pursuit of
              adventure. When you travel with us,
              you can feel confident that your journey is both ethically and
              safely managed.
            </p>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Meet Our Team
          </h2>
          <p className="text-gray-700 text-center max-w-2xl mx-auto mb-12">
            The passionate people behind EverTrekNepal are our
            greatest asset. Our team of local experts, seasoned guides, and
            dedicated support staff is here to make your journey unforgettable
            and safe every step of the way.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <img
                src="/rajib.jpg"
                alt="Rajib Adhikari"
                className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-orange-500"
              />
              <p className="mt-4 text-lg font-semibold text-gray-800">
                Rajib Adhikari
              </p>
              <p className="text-sm text-gray-600">
                Co-Founder &amp; Adventure Leader
              </p>
            </div>
            {/* Team Member 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <img
                src="/udaya.jpg"
                alt="Udaya Shankhi"
                className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-orange-500"
              />
              <p className="mt-4 text-lg font-semibold text-gray-800">
                Udaya Shankhi
              </p>
              <p className="text-sm text-gray-600">
                Co-Founder &amp; Tech Director
              </p>
            </div>
            {/* Team Member 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <img
                src="/images/team_pasang.jpg"
                alt="Abhishek Dhital"
                className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-orange-500"
              />
              <p className="mt-4 text-lg font-semibold text-gray-800">
                Abhishek Dhital
              </p>
              <p className="text-sm text-gray-600">Co-Founder &amp; Lead Mountain Guide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline/Achievements Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Our Journey So Far
          </h2>
          <ul className="text-gray-700 space-y-4 max-w-2xl mx-auto">
            <li className="flex items-start">
              <span className="font-semibold text-orange-600 mr-2 text-xl">2010:</span>
              <span>EverTrekNepal is founded in Kathmandu by Rajib and Udaya,
              turning a passion into a mission.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-orange-600 mr-2 text-xl">2015:</span>
              <span>Reached <strong>1,000</strong> trekkers guided, as our small startup grows
              through word of mouth and a reputation for excellence.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-orange-600 mr-2 text-xl">2020:</span>
              <span>Expanded our expeditions beyond Nepal, adding adventures in Bhutan
              and Tibet, while maintaining our personalized touch.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-orange-600 mr-2 text-xl">2025:</span>
              <span>Celebrated over <strong>10,000</strong> adventurers guided.
              Honored with a national Eco-Tourism Excellence award for our
              sustainable practices.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Traveler Testimonials
          </h2>
          <p className="text-gray-700 text-center max-w-2xl mx-auto mb-12">
            Don't just take our word for it – hear what our travelers have to
            say about their Nirvana experience:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="flex justify-center mb-4">
                <img
                  src="/images/testimonial_alice.jpg"
                  alt="Alice J."
                  className="w-20 h-20 object-cover rounded-full border-4 border-orange-200"
                />
              </div>
              <p className="text-gray-700 italic mb-4 text-center">
                "Truly the adventure of a lifetime! The team made us feel like
                family, and the Himalayas were beyond breathtaking. I can't
                imagine exploring Nepal any other way."
              </p>
              <p className="font-semibold text-gray-800 text-center">Alice J.</p>
              <p className="text-sm text-gray-600 text-center">
                USA – Everest Base Camp Trek
              </p>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="flex justify-center mb-4">
                <img
                  src="/images/testimonial_mark.jpg"
                  alt="Mark T."
                  className="w-20 h-20 object-cover rounded-full border-4 border-orange-200"
                />
              </div>
              <p className="text-gray-700 italic mb-4 text-center">
                "Our guides were unbelievably knowledgeable and friendly. I
                learned so much about Nepali culture. The itinerary was
                immersive and thoughtful – nothing like a standard tour."
              </p>
              <p className="font-semibold text-gray-800 text-center">Mark T.</p>
              <p className="text-sm text-gray-600 text-center">UK – Annapurna Circuit</p>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="flex justify-center mb-4">
                <img
                  src="/images/testimonial_priya.jpg"
                  alt="Priya S."
                  className="w-20 h-20 object-cover rounded-full border-4 border-orange-200"
                />
              </div>
              <p className="text-gray-700 italic mb-4 text-center">
                "Every detail was handled seamlessly, from the moment I booked
                to the day we finished the trek. It was both an exhilarating
                and safe journey. Highly recommend to any adventurer!"
              </p>
              <p className="font-semibold text-gray-800 text-center">Priya S.</p>
              <p className="text-sm text-gray-600 text-center">
                India – Langtang Valley Trek
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="relative bg-gray-900 py-20 px-4 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/cta.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1
          }}
        >
          {/* Fallback gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900 to-red-900"></div>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60" style={{ zIndex: 2 }}></div>
        
        {/* Content */}
        <div className="relative max-w-3xl mx-auto text-center text-white" style={{ zIndex: 3 }}>
          <h3 className="text-3xl md:text-5xl font-bold mb-4">
            Ready for Your Next Adventure?
          </h3>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Your journey to the Himalayas awaits. Take the first step towards
            your own adventure with us.
          </p>
          
           <a href="/contact"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold py-4 px-10 rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Book Your Adventure
          </a>
        </div>
      </section>
    </main>
  );
};

export default OverviewPage;