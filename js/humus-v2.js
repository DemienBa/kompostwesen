/* ============================================
   HUMUS-V2.JS - Vermischte Masse
   Alle Texte werden zu einer dunklen,
   organischen Masse aus Fragmenten
   ============================================ */

const HumusV2 = {
    // Alle gesammelten Text-Fragmente
    fragments: [],
    
    // Canvas
    canvas: null,
    ctx: null,
    
    // Absurde Parameter - STARTEN NIEDRIG/STABIL
    params: {
        mondphase: 0.5,          // 0-1 (Neumond bis Vollmond)
        wurmaktivitaet: 10,      // 0-100 (START: sehr ruhig)
        geruchsintensitaet: 0,   // 0-100 (START: kein Geruch)
        philosophischeTiefe: 2,  // 1=flach, 2=mittel, 3=Hegel
        regenwuermer: 0,         // Anzahl (START: keine)
        verwesung: 5,            // 0-100 (START: fast keine Verwesung)
        feuchtigkeit: 20,        // 0-100 (START: trocken)
        dunkelheit: 30           // 0-100 (START: hell genug zum Lesen)
    },
    
    // Text hinzufügen
    addText(text, source = 'bio') {
        // Text in Fragmente zerlegen
        const words = text.split(/\s+/);
        const timestamp = Date.now();
        
        // Startposition: verteilt, aber geordnet
        const startY = 10 + (this.fragments.length % 10) * 8;
        
        words.forEach((word, index) => {
            if (word.trim()) {
                this.fragments.push({
                    word: word,
                    source: source,
                    age: 0,
                    x: 5 + (index % 12) * 7.5,
                    y: startY + Math.floor(index / 12) * 5,
                    vx: 0, // START: keine Bewegung
                    vy: 0,
                    opacity: 1,
                    size: 14, // Gut lesbar
                    rotation: 0, // START: nicht rotiert
                    timestamp: timestamp
                });
            }
        });
        
        // Limitiere auf max 500 Fragmente (älteste entfernen)
        while (this.fragments.length > 500) {
            this.fragments.shift();
        }
        
        // In sessionStorage speichern
        this.save();
        
        console.log(`🌱 ${words.length} Wörter zum Humus hinzugefügt (${source})`);
    },
    
    // Initialisieren
    init() {
        this.canvas = document.getElementById('humus-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Lade gespeicherte Fragmente
        this.load();
        
        // Starte Animation
        this.animate();
        
        // Parameter-UI erstellen
        this.createParamUI();
        
        console.log('🌑 Humus V2 initialisiert');
    },
    
    // Animation Loop
    animate() {
        if (!this.ctx) return;
        
        // Hintergrund (abhängig von Dunkelheit)
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
        
        // Fragmente aktualisieren und zeichnen
        this.fragments.forEach((frag, index) => {
            // Alterung - SEHR LANGSAM, abhängig von Verwesung
            const verwesungsFaktor = this.params.verwesung / 100;
            frag.age += 0.0001 * verwesungsFaktor;
            
            // Bewegung - abhängig von Wurmaktivität
            const wurmFaktor = this.params.wurmaktivitaet / 100;
            
            // Bei niedriger Wurmaktivität: fast keine Bewegung
            if (wurmFaktor > 0.1) {
                frag.vx += (Math.random() - 0.5) * wurmFaktor * 0.1;
                frag.vy += (Math.random() - 0.5) * wurmFaktor * 0.1;
                
                // Dämpfung
                frag.vx *= 0.98;
                frag.vy *= 0.98;
                
                frag.x += frag.vx;
                frag.y += frag.vy;
            }
            
            // Mondphase beeinflusst vertikale Drift
            if (this.params.mondphase > 0.7) {
                frag.vy -= 0.01; // Vollmond: Fragmente steigen
            } else if (this.params.mondphase < 0.3) {
                frag.vy += 0.01; // Neumond: Fragmente sinken
            }
            
            // Grenzen (sanftes Zurückführen)
            if (frag.x < 2) frag.vx += 0.1;
            if (frag.x > 98) frag.vx -= 0.1;
            if (frag.y < 2) frag.vy += 0.1;
            if (frag.y > 98) frag.vy -= 0.1;
            
            // Rotation - nur bei hoher Wurmaktivität
            if (wurmFaktor > 0.3) {
                frag.rotation += (Math.random() - 0.5) * wurmFaktor * 2;
            }
            
            // Opacity - sinkt nur bei Verwesung
            frag.opacity = Math.max(0.3, 1 - frag.age * 2);
            
            // Farbe basierend auf Quelle und Alter
            let color;
            const ageEffect = Math.min(frag.age * 3, 1); // Langsamer Farbwechsel
            
            if (frag.source === 'bio') {
                // Grün → Braun (langsam)
                const r = Math.floor(40 + ageEffect * 60);
                const g = Math.floor(120 - ageEffect * 70);
                const b = Math.floor(40);
                color = `rgba(${r}, ${g}, ${b}, ${frag.opacity})`;
            } else {
                // Blau → Lila (langsam)
                const r = Math.floor(60 + ageEffect * 50);
                const g = Math.floor(60);
                const b = Math.floor(150 - ageEffect * 80);
                color = `rgba(${r}, ${g}, ${b}, ${frag.opacity})`;
            }
            
            // Zeichnen
            const x = (frag.x / 100) * this.canvas.width;
            const y = (frag.y / 100) * this.canvas.height;
            
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(frag.rotation * Math.PI / 180);
            this.ctx.fillStyle = color;
            this.ctx.font = `${frag.size}px Georgia`;
            
            // Verzerren NUR bei hoher Verwesung
            if (this.params.verwesung > 60 && frag.age > 0.3 && Math.random() > 0.95) {
                const corrupted = frag.word.replace(/[aeiou]/gi, () => 
                    ['░', '▒', '▓'][Math.floor(Math.random() * 3)]
                );
                this.ctx.fillText(corrupted, 0, 0);
            } else {
                this.ctx.fillText(frag.word, 0, 0);
            }
            
            this.ctx.restore();
        });
        
        // Reset filter für nächste Elemente
        this.ctx.filter = 'none';
        
        // Regenwürmer-Effekt - NUR wenn Parameter > 0
        if (this.params.regenwuermer > 0) {
            const numWorms = Math.min(this.params.regenwuermer, 50);
            this.ctx.strokeStyle = `rgba(80, 60, 40, ${0.1 + this.params.regenwuermer / 200})`;
            this.ctx.lineWidth = 1 + this.params.regenwuermer / 50;
            
            for (let i = 0; i < Math.floor(numWorms / 5); i++) {
                this.ctx.beginPath();
                const startX = Math.random() * this.canvas.width;
                const startY = Math.random() * this.canvas.height;
                this.ctx.moveTo(startX, startY);
                
                for (let j = 0; j < 5; j++) {
                    this.ctx.lineTo(
                        startX + (Math.random() - 0.5) * 80,
                        startY + j * 15 + Math.random() * 10
                    );
                }
                this.ctx.stroke();
            }
        }
        
        // Geruchs-Effekt (neblige Overlay) - NUR bei hohem Geruch
        if (this.params.geruchsintensitaet > 30) {
            const geruch = (this.params.geruchsintensitaet - 30) / 100;
            this.ctx.fillStyle = `rgba(60, 50, 30, ${geruch * 0.3})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Feuchtigkeit - Tropfen-Effekt bei sehr hoher Feuchtigkeit
        if (this.params.feuchtigkeit > 70) {
            const numDrops = Math.floor((this.params.feuchtigkeit - 70) / 5);
            this.ctx.fillStyle = 'rgba(100, 120, 140, 0.3)';
            for (let i = 0; i < numDrops; i++) {
                const dx = Math.random() * this.canvas.width;
                const dy = Math.random() * this.canvas.height;
                this.ctx.beginPath();
                this.ctx.arc(dx, dy, 2 + Math.random() * 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        // Nächster Frame
        requestAnimationFrame(() => this.animate());
    },
    
    // Parameter UI erstellen
    createParamUI() {
        // Prüfe ob UI schon existiert
        if (document.getElementById('humus-params')) return;
        
        const ui = document.createElement('div');
        ui.id = 'humus-params';
        ui.className = 'humus-params';
        ui.innerHTML = `
            <h3>🌑 Humus-Parameter</h3>
            
            <div class="humus-param">
                <label>🌙 Mondphase</label>
                <input type="range" id="param-mond" min="0" max="100" value="50">
                <span class="param-label">Halbmond</span>
            </div>
            
            <div class="humus-param">
                <label>🪱 Wurmaktivität</label>
                <input type="range" id="param-wurm" min="0" max="100" value="10">
                <span class="param-label">ruhig</span>
            </div>
            
            <div class="humus-param">
                <label>👃 Geruchsintensität</label>
                <input type="range" id="param-geruch" min="0" max="100" value="0">
                <span class="param-label">geruchlos</span>
            </div>
            
            <div class="humus-param">
                <label>🧠 Philosophische Tiefe</label>
                <select id="param-philo">
                    <option value="1">Flach</option>
                    <option value="2" selected>Mittel</option>
                    <option value="3">Hegel</option>
                </select>
            </div>
            
            <div class="humus-param">
                <label>🐛 Regenwürmer</label>
                <input type="number" id="param-wuermer" min="0" max="999" value="0">
            </div>
            
            <div class="humus-param">
                <label>💀 Verwesung</label>
                <input type="range" id="param-verwesung" min="0" max="100" value="5">
                <span class="param-label">frisch</span>
            </div>
            
            <div class="humus-param">
                <label>💧 Feuchtigkeit</label>
                <input type="range" id="param-feucht" min="0" max="100" value="20">
                <span class="param-label">trocken</span>
            </div>
            
            <div class="humus-param">
                <label>🌑 Dunkelheit</label>
                <input type="range" id="param-dunkel" min="0" max="100" value="30">
                <span class="param-label">hell</span>
            </div>
            
            <div class="humus-stats">
                <span>Fragmente: <strong id="frag-count">0</strong></span>
            </div>
        `;
        
        // In Layer 4 einfügen
        const layer4 = document.getElementById('layer4');
        if (layer4) {
            layer4.appendChild(ui);
        }
        
        // Event Listeners
        this.setupParamListeners();
    },
    
    setupParamListeners() {
        const self = this;
        
        // Mondphase
        const mondSlider = document.getElementById('param-mond');
        if (mondSlider) {
            mondSlider.addEventListener('input', (e) => {
                self.params.mondphase = e.target.value / 100;
                const label = e.target.nextElementSibling;
                if (self.params.mondphase < 0.25) label.textContent = '🌑 Neumond';
                else if (self.params.mondphase < 0.5) label.textContent = '🌒 zunehmend';
                else if (self.params.mondphase < 0.75) label.textContent = '🌕 Vollmond';
                else label.textContent = '🌘 abnehmend';
            });
        }
        
        // Wurmaktivität
        const wurmSlider = document.getElementById('param-wurm');
        if (wurmSlider) {
            wurmSlider.addEventListener('input', (e) => {
                self.params.wurmaktivitaet = parseInt(e.target.value);
                const label = e.target.nextElementSibling;
                if (self.params.wurmaktivitaet < 20) label.textContent = 'ruhig';
                else if (self.params.wurmaktivitaet < 50) label.textContent = 'aktiv';
                else if (self.params.wurmaktivitaet < 80) label.textContent = 'sehr aktiv';
                else label.textContent = 'CHAOS!';
            });
        }
        
        // Geruch
        const geruchSlider = document.getElementById('param-geruch');
        if (geruchSlider) {
            geruchSlider.addEventListener('input', (e) => {
                self.params.geruchsintensitaet = parseInt(e.target.value);
                const label = e.target.nextElementSibling;
                if (self.params.geruchsintensitaet < 20) label.textContent = 'geruchlos';
                else if (self.params.geruchsintensitaet < 50) label.textContent = 'erdig';
                else if (self.params.geruchsintensitaet < 80) label.textContent = 'streng';
                else label.textContent = '🤢 bestialisch';
            });
        }
        
        // Philosophie
        const philoSelect = document.getElementById('param-philo');
        if (philoSelect) {
            philoSelect.addEventListener('change', (e) => {
                self.params.philosophischeTiefe = parseInt(e.target.value);
                if (self.params.philosophischeTiefe === 3) {
                    console.log('🧠 "Das Wahre ist das Ganze" - Hegel');
                }
            });
        }
        
        // Regenwürmer
        const wuermerInput = document.getElementById('param-wuermer');
        if (wuermerInput) {
            wuermerInput.addEventListener('input', (e) => {
                self.params.regenwuermer = parseInt(e.target.value) || 0;
            });
        }
        
        // Verwesung
        const verwesungSlider = document.getElementById('param-verwesung');
        if (verwesungSlider) {
            verwesungSlider.addEventListener('input', (e) => {
                self.params.verwesung = parseInt(e.target.value);
                const label = e.target.nextElementSibling;
                if (self.params.verwesung < 20) label.textContent = 'frisch';
                else if (self.params.verwesung < 50) label.textContent = 'zersetzend';
                else if (self.params.verwesung < 80) label.textContent = 'verrottet';
                else label.textContent = '💀 Skelett';
            });
        }
        
        // Feuchtigkeit
        const feuchtSlider = document.getElementById('param-feucht');
        if (feuchtSlider) {
            feuchtSlider.addEventListener('input', (e) => {
                self.params.feuchtigkeit = parseInt(e.target.value);
                const label = e.target.nextElementSibling;
                if (self.params.feuchtigkeit < 30) label.textContent = 'trocken';
                else if (self.params.feuchtigkeit < 60) label.textContent = 'feucht';
                else if (self.params.feuchtigkeit < 85) label.textContent = 'nass';
                else label.textContent = '🌊 überflutet';
            });
        }
        
        // Dunkelheit
        const dunkelSlider = document.getElementById('param-dunkel');
        if (dunkelSlider) {
            dunkelSlider.addEventListener('input', (e) => {
                self.params.dunkelheit = parseInt(e.target.value);
                const label = e.target.nextElementSibling;
                if (self.params.dunkelheit < 30) label.textContent = 'hell';
                else if (self.params.dunkelheit < 60) label.textContent = 'dämmrig';
                else if (self.params.dunkelheit < 85) label.textContent = 'dunkel';
                else label.textContent = '⬛ finster';
            });
        }
        
        // Update Fragment-Count regelmäßig
        setInterval(() => {
            const countEl = document.getElementById('frag-count');
            if (countEl) countEl.textContent = self.fragments.length;
        }, 1000);
    },
    
    // Export als TXT (nur Fragmente, vermischt)
    export() {
        if (this.fragments.length === 0) {
            alert('Kein Humus zum Exportieren!');
            return;
        }
        
        // Fragmente zufällig mischen
        const shuffled = [...this.fragments].sort(() => Math.random() - 0.5);
        
        // Basierend auf Philosophie-Level formatieren
        let output = '';
        
        if (this.params.philosophischeTiefe === 1) {
            // Flach: Nur Wörter
            output = shuffled.map(f => f.word).join(' ');
        } else if (this.params.philosophischeTiefe === 2) {
            // Mittel: Mit gelegentlichen Umbrüchen
            shuffled.forEach((f, i) => {
                output += f.word;
                if (i % 7 === 6) output += '\n';
                else output += ' ';
            });
        } else {
            // Hegel: Komplexe Struktur
            output = '═══════════════════════════════════════════════\n';
            output += '  DAS KOMPOSTWESEN - HUMUS-EXPORT\n';
            output += '  "Das Wahre ist das Ganze"\n';
            output += '═══════════════════════════════════════════════\n\n';
            
            output += `Mondphase: ${this.params.mondphase < 0.5 ? 'Dunkel' : 'Hell'}\n`;
            output += `Regenwürmer: ${this.params.regenwuermer}\n`;
            output += `Verwesung: ${this.params.verwesung}%\n\n`;
            
            output += '───────────────────────────────────────────────\n';
            output += '  FRAGMENTE DER ZERSETZUNG\n';
            output += '───────────────────────────────────────────────\n\n';
            
            shuffled.forEach((f, i) => {
                output += f.word;
                if (i % 5 === 4) output += '\n';
                else if (i % 13 === 12) output += '\n\n';
                else output += ' ';
            });
            
            output += '\n\n═══════════════════════════════════════════════\n';
            output += '  ENDE DES HUMUS\n';
            output += '═══════════════════════════════════════════════\n';
        }
        
        // Download
        const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `humus-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('📥 Humus exportiert');
    },
    
    // In sessionStorage speichern
    save() {
        try {
            const toSave = this.fragments.slice(-200);
            sessionStorage.setItem('humusV2', JSON.stringify(toSave));
        } catch (e) {
            console.warn('Humus konnte nicht gespeichert werden:', e);
        }
    },
    
    // Aus sessionStorage laden
    load() {
        try {
            const saved = sessionStorage.getItem('humusV2');
            if (saved) {
                this.fragments = JSON.parse(saved);
                console.log(`🌱 ${this.fragments.length} Fragmente geladen`);
            }
        } catch (e) {
            console.warn('Humus konnte nicht geladen werden:', e);
        }
    },
    
    // Alles löschen
    clear() {
        this.fragments = [];
        sessionStorage.removeItem('humusV2');
        console.log('🗑️ Humus geleert');
    }
};

// CSS für Humus Parameter UI
const humusStyles = document.createElement('style');
humusStyles.textContent = `
    .humus-params {
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        background: linear-gradient(160deg, rgba(30, 25, 20, 0.95), rgba(40, 35, 25, 0.9));
        border: 2px solid rgba(100, 80, 50, 0.5);
        border-radius: 15px;
        padding: 20px;
        width: 250px;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 100;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }
    
    .humus-params h3 {
        color: #a08060;
        margin-bottom: 15px;
        text-align: center;
        font-size: 1.2em;
    }
    
    .humus-param {
        margin-bottom: 15px;
    }
    
    .humus-param label {
        display: block;
        color: #c0a080;
        font-size: 0.9em;
        margin-bottom: 5px;
    }
    
    .humus-param input[type="range"] {
        width: 100%;
        accent-color: #a08060;
    }
    
    .humus-param input[type="number"] {
        width: 80px;
        padding: 5px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid #8b7355;
        border-radius: 5px;
        color: #d4c4a0;
    }
    
    .humus-param select {
        width: 100%;
        padding: 8px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid #8b7355;
        border-radius: 5px;
        color: #d4c4a0;
    }
    
    .humus-param .param-label {
        display: block;
        text-align: center;
        color: #888;
        font-size: 0.8em;
        margin-top: 3px;
    }
    
    .humus-stats {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid rgba(100, 80, 50, 0.3);
        color: #888;
        font-size: 0.85em;
        text-align: center;
    }
    
    .humus-stats strong {
        color: #a08060;
    }
    
    @media (max-width: 768px) {
        .humus-params {
            position: fixed;
            top: auto;
            bottom: 10px;
            right: 10px;
            left: auto;
            transform: none;
            width: 200px;
            max-height: 35vh;
            padding: 10px;
            font-size: 0.85em;
            opacity: 0.9;
        }
        
        .humus-params h3 {
            font-size: 1em;
            margin-bottom: 10px;
        }
        
        .humus-param {
            margin-bottom: 8px;
        }
        
        .humus-param label {
            font-size: 0.8em;
        }
    }
`;
document.head.appendChild(humusStyles);

// Integration
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('layerchange', (e) => {
        if (e.detail.layer === 4) {
            HumusV2.init();
        }
    });
    
    const exportBtn = document.getElementById('btn-export-humus');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => HumusV2.export());
    }
});

window.addToHumus = function(text, source = 'bio') {
    HumusV2.addText(text, source);
};
