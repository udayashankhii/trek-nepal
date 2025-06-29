import React from 'react';
import { useScrollAnimation, useIntersectionObserver } from './animationUtils';
// Correct icon imports - using icons that actually exist
import { FaMountain, FaUsers, FaAward, FaGlobe } from 'react-icons/fa';

const ParallaxLayer = ({ children, speed, className, style = {} }) => {
  const { scrollY } = useScrollAnimation();
  
  return (
    <div
      className={className}
      style={{
        transform: `translateY(${scrollY * speed}px)`,
        ...style
      }}
    >
      {children}
    </div>
  );
};

const StatCounter = ({ end, duration = 2000, suffix = "", prefix = "" }) => {
  const [count, setCount] = React.useState(0);
  const [ref, isVisible, hasIntersected] = useIntersectionObserver();

  React.useEffect(() => {
    if (!hasIntersected) return;

    let startTime;
    const startCount = 0;
    
    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [hasIntersected, end, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
    </div>
  );
};

const StatsSection = () => {
  const [ref, isVisible] = useIntersectionObserver();

  // Fixed: Using the correct imported icons
  const stats = [
    { icon: FaMountain, value: 50, suffix: "+", label: "Trekking Routes", delay: "0s" },
    { icon: FaUsers, value: 10000, suffix: "+", label: "Happy Trekkers", delay: "0.2s" },
    { icon: FaAward, value: 15, suffix: "", label: "Years Experience", delay: "0.4s" },
    { icon: FaGlobe, value: 25, suffix: "", label: "Countries Served", delay: "0.6s" }
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-slate-900 to-blue-900">
      {/* Background Elements */}
      <ParallaxLayer speed={-0.3} className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
      </ParallaxLayer>

      <ParallaxLayer speed={-0.5} className="absolute top-0 left-0 w-96 h-96 opacity-10">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-orange-500 blur-3xl" />
      </ParallaxLayer>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-white mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Our Journey in Numbers
          </h2>
          <p className={`text-xl text-white/80 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Every step tells a story of adventure, discovery, and unforgettable experiences in the Himalayas
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 
                         hover:bg-white/20 transition-all duration-500 transform hover:scale-105
                         hover:shadow-lg hover:shadow-blue-500/20 ${
                           isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                         }`}
              style={{ 
                animationDelay: stat.delay,
                transitionDelay: stat.delay 
              }}
            >
              <div className="text-center">
                <stat.icon className="text-amber-400 text-3xl mx-auto mb-4" />
                <StatCounter end={stat.value} suffix={stat.suffix} />
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const [ref, isVisible] = useIntersectionObserver();

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      text: "The Everest Base Camp trek was life-changing. The guides were incredible and the views were beyond words.",
      rating: 5,
      image: "/testimonial1.jpg"
    },
    {
      name: "Marco Rodriguez",
      location: "Madrid, Spain", 
      text: "Professional service, amazing experience. The Annapurna Circuit exceeded all my expectations.",
      rating: 5,
      image: "/testimonial2.jpg"
    },
    {
      name: "Yuki Tanaka",
      location: "Tokyo, Japan",
      text: "Perfect organization and unforgettable memories. The Langtang Valley trek was absolutely stunning.",
      rating: 5,
      image: "/testimonial3.jpg"
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-blue-900 to-indigo-900">
      <ParallaxLayer speed={-0.2} className="absolute inset-0">
        <div className="w-full h-full bg-[url('/mountain-silhouette.svg')] bg-cover bg-center opacity-10" />
      </ParallaxLayer>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-white mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Stories from the Trail
          </h2>
          <p className={`text-xl text-white/80 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Hear from adventurers who've experienced the magic of the Himalayas with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20
                         hover:bg-white/20 transition-all duration-700 transform hover:scale-105
                         hover:shadow-xl hover:shadow-amber-500/20 ${
                           isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                         }`}
              style={{ 
                transitionDelay: `${index * 0.2}s` 
              }}
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-white/60 text-sm">{testimonial.location}</p>
                </div>
              </div>
              
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                "{testimonial.text}"
              </p>
              
              <div className="flex text-amber-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-xl">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function ParallaxSections() {
  return (
    <>
      <StatsSection />
      <TestimonialsSection />
    </>
  );
}
