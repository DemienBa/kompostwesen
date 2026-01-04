// LAYER 3 + 4: KI-FERMENTIERUNG & HUMUS-CANVAS

// === LAYER 3: KI ===
let currentKIOutput = '';

// GROQ API KEY (aus vorheriger Session)
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function populateHumusSelect() {
    const select = document.getElementById('humus-select');
    if (!select) return;
    
    const entries = HumusManager.getAll();
    select.innerHTML = '<option>Wähle Humus...</option>';
    
    entries.forEach(entry => {
        const option = document.createElement('option');
        option.value = entry.id;
        const typeSymbol = entry.type === 'bio' ? '💚' : entry.type === 'ki' ? '💙' : '💛';
        option.textContent = `${typeSymbol} ${entry.timestamp.split('T')[0]} (${entry.wordCount}W)`;
        select.appendChild(option);
    });
}

function handleKIInputChange() {
    const newRadio = document.querySelector('input[name="ki-input"][value="new"]');
    const humusRadio = document.querySelector('input[name="ki-input"][value="humus"]');
    const textArea = document.getElementById('ki-input-text');
    const select = document.getElementById('humus-select');
    
    if (humusRadio && humusRadio.checked) {
        select.classList.remove('hidden');
        textArea.disabled = true;
        textArea.placeholder = 'Wähle Humus-Eintrag...';
    } else {
        select.classList.add('hidden');
        textArea.disabled = false;
        textArea.placeholder = 'Text hier eingeben...';
    }
}

function loadHumusToKI() {
    const select = document.getElementById('humus-select');
    const textArea = document.getElementById('ki-input-text');
    
    const id = parseInt(select.value);
    const entry = HumusManager.getById(id);
    
    if (entry) {
        textArea.value = entry.content;
    }
}

async function groqKITransform() {
    const input = document.getElementById('ki-input-text').value;
    
    if (!input.trim()) {
        alert('Kein Input!');
        return;
    }
    
    const mode = document.getElementById('ki-mode').value;
    const chaos = parseInt(document.getElementById('chaos-level').value);
    const fragLevel = parseInt(document.getElementById('fragment-level').value);
    
    // Zeige Loading
    const outputDiv = document.getElementById('ki-output');
    outputDiv.innerHTML = '<p style="color: #3498db;">⚡ KI fermentiert... bitte warten...</p>';
    
    // Baue Prompt basierend auf Modus
    let systemPrompt = '';
    let userPrompt = input;
    
    if (mode === 'compress') {
        systemPrompt = `Du bist ein literarischer Kompost. Verdichte den folgenden Text auf die essenzielle Aussage. Behalte den Stil und die Stimmung, aber reduziere auf ${Math.max(20, 100 - chaos)}% der ursprünglichen Länge.`;
    } else if (mode === 'expand') {
        systemPrompt = `Du bist ein literarischer Kompost. Erweitere den folgenden Text organisch, als würden neue Gedanken aus ihm wachsen. Füge ${chaos}% mehr Material hinzu, das thematisch und stilistisch passt.`;
    } else if (mode === 'alienate') {
        systemPrompt = `Du bist ein literarischer Kompost in anaerober Zersetzung. Verfremde den Text, mache ihn surreal und verstörend, aber erkennbar aus demselben Material. Chaos-Grad: ${chaos}%.`;
    } else if (mode === 'dream') {
        systemPrompt = `Du bist ein literarischer Kompost der halluziniert. Lass den Text in Richtung Traum, Fieber, Delirium mutieren. Behalte Fragmente des Originals, aber lass sie in neue, seltsame Richtungen wachsen. Intensität: ${chaos}%.`;
    }
    
    // Fragmentierung
    if (fragLevel > 50) {
        userPrompt = fragmentText(input, fragLevel);
        systemPrompt += ` Der Input ist bereits fragmentiert. Arbeite mit den Bruchstücken.`;
    }
    
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
                    { role: 'user', content: userPrompt }
                ],
                temperature: Math.min(2, 0.7 + (chaos / 100)),
                max_tokens: 2000
            })
        });
        
        if (!response.ok) {
            throw new Error(`Groq API Error: ${response.status}`);
        }
        
        const data = await response.json();
        currentKIOutput = data.choices[0].message.content;
        
        outputDiv.innerHTML = `<p>${currentKIOutput}</p>`;
        outputDiv.innerHTML += `<div style="margin-top: 15px; padding: 10px; background: rgba(52,152,219,0.1); border-radius: 5px; font-size: 0.9em;">
            <strong>🤖 KI-Fermentierung:</strong><br>
            Modus: ${mode} · Chaos: ${chaos}% · Fragmentierung: ${fragLevel}%
        </div>`;
        
        console.log('✅ KI-Transformation erfolgreich');
        
    } catch (error) {
        console.error('Groq API Fehler:', error);
        outputDiv.innerHTML = `<p style="color: #e74c3c;">❌ KI-Fehler: ${error.message}</p>`;
    }
}

function fragmentText(text, fragLevel) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const keepRatio = 1 - (fragLevel / 100);
    
    return sentences
        .filter(() => Math.random() < keepRatio)
        .map(s => {
            if (fragLevel > 70 && Math.random() > 0.5) {
                // Schneide Sätze mittendurch
                const words = s.split(' ');
                return words.slice(0, Math.floor(words.length / 2)).join(' ') + '...';
            }
            return s;
        })
        .join(' ');
}

function saveKIToHumus() {
    if (!currentKIOutput) {
        alert('Transformiere erst!');
        return;
    }
    
    if (HumusManager.isFull()) {
        alert('Humus voll!');
        return;
    }
    
    HumusManager.add(currentKIOutput, 'ki', {
        mode: document.getElementById('ki-mode').value,
        chaos: document.getElementById('chaos-level').value
    });
    
    alert('💙 KI-Text in Humus gespeichert!');
    populateHumusSelect();
}

// === LAYER 4: HUMUS-CANVAS ===
let humusCanvas, humusCtx;
let mutationPhase = 0;
let mutationStartTime = null;

function initHumusCanvas() {
    humusCanvas = document.getElementById('humus-canvas');
    if (!humusCanvas) return;
    
    humusCtx = humusCanvas.getContext('2d');
    
    // Responsive
    humusCanvas.width = window.innerWidth * 0.9;
    humusCanvas.height = window.innerHeight * 0.7;
    
    mutationStartTime = Date.now();
    
    renderHumusLayers();
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
        const y = 50 + (index * 40);
        const x = 50 + (Math.random() * 200 - 100);
        
        // Farbe basierend auf Mutation
        let color = entry.color;
        if (mutationPhase >= 3) {
            // Phase 4d: Farbe driftet zu Gelb
            const progress = Math.min(1, (mutationPhase - 3) / 2);
            color = interpolateColor(entry.color, '#f39c12', progress);
        }
        
        // Opacity basierend auf Phase 4e
        let opacity = 0.3;
        if (mutationPhase >= 5) {
            opacity = Math.max(0, 0.3 - ((mutationPhase - 5) * 0.05));
        }
        
        humusCtx.globalAlpha = opacity;
        humusCtx.fillStyle = color;
        humusCtx.font = '14px Georgia';
        
        // Text (mutiertoder normal)
        let text = entry.content.substring(0, 100);
        
        if (mutationPhase >= 2) {
            // Phase 4a: Buchstaben ersetzen
            text = text.replace(/[aeiou]/gi, m => Math.random() > 0.5 ? '#' : m);
        }
        
        if (mutationPhase >= 1) {
            // Phase 4b: Wörter vertauschen
            const words = text.split(' ');
            text = words.sort(() => Math.random() - 0.5).join(' ');
        }
        
        // Position-Drift (Phase 4c)
        let xOffset = 0, yOffset = 0;
        if (mutationPhase >= 4) {
            xOffset = (Math.random() - 0.5) * 100;
            yOffset = (Math.random() - 0.5) * 50;
        }
        
        humusCtx.fillText(text, x + xOffset, y + yOffset, 600);
    });
    
    humusCtx.globalAlpha = 1;
}

function startMutation() {
    setInterval(() => {
        if (!mutationStartTime) return;
        
        const elapsed = (Date.now() - mutationStartTime) / 1000 / 60; // Minuten
        
        if (elapsed < 2) {
            mutationPhase = 1; // 4b - Wörter vertauschen
        } else if (elapsed < 5) {
            mutationPhase = 2; // 4a - Buchstaben
        } else if (elapsed < 8) {
            mutationPhase = 3; // 4d - Farbe
        } else if (elapsed < 12) {
            mutationPhase = 4; // 4c - Position
        } else {
            mutationPhase = 5; // 4e - Auflösung
        }
        
        renderHumusLayers();
    }, 1000);
}

function interpolateColor(color1, color2, progress) {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);
    
    const r1 = (c1 >> 16) & 255;
    const g1 = (c1 >> 8) & 255;
    const b1 = c1 & 255;
    
    const r2 = (c2 >> 16) & 255;
    const g2 = (c2 >> 8) & 255;
    const b2 = c2 & 255;
    
    const r = Math.round(r1 + (r2 - r1) * progress);
    const g = Math.round(g1 + (g2 - g1) * progress);
    const b = Math.round(b1 + (b2 - b1) * progress);
    
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function exportHumus() {
    HumusManager.exportAsTxt();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    // Layer 3
    const inputRadios = document.querySelectorAll('input[name="ki-input"]');
    inputRadios.forEach(radio => {
        radio.addEventListener('change', handleKIInputChange);
    });
    
    const humusSelect = document.getElementById('humus-select');
    if (humusSelect) {
        humusSelect.addEventListener('change', loadHumusToKI);
    }
    
    const btnKITransform = document.getElementById('btn-ki-transform');
    if (btnKITransform) {
        btnKITransform.addEventListener('click', groqKITransform);
    }
    
    const btnKIHumus = document.getElementById('btn-ki-to-humus');
    if (btnKIHumus) {
        btnKIHumus.addEventListener('click', saveKIToHumus);
    }
    
    // Layer 4
    const btnExport = document.getElementById('btn-export-humus');
    if (btnExport) {
        btnExport.addEventListener('click', exportHumus);
    }
});

// Wenn Layer 4 aktiviert wird
window.addEventListener('layerchange', (e) => {
    if (e.detail.layer === 4) {
        initHumusCanvas();
        populateHumusSelect();
    }
});
