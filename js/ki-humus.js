// LAYER 3 + 4: KI-FERMENTIERUNG & HUMUS-CANVAS

// === LAYER 3: KI ===
let currentKIOutput = '';

// GROQ API KEY
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Globale Variable für Text-Transfer von Layer 2
window.currentBioText = '';

// Typewriter-Effekt
function typeWriter(text, element, speed = 30, callback) {
    let i = 0;
    element.innerHTML = '';
    element.style.opacity = '1';
    
    function type() {
        if (i < text.length) {
            // Gelegentlicher Glitch
            if (Math.random() > 0.98) {
                element.innerHTML += '<span class="glitch-char">' + text.charAt(i) + '</span>';
            } else {
                element.innerHTML += text.charAt(i);
            }
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

// KI-Transformation mit neuen Prompts
async function groqKITransform() {
    console.log('🚀 FERMENTIEREN GESTARTET!');
    
    const inputBox = document.getElementById('ki-input-box');
    const outputBox = document.getElementById('ki-output-box');
    const outputText = document.getElementById('ki-output-text');
    const input = document.getElementById('ki-input-text').value;
    
    console.log('📝 Input-Text:', input ? input.substring(0, 50) + '...' : 'LEER!');
    
    if (!input.trim()) {
        alert('Kein Text vorhanden! Generiere erst in Layer 2.');
        return;
    }
    
    // Prüfe Max-Länge (Schutz vor Überlastung)
    if (input.split(' ').length > 2000) {
        alert('Text zu lang! Max 2000 Wörter.');
        return;
    }
    
    const mode = document.getElementById('ki-mode').value;
    const chaos = parseInt(document.getElementById('chaos-level').value);
    
    console.log('⚙️ Modus:', mode, '| Chaos:', chaos);
    
    // Verstecke Input, zeige Output mit Loading
    inputBox.classList.add('fade-out');
    setTimeout(() => {
        inputBox.classList.add('hidden');
    }, 500);
    outputBox.classList.remove('hidden');
    outputText.innerHTML = '<span class="loading-text">🧫 Fermentierung läuft...</span>';
    
    // Baue Prompt basierend auf Modus
    let systemPrompt = '';
    
    if (mode === 'compress') {
        systemPrompt = `Du bist ein literarischer Fermentator. Verdichte den folgenden Text auf 50% seiner Länge. 
Verwende einfache, klare Sprache. Behalte die Kernaussagen, entferne alles Überflüssige. 
Keine komplexen Sätze. Destilliere die Essenz.`;
    } else if (mode === 'expand') {
        systemPrompt = `Du bist ein literarischer Fermentator. Erweitere den folgenden Text auf 150% seiner Länge.
Vertiefe die Themen, füge philosophische Reflexionen hinzu.
Bringe das Thema auf eine neue, tiefere Ebene.
Bleibe beim Ausgangsmaterial, aber gehe tiefer in die Bedeutung.`;
    } else if (mode === 'alienate') {
        systemPrompt = `Du bist ein literarischer Fermentator der Verfremdung. 
Drehe Stimmung und Stil dieses Textes KOMPLETT um:
- Wenn traurig → fröhlich
- Wenn ernst → absurd  
- Wenn poetisch → nüchtern
- Wenn chaotisch → geordnet
- Wenn hoffnungsvoll → düster
Behalte die Themen, aber invertiere die Atmosphäre vollständig.`;
    } else if (mode === 'dream') {
        systemPrompt = `Du bist ein literarischer Fermentator im Traumzustand.
Verändere den Text nur LEICHT, aber füge hinzu:
- Wiederholungen von Schlüsselwörtern
- Echo-Effekte (Sätze die sich spiegeln)
- Leichte Verzerrungen der Bedeutung
- Wie ein Traum, der sich wiederholt
Der Text soll noch erkennbar sein, aber halluzinatorisch wirken.
Viele Wiederholungen. Echos. Echos. Wiederholungen.`;
    }
    
    console.log('📡 Sende Anfrage an Groq API...');
    
    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: input }
                ],
                temperature: Math.min(1.5, 0.5 + (chaos / 100)),
                max_tokens: 2000
            })
        });
        
        console.log('📬 Response Status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error Body:', errorText);
            throw new Error(`Groq API Error: ${response.status}`);
        }
        
        const data = await response.json();
        currentKIOutput = data.choices[0].message.content;
        
        console.log('✅ KI-Transformation erfolgreich!');
        
        // Output mit Typewriter-Effekt (normale Lesegeschwindigkeit ~30ms)
        outputText.innerHTML = '';
        typeWriter(currentKIOutput, outputText, 30, () => {
            // Nach Typewriter: Info hinzufügen
            outputText.innerHTML += `<div class="ki-info">
                <strong>🤖 Modus:</strong> ${mode} · <strong>Chaos:</strong> ${chaos}%
            </div>`;
            
            // Zeige Humus-Button
            const humusBtn = document.getElementById('btn-ki-humus');
            if (humusBtn) humusBtn.classList.remove('hidden');
        });
        
    } catch (error) {
        console.error('❌ Groq API Fehler:', error);
        outputText.innerHTML = `<p class="error-text">❌ KI-Fehler: ${error.message}</p>`;
        // Bei Fehler: Zeige Input wieder
        inputBox.classList.remove('hidden', 'fade-out');
        outputBox.classList.add('hidden');
    }
}

function saveKIToHumus() {
    if (!currentKIOutput) {
        alert('Transformiere erst!');
        return;
    }
    
    if (HumusManager.isFull()) {
        alert('Humus voll! (Max 20 Einträge)');
        return;
    }
    
    HumusManager.add(currentKIOutput, 'ki', {
        mode: document.getElementById('ki-mode').value,
        chaos: document.getElementById('chaos-level').value
    });
    
    // Update Status
    const status = document.getElementById('ki-humus-status');
    if (status) {
        status.textContent = `💙 Gespeichert! (${HumusManager.count()}/20)`;
        status.classList.add('saved');
    }
    
    console.log('💙 KI-Text zu Humus gespeichert');
}

// === LAYER 4: HUMUS-CANVAS ===
let humusCanvas, humusCtx;
let mutationPhase = 0;
let mutationStartTime = null;

function initHumusCanvas() {
    humusCanvas = document.getElementById('humus-canvas');
    if (!humusCanvas) return;
    
    humusCtx = humusCanvas.getContext('2d');
    
    // Responsive Größe
    humusCanvas.width = window.innerWidth;
    humusCanvas.height = window.innerHeight;
    
    renderHumusLayers();
    
    // Starte Mutation-Timer
    mutationStartTime = Date.now();
    startMutation();
}

function renderHumusLayers() {
    if (!humusCtx) return;
    
    const entries = HumusManager.getAll();
    
    // Update count
    const countElem = document.getElementById('humus-total-count');
    if (countElem) countElem.textContent = entries.length;
    
    if (entries.length === 0) {
        humusCtx.clearRect(0, 0, humusCanvas.width, humusCanvas.height);
        humusCtx.fillStyle = '#7f8c8d';
        humusCtx.font = '20px Georgia';
        humusCtx.textAlign = 'center';
        humusCtx.fillText('Noch kein Humus gespeichert...', humusCanvas.width / 2, humusCanvas.height / 2);
        return;
    }
    
    humusCtx.clearRect(0, 0, humusCanvas.width, humusCanvas.height);
    
    entries.forEach((entry, index) => {
        // Position: Versetzt übereinander als Blöcke
        const x = 50 + (index * 30) % 400;
        const y = 50 + (index * 80);
        const maxWidth = 600;
        
        // Farbe basierend auf Mutation
        let color = entry.color;
        if (mutationPhase >= 3) {
            const progress = Math.min(1, (mutationPhase - 3) / 2);
            color = interpolateColor(entry.color, '#f39c12', progress);
        }
        
        // Opacity basierend auf Phase 5
        let opacity = 0.7;
        if (mutationPhase >= 5) {
            opacity = Math.max(0.1, 0.7 - ((mutationPhase - 5) * 0.1));
        }
        
        humusCtx.globalAlpha = opacity;
        humusCtx.fillStyle = color;
        humusCtx.font = '14px Georgia';
        
        // Text als Block
        let text = entry.content;
        
        // Mutationen
        if (mutationPhase >= 2) {
            // Phase 2: Buchstaben ersetzen
            text = text.replace(/[aeiou]/gi, m => Math.random() > 0.5 ? '#' : m);
        }
        
        if (mutationPhase >= 1) {
            // Phase 1: Wörter vertauschen
            const words = text.split(' ');
            text = words.sort(() => Math.random() - 0.5).join(' ');
        }
        
        // Position-Drift (Phase 4)
        let xOffset = 0, yOffset = 0;
        if (mutationPhase >= 4) {
            xOffset = (Math.random() - 0.5) * 100;
            yOffset = (Math.random() - 0.5) * 50;
        }
        
        // Text als mehrzeiliger Block rendern
        const lines = wrapText(humusCtx, text, maxWidth);
        lines.slice(0, 8).forEach((line, lineIndex) => {
            humusCtx.fillText(line, x + xOffset, y + yOffset + (lineIndex * 18), maxWidth);
        });
    });
    
    humusCtx.globalAlpha = 1;
}

// Helper: Text umbrechen
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    });
    
    if (currentLine) lines.push(currentLine);
    return lines;
}

function startMutation() {
    setInterval(() => {
        if (!mutationStartTime) return;
        
        const elapsedSeconds = (Date.now() - mutationStartTime) / 1000;
        
        // 10 Sekunden pro Phase!
        if (elapsedSeconds < 10) {
            mutationPhase = 1;
        } else if (elapsedSeconds < 20) {
            mutationPhase = 2;
        } else if (elapsedSeconds < 30) {
            mutationPhase = 3;
        } else if (elapsedSeconds < 40) {
            mutationPhase = 4;
        } else {
            mutationPhase = 5;
        }
        
        renderHumusLayers();
    }, 1000);
}

function interpolateColor(color1, color2, progress) {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);
    
    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);
    
    const r = Math.round(r1 + (r2 - r1) * progress);
    const g = Math.round(g1 + (g2 - g1) * progress);
    const b = Math.round(b1 + (b2 - b1) * progress);
    
    return `rgb(${r}, ${g}, ${b})`;
}

function exportHumus() {
    const txt = HumusManager.exportAsTxt();
    
    if (!txt) {
        alert('Kein Humus zum Exportieren!');
        return;
    }
    
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `humus-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('📥 Humus exportiert');
}

// === EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', () => {
    // Layer 3: KI Transform Button
    const btnKITransform = document.getElementById('btn-ki-transform');
    if (btnKITransform) {
        btnKITransform.addEventListener('click', groqKITransform);
    }
    
    // Layer 3: Humus speichern Button
    const btnKIHumus = document.getElementById('btn-ki-to-humus');
    if (btnKIHumus) {
        btnKIHumus.addEventListener('click', saveKIToHumus);
    }
    
    // Layer 3: Chaos Slider
    const chaosSlider = document.getElementById('chaos-level');
    if (chaosSlider) {
        chaosSlider.addEventListener('input', (e) => {
            const val = document.getElementById('chaos-val');
            if (val) val.textContent = e.target.value + '%';
        });
    }
    
    // Layer 4: Export Button
    const btnExport = document.getElementById('btn-export-humus');
    if (btnExport) {
        btnExport.addEventListener('click', exportHumus);
    }
    
    // Layer-Change Event: Initialisiere Layer 3 oder 4
    window.addEventListener('layerchange', (e) => {
        if (e.detail.layer === 3) {
            // Layer 3: Fülle Textfeld mit Bio-Text
            const textArea = document.getElementById('ki-input-text');
            if (textArea && window.currentBioText) {
                textArea.value = window.currentBioText;
            }
            
            // Reset UI: Zeige Input, verstecke Output
            const inputSection = document.getElementById('ki-input-section');
            const outputSection = document.getElementById('ki-output-section');
            
            if (inputSection) inputSection.classList.remove('hidden');
            if (outputSection) outputSection.classList.add('hidden');
        }
        
        if (e.detail.layer === 4) {
            initHumusCanvas();
        }
    });
});

// Chaos-Slider Update
document.addEventListener('DOMContentLoaded', () => {
    const chaosSlider = document.getElementById('chaos-level');
    const chaosVal = document.getElementById('chaos-val');
    
    if (chaosSlider && chaosVal) {
        chaosSlider.addEventListener('input', (e) => {
            chaosVal.textContent = e.target.value + '%';
        });
    }
});
