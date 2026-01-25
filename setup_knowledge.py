import os
import time
from google import genai

# CONFIG
API_KEY = "YOUR_ACTUAL_API_KEY"
client = genai.Client(api_key="AIzaSyAoBOPoYQEpdm1u_zlAqsDZTILZRB7EHiE")

def setup():
    try:
        # 1. Create the Store
        print("Connecting to Google Cloud...")
        store = client.file_search_stores.create(
            config={'display_name': 'NepalTrekKnowledgeBase'}
        )
        print(f"✅ Created Store: {store.name}")
        
        # 2. Upload all 21 JSON files
        data_path = './data'
        for filename in os.listdir(data_path):
            if filename.endswith('.json'):
                file_path = os.path.join(data_path, filename)
                print(f"📤 Uploading {filename}...")
                
                # We catch the initial operation object
                op = client.file_search_stores.upload_to_file_search_store(
                    file_search_store_name=store.name,
                    file=file_path, 
                    config={'display_name': filename}
                )
                
                # POLL: Wait for Google to finish indexing
                # We pass the object directly into the get() method
                while not op.done:
                    print(f"   ...indexing {filename}")
                    time.sleep(3)
                    op = client.operations.get(op) 
                
                print(f"   ✅ {filename} is ready!")
                
        print("\n DATABASE FULLY SYNCED!")
        print(f"USE THIS STORE_ID IN app.py: {store.name}")

    except Exception as e:
        print(f"\n Error during setup: {e}")

if __name__ == "__main__":
    setup()