<<<<<<< HEAD
current code in your branch
=======
incoming changes from another branch

app = Flask(__name__)

@app.route("/")
def home():
    return "EngageSense API is running!"

@app.route("/analyze", methods=["POST"])
def analyze():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    if not file.filename:
        return jsonify({"error": "Invalid file"}), 400
    return jsonify({"message": "File processed successfully"})

if __name__ == "__main__":
<<<<<<< Updated upstream
    app.run(host="0.0.0.0", port=5001)
=======
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5001
    app.run(host="0.0.0.0", port=port)
>>>>>>> Stashed changes
