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
