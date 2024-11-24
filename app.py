from flask import Flask, request, jsonify
from pydub import AudioSegment
import os

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message": "EngageSense API is running!"})

@app.route("/analyze", methods=["POST"])
def analyze():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    if not file.filename:
        return jsonify({"error": "Invalid file"}), 400

    # Save the uploaded file temporarily
    temp_path = "uploaded_audio.mp3"
    file.save(temp_path)

    try:
        # Process the file (convert to WAV for demonstration)
        audio = AudioSegment.from_file(temp_path)
        wav_path = "processed_audio.wav"
        audio.export(wav_path, format="wav")

        # Perform additional analysis here
        duration = len(audio) / 1000  # Duration in seconds
        size = os.path.getsize(temp_path) / (1024 * 1024)  # Size in MB

        # Clean up temporary files
        os.remove(temp_path)
        os.remove(wav_path)

        return jsonify({
            "message": "File processed successfully",
            "duration_seconds": duration,
            "size_mb": size
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))  # Default to port 5001
    app.run(host="0.0.0.0", port=port)
