// services/weatherService.js
const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";

// Trek location coordinates with accurate elevation data
export const TREK_LOCATIONS = {
  everest: {
    name: "Everest Base Camp",
    latitude: 28.0028,
    longitude: 86.8528,
    elevation: 5364, // meters
    timezone: "Asia/Kathmandu",
  },
  annapurna: {
    name: "Thorong La Pass",
    latitude: 28.7944,
    longitude: 83.9377,
    elevation: 5416,
    timezone: "Asia/Kathmandu",
  },
  manaslu: {
    name: "Larke Pass",
    latitude: 28.6631,
    longitude: 84.6186,
    elevation: 5106,
    timezone: "Asia/Kathmandu",
  },
  langtang: {
    name: "Kyanjin Gompa",
    latitude: 28.2166,
    longitude: 85.5667,
    elevation: 3870,
    timezone: "Asia/Kathmandu",
  },
};

// WMO Weather Code Interpretation
const WMO_WEATHER_CODES = {
  0: { description: "Clear Sky", severity: "clear" },
  1: { description: "Mainly Clear", severity: "clear" },
  2: { description: "Partly Cloudy", severity: "partly_cloudy" },
  3: { description: "Overcast", severity: "cloudy" },
  45: { description: "Foggy", severity: "fog" },
  48: { description: "Rime Fog", severity: "fog" },
  51: { description: "Light Drizzle", severity: "drizzle" },
  53: { description: "Moderate Drizzle", severity: "drizzle" },
  55: { description: "Dense Drizzle", severity: "drizzle" },
  56: { description: "Freezing Drizzle", severity: "freezing" },
  57: { description: "Dense Freezing Drizzle", severity: "freezing" },
  61: { description: "Slight Rain", severity: "rain" },
  63: { description: "Moderate Rain", severity: "rain" },
  65: { description: "Heavy Rain", severity: "rain" },
  66: { description: "Light Freezing Rain", severity: "freezing" },
  67: { description: "Heavy Freezing Rain", severity: "freezing" },
  71: { description: "Slight Snow", severity: "snow" },
  73: { description: "Moderate Snow", severity: "snow" },
  75: { description: "Heavy Snow", severity: "snow" },
  77: { description: "Snow Grains", severity: "snow" },
  80: { description: "Slight Rain Showers", severity: "rain" },
  81: { description: "Moderate Rain Showers", severity: "rain" },
  82: { description: "Violent Rain Showers", severity: "rain" },
  85: { description: "Slight Snow Showers", severity: "snow" },
  86: { description: "Heavy Snow Showers", severity: "snow" },
  95: { description: "Thunderstorm", severity: "thunderstorm" },
  96: { description: "Thunderstorm with Hail", severity: "thunderstorm" },
  99: { description: "Heavy Thunderstorm with Hail", severity: "thunderstorm" },
};

// Generate trekking recommendations based on weather conditions
const getTrekkingRemark = (weatherCode, temperature, windSpeed) => {
  const weather = WMO_WEATHER_CODES[weatherCode] || WMO_WEATHER_CODES[0];

  if (weather.severity === "thunderstorm") {
    return "Dangerous - Avoid trekking";
  }

  if (weather.severity === "snow" && windSpeed > 25) {
    return "Blizzard conditions";
  }

  if (weather.severity === "snow") {
    return "Crampons advised";
  }

  if (weather.severity === "freezing") {
    return "Extreme cold warning";
  }

  if (weather.severity === "rain") {
    return "Carry waterproof gear";
  }

  if (weather.severity === "fog") {
    return "Limited visibility";
  }

  if (weather.severity === "cloudy" || weather.severity === "partly_cloudy") {
    return "Carry layers";
  }

  if (temperature > -10 && windSpeed < 15) {
    return "Perfect for trekking";
  }

  return "Good conditions";
};

// Cache implementation to reduce API calls
class WeatherCache {
  constructor(ttl = 10 * 60 * 1000) { // 10 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear() {
    this.cache.clear();
  }
}

const weatherCache = new WeatherCache();

/**
 * Fetch current weather data from Open-Meteo API
 * @param {string} locationKey - Key from TREK_LOCATIONS
 * @returns {Promise<Object>} Weather data object
 */
export async function fetchWeatherData(locationKey) {
  // Check cache first
  const cacheKey = `weather_${locationKey}`;
  const cached = weatherCache.get(cacheKey);
  if (cached) {
    console.log(`Using cached weather data for ${locationKey}`);
    return cached;
  }

  const location = TREK_LOCATIONS[locationKey];
  if (!location) {
    throw new Error(`Invalid location key: ${locationKey}`);
  }

  try {
    const params = new URLSearchParams({
      latitude: location.latitude,
      longitude: location.longitude,
      elevation: location.elevation,
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "weather_code",
        "wind_speed_10m",
        "wind_direction_10m",
      ].join(","),
      hourly: "visibility",
      timezone: location.timezone,
      forecast_days: 1,
      models: "gem_seamless", // Use GEM model for better high-altitude accuracy
    });

    const response = await fetch(`${OPEN_METEO_BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Process the weather data
    const current = data.current;
    const weatherCode = current.weather_code;
    const weatherInfo = WMO_WEATHER_CODES[weatherCode] || WMO_WEATHER_CODES[0];

    // Get average visibility from hourly data
    const avgVisibility = data.hourly?.visibility?.length
      ? Math.round(
        data.hourly.visibility.reduce((a, b) => a + (b || 0), 0) /
        data.hourly.visibility.filter(v => v !== null).length
      )
      : 10000;

    const weatherData = {
      temperature: `${Math.round(current.temperature_2m)}°C`,
      apparentTemperature: `${Math.round(current.apparent_temperature)}°C`,
      location: location.name,
      condition: weatherInfo.description,
      weatherCode: weatherCode,
      severity: weatherInfo.severity,
      remark: getTrekkingRemark(
        weatherCode,
        current.temperature_2m,
        current.wind_speed_10m
      ),
      visibility: `${Math.round(avgVisibility / 1000)}km`,
      wind: `${Math.round(current.wind_speed_10m)} km/h`,
      windDirection: current.wind_direction_10m,
      humidity: `${current.relative_humidity_2m}%`,
      elevation: `${location.elevation}m`,
      isVisible: true,
      timestamp: Date.now(),
    };

    // Cache the result
    weatherCache.set(cacheKey, weatherData);

    return weatherData;
  } catch (error) {
    console.error(`Error fetching weather for ${locationKey}:`, error);

    // Return fallback data on error
    return {
      temperature: "--°C",
      apparentTemperature: "--°C",
      location: location.name,
      condition: "Data Unavailable",
      weatherCode: 0,
      severity: "clear",
      remark: "Weather data unavailable",
      visibility: "--km",
      wind: "-- km/h",
      windDirection: 0,
      humidity: "--%",
      elevation: `${location.elevation}m`,
      isVisible: true,
      error: true,
      timestamp: Date.now(),
    };
  }
}

/**
 * Fetch weather data for multiple locations in parallel
 * @param {string[]} locationKeys - Array of location keys
 * @returns {Promise<Object>} Object with location keys as keys and weather data as values
 */
export async function fetchMultipleWeatherData(locationKeys) {
  try {
    const promises = locationKeys.map(key => fetchWeatherData(key));
    const results = await Promise.allSettled(promises);

    return locationKeys.reduce((acc, key, index) => {
      const result = results[index];
      acc[key] = result.status === "fulfilled" ? result.value : null;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching multiple weather data:", error);
    return {};
  }
}

// Export cache for manual control if needed
export { weatherCache };
