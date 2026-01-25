import json
import random
import nltk
from nltk.stem import WordNetLemmatizer

# 1. Load the data
with open('trekking_data.json', 'r') as f:
    data = json.load(f)

lemmatizer = WordNetLemmatizer()
nltk.download('punkt')
nltk.download('wordnet')

def clean_up_sentence(sentence):
    # Breaks the sentence into words
    sentence_words = nltk.word_tokenize(sentence.lower())
    # Simplifies words (e.g., "trekking" becomes "trek")
    return [lemmatizer.lemmatize(word) for word in sentence_words]

def get_response(user_input):
    user_words = clean_up_sentence(user_input)
    best_match = None
    max_overlap = 0

    # Look through every intent in your JSON
    for intent in data['intents']:
        for pattern in intent['patterns']:
            pattern_words = clean_up_sentence(pattern)
            # Count how many words match between user input and our patterns
            overlap = len(set(user_words) & set(pattern_words))
            
            if overlap > max_overlap:
                max_overlap = overlap
                best_match = random.choice(intent['responses'])

    return best_match if max_overlap > 0 else "I'm sorry, I don't know about that trek. Try asking about Everest or Annapurna!"

# 3. The Chat Loop
print("Namaste! Trek Bot is running. (Type 'quit' to exit)")
while True:
    message = input("You: ")
    if message.lower() == "quit":
        break
    
    reply = get_response(message)
    print(f"Bot: {reply}")