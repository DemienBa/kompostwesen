// BIOLOGISCHER GENERATOR V2 - LAYER 2
// Flow: Generieren → Rechts anzeigen → Klick → Links sammeln → Nach 4x oder Klick → Layer 3

let fragments = [];
let currentGeneratedText = '';

// Sammler (max 4 Texte)
let sammlerTexte = [];
const MAX_SAMMLER = 4;

// ═══════════════════════════════════════════════════════════
// DATEN LADEN
// ═══════════════════════════════════════════════════════════

async function loadFragments() {
    try {
        const response = await fetch('data/fragments_processed.json');
        const data = await response.json();
        fragments = data.fragments || data;
        console.log(`✅ ${fragments.length} Fragmente geladen`);
    } catch (error) {
        console.error('Fehler beim Laden der Fragmente:', error);
    }
}

// ═══════════════════════════════════════════════════════════
// TEIL-FILTER
// ═══════════════════════════════════════════════════════════

function getFilteredFragments() {
    const corpusSelect = document.getElementById('corpus-select');
    const selection = corpusSelect?.value || 'full';
    
    if (selection === 'full') {
        return fragments;
    }
    
    const prefixMap = {
        'part1': 'schlaflosigkeit',
        'part2': 'blume',
        'part3': 'abschaffung'
    };
    
    const prefix = prefixMap[selection];
    if (!prefix) return fragments;
    
    return fragments.filter(f => f.source?.startsWith(prefix));
}

// ═══════════════════════════════════════════════════════════
// BIO-PARAMETER
// ═══════════════════════════════════════════════════════════

function getBioParameters() {
    return {
        temperature: parseInt(document.getElementById('bio-temperature')?.value || 50),
        moisture: parseInt(document.getElementById('bio-moisture')?.value || 50),
        mixing: parseInt(document.getElementById('bio-mixing')?.value || 50),
        textLength: parseInt(document.getElementById('bio-length')?.value || 200)
    };
}

// ═══════════════════════════════════════════════════════════
// KERNLOGIK
// ═══════════════════════════════════════════════════════════

function selectFragmentsByTemperature(pool, temperature, targetWords) {
    let preferredPool;
    
    if (temperature < 30) {
        preferredPool = pool.filter(f => f.word_count > 30);
        if (preferredPool.length < 5) preferredPool = pool.filter(f => f.word_count > 15);
    } else if (temperature > 70) {
        preferredPool = pool.filter(f => f.word_count <= 15);
        if (preferredPool.length < 10) preferredPool = pool.filter(f => f.word_count <= 30);
    } else {
        preferredPool = pool;
    }
    
    if (preferredPool.length < 3) preferredPool = pool;
    
    const selected = [];
    let currentWords = 0;
    const usedIndices = new Set();
    
    while (currentWords < targetWords && usedIndices.size < preferredPool.length) {
        const randomIndex = Math.floor(Math.random() * preferredPool.length);
        if (usedIndices.has(randomIndex)) continue;
        
        usedIndices.add(randomIndex);
        const frag = preferredPool[randomIndex];
        selected.push(frag);
        currentWords += frag.word_count;
    }
    
    return selected;
}

function applyMixing(selectedFragments, mixing) {
    if (mixing < 30) {
        return selectedFragments.sort((a, b) => {
            if (a.source !== b.source) return a.source.localeCompare(b.source);
            return (a.bio_id || '').localeCompare(b.bio_id || '');
        });
    } else if (mixing > 70) {
        return selectedFragments.sort(() => Math.random() - 0.5);
    } else {
        const groups = {};
        selectedFragments.forEach(f => {
            const source = f.source || 'unknown';
            if (!groups[source]) groups[source] = [];
            groups[source].push(f);
        });
        return Object.values(groups).sort(() => Math.random() - 0.5).flat();
    }
}

function joinWithMoisture(selectedFragments, moisture, temperature) {
    let separator;
    
    if (moisture < 30) {
        separator = '\n\n•\n\n';
    } else if (moisture > 70) {
        separator = ' ';
    } else {
        separator = '\n\n';
    }
    
    // Bei hoher Temperatur: Sätze aufbrechen
    if (temperature > 80) {
        const sentences = [];
        selectedFragments.forEach(frag => {
            const sents = frag.content.split(/(?<=[.!?])\s+/);
            sentences.push(...sents.filter(s => s.trim().length > 0));
        });
        
        sentences.sort(() => Math.random() - 0.5);
        
        if (moisture < 30) {
            return sentences.join('\n\n');
        } else if (moisture > 70) {
            return sentences.join(' ');
        } else {
            return sentences.join('\n');
        }
    }
    
    return selectedFragments.map(f => f.content).join(separator);
}

// ═══════════════════════════════════════════════════════════
// HAUPT-GENERATOR
// ═══════════════════════════════════════════════════════════

function generateBioCompost() {
    const pool = getFilteredFragments();
    
    if (pool.length === 0) {
        showOutput('⏳ Fragmente werden geladen...', 'warning');
        return;
    }
    
    const params = getBioParameters();
    
    // 1. Fragmente auswählen
    const selected = selectFragmentsByTemperature(pool, params.temperature, params.textLength);
    
    if (selected.length === 0) {
        showOutput('❌ Keine Fragmente gefunden!', 'error');
        return;
    }
    
    // 2. Reihenfolge
    const ordered = applyMixing(selected, params.mixing);
    
    // 3. Verbinden
    const text = joinWithMoisture(ordered, params.moisture, params.temperature);
    
    // Speichern
    currentGeneratedText = text;
    window.currentBioText = text;
    
    // Wortanzahl
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    
    // Ausgabe RECHTS
    showOutput(text, 'success', wordCount);
}

// ═══════════════════════════════════════════════════════════
// OUTPUT (RECHTE BOX)
// ═══════════════════════════════════════════════════════════

function showOutput(content, type, wordCount = 0) {
    const output = document.getElementById('generated-text');
    const outputHint = document.getElementById('output-hint');
    
    if (!output) return;
    
    if (outputHint) outputHint.style.display = 'none';
    
    if (type === 'error' || type === 'warning') {
        output.innerHTML = `<p class="hint" style="color: ${type === 'error' ? '#e74c3c' : '#f39c12'};">${content}</p>`;
        output.classList.remove('has-content');
        return;
    }
    
    output.innerHTML = `
        <div class="generated-content">${content.replace(/\n/g, '<br>')}</div>
        <div class="bio-meta">${wordCount} Wörter · Klick zum Sammeln →</div>
    `;
    
    output.classList.add('has-content');
}

function clearOutput() {
    const output = document.getElementById('generated-text');
    const outputHint = document.getElementById('output-hint');
    
    if (output) {
        output.innerHTML = '';
        output.classList.remove('has-content');
        if (outputHint) {
            output.appendChild(outputHint);
            outputHint.style.display = 'block';
        }
    }
    
    currentGeneratedText = '';
}

// ═══════════════════════════════════════════════════════════
// SAMMLER (LINKE BOX)
// ═══════════════════════════════════════════════════════════

function moveToSammler() {
    if (!currentGeneratedText) return;
    
    // Text zum Sammler hinzufügen (1:1)
    sammlerTexte.push(currentGeneratedText);
    
    // UI aktualisieren
    updateSammlerDisplay();
    
    // Rechte Box leeren
    clearOutput();
    
    // Bei GENAU 4 Texten: AUTOMATISCH weiter zu Layer 3
    // Aber mit Verzögerung, damit man alle 4 Texte sieht
    if (sammlerTexte.length >= MAX_SAMMLER) {
        console.log('🚀 4 Texte gesammelt! Weiter zu Layer 3 in 2 Sekunden...');
        
        // Visueller Hinweis
        showSammlerFullHint();
        
        // Nach 2 Sekunden automatisch weiter
        setTimeout(() => {
            goToLayer3();
        }, 2000);
    }
}

function updateSammlerDisplay() {
    const sammlerContent = document.getElementById('sammler-content');
    const sammlerHint = document.getElementById('sammler-hint');
    const sammlerCount = document.getElementById('sammler-count');
    const sammlerBox = document.getElementById('kompost-sammler');
    
    // Counter
    if (sammlerCount) {
        sammlerCount.textContent = sammlerTexte.length;
    }
    
    // Hint
    if (sammlerHint) {
        sammlerHint.style.display = sammlerTexte.length > 0 ? 'none' : 'block';
    }
    
    // Inhalt anzeigen
    if (sammlerContent && sammlerTexte.length > 0) {
        // Alle Texte zusammen anzeigen (gekürzt)
        const combined = sammlerTexte.map((text, i) => {
            const preview = text.length > 150 ? text.substring(0, 150) + '...' : text;
            return `<div class="sammler-item"><small>${i + 1}.</small> ${preview}</div>`;
        }).join('');
        
        sammlerContent.innerHTML = combined;
    } else if (sammlerContent) {
        sammlerContent.innerHTML = '';
    }
    
    // Klickbar machen wenn Texte da
    if (sammlerBox) {
        if (sammlerTexte.length > 0) {
            sammlerBox.classList.add('clickable');
        } else {
            sammlerBox.classList.remove('clickable');
        }
    }
}

function showSammlerFullHint() {
    const sammlerBox = document.getElementById('kompost-sammler');
    if (sammlerBox) {
        sammlerBox.classList.add('full');
    }
    
    // Hinweis in der Status-Zeile
    const status = document.querySelector('.sammler-status');
    if (status) {
        status.innerHTML = '<span style="color: #2ecc71;">✓ Voll!</span> Klick auf Sammler → weiter';
    }
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════

function goToLayer3() {
    // Gesammelte Texte für Layer 3 bereitstellen
    window.sammlerTexte = sammlerTexte;
    window.currentBioText = sammlerTexte.join('\n\n---\n\n');
    
    // Transfer Text zu Layer 3 KI-Input
    const kiInput = document.getElementById('ki-input-text');
    if (kiInput && window.currentBioText) {
        kiInput.value = window.currentBioText;
    }
    
    // Reset Layer 3 UI
    const inputBox = document.getElementById('ki-input-box');
    const outputBox = document.getElementById('ki-output-box');
    if (inputBox) {
        inputBox.classList.remove('hidden', 'fade-out');
    }
    if (outputBox) {
        outputBox.classList.add('hidden');
    }
    
    if (typeof switchLayer === 'function') {
        switchLayer(3);
    }
}

function setupClickNavigation() {
    // Rechte Box klicken → Text wandert nach links (NICHT zu Layer 3!)
    const outputBox = document.getElementById('generated-text');
    if (outputBox) {
        outputBox.addEventListener('click', (e) => {
            e.stopPropagation(); // Verhindere Event Bubbling
            console.log('📦 Rechte Box geklickt, has-content:', outputBox.classList.contains('has-content'));
            console.log('📦 Sammler hat:', sammlerTexte.length, 'Texte');
            
            if (outputBox.classList.contains('has-content')) {
                moveToSammler();
            }
        });
    }
    
    // Linke Box klicken → zu Layer 3 (nur wenn Texte da)
    const sammlerBox = document.getElementById('kompost-sammler');
    if (sammlerBox) {
        sammlerBox.addEventListener('click', (e) => {
            e.stopPropagation(); // Verhindere Event Bubbling
            console.log('🧪 Linke Box geklickt, Texte:', sammlerTexte.length);
            
            if (sammlerTexte.length > 0) {
                goToLayer3();
            }
        });
    }
}

// ═══════════════════════════════════════════════════════════
// UI UPDATES
// ═══════════════════════════════════════════════════════════

function updateSliderDisplays() {
    const sliders = [
        { id: 'bio-temperature', display: 'temp-value', suffix: '°' },
        { id: 'bio-moisture', display: 'moisture-value', suffix: '%' },
        { id: 'bio-mixing', display: 'mixing-value', suffix: '%' },
        { id: 'bio-length', display: 'length-value', suffix: ' Wörter' }
    ];
    
    sliders.forEach(({ id, display, suffix }) => {
        const slider = document.getElementById(id);
        const displayElem = document.getElementById(display);
        
        if (slider && displayElem) {
            slider.addEventListener('input', (e) => {
                displayElem.textContent = e.target.value + suffix;
            });
        }
    });
}

// Würfel: Zufällige Parameter einstellen
function randomizeParameters() {
    const sliders = [
        { id: 'bio-temperature', display: 'temp-value', suffix: '°', min: 0, max: 100, step: 5 },
        { id: 'bio-moisture', display: 'moisture-value', suffix: '%', min: 0, max: 100, step: 5 },
        { id: 'bio-mixing', display: 'mixing-value', suffix: '%', min: 0, max: 100, step: 5 },
        { id: 'bio-length', display: 'length-value', suffix: ' Wörter', min: 50, max: 1000, step: 50 }
    ];
    
    sliders.forEach(({ id, display, suffix, min, max, step }) => {
        const slider = document.getElementById(id);
        const displayElem = document.getElementById(display);
        
        if (slider) {
            // Zufälliger Wert innerhalb des Bereichs (gerundet auf step)
            const range = (max - min) / step;
            const randomSteps = Math.floor(Math.random() * (range + 1));
            const randomValue = min + (randomSteps * step);
            
            slider.value = randomValue;
            
            if (displayElem) {
                displayElem.textContent = randomValue + suffix;
            }
        }
    });
    
    // Auch Textkörper zufällig wählen
    const corpusSelect = document.getElementById('corpus-select');
    if (corpusSelect) {
        const options = corpusSelect.options;
        const randomIndex = Math.floor(Math.random() * options.length);
        corpusSelect.selectedIndex = randomIndex;
    }
    
    console.log('🎲 Parameter zufällig eingestellt!');
}

// ═══════════════════════════════════════════════════════════
// INITIALISIERUNG
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    loadFragments();
    updateSliderDisplays();
    setupClickNavigation();
    
    // Generate Button
    const btnGenerate = document.getElementById('btn-generate');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', generateBioCompost);
    }
    
    // Würfel Button - ZUFÄLLIGE PARAMETER
    const btnReroll = document.getElementById('btn-reroll');
    if (btnReroll) {
        btnReroll.addEventListener('click', randomizeParameters);
    }
});

// Export
window.generateBioCompost = generateBioCompost;
window.currentBioText = '';
window.sammlerTexte = sammlerTexte;
