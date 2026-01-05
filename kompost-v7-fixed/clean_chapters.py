#!/usr/bin/env python3
"""
Bereinigt die PDF-Extraktion:
1. Integriert die 3 Vorwörter
2. Entfernt Worttrennungen (Silbentrennung)
3. Entfernt Kapitelnamen aus Texten
"""

import json
import re
from pathlib import Path

# Lade die 3 Vorwörter
def load_vorworte():
    with open('/mnt/user-data/uploads/drei_vorworte.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split bei "Vorwort"
    parts = re.split(r'Vorwort "(.*?)"', content)
    
    vorworte = {}
    
    # parts[0] = leer
    # parts[1] = "Schlaflosigkeitsrevolver", parts[2] = text
    # parts[3] = "Blumen & Löcher", parts[4] = text
    # parts[5] = "Die fröhliche Abschaffung von Erfurt", parts[6] = text
    
    for i in range(1, len(parts), 2):
        title = parts[i].strip()
        text = parts[i+1].strip() if i+1 < len(parts) else ""
        vorworte[title] = text
    
    return vorworte

def fix_hyphenation(text):
    """Entfernt Worttrennungen (Silbentrennung am Zeilenende)"""
    
    # Pattern: Wort-\nWort → WortWort
    # Aber nur wenn nach - ein Zeilenumbruch kommt
    
    # Ersetze "Wort-\nwort" mit "Wortwort"
    text = re.sub(r'(\w)-\s*\n\s*(\w)', r'\1\2', text)
    
    # Spezielle Fälle:
    # "authen-tischen" → "authentischen"
    text = re.sub(r'authen-\s*tischen', 'authentischen', text, flags=re.IGNORECASE)
    
    return text

def remove_chapter_title_from_content(chapter):
    """Entfernt Kapiteltitel am Anfang des Textes"""
    
    title = chapter['title']
    content = chapter['content']
    
    # Escape special regex characters in title
    title_escaped = re.escape(title)
    
    # Pattern: Titel am Anfang (optional mit Nummer davor)
    patterns = [
        # "1. Die Abschlussfahrt" am Anfang
        rf'^\s*\d+\.\s*{title_escaped}\s*\n',
        # "Die Abschlussfahrt" am Anfang
        rf'^\s*{title_escaped}\s*\n',
        # Mit optionalen Sternchen
        rf'^\s*\*\s*\n\s*{title_escaped}\s*\n',
    ]
    
    for pattern in patterns:
        content = re.sub(pattern, '', content, flags=re.MULTILINE)
    
    # Entferne auch Seitenzahlen am Anfang (einzelne Zahlen)
    content = re.sub(r'^\s*\d{1,3}\s*\n', '', content, flags=re.MULTILINE)
    
    return content.strip()

def clean_text(text):
    """Allgemeine Text-Bereinigung"""
    
    # Entferne übermäßige Leerzeilen
    text = re.sub(r'\n{4,}', '\n\n\n', text)
    
    # Entferne Leerzeichen am Zeilenanfang/-ende
    lines = text.split('\n')
    lines = [line.rstrip() for line in lines]
    text = '\n'.join(lines)
    
    return text.strip()

def process_chapters():
    """Hauptfunktion: Bereinigt alle Kapitel"""
    
    print("🧹 BEREINIGE PDF-EXTRAKTION")
    print("=" * 70)
    
    # Lade Vorwörter
    print("\n📚 Lade Vorwörter...")
    vorworte = load_vorworte()
    
    for title, text in vorworte.items():
        word_count = len(text.split())
        print(f"   ✓ {title}: {word_count} Wörter")
    
    # Lade chapters_from_pdf.json
    input_path = Path('/home/claude/kompost-organism/data/chapters_from_pdf.json')
    
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"\n📖 Verarbeite {len(data['parts'])} Teile...")
    
    # Verarbeite jeden Teil
    for part in data['parts']:
        print(f"\n📕 Teil: {part['title']}")
        
        # Füge Vorwort als erstes "Kapitel" hinzu (wenn vorhanden)
        vorwort_key = None
        if part['title'] == 'Schlaflosigkeitsrevolver':
            vorwort_key = 'Schlaflosigkeitsrevolver'
        elif part['title'] == 'Blumen & Löcher':
            vorwort_key = 'Blumen & Löcher'
        elif part['title'] == 'Die fröhliche Abschaffung von Erfurt':
            vorwort_key = 'Die fröhliche Abschaffung von Erfurt'
        
        if vorwort_key and vorwort_key in vorworte:
            vorwort_text = vorworte[vorwort_key]
            
            # Bereinige Vorwort
            vorwort_text = fix_hyphenation(vorwort_text)
            vorwort_text = clean_text(vorwort_text)
            
            # Erstelle Vorwort-Kapitel
            vorwort_chapter = {
                'id': part['chapters'][0]['id'] - 0.5,  # Temporäre ID
                'number': 0,
                'title': 'Vorwort',
                'part': part['title'],
                'page_start': part['page_start'],
                'page_end': part['page_start'],
                'is_section': False,
                'is_vorwort': True,
                'content': vorwort_text,
                'word_count': len(vorwort_text.split())
            }
            
            # Füge am Anfang ein
            part['chapters'].insert(0, vorwort_chapter)
            
            print(f"   ✅ Vorwort eingefügt ({vorwort_chapter['word_count']} Wörter)")
        
        # Verarbeite alle Kapitel
        for i, chapter in enumerate(part['chapters']):
            if chapter.get('is_vorwort'):
                continue  # Skip Vorwort, schon bearbeitet
            
            original_length = len(chapter['content'])
            
            # 1. Entferne Worttrennungen
            chapter['content'] = fix_hyphenation(chapter['content'])
            
            # 2. Entferne Kapiteltitel
            chapter['content'] = remove_chapter_title_from_content(chapter)
            
            # 3. Allgemeine Bereinigung
            chapter['content'] = clean_text(chapter['content'])
            
            # Update word count
            chapter['word_count'] = len(chapter['content'].split())
            
            new_length = len(chapter['content'])
            diff = original_length - new_length
            
            if diff > 0:
                print(f"   📝 Kap. {chapter['number']}: {chapter['title'][:40]}... (-{diff} Zeichen)")
    
    # Re-nummeriere IDs
    print(f"\n🔢 Re-nummeriere IDs...")
    current_id = 1
    for part in data['parts']:
        for chapter in part['chapters']:
            chapter['id'] = current_id
            current_id += 1
    
    # Statistik
    total_chapters = sum(len(part['chapters']) for part in data['parts'])
    total_words = sum(
        ch['word_count'] 
        for part in data['parts'] 
        for ch in part['chapters']
    )
    
    print(f"\n📊 NEUE STATISTIK:")
    print(f"=" * 70)
    print(f"Teile: {len(data['parts'])}")
    print(f"Kapitel gesamt: {total_chapters} (inkl. 3 Vorwörter)")
    print(f"Wörter gesamt: {total_words:,}")
    
    # Nach Teil aufschlüsseln
    print(f"\n📚 PRO TEIL:")
    for part in data['parts']:
        chapter_count = len(part['chapters'])
        word_count = sum(ch['word_count'] for ch in part['chapters'])
        print(f"   {part['title']}: {chapter_count} Kapitel, {word_count:,} Wörter")
    
    # Speichern
    output_path = Path('/home/claude/kompost-organism/data/chapters_cleaned.json')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 Gespeichert: {output_path}")
    
    # Dateigröße
    size_mb = output_path.stat().st_size / 1024 / 1024
    print(f"   Größe: {size_mb:.2f} MB")
    
    print("\n✅ BEREINIGUNG KOMPLETT!")
    
    return data

if __name__ == '__main__':
    process_chapters()
