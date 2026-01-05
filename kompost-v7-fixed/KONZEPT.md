# DAS KOMPOSTWESEN
## Vollständige Konzept-Dokumentation

**Projekt:** Interaktives, digitales Kunstwerk  
**Basis:** "Die fröhliche Abschaffung von Ostdeutschland" (Gesammelte Werke)  
**Metapher:** Kompostierung als literarische Transformation  
**Medium:** Progressive Web-App mit 6 Layern

---

## 🎯 KERNKONZEPT

### Philosophische Grundlage: Kompost-Ethik

Das Projekt verkörpert die **Kompost-Ethik** als ästhetisches und philosophisches Prinzip:

- **Transformation statt Bewahrung:** Texte werden nicht archiviert, sondern zersetzt
- **Prozess über Produkt:** Der Zersetzungsprozess ist wichtiger als das Endergebnis
- **Auflösung des Autors:** Das "Ich" zerfällt in Fragmente, wird zum Dividual
- **Demokratische Zersetzung:** Alle Texte werden gleich behandelt im Kompost

### Technische Umsetzung

Ein **nicht-lineares, selbst-zersetzendes digitales Buch** mit 6 progressiven Schichten:

```
Oberfläche (Ordnung)
    ↓
  Buch (Lesen)
    ↓
Biologie (Natur)
    ↓
   KI (Emergenz)
    ↓
 Myzel (Chaos)
    ↓
Humus (Verdichtung)
```

---

## 🗂️ LAYER-ARCHITEKTUR

### LAYER 0: STARTSEITE
**Konzept:** Minimalistische Einführung

**Visuell:**
- Kompost-Foto A (echtes Foto, von weitem)
- Fullscreen, viel Schwärze
- 30% Bildschirm = Kompost
- Kein Text, kein Titel

**Interaktion:**
- Click irgendwo → Schwarze Kugel erscheint (150px, zufällige Position)
- Click auf Kugel → Verwandelt sich in Buchcover (Fade)
- Click auf Buchcover → Layer 1
- Click auf Kompost → Wikipedia (neuer Tab) + Jump zu Layer 4

**Metapher:** Die Entscheidung zwischen Wissen (Wikipedia) und Erfahrung (Buch)

---

### LAYER 1: BUCH LESEN
**Konzept:** Klassische Lektüre-Erfahrung

**Visuell:**
- Kompost-Foto B im Hintergrund (dunkler, Humus-artig)
- Buch-Fenster (80% Bildschirm)
- Saubere, lesbare Typografie (Georgia Serif)

**Struktur:**
```
Die fröhliche Abschaffung von Ostdeutschland
├── Schlaflosigkeitsrevolver (20 Kapitel)
├── Blumen & Löcher (29 Kapitel)
└── Die fröhliche Abschaffung von Erfurt (32 Kapitel)

Gesamt: 81 Kapitel, 219.560 Wörter
```

**Interaktion:**
- Inhaltsverzeichnis → Kapitel wählen
- Kapitel lesen (vor/zurück navigierbar)
- Keyboard-Support (← → Backspace)
- Click auf Kompost-Rand → Layer 2

**Übergang zu Layer 2:**
- **Im TOC:** Ganzer Textkörper (alle 81 Kapitel linear) in Layer 2 links
- **Kapitel offen:** Nur dieses Kapitel in Layer 2 links

**Metapher:** Das Original, das Buch als feste Form

---

### LAYER 2: BIOLOGISCHE KOMPOSTIERUNG
**Konzept:** Wissenschaftliche, nachvollziehbare Transformation

**Visuell:** Split-View (3 Spalten)

```
┌─────────┬──────────┬─────────┬────┐
│ ORIGINAL│ BIO-     │ OUTPUT  │RAND│
│ (30%)   │ PARAMS   │ (30%)   │(10%│
│         │ (20%)    │         │    │
│ Statisch│          │Generiert│Click│
│ Text aus│ 🌡️Temp   │         │→L3 │
│ Layer 1 │ 💧Feuch  │         │    │
│         │ 🧪pH     │         │    │
│         │ 🧬Enzym  │         │    │
│         │ 🌬️Luft   │         │    │
│         │ 🌍Zone   │         │    │
│         │[GENER.]  │         │    │
└─────────┴──────────┴─────────┴────┘
```

**Biologische Parameter:**

#### 🌡️ **Temperatur** (0-100°C)
**Biologisch:** Bestimmt Mikroorganismen-Aktivität

**Als Text-Metapher:**
- **0-25°C (Kalt):** Ruhige, kontemplative Texte
  - Enzyme: #Denken, #Schlaf, #Melancholie
  - Langsam, bedächtig
  
- **25-45°C (Mesophil):** Normale Intensität
  - Enzyme: #Noise, #Angst, #Resonanz
  - Aktive Zersetzung, kontrolliert
  
- **45-70°C (Thermophil):** Intensive Texte
  - Enzyme: #Wut, #Lysis, #Rausch
  - Schnelle Transformation
  
- **70-100°C (Extrem):** Totale Auflösung
  - Enzyme: #Auflösung, #Dividual
  - Pathologische Zersetzung

#### 💧 **Feuchtigkeit** (0-80%)
**Biologisch:** Flüssigkeit für Prozess-Flow

**Als Text-Metapher:**
- **0-40% (Trocken):** Fragmentierte, abgehackte Texte
  - Harte Schnitte, keine Übergänge
  - Bröckelig
  
- **40-60% (Optimal):** Fließende Übergänge
  - Fragmente verschmelzen organisch
  - Matschig aber lesbar
  
- **60-80% (Nass):** Texte zerfließen
  - Grenzen verschwimmen
  - Anaerobe Fäulnis = surreal
  - Schlamm

#### 🧪 **pH-Wert** (4-10)
**Biologisch:** Säure/Base-Balance

**Als Text-Metapher:**
- **pH 4-6 (Sauer):** Dunkle, negative Texte
  - Enzyme: #Ekel, #Angst, #Verzweiflung
  - "Pilzig" (langsam wuchernd)
  
- **pH 6-8 (Neutral):** Ausgewogen
  - Mix aller Enzyme
  
- **pH 8-10 (Basisch):** Aggressive Texte
  - Enzyme: #Wut, #Politik, #Kritik
  - "Ammoniakhaltig" (ätzend)

#### 🌬️ **Belüftung** (Aerob/Anaerob)
**Biologisch:** Sauerstoffzufuhr

**Als Text-Metapher:**
- **Aerob (mit O₂):** Klare, lesbare Texte
  - Logische Struktur erkennbar
  - Gesunde Zersetzung
  
- **Anaerob (ohne O₂):** Faulende, surreale Texte
  - Logik zerfällt
  - Giftige Zersetzung
  - Verstörend

#### 🧬 **Enzym-Essenz** (Dropdown)
**Biologisch:** Spezifische Mikroorganismen

**Verfügbare Enzyme:**
- **#Dividual:** Ich-Zerfall, Auflösung, Subjekt
- **#Lysis:** Zersetzung, Zerfall, Destruktion
- **#Myzel:** Vernetzung, Rhizom, Geflecht, Pilz
- **#Noise:** Rauschen, Lärm, Überforderung
- **#Resonanz:** Eltern, Kindheit, Herkunft

**Erweiterte Enzyme (aus ursprünglicher Definition):**
- #Schlaf, #Angst, #Wut, #Ekel, #Rausch
- #Denken, #Stadt, #Politik, #Auflösung

#### 🌍 **Zonen-Tiefe** (I, II, III)
**Biologisch:** Schichten im Komposthaufen

**Als Text-Metapher:**
- **Zone I:** Biographisch, fest, schwer zersetzbar
  - Texte aus "Die Abschaffung von Erfurt" (Teile 1-3)
  - Fakten, Orte, "unkompostierbar"
  
- **Zone II:** Mittlere Zersetzung
  - Texte aus "Schlaflosigkeit"
  - Mentale Auflösung, Schlaflosigkeit
  
- **Zone III:** Maximal zersetzt
  - Texte aus "Blume"
  - Rausch, Dividual, Ich-Zerfall

**Generierungs-Prozess:**
1. User wählt Parameter
2. System filtert 11.327 Fragmente nach:
   - Temperatur → Enzym-Intensität
   - pH → Emotionale Valenz
   - Feuchtigkeit → Übergangs-Style
   - Belüftung → Lesbarkeit
   - Enzym → Tag-Filter
   - Zone → Herkunfts-Filter
3. Sampelt Fragmente (Ziel-Wortanzahl)
4. Ordnet nach Feuchtigkeit (trocken/nass)
5. Zeigt neuen Text rechts

**Metapher:** Wissenschaftliche Kompostierung, kontrolliert, lehrreich

---

### LAYER 3: KI-FERMENTIERUNG
**Konzept:** Emergente Transformation durch KI

**Visuell:**
```
┌─────────────────────────────────┐
│ [Kompost dunkler, leicht glitch]│
│                                 │
│  ┌──────────────────────────┐  │
│  │  GROSSES TEXTFELD        │  │
│  │  (60% Bildschirm)        │  │
│  │                          │  │
│  │  Nur Output,             │  │
│  │  kein Original mehr      │  │
│  └──────────────────────────┘  │
│                                 │
│  [KI-Parameter-Box]             │
│  🌀 Chaos-Grad                  │
│  🤖 KI-Modus                    │
│  🔥 Fragmentierung              │
│  [⚡ TRANSFORMIEREN]            │
└─────────────────────────────────┘
```

**KI-Parameter:**

#### 🌀 **Chaos-Grad** (0-100%)
- Bestimmt Anzahl Fragmente (10-60)
- Höher = mehr Material, chaotischer

#### 🤖 **KI-Modus** (Dropdown)
- **Verdichten:** Komprimiert Text (summarize)
- **Erweitern:** Generiert mehr aus weniger (expand)
- **Verfremden:** Macht es strange (alienate)
- **Halluzinieren:** KI träumt weiter (dream)

#### 🔥 **Fragmentierung** (0-100%)
- Wie stark Sätze zerschnitten werden
- 0% = Ganze Sätze
- 100% = Nur Hälften/Bruchstücke

**KI-Integration:**
- Groq API (wie in v10)
- Modell: llama-3.1-70b
- Temperatur variabel je nach Modus

**Metapher:** Fermentierung durch "fremde Organismen" (KI), weniger vorhersehbar

---

### LAYER 4: MYZEL-ÜBERFORDERUNG
**Konzept:** Unkontrollierbare Wucherung, totale Überforderung

**Visuell:**
```
┌─────────────────────────────────┐
│ [Kompost sehr dunkel, glitchend]│
│                                 │
│  TEXT TEXT TEXT TEXT TEXT TEXT │
│   TEXT TEXT TEXT TEXT TEXT TEXT│
│    TEXTTEXTTEXT TEXT TEXT TEXT │
│     TEXTTEXT TEXTTEXTTEXT TEXT │
│  TEXT TEXTTEXTTEXTTEXT TEXT    │
│   TEXTTEXTTEXT TEXTTEXTTEXT    │
│    TEXT TEXTTEXTTEXT TEXT TEXT │
│                                 │
│  ↑ Ganzer Textkörper wuchernd  │
│                                 │
│  [Seltsame Parameter - driften]│
│  🌀 Myzel-Dichte: 847.3%       │
│  🔮 Halluzination: ∞           │
│  🧬 Enzym-Chaos: [ALLE]        │
│  ⏱️ Zerfalls-Rate: 2.87x       │
│  🎲 Entropie: 94.2% ↑          │
└─────────────────────────────────┘
```

**Was passiert:**

**Phase 1 (Minute 1-2): KONTROLLE**
- User kann noch Parameter bedienen
- Ganzer Textkörper (219.560 Wörter) als Myzel dargestellt
- Übereinander, transparent, wuchernd
- Text halbwegs lesbar

**Phase 2 (Minute 2-5): DRIFT**
- Parameter beginnen sich selbst zu bewegen
- Werte machen keinen Sinn mehr
- Text wird unlesbarer
- Glitches nehmen zu

**Phase 3 (Minute 5-10): MUTATION**
- Text mutiert live
- Buchstaben verändern sich
- Neue "Wörter" entstehen
- KI halluziniert kontinuierlich

**Phase 4 (ab Minute 10): ZUSEHEN**
- User kann nichts mehr tun
- Nur noch beobachten
- Langsame, kontinuierliche Zersetzung
- **KEIN ENDE**
- Totale Überforderung

**Parameter (unkontrollierbar):**
- Regler driften automatisch
- Werte eskalieren
- Keine Möglichkeit zu stoppen
- Nur Beschleunigung möglich

**Technisch:**
- `setInterval()` für kontinuierliche Mutation
- Canvas oder CSS-Overlays für Myzel-Effekt
- Live-Text-Replacement
- Glitch-CSS-Animationen

**Metapher:** Totaler Kontrollverlust, Natur überwältigt, nur noch Beobachter

---

### LAYER 5: HUMUS (Optional/Später)
**Konzept:** Noch zu definieren

**Mögliche Richtungen:**
- Alle Generierungen übereinander (halbtransparent)
- Verdichtung zu "schwarzer Erde"
- Export-Funktion
- Neustart-Loop?

---

## 📊 DATENSTRUKTUR

### Kapitel (aus PDF)
```json
{
  "metadata": {
    "title": "Die fröhliche Abschaffung von Ostdeutschland",
    "total_pages": 512
  },
  "parts": [
    {
      "title": "Schlaflosigkeitsrevolver",
      "chapters": [
        {
          "id": 1,
          "number": 1,
          "title": "Die Abschlussfahrt",
          "page_start": 7,
          "page_end": 10,
          "content": "...",
          "word_count": 1965
        }
      ]
    }
  ]
}
```

**Gesamt:** 81 Kapitel, 219.560 Wörter

### Fragmente (Satz-Ebene)
```json
{
  "bio_id": 1,
  "source": "schlaflosigkeit_1",
  "content": "Es war die Zeit einer gründlichen Enttäuschung...",
  "zone": "II",
  "enzymes": ["#Noise", "#Resonanz"],
  "is_unkompostierbar": false,
  "length": 156,
  "word_count": 23
}
```

**Gesamt:** 11.327 Fragmente

---

## 🎨 DESIGN-PRINZIPIEN

### Farbpalette
```
Primär: #2ecc71 (Kompost-Grün)
Sekundär: #27ae60 (Dunkler Grün)
Akzent: #c0392b (Zersetzungs-Rot für Layer 4)
Hintergrund: #000000 bis #1a1a1a (Schwarz/Dunkel)
Text: #c4d4c4 bis #e8f8e8 (Grau-Grün)
```

### Typografie
```
Serif: Georgia (Buch-Text)
Sans: System-Font (UI)
Monospace: Courier (Code/Parameter)
```

### Animationen
- Atmung: 8s ease-in-out infinite (Kompost)
- Glitch: Zufällig, eskalierend (Layer 4)
- Fade: 1s (Layer-Übergänge)

### Responsive
- Desktop: Vollständige Erfahrung
- Mobile: Vereinfacht (später)

---

## 🚀 ENTWICKLUNGS-ROADMAP

### PHASE 1: FUNDAMENT (Jetzt)
- [x] PDF-Kapitel extrahiert (81 Kapitel)
- [x] Fragmente mit Enzymen (11.327)
- [x] Konzept definiert
- [ ] Layer 0-1 implementiert
- [ ] Buchcover integriert
- [ ] Vorwörter integriert

### PHASE 2: BIOLOGISCHE LAYER (Diese Woche)
- [ ] Layer 2: Split-View gebaut
- [ ] Biologische Parameter implementiert
- [ ] Generierungs-Algorithmus
- [ ] Testing & Tuning

### PHASE 3: KI-LAYER (Nächste Woche)
- [ ] Layer 3: KI-Integration
- [ ] Groq API verbunden
- [ ] Transformations-Modi
- [ ] Testing

### PHASE 4: CHAOS-LAYER (Später)
- [ ] Layer 4: Myzel-Effekte
- [ ] Auto-Drift Parameter
- [ ] Live-Mutation
- [ ] Glitch-Effekte

### PHASE 5: POLISH (Später)
- [ ] Layer 5 definieren & bauen
- [ ] Performance-Optimierung
- [ ] Mobile-Anpassung
- [ ] Deployment

---

## 🔧 TECHNISCHER STACK

### Frontend
```
- Pure HTML/CSS/JavaScript (keine Frameworks)
- CSS Grid & Flexbox
- Canvas API (für Myzel-Effekte)
- Fetch API (für KI)
```

### Backend/APIs
```
- Groq API (KI-Fermentierung)
- Keine Datenbank (alles client-side)
```

### Dateien
```
kompost-organism/
├── index.html
├── css/
│   └── layers.css (modular nach Layer)
├── js/
│   ├── layers.js (Navigation)
│   ├── book.js (Kapitel-Reader)
│   ├── generator.js (Bio-Parameter)
│   └── chaos.js (Layer 4 Effekte)
├── images/
│   ├── kompost_a.jpg (Startseite)
│   ├── kompost_b.jpg (Hintergrund)
│   └── buchcover_real.jpg
└── data/
    ├── chapters_from_pdf.json (81 Kapitel)
    └── fragments_processed.json (11.327 Fragmente)
```

---

## 🎯 ERFOLGS-KRITERIEN

### Funktional
- ✅ Alle 81 Kapitel lesbar
- ✅ Biologische Parameter funktionieren logisch
- ✅ KI-Transformation läuft stabil
- ✅ Layer 4 überfordert erfolgreich

### Ästhetisch
- ✅ Organisches, lebendes Design
- ✅ Smooth Übergänge zwischen Layern
- ✅ Lesbar aber auch chaotisch (je nach Layer)

### Konzeptionell
- ✅ Kompost-Ethik erlebbar gemacht
- ✅ Progressive Auflösung spürbar
- ✅ Kontrolle → Hingabe → Überforderung

---

## 📝 OFFENE FRAGEN

1. **Layer 5:** Was genau passiert dort?
2. **User-Upload:** Später Feature?
3. **Mobile:** Eigene Version oder angepasst?
4. **Performance:** Bei 219k Wörtern in Layer 4?
5. **Ende:** Loop oder Stillstand?

---

## 💚 PHILOSOPHISCHE ESSENZ

**Das Kompostwesen ist:**
- Ein lebendiges, sich selbst zersetzendes Buch
- Eine Meditation über Auflösung und Transformation
- Ein Experiment an den Grenzen von Lesbarkeit
- Eine Manifestation der Kompost-Ethik
- Ein digitaler Organismus

**Nicht:**
- Ein Generator-Tool
- Eine normale Website
- Ein statisches Archiv
- Vollständig kontrollierbar

---

**Version:** 1.0  
**Datum:** 2026-01-05  
**Status:** Konzept finalisiert, bereit für Entwicklung

---

*"Alles befindet sich in der Schwebe, kein Wort und keine Geste ist unmissverständlich."*
