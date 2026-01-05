// LAYER MANAGEMENT - 5 LAYERS (0-4)
let currentLayer = 0;
let orbVisible = false;
let bookVisible = false;

const layers = {
    0: document.getElementById('layer0'),
    1: document.getElementById('layer1'),
    2: document.getElementById('layer2'),
    3: document.getElementById('layer3'),
    4: document.getElementById('layer4')
};

// Layer wechseln
function switchLayer(targetLayer) {
    console.log(`📍 Layer ${currentLayer} → Layer ${targetLayer}`);
    
    if (layers[currentLayer]) {
        layers[currentLayer].classList.remove('active');
    }
    
    if (layers[targetLayer]) {
        layers[targetLayer].classList.add('active');
        currentLayer = targetLayer;
        
        // Fire event für Layer-spezifische Initialisierung
        window.dispatchEvent(new CustomEvent('layerchange', { 
            detail: { layer: targetLayer } 
        }));
    }
}

// Zufällige Position für Kugel
function getRandomPosition() {
    const margin = 100; // Abstand vom Rand
    const x = margin + Math.random() * (window.innerWidth - 2 * margin - 150);
    const y = margin + Math.random() * (window.innerHeight - 2 * margin - 150);
    return { x, y };
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
    
    // ===== LAYER 0: KUGEL-SYSTEM =====
    const compostStart = document.getElementById('compost-start');
    const blackOrb = document.getElementById('black-orb');
    const bookReveal = document.getElementById('book-reveal');
    
    // Click auf Kompost-Hintergrund → Unterschiedliches Verhalten
    compostStart?.addEventListener('click', (e) => {
        // Ignoriere Clicks auf Kugel oder Buch selbst
        if (e.target.closest('#black-orb') || e.target.closest('#book-reveal')) {
            return;
        }
        
        if (!orbVisible && !bookVisible) {
            // Zustand: Nichts da → Zeige Kugel
            console.log('✨ Click #1 → Schwarze Kugel erscheint');
            
            const pos = getRandomPosition();
            blackOrb.style.left = `${pos.x}px`;
            blackOrb.style.top = `${pos.y}px`;
            
            blackOrb.classList.remove('hidden');
            compostStart.classList.add('orb-active');
            orbVisible = true;
            
        } else if (orbVisible && !bookVisible) {
            // Zustand: Kugel da, aber man klickt auf Kompost (nicht Kugel)
            // → NICHTS passiert (man muss auf Kugel klicken!)
            console.log('⚫ Kugel ist da, aber Kompost geklickt → Nichts');
            
        } else if (bookVisible) {
            // Zustand: Buch da, man klickt auf Kompost (nicht Buch)
            // → Wikipedia + Layer 4
            console.log('🌐 Buch sichtbar + Kompost geklickt → Wikipedia + Layer 4');
            window.open('https://de.wikipedia.org/wiki/Kompostierung', '_blank');
            switchLayer(4);
        }
    });
    
    // Click auf Kugel → Verwandelt sich in Buchcover
    blackOrb?.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (orbVisible && !bookVisible) {
            console.log('📖 Kugel Click → Buchcover erscheint');
            
            // Position von Kugel übernehmen
            const orbRect = blackOrb.getBoundingClientRect();
            bookReveal.style.left = `${orbRect.left - 35}px`; // Zentrieren (Buch ist größer)
            bookReveal.style.top = `${orbRect.top - 90}px`;
            
            // Fade Kugel aus
            blackOrb.style.opacity = '0';
            blackOrb.style.transform = 'scale(0.5)';
            
            setTimeout(() => {
                blackOrb.classList.add('hidden');
                
                // Zeige Buch
                bookReveal.classList.remove('hidden');
                setTimeout(() => {
                    bookReveal.classList.add('visible');
                }, 10);
                
                orbVisible = false;
                bookVisible = true;
            }, 400);
        }
    });
    
    // Click auf Buchcover → Layer 1 (Inhaltsverzeichnis)
    bookReveal?.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (bookVisible) {
            console.log('📚 Buch Click → Layer 1 (Inhaltsverzeichnis)');
            switchLayer(1);
        }
    });
    
    // ===== LAYER 1 → LAYER 2 =====
    const compostBg1 = document.getElementById('compost-bg-1');
    if (compostBg1) {
        compostBg1.addEventListener('click', () => {
            if (currentLayer !== 1) return; // Nur wenn Layer 1 aktiv!
            
            console.log('Click auf Rand (Layer 1) → Layer 2');
            
            // Prüfe ob Kapitel offen oder TOC
            const readingView = document.getElementById('reading-view');
            const isReading = readingView && !readingView.classList.contains('hidden');
            
            if (isReading && currentChapterIndex >= 0) {
                // Kapitel offen → Übertrage diesen Text zu Layer 2
                console.log(`📄 Übertrage Kapitel ${currentChapterIndex} zu Layer 2`);
                const chapter = allChapters[currentChapterIndex];
                loadOriginalToLayer2(chapter.content);
            } else {
                // TOC offen → Zufälliger Abschnitt
                console.log('🎲 Lade zufälligen Abschnitt zu Layer 2');
                loadRandomSectionToLayer2();
            }
            
            switchLayer(2);
        });
    }
    
    // ===== LAYER 2 → LAYER 3 =====
    const compostBg2 = document.getElementById('compost-bg-2');
    if (compostBg2) {
        compostBg2.addEventListener('click', () => {
            if (currentLayer !== 2) return; // Nur wenn Layer 2 aktiv!
            console.log('Click auf Rand (Layer 2) → Layer 3');
            switchLayer(3);
        });
    }
    
    // Click auf generierte Text-Box → Layer 3
    const generatedText = document.getElementById('generated-text');
    if (generatedText) {
        generatedText.addEventListener('click', () => {
            if (currentLayer !== 2) return;
            console.log('✨ Click auf generierte Text-Box → Layer 3');
            
            // Transfer Text zu Layer 3
            const kiInput = document.getElementById('ki-input-text');
            if (kiInput && window.currentBioText) {
                kiInput.value = window.currentBioText;
            }
            
            // Reset Layer 3 UI (zeige Input, verstecke Output)
            const inputBox = document.getElementById('ki-input-box');
            const outputBox = document.getElementById('ki-output-box');
            if (inputBox) {
                inputBox.classList.remove('hidden', 'fade-out');
            }
            if (outputBox) {
                outputBox.classList.add('hidden');
            }
            
            switchLayer(3);
        });
    }
    
    // ===== LAYER 3 → LAYER 4 =====
    const compostBg3 = document.getElementById('compost-bg-3');
    if (compostBg3) {
        compostBg3.addEventListener('click', () => {
            if (currentLayer !== 3) return; // Nur wenn Layer 3 aktiv!
            console.log('Click auf Rand (Layer 3) → Layer 4');
            switchLayer(4);
        });
    }
    
    // Click auf KI-Output-Box → Layer 4
    const kiOutputBox = document.getElementById('ki-output-box');
    if (kiOutputBox) {
        kiOutputBox.addEventListener('click', () => {
            if (currentLayer !== 3) return;
            console.log('✨ Click auf KI-Output-Box → Layer 4');
            switchLayer(4);
        });
    }
    
    // Click auf KI-Output-Box → Layer 4
    const kiOutputClickable = document.getElementById('ki-output-clickable');
    if (kiOutputClickable) {
        kiOutputClickable.addEventListener('click', () => {
            if (currentLayer !== 3) return;
            console.log('✨ Click auf KI-Output-Box → Layer 4');
            switchLayer(4);
        });
    }
});

// Lade Text in Layer 2 (Original-Seite)
function loadOriginalToLayer2(text) {
    const originalDiv = document.getElementById('original-text');
    if (!originalDiv) return;
    
    // Erst doppelte Umbrüche zu Absätzen, dann einzelne zu <br>
    const formatted = text
        .split('\n\n')
        .filter(p => p.trim())
        .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
        .join('');
    
    originalDiv.innerHTML = formatted;
}

// Lade zufälligen Abschnitt
function loadRandomSectionToLayer2() {
    if (!sections || sections.length === 0) {
        console.warn('Sections noch nicht geladen');
        return;
    }
    
    const randomSection = sections[Math.floor(Math.random() * sections.length)];
    loadOriginalToLayer2(randomSection.content);
}

// ESC = Reload
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (confirm('Seite neu laden? (Du verlierst deinen Fortschritt)')) {
            location.reload();
        }
    }
});
