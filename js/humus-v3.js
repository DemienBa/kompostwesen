/* ============================================
   HUMUS-V3.JS - Fließtext + Zersetzung
   Zwei Modi:
   1. Fließtext (lesbar, Standard)
   2. Zersetzt (Canvas mit verstreuten Wörtern)
   ============================================ */

const HumusV3 = {
    // Gesammelte Texte (als Strings)
    texts: [],
    
    // Fragmente für Canvas-Modus
    fragments: [],
    
    // Aktueller Modus
    mode: 'text', // 'text' oder 'canvas'
    
    // Canvas
    canvas: null,
    ctx: null,
    animationId: null,
    
    // Parameter für Zersetzung
    params: {
        wurmaktivitaet: 10,
        verwesung: 5,
        feuchtigkeit: 20,
        dunkelheit: 30
    },
    
    // Text hinzufügen
    addText(text, source = 'bio') {
        this.texts.push({
            content: text,
            source: source,
            timestamp: Date.now()
        });
        
        // In sessionStorage speichern
        this.save();
        
        // UI aktualisieren wenn auf Layer 4
        this.updateTextView();
        
        console.log(`🌱 Text zum Humus hinzugefügt (${source})`);
    },
    
    // Initialisieren
    init() {
        this.canvas = document.getElementById('humus-canvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
        }
        
        // Lade gespeicherte Texte
        this.load();
        
        // UI aktualisieren
        this.updateTextView();
        
        // Parameter-UI erstellen
        this.createParamUI();
        
        // Event Listeners für Buttons
        this.setupButtons();
        
        console.log('🌑 Humus V3 initialisiert');
    },
    
    // Fließtext-Ansicht aktualisieren
    updateTextView() {
        const container = document.getElementById('humus-text-content');
        if (!container) return;
        
        if (this.texts.length === 0) {
            container.innerHTML = '<p class="hint">Noch kein Humus gesammelt...</p>';
            return;
        }
        
        // Alle Texte als Fließtext zusammenfügen
        const fullText = this.texts.map(t => t.content).join('\n\n---\n\n');
        container.innerHTML = `<div class="humus-fliesstext">${fullText.replace(/\n/g, '<br>')}</div>`;
    },
    
    // Ansicht wechseln
    toggleView() {
        const textView = document.getElementById('humus-text-view');
        const canvas = document.getElementById('humus-canvas');
        const toggleBtn = document.getElementById('btn-toggle-view');
        const paramsUI = document.getElementById('humus-params');
        
        if (this.mode === 'text') {
            // Wechsel zu Canvas
            this.mode = 'canvas';
            if (textView) textView.style.display = 'none';
            if (canvas) {
                canvas.style.display = 'block';
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
            if (toggleBtn) toggleBtn.innerHTML = '📖 Lesbar';
            if (paramsUI) paramsUI.style.display = 'block';
            
            // Fragmente aus Texten erstellen
            this.createFragments();
            
            // Animation starten
            this.startAnimation();
        } else {
            // Wechsel zu Text
            this.mode = 'text';
            if (textView) textView.style.display = 'block';
            if (canvas) canvas.style.display = 'none';
            if (toggleBtn) toggleBtn.innerHTML = '🔀 Zersetzen';
            if (paramsUI) paramsUI.style.display = 'none';
            
            // Animation stoppen
            this.stopAnimation();
        }
    },
    
    // Fragmente aus Texten erstellen
    createFragments() {
        this.fragments = [];
        
        this.texts.forEach((textObj, textIndex) => {
            const words = textObj.content.split(/\s+/);
            const startY = 10 + (textIndex % 10) * 8;
            
            words.forEach((word, index) => {
                if (word.trim()) {
                    this.fragments.push({
                        word: word,
                        source: textObj.source,
                        age: 0,
                        x: 5 + (index % 12) * 7.5,
                        y: startY + Math.floor(index / 12) * 5,
                        vx: 0,
                        vy: 0,
                        opacity: 1,
                        size: 14,
                        rotation: 0
                    });
                }
            });
        });
        
        // Limitiere auf 500 Fragmente
        if (this.fragments.length > 500) {
            this.fragments = this.fragments.slice(-500);
        }
    },
    
    // Animation starten
    startAnimation() {
        if (this.animationId) return;
        this.animate();
    },
    
    // Animation stoppen
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },
    
    // Animation Loop
    animate() {
        if (!this.ctx || this.mode !== 'canvas') return;
        
        // Hintergrund
        const darkness = this.params.dunkelheit / 100;
        const bgR = Math.floor(40 - darkness * 35);
        const bgG = Math.floor(35 - darkness * 30);
        const bgB = Math.floor(30 - darkness * 25);
        this.ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Feuchtigkeit = Blur-Effekt
        if (this.params.feuchtigkeit > 30) {
            this.ctx.filter = `blur(${(this.params.feuchtigkeit - 30) / 25}px)`;
        } else {
            this.ctx.filter = 'none';
        }
        
        // Fragmente zeichnen
        this.fragments.forEach((frag) => {
            // Verwesung = Alterung
            const verwesungsFaktor = this.params.verwesung / 100;
            frag.age += 0.001 * verwesungsFaktor;
            
            // Bewegung
            const wurmFaktor = this.params.wurmaktivitaet / 100;
            if (wurmFaktor > 0.1) {
                frag.vx += (Math.random() - 0.5) * wurmFaktor * 0.1;
                frag.vy += (Math.random() - 0.5) * wurmFaktor * 0.1;
                frag.vx *= 0.98;
                frag.vy *= 0.98;
                frag.x += frag.vx;
                frag.y += frag.vy;
            }
            
            // Feuchtigkeit = mehr Drift nach unten
            if (this.params.feuchtigkeit > 50) {
                frag.vy += 0.01 * (this.params.feuchtigkeit - 50) / 50;
            }
            
            // Grenzen
            if (frag.x < 2) frag.vx += 0.1;
            if (frag.x > 98) frag.vx -= 0.1;
            if (frag.y < 2) frag.vy += 0.1;
            if (frag.y > 98) frag.vy -= 0.1;
            
            // Rotation - verstärkt durch Verwesung
            if (wurmFaktor > 0.3 || verwesungsFaktor > 0.5) {
                frag.rotation += (Math.random() - 0.5) * (wurmFaktor + verwesungsFaktor) * 2;
            }
            
            // Opacity sinkt mit Verwesung
            frag.opacity = Math.max(0.2, 1 - frag.age * 2);
            
            // Farbe - wird brauner mit Verwesung
            let color;
            const ageEffect = Math.min(frag.age * 3, 1);
            if (frag.source === 'bio') {
                const r = Math.floor(80 + ageEffect * 40);
                const g = Math.floor(140 - ageEffect * 80);
                const b = Math.floor(60 - ageEffect * 30);
                color = `rgba(${r}, ${g}, ${b}, ${frag.opacity})`;
            } else {
                const r = Math.floor(80 + ageEffect * 30);
                const g = Math.floor(100 - ageEffect * 40);
                const b = Math.floor(160 - ageEffect * 80);
                color = `rgba(${r}, ${g}, ${b}, ${frag.opacity})`;
            }
            
            // Schriftgröße schrumpft mit Verwesung
            const size = Math.max(8, frag.size - frag.age * 10);
            
            // Zeichnen
            const x = (frag.x / 100) * this.canvas.width;
            const y = (frag.y / 100) * this.canvas.height;
            
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(frag.rotation * Math.PI / 180);
            this.ctx.fillStyle = color;
            this.ctx.font = `${size}px Georgia`;
            this.ctx.fillText(frag.word, 0, 0);
            this.ctx.restore();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    },
    
    // Parameter UI erstellen
    createParamUI() {
        if (document.getElementById('humus-params')) return;
        
        const ui = document.createElement('div');
        ui.id = 'humus-params';
        ui.className = 'humus-params';
        ui.style.display = 'none'; // Versteckt bis Canvas-Modus
        ui.innerHTML = `
            <h3>🌑 Zersetzung</h3>
            
            <div class="humus-param">
                <label>🪱 Wurmaktivität</label>
                <input type="range" id="param-wurm" min="0" max="100" value="10">
            </div>
            
            <div class="humus-param">
                <label>💀 Verwesung</label>
                <input type="range" id="param-verwesung" min="0" max="100" value="5">
            </div>
            
            <div class="humus-param">
                <label>💧 Feuchtigkeit</label>
                <input type="range" id="param-feucht" min="0" max="100" value="20">
            </div>
            
            <div class="humus-param">
                <label>🌑 Dunkelheit</label>
                <input type="range" id="param-dunkel" min="0" max="100" value="30">
            </div>
        `;
        
        const layer4 = document.getElementById('layer4');
        if (layer4) {
            layer4.appendChild(ui);
        }
        
        // Event Listeners
        this.setupParamListeners();
    },
    
    setupParamListeners() {
        const self = this;
        
        const wurmSlider = document.getElementById('param-wurm');
        if (wurmSlider) {
            wurmSlider.addEventListener('input', (e) => {
                self.params.wurmaktivitaet = parseInt(e.target.value);
            });
        }
        
        const verwesungSlider = document.getElementById('param-verwesung');
        if (verwesungSlider) {
            verwesungSlider.addEventListener('input', (e) => {
                self.params.verwesung = parseInt(e.target.value);
            });
        }
        
        const feuchtSlider = document.getElementById('param-feucht');
        if (feuchtSlider) {
            feuchtSlider.addEventListener('input', (e) => {
                self.params.feuchtigkeit = parseInt(e.target.value);
            });
        }
        
        const dunkelSlider = document.getElementById('param-dunkel');
        if (dunkelSlider) {
            dunkelSlider.addEventListener('input', (e) => {
                self.params.dunkelheit = parseInt(e.target.value);
            });
        }
    },
    
    // Buttons Setup
    setupButtons() {
        const toggleBtn = document.getElementById('btn-toggle-view');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleView());
        }
        
        const exportBtn = document.getElementById('btn-export-humus');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.copyToClipboard());
        }
        
        const shareBtn = document.getElementById('btn-share-humus');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.share());
        }
    },
    
    // In Zwischenablage kopieren
    copyToClipboard() {
        if (this.texts.length === 0) {
            alert('Kein Humus zum Kopieren!');
            return;
        }
        
        const fullText = this.texts.map(t => t.content).join('\n\n---\n\n');
        
        navigator.clipboard.writeText(fullText).then(() => {
            alert('✅ Humus in Zwischenablage kopiert!');
        }).catch(err => {
            console.error('Kopieren fehlgeschlagen:', err);
            // Fallback
            this.fallbackCopy(fullText);
        });
    },
    
    // Fallback für Kopieren
    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('✅ Humus kopiert!');
    },
    
    // Teilen (Web Share API)
    share() {
        if (this.texts.length === 0) {
            alert('Kein Humus zum Teilen!');
            return;
        }
        
        const fullText = this.texts.map(t => t.content).join('\n\n---\n\n');
        
        if (navigator.share) {
            navigator.share({
                title: 'Mein Kompost-Humus',
                text: fullText.substring(0, 500) + (fullText.length > 500 ? '...' : ''),
                url: window.location.href
            }).catch(err => {
                console.log('Teilen abgebrochen:', err);
            });
        } else {
            // Fallback: Kopieren
            this.copyToClipboard();
        }
    },
    
    // Speichern in sessionStorage
    save() {
        try {
            sessionStorage.setItem('humus-texts', JSON.stringify(this.texts));
        } catch (e) {
            console.warn('Humus speichern fehlgeschlagen:', e);
        }
    },
    
    // Laden aus sessionStorage
    load() {
        try {
            const saved = sessionStorage.getItem('humus-texts');
            if (saved) {
                this.texts = JSON.parse(saved);
                console.log(`📦 ${this.texts.length} Texte aus Humus geladen`);
            }
        } catch (e) {
            console.warn('Humus laden fehlgeschlagen:', e);
        }
    },
    
    // Export als TXT
    exportTxt() {
        if (this.texts.length === 0) {
            alert('Kein Humus zum Exportieren!');
            return;
        }
        
        const fullText = this.texts.map(t => t.content).join('\n\n---\n\n');
        const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kompost-humus.txt';
        a.click();
        
        URL.revokeObjectURL(url);
    }
};

// Styles
const humusV3Styles = document.createElement('style');
humusV3Styles.textContent = `
    .humus-text-view {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: auto;
        padding: 40px;
        background: linear-gradient(160deg, rgba(30, 25, 20, 0.98), rgba(20, 18, 15, 0.95));
    }
    
    .humus-text-content {
        max-width: 800px;
        margin: 0 auto;
        color: #c0a080;
        font-size: 1.1em;
        line-height: 1.8;
    }
    
    .humus-fliesstext {
        white-space: pre-wrap;
    }
    
    .humus-text-content .hint {
        text-align: center;
        color: #666;
        font-style: italic;
    }
    
    .humus-buttons {
        position: fixed;
        bottom: 20px;
        left: 20px;
        display: flex;
        gap: 10px;
        z-index: 100;
    }
    
    .btn-humus-action {
        padding: 12px 18px;
        background: linear-gradient(135deg, rgba(80, 60, 40, 0.9), rgba(60, 45, 30, 0.9));
        border: 1px solid rgba(160, 128, 96, 0.5);
        border-radius: 8px;
        color: #d4c4a0;
        cursor: pointer;
        font-size: 0.9em;
        transition: all 0.3s;
    }
    
    .btn-humus-action:hover {
        background: linear-gradient(135deg, rgba(100, 80, 50, 0.9), rgba(80, 60, 40, 0.9));
        border-color: #a08060;
        transform: translateY(-2px);
    }
    
    .humus-params {
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        background: linear-gradient(160deg, rgba(30, 25, 20, 0.95), rgba(40, 35, 25, 0.9));
        border: 2px solid rgba(100, 80, 50, 0.5);
        border-radius: 15px;
        padding: 20px;
        width: 220px;
        z-index: 100;
    }
    
    .humus-params h3 {
        color: #a08060;
        margin-bottom: 15px;
        text-align: center;
        font-size: 1.1em;
    }
    
    .humus-param {
        margin-bottom: 12px;
    }
    
    .humus-param label {
        display: block;
        color: #c0a080;
        font-size: 0.85em;
        margin-bottom: 5px;
    }
    
    .humus-param input[type="range"] {
        width: 100%;
        accent-color: #a08060;
    }
    
    @media (max-width: 768px) {
        .humus-text-view {
            padding: 20px;
            padding-bottom: 100px;
        }
        
        .humus-text-content {
            font-size: 1em;
        }
        
        .humus-buttons {
            bottom: 15px;
            left: 10px;
            right: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn-humus-action {
            padding: 10px 14px;
            font-size: 0.85em;
        }
        
        .humus-params {
            top: auto;
            bottom: 80px;
            left: 10px;
            right: auto;
            transform: none;
            width: 180px;
            padding: 12px;
            max-height: 40vh;
            overflow-y: auto;
        }
        
        .humus-params h3 {
            font-size: 0.95em;
        }
        
        .humus-param label {
            font-size: 0.8em;
        }
    }
`;
document.head.appendChild(humusV3Styles);

// Integration
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('layerchange', (e) => {
        if (e.detail.layer === 4) {
            HumusV3.init();
        }
    });
});

// Global function for adding text
window.addToHumus = function(text, source = 'bio') {
    HumusV3.addText(text, source);
};

// Export
window.HumusV3 = HumusV3;
