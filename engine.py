from google import genai
from google.genai import types

class TrekEngine:
    def __init__(self):
        self.client = genai.Client(api_key="AIzaSyAoBOPoYQEpdm1u_zlAqsDZTILZRB7EHiE")
        # Use the STORE_ID printed from the setup script
        self.store_id = "fileSearchStores/your-unique-id-here"

    def get_ai_reply(self, user_input):
        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=user_input,
                config=types.GenerateContentConfig(
                    tools=[
                        types.Tool(
                            file_search=types.FileSearch(
                                # This tells Gemini to look in your 21 files first
                                file_search_stores=[self.store_id]
                            )
                        )
                    ],
                    system_instruction="You are a Nepal Trekking Expert. Answer only using the provided files."
                )
            )
            return response.text
        except Exception as e:
            return f"Namaste! I'm having trouble searching my records. ({e})"