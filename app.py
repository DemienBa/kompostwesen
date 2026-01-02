import os
import json
import random
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/ferment', methods=['POST'])
def ferment():
    data = request.json
    text = data.get("content", "")
    mood = data.get("mood", "skeptisch")
    enzyme = data.get("enzyme", "Phytochemie")
    length = int(data.get("length", 150))
    intensity = float(data.get("intensity", 0.7))

    # Dynamischer Prompt basierend auf deinen Reglern
    prompt = f"Du bist ein bio-digitales System. Fermentiere diesen Text. Stimmung: {mood}. Fokus: {enzyme}. Intensität: {intensity}. Text: {text}"

    payload = {
        "inputs": prompt,
        "parameters": {"max_new_tokens": length, "temperature": intensity, "wait_for_model": True}
    }
    # ... Rest wie gehabt (Requests an Hugging Face)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
