// BIOLOGISCHER GENERATOR - LAYER 2
// Kompostiert Texte basierend auf biologischen Parametern

let fragments = [];
let chaptersData = null;
let currentGeneratedText = '';

// Lade Fragmente
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

// Lade Kapitel
async function loadChaptersForGenerator() {
    try {
        const response = await fetch('data/chapters_cleaned.json');
        chaptersData = await response.json();
        console.log(`✅ ${chaptersData.parts.length} Teile geladen`);
    } catch (error) {
        console.error('Fehler beim Laden der Kapitel:', error);
    }
}

// Textkörper-Auswahl aktualisieren
function updateCorpusDisplay() {
    const select = document.getElementById('corpus-select');
    const display = document.getElementById('original-text');
    
    if (!chaptersData) return;
    
    const value = select.value;
    let text = '';
    let totalWords = 0;
    
    if (value === 'full') {
        // Ganzer Textkörper
        chaptersData.parts.forEach(part => {
            text += `\n\n═══ ${part.title} ═══\n\n`;
            part.chapters.forEach(ch => {
                text += `${ch.number}. ${ch.title}\n`;
                totalWords += ch.word_count;
            });
        });
        text = `Ganzer Textkörper: 84 Kapitel, ${totalWords.toLocaleString('de-DE')} Wörter\n\n` + text;
    } else if (value.startsWith('part')) {
        const partIndex = parseInt(value.replace('part', '')) - 1;
        const part = chaptersData.parts[partIndex];
        
        text = `${part.title}\n\n`;
        part.chapters.forEach(ch => {
            text += `${ch.number}. ${ch.title} (${ch.word_count} Wörter)\n`;
            totalWords += ch.word_count;
        });
        text += `\n\nGesamt: ${part.chapters.length} Kapitel, ${totalWords.toLocaleString('de-DE')} Wörter`;
    }
    
    display.textContent = text;
}

// Bio-Parameter lesen
function getBioParameters() {
    return {
        temperature: parseInt(document.getElementById('temperature').value),
        moisture: parseInt(document.getElementById('moisture').value),
        ph: parseFloat(document.getElementById('ph').value),
        aeration: document.getElementById('aeration').value,
        enzyme: document.getElementById('enzyme-select').value,
        zone: document.getElementById('zone-select').value,
        textLength: parseInt(document.getElementById('text-length').value),
        cnRatio: parseInt(document.getElementById('cn-ratio').value)
    };
}

// Temperatur → Intensitäts-Enzyme
function getEnzymesForTemperature(temp) {
    if (temp < 25) {
        return ['#Denken', '#Schlaf'];
    } else if (temp < 45) {
        return ['#Noise', '#Resonanz'];
    } else if (temp < 70) {
        return ['#Lysis', '#Rausch'];
    } else {
        return ['#Dividual'];
    }
}

// pH → Emotionale Valenz
function getEnzymesForPH(ph) {
    if (ph < 6) {
        return ['#Angst'];
    } else if (ph > 8) {
        return ['#Lysis'];
    } else {
        return [];
    }
}

// Fragmente filtern
function filterFragmentsByBioParams(params) {
    let filtered = [...fragments];
    
    const tempEnzymes = getEnzymesForTemperature(params.temperature);
    const phEnzymes = getEnzymesForPH(params.ph);
    
    let targetEnzymes = [];
    if (params.enzyme) {
        targetEnzymes.push(params.enzyme);
    }
    targetEnzymes = [...new Set([...targetEnzymes, ...tempEnzymes, ...phEnzymes])];
    
    if (targetEnzymes.length > 0) {
        filtered = filtered.filter(frag => {
            return targetEnzymes.some(enzyme => 
                frag.enzymes && frag.enzymes.includes(enzyme)
            );
        });
    }
    
    if (params.zone) {
        filtered = filtered.filter(frag => frag.zone === params.zone);
    }
    
    if (params.aeration === 'anaerob') {
        filtered = filtered.filter(frag => 
            frag.is_unkompostierbar || frag.word_count > 30
        );
    }
    
    return filtered;
}

// Text generieren
function generateBioCompost() {
    if (fragments.length === 0) {
        alert('Fragmente noch nicht geladen!');
        return;
    }
    
    const params = getBioParameters();
    console.log('🔬 Bio-Parameter:', params);
    
    let pool = filterFragmentsByBioParams(params);
    
    if (pool.length === 0) {
        document.getElementById('generated-text').innerHTML = 
            '<p style="color: #e74c3c;">Keine Fragmente gefunden! Ändere Filter.</p>';
        return;
    }
    
    console.log(`📊 ${pool.length} Fragmente`);
    
    // Ziel-Wortanzahl = User-Eingabe
    const targetWords = params.textLength;
    
    const selectedFragments = [];
    let currentWords = 0;
    
    while (currentWords < targetWords && pool.length > 0) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        const frag = pool.splice(randomIndex, 1)[0];
        selectedFragments.push(frag);
        currentWords += frag.word_count;
    }
    
    // C:N-Verhältnis = Fragmentierung
    // Hoch (C-reich) = Fragmentiert, viele kurze Stücke
    // Niedrig (N-reich) = Zusammenhängend, lange Stücke
    
    let generatedText = '';
    
    if (params.cnRatio > 35) {
        // C-REICH (fragmentiert)
        // Zufällige Reihenfolge + harte Schnitte
        selectedFragments.sort(() => Math.random() - 0.5);
        generatedText = selectedFragments.map(frag => frag.content).join('\n\n');
    } else if (params.cnRatio < 20) {
        // N-REICH (zusammenhängend)
        // Natürliche Reihenfolge + fließende Übergänge
        generatedText = selectedFragments.map(frag => frag.content).join(' ');
    } else {
        // OPTIMAL (ausgewogen)
        generatedText = selectedFragments.map(frag => frag.content).join('. ');
    }
    
    // Feuchtigkeit beeinflusst zusätzlich
    if (params.moisture > 60 && params.cnRatio < 30) {
        // Nass + N-reich = Wiederholungen
        const wetFragments = [];
        selectedFragments.forEach(frag => {
            wetFragments.push(frag);
            if (Math.random() > 0.7) {
                wetFragments.push(frag);
            }
        });
        generatedText = wetFragments.map(f => f.content).join(' ');
    }
    
    // Anaerobe Transformation
    if (params.aeration === 'anaerob') {
        generatedText = generatedText.replace(/\./g, '.\n\n');
        generatedText = generatedText.replace(/([A-Z])/g, '\n$1');
    }
    
    currentGeneratedText = generatedText;
    window.currentBioText = generatedText; // Für Transfer zu Layer 3
    
    const output = document.getElementById('generated-text');
    output.innerHTML = `<p>${generatedText}</p>`;
    output.innerHTML += `<div style="margin-top: 20px; padding: 10px; background: rgba(46,204,113,0.1); border-radius: 5px; font-size: 0.9em;">
        <strong>🔬 Bio-Kompostierung:</strong><br>
        Fragmente: ${selectedFragments.length} · Wörter: ${currentWords}<br>
        Temp: ${params.temperature}°C · Feuch: ${params.moisture}% · pH: ${params.ph}<br>
        C:N: ${params.cnRatio}:1 (${getCNPhase(params.cnRatio)})
    </div>`;
}

function getCNPhase(cn) {
    if (cn < 20) return 'N-reich (zusammenhängend)';
    if (cn > 35) return 'C-reich (fragmentiert)';
    return 'Optimal';
}

function saveBioToHumus() {
    if (!currentGeneratedText) {
        alert('Generiere erst einen Text!');
        return;
    }
    
    if (HumusManager.isFull()) {
        alert('Humus voll! Max 20.');
        return;
    }
    
    const params = getBioParameters();
    HumusManager.add(currentGeneratedText, 'bio', params);
    
    updateHumusStatus();
    alert('💚 In Humus gespeichert!');
}

function updateHumusStatus() {
    const count = HumusManager.count();
    const countElem = document.getElementById('humus-count');
    if (countElem) countElem.textContent = count;
    
    const btn = document.getElementById('btn-to-humus');
    if (btn) {
        if (HumusManager.isFull()) {
            btn.disabled = true;
            btn.textContent = '💚 HUMUS VOLL';
        } else {
            btn.disabled = false;
            btn.textContent = `→💚 SPEICHERN (${HumusManager.remaining()})`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadFragments();
    loadChaptersForGenerator();
    
    const corpusSelect = document.getElementById('corpus-select');
    if (corpusSelect) {
        corpusSelect.addEventListener('change', updateCorpusDisplay);
        setTimeout(updateCorpusDisplay, 1000);
    }
    
    const temperature = document.getElementById('temperature');
    const moisture = document.getElementById('moisture');
    const ph = document.getElementById('ph');
    const textLength = document.getElementById('text-length');
    const cnRatio = document.getElementById('cn-ratio');
    
    if (temperature) {
        temperature.addEventListener('input', (e) => {
            const elem = document.getElementById('temp-value');
            if (elem) elem.textContent = e.target.value + '°C';
        });
    }
    
    if (moisture) {
        moisture.addEventListener('input', (e) => {
            const elem = document.getElementById('moisture-value');
            if (elem) elem.textContent = e.target.value + '%';
        });
    }
    
    if (ph) {
        ph.addEventListener('input', (e) => {
            const elem = document.getElementById('ph-value');
            if (elem) elem.textContent = parseFloat(e.target.value).toFixed(1);
        });
    }
    
    if (textLength) {
        textLength.addEventListener('input', (e) => {
            const elem = document.getElementById('length-value');
            if (elem) elem.textContent = e.target.value + ' Wörter';
        });
    }
    
    if (cnRatio) {
        cnRatio.addEventListener('input', (e) => {
            const elem = document.getElementById('cn-value');
            if (elem) elem.textContent = e.target.value + ':1';
        });
    }
    
    const btnGenerate = document.getElementById('btn-generate');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', generateBioCompost);
    }
    
    const btnHumus = document.getElementById('btn-to-humus');
    if (btnHumus) {
        btnHumus.addEventListener('click', saveBioToHumus);
    }
    
    updateHumusStatus();
});
