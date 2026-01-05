// HUMUS-SYSTEM
// Verwaltet gespeicherte Texte aus Layer 2-4

const HumusManager = {
    maxEntries: 20,
    
    colors: {
        bio: '#2ecc71',      // Grün - Bio-Zersetzung (Layer 2)
        ki: '#3498db',       // Blau - KI-Transformation (Layer 3)
        mutation: '#f39c12'  // Gelb - Mutiert (Layer 4)
    },
    
    // Initialisierung
    init() {
        if (!sessionStorage.getItem('humus')) {
            sessionStorage.setItem('humus', JSON.stringify([]));
        }
    },
    
    // Humus-Eintrag hinzufügen
    add(content, type, metadata = {}) {
        const entries = this.getAll();
        
        // Max 20 Einträge
        if (entries.length >= this.maxEntries) {
            console.warn('Humus voll! Max 20 Einträge erreicht.');
            return false;
        }
        
        const entry = {
            id: Date.now(),
            content: content,
            type: type, // 'bio', 'ki', 'mutation'
            color: this.colors[type],
            timestamp: new Date().toISOString(),
            wordCount: content.split(/\s+/).length,
            metadata: metadata
        };
        
        entries.push(entry);
        sessionStorage.setItem('humus', JSON.stringify(entries));
        
        console.log(`✅ Humus gespeichert (${type}): ${entry.wordCount} Wörter`);
        return entry;
    },
    
    // Alle Einträge abrufen
    getAll() {
        const data = sessionStorage.getItem('humus');
        return data ? JSON.parse(data) : [];
    },
    
    // Nach ID abrufen
    getById(id) {
        return this.getAll().find(entry => entry.id === id);
    },
    
    // Nach Typ filtern
    getByType(type) {
        return this.getAll().filter(entry => entry.type === type);
    },
    
    // Anzahl
    count() {
        return this.getAll().length;
    },
    
    // Ist voll?
    isFull() {
        return this.count() >= this.maxEntries;
    },
    
    // Verbleibende Slots
    remaining() {
        return this.maxEntries - this.count();
    },
    
    // Als TXT exportieren
    exportAsTxt() {
        const entries = this.getAll();
        
        if (entries.length === 0) {
            alert('Kein Humus zum Exportieren!');
            return;
        }
        
        let txtContent = '═══════════════════════════════════════════════\n';
        txtContent += '  DAS KOMPOSTWESEN - HUMUS-EXPORT\n';
        txtContent += '═══════════════════════════════════════════════\n\n';
        txtContent += `Exportiert: ${new Date().toLocaleString('de-DE')}\n`;
        txtContent += `Einträge: ${entries.length}\n\n`;
        
        entries.forEach((entry, index) => {
            txtContent += '───────────────────────────────────────────────\n';
            txtContent += `EINTRAG ${index + 1} / ${entries.length}\n`;
            txtContent += '───────────────────────────────────────────────\n';
            txtContent += `Typ: ${entry.type.toUpperCase()}\n`;
            txtContent += `Zeitstempel: ${new Date(entry.timestamp).toLocaleString('de-DE')}\n`;
            txtContent += `Wörter: ${entry.wordCount}\n`;
            txtContent += `Farbe: ${entry.color}\n`;
            txtContent += '\n';
            txtContent += entry.content;
            txtContent += '\n\n';
        });
        
        txtContent += '═══════════════════════════════════════════════\n';
        txtContent += 'ENDE DES HUMUS\n';
        txtContent += '═══════════════════════════════════════════════\n';
        return txtContent;
        
    },
    
    // Statistik
    getStats() {
        const entries = this.getAll();
        const stats = {
            total: entries.length,
            bio: entries.filter(e => e.type === 'bio').length,
            ki: entries.filter(e => e.type === 'ki').length,
            mutation: entries.filter(e => e.type === 'mutation').length,
            totalWords: entries.reduce((sum, e) => sum + e.wordCount, 0),
            remaining: this.remaining()
        };
        return stats;
    }
};

// Bei Seiten-Load initialisieren
document.addEventListener('DOMContentLoaded', () => {
    HumusManager.init();
    console.log('🌱 Humus-System initialisiert');
    console.log(`   Einträge: ${HumusManager.count()} / ${HumusManager.maxEntries}`);
});
