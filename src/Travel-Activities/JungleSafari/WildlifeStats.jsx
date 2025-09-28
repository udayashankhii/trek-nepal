import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const stats = [
  { number: 68, label: "Tiger Population", icon: "🐅" },
  { number: 645, label: "One-Horned Rhinos", icon: "🦏" },
  { number: 543, label: "Bird Species", icon: "🦅" },
  { number: 15, label: "Years Experience", icon: "🏆" }
];

const StatCard = ({ stat, index }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const increment = Math.ceil(stat.number / 50);
    const timer = setInterval(() => {
      setCount(prev => {
        const next = prev + increment;
        return next < stat.number ? next : stat.number;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [isVisible, stat.number]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, delay: index * 0.2 },
        onViewportEnter: () => setIsVisible(true)
      }}
      className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
    >
      <motion.div
        className="text-6xl mb-4"
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        {stat.icon}
      </motion.div>

      <motion.div
        className="text-4xl font-bold text-yellow-400 mb-2"
        animate={ count === stat.number ? { scale: [1, 1.1, 1] } : {} }
        transition={{ duration: 0.3 }}
      >
        {count}+
      </motion.div>

      <p className="text-white text-lg font-medium">{stat.label}</p>
    </motion.div>
  );
};

const WildlifeStats = () => (
  <section className="py-20 bg-green-800 relative overflow-hidden">
    {/* Animated Background Pattern */}
    <motion.div
      className="absolute inset-0 opacity-10"
      animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
      transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }}
    />

    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl font-bold text-white mb-6">
          Wildlife Conservation Impact
        </h2>
        <p className="text-xl text-green-100 max-w-3xl mx-auto">
          Contributing to Nepal's wildlife conservation through responsible tourism
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} index={idx} />
        ))}
      </div>
    </div>
  </section>
);

export default WildlifeStats;
