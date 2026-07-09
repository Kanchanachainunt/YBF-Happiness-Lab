import os
import json
import time
import requests

# Configuration
JSON_PATH = "assets/kids_stories.json"
OUTPUT_DIR = "assets/dynamic"
API_MODEL = "dall-e-3" # Can change to "dall-e-2" to reduce cost (DALL-E 3 is recommended for quality)

print("====================================================")
print("=== Happiness Lab: AI 200 Card Image Generator ===")
print("====================================================")
print("This script will generate a custom childlike crayon sketch for each story.")

# Request API Key
api_key = os.environ.get("OPENAI_API_KEY")
if not api_key:
    api_key = input("Please enter your OpenAI API key: ").strip()
    if not api_key:
        print("Error: OpenAI API Key is required.")
        exit(1)

# Ensure output directory exists
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Load stories
try:
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        stories = json.load(f)
except Exception as e:
    print(f"Error loading {JSON_PATH}: {e}")
    exit(1)

total = len(stories)
print(f"Loaded {total} stories from {JSON_PATH}.")

# Headers for API
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}

success_count = 0
for idx, item in enumerate(stories):
    story_id = item.get("id")
    title = item.get("title", "")
    reason = item.get("reason", "")
    
    # Target image path
    filename = f"story_{story_id}.png"
    target_path = os.path.join(OUTPUT_DIR, filename)
    relative_path = f"assets/dynamic/{filename}"
    
    # Check if already generated to allow resuming
    if os.path.exists(target_path):
        print(f"[{idx+1}/{total}] Story #{story_id} already exists. Updating JSON mapping...")
        item["image"] = relative_path
        continue

    # Construct prompt in Thai (DALL-E 3 natively parses Thai context beautifully)
    prompt = f"ภาพวาดสีเทียนสไตล์เด็กน่ารักๆ บนพื้นหลังกระดาษสีครีม ของหัวข้อ: {title} ({reason}) มีลายเส้นสีเทียนระบายสีโทนพาสเทลแบบผลงานเด็กวาดจริงๆ"
    
    print(f"[{idx+1}/{total}] Generating image for Story #{story_id}: '{title}'...")
    
    # Call OpenAI DALL-E API
    payload = {
        "model": API_MODEL,
        "prompt": prompt,
        "n": 1,
        "size": "1024x1024"
    }
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/images/generations",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            res_data = response.json()
            img_url = res_data["data"][0]["url"]
            
            # Download image
            img_data = requests.get(img_url, timeout=20).content
            with open(target_path, "wb") as img_file:
                img_file.write(img_data)
                
            print(f" -> Success! Saved to {target_path}")
            item["image"] = relative_path
            success_count += 1
            
            # Rate limit breathing room (1 second)
            time.sleep(1)
        else:
            print(f" -> Failed (HTTP {response.status_code}): {response.text}")
            
    except Exception as e:
        print(f" -> Error: {e}")

# Save updated database JSON
if success_count > 0:
    try:
        with open(JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(stories, f, ensure_ascii=False, indent=2)
        print(f"\nSuccessfully updated {JSON_PATH} database with new dynamic image paths!")
    except Exception as e:
        print(f"Error saving updated JSON: {e}")

print(f"\nAll tasks complete! Generated {success_count} new images.")
print("The website will now display your custom illustrations on next load.")
print("====================================================")
