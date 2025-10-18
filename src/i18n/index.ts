// src/i18n/index.ts
type Lang = "de" | "en" | "no";
const KEY = "nbj_lang_v1";

const messages: Record<Lang, Record<string, string>> = {
  de: {
    "app.title": "Not-Bedürfnis-Jesus",
    "app.subtitle": "Startergerüst (React + Vite + i18n).",
    "nav.home": "Start",
    "nav.editor": "Editor",

    "home.welcome": "Wähle oben „Editor“, um Inhalte zu erfassen.",

    "editor.title": "Crosslink Explorer (Bibel + Psych + Brücke)",
    "editor.hint": "Alle Felder werden lokal gespeichert (localStorage).",
    "editor.fields.bibleRef": "Bibelstelle(n)",
    "editor.fields.bibleView": "Theologische Auslegungen",
    "editor.fields.psych": "Psychologischer Begriff",
    "editor.fields.bridge": "Brückentext (Theologie ↔ Psychologie)",
    "editor.fields.tags": "Tags (mit Enter hinzufügen)",
    "editor.fields.visibility": "Sichtbarkeit",
    "editor.visibility.draft": "Entwurf (lokal)",
    "editor.visibility.public": "Öffentlich (später)",
    "editor.fields.note": "Notiz",
    "editor.placeholders.bibleView": "Kurzkommentar oder Auslegung …",
    "editor.placeholders.bridge": "Wie passt der psychologische Begriff zur Bibelstelle?",
    "editor.placeholders.tags": "z.B. ‚Trauer‘, ‚Bindung‘ …",
    "editor.placeholders.note": "Spätere Gedanken, To-dos …",
  },
  en: {
    "app.title": "Need-Crisis-Jesus",
    "app.subtitle": "Starter scaffold (React + Vite + i18n).",
    "nav.home": "Home",
    "nav.editor": "Editor",
    "home.welcome": "Choose “Editor” to start entering content.",
    "editor.title": "Crosslink Explorer (Bible + Psych + Bridge)",
    "editor.hint": "All fields are stored locally (localStorage).",
    "editor.fields.bibleRef": "Bible reference(s)",
    "editor.fields.bibleView": "Theological notes",
    "editor.fields.psych": "Psychological term",
    "editor.fields.bridge": "Bridge text (Theology ↔ Psychology)",
    "editor.fields.tags": "Tags (press Enter to add)",
    "editor.fields.visibility": "Visibility",
    "editor.visibility.draft": "Draft (local)",
    "editor.visibility.public": "Public (later)",
    "editor.fields.note": "Note",
    "editor.placeholders.bibleView": "Short commentary or exposition …",
    "editor.placeholders.bridge": "How does the psychological term relate to the passage?",
    "editor.placeholders.tags": "e.g. ‘grief’, ‘attachment’ …",
    "editor.placeholders.note": "Thoughts, to-dos …",
  },
  no: {
    "app.title": "Nød-Behov-Jesus",
    "app.subtitle": "Startoppsett (React + Vite + i18n).",
    "nav.home": "Start",
    "nav.editor": "Editor",
    "home.welcome": "Velg «Editor» for å begynne å registrere innhold.",
    "editor.title": "Crosslink Explorer (Bibel + Psyk + Bro)",
    "editor.hint": "Alle felt lagres lokalt (localStorage).",
    "editor.fields.bibleRef": "Bibelsted(er)",
    "editor.fields.bibleView": "Teologiske notater",
    "editor.fields.psych": "Psykologisk begrep",
    "editor.fields.bridge": "Bro-tekst (Teologi ↔ Psykologi)",
    "editor.fields.tags": "Tags (Enter for å legge til)",
    "editor.fields.visibility": "Synlighet",
    "editor.visibility.draft": "Utkast (lokalt)",
    "editor.visibility.public": "Offentlig (senere)",
    "editor.fields.note": "Notat",
    "editor.placeholders.bibleView": "Kort kommentar eller utleggelse …",
    "editor.placeholders.bridge": "Hvordan passer begrepet til bibelstedet?",
    "editor.placeholders.tags": "f.eks. ‘sorg’, ‘tilknytning’ …",
    "editor.placeholders.note": "Tanker, gjøremål …",
  },
};

export function switchLang(next: Lang) {
  localStorage.setItem(KEY, next);
  location.reload();
}

export function getLang(): Lang {
  return (localStorage.getItem(KEY) as Lang) || "de";
}

export function t(key: string): string {
  const L = getLang();
  return messages[L][key] ?? key;
}
