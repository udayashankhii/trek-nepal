import React, { useState, useEffect } from 'react';
import { useMouseTracking, useScrollAnimation, generateParticles } from './animationUtils';

const MountainLayer = ({ path, speed, opacity, color }) => {
  const { scrollY } = useScrollAnimation();
  
  return (
    <div
      className="absolute bottom-0 w-full transition-transform duration-300 ease-out"
      style={{
        transform: `translateY(${scrollY * speed}px)`,
        opacity: opacity
      }}
    >
      <svg
        viewBox="0 0 1200 400"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d={path}
          fill={color}
          className="transition-all duration-500"
        />
      </svg>
    </div>
  );
};

const Cloud = ({ x, y, size, speed, delay }) => {
  const { scrollY } = useScrollAnimation();
  
  return (
    <div
      className="absolute opacity-30 animate-pulse"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translateX(${scrollY * speed}px)`,
        animationDelay: `${delay}s`,
        animationDuration: '4s'
      }}
    >
      <svg
        width={size}
        height={size * 0.6}
        viewBox="0 0 100 60"
        className="fill-white"
      >
        <ellipse cx="25" cy="40" rx="25" ry="20"/>
        <ellipse cx="50" cy="30" rx="30" ry="25"/>
        <ellipse cx="75" cy="40" rx="25" ry="20"/>
      </svg>
    </div>
  );
};

const InteractiveParticle = ({ particle, mousePosition }) => {
  const [position, setPosition] = useState({ x: particle.x, y: particle.y });
  
  useEffect(() => {
    const distance = Math.sqrt(
      Math.pow(mousePosition.x * 50 - particle.x, 2) + 
      Math.pow(mousePosition.y * 50 - particle.y, 2)
    );
    
    if (distance < 100) {
      const angle = Math.atan2(
        mousePosition.y * 50 - particle.y,
        mousePosition.x * 50 - particle.x
      );
      const force = (100 - distance) / 100;
      
      setPosition({
        x: particle.x - Math.cos(angle) * force * 20,
        y: particle.y - Math.sin(angle) * force * 20
      });
    } else {
      setPosition({ x: particle.x, y: particle.y });
    }
  }, [mousePosition, particle]);

  return (
    <div
      className="absolute rounded-full bg-white transition-all duration-300 pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        opacity: particle.opacity,
        transform: `translateZ(0)`,
      }}
    />
  );
};

const Stars = ({ count = 100 }) => {
  const [stars] = useState(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: Math.random() * 2 + 1,
      twinkleDelay: Math.random() * 3,
      twinkleDuration: 2 + Math.random() * 2
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.twinkleDelay}s`,
            animationDuration: `${star.twinkleDuration}s`,
            opacity: 0.7
          }}
        />
      ))}
    </div>
  );
};

export default function InteractiveMountainScene() {
  const [mouseRef, mousePosition] = useMouseTracking();
  const [particles] = useState(() => generateParticles(50, { width: 100, height: 100 }));
  
  const clouds = [
    { x: 10, y: 20, size: 80, speed: 0.1, delay: 0 },
    { x: 60, y: 15, size: 100, speed: 0.15, delay: 1 },
    { x: 85, y: 25, size: 60, speed: 0.08, delay: 2 },
    { x: 30, y: 10, size: 90, speed: 0.12, delay: 0.5 },
  ];

  const mountainLayers = [
    {
      path: "M0,400 L200,300 L400,320 L600,280 L800,300 L1000,250 L1200,280 L1200,400 Z",
      speed: 0.1,
      opacity: 0.9,
      color: "#1e293b"
    },
    {
      path: "M0,400 L150,320 L350,340 L550,300 L750,320 L950,270 L1200,300 L1200,400 Z",
      speed: 0.15,
      opacity: 0.7,
      color: "#334155"
    },
    {
      path: "M0,400 L100,340 L300,360 L500,320 L700,340 L900,290 L1200,320 L1200,400 Z",
      speed: 0.2,
      opacity: 0.5,
      color: "#475569"
    },
    {
      path: "M0,400 L50,360 L250,380 L450,340 L650,360 L850,310 L1200,340 L1200,400 Z",
      speed: 0.25,
      opacity: 0.3,
      color: "#64748b"
    }
  ];

  return (
    <section 
      ref={mouseRef}
      className="relative h-screen overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900"
    >
      {/* Stars */}
      <Stars count={150} />
      
      {/* Clouds */}
      {clouds.map((cloud, index) => (
        <Cloud key={index} {...cloud} />
      ))}
      
      {/* Interactive Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(particle => (
          <InteractiveParticle
            key={particle.id}
            particle={particle}
            mousePosition={mousePosition}
          />
        ))}
      </div>
      
      {/* Mountain Layers */}
      <div className="absolute inset-0">
        {mountainLayers.map((layer, index) => (
          <MountainLayer key={index} {...layer} />
        ))}
      </div>
      
      {/* Foreground Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-6">
          <h2 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
            style={{
              transform: `translateY(${mousePosition.y * -10}px)`
            }}
          >
            Explore the Himalayas
          </h2>
          <p 
            className="text-xl md:text-2xl text-white/80 leading-relaxed"
            style={{
              transform: `translateY(${mousePosition.y * -5}px)`
            }}
          >
            Where every peak tells a story and every trail leads to adventure
          </p>
        </div>
      </div>
      
      {/* Interactive Hint */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/60 text-sm text-center">
        <div className="animate-pulse">Move your mouse to interact with the scene</div>
      </div>
    </section>
  );
}
