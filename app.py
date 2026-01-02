import os
import requests
import json
import random
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['GET'])
def generate():
    # Wir nehmen das Suchwort und machen es klein
    query = request.args.get('source', 'all').lower()
    
    try:
        base_path = os.path.dirname(os.path.abspath(__file__))
        json_path = os.path.join(base_path, 'fragments_processed.json')
        
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if query != 'all':
            # FILTER-LOGIK: Prüft, ob das Wort 'query' im Feld 'source' vorkommt
            filtered = [d for d in data if d.get('source') and query in str(d.get('source')).lower()]
            
            if filtered:
                return jsonify([random.choice(filtered)])
            else:
                return jsonify({"error": f"Kein Substrat für '{query}' gefunden."}), 404
        
        return jsonify([random.choice(data)])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ... Rest der app.py (ferment-Route und __main__) bleibt gleich ...
