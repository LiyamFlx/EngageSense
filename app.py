from flask import Flask, request, jsonify
from pydub import AudioSegment
import os

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"status": "EngageSense API is running!"})

@app.route("/analyze", methods=["POST"])
def analyze():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    if not file.filename.endswith(".mp3"):
        return jsonify({"error": "Unsupported file format. Please upload an MP3 file."}), 400

    # Save the file temporarily
    file_path = f"/tmp/{file.filename}"
    file.save(file_path)

    try:
        # Perform audio analysis using pydub
        audio = AudioSegment.from_file(file_path)
        duration = len(audio) / 1000  # Duration in seconds
        channels = audio.channels
        frame_rate = audio.frame_rate
        sample_width = audio.sample_width

        # Remove the temporary file
        os.remove(file_path)

        # Return the analysis results
        analysis = {
            "duration_seconds": duration,
            "channels": channels,
            "frame_rate": frame_rate,
            "sample_width": sample_width,
        }
        return jsonify(analysis)

    except Exception as e:
        return jsonify({"error": f"Failed to analyze file: {str(e)}"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Bind to PORT for Render
    app.run(host="0.0.0.0", port=port)
