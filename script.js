const API_URL = "https://kompostwesen.onrender.com"; 

async function ausgraben() {
    const out = document.getElementById('output');
    const source = document.getElementById('p_source').value; // Holt z.B. "kompost"
    
    out.innerText = "Extrahiere Substrat aus Schicht: " + source + "...";
    
    try {
        const res = await fetch(`${API_URL}/generate?source=${source}`);
        const data = await res.json();
        
        if (data.error) {
            out.innerText = "HINWEIS: " + data.error;
            return;
        }
        
        out.innerText = data[0].content;
    } catch (e) { 
        out.innerText = "REAKTOR-FEHLER: Verbindung zu Schicht III unterbrochen."; 
    }
}

// ... fermentieren() bleibt wie gehabt ...
