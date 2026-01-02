const API_URL = "https://kompostwesen.onrender.com"; 

async function fermentieren() {
    const out = document.getElementById('output');
    const text = out.innerText;
    
    // Parameter aus dem Cockpit auslesen
    const settings = {
        content: text,
        mood: document.getElementById('p_mood').value,
        intensity: document.getElementById('p_intensity').value,
        length: document.getElementById('p_length').value,
        enzyme: document.getElementById('p_enzyme').value
    };

    document.getElementById('sensor-status').innerText = "FERMENTIERUNG...";
    updateProgress(50);
    
    try {
        const res = await fetch(`${API_URL}/ferment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings) // Schickt alle Regler-Einstellungen mit!
        });
        const data = await res.json();
        out.innerText = data.fermented;
        updateProgress(100);
    } catch (e) { 
        out.innerText = "Zersetzung abgebrochen: Myzel-Kollaps."; 
    }
}
