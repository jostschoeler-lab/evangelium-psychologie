type Lang = "de" | "en" | "no";
const KEY = "nbj_lang_v1";

const messages: Record<Lang, Record<string, string>> = {
  de: {
    "app.title": "Not-Bedürfnis-Jesus",
    "app.subtitle": "Startergerüst (React + Vite + i18n).",

    "menu.uebung": "Übung (Start)",
    "menu.themen": "Themen",
    "menu.grundwissen": "Grundwissen",
    "menu.bibliothek": "Bibliothek",
    "menu.editor": "Ressourcen/Brücken (Editor)",
    "menu.journal": "Journal & Auswertung",
    "menu.settings": "Einstellungen",

    "editor.title": "Unified-Editor: Bibel + Psychologie + Crosslink",
    "editor.hint": "Hier erfasst du Vers-Auslegungen (mehrere), psychologische Begriffe und den Brückentext in EINER Maske.",
    "editor.fields.bible": "Bibelmodul (Referenz, Titel, Zusammenfassung, Auslegungen…)",
    "editor.fields.psych": "Psychologie-Modul (Begriff, Synonyme, Kurz/Lang…)",
    "editor.fields.bridge": "Crosslink (Brückentext, IDs, Sichtbarkeit…)",
    "editor.fields.tags": "Tags (Gefühl, Bedürfnis, Verhalten, Thema)",
    "editor.fields.visibility": "Sichtbarkeit (Entwurf/Öffentlich)",

    "footnote.localOnly": "Hinweis: Speicher zunächst lokal (localStorage). Cloud-Sync kann später ergänzt werden."
  },

  en: {
    "app.title": "Need-Crisis-Jesus",
    "app.subtitle": "Starter scaffold (React + Vite + i18n).",

    "menu.uebung": "Practice (Start)",
    "menu.themen": "Topics",
    "menu.grundwissen": "Knowledge",
    "menu.bibliothek": "Library",
    "menu.editor": "Resources/Bridges (Editor)",
    "menu.journal": "Journal & Review",
    "menu.settings": "Settings",

    "editor.title": "Unified Editor: Bible + Psychology + Crosslink",
    "editor.hint": "Capture multiple Bible interpretations, psychological terms and the bridge text in ONE mask.",
    "editor.fields.bible": "Bible module (reference, title, summary, interpretations…)",
    "editor.fields.psych": "Psychology module (term, synonyms, short/long…)",
    "editor.fields.bridge": "Crosslink (bridge text, IDs, visibility…)",
    "editor.fields.tags": "Tags (emotion, need, behavior, topic)",
    "editor.fields.visibility": "Visibility (draft/public)",

    "footnote.localOnly": "Note: Saved locally first (localStorage). Cloud sync can be added later."
  },

  no: {
    "app.title": "Nød-Behov-Jesus",
    "app.subtitle": "Startoppsett (React + Vite + i18n).",

    "menu.uebung": "Øvelse (Start)",
    "menu.themen": "Temaer",
    "menu.grundwissen": "Grunnkunnskap",
    "menu.bibliothek": "Bibliotek",
    "menu.editor": "Ressurser/Broer (Editor)",
    "menu.journal": "Journal & Evaluering",
    "menu.settings": "Innstillinger",

    "editor.title": "Enhetlig Editor: Bibel + Psykologi + Crosslink",
    "editor.hint": "Her registrerer du flere bibelutlegg, psykologiske begreper og bro-tekst i ÉN maske.",
    "editor.fields.bible": "Bibelmodul (referanse, tittel, sammendrag, utlegg…)",
    "editor.fields.psych": "Psykologimodul (begrep, synonymer, kort/lang…)",
    "editor.fields.bridge": "Crosslink (bro-tekst, IDer, synlighet…)",
    "editor.fields.tags": "Tags (følelse, behov, atferd, tema)",
    "editor.fields.visibility": "Synlighet (utkast/offentlig)",

    "footnote.localOnly": "Merk: Lagres først lokalt (localStorage). Cloud sync kan legges til senere."
  }
};

// 🔑 aktuelle Sprache aus localStorage lesen
let currentLang: Lang = (localStorage.getItem(KEY) as Lang) || "de";

// 🟢 Übersetzungsfunktion
export function t(key: string): string {
  return messages[currentLang][key] || key;
}

// 🔄 Sprache umschalten
export function switchLang(lang: Lang) {
  currentLang = lang;
  localStorage.setItem(KEY, lang);
  // App neu rendern
  window.location.reload();
}

// 📌 aktuell gesetzte Sprache zurückgeben
export function getLang(): Lang {
  return currentLang;
}

