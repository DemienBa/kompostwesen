#!/usr/bin/env python3
"""
Extrahiert Kapitel aus den Original-Texten
Erstellt chapters.json für den Buch-Reader
"""

import json
import re
from pathlib import Path

TEXTS = {
    'schlaflosigkeit_1.txt': {
        'title': 'Schlaflosigkeitsrevolver',
        'part': 'Teil I',
        'zone': 'Zone II'
    },
    'schlaflosigkeit_2.txt': {
        'title': 'Schlaflosigkeitsrevolver',
        'part': 'Teil II',
        'zone': 'Zone II'
    },
    'schlaflosigkeit_3.txt': {
        'title': 'Schlaflosigkeitsrevolver',
        'part': 'Teil III',
        'zone': 'Zone II'
    },
    'blume_1.txt': {
        'title': 'Blume (Psychedelisch)',
        'part': 'Teil I',
        'zone': 'Zone III'
    },
    'blume_2.txt': {
        'title': 'Blume (Psychedelisch)',
        'part': 'Teil II',
        'zone': 'Zone III'
    },
    'blume_3.txt': {
        'title': 'Blume (Psychedelisch)',
        'part': 'Teil III',
        'zone': 'Zone III'
    },
    'abschaffen_1.txt': {
        'title': 'Die Abschaffung von Erfurt',
        'part': 'Teil I',
        'zone': 'Zone I'
    },
    'abschaffen_2.txt': {
        'title': 'Die Abschaffung von Erfurt',
        'part': 'Teil II',
        'zone': 'Zone I'
    },
    'abschaffen_3.txt': {
        'title': 'Die Abschaffung von Erfurt',
        'part': 'Teil III',
        'zone': 'Zone I'
    },
    'abschaffen_4.txt': {
        'title': 'Die Abschaffung von Erfurt',
        'part': 'Teil IV',
        'zone': 'Zone III'
    }
}

def split_chapters(text, filename):
    """Teilt Text in Kapitel bei Stern-Markierungen"""
    text = text.replace('\r\n', '\n')
    
    # Split bei Stern
    parts = re.split(r'\n\*\s*\n', text)
    
    chapters = []
    for i, part in enumerate(parts, 1):
        part = part.strip()
        if len(part) < 100:  # Zu kurz
            continue
        
        # Extrahiere ersten Satz als Titel-Vorschau
        first_line = part.split('\n')[0][:80]
        
        chapters.append({
            'number': i,
            'preview': first_line + '...',
            'content': part,
            'word_count': len(part.split())
        })
    
    return chapters

def create_chapter_structure():
    """Erstellt vollständige Kapitelstruktur"""
    origins_dir = Path('/home/claude/kompost-web/data/origins')
    
    book_structure = {
        'title': 'Die fröhliche Abschaffung von Ostdeutschland',
        'subtitle': 'Gesammelte Werke',
        'parts': []
    }
    
    chapter_id = 1
    
    for filename, meta in TEXTS.items():
        filepath = origins_dir / filename
        
        if not filepath.exists():
            print(f"⚠️  {filename} nicht gefunden")
            continue
        
        print(f"📖 Verarbeite {meta['title']} - {meta['part']}...")
        
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()
        
        chapters = split_chapters(text, filename)
        
        # Erstelle Teil-Struktur
        part_obj = {
            'title': meta['title'],
            'part': meta['part'],
            'zone': meta['zone'],
            'chapter_count': len(chapters),
            'chapters': []
        }
        
        for ch in chapters:
            chapter_obj = {
                'id': chapter_id,
                'number': ch['number'],
                'title': f"{meta['part']} - Kapitel {ch['number']}",
                'preview': ch['preview'],
                'content': ch['content'],
                'word_count': ch['word_count'],
                'source': meta['title']
            }
            part_obj['chapters'].append(chapter_obj)
            chapter_id += 1
        
        book_structure['parts'].append(part_obj)
        print(f"   → {len(chapters)} Kapitel")
    
    return book_structure

def main():
    print("📚 KAPITEL-EXTRAKTION")
    print("=" * 50)
    
    structure = create_chapter_structure()
    
    total_chapters = sum(p['chapter_count'] for p in structure['parts'])
    
    print(f"\n✅ {total_chapters} Kapitel extrahiert")
    print(f"📖 {len(structure['parts'])} Teile")
    
    # Speichern
    output_path = Path('/home/claude/kompost-organism/data/chapters.json')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(structure, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 Gespeichert: {output_path}")
    print(f"   Größe: {output_path.stat().st_size / 1024:.1f} KB")
    
    # Statistik
    print(f"\n📊 STRUKTUR:")
    for part in structure['parts']:
        print(f"   {part['title']} - {part['part']}: {part['chapter_count']} Kapitel")

if __name__ == '__main__':
    main()
