from flask import Flask, render_template, request, jsonify
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
from weather_analyzer import WeatherAnalyzer  # Import our new analyzer

load_dotenv() 
app = Flask(__name__)

API_KEY = os.getenv("GEMINI_API_KEY")
STORE_ID = "fileSearchStores/nepaltrekknowledgebase-6ebw7jg7x1oq"
client = genai.Client(api_key=API_KEY)

sessions = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_msg = data.get("message")
    session_id = "default_user"
    
    if session_id not in sessions:
        sessions[session_id] = []
    
    try:
        # === LOGIC X: WEATHER PREDICTION (NOW CLEAN!) ===
        analyzer = WeatherAnalyzer(user_msg)
        
        system_context = ""
        if analyzer.extract_date():
            system_context = analyzer.get_context_for_gemini()
        # === END OF LOGIC X ===
        
        # 1. Add User message to history
        sessions[session_id].append(types.Content(role="user", parts=[types.Part(text=user_msg)]))
        # 2. Call Gemini with History + File Search
    # --- CALL GEMINI WITH ENFORCED STRUCTURE ---
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=sessions[session_id],
            config=types.GenerateContentConfig(
                tools=[types.Tool(file_search=types.FileSearch(file_search_store_names=[STORE_ID]))],
                system_instruction=(
                    "You are EverTrek AI. Use ONLY the provided files.\n\n"
                    "PRIORITY: If [CRITICAL SAFETY DATA] is provided, you MUST use that specific "
                    "Machine Learning prediction as your primary safety advice for that date.\n\n"
                    + system_context +  # Inject weather data here
                    "RESPONSE RULES:\n"
                    "1. If asked about SAFETY/WEATHER for a specific date:\n"
                    "   - Give ONLY the ML prediction: 'Status: [Safe/Moderate/Risky], Temp: X°C, Wind: Y km/h'\n"
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
                    "NEVER write long paragraphs. Keep all answers brief and to the point."
                ),
                temperature=0.1
            )
        )
        
        bot_reply = response.text
        
        # 3. Add Bot reply to history so it remembers for the NEXT turn
        sessions[session_id].append(types.Content(role="model", parts=[types.Part(text=bot_reply)]))
        return jsonify({"reply": bot_reply})
    except Exception as e:
        return jsonify({"reply": f"Error: {str(e)}"})
if __name__ == '__main__':
    app.run(debug=True) #force refresh lai rakhya vayena