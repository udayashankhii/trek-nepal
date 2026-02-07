"""
Trek Risk Prediction API
Single-file FastAPI application for trek weather risk classification
Uses ensemble of ML models with Open-Meteo weather data (historical + forecast)
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
import requests
import numpy as np
import pandas as pd
import sys
from typing import List, Optional, Dict
from enum import Enum
import warnings
import os

warnings.filterwarnings('ignore')

# ============================================================================
# NUMPY COMPATIBILITY CHECK
# ============================================================================
numpy_version = tuple(map(int, np.__version__.split('.')[:2]))

if numpy_version < (1, 23):
    print("⚠️  WARNING: NumPy < 1.23 detected.")
    print("    Your models may have compatibility issues.")
    print("    Recommended: pip install --upgrade numpy>=1.23.0")


# Import joblib after numpy check
import joblib

# ============================================================================
# CONFIGURATION
# ============================================================================

# Get the directory where the current file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Point to your actual models folder
MODEL_PATH = os.path.join(BASE_DIR, 'models_optimized', '')

OPENMETEO_ARCHIVE_API = "https://archive-api.open-meteo.com/v1/archive"
OPENMETEO_FORECAST_API = "https://api.open-meteo.com/v1/forecast"

# ============================================================================
# DATA MODELS
# ============================================================================

class RiskLevel(str, Enum):
    """Risk level classification"""
    SAFE = "SAFE"
    WARNING = "WARNING"
    CAUTION = "CAUTION"
    DANGER = "DANGER"


class TrekPredictionRequest(BaseModel):
    """Request model for trek risk prediction"""
    trek_id: str = Field(..., description="Trek identifier")
    latitude: float = Field(..., ge=-90, le=90, description="Trek latitude")
    elevation: float = Field(..., ge=0, description="Trek elevation in meters")
    date_start: str = Field(..., description="Start date (YYYY-MM-DD format)")
    date_end: Optional[str] = Field(None, description="End date (YYYY-MM-DD format). If None, uses single date")
    
    class Config:
        json_schema_extra = {
            "example": {
                "trek_id": "everest_base_camp",
                "latitude": 27.99,
                "elevation": 5545,
                "date_start": "2024-02-10",
                "date_end": "2024-02-24"
            }
        }


class WeatherData(BaseModel):
    """Single day weather data"""
    date: str
    min_temp: float
    max_temp: float
    avg_wind_speed: float
    total_rainfall: float
    snowfall_days: int
    visibility_index: float
    

class RiskPrediction(BaseModel):
    """Single day risk prediction"""
    date: str
    risk_level: RiskLevel
    confidence_score: float
    model_votes: Dict[str, str]
    probabilities: Dict[str, float]
    weather_data: WeatherData


class TrekPredictionResponse(BaseModel):
    """Response model for trek risk prediction"""
    trek_id: str
    date_range: str
    overall_risk: RiskLevel
    overall_confidence: float
    average_confidence: float
    dangerous_days: int
    caution_days: int
    warning_days: int
    safe_days: int
    predictions: List[RiskPrediction]
    recommendation: str
    data_source: str  # ⭐ New: indicates if historical or forecast


# ============================================================================
# MODEL LOADING WITH COMPATIBILITY FALLBACK
# ============================================================================

class ModelEnsemble:
    """Ensemble of trained models for risk prediction"""
    
    def __init__(self, model_path: str = MODEL_PATH):
        """Load all models and preprocessing artifacts"""
        # Verify path exists
        if not os.path.exists(model_path):
            raise RuntimeError(f"Model path does not exist: {model_path}")
        
        self.models = {}
        self.failed_models = []
        
        # List of models to try loading
        model_files = [
            'random_forest',
            'gradient_boosting',
            'neural_network'
        ]
        
        # Try loading each model
        for model_name in model_files:
            model_file = os.path.join(model_path, f"{model_name}.pkl")
            
            try:
                model = joblib.load(model_file)
                self.models[model_name] = model
            except Exception as e:
                error_msg = str(e)
                self.failed_models.append(model_name)
                
                # Check if it's a numpy compatibility issue
                if "PCG64" in error_msg or "BitGenerator" in error_msg:
                    print(f"⚠️  {model_name} failed: numpy compatibility issue detected")
                    print(f"    Recommended: pip install --upgrade numpy>=1.23.0")
        
        # Check if we have at least one working model
        if len(self.models) == 0:
            raise RuntimeError(
                f"Failed to load any models. Tried: {model_files}\n"
                f"All failed. Check numpy version and model compatibility."
            )
        elif len(self.failed_models) > 0:
            print(f"⚠️  {len(self.failed_models)} models failed, continuing with {len(self.models)}")
        
        # Load preprocessing artifacts
        try:
            self.scaler = joblib.load(os.path.join(model_path, "scaler.pkl"))
            self.label_encoder = joblib.load(os.path.join(model_path, "label_encoder.pkl"))
            self.feature_columns = joblib.load(os.path.join(model_path, "feature_columns.pkl"))
        except Exception as e:
            raise RuntimeError(f"Failed to load preprocessing artifacts: {str(e)}")
    
    def predict_ensemble(self, weather_features: pd.DataFrame) -> tuple:
        """
        Make ensemble prediction with voting
        
        Returns:
            (risk_code, confidence_score, model_votes, probabilities)
        """
        predictions = {}
        all_probs = []
        
        # Get predictions from each working model
        for model_name, model in self.models.items():
            # Scale features
            X_scaled = self.scaler.transform(weather_features)
            
            # Predict
            pred = model.predict(X_scaled)[0]
            predictions[model_name] = int(pred)
            
            # Get probabilities if available
            if hasattr(model, 'predict_proba'):
                probs = model.predict_proba(X_scaled)[0]
                all_probs.append(probs)
        
        # Majority voting
        votes = list(predictions.values())
        risk_code = max(set(votes), key=votes.count)  # Most common prediction
        
        # Average probabilities
        if all_probs:
            avg_probs = np.mean(all_probs, axis=0)
        else:
            avg_probs = np.zeros(len(self.label_encoder.classes_))
        
        # Confidence score (max probability)
        confidence = float(np.max(avg_probs))
        
        # Model votes mapping
        model_votes = {
            name: self.label_encoder.inverse_transform([pred])[0]
            for name, pred in predictions.items()
        }
        
        # Probability mapping
        prob_dict = {
            self.label_encoder.classes_[i]: float(avg_probs[i])
            for i in range(len(self.label_encoder.classes_))
        }
        
        return risk_code, confidence, model_votes, prob_dict


# ============================================================================
# WEATHER DATA FETCHING
# ============================================================================
class DayLocation(BaseModel):
    day: int
    date: str  # YYYY-MM-DD
    latitude: float
    longitude: float
    elevation: float
    place_name: Optional[str]

class TrekItineraryPredictionRequest(BaseModel):
    trek_id: str
    days: List[DayLocation]

class WeatherFetcher:
    """Fetch weather data from Open-Meteo API (historical and forecast)"""
    
    @staticmethod
    def fetch_weather(latitude: float, elevation: float, 
                     date_start: str, date_end: str) -> tuple:
        """
        Fetch weather data from Open-Meteo API
        Automatically uses archive API for past dates, forecast API for future dates
        
        Parameters:
        -----------
        latitude : float
            Trek latitude
        elevation : float
            Trek elevation (used for visibility estimation)
        date_start : str
            Start date (YYYY-MM-DD)
        date_end : str
            End date (YYYY-MM-DD)
        
        Returns:
        --------
        tuple: (weather_df, data_source)
            weather_df: pd.DataFrame with weather data
            data_source: str indicating "historical" or "forecast"
        """
        print(f"📡 Fetching weather data for {date_start} to {date_end}...")
        
        # Parse dates
        start = datetime.strptime(date_start, "%Y-%m-%d")
        end = datetime.strptime(date_end, "%Y-%m-%d")
        today = datetime.now().date()
        
        # Check if dates are too far in future (Open-Meteo forecast limit is ~16 days)
        max_forecast_date = today + timedelta(days=16)
        if start.date() > max_forecast_date:
            raise HTTPException(
                status_code=400,
                detail=f"Date too far in future. Open-Meteo forecast API only supports up to 16 days ahead."
            )
        
        # Limit to max 16 days (Open-Meteo forecast limit)
        if (end - start).days > 16:
            end = start + timedelta(days=15)
            date_end = end.strftime("%Y-%m-%d")
            print(f"⚠️  Limiting to 16 days (max forecast range): {date_start} to {date_end}")
        
        try:
            # Longitude of Nepal (approximate center for treks)
            longitude = 84.0
            
            # ⭐ NEW: Choose API based on date range
            if end.date() <= today:
                # Past dates: use archive API
                print("📊 Using historical data from Archive API")
                data_source = "historical"
                weather_df = WeatherFetcher._fetch_from_archive_api(
                    latitude, longitude, date_start, date_end, elevation
                )
            else:
                # Future dates: use forecast API
                print("🔮 Using forecast data from Forecast API")
                data_source = "forecast"
                weather_df = WeatherFetcher._fetch_from_forecast_api(
                    latitude, longitude, date_start, date_end, elevation
                )
            
            # Create full feature set
            weather_df = WeatherFetcher._create_features(weather_df)
            
            print(f"✅ Retrieved {len(weather_df)} days of {data_source} data")
            return weather_df, data_source
            
        except requests.exceptions.RequestException as e:
            raise HTTPException(
                status_code=500,
                detail=f"Weather API error: {str(e)}"
            )
    
    @staticmethod
    def _fetch_from_archive_api(latitude: float, longitude: float, 
                               date_start: str, date_end: str, elevation: float) -> pd.DataFrame:
        """Fetch historical data from Archive API"""
        params = {
            'latitude': latitude,
            'longitude': longitude,
            'start_date': date_start,
            'end_date': date_end,
            'hourly': [
                'temperature_2m',
                'windspeed_10m',
                'precipitation',
                'snowfall',
                'visibility'
            ],
            'temperature_unit': 'celsius',
            'windspeed_unit': 'ms',
            'precipitation_unit': 'mm',
            'timezone': 'UTC'
        }
        
        response = requests.get(OPENMETEO_ARCHIVE_API, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        # Process hourly data to daily data
        hourly = data['hourly']
        times = pd.to_datetime(hourly['time'])
        dates = times.strftime('%Y-%m-%d')
        
        weather_df = pd.DataFrame({
            'date': dates,
            'temperature': hourly['temperature_2m'],
            'windspeed': hourly['windspeed_10m'],
            'precipitation': hourly['precipitation'],
            'snowfall': hourly['snowfall'],
            'visibility': hourly['visibility']
        })
        
        # Aggregate to daily data
        daily = weather_df.groupby('date').agg({
            'temperature': ['min', 'max', 'mean'],
            'windspeed': 'mean',
            'precipitation': 'sum',
            'snowfall': 'sum',
            'visibility': 'mean'
        }).round(2)
        
        # Flatten columns
        daily.columns = [
            'min_temp', 'max_temp', 'avg_temp',
            'avg_wind_speed', 'total_rainfall', 'snowfall_mm',
            'visibility_index'
        ]
        
        daily = daily.reset_index()
        
        # Add location features required by model
        daily['latitude'] = latitude
        daily['elevation'] = elevation
        
        return daily
    
    @staticmethod
    def _fetch_from_forecast_api(latitude: float, longitude: float, 
                                date_start: str, date_end: str, elevation: float) -> pd.DataFrame:
        """Fetch forecast data from Forecast API"""
        params = {
            'latitude': latitude,
            'longitude': longitude,
            'start_date': date_start,
            'end_date': date_end,
            'daily': [
                'temperature_2m_max',
                'temperature_2m_min',
                'windspeed_10m_max',
                'precipitation_sum',
                'snowfall_sum',
                'visibility_max'
            ],
            'temperature_unit': 'celsius',
            'windspeed_unit': 'ms',
            'precipitation_unit': 'mm',
            'timezone': 'UTC'
        }
        
        response = requests.get(OPENMETEO_FORECAST_API, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        # Extract daily data
        daily_data = data['daily']
        
        daily = pd.DataFrame({
            'date': daily_data['time'],
            'min_temp': daily_data['temperature_2m_min'],
            'max_temp': daily_data['temperature_2m_max'],
            'avg_wind_speed': daily_data['windspeed_10m_max'],
            'total_rainfall': daily_data['precipitation_sum'],
            'snowfall_mm': daily_data['snowfall_sum'],
            'visibility_index': daily_data['visibility_max']
        }).round(2)
        
        # Calculate average temperature
        daily['avg_temp'] = (daily['min_temp'] + daily['max_temp']) / 2
        
        # Add location features required by model
        daily['latitude'] = latitude
        daily['elevation'] = elevation
        
        return daily
    
    @staticmethod
    def _create_features(weather_df: pd.DataFrame) -> pd.DataFrame:
        """Create all engineered features from raw weather data"""
        
        df = weather_df.copy()
        
        # Temperature-based features
        df['temp_range'] = df['max_temp'] - df['min_temp']
        df['extreme_cold'] = (df['min_temp'] < -15).astype(int)
        df['extreme_heat'] = (df['max_temp'] > 25).astype(int)
        df['cold_day'] = (df['min_temp'] < -5).astype(int)
        df['hot_day'] = (df['max_temp'] > 15).astype(int)
        
        # Wind-based features
        df['high_wind'] = (df['avg_wind_speed'] > 6).astype(int)
        df['dangerous_wind'] = (df['avg_wind_speed'] > 8).astype(int)
        df['moderate_wind'] = ((df['avg_wind_speed'] > 4) & (df['avg_wind_speed'] <= 6)).astype(int)
        df['wind_squared'] = df['avg_wind_speed'] ** 2
        
        # Precipitation-based features
        df['heavy_rain'] = (df['total_rainfall'] > 20).astype(int)
        df['moderate_rain'] = ((df['total_rainfall'] > 5) & (df['total_rainfall'] <= 20)).astype(int)
        df['light_rain'] = ((df['total_rainfall'] > 0) & (df['total_rainfall'] <= 5)).astype(int)
        df['rainfall_log'] = np.log1p(df['total_rainfall'].astype(np.float64))
        
        # Snowfall-based features
        df['snowfall_days'] = (df['snowfall_mm'] > 0.5).astype(int)
        df['snow_present'] = (df['snowfall_days'] > 0).astype(int)
        df['heavy_snow'] = (df['snowfall_days'] >= 2).astype(int)
        df['light_snow'] = (df['snowfall_days'] == 1).astype(int)
        
        # Visibility features
        df['poor_visibility'] = (df['visibility_index'] < 5000).astype(int)
        df['low_visibility'] = ((df['visibility_index'] >= 5000) & (df['visibility_index'] < 10000)).astype(int)
        df['visibility_log'] = np.log1p(df['visibility_index'].astype(np.float64))
        
        # Elevation-based features
        df['high_altitude'] = (df['elevation'] > 5000).astype(int)
        df['very_high_altitude'] = (df['elevation'] > 6000).astype(int)
        df['elevation_scaled'] = df['elevation'] / 1000
        
        # Temporal features
        dates = pd.to_datetime(df['date'])
        month = dates.dt.month
        df['day_of_year'] = dates.dt.dayofyear
        df['is_monsoon'] = month.isin([6, 7, 8, 9]).astype(int)
        df['is_dry_season'] = month.isin([10, 11, 12, 1, 2, 3]).astype(int)
        df['is_spring'] = month.isin([3, 4, 5]).astype(int)
        df['is_fall'] = month.isin([9, 10, 11]).astype(int)
        df['is_winter'] = month.isin([12, 1, 2]).astype(int)
        
        # Composite risk indicators
        df['rain_wind_combo'] = df['moderate_rain'] * df['high_wind']
        df['snow_wind_combo'] = df['snow_present'] * df['high_wind']
        df['extreme_weather'] = df['extreme_cold'] + df['heavy_rain'] + df['heavy_snow']
        df['cold_rain'] = df['cold_day'] * df['moderate_rain']
        df['cold_snow'] = df['extreme_cold'] * df['snow_present']
        df['altitude_risk_temp'] = (df['extreme_cold'] * (df['elevation'] / 1000)) / 5
        
        # Fill NaN values with column mean or 0 for safety
        df = df.fillna(df.mean(numeric_only=True))
        df = df.fillna(0)
        
        return df


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def _generate_recommendation(overall_risk: str, risk_counts: dict, total_days: int) -> str:
    """Generate trek recommendation based on risk assessment"""
    
    if overall_risk == "DANGER":
        return (
            f"❌ DO NOT TREK - Dangerous conditions predicted. "
            f"{risk_counts['DANGER']} days with DANGER risk out of {total_days}. "
            "Reschedule your trek to safer dates."
        )
    elif overall_risk == "CAUTION":
        if risk_counts['DANGER'] > 0:
            return (
                f"⚠️ PROCEED WITH EXTREME CAUTION - {risk_counts['DANGER']} DANGER days detected. "
                f"Requires experienced guide, proper equipment, and contingency plans. "
                "Consider changing dates if possible."
            )
        else:
            return (
                f"⚠️ PROCEED WITH CAUTION - {risk_counts['CAUTION']} CAUTION days. "
                "Requires experienced guide and proper safety gear."
            )
    elif overall_risk == "WARNING":
        return (
            f"🟡 PROCEED CAREFULLY - {risk_counts['WARNING']} WARNING days predicted. "
            f"{risk_counts['SAFE']} SAFE days available. "
            "Pack appropriate weather gear and follow guide instructions."
        )
    else:  # SAFE
        safe_percentage = (risk_counts['SAFE'] / total_days) * 100
        return (
            f"✅ SAFE TO TREK - {safe_percentage:.0f}% of days have SAFE conditions. "
            "Excellent weather conditions expected. Standard precautions recommended."
        )


# ============================================================================
# FASTAPI APPLICATION
# ============================================================================

app = FastAPI(
    title="Trek Risk Prediction API",
    description="ML-powered trek weather risk classification using ensemble models",
    version="2.0.0"
)

# ⭐ ADD CORS MIDDLEWARE (must be before routes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models on startup
@app.on_event("startup")
async def load_models():
    """Load models when application starts"""
    global ensemble
    try:
        ensemble = ModelEnsemble()
        print("✅ API ready for predictions!")
    except Exception as e:
        print(f"❌ Failed to load models: {e}")
        raise


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/", tags=["Info"])
async def root():
    """API information endpoint"""
    return {
        "name": "Trek Risk Prediction API",
        "version": "2.0.0",
        "description": "ML-based trek weather risk classification (historical + forecast)",
        "features": [
            "Historical data analysis (past dates)",
            "Future forecast predictions",
            "Ensemble voting from working models",
            "Batch predictions support"
        ],
        "endpoints": {
            "predict": "/predict (single trek)",
            "predict-batch": "/predict-batch (multiple treks)",
            "health": "/health"
        }
    }


@app.get("/health", tags=["Info"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": len(ensemble.models),
        "timestamp": datetime.now().isoformat()
    }


@app.post("/predict", response_model=TrekPredictionResponse, tags=["Predictions"])
async def predict_trek_risk(request: TrekPredictionRequest):
    """
    Predict trek risk level for given dates and location
    
    ⭐ Now supports both historical (past) and forecast (future) data!
    Uses ensemble of working ML models with majority voting and probability averaging.
    """
    
    try:
        # Validate dates
        try:
            date_start = datetime.strptime(request.date_start, "%Y-%m-%d").date()
            
            if request.date_end:
                date_end = datetime.strptime(request.date_end, "%Y-%m-%d").date()
            else:
                date_end = date_start
            
            if date_start > date_end:
                raise ValueError("date_start must be before date_end")
                
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")
        
        # ⭐ NEW: Fetch weather data (handles both past and future)
        weather_data, data_source = WeatherFetcher.fetch_weather(
            latitude=request.latitude,
            elevation=request.elevation,
            date_start=str(date_start),
            date_end=str(date_end)
        )
        
        # Make predictions for each day
        predictions = []
        risk_codes = []
        confidence_scores = []
        
        for _, weather_row in weather_data.iterrows():
            # Prepare features for this day
            try:
                features_dict = {col: weather_row[col] for col in ensemble.feature_columns if col in weather_row.index}
                
                features_df = pd.DataFrame([features_dict])
                
                # Fill any NaN values
                features_df = features_df.fillna(features_df.mean(numeric_only=True))
                features_df = features_df.fillna(0)
                
            except Exception as e:
                print(f"❌ Error preparing features: {e}")
                raise
            
            # Get ensemble prediction
            risk_code, confidence, model_votes, prob_dict = ensemble.predict_ensemble(features_df)
            
            risk_codes.append(risk_code)
            confidence_scores.append(confidence)
            
            # Convert risk code to risk level
            risk_level = ensemble.label_encoder.inverse_transform([risk_code])[0]
            
            # Create weather data object
            weather_obj = WeatherData(
                date=str(weather_row['date']),
                min_temp=float(weather_row['min_temp']),
                max_temp=float(weather_row['max_temp']),
                avg_wind_speed=float(weather_row['avg_wind_speed']),
                total_rainfall=float(weather_row['total_rainfall']),
                snowfall_days=int(weather_row['snowfall_days']),
                visibility_index=float(weather_row['visibility_index'])
            )
            
            # Create prediction object
            prediction = RiskPrediction(
                date=str(weather_row['date']),
                risk_level=risk_level,
                confidence_score=float(confidence),
                model_votes=model_votes,
                probabilities=prob_dict,
                weather_data=weather_obj
            )
            
            predictions.append(prediction)
        
        # Calculate overall metrics
        most_common_risk_code = max(set(risk_codes), key=risk_codes.count)
        overall_risk = ensemble.label_encoder.inverse_transform([most_common_risk_code])[0]
        overall_confidence = float(np.mean(confidence_scores))
        
        # Count risk levels
        risk_counts = {
            'DANGER': sum(1 for code in risk_codes if ensemble.label_encoder.inverse_transform([code])[0] == 'DANGER'),
            'CAUTION': sum(1 for code in risk_codes if ensemble.label_encoder.inverse_transform([code])[0] == 'CAUTION'),
            'WARNING': sum(1 for code in risk_codes if ensemble.label_encoder.inverse_transform([code])[0] == 'WARNING'),
            'SAFE': sum(1 for code in risk_codes if ensemble.label_encoder.inverse_transform([code])[0] == 'SAFE'),
        }
        
        # Generate recommendation
        recommendation = _generate_recommendation(overall_risk, risk_counts, len(predictions))
        
        # Format date range
        date_range_str = (
            f"{date_start}" if date_start == date_end 
            else f"{date_start} to {date_end}"
        )
        
        return TrekPredictionResponse(
            trek_id=request.trek_id,
            date_range=date_range_str,
            overall_risk=overall_risk,
            overall_confidence=overall_confidence,
            average_confidence=float(np.mean(confidence_scores)),
            dangerous_days=risk_counts['DANGER'],
            caution_days=risk_counts['CAUTION'],
            warning_days=risk_counts['WARNING'],
            safe_days=risk_counts['SAFE'],
            predictions=predictions,
            recommendation=recommendation,
            data_source=data_source
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction error: {str(e)}"
        )


@app.post("/predict-batch", tags=["Predictions"])
async def predict_batch(requests_list: List[TrekPredictionRequest]):
    """
    Predict risk for multiple treks in one request
    
    Returns predictions for all treks (supports both historical and future dates)
    """
    results = []
    errors = []
    
    for idx, req in enumerate(requests_list):
        try:
            result = await predict_trek_risk(req)
            results.append(result)
        except Exception as e:
            errors.append({
                "index": idx,
                "trek_id": req.trek_id,
                "error": str(e)
            })
    
    return {
        "successful": len(results),
        "failed": len(errors),
        "predictions": results,
        "errors": errors if errors else None
    }


if __name__ == "__main__":
    import uvicorn
    
    print("""
    ╔════════════════════════════════════════════════════════════╗
    ║    Trek Risk Prediction API v2.0 - Historical + Forecast  ║
    ║              Starting Server on 127.0.0.1:8001             ║
    ╚════════════════════════════════════════════════════════════╝
    """)
    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8001,
        log_level="info"
    )