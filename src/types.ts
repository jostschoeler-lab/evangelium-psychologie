// src/types.ts
export type Visibility = "draft" | "internal" | "public";

export interface BibleExegesis {
  key: "A" | "B";
  label: string;       // z.B. "A) Tradition/Verdrängung"
  body: string;        // freier text
  links?: string[];    // optionale links (kommagetrennt im formular)
}

export interface BibleEntry {
  id: string;          // z.B. "bibel.2petrus1.3-4"
  ref: string;         // "2. Petrus 1,3–4"
  title: string;       // "Teilnahme an göttlicher Natur"
  summary: string;     // kurz-zusammenfassung
  exegeses: BibleExegesis[]; // typischerweise 2 einträge (A, B)
}

export interface PsychEntry {
  id: string;          // z.B. "psych.grawe.bindung"
  term: string;        // "Bindung"
  synonyms: string[];  // ["Nähe","Sicherheit","Zugehörigkeit"]
  short: string;       // 1–2 sätze
  long?: string;       // vertiefung (optional)
  sources?: string;    // zitate/APA-kürzel (optional)
}

export interface Crosslink {
  id: string;          // "crosslink.bibel.2petrus1.3-4.psych.bindung"
  bibleId: string;     // referenz auf bible.id
  psychIds: string[];  // meist ein begriff, aber array erlaubt
  bridgeText: string;  // brückentext / hermeneutik
  tags: string[];      // z.B. ["Bedürfnis","Lust","Verwandlung"]
}

export interface UnifiedEntry {
  id: string;               // generische id (z.B. "unified.2025-10-03-123456")
  title: string;            // titel / thema
  bible: BibleEntry;
  psych: PsychEntry;        // für den start 1 hauptbegriff
  link: Crosslink;
  tags: string[];           // gemeinsame tags
  resources: string[];      // lieder, bilder, zitate... (kommagetrennt)
  visibility: Visibility;
  note?: string;

  createdAt: string;
  updatedAt: string;
}
