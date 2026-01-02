const API_URL = "https://kompostwesen.onrender.com"; 

async function ausgraben() {
    const out = document.getElementById('output');
    out.innerText = "Scanne tiefere Schichten...";
    
    try {
        const res = await fetch(`${API_URL}/generate`);
        const data = await res.json();
        const f = data[0];

        // Hier werden die Parameter-Boxen befüllt
        document.getElementById('m_id').innerText = f.bio_id || "N/A";
        document.getElementById('m_enz').innerText = f.enzymes ? f.enzymes.join(", ") : "KEINE";
        document.getElementById('m_zone').innerText = f.zone || "X";
        document.getElementById('m_bio').innerText = f.is_unkompostierbar ? "NEIN" : "JA";
        
        // Der Haupttext
        out.innerText = f.content;
    } catch (e) { 
        out.innerText = "Extraktions-Fehler: Verbindung zum Reaktor verloren."; 
    }
}
