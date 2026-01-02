import os
import requests
import json
import random
# WICHTIG: Hier muss 'request' stehen!
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2"

@app.route('/generate', methods=['GET'])
def generate():
    source_filter = request.args.get('source', 'all').lower()
    try:
        # Sicherer Pfad zur JSON-Datei
        base_path = os.path.dirname(os.path.abspath(__file__))
        json_path = os.path.join(base_path, 'fragments_processed.json')
        
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if source_filter != 'all':
            # Wir suchen großzügig im Feld 'source'
            filtered = [d for d in data if d.get('source') and source_filter in str(d.get('source')).lower()]
            if filtered:
                return jsonify([random.choice(filtered)])
        
        return jsonify([random.choice(data)])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/ferment', methods=['POST'])
def ferment():
    try:
        data = request.json
        text = data.get("content", "")
        mood = data.get("mood", "skeptisch")
        intensity = float(data.get("intensity", 0.7))
        creativity = float(data.get("creativity", 0.7))
        length = int(data.get("length", 200))

        prompt = f"Handle als phytochemisches System. Stimmung: {mood}. Intensität: {intensity}. Transformiere diesen Text: {text}"

        headers = {"Authorization": f"Bearer {HF_TOKEN}"}
        payload = {
            "inputs": prompt,
            "parameters": {"max_new_tokens": length, "temperature": creativity, "wait_for_model": True}
        }
        
        response = requests.post(f"https://api-inference.huggingface.co/models/{MODEL_ID}", headers=headers, json=payload, timeout=30)
        result = response.json()
        
        if isinstance(result, list) and len(result) > 0:
            res_text = result[0].get('generated_text', '').split("Text:")[-1].strip()
            return jsonify({"fermented": res_text})
        return jsonify({"fermented": "Reaktor lädt noch..."})
    except Exception as e:
        return jsonify({"fermented": f"Fehler: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=10000)
