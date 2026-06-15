import os
from faster_whisper import WhisperModel

def batch_transcribe():
    # 1. Get the current directory
    current_dir = os.getcwd()
    transcripts_dir = os.path.join(current_dir, "transcripts")

    # 2. Scan the current directory for .mp3 files
    mp3_files = sorted([f for f in os.listdir(current_dir) if f.endswith(".mp3")])

    if not mp3_files:
        print(f"❌ No MP3 files found in the current directory: {current_dir}")
        print("💡 Tip: Please run this script from the folder containing your MP3 files.")
        return

    # 3. Create the 'transcripts/' folder if it doesn't exist
    if not os.path.exists(transcripts_dir):
        os.makedirs(transcripts_dir)
        print(f"📁 Created output directory: {transcripts_dir}\n")

    # 4. Initialize faster-whisper model on CPU using int8 quantization
    print("🤖 Loading WhisperModel ('base.en' on CPU with int8)...")
    try:
        model = WhisperModel("base.en", device="cpu", compute_type="int8")
        print("✅ Model loaded successfully!\n")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return

    print(f"🔍 Found {len(mp3_files)} MP3 files. Starting batch transcription...\n")
    print("-" * 60)

    # 5. Loop through each audio file
    for file_name in mp3_files:
        audio_path = os.path.join(current_dir, file_name)
        
        # Create matching .txt filename
        txt_file_name = file_name.replace(".mp3", ".txt")
        txt_file_path = os.path.join(transcripts_dir, txt_file_name)

        # Skip if transcript already exists
        if os.path.exists(txt_file_path):
            print(f"⏭️ Skipping '{file_name}' (Transcript already exists).")
            continue

        print(f"🎙️ Transcribing '{file_name}'...")
        
        try:
            # Transcribe audio file using faster-whisper
            segments, info = model.transcribe(audio_path, beam_size=5)
            
            # Extract and combine the text from returned segments
            transcript_text = " ".join([segment.text for segment in segments]).strip()

            # Write the full combined string to the output .txt file
            with open(txt_file_path, "w", encoding="utf-8") as text_file:
                text_file.write(transcript_text)

            print(f"✅ Success! Saved to 'transcripts/{txt_file_name}'")
            print("-" * 60)

        except Exception as e:
            print(f"❌ Error transcribing '{file_name}': {e}")
            print("-" * 60)

    print("\n🎉 Batch transcription complete!")

if __name__ == "__main__":
    batch_transcribe()
