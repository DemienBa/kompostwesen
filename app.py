import os
import requests
import json
import random
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Erlaubt den Zugriff von deiner Netlify-Webseite

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.3"

@app.route('/generate', methods=['GET'])
def generate():
    try:
        # Lädt ein zufälliges Fragment aus deiner JSON-Sammlung
        with open('fragments_processed.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify([random.choice(data)])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/ferment', methods=['POST'])
def ferment():
    input_data = request.json
    text_to_transform = input_data.get("content", "")
    
    if not text_to_transform:
        return jsonify({"error": "Kein Text zum Fermentieren gefunden"}), 400

    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    # Der Prompt ist auf phytochemische Halluzination getrimmt
    payload = {
        "inputs": f"Handle als biotischer Reaktor. Zersetze und verwandle diesen Text in eine skurrile, phytochemische Halluzination: {text_to_transform}",
        "parameters": {
            "max_new_tokens": 200, 
            "temperature": 0.8,
            "return_full_text": False
        }
    }
    
    try:
        response = requests.post(
            f"https://api-inference.huggingface.co/models/{MODEL_ID}", 
            headers=headers, 
            json=payload
        )
        result = response.json()
        
        # Extraktion der reinen KI-Antwort
        if isinstance(result, list) and len(result) > 0:
            fermented_text = result[0].get('generated_text', 'Die Fermentierung stockt...')
        else:
            fermented_text = "Der Reaktor liefert gerade keine Gase."
            
        return jsonify({"fermented": fermented_text})
    except Exception as e:
        return jsonify({"error": "KI-Reaktor-Fehler"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
