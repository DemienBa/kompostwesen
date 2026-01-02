import os
import requests
import json
import random
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Dein Hugging Face Token muss in den Render Environment Variables gesetzt sein
HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2"

@app.route('/generate', methods=['GET'])
def generate():
    source_filter = request.args.get('source', 'all').lower()
    try:
        with open('fragments_processed.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Filtert nach dem Buchnamen (Groß-/Kleinschreibung egal)
        if source_filter != 'all':
            filtered = [d for d in data if source_filter in d.get('source', '').lower()]
            if filtered:
                return jsonify([random.choice(filtered)])
            else:
                return jsonify({"error": f"Quelle '{source_filter}' nicht gefunden."}), 404
        
        return jsonify([random.choice(data)])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/ferment', methods=['POST'])
def ferment():
    data = request.json
    text = data.get("content", "")
    mood = data.get("mood", "skeptisch")
    intensity = float(data.get("intensity", 0.7))
    creativity = float(data.get("creativity", 0.7)) # KI-Sensitivität
    length = int(data.get("length", 200))

    # Der System-Prompt nutzt nun alle deine Parameter
    prompt = (f"Handle als phytochemisches System. Stimmung: {mood}. "
              f"Intensität der Zersetzung: {intensity}. "
              f"Transformiere diesen Text in eine botanische Halluzination: {text}")

    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": length, 
            "temperature": creativity, # Hier steuert der Regler die KI-Freiheit
            "wait_for_model": True
        }
    }
    
    try:
        response = requests.post(f"https://api-inference.huggingface.co/models/{MODEL_ID}", headers=headers, json=payload, timeout=30)
        result = response.json()
        if isinstance(result, list) and len(result) > 0:
            return jsonify({"fermented": result[0].get('generated_text', '').split("halluzination:")[-1].strip()})
        return jsonify({"fermented": "Reaktor-Vakuum: Modell lädt noch."})
    except:
        return jsonify({"fermented": "Myzel-Kollaps beim Prozess."})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
