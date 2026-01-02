const API_URL = "https://kompostwesen.onrender.com"; // WICHTIG: Setze hier deine URL ein!

async function ausgraben() {
    const out = document.getElementById('output');
    const source = document.getElementById('p_source').value;
    out.innerText = "Extrahiere Substrat aus " + source + "...";
    
    try {
        const res = await fetch(`${API_URL}/generate?source=${source}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        out.innerText = data[0].content;
    } catch (e) { 
        out.innerText = "FEHLER: " + e.message; 
    }
}

async function fermentieren() {
    const out = document.getElementById('output');
    const payload = {
        content: out.innerText,
        mood: document.getElementById('p_mood').value,
        intensity: document.getElementById('p_intensity').value,
        creativity: document.getElementById('p_creativity').value,
        length: document.getElementById('p_length').value
    };

    out.innerText = "Fermentierung läuft nach eingestellten Parametern...";
    
    try {
        const res = await fetch(`${API_URL}/ferment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        out.innerText = data.fermented;
    } catch (e) { 
        out.innerText = "Verbindung zum Myzel unterbrochen."; 
    }
}
