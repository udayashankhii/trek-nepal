import pandas as pd
import joblib
import os

# Load the model and the data
model = joblib.load('trek_safety_model.pkl')
df = pd.read_csv('data/weatherData2.txt') 

def get_trek_safety(trek_name, month, day):
    """Get weather safety prediction for a specific trek and date"""
    # 1. Filter historical data for this specific day
    history = df[(df['trek_name'] == trek_name) & 
                 (df['month'] == month) & 
                 (df['day'] == day)]
    
    if history.empty:
        return None
    
    # 2. Get the average weather features for this day across all years
    features = [
        'month', 'min_temp', 'max_temp', 'avg_wind_speed', 
        'total_rainfall', 'snowfall_days', 'visibility_index', 
        'elevation', 'wind_chill', 'precip_3d_sum', 
        'is_extreme_wind', 'diurnal_range'
    ]
    
    # Create a single row of average data to feed the model
    input_data = history[features].mean().to_frame().T
    
    # 3. Predict!
    prediction = model.predict(input_data)[0]
    
    # Map the number back to text (updated labels)
    labels = {0: "Dangerous", 1: "Caution", 2: "Safe"}
    
    return {
        "label": labels[prediction],
        "temp": round(history['max_temp'].mean(), 1),
        "wind": round(history['avg_wind_speed'].mean(), 1),
        "rain": round(history['total_rainfall'].mean(), 1)
    }
