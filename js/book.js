// BUCH-READER - Nutzt PDF-extrahierte Kapitel
let bookData = null;
let allChapters = [];
let currentChapterIndex = -1;

// Lade Kapitel-Daten aus PDF-Extraktion
async function loadBook() {
    try {
        const response = await fetch('data/chapters_cleaned.json');
        bookData = await response.json();
        
        // Flatten alle Kapitel
        allChapters = [];
        bookData.parts.forEach(part => {
            part.chapters.forEach(chapter => {
                allChapters.push({
                    ...chapter,
                    partTitle: part.title
                });
            });
        });
        
        console.log(`📚 ${allChapters.length} Kapitel aus PDF geladen`);
        
        buildTableOfContents();
    } catch (error) {
        console.error('Fehler beim Laden der Kapitel:', error);
    }
}

// Erstelle Inhaltsverzeichnis
function buildTableOfContents() {
    const tocList = document.getElementById('toc-list');
    if (!tocList || !bookData) return;
    
    tocList.innerHTML = '';
    
    bookData.parts.forEach(part => {
        // Teil-Container
        const partDiv = document.createElement('div');
        partDiv.className = 'toc-part';
        
        // Teil-Titel
        const partTitle = document.createElement('div');
        partTitle.className = 'part-title';
        partTitle.textContent = part.title;
        partDiv.appendChild(partTitle);
        
        // Kapitel-Liste
        const chapterList = document.createElement('div');
        chapterList.className = 'chapter-list';
        
        part.chapters.forEach(chapter => {
            const chapterItem = document.createElement('div');
            chapterItem.className = 'chapter-item';
            
            // Section-Header (z.B. "Blume 1") anders stylen
            if (chapter.is_section) {
                chapterItem.classList.add('section-header');
            }
            
            chapterItem.dataset.chapterId = chapter.id;
            
            chapterItem.innerHTML = `
                <span class="chapter-number">${chapter.number}.</span>
                <span class="chapter-title">${chapter.title}</span>
                <span class="chapter-words">${chapter.word_count.toLocaleString('de-DE')} W.</span>
            `;
            
            chapterItem.addEventListener('click', () => {
                openChapter(chapter.id);
            });
            
            chapterList.appendChild(chapterItem);
        });
        
        partDiv.appendChild(chapterList);
        tocList.appendChild(partDiv);
    });
}

// Öffne Kapitel
function openChapter(chapterId) {
    const chapterIndex = allChapters.findIndex(ch => ch.id === chapterId);
    if (chapterIndex === -1) return;
    
    currentChapterIndex = chapterIndex;
    const chapter = allChapters[chapterIndex];
    
    // Verstecke TOC, zeige Reading View
    document.getElementById('toc').classList.add('hidden');
    document.getElementById('reading-view').classList.remove('hidden');
    
    // Setze Titel
    document.getElementById('chapter-title').textContent = 
        `${chapter.number}. ${chapter.title}`;
    
    // Formatiere Content
    const content = chapter.content
        .split('\n\n')
        .filter(p => p.trim())
        .map(p => `<p>${p.trim()}</p>`)
        .join('');
    
    document.getElementById('chapter-content').innerHTML = content;
    
    // Meta-Info
    document.getElementById('chapter-meta').textContent = 
        `${chapter.partTitle} · S. ${chapter.page_start}-${chapter.page_end} · ${chapter.word_count.toLocaleString('de-DE')} Wörter`;
    
    // Update Navigation
    updateNavButtons();
    
    // Scroll to top
    document.getElementById('chapter-content').scrollTop = 0;
}

// Update Navigation Buttons
function updateNavButtons() {
    const prevBtn = document.getElementById('prev-chapter');
    const nextBtn = document.getElementById('next-chapter');
    
    prevBtn.disabled = currentChapterIndex === 0;
    nextBtn.disabled = currentChapterIndex === allChapters.length - 1;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Lade Buch
    loadBook();
    
    // Zurück zum Inhaltsverzeichnis
    document.getElementById('back-to-toc')?.addEventListener('click', () => {
        document.getElementById('toc').classList.remove('hidden');
        document.getElementById('reading-view').classList.add('hidden');
        currentChapterIndex = -1;
    });
    
    // Vorheriges Kapitel
    document.getElementById('prev-chapter')?.addEventListener('click', () => {
        if (currentChapterIndex > 0) {
            openChapter(allChapters[currentChapterIndex - 1].id);
        }
    });
    
    // Nächstes Kapitel
    document.getElementById('next-chapter')?.addEventListener('click', () => {
        if (currentChapterIndex < allChapters.length - 1) {
            openChapter(allChapters[currentChapterIndex + 1].id);
        }
    });
    
    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('reading-view').classList.contains('hidden')) {
            if (e.key === 'ArrowLeft' && currentChapterIndex > 0) {
                openChapter(allChapters[currentChapterIndex - 1].id);
            } else if (e.key === 'ArrowRight' && currentChapterIndex < allChapters.length - 1) {
                openChapter(allChapters[currentChapterIndex + 1].id);
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                document.getElementById('back-to-toc').click();
            }
        }
    });
});
