"""
OpenMeteo Weather Service
=========================
Fetches real-time weather forecasts from OpenMeteo API.
Falls back to ML predictions for dates beyond forecast range.
"""

import requests
from datetime import datetime, timedelta

class OpenMeteoService:
    """
    Handles real-time weather forecasts from OpenMeteo API.
    
    OpenMeteo provides:
    - 7-day forecast (free tier)
    - 16-day forecast (with extended params)
    - Temperature, wind, precipitation, etc.
    """
    
    BASE_URL = "https://api.open-meteo.com/v1/forecast"
    
    # Trek coordinates (latitude, longitude, elevation)
    TREK_COORDS = {
        "Annapurna Base Camp": {"lat": 28.53, "lon": 83.87, "elevation": 4130},
        "Everest Base Camp": {"lat": 28.00, "lon": 86.85, "elevation": 5364},
        "Mardi Himal": {"lat": 28.45, "lon": 83.95, "elevation": 4500},
        "Langtang Valley": {"lat": 28.21, "lon": 85.55, "elevation": 3800},
        "Manaslu Circuit": {"lat": 28.55, "lon": 84.56, "elevation": 5106},
        "Gokyo Lakes": {"lat": 27.95, "lon": 86.68, "elevation": 4790},
        "Annapurna Circuit": {"lat": 28.66, "lon": 84.22, "elevation": 5416},
        "Tilicho Lake": {"lat": 28.69, "lon": 83.86, "elevation": 4919},
        "Upper Mustang": {"lat": 29.18, "lon": 83.93, "elevation": 3800},
        "Makalu Base Camp": {"lat": 27.88, "lon": 87.08, "elevation": 4870},
        "Kanchenjunga BC": {"lat": 27.70, "lon": 88.15, "elevation": 5143},
        "Three Passes Trek": {"lat": 27.96, "lon": 86.78, "elevation": 5545},
        "Nar Phu Valley": {"lat": 28.79, "lon": 84.35, "elevation": 5320},
        "Tsum Valley": {"lat": 28.44, "lon": 85.06, "elevation": 3700},
        "Upper Dolpo": {"lat": 29.25, "lon": 82.95, "elevation": 5190},
        "Rara Lake Trek": {"lat": 29.52, "lon": 82.08, "elevation": 2990},
        "Pikey Peak": {"lat": 27.64, "lon": 86.41, "elevation": 4065},
        "Gosaikunda Lakes": {"lat": 28.08, "lon": 85.41, "elevation": 4380},
        "Helambu Trek": {"lat": 28.08, "lon": 85.52, "elevation": 3640},
        "Rolwaling Trek": {"lat": 27.88, "lon": 86.28, "elevation": 4540}
    }
    
    @staticmethod
    def is_forecast_available(target_date):
        """
        Check if OpenMeteo can provide forecast for this date.
        
        Args:
            target_date: datetime object
            
        Returns:
            bool: True if within forecast range (next 16 days)
        """
        days_ahead = (target_date - datetime.now()).days
        return 0 <= days_ahead <= 16
    
    @staticmethod
    def get_forecast(trek_name, target_date):
        """
        Get weather forecast from OpenMeteo for a specific trek and date.
        
        Args:
            trek_name: Name of the trek
            target_date: datetime object for the target date
            
        Returns:
            dict: Weather data or None if unavailable
        """
        # Check if we have coordinates for this trek
        if trek_name not in OpenMeteoService.TREK_COORDS:
            print(f"⚠️  No coordinates found for {trek_name}")
            return None
        
        # Check if date is within forecast range
        if not OpenMeteoService.is_forecast_available(target_date):
            days_ahead = (target_date - datetime.now()).days
            print(f"⚠️  Date is {days_ahead} days ahead, beyond OpenMeteo range (16 days)")
            return None
        
        coords = OpenMeteoService.TREK_COORDS[trek_name]
        
        # Prepare API request
        params = {
            "latitude": coords["lat"],
            "longitude": coords["lon"],
            "daily": [
                "temperature_2m_max",
                "temperature_2m_min",
                "windspeed_10m_max",
                "precipitation_sum",
                "weathercode"
            ],
            "timezone": "Asia/Kathmandu",
            "forecast_days": 16
        }
        
        try:
            response = requests.get(OpenMeteoService.BASE_URL, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            # Find the specific date in the forecast
            daily = data.get("daily", {})
            dates = daily.get("time", [])
            
            target_date_str = target_date.strftime("%Y-%m-%d")
            
            if target_date_str not in dates:
                print(f"⚠️  Date {target_date_str} not in forecast")
                return None
            
            idx = dates.index(target_date_str)
            
            # Extract weather data for this date
            temp_max = daily["temperature_2m_max"][idx]
            temp_min = daily["temperature_2m_min"][idx]
            wind_speed = daily["windspeed_10m_max"][idx]
            precipitation = daily["precipitation_sum"][idx]
            weather_code = daily["weathercode"][idx]
            
            # Determine safety status based on conditions
            safety_status = OpenMeteoService._assess_safety(
                temp_max, temp_min, wind_speed, precipitation, weather_code
            )
            
            return {
                "source": "OpenMeteo",
                "label": safety_status,
                "temp_max": round(temp_max, 1),
                "temp_min": round(temp_min, 1),
                "temp": round((temp_max + temp_min) / 2, 1),  # Average temp
                "wind": round(wind_speed, 1),
                "rain": round(precipitation, 1),
                "weather_code": weather_code
            }
            
        except requests.exceptions.RequestException as e:
            print(f"❌ OpenMeteo API error: {e}")
            return None
        except (KeyError, IndexError) as e:
            print(f"❌ Error parsing OpenMeteo response: {e}")
            return None
    
    @staticmethod
    def _assess_safety(temp_max, temp_min, wind_speed, precipitation, weather_code):
        """
        Assess trekking safety based on weather conditions.
        
        Weather codes: https://open-meteo.com/en/docs
        0 = Clear sky
        1-3 = Partly cloudy
        45-48 = Fog
        51-67 = Rain
        71-77 = Snow
        80-99 = Thunderstorms
        
        Args:
            temp_max: Maximum temperature (°C)
            temp_min: Minimum temperature (°C)
            wind_speed: Wind speed (km/h)
            precipitation: Precipitation (mm)
            weather_code: WMO weather code
            
        Returns:
            str: "Dangerous", "Caution", or "Safe"
        """
        # DANGEROUS conditions
        if (temp_min < -15 or                    # Extreme cold
            wind_speed > 50 or                   # Very high winds
            precipitation > 50 or                # Heavy precipitation
            weather_code in [95, 96, 99]):       # Thunderstorms
            return "Dangerous"
        
        # CAUTION conditions
        if (temp_min < -5 or                     # Cold
            wind_speed > 30 or                   # High winds
            precipitation > 20 or                # Moderate to heavy rain
            weather_code in [71, 73, 75, 77, 85, 86]):  # Snow
            return "Caution"
        
        # SAFE conditions
        return "Safe"
    
    @staticmethod
    def get_multi_day_forecast(trek_name, start_date, num_days):
        """
        Get forecast for multiple days (for multi-day treks).
        
        Args:
            trek_name: Name of the trek
            start_date: datetime object for start date
            num_days: Number of days to forecast
            
        Returns:
            list: List of weather predictions or None
        """
        forecasts = []
        
        for i in range(0, num_days, 3):  # Sample every 3 days
            current_date = start_date + timedelta(days=i)
            forecast = OpenMeteoService.get_forecast(trek_name, current_date)
            
            if forecast:
                forecasts.append(forecast)
            else:
                # If any date fails, return None to trigger ML fallback
                return None
        
        return forecasts if forecasts else None