import os
import requests
import json
import random
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# CORS erlaubt es deinem lokalen Computer (localhost), mit diesem Server zu kommunizieren
CORS(app)

# Dein Hugging Face Token muss in den Render-Umgebungsvariablen hinterlegt sein
HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2"

@app.route('/generate', methods=['GET'])
def generate():
    """Extrahiert ein Fragment basierend auf Suchbegriffen."""
    query = request.args.get('source', 'all').lower()
    
    # Das assoziative Gedächtnis des Systems
    synonyms = {
        "kompost": ["kompost", "erde", "dreck", "humus", "manifest", "zersetzung", "substrat", "fäulnis", "boden"],
        "schlaflosigkeit": ["schlaflosigkeit", "nacht", "wach", "traum", "insomnia", "dunkelheit", "stille"],
        "myzel": ["myzel", "pilz", "geflecht", "netzwerk", "sporen", "hyphen", "wurzel", "untergrund"]
    }
    
    try:
        # Pfad-Logik für den Server
        base_path = os.path.dirname(os.path.abspath(__file__))
        json_path = os.path.join(base_path, 'fragments_processed.json')
        
        if not os.path.exists(json_path):
            return jsonify({"error": "JSON-Datenbank am Server nicht gefunden."}), 404

        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if query != 'all':
            # Holt die Wortwolke für den gewählten Begriff oder nutzt den Begriff selbst
            keywords = synonyms.get(query, [query])
            
            # Prüft, ob irgendein Keyword im Feld 'source' des Fragments vorkommt
            filtered = [
                d for d in data 
                if d.get('source') and any(word in str(d.get('source')).lower() for word in keywords)
            ]
            
            if filtered:
                return jsonify([random.choice(filtered)])
            else:
                # Falls kein Treffer, geben wir einen dezenten Hinweis zurück
                return jsonify({"error": f"Kein Substrat für '{query}' in der aktuellen Schicht."}), 404
        
        return jsonify([random.choice(data)])
    except Exception as e:
        return jsonify({"error": f"Server-Extraktionsfehler: {str(e)}"}), 500

@app.route('/ferment', methods=['POST'])
def ferment():
    """Transformiert den Text mittels KI in eine botanische Halluzination."""
    try:
        data = request.json
        text = data.get("content", "")
        mood = data.get("mood", "skeptisch")
        intensity = float(data.get("intensity", 0.7))
        creativity = float(data.get("creativity", 0.7))
        length = int(data.get("length", 200))

        if not text:
            return jsonify({"error": "Kein Text zum Fermentieren empfangen."}), 400

        # Der System-Prompt steuert die wissenschaftlich-skurrile Tonalität
        prompt = (f"Handle als phytochemisches System. Stimmung: {mood}. "
                  f"Zersetzungs-Intensität: {intensity}. "
                  f"Transformiere diesen Text ohne Einleitung direkt in eine botanische Halluzination: {text}")

        headers = {"Authorization": f"Bearer {HF_TOKEN}"}
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": length, 
                "temperature": creativity, 
                "wait_for_model": True
            }
        }
        
        response = requests.post(
            f"https://api-inference.huggingface.co/models/{MODEL_ID}", 
            headers=headers, 
            json=payload, 
            timeout=30
        )
        result = response.json()
        
        # Extraktion des reinen generierten Textes
        if isinstance(result, list) and len(result) > 0:
            raw_output = result[0].get('generated_text', '')
            # Entfernt den Prompt aus der Antwort, falls das Modell ihn wiederholt
            clean_text = raw_output.split("Halluzination:")[-1].strip()
            return jsonify({"fermented": clean_text})
        
        return jsonify({"fermented": "Reaktor-Vakuum: Das Modell antwortet verzögert. Bitte erneut versuchen."})
    
    except Exception as e:
        return jsonify({"fermented": f"System-Kollaps: {str(e)}"}), 500

if __name__ == "__main__":
    # Render nutzt Port 10000 standardmäßig
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
