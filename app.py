from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "EngageSense API is running!"

@app.route("/analyze", methods=["POST"])
def analyze():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    if
