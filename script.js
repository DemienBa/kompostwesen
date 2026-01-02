const API_URL = "https://kompostwesen.onrender.com"; //

async function ausgraben() {
    const out = document.getElementById('output');
    const source = document.getElementById('p_source').value;
    
    out.innerText = "Extrahiere Daten aus " + source + "...";
    
    try {
        // Wir senden die Buch-Quelle an das Backend mit!
        const res = await fetch(`${API_URL}/generate?source=${source}`);
        const data = await res.json();
        
        if (data.error) throw new Error(data.error);
        
        const f = data[0];
        // Hier befüllen wir die (passiven) Meta-Tags zur Info
        // Falls du IDs für diese Anzeigen hast:
        if(document.getElementById('m_id')) document.getElementById('m_id').innerText = f.bio_id;
        
        out.innerText = f.content;
    } catch (e) { 
        out.innerText = "FEHLER: Substrat in Quelle '" + source + "' nicht gefunden."; 
    }
}

async function fermentieren() {
    const out = document.getElementById('output');
    
    // Alle komplexen Parameter einsammeln
    const payload = {
        content: out.innerText,
        mood: document.getElementById('p_mood').value,
        intensity: document.getElementById('p_intensity').value,
        creativity: document.getElementById('p_creativity').value, // Neue Sensitivität
        source: document.getElementById('p_source').value
    };

    out.innerText = "Biotische Zersetzung läuft...";
    
    try {
        const res = await fetch(`${API_URL}/ferment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        out.innerText = data.fermented;
    } catch (e) { out.innerText = "Myzel-Kollaps beim Datentransfer."; }
}
