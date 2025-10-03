type Lang = "de" | "en" | "no";
const KEY = "nbj_lang_v1";

const messages: Record<Lang, Record<string, string>> = {
  de: {
    "app.title": "Not-Bedürfnis-Jesus",
    "app.subtitle": "Startgerüst (React + Vite + i18n).",

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

    "editor.title": "Unified Editor: Bible + Psychology + Bridge",
    "editor.hint": "Enter Bible readings (multiple), psychology terms and the bridge text in ONE form.",
    "editor.fields.bible": "Bible module (reference, title, summary, exegeses…)",
    "editor.fields.psych": "Psych module (term, synonyms, short/long…)",
    "editor.fields.bridge": "Crosslink (bridge text, IDs, visibility…)",
    "editor.fields.tags": "Tags (feeling, need, behavior, domain)",
    "editor.fields.visibility": "Visibility (Draft/Public)",

    "footnote.localOnly": "Note: Stored locally first (localStorage). Cloud sync can be added later."
  },
  no: {
    "app.title": "Nød-Behov-Jesus",
    "app.subtitle": "Startoppsett (React + Vite + i18n).",

    "menu.uebung": "Øvelse (Start)",
    "menu.themen": "Temaer",
    "menu.grundwissen": "Grunnkunnskap",
    "menu.bibliothek": "Bibliotek",
    "menu.editor": "Ressurser/Broer (Editor)",
    "menu.journal": "Journal & Analyse",
    "menu.settings": "Innstillinger",

    "editor.title": "Unified-editor: Bibel + Psykologi + Bro",
    "editor.hint": "Her registrerer du bibeltolkninger (flere), psykologibegrep og bro-tekst i ETT skjema.",
    "editor.fields.bible": "Bibel-modul (referanse, tittel, sammendrag, tolkninger…)",
    "editor.fields.psych": "Psykologi-modul (begrep, synonymer, kort/lang…)",
    "editor.fields.bridge": "Bro (bro-tekst, IDer, synlighet…)",
    "editor.fields.tags": "Tagger (følelse, behov, atferd, tema)",
    "editor.fields.visibility": "Synlighet (Utkast/Offentlig)",

    "footnote.localOnly": "Merk: Lagrer lokalt først (localStorage). Sky-synk kan legges til senere."
  }
};

let current: Lang = (localStorage.getItem(KEY) as Lang) || "de";
export function setLang(next: Lang) { current = next; localStorage.setItem(KEY, next); }
export function getLang(): Lang { return current; }
export function t(key: string): string { return messages[current][key] ?? key; }
