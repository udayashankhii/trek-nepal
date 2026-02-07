// src/api/service/trekRiskService.js
import axios from 'axios';

const RISK_API_BASE_URL = import.meta.env.VITE_RISK_API_URL || 'http://127.0.0.1:5000';

/**
 * Get trek risk prediction for specific dates
 */
export const getTrekRiskPrediction = async ({
  trekSlug,
  latitude,
  elevation,
  dateStart,
  dateEnd = null
}) => {
  try {
    const response = await axios.post(
      `${RISK_API_BASE_URL}/predict`,
      {
        trek_id: trekSlug,
        latitude: parseFloat(latitude),
        elevation: parseInt(elevation, 10),
        date_start: dateStart,
        date_end: dateEnd || dateStart
      },
      {
        timeout: 15000, // 15 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Risk prediction API error:', error);

    // Provide user-friendly error messages
    if (error.response?.status === 400) {
      throw new Error(
        error.response.data.detail ||
        'Invalid date range. Please select dates within the next 16 days.'
      );
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Weather service timeout. Please try again.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Weather service unavailable. Connection failed.');
    }

    throw new Error('Unable to fetch weather prediction');
  }
};

/**
 * Check if risk API is available
 */
export const checkRiskApiHealth = async () => {
  try {
    const response = await axios.get(`${RISK_API_BASE_URL}/api/health`, {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    return { status: 'unavailable' };
  }
};

export const getTrekRiskByItinerary = async ({
  trekSlug,
  itineraryDays,
  startDate
}) => {
  try {
    // ✅ Validate inputs
    if (!itineraryDays || !Array.isArray(itineraryDays) || itineraryDays.length === 0) {
      throw new Error('Trek itinerary data not available');
    }

    if (!startDate) {
      throw new Error('Start date is required');
    }

    // Convert itinerary to API format with dates
    const days = itineraryDays.map((day, index) => {
      // Calculate date for this day
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + index);
      const dateStr = dayDate.toISOString().split('T')[0];
      
      // Parse altitude string: "1,800m" or "1800m" -> 1800
      const altitudeStr = day.altitude || '0m';
      const elevation = parseInt(
        altitudeStr.replace(/,/g, '').replace(/m/g, '').trim(), 
        10
      ) || 0;
      
      return {
        day: day.day,
        date: dateStr,
        latitude: parseFloat(day.latitude),
        longitude: parseFloat(day.longitude),
        elevation: elevation,
        place_name: day.place_name || day.title
      };
    });

    console.log('🌤️ Requesting day-by-day weather predictions:', {
      trek: trekSlug,
      days: days.length,
      startDate,
      endpoint: `${RISK_API_BASE_URL}/predict-itinerary`
    });

    const response = await axios.post(
      `${RISK_API_BASE_URL}/predict-itinerary`,
      {
        trek_id: trekSlug,
        days: days
      },
      {
        timeout: 30000, // 30 seconds for multiple days
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Received day-by-day predictions:', response.data);
    return response.data;

  } catch (error) {
    console.error('Risk prediction API error:', error);

    // User-friendly error messages
    if (error.message === 'Trek itinerary data not available') {
      throw error; // Pass through our custom error
    } else if (error.response?.status === 400) {
      throw new Error(
        error.response.data.error ||
        'Invalid date range. Please select dates within the next 16 days.'
      );
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Weather service timeout. Please try again.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Weather service unavailable. Connection failed.');
    }

    throw new Error(error.response?.data?.error || 'Unable to fetch weather prediction');
  }
};
