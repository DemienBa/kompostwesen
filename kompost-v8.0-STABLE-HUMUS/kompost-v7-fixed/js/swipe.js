/* ============================================
   SWIPE.JS - Touch-Gesten Navigation
   Nur aktiv auf Touch-Geräten!
   Click-Events bleiben unberührt.
   ============================================ */

(function() {
    // Nur auf Touch-Geräten aktivieren
    if (!('ontouchstart' in window)) {
        console.log('🖱️ Kein Touch-Gerät - Swipe deaktiviert');
        return;
    }
    
    console.log('📱 Touch-Gerät erkannt - Swipe aktiviert');
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    const minSwipeDistance = 50; // Mindest-Swipe-Distanz in Pixel
    
    // Touch Start
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    // Touch End
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Nur horizontale Swipes (nicht vertikale Scrolls)
        if (Math.abs(deltaX) < minSwipeDistance) return;
        if (Math.abs(deltaY) > Math.abs(deltaX)) return; // Mehr vertikal als horizontal
        
        // Welcher Layer ist aktiv?
        const currentLayer = window.currentLayer || 0;
        
        // Layer 0 und 1: Kein Swipe (braucht spezielle Navigation)
        if (currentLayer < 2) {
            console.log('📱 Swipe in Layer 0/1 ignoriert');
            return;
        }
        
        if (deltaX > 0) {
            // Swipe RECHTS → Vorheriger Layer
            console.log('👈 Swipe rechts → Layer', currentLayer - 1);
            if (typeof switchLayer === 'function' && currentLayer > 2) {
                switchLayer(currentLayer - 1);
            }
        } else {
            // Swipe LINKS → Nächster Layer
            console.log('👉 Swipe links → Layer', currentLayer + 1);
            if (typeof switchLayer === 'function' && currentLayer < 4) {
                switchLayer(currentLayer + 1);
            }
        }
    }
    
    // Zeige Swipe-Hint auf Mobile
    function showSwipeHint() {
        // Nur wenn noch nicht gezeigt
        if (sessionStorage.getItem('swipeHintShown')) return;
        
        const hint = document.createElement('div');
        hint.className = 'swipe-hint';
        hint.textContent = '← Swipe für Navigation →';
        document.body.appendChild(hint);
        
        // Nach 3 Sekunden ausblenden
        setTimeout(() => {
            hint.style.opacity = '0';
            hint.style.transition = 'opacity 1s';
            setTimeout(() => hint.remove(), 1000);
        }, 3000);
        
        sessionStorage.setItem('swipeHintShown', 'true');
    }
    
    // Zeige Hint wenn Layer 2 erreicht wird
    window.addEventListener('layerchange', (e) => {
        if (e.detail.layer === 2) {
            showSwipeHint();
        }
    });
    
})();
