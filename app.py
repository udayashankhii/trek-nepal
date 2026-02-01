from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
from weather_analyzer import WeatherAnalyzer

load_dotenv() 

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

API_KEY = os.getenv("GEMINI_API_KEY")
STORE_ID = "fileSearchStores/nepaltrekknowledgebase-drz5vytj3m4t"
client = genai.Client(api_key=API_KEY)

# ===================================================================
# CONVERSATION HISTORY MANAGEMENT
# ===================================================================
# This dictionary stores conversation history for each user session.
# Key: session_id (e.g., "default_user" or unique user ID)
# Value: List of Content objects (user messages + bot responses)
# 
# We keep the last 5 CONVERSATIONS (10 messages total):
#   Conversation 1: User message → Bot response
#   Conversation 2: User message → Bot response
#   ...
#   Conversation 5: User message → Bot response
#
# Why limit to 5?
# - Gives Gemini enough context to remember recent questions
# - Prevents token limit issues with very long conversations
# - Keeps responses fast and relevant
# 
# Example:
#   User: "What's the price of ABC trek?"
#   Bot: "$550 for 2-4 people"
#   User: "What about for 1 person?" ← Gemini remembers "ABC trek"
#   Bot: "$650"
# ===================================================================
sessions = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/clear-history', methods=['POST'])
def clear_history():
    """
    Clear conversation history for current session.
    Useful for starting a fresh conversation.
    """
    session_id = "default_user"
    if session_id in sessions:
        sessions[session_id] = []
        return jsonify({"status": "success", "message": "Conversation history cleared"})
    return jsonify({"status": "success", "message": "No history to clear"})

@app.route('/chat', methods=['POST'])
def chat():
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
        
        # 1. Add User message to history
        sessions[session_id].append(types.Content(role="user", parts=[types.Part(text=user_msg)]))
        
        # DEBUG: Print current history length
        print(f"📊 Current history length: {len(sessions[session_id])} messages")
        
        # 2. Call Gemini with History + File Search
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=sessions[session_id],  # Send ENTIRE history
            config=types.GenerateContentConfig(
                tools=[types.Tool(file_search=types.FileSearch(file_search_store_names=[STORE_ID]))],
                system_instruction=(
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
                ),
                temperature=0.1
            )
        )
        
        bot_reply = response.text
        
        # 3. Add Bot reply to history so it remembers for the NEXT turn
        sessions[session_id].append(types.Content(role="model", parts=[types.Part(text=bot_reply)]))
        
        # 4. Trim history to last 5 conversations (10 messages) AFTER adding bot reply
        MAX_HISTORY = 10  # 5 conversations = 10 messages (user + assistant pairs)
        if len(sessions[session_id]) > MAX_HISTORY:
            sessions[session_id] = sessions[session_id][-MAX_HISTORY:]
            print(f"📝 Trimmed conversation history to last {MAX_HISTORY // 2} conversations")
        
        print(f"📊 History after response: {len(sessions[session_id])} messages")
        
        return jsonify({"reply": bot_reply})
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"reply": f"Error: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True)