// src/trekkingpage/ElevationChart.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";
import {
  ArrowsPointingOutIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function ElevationChart({
  title = "Elevation Profile",
  subtitle = "Day-by-day altitude progression",
  elevationData = [],
  trekName,
  showFullscreen = true,
}) {
  const data = Array.isArray(elevationData) ? elevationData : [];
  if (data.length === 0) return null;

  const [activePoint, setActivePoint] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);
  const chartRef = useRef(null);

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    const elevations = data.map((d) => d.elevation || 0);
    const max = Math.max(...elevations);
    const min = Math.min(...elevations);
    
    let totalAscent = 0;
    let totalDescent = 0;
    
    for (let i = 1; i < data.length; i++) {
      const diff = data[i].elevation - data[i - 1].elevation;
      if (diff > 0) totalAscent += diff;
      else totalDescent += Math.abs(diff);
    }

    return {
      max,
      min,
      totalAscent: Math.round(totalAscent),
      totalDescent: Math.round(totalDescent),
      highestPoint: data.find((d) => d.elevation === max),
    };
  }, [data]);

  // Fullscreen handlers
  const toggleFullscreen = () => {
    if (!chartRef.current) return;
    if (!isFullscreen) {
      chartRef.current.requestFullscreen?.() || chartRef.current.webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    }
  };

  useEffect(() => {
    const handleFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);

  // Premium Tooltip Component
  const PremiumTooltip = ({ active, payload }) => {
    if (!active || !payload?.[0]) return null;

    const { day, title: dayTitle, elevation, description } = payload[0].payload;
    const prevDay = data[day - 2];
    const elevationChange = prevDay ? elevation - prevDay.elevation : 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white/98 backdrop-blur-2xl shadow-2xl rounded-2xl p-5 border border-gray-200/50 max-w-sm"
        style={{ boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.2)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Day {day}
            </p>
            <h4 className="text-lg font-bold text-gray-900">
              {dayTitle}
            </h4>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl border border-blue-100">
            <ChartBarIcon className="h-4 w-4 text-blue-600" />
            <span className="text-base font-extrabold text-blue-700">
              {elevation.toLocaleString()}m
            </span>
          </div>
        </div>
        
        {elevationChange !== 0 && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            elevationChange > 0 
              ? 'bg-emerald-50 border border-emerald-200' 
              : 'bg-orange-50 border border-orange-200'
          }`}>
            <span className="text-xs font-semibold text-gray-600">
              {elevationChange > 0 ? 'Ascent' : 'Descent'}:
            </span>
            <span className={`text-sm font-bold ${
              elevationChange > 0 ? 'text-emerald-700' : 'text-orange-700'
            }`}>
              {elevationChange > 0 ? '+' : ''}{elevationChange.toLocaleString()}m
            </span>
          </div>
        )}
        
        {description && (
          <p className="text-xs text-gray-600 mt-3 leading-relaxed pt-3 border-t border-gray-100">
            {description}
          </p>
        )}
      </motion.div>
    );
  };

  // Chart domain with smart padding
  const yDomain = [
    Math.floor(stats.min / 500) * 500 - 300,
    Math.ceil(stats.max / 500) * 500 + 300,
  ];

  return (
    <motion.section
      ref={chartRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-white rounded-3xl shadow-xl overflow-hidden my-20 mx-auto w-full max-w-7xl border border-gray-100"
    >
      {/* Premium Header */}
      <div className="relative px-8 sm:px-12 pt-10 pb-8 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100/60 rounded-full mb-4"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                Trek Analysis
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight"
            >
              {title}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base text-gray-600 font-medium"
            >
              {subtitle}
              {trekName && (
                <span className="text-gray-800 font-semibold"> · {trekName}</span>
              )}
            </motion.p>
          </div>

          {showFullscreen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.5 }}
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 border border-blue-400/20"
            >
              <ArrowsPointingOutIcon className="h-5 w-5" />
              <span className="text-sm">{isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="px-8 sm:px-12 py-8 bg-gradient-to-br from-gray-50/80 via-white to-gray-50/80 border-y border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <PremiumStatCard
            label="Highest Point"
            value={stats.max.toLocaleString()}
            unit="m"
            subtext={stats.highestPoint?.title}
            icon="🏔️"
            gradient="from-blue-500 to-cyan-500"
            delay={0.1}
            onHover={() => setHoveredStat('max')}
            onLeave={() => setHoveredStat(null)}
            isActive={hoveredStat === 'max'}
          />
          <PremiumStatCard
            label="Total Ascent"
            value={stats.totalAscent.toLocaleString()}
            unit="m"
            subtext="Cumulative elevation gain"
            icon="📈"
            gradient="from-emerald-500 to-green-500"
            delay={0.2}
            onHover={() => setHoveredStat('ascent')}
            onLeave={() => setHoveredStat(null)}
            isActive={hoveredStat === 'ascent'}
          />
          <PremiumStatCard
            label="Total Descent"
            value={stats.totalDescent.toLocaleString()}
            unit="m"
            subtext="Cumulative elevation loss"
            icon="📉"
            gradient="from-orange-500 to-amber-500"
            delay={0.3}
            onHover={() => setHoveredStat('descent')}
            onLeave={() => setHoveredStat(null)}
            isActive={hoveredStat === 'descent'}
          />
          <PremiumStatCard
            label="Trek Duration"
            value={data.length}
            unit="Days"
            subtext="Complete journey"
            icon="⏱️"
            gradient="from-purple-500 to-indigo-500"
            delay={0.4}
            onHover={() => setHoveredStat('duration')}
            onLeave={() => setHoveredStat(null)}
            isActive={hoveredStat === 'duration'}
          />
        </div>
      </div>

      {/* Premium Chart Container */}
      <div className="px-8 sm:px-12 py-10 bg-white">
        <div className="relative h-[500px] sm:h-[600px] bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 40, right: 50, left: 20, bottom: 80 }}
              onMouseMove={(e) => e?.activePayload && setActivePoint(e.activePayload[0].payload)}
              onMouseLeave={() => setActivePoint(null)}
            >
              <defs>
                {/* Premium Multi-Stop Gradient */}
                <linearGradient id="premiumElevation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="30%" stopColor="#60a5fa" stopOpacity={0.6} />
                  <stop offset="60%" stopColor="#93c5fd" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#dbeafe" stopOpacity={0.1} />
                </linearGradient>
                
                {/* Shadow Filter */}
                <filter id="premiumShadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
                </filter>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                strokeOpacity={0.5}
                vertical={false}
              />

              <XAxis
                dataKey="day"
                tick={{ fill: "#6b7280", fontSize: 14, fontWeight: 600 }}
                tickMargin={20}
                axisLine={{ stroke: "#d1d5db", strokeWidth: 2 }}
                tickLine={false}
              >
                <Label
                  value="TREK DAYS"
                  position="bottom"
                  offset={30}
                  style={{
                    fill: "#374151",
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.1em",
                  }}
                />
              </XAxis>

              <YAxis
                domain={yDomain}
                tick={{ fill: "#6b7280", fontSize: 14, fontWeight: 600 }}
                tickFormatter={(m) => `${(m / 1000).toFixed(1)}k`}
                width={80}
                axisLine={{ stroke: "#d1d5db", strokeWidth: 2 }}
                tickLine={false}
              >
                <Label
                  value="ELEVATION (METERS)"
                  angle={-90}
                  position="insideLeft"
                  offset={15}
                  style={{
                    fill: "#374151",
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.1em",
                  }}
                />
              </YAxis>

              <Tooltip
                content={<PremiumTooltip />}
                cursor={{
                  stroke: "#3b82f6",
                  strokeWidth: 2,
                  strokeDasharray: "6 4",
                }}
              />

              {/* Main Elevation Area */}
              <Area
                type="monotone"
                dataKey="elevation"
                stroke="#2563eb"
                strokeWidth={4}
                fill="url(#premiumElevation)"
                animationDuration={2500}
                animationEasing="ease-out"
                filter="url(#premiumShadow)"
              />

              {/* Peak Marker */}
              {stats.highestPoint && (
                <ReferenceLine
                  x={stats.highestPoint.day}
                  stroke="#3b82f6"
                  strokeWidth={3}
                  strokeDasharray="8 4"
                >
                  <Label
                    value={`🏔️ Peak: ${stats.highestPoint.elevation.toLocaleString()}m`}
                    position="top"
                    fill="#1e40af"
                    fontSize={14}
                    fontWeight={700}
                    offset={20}
                  />
                </ReferenceLine>
              )}

              {/* Active Point Marker */}
              {activePoint && (
                <ReferenceLine
                  x={activePoint.day}
                  stroke="#f59e0b"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Premium Legend */}
      <div className="px-8 sm:px-12 pb-10 bg-white">
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
          <LegendItem icon="📊" label="Elevation Profile" color="bg-gradient-to-r from-blue-500 to-blue-600" />
          <LegendItem icon="🎯" label="Current Position" color="bg-orange-500" dashed />
          <LegendItem icon="⛰️" label="Peak Point" color="bg-blue-600" dashed />
          <LegendItem icon="📈" label="Ascending Path" color="bg-gradient-to-r from-emerald-400 to-green-500" />
        </div>
      </div>
    </motion.section>
  );
}

// Premium Stat Card Component
function PremiumStatCard({ label, value, unit, subtext, icon, gradient, delay, onHover, onLeave, isActive }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.03 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`relative bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden group ${
        isActive ? 'border-blue-400 ring-4 ring-blue-100' : 'border-gray-100'
      }`}
    >
      {/* Background Gradient on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
        
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          {label}
        </p>
        
        <div className="flex items-baseline gap-1 mb-1">
          <p className="text-3xl font-extrabold text-gray-900">
            {value}
          </p>
          <span className="text-lg font-bold text-gray-500">
            {unit}
          </span>
        </div>
        
        {subtext && (
          <p className="text-xs text-gray-600 truncate mt-1 font-medium">
            {subtext}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// Premium Legend Item
function LegendItem({ icon, label, color, dashed }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-default"
    >
      <span className="text-lg">{icon}</span>
      {dashed ? (
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <span key={i} className={`w-1.5 h-1.5 rounded-full ${color}`} />
          ))}
        </div>
      ) : (
        <span className={`block w-10 h-3 rounded-full ${color} shadow-sm`} />
      )}
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </motion.div>
  );
}
