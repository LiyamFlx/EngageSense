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
    # Simulated analysis logic
    response = {
        "physical": 85,
        "emotional": 75,
        "mental": 65,
        "spiritual": 55,
    }
    return jsonify(response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
