import os
import json
import random
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['GET'])
def generate():
    source_filter = request.args.get('source', 'all')
    try:
        with open('fragments_processed.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Filtern nach Buch-Quelle
        if source_filter != 'all':
            filtered_data = [d for d in data if source_filter in d.get('source', '').lower()]
            if filtered_data:
                return jsonify([random.choice(filtered_data)])
        
        return jsonify([random.choice(data)])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    }
    # ... Rest wie gehabt (Requests an Hugging Face)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
