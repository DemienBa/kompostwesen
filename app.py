import os
import json
import random
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['GET'])
def generate():
    # Der gewählte Wert aus dem Menü (z.B. "kompost")
    source_filter = request.args.get('source', 'all').lower()
    
    try:
        with open('fragments_processed.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if source_filter != 'all':
            # Wir prüfen, ob das Wort (z.B. "kompost") IRGENDWO im Quellnamen vorkommt
            filtered_data = [d for d in data if source_filter in d.get('source', '').lower()]
            
            if filtered_data:
                return jsonify([random.choice(filtered_data)])
            else:
                # Falls nichts gefunden wurde, geben wir eine klare Meldung zurück
                return jsonify({"error": f"Keine Fragmente für '{source_filter}' in der Datenbank."}), 404
        
        return jsonify([random.choice(data)])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
    # ... Rest wie gehabt (Requests an Hugging Face)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
