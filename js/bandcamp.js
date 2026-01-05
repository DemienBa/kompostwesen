/* ============================================
   BANDCAMP.JS - Musik-Player
   Erscheint wenn man auf Kompost klickt
   Dropdown mit zufälliger Album-Reihenfolge
   ============================================ */

const BandcampPlayer = {
    albums: [
        { 
            name: 'Instrumentalstücke #2', 
            id: '3500351861',
            color: '2ebd35'
        },
        { 
            name: 'Instrumentalstücke #1', 
            id: '389275995',
            color: '9a64ff'
        },
        { 
            name: 'Am Piano II', 
            id: '652625651',
            color: '0f91ff'
        },
        { 
            name: 'Am Piano I', 
            id: '229542115',
            color: '0f91ff'
        },
        { 
            name: 'Die Sackgasse der Blumen', 
            id: '3141639375',
            color: '0f91ff'
        },
        { 
            name: 'Hausfriedensbruch', 
            id: '3128292872',
            color: '0687f5'
        },
        { 
            name: 'Frühjahrsoffensive', 
            id: '1372974709',
            color: '2ebd35'
        },
        { 
            name: 'the center is hot', 
            id: '539703586',
            color: 'e32c14'
        },
        { 
            name: 'Das Jahr in der Pfütze', 
            id: '3907812153',
            color: 'e99708'
        },
        { 
            name: 'Erfurter Löcher', 
            id: '2983027336',
            color: '63b2cc'
        },
        { 
            name: 'Nervenlichter', 
            id: '2936287785',
            color: 'e99708'
        }
    ],
    
    isVisible: false,
    isPlaying: false,
    currentAlbumId: null,
    
    // Zufällige Reihenfolge
    shuffleAlbums() {
        const shuffled = [...this.albums];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    // Player erstellen
    createPlayer() {
        if (document.getElementById('bandcamp-container')) return;
        
        const container = document.createElement('div');
        container.id = 'bandcamp-container';
        container.className = 'bandcamp-container';
        container.innerHTML = `
            <div class="bandcamp-header">
                <span>🎵 Musik von Demien Bartók</span>
                <button id="bandcamp-close" class="bandcamp-close">✕</button>
            </div>
            <select id="album-select">
                <option value="">-- Album wählen --</option>
            </select>
            <div id="bandcamp-player-wrapper"></div>
        `;
        
        document.body.appendChild(container);
        
        // Dropdown füllen (zufällige Reihenfolge!)
        const select = document.getElementById('album-select');
        const shuffled = this.shuffleAlbums();
        shuffled.forEach(album => {
            const option = document.createElement('option');
            option.value = album.id;
            option.textContent = album.name;
            option.dataset.color = album.color;
            select.appendChild(option);
        });
        
        // Event Listeners
        select.addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadAlbum(e.target.value, e.target.selectedOptions[0].dataset.color);
            }
        });
        
        document.getElementById('bandcamp-close').addEventListener('click', () => {
            this.hide();
        });
        
        this.isVisible = true;
    },
    
    // Album laden
    loadAlbum(albumId, color = '2ebd35') {
        const wrapper = document.getElementById('bandcamp-player-wrapper');
        wrapper.innerHTML = `
            <iframe 
                style="border: 0; width: 100%; height: 120px;" 
                src="https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=333333/linkcol=${color}/tracklist=false/artwork=small/transparent=true/" 
                seamless>
            </iframe>
        `;
        this.currentAlbumId = albumId;
        this.isPlaying = true;
        console.log('🎵 Album geladen:', albumId);
    },
    
    // Player anzeigen
    show() {
        if (!document.getElementById('bandcamp-container')) {
            this.createPlayer();
        }
        const container = document.getElementById('bandcamp-container');
        container.classList.add('visible');
        this.isVisible = true;
    },
    
    // Player verstecken (Musik läuft weiter!)
    hide() {
        const container = document.getElementById('bandcamp-container');
        if (container) {
            container.classList.remove('visible');
        }
        this.isVisible = false;
        console.log('🎵 Player versteckt (Musik läuft weiter)');
    },
    
    // Player komplett entfernen
    destroy() {
        const container = document.getElementById('bandcamp-container');
        if (container) {
            container.remove();
        }
        this.isVisible = false;
        this.isPlaying = false;
    }
};

// CSS für Bandcamp Player
const bandcampStyles = document.createElement('style');
bandcampStyles.textContent = `
    .bandcamp-container {
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: linear-gradient(160deg, rgba(30, 30, 30, 0.98), rgba(20, 20, 20, 0.95));
        border: 2px solid #2ecc71;
        border-radius: 15px;
        padding: 20px;
        z-index: 2000;
        width: 350px;
        max-width: 90vw;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(46, 204, 113, 0.3);
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s ease;
    }
    
    .bandcamp-container.visible {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
    }
    
    .bandcamp-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        color: #2ecc71;
        font-weight: bold;
    }
    
    .bandcamp-close {
        background: none;
        border: none;
        color: #888;
        font-size: 1.2em;
        cursor: pointer;
        padding: 5px;
        transition: color 0.3s;
    }
    
    .bandcamp-close:hover {
        color: #e74c3c;
    }
    
    #album-select {
        width: 100%;
        padding: 12px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #2ecc71;
        border-radius: 8px;
        color: #e0e0e0;
        font-size: 1em;
        margin-bottom: 15px;
        cursor: pointer;
    }
    
    #album-select:focus {
        outline: none;
        border-color: #27ae60;
        box-shadow: 0 0 10px rgba(46, 204, 113, 0.3);
    }
    
    #album-select option {
        background: #1a1a1a;
        color: #e0e0e0;
    }
    
    #bandcamp-player-wrapper {
        border-radius: 8px;
        overflow: hidden;
    }
    
    #bandcamp-player-wrapper iframe {
        display: block;
    }
`;
document.head.appendChild(bandcampStyles);

// Event: Click auf Kompost-Hintergrund zeigt Player
document.addEventListener('DOMContentLoaded', () => {
    // Warte bis Layer 0 aktiv ist und Kugel sichtbar
    const checkForCompostClick = () => {
        const compostPhoto = document.querySelector('.compost-photo');
        const compostStart = document.querySelector('.compost-start');
        
        if (compostPhoto) {
            compostPhoto.addEventListener('click', (e) => {
                // Nur wenn Kugel sichtbar ist (orb-active Klasse)
                if (compostStart && compostStart.classList.contains('orb-active')) {
                    // Prüfe ob Klick NICHT auf der Kugel war
                    const orb = document.querySelector('.black-orb');
                    if (orb && !orb.contains(e.target)) {
                        e.stopPropagation();
                        
                        // Wenn Bandcamp schon offen → zeige YouTube
                        if (BandcampPlayer.isVisible && !KompostTV.isVisible) {
                            KompostTV.show();
                        } else if (!BandcampPlayer.isVisible) {
                            BandcampPlayer.show();
                        }
                    }
                }
            });
        }
    };
    
    checkForCompostClick();
    
    // Verstecke Player wenn man zu Layer 1+ geht
    window.addEventListener('layerchange', (e) => {
        if (e.detail.layer >= 1) {
            if (BandcampPlayer.isVisible) BandcampPlayer.hide();
            if (KompostTV.isVisible) KompostTV.hide();
        }
        // Zeige KI-Player in Layer 3
        if (e.detail.layer === 3) {
            KIBandcampPlayer.show();
        } else if (KIBandcampPlayer.isVisible) {
            KIBandcampPlayer.hide();
        }
    });
});

/* ============================================
   KI-BANDCAMP PLAYER
   Nur 2 KI-Alben, erscheint in Layer 3
   ============================================ */

const KIBandcampPlayer = {
    albums: [
        { 
            name: 'Kisum', 
            id: '121497606',
            color: '0687f5'
        },
        { 
            name: 'Cisum', 
            id: '3647431405',
            color: 'fe7eaf'
        }
    ],
    
    isVisible: false,
    
    createPlayer() {
        if (document.getElementById('ki-bandcamp-container')) return;
        
        const container = document.createElement('div');
        container.id = 'ki-bandcamp-container';
        container.className = 'ki-bandcamp-container';
        container.innerHTML = `
            <div class="bandcamp-header">
                <span>🤖 KI-Musik</span>
                <button id="ki-bandcamp-close" class="bandcamp-close">✕</button>
            </div>
            <select id="ki-album-select">
                <option value="">-- KI-Album wählen --</option>
            </select>
            <div id="ki-bandcamp-player-wrapper"></div>
        `;
        
        document.body.appendChild(container);
        
        // Dropdown füllen (zufällige Reihenfolge)
        const select = document.getElementById('ki-album-select');
        const shuffled = [...this.albums].sort(() => Math.random() - 0.5);
        shuffled.forEach(album => {
            const option = document.createElement('option');
            option.value = album.id;
            option.textContent = album.name;
            option.dataset.color = album.color;
            select.appendChild(option);
        });
        
        // Event Listeners
        select.addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadAlbum(e.target.value, e.target.selectedOptions[0].dataset.color);
            }
        });
        
        document.getElementById('ki-bandcamp-close').addEventListener('click', () => {
            this.hide();
        });
        
        this.isVisible = true;
    },
    
    loadAlbum(albumId, color = '0687f5') {
        const wrapper = document.getElementById('ki-bandcamp-player-wrapper');
        wrapper.innerHTML = `
            <iframe 
                style="border: 0; width: 100%; height: 120px;" 
                src="https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=333333/linkcol=${color}/tracklist=false/artwork=small/transparent=true/" 
                seamless>
            </iframe>
        `;
        console.log('🤖 KI-Album geladen:', albumId);
    },
    
    show() {
        if (!document.getElementById('ki-bandcamp-container')) {
            this.createPlayer();
        }
        const container = document.getElementById('ki-bandcamp-container');
        container.classList.add('visible');
        this.isVisible = true;
    },
    
    hide() {
        const container = document.getElementById('ki-bandcamp-container');
        if (container) {
            container.classList.remove('visible');
        }
        this.isVisible = false;
    }
};

// CSS für KI-Bandcamp Player
const kiBandcampStyles = document.createElement('style');
kiBandcampStyles.textContent = `
    .ki-bandcamp-container {
        position: fixed;
        bottom: 100px;
        left: 20px;
        background: linear-gradient(160deg, rgba(20, 30, 50, 0.98), rgba(30, 40, 60, 0.95));
        border: 2px solid #3498db;
        border-radius: 15px;
        padding: 20px;
        z-index: 2000;
        width: 300px;
        max-width: 90vw;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(52, 152, 219, 0.3);
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s ease;
    }
    
    .ki-bandcamp-container.visible {
        opacity: 1;
        visibility: visible;
    }
    
    .ki-bandcamp-container .bandcamp-header {
        color: #3498db;
    }
    
    .ki-bandcamp-container select {
        border-color: #3498db;
    }
    
    .ki-bandcamp-container select:focus {
        box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
    }
    
    @media (max-width: 768px) {
        .ki-bandcamp-container {
            bottom: 70px;
            left: 10px;
            right: 10px;
            width: auto;
        }
    }
`;
document.head.appendChild(kiBandcampStyles);

/* ============================================
   KOMPOST-TV - YouTube Player
   Erscheint wenn Bandcamp schon offen ist
   ============================================ */

const KompostTV = {
    playlistId: 'PLZC-JvCYVd4VbZ-GrTEXJma-RZAPPnApU',
    isVisible: false,
    
    createPlayer() {
        if (document.getElementById('kompost-tv-container')) return;
        
        const container = document.createElement('div');
        container.id = 'kompost-tv-container';
        container.className = 'kompost-tv-container';
        container.innerHTML = `
            <div class="kompost-tv-header">
                <span>📺 Kompost-TV</span>
                <button id="kompost-tv-close" class="bandcamp-close">✕</button>
            </div>
            <div id="kompost-tv-player">
                <iframe 
                    width="100%" 
                    height="200" 
                    src="https://www.youtube.com/embed/videoseries?list=${this.playlistId}&autoplay=0" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        `;
        
        document.body.appendChild(container);
        
        document.getElementById('kompost-tv-close').addEventListener('click', () => {
            this.hide();
        });
        
        this.isVisible = true;
    },
    
    show() {
        if (!document.getElementById('kompost-tv-container')) {
            this.createPlayer();
        }
        const container = document.getElementById('kompost-tv-container');
        container.classList.add('visible');
        this.isVisible = true;
        console.log('📺 Kompost-TV geöffnet');
    },
    
    hide() {
        const container = document.getElementById('kompost-tv-container');
        if (container) {
            container.classList.remove('visible');
        }
        this.isVisible = false;
    }
};

// CSS für Kompost-TV
const kompostTVStyles = document.createElement('style');
kompostTVStyles.textContent = `
    .kompost-tv-container {
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: linear-gradient(160deg, rgba(40, 20, 20, 0.98), rgba(30, 15, 15, 0.95));
        border: 2px solid #e74c3c;
        border-radius: 15px;
        padding: 15px;
        z-index: 2000;
        width: 320px;
        max-width: 90vw;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(231, 76, 60, 0.3);
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s ease;
    }
    
    .kompost-tv-container.visible {
        opacity: 1;
        visibility: visible;
    }
    
    .kompost-tv-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        color: #e74c3c;
        font-weight: bold;
    }
    
    #kompost-tv-player {
        border-radius: 8px;
        overflow: hidden;
    }
    
    #kompost-tv-player iframe {
        display: block;
    }
    
    @media (max-width: 768px) {
        .kompost-tv-container {
            bottom: 250px;
            right: 10px;
            left: 10px;
            width: auto;
        }
    }
`;
document.head.appendChild(kompostTVStyles);
