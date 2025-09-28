import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchInterface = ({ activeTab, setActiveTab }) => (
  <div>
    {/* Tabs */}
    <div className="flex space-x-4 mb-6">
      {['packages', 'destinations'].map((tab) => (
        <motion.button
          key={tab}
          onClick={() => setActiveTab(tab)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-full font-semibold transition ${
            activeTab === tab
              ? 'bg-yellow-400 text-emerald-900'
              : 'bg-white/30 text-white'
          }`}
        >
          {tab === 'packages' ? 'Packages' : 'Destinations'}
        </motion.button>
      ))}
    </div>

    {/* Tab Content */}
    <motion.div 
      className="text-white"
      key={activeTab}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {activeTab === 'packages' ? (
        <input
          type="text"
          placeholder="Search packages..."
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      ) : (
        <input
          type="text"
          placeholder="Search destinations..."
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      )}
    </motion.div>
  </div>
);

const JungleSafariHero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('packages');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-[url('/jungle-pattern.svg')] bg-cover bg-center"
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-30"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-6 pt-20">
        {/* Main Heading with Stagger Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Wild
            <motion.span
              className="text-yellow-400 block"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              Adventures
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl text-green-100 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            Experience Nepal's pristine wilderness with luxury jungle safaris in
            Chitwan and Bardiya National Parks
          </motion.p>
        </motion.div>

        {/* Animated Search Card */}
        <AnimatePresence mode="wait">
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ 
                duration: 0.8, 
                delay: 1,
                ease: "easeOut",
                type: "spring",
                stiffness: 100
              }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
            >
              <SearchInterface
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JungleSafariHero;
