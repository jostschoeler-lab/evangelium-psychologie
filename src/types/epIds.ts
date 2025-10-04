// src/types/epIds.ts

// Sichtbarkeit
export type EpSichtbarkeit = "Entwurf" | "Öffentlich" | "lokal";

// Meta-Informationen
export interface EpMeta {
  createdAt: string;  // ISO
  updatedAt: string;  // ISO
  version: number;    // Schema-Version Phase 1 = 1
}

// Bibelstelle
export interface EpBibelstelle {
  id: string;                // "B_*"
  ref: string;               // z.B. "Johannes 3,16"
  theologischeAuslegung: string;
  theologischeHintergruende?: string;  // optional, lang
}

// Psychologie
export interface EpPsychologie {
  id: string;                 // "P_*"
  begriff: string;            // z.B. "Bindung"
  erklaerungKurz: string;
  psychologischeHintergruende?: string; // optional, lang
}

// Brücke
export interface EpBruecke {
  id: string;    // "L_*"
  text: string;  // der eigentliche Brückentext
  tags: string[];
}

// Eintrag
export interface EpEintrag {
  id: string;                 // "E_*"
  bibelstelle: EpBibelstelle;
  psychologie: EpPsychologie;
  bruecke: EpBruecke;
  sichtbarkeit: EpSichtbarkeit;
  notiz: string;
  meta: EpMeta;
}

export type EpEintraege = EpEintrag[];

// ------------------------------------------------------------
// ID-Generator-Funktionen (das war bisher der fehlende Teil)
// ------------------------------------------------------------

const r = () => Math.random().toString(36).slice(2, 8);
const ts = () => new Date().toISOString().replace(/[-:.TZ]/g, "");

export const epNewE = () => `E_${ts()}_${r()}`;
export const epNewB = () => `B_${r()}_${r()}`;
export const epNewP = () => `P_${r()}_${r()}`;
export const epNewL = () => `L_${r()}_${r()}`;
