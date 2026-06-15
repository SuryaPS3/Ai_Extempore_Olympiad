import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load the API key from your .env file
# Search for .env starting from this file's directory and going up
base_dir = os.path.dirname(os.path.abspath(__file__)) 
dotenv_path = os.path.join(base_dir, ".env")
if not os.path.exists(dotenv_path):
    dotenv_path = os.path.join(os.path.dirname(base_dir), ".env")

load_dotenv(dotenv_path=dotenv_path)

# Initialize Gemini client
client = genai.Client()

def batch_transcribe():
    # 1. Define our directories based on your current setup
    dataset_dir = os.path.join(base_dir, "extempore-dataset")
    transcripts_dir = os.path.join(dataset_dir, "transcripts")

    # 2. Create the 'transcripts' folder if it doesn't exist
    if not os.path.exists(transcripts_dir):
        os.makedirs(transcripts_dir)
        print(f"📁 Created new directory: {transcripts_dir}\n")

    # 3. Find all MP3 files in your extempore-dataset folder
    if os.path.exists(dataset_dir):
        mp3_files = [f for f in os.listdir(dataset_dir) if f.endswith(".mp3")]
    else:
        # Fallback to current directory if extempore-dataset folder is not found
        mp3_files = [f for f in os.listdir(base_dir) if f.endswith(".mp3")]
        dataset_dir = base_dir
        transcripts_dir = os.path.join(base_dir, "transcripts")
        if not os.path.exists(transcripts_dir):
            os.makedirs(transcripts_dir)

    if not mp3_files:
        print("❌ No MP3 files found in this directory.")
        return

    print(f"🔍 Found {len(mp3_files)} MP3 files. Starting batch transcription via Gemini API...\n")
    print("-" * 50)

    # 4. Loop through each audio file
    for file_name in mp3_files:
        audio_path = os.path.join(dataset_dir, file_name)
        
        # Create a matching .txt filename (e.g., class_10_speech.mp3 -> class_10_speech.txt)
        txt_file_name = file_name.replace(".mp3", ".txt")
        txt_file_path = os.path.join(transcripts_dir, txt_file_name)

        # Skip if we already transcribed this file (saves API calls!)
        if os.path.exists(txt_file_path):
            print(f"⏭️ Skipping '{file_name}' (Transcript already exists).")
            continue

        print(f"🎙️ Transcribing '{file_name}'...")
        
        try:
            # Upload file using Files API (best for audio)
            uploaded_file = client.files.upload(file=audio_path)
            
            # Send to Gemini
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=[
                    uploaded_file,
                    "Provide a highly accurate transcription of this audio. Output only the transcribed text, without any headers, comments, or quotes."
                ]
            )
            
            # Save the raw text to our new .txt file
            transcript_text = response.text.strip() if response.text else ""
            with open(txt_file_path, "w", encoding="utf-8") as text_file:
                text_file.write(transcript_text)

            print(f"✅ Success! Saved to 'transcripts/{txt_file_name}'")
            
            # Clean up the file from Gemini Cloud to keep it clean (Files API storage limit)
            try:
                client.files.delete(name=uploaded_file.name)
            except Exception as delete_err:
                print(f"⚠️ Warning: could not delete uploaded file {uploaded_file.name}: {delete_err}")
                
            print("-" * 50)

        except Exception as e:
            print(f"❌ Error transcribing '{file_name}': {e}")
            print("-" * 50)

    print("\n🎉 Batch transcription complete!")

if __name__ == "__main__":
    batch_transcribe()
