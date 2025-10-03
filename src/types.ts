// src/types.ts
export type Lang = "de" | "en" | "no";

export type Visibility = "draft" | "public";

export type Crosslink = {
  bibleRef: string;
  bibleView: string;     // theologische Auslegung
  psychView: string;     // psychologische Begriffe / Erklärung
  bridge: string;        // Brückentext (Theologie ↔ Psychologie)
  tags: string[];
  visibility: Visibility;
  note?: string;
};

export type UnifiedEntry = {
  id: string;
  title: string;
  summary?: string;
  cross: Crosslink;
  createdAt: number;
  updatedAt: number;
};
