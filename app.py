import streamlit as st
import json
import random
import nltk
import time
import os
from nltk.stem import WordNetLemmatizer
# Import the fuzzy matching tool
from rapidfuzz import process, fuzz

# --- INITIAL SETUP ---
lemmatizer = WordNetLemmatizer()
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('wordnet')

# --- SMART LOADER ---
all_treks = []
found_files = []
base_path = os.path.dirname(os.path.abspath(__file__))

for filename in os.listdir(base_path):
    if filename.endswith('.json'):
        try:
            with open(os.path.join(base_path, filename), 'r', encoding='utf-8') as f:
                file_data = json.load(f)
                if 'treks' in file_data:
                    all_treks.extend(file_data['treks'])
                    found_files.append(filename)
        except Exception as e:
            st.error(f"Error loading {filename}: {e}")

def get_response(user_input):
    if not all_treks:
        return "Namaste! I don't see any trek data. Please check your JSON files."

    user_input = user_input.lower()
    
    # 1. SMART SEARCH FOR TREK TITLES
    trek_options = {}
    for trek in all_treks:
        trek_options[trek['title'].lower()] = trek
        trek_options[trek['slug'].replace("-", " ")] = trek

    # FIX: Using partial_ratio (lowercase) for newer rapidfuzz versions
    title_match = process.extractOne(user_input, trek_options.keys(), scorer=fuzz.partial_ratio)
    
    if title_match and title_match[1] > 80:
        trek = trek_options[title_match[0]]
        return f"**{trek['title']}**\n\n{trek['short_description']}\n\n" \
               f"* **Duration:** {trek['duration']}\n" \
               f"* **Max Altitude:** {trek['max_altitude']}\n" \
               f"* **Difficulty:** {trek['trip_grade']}"

    # 2. SEARCH INSIDE FAQS
    all_questions = []
    question_map = {}
    for trek in all_treks:
        for category in trek.get('faq_categories', []):
            for qna in category.get('questions', []):
                all_questions.append(qna['question'])
                question_map[qna['question']] = qna['answer']

    if all_questions:
        # FIX: Using WRatio
        faq_match = process.extractOne(user_input, all_questions, scorer=fuzz.WRatio)
        if faq_match and faq_match[1] > 70:
            return question_map[faq_match[0]]

    # 3. FALLBACKS
    if any(word in user_input for word in ["cost", "price", "include", "exclusion"]):
        trek = all_treks[0]
        inc = "\n- ".join(trek['cost']['cost_inclusions'][:5])
        return f"Our treks generally include:\n- {inc}\n\nWould you like the specific price for a certain date?"

    return "Namaste! I'm not quite sure. Try asking about 'Everest Panorama', 'difficulty', or 'what is included'."

# --- THE WEB INTERFACE ---
st.set_page_config(page_title="Nepal Trekking Expert", page_icon="🏔️")
st.title("🏔️ Nepal Trekking Expert")

# Sidebar
st.sidebar.title("Bot Status")
if found_files:
    st.sidebar.success(f"✅ Loaded {len(all_treks)} Treks")
    with st.sidebar.expander("See Data Files"):
        for f in found_files:
            st.sidebar.write(f"📄 {f}")
else:
    st.sidebar.error("❌ No Trek Data Found")

# Chat History
if "messages" not in st.session_state:
    st.session_state.messages = [{"role": "assistant", "content": "Namaste! 🙏 I am your Nepal Trekking expert. How can I help you plan your adventure today?"}]

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if prompt := st.chat_input("Ask me about a trek..."):
    with st.chat_message("user"):
        st.markdown(prompt)
    st.session_state.messages.append({"role": "user", "content": prompt})

    response = get_response(prompt)

    with st.chat_message("assistant"):
        st.markdown(response)
    st.session_state.messages.append({"role": "assistant", "content": response})