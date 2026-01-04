#!/usr/bin/env python3
"""
Extrahiert alle Kapitel aus der PDF basierend auf dem TOC (Seite 510-511)
"""

from pypdf import PdfReader
import json
import re

pdf_path = '/mnt/user-data/uploads/Demien_Bartók_-_Die_fröhliche_Abschaffung_von_Erfurt__druckversion_1_9_23_.pdf'

# Kapitel-Struktur aus TOC (Seite 510-511)
BOOK_STRUCTURE = {
    "title": "Die fröhliche Abschaffung von Ostdeutschland",
    "subtitle": "Gesammelte Werke",
    "parts": [
        {
            "title": "Schlaflosigkeitsrevolver",
            "page_start": 3,
            "chapters": [
                {"num": 1, "title": "Die Abschlussfahrt", "page": 7},
                {"num": 2, "title": "Überdruck", "page": 11},
                {"num": 3, "title": "Alles muss schwanken", "page": 24},
                {"num": 4, "title": "Ich bin so stark ich bin so stark aber", "page": 26},
                {"num": 5, "title": "Generation Y", "page": 28},
                {"num": 6, "title": "EUPHORIE MACHT ALLES PLATT", "page": 33},
                {"num": 7, "title": "Contra Cannabis", "page": 36},
                {"num": 8, "title": "Anmaßungen", "page": 37},
                {"num": 9, "title": "Aufforderungen zum Sturz", "page": 42},
                {"num": 10, "title": "Alles geht viel zu langsam kaputt", "page": 46},
                {"num": 11, "title": "Beunruhigende Hoffnungen", "page": 55},
                {"num": 12, "title": "Niemand I", "page": 62},
                {"num": 13, "title": "Niemand II", "page": 68},
                {"num": 14, "title": "Das Fleisch und die Nacht", "page": 72},
                {"num": 15, "title": "Lob der Schreibblockade", "page": 87},
                {"num": 16, "title": "Blasphemie in der Gartenlaube", "page": 93},
                {"num": 17, "title": "Melancholische Blutrünstigkeit", "page": 97},
                {"num": 18, "title": "Unter dem Joch der Freiheit", "page": 107},
                {"num": 19, "title": "Der Eindringling", "page": 116},
                {"num": 20, "title": "Der Komposthaufen vor meinem Fenster", "page": 154}
            ]
        },
        {
            "title": "Blumen & Löcher",
            "page_start": 155,
            "chapters": [
                # Blume 1
                {"num": "1.0", "title": "Blume 1", "page": 156, "is_section": True},
                {"num": "1.1", "title": "Eingang", "page": 158},
                {"num": "1.2", "title": "Erste Tänze", "page": 160},
                {"num": "1.3", "title": "Live", "page": 162},
                {"num": "1.4", "title": "Die Matsche", "page": 167},
                {"num": "1.5", "title": "Jede soziale Norm macht den Körper nervös", "page": 169},
                {"num": "1.6", "title": "Weihnachten 2014", "page": 175},
                # Blume 2
                {"num": "2.0", "title": "Blume 2", "page": 179, "is_section": True},
                {"num": "2.1", "title": "Neujahrsmeditationen", "page": 179},
                {"num": "2.2", "title": "Februar", "page": 181},
                {"num": "2.3", "title": "März – Das LSA", "page": 183},
                {"num": "2.4", "title": "April - Die Kekse", "page": 192},
                {"num": "2.5", "title": "Augen", "page": 194},
                {"num": "2.6", "title": "Art Is Resistance", "page": 195},
                {"num": "2.7", "title": "Terror", "page": 196},
                {"num": "2.8", "title": "Das 1,4 Butandiol", "page": 198},
                {"num": "2.9", "title": "Die Stachelschweine", "page": 201},
                {"num": "2.10", "title": "Die Verletzung der Wohnung", "page": 203},
                {"num": "2.11", "title": "Die DXM-Interventionen", "page": 209},
                # Blume 3
                {"num": "3.0", "title": "Blume 3", "page": 241, "is_section": True},
                {"num": "3.1", "title": "Unser Haus ist eine Drüse", "page": 243},
                {"num": "3.2", "title": "Meta-Menschheit", "page": 256},
                {"num": "3.3", "title": "Kunst und Ekstase", "page": 268},
                # Blume 4 + Einzeltexte
                {"num": "4.0", "title": "Blume 4", "page": 283, "is_section": True},
                {"num": "4.1", "title": "Januar", "page": 287},
                {"num": "4.2", "title": "Überblumen", "page": 290},
                {"num": "4.3", "title": "Rausch und Wahrheit", "page": 296},
                {"num": "4.4", "title": "Zerrüttet", "page": 300},
                {"num": "4.5", "title": "Eine Störung", "page": 304}
            ]
        },
        {
            "title": "Die fröhliche Abschaffung von Erfurt",
            "page_start": 309,
            "chapters": [
                {"num": 1, "title": "Morgenstimmung Bleivergiftung", "page": 311},
                {"num": 2, "title": "Der Nestbeschmutzer", "page": 319},
                {"num": 3, "title": "Die fröhliche Gebietsreform", "page": 341},
                {"num": 4, "title": "Die schöne Stadt namens Europa", "page": 343},
                {"num": 5, "title": "Faschismus", "page": 345},
                {"num": 6, "title": "Die Ronny- und Heiko-Psychose", "page": 347},
                {"num": 7, "title": "Wir fröhlichen Europäer", "page": 355},
                {"num": 8, "title": "Junischaum", "page": 362},
                {"num": 9, "title": "Zum ersten und letzten Mal Stuttgart", "page": 366},
                {"num": 10, "title": "Rausch und Wahrheit", "page": 369},
                {"num": 11, "title": "Die Fratze", "page": 383},
                {"num": 12, "title": "Das Huhn läuft über die Straße", "page": 386},
                {"num": 13, "title": "Kekse und Stimme", "page": 388},
                {"num": 14, "title": "Oh Blumen, worum soll es gehen?", "page": 390},
                {"num": 15, "title": "In der Badewanne kannst auch du größenwahnsinnig werden", "page": 393},
                {"num": 16, "title": "Mein Rhythmus", "page": 394},
                {"num": "16.1", "title": "Coolness", "page": 395},
                {"num": "16.2", "title": "Name", "page": 397},
                {"num": "16.3", "title": "Maske", "page": 399},
                {"num": "16.4", "title": "Besuch in Nürnberg", "page": 400},
                {"num": "16.5", "title": "Werk", "page": 401},
                {"num": "16.6", "title": "Ruhm", "page": 406},
                {"num": "16.7", "title": "Sexualität", "page": 407},
                {"num": "16.8", "title": "Tod", "page": 414},
                {"num": 17, "title": "Jenseits des Stils bin ich Bürgermeister von Erfurt", "page": 417},
                {"num": 18, "title": "November November Goldener November", "page": 430},
                {"num": 19, "title": "Abschaffende Fröhlichkeit", "page": 438},
                {"num": 20, "title": "Das Recht auf Dissoziation", "page": 448},
                {"num": 21, "title": "Letzte Bohrungen, 2020/21", "page": 464},
                {"num": 22, "title": "Ein gesundes Buch", "page": 493},
                {"num": 23, "title": "Die Gute Routine in Halle, Nov.22 (in Auszügen)", "page": 496},
                {"num": 24, "title": "Florian Silberfisch und Ihre Blühenden Landschaften", "page": 505}
            ]
        }
    ]
}

def clean_text(text):
    """Säubere Text: Seitenzahlen, Umbrüche, etc."""
    # Entferne einzelne Zahlen am Ende (Seitenzahlen)
    text = re.sub(r'\n\d{1,3}\n', '\n', text)
    text = re.sub(r'^\d{1,3}$', '', text, flags=re.MULTILINE)
    
    # Entferne übermäßige Leerzeilen
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Trim
    text = text.strip()
    
    return text

def extract_chapters():
    """Extrahiere alle Kapitel aus PDF"""
    
    print("📚 EXTRAHIERE KAPITEL AUS PDF")
    print("=" * 70)
    
    reader = PdfReader(pdf_path)
    
    result = {
        "metadata": {
            "title": BOOK_STRUCTURE["title"],
            "subtitle": BOOK_STRUCTURE["subtitle"],
            "total_pages": len(reader.pages)
        },
        "parts": []
    }
    
    chapter_id = 1
    
    for part in BOOK_STRUCTURE["parts"]:
        print(f"\n📖 Teil: {part['title']}")
        
        part_data = {
            "title": part["title"],
            "page_start": part["page_start"],
            "chapters": []
        }
        
        chapters = part["chapters"]
        
        for i, chapter in enumerate(chapters):
            # Berechne Seiten-Ende
            if i < len(chapters) - 1:
                page_end = chapters[i + 1]["page"] - 1
            else:
                # Letztes Kapitel: bis nächster Teil oder Ende
                next_part_idx = BOOK_STRUCTURE["parts"].index(part) + 1
                if next_part_idx < len(BOOK_STRUCTURE["parts"]):
                    page_end = BOOK_STRUCTURE["parts"][next_part_idx]["page_start"] - 1
                else:
                    page_end = 509  # Vor TOC
            
            # Extrahiere Text
            text_parts = []
            for page_num in range(chapter["page"], page_end + 1):
                try:
                    page = reader.pages[page_num - 1]  # PDF pages sind 0-indexed
                    text_parts.append(page.extract_text())
                except IndexError:
                    break
            
            full_text = "\n".join(text_parts)
            cleaned_text = clean_text(full_text)
            
            chapter_data = {
                "id": chapter_id,
                "number": chapter["num"],
                "title": chapter["title"],
                "part": part["title"],
                "page_start": chapter["page"],
                "page_end": page_end,
                "is_section": chapter.get("is_section", False),
                "content": cleaned_text,
                "word_count": len(cleaned_text.split())
            }
            
            part_data["chapters"].append(chapter_data)
            
            print(f"   ✓ Kap. {chapter['num']}: {chapter['title']} ({chapter_data['word_count']:,} Wörter)")
            
            chapter_id += 1
        
        result["parts"].append(part_data)
    
    return result

def main():
    chapters_data = extract_chapters()
    
    # Statistik
    total_chapters = sum(len(part["chapters"]) for part in chapters_data["parts"])
    total_words = sum(
        ch["word_count"] 
        for part in chapters_data["parts"] 
        for ch in part["chapters"]
    )
    
    print(f"\n\n📊 GESAMT-STATISTIK:")
    print(f"=" * 70)
    print(f"Teile: {len(chapters_data['parts'])}")
    print(f"Kapitel: {total_chapters}")
    print(f"Wörter gesamt: {total_words:,}")
    
    # Speichern
    output_path = '/home/claude/kompost-organism/data/chapters_from_pdf.json'
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(chapters_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 Gespeichert: {output_path}")
    
    # Dateigröße
    import os
    size_mb = os.path.getsize(output_path) / 1024 / 1024
    print(f"   Größe: {size_mb:.2f} MB")
    
    print("\n✅ FERTIG!")

if __name__ == '__main__':
    main()
