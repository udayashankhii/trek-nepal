from flask import Flask, render_template, request, jsonify
from google import genai
from google.genai import types

app = Flask(__name__)

API_KEY = "AIzaSyAoBOPoYQEpdm1u_zlAqsDZTILZRB7EHiE"
STORE_ID = "fileSearchStores/nepaltrekknowledgebase-k2gkrxzec5qa"
client = genai.Client(api_key=API_KEY)

# This dictionary will store history for the current session
# In a real app, you'd use a database, but this works for a project!
sessions = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_msg = data.get("message")
    session_id = "default_user" # You can make this dynamic later

    # Initialize history if new session
    if session_id not in sessions:
        sessions[session_id] = []

    try:
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
                    "You are EverTrek AI. Use ONLY the provided files. "
                    "NEVER write long paragraphs. You must format your output as follows:\n\n"
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
                    "Keep answers brief and visually clean."
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
    app.run(debug=True)