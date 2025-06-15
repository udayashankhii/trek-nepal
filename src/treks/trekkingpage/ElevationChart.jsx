// src/trekkingpage/ElevationChart.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Label,
} from "recharts";
import {
  ArrowTrendingUpIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";

export default function ElevationChart({
  title = "Elevation Chart",
  subtitle = "Detailed Elevation and Duration Chart",
  elevationData = [],          // default empty array
  trekName,
  colorScheme = {
    primary: "#38bdf8",
    secondary: "#0ea5e9",
    text: "#0c4a6e",
    accent: "#60a5fa",
  },
  showFullscreen = true,
}) {
  // guard against undefined or empty data
  const data = Array.isArray(elevationData) ? elevationData : [];
  if (data.length === 0) {
    return null;
  }

  // state hooks
  const [activePoint, setActivePoint] = useState(null);
  const [ setScreenSize] = useState({ width: 0, height: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartRef = useRef(null);

  // update screen size
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", updateScreenSize);
    updateScreenSize();
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  // fullscreen toggle
  const toggleFullscreen = () => {
    if (!chartRef.current) return;
    if (!isFullscreen) {
      chartRef.current.requestFullscreen?.() || chartRef.current.webkitRequestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // listen for fullscreen changes
  useEffect(() => {
    const handleFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFSChange);
    document.addEventListener("webkitfullscreenchange", handleFSChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFSChange);
      document.removeEventListener("webkitfullscreenchange", handleFSChange);
    };
  }, []);

  // elevation extents
  const elevations = data.map((d) => d.elevation || 0);
  const maxElevation = Math.max(...elevations);
  const minElevation = Math.min(...elevations);
  const highestPoint = data.find((d) => d.elevation === maxElevation);

  // format meters
  const formatMeter = (m) => `${m}m`;

  // custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { day, title: dayTitle, elevation, description } = payload[0].payload;
      return (
        <div className="backdrop-blur-md bg-white/90 shadow-lg rounded-lg p-3 border border-sky-100">
          <h4 className="font-medium text-sky-800 mb-1">
            Day {day}: {dayTitle}
          </h4>
          <div className="flex items-center text-sky-600 font-bold">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            <span>{formatMeter(elevation)}</span>
          </div>
          {description && <p className="text-xs text-gray-500 mt-1 max-w-xs">{description}</p>}
        </div>
      );
    }
    return null;
  };

  // mouse events
  const handleMouseMove = (props) => {
    if (props?.activePayload) setActivePoint(props.activePayload[0].payload);
  };
  const handleMouseLeave = () => setActivePoint(null);

  return (
    <motion.section
      ref={chartRef}
      className="relative bg-white rounded-3xl shadow-xl overflow-hidden my-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{title}</h2>
            <p className="text-sm sm:text-base text-gray-600">
              {subtitle}{trekName && ` of the ${trekName}`}
            </p>
          </div>
          {showFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="mt-2 sm:mt-0 flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700 transition"
            >
              <ArrowsPointingOutIcon className="h-5 w-5" />
              <span>{isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}</span>
            </button>
          )}
        </div>
        <div className="h-[400px] sm:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="colorElev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorScheme.primary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colorScheme.primary} stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} tickMargin={10} axisLine={{ stroke: "#cbd5e1" }}>
                <Label value="DAYS" offset={0} position="bottom" style={{ textAnchor: "middle", fill: "#64748b", fontWeight: 500, fontSize: 14 }} />
              </XAxis>
              <YAxis
                domain={[Math.floor(minElevation / 1000) * 1000, Math.ceil(maxElevation / 1000) * 1000]}
                tick={{ fontSize: 12 }} tickFormatter={formatMeter} width={60} axisLine={{ stroke: "#cbd5e1" }}
              >
                <Label angle={-90} value="HEIGHT IN METERS" position="insideLeft" style={{ textAnchor: "middle", fill: "#64748b", fontWeight: 500, fontSize: 14 }} />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="elevation" stroke={colorScheme.secondary} strokeWidth={3} fillOpacity={1} fill="url(#colorElev)" animationDuration={1500} />
              {highestPoint && (
                <ReferenceLine x={highestPoint.day} stroke={colorScheme.accent} strokeDasharray="3 3" strokeWidth={2}>
                  <Label value={`Peak (${highestPoint.elevation}m)`} position="top" fill={colorScheme.text} fontSize={12} fontWeight={600} />
                </ReferenceLine>
              )}
              {activePoint && <ReferenceLine x={activePoint.day} stroke={colorScheme.accent} strokeWidth={2} strokeDasharray="3 3" />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-600">
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span><span>Elevation</span></div>
          <div className="flex items-center"><span className="w-4 h-0.5 bg-blue-400 mr-2 relative"><span className="absolute w-1 h-1 rounded-full bg-blue-500 left-0 top-1/2 transform -translate-y-1/2"></span><span className="absolute w-1 h-1 rounded-full bg-blue-500 right-0 top-1/2 transform -translate-y-1/2"></span></span><span>Trek route</span></div>
          <div className="flex items-center"><span className="w-4 h-0.5 bg-blue-600 mr-2 relative dashed-line"></span><span>Notable points</span></div>
        </div>
      </div>
    </motion.section>
  );
}
