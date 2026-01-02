// HIER DEINE NEUE RENDER-URL EINTRAGEN
const API_URL = "https://kompostwesen-backend.onrender.com"; 

async function ausgraben() {
    const out = document.getElementById('output');
    out.innerText = "Grabe in den digitalen Schichten...";
    try {
        const res = await fetch(`${API_URL}/generate`);
        const data = await res.json();
        // Zeigt das unveränderte Fragment an
        out.innerText = data[0].content; 
    } catch (e) {
        out.innerText = "Der Reaktor schläft noch. Bitte warte 50 Sekunden und versuche es erneut.";
    }
}

async function fermentieren() {
    const out = document.getElementById('output');
    const aktuellerText = out.innerText;

    // Nur fermentieren, wenn ein echter Text vorhanden ist
    if (aktuellerText.includes("Warte") || aktuellerText.includes("Grabe") || aktuellerText.length < 5) return;

    out.innerText = "Biotische Zersetzung läuft... 🌱";

    try {
        const res = await fetch(`${API_URL}/ferment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: aktuellerText }) // Sendet den sichtbaren Text zur KI
        });
        const data = await res.json();
        // Das Ergebnis ersetzt das Original im selben Fenster
        out.innerText = data.fermented; 
    } catch (e) {
        out.innerText = "Die KI-Verbindung wurde unterbrochen.";
    }
}
