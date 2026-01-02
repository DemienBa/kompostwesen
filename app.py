import os
import json
import random
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['GET'])
def generate():
    try:
        # Lädt die komplette Liste deiner Fragmente
        with open('fragments_processed.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        # Wählt ein zufälliges Objekt aus und gibt ALLES zurück (ID, Enzyme, etc.)
        return jsonify([random.choice(data)])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
