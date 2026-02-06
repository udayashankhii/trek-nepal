// src/treks/trekkingpage/ElevationChart.jsx
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Mountain, TrendingUp, TrendingDown, Activity, Maximize2, X } from "lucide-react";

/**
 * Professional Elevation Chart Component
 * Displays day-by-day trek elevation with interactive features
 */
export default function ElevationChart({
  elevationData = [],
  title = "Elevation Profile",
  subtitle = "",
  trekName = "",
  showFullscreen = false,
  className = "",
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartRef = useRef(null);
  const svgRef = useRef(null);

  // Calculate chart metrics
  const metrics = calculateMetrics(elevationData);

  if (!elevationData || elevationData.length === 0) {
    return null;
  }

  const handleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <>
      {/* Main Chart Container */}
      <section 
        ref={chartRef}
        className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm ${className}`}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-1">
                <Mountain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {title}
                </h2>
              </div>
              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
            {showFullscreen && (
              <button
                onClick={handleFullscreen}
                className="ml-2 sm:ml-4 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                aria-label="View fullscreen"
              >
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-br from-blue-50 to-teal-50">
          <StatCard
            icon={<Mountain className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            label="Max Altitude"
            value={`${metrics.maxElevation.toLocaleString()}m`}
            subtext={`Day ${metrics.maxDay}`}
            color="text-blue-600"
          />
          <StatCard
            icon={<TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            label="Total Ascent"
            value={`${metrics.totalAscent.toLocaleString()}m`}
            subtext={`${metrics.ascentDays} days`}
            color="text-green-600"
          />
          <StatCard
            icon={<TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            label="Total Descent"
            value={`${metrics.totalDescent.toLocaleString()}m`}
            subtext={`${metrics.descentDays} days`}
            color="text-orange-600"
          />
          <StatCard
            icon={<Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            label="Avg Altitude"
            value={`${metrics.avgElevation.toLocaleString()}m`}
            subtext={`${elevationData.length} days`}
            color="text-purple-600"
          />
        </div>

        {/* Chart Area */}
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <ElevationSVGChart
            data={elevationData}
            metrics={metrics}
            hoveredPoint={hoveredPoint}
            setHoveredPoint={setHoveredPoint}
            svgRef={svgRef}
          />
        </div>

        {/* Tooltip */}
        {hoveredPoint && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-5">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg p-3 sm:p-4 shadow-lg">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-1">
                    <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-semibold">
                      Day {hoveredPoint.day}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-300">
                      {hoveredPoint.title}
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2">
                    {hoveredPoint.elevation.toLocaleString()} meters
                  </div>
                  {hoveredPoint.change !== 0 && (
                    <div className={`flex items-center gap-1.5 text-xs sm:text-sm ${
                      hoveredPoint.change > 0 ? 'text-green-400' : 'text-orange-400'
                    }`}>
                      {hoveredPoint.change > 0 ? (
                        <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                      <span>
                        {Math.abs(hoveredPoint.change).toLocaleString()}m{' '}
                        {hoveredPoint.change > 0 ? 'ascent' : 'descent'} from previous day
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {hoveredPoint.description && (
                <p className="text-xs sm:text-sm text-gray-300 mt-2 sm:mt-3 leading-relaxed">
                  {hoveredPoint.description}
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <FullscreenChart
          data={elevationData}
          metrics={metrics}
          title={title}
          trekName={trekName}
          onClose={handleFullscreen}
        />
      )}
    </>
  );
}

/**
 * Main SVG Chart Component - FIXED: Shows ALL days on x-axis
 */
function ElevationSVGChart({ data, metrics, hoveredPoint, setHoveredPoint, svgRef }) {
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });
  const containerRef = useRef(null);

  // Responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        // Increased height for better label spacing
        setDimensions({ width, height: Math.min(450, Math.max(350, width * 0.5)) });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { width, height } = dimensions;
  // Increased bottom padding to accommodate ALL day labels
  const padding = { 
    top: 30, 
    right: 50, 
    bottom: 80,  // ✅ Increased for day labels
    left: 60 
  };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale calculations
  const minElevation = Math.floor(metrics.minElevation / 100) * 100;
  const maxElevation = Math.ceil(metrics.maxElevation / 100) * 100;
  const elevationRange = maxElevation - minElevation;

  const xScale = (index) => (index / (data.length - 1)) * chartWidth + padding.left;
  const yScale = (elevation) => 
    height - padding.bottom - ((elevation - minElevation) / elevationRange) * chartHeight;

  // Generate path
  const pathData = data.map((point, index) => {
    const x = xScale(index);
    const y = yScale(point.elevation);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Area fill path
  const areaPath = `${pathData} L ${xScale(data.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  // Y-axis ticks
  const yTicks = 6;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => 
    minElevation + (elevationRange / yTicks) * i
  );

  // ✅ Calculate if labels should be angled based on number of days
  const shouldAngleLabels = data.length > 7;
  const labelRotation = shouldAngleLabels ? -45 : 0;

  return (
    <div ref={containerRef} className="w-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full"
        style={{ maxHeight: '500px' }}
      >
        {/* Grid lines */}
        <g className="grid">
          {yTickValues.map((tick) => {
            const y = yScale(tick);
            return (
              <line
                key={tick}
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            );
          })}
        </g>

        {/* Area fill with gradient */}
        <defs>
          <linearGradient id="elevationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          d={areaPath}
          fill="url(#elevationGradient)"
        />

        {/* Main line */}
        <path
          d={pathData}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((point, index) => {
          const x = xScale(index);
          const y = yScale(point.elevation);
          const isHovered = hoveredPoint?.day === point.day;
          const isMaxPoint = point.elevation === metrics.maxElevation;

          return (
            <g key={point.day}>
              {/* Invisible larger circle for easier hovering */}
              <circle
                cx={x}
                cy={y}
                r={12}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint({
                  ...point,
                  change: index > 0 ? point.elevation - data[index - 1].elevation : 0
                })}
                onMouseLeave={() => setHoveredPoint(null)}
              />

              {/* Visible point circle */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 7 : isMaxPoint ? 6 : 4.5}
                fill={isMaxPoint ? "#ef4444" : "#3b82f6"}
                stroke="white"
                strokeWidth="2.5"
                className="cursor-pointer transition-all pointer-events-none"
                style={{
                  filter: isHovered ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none'
                }}
              />

              {/* ✅ FIXED: Day labels - SHOW ALL DAYS */}
              <text
                x={x}
                y={height - padding.bottom + 20}
                textAnchor={shouldAngleLabels ? "end" : "middle"}
                dominantBaseline="middle"
                className="text-[10px] sm:text-xs fill-gray-600 font-medium pointer-events-none"
                transform={shouldAngleLabels ? `rotate(${labelRotation}, ${x}, ${height - padding.bottom + 20})` : ''}
              >
                D{point.day}
              </text>

              {/* Elevation value below each point (optional, for clarity) */}
              {(isMaxPoint || isHovered) && (
                <text
                  x={x}
                  y={y - 15}
                  textAnchor="middle"
                  className="text-[9px] sm:text-[10px] fill-gray-700 font-semibold pointer-events-none"
                  style={{ textShadow: '0 0 3px white' }}
                >
                  {point.elevation.toLocaleString()}m
                </text>
              )}

              {/* Peak marker */}
              {isMaxPoint && (
                <>
                  <line
                    x1={x}
                    y1={y - 25}
                    x2={x}
                    y2={y - 45}
                    stroke="#ef4444"
                    strokeWidth="2"
                    className="pointer-events-none"
                  />
                  <text
                    x={x}
                    y={y - 50}
                    textAnchor="middle"
                    className="text-[10px] sm:text-xs fill-red-600 font-bold pointer-events-none"
                  >
                    Peak
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#6b7280"
          strokeWidth="2"
        />

        {/* Y-axis labels */}
        {yTickValues.map((tick) => {
          const y = yScale(tick);
          return (
            <text
              key={tick}
              x={padding.left - 12}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-[10px] sm:text-xs fill-gray-600 font-medium"
            >
              {tick.toLocaleString()}m
            </text>
          );
        })}

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#6b7280"
          strokeWidth="2"
        />

        {/* Axis labels */}
        <text
          x={width / 2}
          y={height - 15}
          textAnchor="middle"
          className="text-xs sm:text-sm fill-gray-700 font-semibold"
        >
          Trek Days
        </text>
        <text
          x={padding.left - 45}
          y={height / 2}
          textAnchor="middle"
          className="text-xs sm:text-sm fill-gray-700 font-semibold"
          transform={`rotate(-90, ${padding.left - 45}, ${height / 2})`}
        >
          Elevation (meters)
        </text>
      </svg>
    </div>
  );
}

/**
 * Statistics Card Component
 */
function StatCard({ icon, label, value, subtext, color }) {
  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className={`flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 ${color}`}>
        {icon}
        <span className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-0.5">
        {value}
      </div>
      {subtext && (
        <div className="text-[10px] sm:text-xs text-gray-500">
          {subtext}
        </div>
      )}
    </div>
  );
}

/**
 * Fullscreen Chart Modal
 */
function FullscreenChart({ data, metrics, title, trekName, onClose }) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-auto animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
            {trekName && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1">{trekName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close fullscreen"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <StatCard
              icon={<Mountain className="w-4 h-4" />}
              label="Max Altitude"
              value={`${metrics.maxElevation.toLocaleString()}m`}
              subtext={`Day ${metrics.maxDay}`}
              color="text-blue-600"
            />
            <StatCard
              icon={<TrendingUp className="w-4 h-4" />}
              label="Total Ascent"
              value={`${metrics.totalAscent.toLocaleString()}m`}
              subtext={`${metrics.ascentDays} days`}
              color="text-green-600"
            />
            <StatCard
              icon={<TrendingDown className="w-4 h-4" />}
              label="Total Descent"
              value={`${metrics.totalDescent.toLocaleString()}m`}
              subtext={`${metrics.descentDays} days`}
              color="text-orange-600"
            />
            <StatCard
              icon={<Activity className="w-4 h-4" />}
              label="Avg Altitude"
              value={`${metrics.avgElevation.toLocaleString()}m`}
              subtext={`${data.length} days`}
              color="text-purple-600"
            />
          </div>

          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <ElevationSVGChart
              data={data}
              metrics={metrics}
              hoveredPoint={null}
              setHoveredPoint={() => {}}
              svgRef={null}
            />
          </div>

          {/* Day-by-day breakdown table */}
          <div className="mt-4 sm:mt-6 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700">Day</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700">Location</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-right font-semibold text-gray-700">Elevation</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-right font-semibold text-gray-700">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.map((point, index) => {
                  const change = index > 0 ? point.elevation - data[index - 1].elevation : 0;
                  const isMaxPoint = point.elevation === metrics.maxElevation;
                  return (
                    <tr key={point.day} className={`hover:bg-gray-50 transition-colors ${isMaxPoint ? 'bg-red-50' : ''}`}>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 font-medium text-gray-900 whitespace-nowrap">
                        Day {point.day}
                        {isMaxPoint && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-semibold">
                            PEAK
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-700">
                        {point.title}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                        {point.elevation.toLocaleString()}m
                      </td>
                      <td className={`px-3 sm:px-4 py-2 sm:py-3 text-right font-medium whitespace-nowrap ${
                        change > 0 ? 'text-green-600' : change < 0 ? 'text-orange-600' : 'text-gray-400'
                      }`}>
                        {change !== 0 && (
                          <span className="inline-flex items-center justify-end gap-1">
                            {change > 0 ? (
                              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            ) : (
                              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                            {change > 0 ? '+' : ''}{change.toLocaleString()}m
                          </span>
                        )}
                        {change === 0 && '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Calculate elevation metrics
 */
function calculateMetrics(data) {
  if (!data || data.length === 0) {
    return {
      minElevation: 0,
      maxElevation: 0,
      avgElevation: 0,
      totalAscent: 0,
      totalDescent: 0,
      maxDay: 1,
      ascentDays: 0,
      descentDays: 0,
    };
  }

  let minElevation = Infinity;
  let maxElevation = -Infinity;
  let totalElevation = 0;
  let totalAscent = 0;
  let totalDescent = 0;
  let maxDay = 1;
  let ascentDays = 0;
  let descentDays = 0;

  data.forEach((point, index) => {
    const elevation = point.elevation;

    totalElevation += elevation;

    if (elevation < minElevation) minElevation = elevation;
    if (elevation > maxElevation) {
      maxElevation = elevation;
      maxDay = point.day;
    }

    if (index > 0) {
      const change = elevation - data[index - 1].elevation;
      if (change > 0) {
        totalAscent += change;
        ascentDays++;
      } else if (change < 0) {
        totalDescent += Math.abs(change);
        descentDays++;
      }
    }
  });

  return {
    minElevation: Math.round(minElevation),
    maxElevation: Math.round(maxElevation),
    avgElevation: Math.round(totalElevation / data.length),
    totalAscent: Math.round(totalAscent),
    totalDescent: Math.round(totalDescent),
    maxDay,
    ascentDays,
    descentDays,
  };
}

// PropTypes
ElevationChart.propTypes = {
  elevationData: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      elevation: PropTypes.number.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  trekName: PropTypes.string,
  showFullscreen: PropTypes.bool,
  className: PropTypes.string,
};

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  subtext: PropTypes.string,
  color: PropTypes.string.isRequired,
};

ElevationSVGChart.propTypes = {
  data: PropTypes.array.isRequired,
  metrics: PropTypes.object.isRequired,
  hoveredPoint: PropTypes.object,
  setHoveredPoint: PropTypes.func.isRequired,
  svgRef: PropTypes.object,
};

FullscreenChart.propTypes = {
  data: PropTypes.array.isRequired,
  metrics: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  trekName: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};