// src/pages/BookingPage/WeatherRiskWarning.jsx
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Cloud,
  Wind,
  Thermometer,
  Snowflake,
  Eye,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

const RISK_CONFIG = {
  SAFE: {
    icon: CheckCircle,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    badgeColor: 'bg-green-100 text-green-800',
    title: '✅ Excellent Weather Conditions',
    description: 'Safe trekking conditions expected for your selected dates'
  },
  WARNING: {
    icon: AlertCircle,
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    badgeColor: 'bg-yellow-100 text-yellow-800',
    title: '🟡 Weather Advisory',
    description: 'Moderate weather conditions - standard precautions recommended'
  },
  CAUTION: {
    icon: AlertTriangle,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    badgeColor: 'bg-orange-100 text-orange-800',
    title: '⚠️ Weather Caution Required',
    description: 'Challenging conditions expected - experience and proper gear essential'
  },
  DANGER: {
    icon: XCircle,
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    badgeColor: 'bg-red-100 text-red-800',
    title: '❌ Dangerous Weather Conditions',
    description: 'High-risk conditions detected - strongly consider rescheduling'
  }
};

export default function WeatherRiskWarning({ 
  riskPrediction, 
  riskLoading, 
  riskError,
  riskAcknowledged,
  onAcknowledge,
  startDate,
  endDate
}) {
  const [expanded, setExpanded] = useState(false);

  // Loading state
  if (riskLoading && startDate) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
          <div className="flex-1">
            <p className="font-semibold text-blue-900">
              Analyzing Weather Conditions...
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Checking weather forecast for {startDate} {endDate && `to ${endDate}`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state (non-critical - show subtle warning)
  if (riskError && !riskLoading) {
    return (
      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">
              Weather prediction available only 16 days in advance
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {riskError}. You can still proceed with your booking.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No dates selected yet
  if (!startDate || !riskPrediction) {
    return null;
  }

  const config = RISK_CONFIG[riskPrediction.overall_risk] || RISK_CONFIG.SAFE;
  const RiskIcon = config.icon;
  const isDangerous = riskPrediction.overall_risk === 'DANGER' || 
                     riskPrediction.dangerous_days > 0;
  const needsAcknowledgment = isDangerous;

  return (
    <div className={`border-2 ${config.borderColor} ${config.bgColor} rounded-xl overflow-hidden`}>
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${config.badgeColor} border-2 ${config.borderColor}`}>
            <RiskIcon className={`h-6 w-6 ${config.color}`} />
          </div>
          
          <div className="flex-1">
            <h3 className={`text-lg font-bold ${config.color} mb-1`}>
              {config.title}
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              {config.description}
            </p>

            {/* Risk Statistics */}
            <div className="flex items-center gap-2 flex-wrap">
              <StatBadge 
                label="Safe" 
                count={riskPrediction.safe_days} 
                color="bg-green-100 text-green-700 border-green-300"
              />
              <StatBadge 
                label="Warning" 
                count={riskPrediction.warning_days} 
                color="bg-yellow-100 text-yellow-700 border-yellow-300"
              />
              <StatBadge 
                label="Caution" 
                count={riskPrediction.caution_days} 
                color="bg-orange-100 text-orange-700 border-orange-300"
              />
              <StatBadge 
                label="Danger" 
                count={riskPrediction.dangerous_days} 
                color="bg-red-100 text-red-700 border-red-300"
              />
              
              <div className="ml-auto flex items-center gap-2 text-xs">
                <span className={`px-2 py-1 rounded-md font-medium ${config.badgeColor}`}>
                  {(riskPrediction.overall_confidence * 100).toFixed(0)}% Confidence
                </span>
                <span className={`px-2 py-1 rounded-md font-medium ${
                  riskPrediction.data_source === 'historical' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {riskPrediction.data_source === 'historical' ? '📊 Historical' : '🔮 Forecast'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className={`mt-4 p-4 rounded-lg border-2 ${config.borderColor} bg-white`}>
          <p className="text-sm font-medium text-gray-800 leading-relaxed">
            {riskPrediction.recommendation}
          </p>
        </div>

        {/* Danger Acknowledgment Checkbox */}
        {needsAcknowledgment && (
          <div className="mt-4 p-4 bg-red-100 border-2 border-red-300 rounded-lg">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={riskAcknowledged}
                onChange={(e) => onAcknowledge(e.target.checked)}
                className="mt-1 h-5 w-5 text-red-600 border-red-300 rounded focus:ring-red-500"
                required
              />
              <span className="text-sm font-semibold text-red-900">
                I understand the weather risks and accept responsibility for proceeding with this booking during potentially dangerous conditions.
              </span>
            </label>
          </div>
        )}

        {/* Expand/Collapse Daily Forecast */}
        {riskPrediction.predictions && riskPrediction.predictions.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-4 flex items-center justify-between w-full text-sm font-semibold text-gray-700 hover:text-gray-900 transition"
          >
            <span>
              View Daily Forecast ({riskPrediction.predictions.length} days)
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Daily Predictions */}
      {expanded && riskPrediction.predictions && (
        <div className="border-t-2 border-gray-200 bg-white p-6">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {riskPrediction.predictions.map((pred, idx) => (
              <DailyForecastRow key={idx} prediction={pred} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBadge({ label, count, color }) {
  if (count === 0) return null;
  
  return (
    <div className={`${color} border rounded-md px-3 py-1 text-xs font-bold`}>
      {count} {label}
    </div>
  );
}

function DailyForecastRow({ prediction }) {
  const config = RISK_CONFIG[prediction.risk_level] || RISK_CONFIG.SAFE;
  const RiskIcon = config.icon;
  const weather = prediction.weather_data;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border-2 ${config.borderColor} ${config.bgColor}`}>
      <RiskIcon className={`h-5 w-5 ${config.color} flex-shrink-0 mt-0.5`} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-gray-900">
            {new Date(prediction.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
          <span className={`text-xs font-bold px-2 py-1 rounded ${config.badgeColor}`}>
            {prediction.risk_level}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-700">
          <div className="flex items-center gap-1.5">
            <Thermometer className="h-4 w-4 text-gray-500" />
            <span className="font-medium">
              {weather.min_temp}° - {weather.max_temp}°C
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Wind className="h-4 w-4 text-gray-500" />
            <span className="font-medium">
              {weather.avg_wind_speed.toFixed(1)} m/s
            </span>
          </div>
          
          {weather.total_rainfall > 0 && (
            <div className="flex items-center gap-1.5">
              <Cloud className="h-4 w-4 text-blue-500" />
              <span className="font-medium">
                {weather.total_rainfall.toFixed(1)}mm rain
              </span>
            </div>
          )}
          
          {weather.snowfall_days > 0 && (
            <div className="flex items-center gap-1.5">
              <Snowflake className="h-4 w-4 text-blue-400" />
              <span className="font-medium">
                Snow expected
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-gray-500" />
            <span className="font-medium">
              {(weather.visibility_index / 1000).toFixed(1)}km
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-500">Confidence:</span>
          <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[100px]">
            <div 
              className={`h-1.5 rounded-full ${
                prediction.confidence_score > 0.8 ? 'bg-green-600' :
                prediction.confidence_score > 0.6 ? 'bg-yellow-600' :
                'bg-orange-600'
              }`}
              style={{ width: `${prediction.confidence_score * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-gray-700">
            {(prediction.confidence_score * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
