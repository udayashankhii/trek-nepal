"""
EverTrek AI - Integrated Flask Application
Combines AI Chatbot with Trek Risk Prediction API
Both services run on the same port (5000)
"""

# ⭐ SUPPRESS WARNINGS BEFORE ANY IMPORTS
import os
import sys
import warnings
warnings.filterwarnings('ignore', category=UserWarning)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TensorFlow warnings

import traceback
from datetime import datetime
import numpy as np
from dotenv import load_dotenv
import pandas as pd

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types

# Local modules
from weather_analyzer import WeatherAnalyzer


# Import safe_dates module components for trek risk prediction
from safe_dates import (
    ModelEnsemble,
    WeatherFetcher,
    RiskLevel,
    _generate_recommendation
)

load_dotenv() 

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

API_KEY = os.getenv("GEMINI_API_KEY")
STORE_ID = "fileSearchStores/nepaltrekknowledgebase-drz5vytj3m4t"

# ===================================================================
# CREATE CLIENT (NEW SDK)
# ===================================================================
try:
    client = genai.Client(api_key=API_KEY)
except Exception as e:
    print(f"⚠️ Failed to create Gemini client: {e}", file=sys.stderr)
    client = None

# ===================================================================
# TREK RISK PREDICTION - ML ENSEMBLE MODEL
# ===================================================================
ensemble = None

def init_ml_models():
    """Initialize ML models for risk prediction"""
    global ensemble
    try:
        # ⭐ FIXED: Use dynamic path based on current working directory
        base_dir = os.getcwd()
        
        # Add trailing separator as required by safe_dates.py logic
        model_dir = os.path.join(base_dir, "models_optimized") + os.sep
        
        ensemble = ModelEnsemble(model_path=model_dir)
        
        return True
    except Exception as e:
        error_msg = f"⚠️ Failed to load ML models: {e}"
        print(error_msg, file=sys.stderr)
        traceback.print_exc()
        
        # Log to file for debugging
        with open("app_error.log", "a", encoding="utf-8") as f:
            f.write(f"[{datetime.now()}] {error_msg}\n")
            traceback.print_exc(file=f)
            
        return False

def ensure_models_loaded():
    """Ensure models are loaded, attempting to load if missing"""
    global ensemble
    if ensemble is not None:
        return True
    return init_ml_models()

# Load models on startup
init_ml_models()

# ===================================================================
# CONVERSATION HISTORY MANAGEMENT
# ===================================================================
sessions = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/health', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint - supports both /health and /api/health"""
    # Attempt lazy load to report true status if possible
    if not ensemble:
        ensure_models_loaded()
        
    return jsonify({
        "status": "healthy",
        "models_loaded": len(ensemble.models) if ensemble else 0,
        "ml_ready": ensemble is not None,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/clear-history', methods=['POST'])
def clear_history():
    """Clear conversation history for current session"""
    session_id = "default_user"
    if session_id in sessions:
        sessions[session_id] = []
        return jsonify({"status": "success", "message": "Conversation history cleared"})
    return jsonify({"status": "success", "message": "No history to clear"})

@app.route('/chat', methods=['POST'])
def chat():
    if not client:
        return jsonify({"reply": "Error: Gemini client not initialized (missing API key?)"}), 500

    data = request.json
    user_msg = data.get("message")
    session_id = "default_user"
    
    # Initialize session if it doesn't exist
    if session_id not in sessions:
        sessions[session_id] = []
    
    try:
        # === LOGIC X: WEATHER PREDICTION ===
        analyzer = WeatherAnalyzer(user_msg)
        
        system_context = ""
        if analyzer.extract_date():
            system_context = analyzer.get_context_for_gemini()
        # === END OF LOGIC X ===
        
        # Build system instruction
        system_instruction = (
            "You are EverTrek AI. Use ONLY the provided files.\n\n"
            "PRIORITY: If [CRITICAL SAFETY DATA] is provided, you MUST use that specific "
            "data as your primary safety advice for that date.\n\n"
            + system_context +  # Inject weather data here
            "RESPONSE RULES:\n"
            "1. If asked about SAFETY/WEATHER for a specific date:\n"
            "   - ALWAYS mention the data source: 'Based on [real-time OpenMeteo forecast/historical ML predictions]'\n"
            "   - Give the status, temperature, and wind speed\n"
            "   - Add 1-2 sentences of specific advice for that date\n"
            "   - DO NOT include full trek details, pricing, or itinerary\n\n"
            "2. If asked about PRICE/COST:\n"
            "   - Give ONLY the pricing table\n"
            "   - DO NOT include full trek details\n\n"
            "3. If asked about DURATION/ITINERARY:\n"
            "   - Give ONLY duration and brief day-by-day overview\n"
            "   - DO NOT include pricing or full details\n\n"
            "4. If asked for GENERAL INFO or 'tell me about [trek]':\n"
            "   - Use the full format below:\n\n"
            "## [Trek Name]\n"
            "**Quick Overview:** (1 sentence summary)\n\n"
            "### 📋 Key Details\n"
            "* **Duration:** \n"
            "* **Max Altitude:** \n"
            "* **Difficulty:** \n"
            "* **Best Season:** \n\n"
            "### 💰 Pricing (Per Person)\n"
            "| Group Size | Cost |\n"
            "| :--- | :--- |\n"
            "| 1 Person | ... |\n"
            "| 2-4 People | ... |\n\n"
            "### 🗓️ Upcoming Departures (2026)\n"
            "(List dates as bullet points with availability)\n\n"
            "IMPORTANT: When a user asks a follow-up question like 'how long' or 'what about',\n"
            "use the conversation history to understand what trek they're referring to.\n"
            "DO NOT list multiple treks unless they specifically ask for comparison.\n\n"
            "NEVER write long paragraphs. Keep all answers brief and to the point."
        )
        
        # 1. Add user message to history (NEW SDK FORMAT)
        user_content = types.Content(
            role='user',
            parts=[types.Part.from_text(text=user_msg)]
        )
        sessions[session_id].append(user_content)
        
        # 2. Call Gemini with History + File Search (NEW SDK - CORRECTED TOOL FORMAT)
        response = client.models.generate_content(
            model="gemini-2.0-flash-001",
            contents=sessions[session_id],  # Send ENTIRE history
            config=types.GenerateContentConfig(
                tools=[
                    types.Tool(
                        google_search=types.GoogleSearch()
                    )
                ],
                system_instruction=system_instruction,
                temperature=0.1
            )
        )
        
        bot_reply = response.text
        
        # 3. Add Bot reply to history (NEW SDK FORMAT)
        model_content = types.Content(
            role='model',
            parts=[types.Part.from_text(text=bot_reply)]
        )
        sessions[session_id].append(model_content)
        
        # 4. Trim history to last 5 conversations (10 messages) AFTER adding bot reply
        MAX_HISTORY = 10  # 5 conversations = 10 messages (user + assistant pairs)
        if len(sessions[session_id]) > MAX_HISTORY:
            sessions[session_id] = sessions[session_id][-MAX_HISTORY:]
        
        return jsonify({"reply": bot_reply})
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"reply": f"Error: {str(e)}"})

@app.route('/api/info', methods=['GET'])
def api_info():
    """API information endpoint"""
    return jsonify({
        "name": "Trek Risk Prediction API (Flask)",
        "version": "2.0.0",
        "endpoints": {
            "predict": "/predict (single trek)",
            "predict_batch": "/predict-batch (multiple treks)",
            "health": "/health",
            "chat": "/chat (AI chatbot)"
        }
    })

@app.route('/predict', methods=['POST'])
def predict_trek_risk():
    """Predict trek risk level for given dates and location"""
    import pandas as pd
    
    if not ensure_models_loaded():
        msg = "ML models not loaded. Check server logs (app_error.log)."
        return jsonify({"error": msg}), 503
    
    try:
        data = request.json
        required = ['trek_id', 'latitude', 'elevation', 'date_start']
        for field in required:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        trek_id = data['trek_id']
        latitude = float(data['latitude'])
        elevation = float(data['elevation'])
        date_start_str = data['date_start']
        date_end_str = data.get('date_end', date_start_str)
        
        try:
            date_start = datetime.strptime(date_start_str, "%Y-%m-%d").date()
            date_end = datetime.strptime(date_end_str, "%Y-%m-%d").date()
            if date_start > date_end:
                return jsonify({"error": "date_start must be before date_end"}), 400
        except ValueError as e:
            return jsonify({"error": f"Invalid date format: {str(e)}"}), 400
        
        weather_data, data_source = WeatherFetcher.fetch_weather(
            latitude=latitude,
            elevation=elevation,
            date_start=str(date_start),
            date_end=str(date_end)
        )
        
        predictions = []
        risk_codes = []
        confidence_scores = []
        
        for _, weather_row in weather_data.iterrows():
            features_dict = {
                col: weather_row[col] 
                for col in ensemble.feature_columns 
                if col in weather_row.index
            }
            features_df = pd.DataFrame([features_dict])
            features_df = features_df.fillna(features_df.mean(numeric_only=True)).fillna(0)
            
            risk_code, confidence, model_votes, prob_dict = ensemble.predict_ensemble(features_df)
            risk_codes.append(risk_code)
            confidence_scores.append(confidence)
            
            risk_level = ensemble.label_encoder.inverse_transform([risk_code])[0]
            
            prediction = {
                "date": str(weather_row['date']),
                "risk_level": risk_level,
                "confidence_score": float(confidence),
                "model_votes": model_votes,
                "probabilities": prob_dict,
                "weather_data": {
                    "date": str(weather_row['date']),
                    "min_temp": float(weather_row['min_temp']),
                    "max_temp": float(weather_row['max_temp']),
                    "avg_wind_speed": float(weather_row['avg_wind_speed']),
                    "total_rainfall": float(weather_row['total_rainfall']),
                    "snowfall_days": int(weather_row['snowfall_days']),
                    "visibility_index": float(weather_row['visibility_index'])
                }
            }
            predictions.append(prediction)
        
        most_common_risk_code = max(set(risk_codes), key=risk_codes.count)
        overall_risk = ensemble.label_encoder.inverse_transform([most_common_risk_code])[0]
        overall_confidence = float(np.mean(confidence_scores))
        
        risk_counts = {
            'DANGER': sum(1 for code in risk_codes if ensemble.label_encoder.inverse_transform([code])[0] == 'DANGER'),
            'CAUTION': sum(1 for code in risk_codes if ensemble.label_encoder.inverse_transform([code])[0] == 'CAUTION'),
            'WARNING': sum(1 for code in risk_codes if ensemble.label_encoder.inverse_transform([code])[0] == 'WARNING'),
            'SAFE': sum(1 for code in risk_codes if ensemble.label_encoder.inverse_transform([code])[0] == 'SAFE'),
        }
        
        recommendation = _generate_recommendation(overall_risk, risk_counts, len(predictions))
        date_range_str = f"{date_start}" if date_start == date_end else f"{date_start} to {date_end}"
        
        return jsonify({
            "trek_id": trek_id,
            "date_range": date_range_str,
            "overall_risk": overall_risk,
            "overall_confidence": overall_confidence,
            "average_confidence": float(np.mean(confidence_scores)),
            "dangerous_days": risk_counts['DANGER'],
            "caution_days": risk_counts['CAUTION'],
            "warning_days": risk_counts['WARNING'],
            "safe_days": risk_counts['SAFE'],
            "predictions": predictions,
            "recommendation": recommendation,
            "data_source": data_source
        })
        
    except ValueError as e:
        print(f"❌ Validation error: {str(e)}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(f"❌ Prediction error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500

@app.route('/predict-itinerary', methods=['POST'])
def predict_trek_itinerary_risk():
    """
    Predict trek risk using day-by-day itinerary coordinates
    Each day uses its actual destination's lat/lon/elevation
    """
    import pandas as pd
    
    if not ensure_models_loaded():
        return jsonify({"error": "ML models not loaded"}), 503
    
    try:
        data = request.json
        
        # Validate required fields
        if 'trek_id' not in data or 'days' not in data:
            return jsonify({"error": "Missing required fields: trek_id and days"}), 400
        
        trek_id = data['trek_id']
        days_data = data['days']
        
        if not isinstance(days_data, list) or len(days_data) == 0:
            return jsonify({"error": "days must be a non-empty array"}), 400
        
        # Sort days by day number
        sorted_days = sorted(days_data, key=lambda d: d.get('day', 0))
        
        predictions = []
        risk_codes = []
        confidence_scores = []
        data_sources = set()
        
        # Process each day with ITS OWN coordinates
        for day_info in sorted_days:
            try:
                # Validate day structure
                required_fields = ['day', 'date', 'latitude', 'longitude', 'elevation']
                for field in required_fields:
                    if field not in day_info:
                        return jsonify({
                            "error": f"Day {day_info.get('day', '?')} missing field: {field}"
                        }), 400
                
                # Validate date range (max 16 days ahead)
                date_obj = datetime.strptime(day_info['date'], "%Y-%m-%d").date()
                max_date = datetime.now().date() + pd.Timedelta(days=16)
                
                if date_obj > max_date:
                    return jsonify({
                        "error": f"Day {day_info['day']} ({day_info['date']}) is too far in future (max 16 days)"
                    }), 400
                
                # Fetch weather for THIS day's specific coordinates
                weather_data, data_source = WeatherFetcher.fetch_weather(
                    latitude=float(day_info['latitude']),
                    elevation=float(day_info['elevation']),
                    date_start=day_info['date'],
                    date_end=day_info['date']  # Single day only
                )
                
                data_sources.add(data_source)
                
                if len(weather_data) == 0:
                    print(f"⚠️ No weather data for day {day_info['day']}")
                    continue
                
                # Get weather row for this day
                weather_row = weather_data.iloc[0]
                
                # Prepare features
                features_dict = {
                    col: weather_row[col]
                    for col in ensemble.feature_columns
                    if col in weather_row.index
                }
                features_df = pd.DataFrame([features_dict])
                features_df = features_df.fillna(features_df.mean(numeric_only=True)).fillna(0)
                
                # Get ensemble prediction
                risk_code, confidence, model_votes, prob_dict = ensemble.predict_ensemble(features_df)
                
                risk_codes.append(risk_code)
                confidence_scores.append(confidence)
                
                # Convert risk code to risk level
                risk_level = ensemble.label_encoder.inverse_transform([risk_code])[0]
                
                # Create prediction object
                prediction = {
                    "date": day_info['date'],
                    "day": day_info['day'],
                    "place_name": day_info.get('place_name', ''),
                    "elevation": day_info['elevation'],
                    "risk_level": risk_level,
                    "confidence_score": float(confidence),
                    "model_votes": model_votes,
                    "probabilities": prob_dict,
                    "weather_data": {
                        "date": str(weather_row['date']),
                        "min_temp": float(weather_row['min_temp']),
                        "max_temp": float(weather_row['max_temp']),
                        "avg_wind_speed": float(weather_row['avg_wind_speed']),
                        "total_rainfall": float(weather_row['total_rainfall']),
                        "snowfall_days": int(weather_row['snowfall_days']),
                        "visibility_index": float(weather_row['visibility_index'])
                    }
                }
                
                predictions.append(prediction)
                print(f"✅ Day {day_info['day']} ({day_info.get('place_name', 'Unknown')}): {risk_level}")
                
            except Exception as day_error:
                print(f"❌ Error processing day {day_info.get('day', '?')}: {day_error}")
                return jsonify({
                    "error": f"Failed to process day {day_info.get('day', '?')}: {str(day_error)}"
                }), 500
        
        if len(predictions) == 0:
            return jsonify({"error": "No predictions generated"}), 500
        
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
        start_date = sorted_days[0]['date']
        end_date = sorted_days[-1]['date']
        date_range_str = start_date if start_date == end_date else f"{start_date} to {end_date}"
        
        # Determine data source
        final_data_source = "mixed" if len(data_sources) > 1 else list(data_sources)[0]
        
        return jsonify({
            "trek_id": trek_id,
            "date_range": date_range_str,
            "overall_risk": overall_risk,
            "overall_confidence": overall_confidence,
            "average_confidence": float(np.mean(confidence_scores)),
            "dangerous_days": risk_counts['DANGER'],
            "caution_days": risk_counts['CAUTION'],
            "warning_days": risk_counts['WARNING'],
            "safe_days": risk_counts['SAFE'],
            "predictions": predictions,
            "recommendation": recommendation,
            "data_source": final_data_source
        })
        
    except Exception as e:
        print(f"❌ Itinerary prediction error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500

    # Processes each day's coordinates separately
    # Returns predictions for actual trek route

@app.route('/predict-batch', methods=['POST'])
def predict_batch():
    """Predict risk for multiple treks in one request"""
    if not ensure_models_loaded():
        return jsonify({"error": "ML models not loaded"}), 503
    
    try:
        requests_list = request.json
        if not isinstance(requests_list, list):
            return jsonify({"error": "Expected a list of trek requests"}), 400
        
        results = []
        errors = []
        
        for idx, req_data in enumerate(requests_list):
            try:
                import pandas as pd
                trek_id = req_data['trek_id']
                latitude = float(req_data['latitude'])
                elevation = float(req_data['elevation'])
                date_start_str = req_data['date_start']
                date_end_str = req_data.get('date_end', date_start_str)
                
                date_start = datetime.strptime(date_start_str, "%Y-%m-%d").date()
                date_end = datetime.strptime(date_end_str, "%Y-%m-%d").date()
                
                weather_data, data_source = WeatherFetcher.fetch_weather(
                    latitude=latitude,
                    elevation=elevation,
                    date_start=str(date_start),
                    date_end=str(date_end)
                )
                
                predictions = []
                risk_codes = []
                confidence_scores = []
                
                for _, weather_row in weather_data.iterrows():
                    features_dict = {
                        col: weather_row[col] 
                        for col in ensemble.feature_columns 
                        if col in weather_row.index
                    }
                    features_df = pd.DataFrame([features_dict]).fillna(0)
                    risk_code, confidence, model_votes, prob_dict = ensemble.predict_ensemble(features_df)
                    risk_codes.append(risk_code)
                    confidence_scores.append(confidence)
                    predictions.append({
                        "date": str(weather_row['date']),
                        "risk_level": ensemble.label_encoder.inverse_transform([risk_code])[0],
                        "confidence_score": float(confidence)
                    })
                
                most_common_risk_code = max(set(risk_codes), key=risk_codes.count)
                overall_risk = ensemble.label_encoder.inverse_transform([most_common_risk_code])[0]
                
                results.append({
                    "trek_id": trek_id,
                    "overall_risk": overall_risk,
                    "overall_confidence": float(np.mean(confidence_scores)),
                    "data_source": data_source,
                    "predictions": predictions
                })
                    
            except Exception as e:
                errors.append({
                    "index": idx,
                    "trek_id": req_data.get('trek_id', 'unknown'),
                    "error": str(e)
                })
        
        return jsonify({
            "successful": len(results),
            "failed": len(errors),
            "predictions": results,
            "errors": errors if errors else None
        })
        
    except Exception as e:
        print(f"❌ Batch prediction error: {str(e)}")
        return jsonify({"error": f"Batch prediction error: {str(e)}"}), 500

if __name__ == '__main__':
    print("✅ EverTrek AI - Chatbot + Trek Risk Prediction (Port 5000)")
    app.run(debug=True, port=5000)