from flask import Flask, request, jsonify
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

@app.route("/")
def home():
    """Home route to confirm the API is running."""
    app.logger.info("Home route accessed")
    return "EngageSense API is running!"

@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Endpoint to analyze uploaded files.
    Accepts a file and returns simulated analysis results.
    """
    if 'file' not in request.files:
        app.logger.warning("No file uploaded")
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if not file.filename:
        app.logger.warning("Empty filename detected")
        return jsonify({"error": "Invalid file"}), 400

    # Placeholder: Validate file type if necessary (e.g., CSV, JSON, etc.)
    # if not file.filename.endswith(".csv"):
    #     return jsonify({"error": "Unsupported file type"}), 400

    app.logger.info(f"File {file.filename} received for analysis")

    # Simulated analysis logic
    response = perform_analysis(file)

    return jsonify(response)

def perform_analysis(file):
    """
    Perform the analysis on the uploaded file.
    Currently returns simulated values.
    """
    app.logger.info("Simulating analysis")
    return {
        "physical": 85,
        "emotional": 75,
        "mental": 65,
        "spiritual": 55,
    }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
